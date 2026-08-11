"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuthStore, useIsAuthenticated } from "@/store/auth-store";
import { FullScreenLoader } from "@/components/Spinner";

/**
 * Client-side route guard. Waits for the persisted session to rehydrate, then
 * redirects unauthenticated visitors to /login. Mirrors the Angular authGuard.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <FullScreenLoader message="Redirecting to sign in…" />;
  }

  return <>{children}</>;
}
