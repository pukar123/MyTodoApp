"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function TopBar() {
  const username = useAuthStore((state) => state.session?.username ?? "");
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const initial = username.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#060815]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white shadow-md shadow-indigo-500/30">
            ✓
          </span>
          <span className="text-base font-semibold text-white">Todo App</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-slate-200">
              {initial}
            </span>
            <span
              title={`Signed in as ${username}`}
              className="max-w-[8rem] truncate text-sm text-slate-300 sm:max-w-[14rem]"
            >
              {username}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
