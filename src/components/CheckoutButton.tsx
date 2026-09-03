"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";

export function CheckoutButton() {
  const { lines } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkout = async () => {
    if (lines.length === 0 || loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((line) => ({
            slug: line.product.slug,
            color: line.variant.color,
            size: line.variant.size,
            quantity: line.quantity,
          })),
        }),
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "Checkout could not be started.");
      window.location.assign(result.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout could not be started.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={checkout}
        disabled={loading || lines.length === 0}
        className="w-full bg-[var(--color-fg)] py-3.5 text-xs tracking-[0.15em] text-[var(--color-bg)] transition-opacity hover:opacity-80 disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "OPENING SECURE CHECKOUT…" : "SECURE CHECKOUT"}
      </button>
      {error && <p role="alert" className="mt-3 text-center text-xs text-[var(--color-accent)]">{error}</p>}
    </div>
  );
}
