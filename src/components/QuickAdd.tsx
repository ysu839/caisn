"use client";

import { useState } from "react";
import { Product } from "@/lib/commerce/types";
import { useCart } from "@/lib/cart/CartContext";

/**
 * Circular "+" quick-add control for a product-grid card. Clicking it
 * never adds a default size — it reveals a compact size strip (still
 * requiring an explicit choice, same rule as the PDP) rather than
 * guessing the shopper's size from the first variant in the array.
 */
export function QuickAdd({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const pricePending = product.price === null;
  const sizes = Array.from(new Map(product.variants.map((v) => [v.size, v])).values());

  if (pricePending) return null;

  return (
    <div
      className="absolute bottom-3 right-3 z-10"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {!open ? (
        <button
          type="button"
          aria-label={`Quick add ${product.name}`}
          onClick={() => setOpen(true)}
          // Visible by default (touch has no hover to reveal it on) —
          // only hover-capable pointers get the hidden-until-hover
          // treatment, so it's never an invisible-but-tappable control.
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-fg)] text-[var(--color-bg)] opacity-100 shadow-md transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
          style={{ transitionDuration: "var(--dur-snap)" }}
        >
          <span aria-hidden className="text-lg leading-none">
            +
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-1 rounded-full bg-[var(--color-bg)] p-1 shadow-lg ring-1 ring-[var(--color-line)]">
          {added ? (
            <span className="px-3 py-1.5 text-[10px] tracking-[0.1em] text-[var(--color-accent)]">ADDED</span>
          ) : (
            sizes.map((v) => (
              <button
                key={v.size}
                type="button"
                disabled={v.stock === 0}
                onClick={() => {
                  addItem(product, v);
                  setAdded(true);
                  setTimeout(() => {
                    setAdded(false);
                    setOpen(false);
                  }, 700);
                }}
                className="tnum min-h-8 min-w-8 rounded-full px-2 text-[10px] transition-colors hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-30"
                style={{ transitionDuration: "var(--dur-snap)" }}
              >
                {v.size}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
