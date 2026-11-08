"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Money } from "@/core/domain/models";

export interface BrowserCartLine {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  moq: number;
  increment: number;
  unitPrice: Money;
  imageUrl: string;
}

interface CartState {
  lines: BrowserCartLine[];
  addLine: (line: BrowserCartLine) => void;
  removeLine: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (line) => set((state) => {
        const existing = state.lines.find((item) => item.productId === line.productId);
        if (!existing) return { lines: [...state.lines, line] };
        return {
          lines: state.lines.map((item) => item.productId === line.productId
            ? { ...item, quantity: item.quantity + line.quantity }
            : item),
        };
      }),
      removeLine: (productId) => set((state) => ({ lines: state.lines.filter((line) => line.productId !== productId) })),
      setQuantity: (productId, quantity) => set((state) => ({
        lines: state.lines.map((line) => line.productId === productId
          ? { ...line, quantity: Math.max(line.moq, quantity) }
          : line),
      })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "vistula-store-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
