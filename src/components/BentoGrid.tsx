"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/lib/commerce/types";
import { ProductVisual } from "@/components/ProductVisual";
import { CursorTarget } from "@/lib/motion/CustomCursor";
import { Price } from "@/components/Price";

type Span = "sm" | "md" | "lg";

const spanClasses: Record<Span, string> = {
  sm: "col-span-1 row-span-1",
  md: "col-span-1 row-span-2 md:col-span-2 md:row-span-1",
  lg: "col-span-1 row-span-2 md:col-span-2 md:row-span-2",
};

function BentoCardBody({ product }: { product: Product }) {
  const image = product.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));

  if (!image) {
    // No real photography yet — the existing pure spec-sheet treatment,
    // unchanged for the three placeholder products.
    return (
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex justify-between text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">
          <span className="tnum">{product.id}</span>
          <span>{product.edition}</span>
        </div>
        <div>
          <p className="font-display text-xl font-semibold leading-none transition-transform duration-200 group-hover:-translate-y-0.5">
            {product.name}
          </p>
          <p className="tnum mt-1 text-xs text-[var(--color-fg-soft)]">{product.spec}</p>
        </div>
      </div>
    );
  }

  // Real photography leads — the product itself carries the visual
  // weight instead of a text-only spec card, same reasoning as
  // ProductVisual elsewhere. The image sits on the constant warm
  // studio "mat" rather than the card's dark ground, so it reads as
  // art-directed rather than a JPG pasted into a black box.
  return (
    <div className="relative h-full w-full bg-[var(--surface-plate)]">
      <Image
        src={image.url}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 768px) 320px, 45vw"
        className="object-contain p-6 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)] transition-transform group-hover:scale-[1.03]"
        style={{ transitionDuration: "var(--dur-snap)", transitionTimingFunction: "var(--ease-snap)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4 text-[10px] tracking-[0.15em] text-[var(--ink-soft)]">
        <span className="tnum">{product.id}</span>
        <span>{product.edition}</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--surface-plate)] via-[var(--surface-plate)]/90 to-transparent p-4 pt-8">
        <p className="font-display text-xl font-semibold leading-none text-[var(--ink)]">{product.name}</p>
        <p className="tnum mt-1 text-xs text-[var(--ink-soft)]">{product.spec}</p>
      </div>
    </div>
  );
}

export function BentoGrid({ products }: { products: Product[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = products.find((p) => p.id === activeId) ?? null;
  const closeRef = useRef<HTMLButtonElement>(null);

  // "lg, md, md" tiles a 4-col grid with zero gaps for any product
  // count — the previous "lg, md, sm, sm" left a dead cell whenever
  // the catalog wasn't a multiple of 4 (e.g. the current 3 real
  // products), reading as an unfinished collection rather than a
  // deliberate layout.
  const spans: Span[] = ["lg", "md", "md"];

  useEffect(() => {
    if (!active) return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <div className="relative">
      <div className="grid auto-rows-[240px] grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p, i) => (
          <motion.button
            key={p.id}
            layoutId={`bento-${p.id}`}
            onClick={() => setActiveId(p.id)}
            aria-label={`View ${p.name}`}
            className={`group relative overflow-hidden text-left ${spanClasses[spans[i % spans.length]]}`}
          >
            <CursorTarget label="VIEW" className="h-full w-full">
              <BentoCardBody product={p} />
            </CursorTarget>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bento-overlay-heading"
            className="fixed inset-0 z-50 bg-[var(--color-bg)]"
            layoutId={`bento-${active.id}`}
          >
            <motion.button
              ref={closeRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveId(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 p-3 text-xs tracking-[0.15em]"
            >
              CLOSE
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-8 px-[var(--gutter)] md:flex-row"
            >
              <ProductVisual product={active} className="max-w-sm" />
              <div className="max-w-sm">
                <span className="tnum text-xs tracking-[0.15em] text-[var(--color-fg-soft)]">
                  {active.edition}
                </span>
                <h3 id="bento-overlay-heading" className="font-display mt-2 text-4xl font-semibold">
                  {active.name}
                </h3>
                <p className="mt-4 text-sm text-[var(--color-fg-soft)]">{active.story[0]}</p>
                <div className="mt-6 flex items-center gap-4">
                  <Price value={active.price} className="font-display text-2xl" />
                  <Link
                    href={`/product/${active.slug}`}
                    className="border border-[var(--color-fg)] px-5 py-2.5 text-xs tracking-[0.15em] transition-colors hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
                  >
                    VIEW PRODUCT
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
