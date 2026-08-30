import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/commerce/data";
import { displayName } from "@/lib/commerce/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductPlate } from "@/components/ProductPlate";
import { ProductCardImage } from "@/components/ProductCardImage";
import { Price } from "@/components/Price";
import { QuickAdd } from "@/components/QuickAdd";

export const metadata: Metadata = {
  title: "Shop — CAISN",
  description: "All CAISN editions — structural fashion, built not printed.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main>
      <Navbar />
      <section className="px-[var(--gutter)] py-10">
        <h1 className="mb-8 flex items-center gap-2 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">
          SHOP — ALL EDITIONS
          <span className="tnum flex h-4 min-w-4 items-center justify-center rounded-full border border-[var(--color-line)] px-1 text-[9px]">
            {products.length}
          </span>
        </h1>

        {/* Straightforward, conversion-focused grid: equal cards, three
            per row on desktop, no oversized hero card and no orphan
            column — a small catalog reads best as a clean lineup, not
            an editorial layout fighting to fill leftover space. */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const front = p.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));
            const back = p.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:"))[1];
            const color = p.variants[0]?.color;

            return (
              <Link key={p.id} href={`/product/${p.slug}`} className="group block">
                {front ? (
                  <div className="relative">
                    <ProductCardImage front={front} back={back} priority={i < 3} />
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
      </section>
      <Footer />
    </main>
  );
}
