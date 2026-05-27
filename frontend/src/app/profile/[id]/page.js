"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PinCard from "@/components/PinCard";
import { api } from "@/lib/api";
import { pins } from "@/data/pins";

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const demoUser = {
    name: "Pinspire Creator",
    bio: "Curating sharp ideas across interiors, food, fashion, and design.",
    posts: pins.slice(0, 6),
    savedPosts: pins.slice(6, 12),
  };

  useEffect(() => {
    api(`/users/${id}`).then(setProfile).catch(() => setProfile(null));
  }, [id]);

  const user = profile?.user || demoUser;
  const posts = profile?.posts?.length ? profile.posts : demoUser.posts;
  const savedPosts = profile?.savedPosts?.length ? profile.savedPosts : demoUser.savedPosts;

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-zinc-950">
      <Navbar compact />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[1.35rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-20 place-items-center rounded-full bg-zinc-950 text-3xl font-bold text-white">
                {user.name?.charAt(0) || "P"}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{user.bio || demoUser.bio}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <Stat value={posts.length} label="Created" />
              <Stat value={savedPosts.length} label="Saved" />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold tracking-tight">Created pins</h2>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {posts.map((pin) => (
              <PinCard key={pin._id || pin.id} pin={pin} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold tracking-tight">Saved ideas</h2>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {savedPosts.map((pin) => (
              <PinCard key={pin._id || pin.id} pin={pin} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl bg-stone-100 px-5 py-3">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
    </div>
  );
}
