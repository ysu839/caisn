import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/commerce/data";
import { Navbar } from "@/components/Navbar";
import { ProductVisual } from "@/components/ProductVisual";
import { Price } from "@/components/Price";

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

        {/* Editorial asymmetry: the first edition leads, oversized; the
            rest sit in a staggered strip rather than a uniform grid —
            a product page should read like a lineup, not a spreadsheet. */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-6 md:gap-8">
          {products.map((p, i) => {
            const featured = i === 0;
            return (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className={`group ${featured ? "sm:col-span-2 md:col-span-4" : "md:col-span-2"} ${
                  !featured && i % 2 === 0 ? "md:mt-16" : ""
                }`}
              >
                <ProductVisual product={p} priority={featured} />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span
                    className={`font-display truncate font-medium ${featured ? "text-lg md:text-xl" : "text-sm"}`}
                  >
                    {p.name}
                  </span>
                  <Price value={p.price} className={`shrink-0 ${featured ? "text-base" : "text-sm"}`} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
