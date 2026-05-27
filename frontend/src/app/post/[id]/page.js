"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { api, normalizePost } from "@/lib/api";
import { pins } from "@/data/pins";

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const auth = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const fallback = useMemo(() => pins.find((pin) => pin._id === id), [id]);
  const normalized = post ? normalizePost(post) : fallback ? normalizePost(fallback) : null;

  useEffect(() => {
    if (!id?.startsWith("seed-")) {
      api(`/posts/${id}`).then(setPost).catch(() => setPost(null));
    }
  }, [id]);

  async function protectedAction(path, options = {}) {
    if (!auth?.user) {
      router.push("/login");
      return;
    }
    try {
      setPost(await api(path, options));
    } catch (err) {
      setError(err.message);
    }
  }

  async function addComment(event) {
    event.preventDefault();
    if (!comment.trim()) return;
    await protectedAction(`/posts/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ text: comment }),
    });
    setComment("");
  }

  if (!normalized) {
    return (
      <div className="min-h-screen bg-[#fbfaf8]">
        <Navbar compact />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-3xl font-bold">Post not found</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-zinc-950">
      <Navbar compact />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
        <section className="overflow-hidden rounded-[1.35rem] border border-stone-200 bg-white shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={normalized.image} alt={normalized.title} className="max-h-[78vh] w-full object-cover" />
        </section>

        <aside className="rounded-[1.35rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-zinc-700">{normalized.category}</span>
            <span className="text-sm text-zinc-500">{normalized.viewCount || 0} views</span>
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">{normalized.title}</h1>
          <p className="mt-3 leading-7 text-zinc-600">{normalized.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-full bg-zinc-950 text-sm font-bold text-white">
              {normalized.author?.charAt(0) || "P"}
            </div>
            <div>
              <p className="font-semibold">{normalized.author}</p>
              <p className="text-sm text-zinc-500">Creator</p>
            </div>
          </div>

          <div className="mt-7 flex gap-3">
            <button onClick={() => protectedAction(`/posts/${id}/save`, { method: "PATCH" })} className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
              Save
            </button>
            <button onClick={() => protectedAction(`/posts/${id}/like`, { method: "PATCH" })} className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-stone-200">
              Like {normalized.likes?.length || 0}
            </button>
          </div>

          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

          <section className="mt-8 border-t border-stone-200 pt-6">
            <h2 className="text-lg font-bold">Comments</h2>
            <div className="mt-4 space-y-3">
              {(normalized.comments || []).length ? (
                normalized.comments.map((item, index) => (
                  <div key={item._id || index} className="rounded-2xl bg-stone-50 px-4 py-3">
                    <p className="text-sm font-semibold">{item.user?.name || "Member"}</p>
                    <p className="text-sm text-zinc-600">{item.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">No comments yet.</p>
              )}
            </div>
            <form onSubmit={addComment} className="mt-4 flex gap-2">
              <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a comment" className="h-11 flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 text-sm outline-none focus:ring-4 focus:ring-red-100" />
              <button className="rounded-full bg-zinc-950 px-4 text-sm font-semibold text-white">Post</button>
            </form>
          </section>
        </aside>
      </main>
    </div>
  );
}
