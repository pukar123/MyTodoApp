"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

/**
 * Triggers Zustand persist rehydration on the client only. The auth store uses
 * `skipHydration` so the server render and the first client render agree; this
 * component reads sessionStorage once mounted.
 */
export function StoreHydration() {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
