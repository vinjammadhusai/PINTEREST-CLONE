"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar({ search = "", onSearch, compact = false }) {
  const auth = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-full bg-red-600 text-lg font-bold text-white shadow-sm">
            P
          </span>
          <span className="hidden text-xl font-bold tracking-tight text-zinc-950 sm:inline">
            Pinspire
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/" className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
            Home
          </Link>
          <Link href="/upload" className="rounded-full px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-stone-100">
            Create
          </Link>
        </div>

        <form className={`relative flex flex-1 items-center ${compact ? "max-w-2xl" : ""}`} onSubmit={(event) => event.preventDefault()}>
          <span className="pointer-events-none absolute left-4 text-zinc-400">
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.1-5.4a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
              />
            </svg>
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch?.(event.target.value)}
            placeholder="Search for interiors, recipes, outfits..."
            className="h-12 w-full rounded-full border border-transparent bg-stone-100 pl-12 pr-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-500 hover:bg-stone-200 focus:border-stone-300 focus:bg-white focus:ring-4 focus:ring-red-100"
          />
        </form>

        <div className="flex items-center gap-2">
          {auth?.user ? (
            <>
              <Link href={`/profile/${auth.user.id}`} className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-stone-100 sm:inline-flex">
                Profile
              </Link>
              <button onClick={auth.signOut} className="rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-stone-100 sm:inline-flex">
                Login
              </Link>
              <Link href="/register" className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
