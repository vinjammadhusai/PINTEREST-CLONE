import Link from "next/link";
import { normalizePost } from "@/lib/api";

const heightClasses = {
  short: "h-64",
  medium: "h-80",
  tall: "h-96",
};

export default function PinCard({ pin }) {
  const normalized = normalizePost(pin);

  return (
    <article className="group mb-5 break-inside-avoid overflow-hidden rounded-[1.35rem] bg-white shadow-sm ring-1 ring-stone-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/post/${normalized.id}`} className={`relative block overflow-hidden ${heightClasses[normalized.height] || heightClasses.medium}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={normalized.image}
          alt={normalized.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <button className="absolute right-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-lg transition duration-300 hover:bg-red-700 group-hover:opacity-100">
          Save
        </button>
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 opacity-0 backdrop-blur transition group-hover:opacity-100">
          {normalized.category}
        </span>
      </Link>

      <div className="space-y-2 p-4">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-zinc-950">
          {normalized.title}
        </h2>
        <div className="flex items-center justify-between gap-3 text-sm text-zinc-500">
          <p>by {normalized.author}</p>
          <p>{normalized.saves?.length || 0} saves</p>
        </div>
      </div>
    </article>
  );
}
