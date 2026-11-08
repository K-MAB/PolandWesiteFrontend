"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SessionState {
  mode: "admin" | "customer" | null;
  email: string | null;
  signIn: (mode: "admin" | "customer", email: string) => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionState>()(persist(
  (set) => ({
    mode: null,
    email: null,
    signIn: (mode, email) => set({ mode, email }),
    signOut: () => set({ mode: null, email: null }),
  }),
  { name: "vistula-demo-session", storage: createJSONStorage(() => localStorage) },
));
