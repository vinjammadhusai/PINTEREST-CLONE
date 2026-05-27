"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const auth = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await api(`/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      auth.signIn(session);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#fbfaf8] lg:grid-cols-[1fr_0.95fr]">
      <section className="flex items-center justify-center px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-md rounded-[1.35rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xl font-bold text-zinc-950">
            <span className="grid size-10 place-items-center rounded-full bg-red-600 text-white">P</span>
            Pinspire
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {isRegister ? "Start saving ideas and publishing your own visual boards." : "Log in to save, like, comment, and upload posts."}
          </p>

          <div className="mt-8 space-y-4">
            {isRegister && (
              <Field label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
            )}
            <Field label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
            <Field label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
          </div>

          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

          <button disabled={loading} className="mt-6 w-full rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300">
            {loading ? "Please wait..." : isRegister ? "Create account" : "Login"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-600">
            {isRegister ? "Already have an account?" : "New to Pinspire?"}{" "}
            <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-red-600">
              {isRegister ? "Login" : "Register"}
            </Link>
          </p>
        </form>
      </section>

      <section className="hidden min-h-screen overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
          alt="Creative interior moodboard"
          width={1200}
          height={1600}
          priority
          className="h-full w-full object-cover"
        />
      </section>
    </main>
  );
}

function Field({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none transition focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-100"
      />
    </label>
  );
}
