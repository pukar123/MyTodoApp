"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as api from "@/lib/api-client";
import { configureApiClient } from "@/lib/api-client";
import type { Session } from "@/lib/types";

const STORAGE_KEY = "todoapp.session";

interface AuthState {
  session: Session | null;
  hasHydrated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hasHydrated: false,
      login: async (username, password) => {
        const session = await api.login(username, password);
        set({ session });
      },
      logout: () => set({ session: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.sessionStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({ session: state.session }),
      // Hydration is deferred to a client effect so the server-rendered markup
      // matches the client's first paint, avoiding a hydration mismatch.
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

/** Selector hook: true when a session is present. */
export const useIsAuthenticated = (): boolean =>
  useAuthStore((state) => state.session !== null);

configureApiClient({
  getToken: () => useAuthStore.getState().session?.token ?? null,
  onUnauthorized: () => useAuthStore.getState().logout(),
});
