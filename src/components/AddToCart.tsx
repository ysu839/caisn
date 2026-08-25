"use client";

import { useState } from "react";
import { Product, Variant } from "@/lib/commerce/types";
import { useCart } from "@/lib/cart/CartContext";
import { useMagnetic } from "@/lib/motion/useMagnetic";
import { CursorTarget } from "@/lib/motion/CustomCursor";

export function AddToCart({ product, variant }: { product: Product; variant: Variant }) {
  const { addItem } = useCart();
  const ref = useMagnetic<HTMLButtonElement>();
  const [justAdded, setJustAdded] = useState(false);

  const soldOut = variant.stock === 0;

  const handleClick = () => {
    if (soldOut) return;
    addItem(product, variant);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <CursorTarget label={soldOut ? "" : "ADD"}>
      <button
        ref={ref}
        onClick={handleClick}
        disabled={soldOut}
        className="w-full rounded-[var(--radius)] border border-[var(--color-fg)] px-6 py-4 text-xs font-medium tracking-[0.15em] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          transitionDuration: "var(--dur-snap)",
          backgroundColor: justAdded ? "var(--color-accent)" : "transparent",
          borderColor: justAdded ? "var(--color-accent)" : "var(--color-fg)",
          color: justAdded ? "var(--paper)" : "var(--color-fg)",
        }}
      >
        {soldOut ? "SOLD OUT" : justAdded ? "ADDED" : "ADD TO CART"}
      </button>
    </CursorTarget>
  );
}
