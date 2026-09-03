"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Product, Category, CATEGORIES, displayName } from "@/lib/commerce/types";
import { ProductPlate } from "@/components/ProductPlate";
import { ProductCardImage } from "@/components/ProductCardImage";
import { Price } from "@/components/Price";
import { QuickAdd } from "@/components/QuickAdd";

type SortKey = "featured" | "price-asc" | "price-desc";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "FEATURED" },
  { key: "price-asc", label: "PRICE: LOW TO HIGH" },
  { key: "price-desc", label: "PRICE: HIGH TO LOW" },
];

/**
 * Filter/sort controls proportional to a 4-product catalog — a
 * category tab row and a plain sort select, not a full faceted filter
 * panel that would look empty over this few items. The architecture
 * (Category type, CATEGORIES list) is ready to scale once the catalog
 * grows without changing this component.
 */
export function ShopGrid({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  // Deep-link support (e.g. the homepage's "Shop by Category" section
  // links to /shop?category=Bottoms) — a lazy initializer reads the URL
  // once for the initial render, so a direct link lands already
  // filtered without an effect or extra render pass.
  const [category, setCategory] = useState<Category | "all">(() => {
    const fromUrl = searchParams.get("category");
    return fromUrl && (CATEGORIES as string[]).includes(fromUrl) ? (fromUrl as Category) : "all";
  });
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = category === "all" ? products : products.filter((p) => p.category === category);
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    }
    return list;
  }, [products, category, sort]);

  // Prefer a column count the catalog tiles exactly (3, then 2); if
  // neither divides evenly, fall back to whichever leaves a full short
  // row instead of a single stranded card (a remainder of exactly 1).
  // 1 column is the last resort, which is itself always orphan-free.
  const lgCols = (() => {
    for (const n of [3, 2]) if (filtered.length % n === 0) return n;
    for (const n of [3, 2]) if (filtered.length % n >= 2) return n;
    return 1;
  })();
  const lgColsClass = { 3: "lg:grid-cols-3", 2: "lg:grid-cols-2", 1: "lg:grid-cols-1" }[lgCols];

  return (
    <>
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex gap-6 overflow-x-auto border-b border-[var(--color-line)]">
          {(["all", ...CATEGORIES] as const).map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={active}
                className="shrink-0 border-b-2 px-0 pb-3 pt-1 text-[10px] uppercase tracking-[0.14em] transition-colors"
                style={{
                  borderColor: active ? "var(--color-accent)" : "transparent",
                  color: active ? "var(--color-fg)" : "var(--color-fg-soft)",
                  transitionDuration: "var(--dur-snap)",
                }}
              >
                {c === "all" ? "ALL PRODUCTS" : c.toUpperCase()}
              </button>
            );
          })}
          {category !== "all" && (
            <button
              onClick={() => setCategory("all")}
              className="shrink-0 pb-3 text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-soft)] underline hover:text-[var(--color-accent)]"
            >
              RESET
            </button>
          )}
        </div>

        <label className="flex shrink-0 items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-soft)]">
          SORT
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border-0 border-b border-[var(--color-line)] bg-[var(--color-bg)] py-2 text-[10px] tracking-[0.08em] text-[var(--color-fg)] outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-sm text-[var(--color-fg-soft)]">No products in this category yet.</p>
          <button
            onClick={() => setCategory("all")}
            className="mt-4 text-xs tracking-[0.1em] underline underline-offset-2 hover:text-[var(--color-accent)]"
          >
            VIEW ALL PRODUCTS
          </button>
        </div>
      ) : (
        <div className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 ${lgColsClass}`}>
          {filtered.map((p, i) => {
            const isBundle = p.slug === "forma-tracksuit";
            const productImages = p.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:"));
            const front = p.cardMedia ?? productImages[0];
            const back = isBundle || p.cardMedia ? undefined : productImages[1];
            // Fall back to a live two-image composition for any future
            // set without its own dedicated catalog asset.
            const secondaryFront = isBundle && !p.cardMedia ? productImages[2] : undefined;
            const color = p.variants[0]?.color;
            const comingSoon = p.comingSoon === true;

            // A non-interactive container, not a Link — QuickAdd's own
            // <button> would otherwise nest inside the card's anchor,
            // which is invalid HTML (interactive content cannot nest).
            // The image/name below is its own real Link to the PDP;
            // QuickAdd is an independent sibling button instead.
            return (
              <div key={p.id} data-testid="product-card" className="group">
                {front ? (
                  <div className="relative">
                    <Link href={`/product/${p.slug}`} className="block" aria-label={`View ${p.name}`}>
                      <ProductCardImage front={front} back={back} secondaryFront={secondaryFront} priority={i < 3} />
                    </Link>
                    {isBundle && (
                      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[9px] tracking-[0.1em] text-[var(--paper)]">
                        SET — 2 PIECES
                      </span>
                    )}
                    {comingSoon && (
                      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[var(--ink)] px-2.5 py-1 text-[9px] tracking-[0.1em] text-[var(--paper)]">
                        COMING SOON
                      </span>
                    )}
                    <QuickAdd product={p} />
                  </div>
                ) : (
                  <Link href={`/product/${p.slug}`} className="block" aria-label={`View ${p.name}`}>
                    <ProductPlate label={p.name} spec={p.spec} index={p.id} />
                  </Link>
                )}
                <Link href={`/product/${p.slug}`} className="mt-3 block">
                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:justify-between sm:gap-3">
                    <span className="font-display text-xs font-medium sm:text-sm">{displayName(p.name)}</span>
                    <Price value={p.price} className="shrink-0 text-xs sm:text-sm" />
                  </div>
                  {color && <p className="mt-1 text-xs text-[var(--color-fg-soft)]">{color}</p>}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
