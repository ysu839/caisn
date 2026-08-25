"use client";

import { useEffect, useState } from "react";
import { Product, Variant } from "@/lib/commerce/types";
import { AnimatedPrice } from "@/components/AnimatedPrice";
import { AddToCart } from "@/components/AddToCart";

/**
 * Keeps the purchase path reachable once the primary CTA scrolls out
 * of view — the experimental layers (3D, exploded sequence) sit
 * between the hero and the rest of the page, so this is what keeps
 * "add to cart" from ever being genuinely lost on a long PDP scroll.
 */
export function StickyAddToCart({ product, variant }: { product: Product; variant: Variant }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const primary = document.getElementById("primary-add-to-cart");
    if (!primary) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px", // account for the fixed nav height
    });
    observer.observe(primary);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-line)] bg-[var(--color-bg)] px-[var(--gutter)] py-3 transition-transform duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transitionTimingFunction: "var(--ease-snap)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold">{product.name}</p>
          <AnimatedPrice value={product.price} className="text-xs text-[var(--color-fg-soft)]" />
        </div>
        <div className="w-40 shrink-0 sm:w-48">
          <AddToCart product={product} variant={variant} />
        </div>
      </div>
    </div>
  );
}
