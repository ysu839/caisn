"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart/CartContext";
import { AnimatedPrice } from "@/components/AnimatedPrice";

export function CartDrawer() {
  const { isOpen, close, lines, total } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 0.9, 0.2, 1.02] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-[var(--color-line)] bg-[var(--color-bg)] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xs tracking-[0.15em]">CART ({lines.length})</h2>
              <button onClick={close} className="text-xs tracking-[0.15em]">
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
                  <AnimatedPrice value={l.product.price * l.quantity} className="text-sm" />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t border-[var(--color-line)] pt-4">
              <div className="flex justify-between text-sm">
                <span className="tracking-[0.1em]">TOTAL</span>
                <AnimatedPrice value={total} className="font-display text-lg" />
              </div>
              <button
                disabled={lines.length === 0}
                className="w-full border border-[var(--color-fg)] py-3.5 text-xs tracking-[0.15em] transition-colors disabled:opacity-30 hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
                style={{ transitionDuration: "var(--dur-snap)" }}
              >
                CHECKOUT
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
