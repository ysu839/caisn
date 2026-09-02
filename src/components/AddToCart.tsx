"use client";

import { useState } from "react";
import { Product, Variant } from "@/lib/commerce/types";
import { useCart } from "@/lib/cart/CartContext";
import { useMagnetic } from "@/lib/motion/useMagnetic";
import { CursorTarget } from "@/lib/motion/CustomCursor";

/**
 * `variant` is null until the shopper explicitly picks a size — see
 * VariantSelector, which no longer pre-selects one. Clicking with no
 * size chosen shows a validation message instead of silently no-op'ing
 * or (worse) adding whatever size happened to be first in the array.
 */
export function AddToCart({ product, variant }: { product: Product; variant: Variant | null }) {
  const { addItem } = useCart();
  const ref = useMagnetic<HTMLButtonElement>();
  const [justAdded, setJustAdded] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);

  const pricePending = product.price === null;
  const comingSoon = product.comingSoon === true;
  const soldOut = variant?.stock === 0;
  const disabled = pricePending || comingSoon || soldOut === true;

  const handleClick = () => {
    if (disabled) return;
    if (!variant) {
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);
    addItem(product, variant);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  const label =
    pricePending || comingSoon ? "COMING SOON" : soldOut ? "SOLD OUT" : justAdded ? "ADDED" : "ADD TO CART";

  return (
    <div>
      <CursorTarget label={disabled ? "" : "ADD"}>
        <button
          ref={ref}
          onClick={handleClick}
          disabled={disabled}
          aria-describedby={showSizeError ? "size-required-error" : undefined}
          title={
            pricePending
              ? "This piece is coming soon — pricing isn't confirmed yet."
              : comingSoon
                ? "This piece is coming soon — not available to order yet."
                : undefined
          }
          className="w-full rounded-[var(--radius)] border border-[var(--color-fg)] px-6 py-4 text-xs font-medium tracking-[0.15em] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            transitionDuration: "var(--dur-snap)",
            backgroundColor: justAdded ? "var(--color-accent)" : "transparent",
            borderColor: justAdded ? "var(--color-accent)" : "var(--color-fg)",
            color: justAdded ? "var(--paper)" : "var(--color-fg)",
          }}
        >
          {label}
        </button>
      </CursorTarget>
      {showSizeError && (
        <p id="size-required-error" role="alert" className="mt-2 text-xs tracking-[0.05em] text-[var(--color-accent)]">
          Select a size to continue.
        </p>
      )}
    </div>
  );
}
