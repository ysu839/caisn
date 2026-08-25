"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/lib/commerce/types";
import { ProductPlate } from "@/components/ProductPlate";
import { CursorTarget } from "@/lib/motion/CustomCursor";
import { AnimatedPrice } from "@/components/AnimatedPrice";

type Span = "sm" | "md" | "lg";

const spanClasses: Record<Span, string> = {
  sm: "col-span-1 row-span-1",
  md: "col-span-1 row-span-2 md:col-span-2 md:row-span-1",
  lg: "col-span-1 row-span-2 md:col-span-2 md:row-span-2",
};

export function BentoGrid({ products }: { products: Product[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = products.find((p) => p.id === activeId) ?? null;

  const spans: Span[] = ["lg", "md", "sm", "sm"];

  return (
    <div className="relative">
      <div className="grid auto-rows-[220px] grid-cols-2 gap-3 md:grid-cols-4">
        {products.map((p, i) => (
          <motion.button
            key={p.id}
            layoutId={`bento-${p.id}`}
            onClick={() => setActiveId(p.id)}
            className={`group relative overflow-hidden border border-[var(--color-line)] text-left ${spanClasses[spans[i % spans.length]]}`}
          >
            <CursorTarget label="VIEW" className="h-full w-full">
              <div className="flex h-full flex-col justify-between p-4">
                <div className="flex justify-between text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">
                  <span className="tnum">{p.id}</span>
                  <span>{p.edition}</span>
                </div>
                <div>
                  <p className="font-display text-xl font-semibold leading-none transition-transform duration-200 group-hover:-translate-y-0.5">
                    {p.name}
                  </p>
                  <p className="tnum mt-1 text-xs text-[var(--color-fg-soft)]">{p.spec}</p>
                </div>
              </div>
            </CursorTarget>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 bg-[var(--color-bg)]"
            layoutId={`bento-${active.id}`}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveId(null)}
              className="absolute right-6 top-6 z-10 text-xs tracking-[0.15em]"
            >
              CLOSE
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-8 px-[var(--gutter)] md:flex-row"
            >
              <ProductPlate label={active.name} spec={active.spec} index={active.id} className="max-w-sm" />
              <div className="max-w-sm">
                <span className="tnum text-xs tracking-[0.15em] text-[var(--color-fg-soft)]">
                  {active.edition}
                </span>
                <h3 className="font-display mt-2 text-4xl font-semibold">{active.name}</h3>
                <p className="mt-4 text-sm text-[var(--color-fg-soft)]">{active.story[0]}</p>
                <div className="mt-6 flex items-center gap-4">
                  <AnimatedPrice value={active.price} className="font-display text-2xl" />
                  <a
                    href={`/product/${active.slug}`}
                    className="border border-[var(--color-fg)] px-5 py-2.5 text-xs tracking-[0.15em] transition-colors hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
                  >
                    VIEW PRODUCT
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
