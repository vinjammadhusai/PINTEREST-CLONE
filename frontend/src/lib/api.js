const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getStoredSession = () => {
  if (typeof window === "undefined") return { user: null, token: "" };
  return {
    user: JSON.parse(localStorage.getItem("pinspire_user") || "null"),
    token: localStorage.getItem("pinspire_token") || "",
  };
};

export const storeSession = ({ user, token }) => {
  localStorage.setItem("pinspire_user", JSON.stringify(user));
  localStorage.setItem("pinspire_token", token);
};

export const clearSession = () => {
  localStorage.removeItem("pinspire_user");
  localStorage.removeItem("pinspire_token");
};

export async function api(path, options = {}) {
  const { token } = getStoredSession();
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const normalizePost = (post) => ({
  ...post,
  id: post._id || post.id,
  image: post.imageUrl || post.image,
  author: post.owner?.name || post.author || "Pinspire creator",
});
