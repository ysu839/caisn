"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Product, Variant } from "@/lib/commerce/types";

export type CartLine = {
  product: Product;
  variant: Variant;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (product: Product, variant: Variant) => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: Product, variant: Variant) => {
    setLines((prev) => {
      const idx = prev.findIndex(
        (l) => l.product.id === product.id && l.variant.color === variant.color && l.variant.size === variant.size
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    // AddToCart refuses to add a pending-price item, so this is a
    // defensive fallback (0), not an expected runtime case.
    const total = lines.reduce((s, l) => s + (l.product.price ?? 0) * l.quantity, 0);
    return {
      lines,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addItem,
      count,
      total,
    };
  }, [lines, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
