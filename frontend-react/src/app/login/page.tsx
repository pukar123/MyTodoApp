"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useIsAuthenticated } from "@/store/auth-store";
import { toLoginErrorMessage } from "@/lib/errors";
import { Alert } from "@/components/Alert";
import { FullScreenLoader, Spinner } from "@/components/Spinner";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ username: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/todos");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <FullScreenLoader message="Redirecting…" />;
  }

  const usernameInvalid = touched.username && username.trim().length === 0;
  const passwordInvalid = touched.password && password.length === 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ username: true, password: true });

    if (username.trim().length === 0 || password.length === 0) {
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await login(username.trim(), password);
      router.replace("/todos");
    } catch (error) {
      setSubmitting(false);
      setErrorMessage(toLoginErrorMessage(error));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <section
        aria-labelledby="login-heading"
        className="animate-in w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <header className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
            ✓
          </div>
          <h1 id="login-heading" className="text-2xl font-semibold text-white">
            Todo App
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to manage your tasks
          </p>
        </header>

        {errorMessage ? (
          <div className="mb-5">
            <Alert variant="error">{errorMessage}</Alert>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Username
            </label>
            <input
              id="username"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              aria-invalid={usernameInvalid}
              className={`w-full rounded-xl border bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:ring-2 ${
                usernameInvalid
                  ? "border-rose-400/60 focus:ring-rose-400/30"
                  : "border-white/10 focus:border-indigo-400/60 focus:ring-indigo-400/30"
              }`}
            />
            {usernameInvalid ? (
              <p className="mt-1.5 text-xs text-rose-300">
                Username is required.
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              aria-invalid={passwordInvalid}
              className={`w-full rounded-xl border bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:ring-2 ${
                passwordInvalid
                  ? "border-rose-400/60 focus:ring-rose-400/30"
                  : "border-white/10 focus:border-indigo-400/60 focus:ring-indigo-400/30"
              }`}
            />
            {passwordInvalid ? (
              <p className="mt-1.5 text-xs text-rose-300">
                Password is required.
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Spinner className="h-4 w-4" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <aside className="mt-6 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-xs text-slate-400">
          <strong className="text-slate-300">Demo credentials</strong>
          <p className="mt-1.5">
            Username:{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-slate-200">
              demo@todo.local
            </code>
          </p>
          <p className="mt-1">
            Password:{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-slate-200">
              Demo123!
            </code>
          </p>
        </aside>
      </section>
    </main>
  );
}
