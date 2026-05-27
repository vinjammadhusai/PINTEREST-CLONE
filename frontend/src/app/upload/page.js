"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import { categories } from "@/data/pins";

export default function UploadPage() {
  const router = useRouter();
  const auth = useAuth();
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Design",
    tags: "",
    imageUrl: "",
  });

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!auth?.user) {
      router.push("/login");
      return;
    }

    const data = new FormData(event.currentTarget);
    setLoading(true);

    try {
      const post = await api("/posts", { method: "POST", body: data });
      router.push(`/post/${post._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-zinc-950">
      <Navbar compact />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:px-8">
        <section className="rounded-[1.35rem] border border-stone-200 bg-white p-5 shadow-sm">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
            {preview || form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview || form.imageUrl} alt="Upload preview" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center px-8 text-center text-sm font-medium text-zinc-500">
                Select an image file or paste an image URL to preview your pin.
              </div>
            )}
          </div>
        </section>

        <form onSubmit={submit} className="rounded-[1.35rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Create pin</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Upload a new idea</h1>

          <div className="mt-8 grid gap-4">
            <Field label="Title" name="title" value={form.title} onChange={(title) => setForm({ ...form, title })} />
            <label className="block">
              <span className="text-sm font-semibold text-zinc-800">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows="4"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-800">Category</span>
              <select name="category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none focus:ring-4 focus:ring-red-100">
                {categories.filter((item) => item !== "All").map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <Field label="Tags" name="tags" value={form.tags} onChange={(tags) => setForm({ ...form, tags })} placeholder="workspace, minimal, home" />
            <Field label="Image URL" name="imageUrl" value={form.imageUrl} onChange={(imageUrl) => setForm({ ...form, imageUrl })} />
            <label className="block">
              <span className="text-sm font-semibold text-zinc-800">Image file</span>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setPreview(URL.createObjectURL(file));
                }}
                className="mt-2 block w-full rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-4 text-sm"
              />
            </label>
          </div>

          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

          <button disabled={loading} className="mt-6 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:bg-red-300">
            {loading ? "Publishing..." : "Publish pin"}
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <input
        required={label === "Title"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none transition focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-100"
        {...props}
      />
    </label>
  );
}
