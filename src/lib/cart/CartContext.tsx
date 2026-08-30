"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Product, Variant } from "@/lib/commerce/types";
import { getProductBySlug } from "@/lib/commerce/data";

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
  removeItem: (productId: string, color: string, size: string) => void;
  setQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "caisn-cart-v1";

// Persisted shape stores only the product slug + variant, not the full
// Product object (which can change shape between deploys) — full lines
// are rehydrated against the live catalog on load, so a cart entry for
// a product that's since been hidden/removed is dropped rather than
// resurrected with stale data.
type StoredLine = { slug: string; color: string; size: string; quantity: number };

function readStoredLines(): StoredLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  // Rehydrate against the live catalog on mount (client-only — cart
  // content is per-browser and never needs to exist during SSR).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = readStoredLines();
      if (stored.length === 0) {
        hydrated.current = true;
        return;
      }
      const resolved: CartLine[] = [];
      for (const s of stored) {
        const product = await getProductBySlug(s.slug);
        const variant = product?.variants.find((v) => v.color === s.color && v.size === s.size);
        if (product && variant) resolved.push({ product, variant, quantity: s.quantity });
      }
      if (!cancelled) {
        setLines(resolved);
        hydrated.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on every change, but only once initial hydration has run —
  // otherwise the empty initial state would overwrite a real stored
  // cart before rehydration gets a chance to read it.
  useEffect(() => {
    if (!hydrated.current) return;
    const toStore: StoredLine[] = lines.map((l) => ({
      slug: l.product.slug,
      color: l.variant.color,
      size: l.variant.size,
      quantity: l.quantity,
    }));
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch {
      // Storage can fail (quota, private mode) — the cart still works
      // for the session, it just won't survive a refresh.
    }
  }, [lines]);

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

  const removeItem = (productId: string, color: string, size: string) => {
    setLines((prev) => prev.filter((l) => !(l.product.id === productId && l.variant.color === color && l.variant.size === size)));
  };

  const setQuantity = (productId: string, color: string, size: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) {
        return prev.filter((l) => !(l.product.id === productId && l.variant.color === color && l.variant.size === size));
      }
      return prev.map((l) =>
        l.product.id === productId && l.variant.color === color && l.variant.size === size ? { ...l, quantity } : l
      );
    });
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
      removeItem,
      setQuantity,
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
