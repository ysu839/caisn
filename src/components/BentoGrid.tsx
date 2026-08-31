"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Product, displayName } from "@/lib/commerce/types";
import { ProductVisual } from "@/components/ProductVisual";
import { CursorTarget } from "@/lib/motion/CustomCursor";
import { Price } from "@/components/Price";
import { QuickAdd } from "@/components/QuickAdd";

type Span = "sm" | "md" | "lg";

const spanClasses: Record<Span, string> = {
  sm: "col-span-1 row-span-1",
  md: "col-span-1 row-span-2 md:col-span-2 md:row-span-1",
  lg: "col-span-1 row-span-2 md:col-span-2 md:row-span-2",
};

/**
 * A styled "look" showing two separately-sold, designed-to-pair
 * products (see Product.pairSlug) side by side in one bento cell,
 * instead of each getting its own card. Each half is its own Link to
 * its own PDP — the card visually reads as one composition but never
 * behaves like a single bundle SKU (it isn't one).
 */
function BentoPairCard({ a, b, className }: { a: Product; b: Product; className: string }) {
  const imageOf = (p: Product) => p.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));

  return (
    <div className={`group relative overflow-hidden bg-[var(--surface-plate)] ${className}`}>
      <div className="relative flex h-full w-full">
        {[a, b].map((product, i) => {
          const image = imageOf(product);
          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              aria-label={`View ${product.name}`}
              className={`group/half relative h-full flex-1 ${i === 0 ? "border-r border-[var(--color-line)]/60" : ""}`}
            >
              <CursorTarget label="VIEW" className="h-full w-full">
                {image && (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 160px, 22vw"
                    className="object-contain p-5 drop-shadow-[0_14px_22px_rgba(10,10,10,0.14)] transition-transform group-hover/half:scale-[1.03]"
                    style={{ transitionDuration: "var(--dur-snap)", transitionTimingFunction: "var(--ease-snap)" }}
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--surface-plate)] via-[var(--surface-plate)]/90 to-transparent p-3 pt-6">
                  <p className="font-display text-xs font-medium leading-tight text-[var(--ink)] sm:text-sm">
                    {displayName(product.name).replace("CAISN ", "")}
                  </p>
                  <Price value={product.price} className="tnum mt-0.5 block text-xs text-[var(--ink-soft)]" />
                </div>
              </CursorTarget>
            </Link>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[10px] tracking-[0.15em] text-[var(--ink-soft)]">
        <span className="font-display text-sm font-semibold tracking-normal text-[var(--ink)]">THE FORMA SET</span>
        <span className="text-[var(--color-accent)]">SOLD SEPARATELY</span>
      </div>
    </div>
  );
}

function BentoCardBody({ product, featured }: { product: Product; featured: boolean }) {
  const images = product.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:"));
  const image = images[0];
  const back = images[1];
  const isBundle = product.category === "Sets";
  // The tracksuit's media is ordered zip-up front/back, jogger
  // front/back (see data.ts) — images[2] is the jogger's real front
  // shot, so a bundle card can show both real pieces side by side
  // instead of only the zip-up that happens to be images[0].
  const secondPiece = isBundle ? images[2] : undefined;

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
            {displayName(product.name)}
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
      {secondPiece ? (
        // Bundle SKU — show both real constituent pieces side by side
        // rather than just images[0] (the zip-up), so the card matches
        // its own "SET — 2 PIECES" badge instead of contradicting it.
        <div className="flex h-full w-full">
          <div className="relative h-full flex-1 border-r border-[var(--color-line)]/60">
            <Image
              src={image.url}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 768px) 160px, 22vw"
              className="object-contain p-4 drop-shadow-[0_14px_22px_rgba(10,10,10,0.16)] transition-transform group-hover:scale-[1.03]"
              style={{ transitionDuration: "var(--dur-snap)", transitionTimingFunction: "var(--ease-snap)" }}
            />
          </div>
          <div className="relative h-full flex-1">
            <Image
              src={secondPiece.url}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 768px) 160px, 22vw"
              className="object-contain p-4 drop-shadow-[0_14px_22px_rgba(10,10,10,0.16)] transition-transform group-hover:scale-[1.03]"
              style={{ transitionDuration: "var(--dur-snap)", transitionTimingFunction: "var(--ease-snap)" }}
            />
          </div>
        </div>
      ) : (
        <>
          <Image
            src={image.url}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 320px, 45vw"
            className="object-contain p-6 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)] transition-transform group-hover:scale-[1.03]"
            style={{ transitionDuration: "var(--dur-snap)", transitionTimingFunction: "var(--ease-snap)" }}
          />
          {/* Front/back crossfade on hover, pointer devices only — touch
              never gets stuck on the back image. */}
          {back && (
            <Image
              src={back.url}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 768px) 320px, 45vw"
              className="object-contain p-6 opacity-0 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)] transition-opacity [@media(hover:hover)]:group-hover:opacity-100"
              style={{ transitionDuration: "var(--dur-drift)" }}
            />
          )}
        </>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[10px] tracking-[0.15em] text-[var(--ink-soft)]">
        <span className="tnum">{product.id}</span>
        {isBundle ? (
          <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[9px] tracking-[0.1em] text-[var(--paper)]">
            SET — 2 PIECES
          </span>
        ) : (
          <span>{product.edition}</span>
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--surface-plate)] via-[var(--surface-plate)]/90 to-transparent p-4 pt-8">
        <p
          className={`font-display leading-none text-[var(--ink)] ${featured ? "text-2xl font-semibold md:text-3xl" : "text-xl font-semibold"}`}
        >
          {displayName(product.name)}
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <Price value={product.price} className="tnum text-xs font-medium text-[var(--color-accent)]" />
          <span className="tnum text-xs text-[var(--ink-soft)]">{product.spec}</span>
        </div>
      </div>
      <QuickAdd product={product} />
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
  // Exactly one "lg" (2x2 = 4 cells) plus the rest "md" (2x1 = 2 cells
  // each) tiles a 4-col grid with zero gaps for any item count. The
  // first item is the featured card — ECHO leads the catalog order in
  // data.ts, so this naturally makes it the large feature per the
  // brief's "one large ECHO feature, one FORMA pair, one tracksuit"
  // composition, without hardcoding a slug check here.

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
          const span: Span = i === 0 ? "lg" : "md";
          if (item.kind === "pair") {
            return (
              <BentoPairCard key={`${item.a.id}-${item.b.id}`} a={item.a} b={item.b} className={spanClasses[span]} />
            );
          }
          const p = item.product;
          return (
            // A plain div (role="button") rather than a <button> — it now
            // contains QuickAdd's own <button>, and nesting a button
            // inside a button is invalid HTML that browsers mis-parse.
            <motion.div
              key={p.id}
              layoutId={`bento-${p.id}`}
              onClick={() => setActiveId(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveId(p.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${p.name}`}
              className={`group relative cursor-pointer overflow-hidden text-left ${spanClasses[span]}`}
            >
              <CursorTarget label="VIEW" className="h-full w-full">
                <BentoCardBody product={p} featured={span === "lg"} />
              </CursorTarget>
            </motion.div>
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
                  {displayName(active.name)}
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
