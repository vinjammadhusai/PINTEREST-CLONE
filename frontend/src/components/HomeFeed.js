"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import PinCard from "@/components/PinCard";
import { api } from "@/lib/api";
import { categories, pins } from "@/data/pins";

export default function HomeFeed() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [remotePosts, setRemotePosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiReady, setApiReady] = useState(true);

  const filteredSeedPins = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pins.filter((pin) => {
      const categoryMatch = category === "All" || pin.category === category;
      const searchMatch =
        !term ||
        [pin.title, pin.description, pin.category, ...(pin.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(term);
      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  const posts = remotePosts.length ? remotePosts : filteredSeedPins;

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: "1",
          limit: "12",
          search,
          category,
        });
        const data = await api(`/posts?${params.toString()}`);
        if (!ignore) {
          setRemotePosts(data.posts || []);
          setHasMore(Boolean(data.hasMore));
          setPage(1);
          setApiReady(true);
        }
      } catch {
        if (!ignore) {
          setRemotePosts([]);
          setApiReady(false);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    const timeout = setTimeout(loadPosts, 250);
    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [category, search]);

  async function loadMore() {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: "12",
        search,
        category,
      });
      const data = await api(`/posts?${params.toString()}`);
      setRemotePosts((current) => [...current, ...(data.posts || [])]);
      setHasMore(Boolean(data.hasMore));
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-zinc-950">
      <Navbar search={search} onSearch={setSearch} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
              Explore ideas
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
              Discover, save, and organize visual inspiration.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600">
              A full stack Pinterest-style experience with auth, upload-ready posts,
              search, categories, profiles, likes, saves, and comments.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-[1.35rem] border border-stone-200 bg-white p-4 shadow-sm">
            <Stat value={posts.length} label="Pins" />
            <Stat value={categories.length - 1} label="Categories" />
            <Stat value={apiReady ? "Live" : "Demo"} label="API" />
          </div>
        </section>

        <section className="mb-7 flex gap-2 overflow-x-auto pb-2" aria-label="Category filters">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item
                  ? "bg-zinc-950 text-white"
                  : "bg-white text-zinc-700 ring-1 ring-stone-200 hover:bg-stone-100"
              }`}
            >
              {item}
            </button>
          ))}
        </section>

        <section aria-label="Image inspiration feed" className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {posts.map((pin) => (
            <PinCard key={pin._id || pin.id} pin={pin} />
          ))}
        </section>

        <div className="flex justify-center py-8">
          {hasMore ? (
            <button onClick={loadMore} className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700">
              {loading ? "Loading..." : "Load more"}
            </button>
          ) : (
            <p className="text-sm text-zinc-500">{loading ? "Loading feed..." : "You are caught up."}</p>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-2xl font-bold text-zinc-950">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
    </div>
  );
}
