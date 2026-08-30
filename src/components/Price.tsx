"use client";

import { PriceOrPending } from "@/lib/commerce/types";
import { AnimatedPrice } from "@/components/AnimatedPrice";

/**
 * The single place every price display reads through. Renders the
 * real animated price when set, or an honest "PRICE PENDING" state
 * when not — never a fabricated number, never a silent €0.
 */
export function Price({ value, className }: { value: PriceOrPending; className?: string }) {
  if (value === null) {
    return <span className={`tnum tracking-[0.1em] ${className ?? ""}`}>PRICE PENDING</span>;
  }
  return <AnimatedPrice value={value} className={className} />;
}
