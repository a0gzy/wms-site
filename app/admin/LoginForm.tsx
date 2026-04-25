"use client";

import { useState } from "react";

export function LoginForm() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? "login failed");
        return;
      }
      window.location.reload();
    } catch (err) {
      setError(String(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-neutral-800 bg-panel p-6">
      <label className="mb-2 block text-sm text-neutral-300" htmlFor="secret">
        Admin secret
      </label>
      <input
        id="secret"
        type="password"
        autoComplete="off"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 font-mono text-sm focus:border-accent focus:outline-none"
      />
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={pending || secret === ""}
        className="mt-4 w-full rounded bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-40"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
