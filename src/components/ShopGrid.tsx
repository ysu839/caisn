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

  const lgCols = [3, 2, 1].find((n) => filtered.length % n === 0) ?? 3;
  const lgColsClass = { 3: "lg:grid-cols-3", 2: "lg:grid-cols-2", 1: "lg:grid-cols-1" }[lgCols];

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 overflow-x-auto">
          {(["all", ...CATEGORIES] as const).map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={active}
                className="shrink-0 rounded-full border px-3.5 py-1.5 text-xs tracking-[0.05em] transition-colors"
                style={{
                  borderColor: active ? "var(--color-fg)" : "var(--color-line)",
                  backgroundColor: active ? "var(--color-fg)" : "transparent",
                  color: active ? "var(--color-bg)" : "var(--color-fg-soft)",
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
              className="shrink-0 text-xs tracking-[0.05em] text-[var(--color-fg-soft)] underline underline-offset-2 hover:text-[var(--color-accent)]"
            >
              RESET
            </button>
          )}
        </div>

        <label className="flex shrink-0 items-center gap-2 text-xs tracking-[0.05em] text-[var(--color-fg-soft)]">
          SORT
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-[var(--color-line)] bg-[var(--color-bg)] px-2 py-1.5 text-xs text-[var(--color-fg)]"
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
        <div className={`grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 ${lgColsClass}`}>
          {filtered.map((p, i) => {
            const front = p.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));
            const back = p.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:"))[1];
            const color = p.variants[0]?.color;
            const isBundle = p.slug === "forma-tracksuit";

            return (
              <Link key={p.id} href={`/product/${p.slug}`} className="group block">
                {front ? (
                  <div className="relative">
                    <ProductCardImage front={front} back={back} priority={i < 3} />
                    {isBundle && (
                      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[9px] tracking-[0.1em] text-[var(--paper)]">
                        SET — 2 PIECES
                      </span>
                    )}
                    <QuickAdd product={p} />
                  </div>
                ) : (
                  <ProductPlate label={p.name} spec={p.spec} index={p.id} />
                )}
                <div className="mt-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display text-sm font-medium">{displayName(p.name)}</span>
                    <Price value={p.price} className="shrink-0 text-sm" />
                  </div>
                  {color && <p className="mt-1 text-xs text-[var(--color-fg-soft)]">{color}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
