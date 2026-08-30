"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart/CartContext";
import { Price } from "@/components/Price";

export function CartDrawer() {
  const { isOpen, close, lines, total } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
            className="fixed inset-0 z-40 bg-black/40"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-heading"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 0.9, 0.2, 1.02] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-[var(--color-line)] bg-[var(--color-bg)] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 id="cart-drawer-heading" className="text-xs tracking-[0.15em]">
                CART ({lines.length})
              </h2>
              <button
                ref={closeRef}
                onClick={close}
                className="-m-2.5 p-2.5 text-xs tracking-[0.15em]"
                aria-label="Close cart"
              >
                CLOSE
              </button>
            </div>

            <div className="mt-8 flex-1 space-y-6 overflow-y-auto">
              {lines.length === 0 && (
                <p className="text-sm text-[var(--color-fg-soft)]">Your cart is empty.</p>
              )}
              {lines.map((l, i) => (
                <div key={i} className="flex justify-between border-b border-[var(--color-line)] pb-4 text-sm">
                  <div>
                    <p className="font-display font-medium">{l.product.name}</p>
                    <p className="tnum mt-1 text-xs text-[var(--color-fg-soft)]">
                      {l.variant.color} / {l.variant.size} × {l.quantity}
                    </p>
                  </div>
                  <Price value={l.product.price !== null ? l.product.price * l.quantity : null} className="text-sm" />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t border-[var(--color-line)] pt-4">
              <div className="flex justify-between text-sm">
                <span className="tracking-[0.1em]">TOTAL</span>
                <Price value={total} className="font-display text-lg" />
              </div>
              <button
                disabled={lines.length === 0}
                title="Prototype — checkout is not yet connected to a payment provider"
                onClick={() => alert("CAISN is still in prototype — checkout isn't connected yet.")}
                className="w-full border border-[var(--color-fg)] py-3.5 text-xs tracking-[0.15em] transition-colors disabled:opacity-30 hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
                style={{ transitionDuration: "var(--dur-snap)" }}
              >
                CHECKOUT
              </button>
              <p className="text-center text-[10px] tracking-[0.1em] text-[var(--color-fg-soft)]">
                PROTOTYPE — CHECKOUT NOT YET LIVE
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
