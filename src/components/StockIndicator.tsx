"use client";

import { LIVE_INVENTORY } from "@/lib/commerce/data";

/**
 * Scarcity as information, not manipulation — plain spec-callout
 * styling, real numbers only, no urgency copy or color pressure
 * beyond the single accent reserved for low stock.
 *
 * Until LIVE_INVENTORY is true, stock is placeholder data and must
 * never be presented as fact — rather than show internal-sounding
 * language like "pending" to a customer, this control is simply
 * withheld until real inventory is wired in.
 */
export function StockIndicator({ stock, total }: { stock: number; total?: number }) {
  if (!LIVE_INVENTORY) {
    return null;
  }

  const low = stock <= 3;

  return (
    <div className="flex items-center gap-2 text-xs tracking-[0.1em]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${low ? "bg-[var(--color-accent)]" : "bg-[var(--color-fg-soft)]"}`}
        aria-hidden
      />
      <span className="tnum text-[var(--color-fg-soft)]">
        {total !== undefined
          ? `${String(stock).padStart(2, "0")} / ${String(total).padStart(2, "0")} REMAINING`
          : `${stock} REMAINING`}
      </span>
    </div>
  );
}
