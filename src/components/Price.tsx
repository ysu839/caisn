"use client";

import { PriceOrPending } from "@/lib/commerce/types";
import { AnimatedPrice } from "@/components/AnimatedPrice";

/**
 * The single place every price display reads through. Renders the
 * real animated price when set, or a professional "COMING SOON" state
 * when not — never a fabricated number, never a silent €0, and never
 * internal-sounding language like "pending" in front of a customer.
 */
export function Price({ value, className }: { value: PriceOrPending; className?: string }) {
  if (value === null) {
    return <span className={`tracking-[0.1em] ${className ?? ""}`}>COMING SOON</span>;
  }
  return <AnimatedPrice value={value} className={className} />;
}
