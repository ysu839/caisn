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

/**
 * A styled "look" card showing two separately-sold, designed-to-pair
 * products (see Product.pairSlug) side by side in one bento cell,
 * instead of each getting its own card. Both garments stay
 * independently purchasable — this is a merchandising pairing, not a
 * bundle SKU. Reused when the lineup has exactly one such pair; more
 * pairs would need a second treatment, not yet needed.
 */
function BentoPairCardBody({ a, b }: { a: Product; b: Product }) {
  const imageOf = (p: Product) => p.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));
  const imageA = imageOf(a);
  const imageB = imageOf(b);

  return (
    <div className="relative flex h-full w-full bg-[var(--surface-plate)]">
      {[
        { product: a, image: imageA },
        { product: b, image: imageB },
      ].map(({ product, image }, i) => (
        <div key={product.id} className={`relative h-full flex-1 ${i === 0 ? "border-r border-[var(--color-line)]/60" : ""}`}>
          {image && (
            <Image
              src={image.url}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 768px) 160px, 22vw"
              className="object-contain p-5 drop-shadow-[0_14px_22px_rgba(10,10,10,0.14)] transition-transform group-hover:scale-[1.03]"
              style={{ transitionDuration: "var(--dur-snap)", transitionTimingFunction: "var(--ease-snap)" }}
            />
          )}
        </div>
      ))}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4 text-[10px] tracking-[0.15em] text-[var(--ink-soft)]">
        <span className="tnum">
          {a.id} / {b.id}
        </span>
        <span>THE SET</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--surface-plate)] via-[var(--surface-plate)]/90 to-transparent p-4 pt-8">
        <p className="font-display text-xl font-semibold leading-none text-[var(--ink)]">THE FORMA SET</p>
        <p className="tnum mt-1 text-xs text-[var(--ink-soft)]">
          {a.name.replace("CAISN ", "")} + {b.name.replace("CAISN ", "")}
        </p>
      </div>
    </div>
  );
}

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

type BentoItem = { kind: "single"; product: Product } | { kind: "pair"; a: Product; b: Product };

/**
 * Groups any product with a confirmed pairSlug (see Product.pairSlug)
 * with its match into one combined bento entry, rather than each
 * getting its own card — a two-garment "look" reads better in a card
 * this tall than one product with a lot of empty frame around it.
 */
function groupForBento(products: Product[]): BentoItem[] {
  const consumed = new Set<string>();
  const items: BentoItem[] = [];
  for (const p of products) {
    if (consumed.has(p.id)) continue;
    const pair = p.pairSlug ? products.find((q) => q.slug === p.pairSlug) : undefined;
    if (pair) {
      items.push({ kind: "pair", a: p, b: pair });
      consumed.add(p.id);
      consumed.add(pair.id);
    } else {
      items.push({ kind: "single", product: p });
      consumed.add(p.id);
    }
  }
  return items;
}

export function BentoGrid({ products }: { products: Product[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = products.find((p) => p.id === activeId) ?? null;
  const closeRef = useRef<HTMLButtonElement>(null);

  const items = groupForBento(products);
  // "lg, md, md" tiles a 4-col grid with zero gaps for any item
  // count — the previous "lg, md, sm, sm" left a dead cell whenever
  // the catalog wasn't a multiple of 4. A paired "look" always gets
  // "lg" (two garments need the room a single-product "md" doesn't have).
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
        {items.map((item, i) => {
          const span = item.kind === "pair" ? "lg" : spans[i % spans.length];
          if (item.kind === "pair") {
            return (
              <Link
                key={`${item.a.id}-${item.b.id}`}
                href={`/product/${item.a.slug}`}
                aria-label={`View ${item.a.name} and ${item.b.name}, sold separately`}
                className={`group relative overflow-hidden text-left ${spanClasses[span]}`}
              >
                <CursorTarget label="VIEW" className="h-full w-full">
                  <BentoPairCardBody a={item.a} b={item.b} />
                </CursorTarget>
              </Link>
            );
          }
          const p = item.product;
          return (
            <motion.button
              key={p.id}
              layoutId={`bento-${p.id}`}
              onClick={() => setActiveId(p.id)}
              aria-label={`View ${p.name}`}
              className={`group relative overflow-hidden text-left ${spanClasses[span]}`}
            >
              <CursorTarget label="VIEW" className="h-full w-full">
                <BentoCardBody product={p} />
              </CursorTarget>
            </motion.button>
          );
        })}
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
