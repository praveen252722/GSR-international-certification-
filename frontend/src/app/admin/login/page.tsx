"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [sessionMsg, setSessionMsg] = useState("");

  useEffect(() => {
    const msg = localStorage.getItem("sessionMessage");
    if (msg) {
      setSessionMsg(msg);
      localStorage.removeItem("sessionMessage");
    }
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.replace("/admin");
    }
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSessionMsg("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const username = String(data.get("username"));
    const password = String(data.get("password"));

    try {
      console.log("[Login] Attempting login with endpoint:", `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/login`);
      const response = await adminApi.login({ username, password, rememberMe });
      localStorage.setItem("adminToken", response.token);
      localStorage.setItem("adminRefreshToken", response.refreshToken);
      localStorage.setItem("adminUser", JSON.stringify(response.admin));
      router.replace("/admin");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="brand-surface grid min-h-screen place-items-center p-4 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded bg-white p-8 text-ink shadow-soft">
        <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-white shadow-soft">
          <img src="/gsr-logo.png" alt="GSR logo" className="h-14 w-14 object-contain" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold">Admin Login</h1>

        {sessionMsg && (
          <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            {sessionMsg}
          </div>
        )}

        <div className="mt-8 grid gap-4">
          <input className="focus-ring rounded border border-ink/10 px-4 py-3" name="username" placeholder="Username" required />
          <input className="focus-ring rounded border border-ink/10 px-4 py-3" name="password" placeholder="Password" type="password" required />
          <label className="flex items-center gap-2 text-sm text-graphite/70">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-ink/20"
            />
            Remember Me
          </label>
          <button disabled={busy} className="rounded bg-moss px-5 py-4 font-semibold text-white transition hover:bg-ink disabled:opacity-60">
            {busy ? "Signing in..." : "Sign In"}
          </button>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        </div>
      </form>
    </main>
  );
}
