import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/commerce/data";
import { Navbar } from "@/components/Navbar";
import { ProductVisual } from "@/components/ProductVisual";
import { AnimatedPrice } from "@/components/AnimatedPrice";

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
        <h1 className="mb-6 flex items-center gap-2 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">
          SHOP — ALL EDITIONS
          <span className="tnum flex h-4 min-w-4 items-center justify-center rounded-full border border-[var(--color-line)] px-1 text-[9px]">
            {products.length}
          </span>
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group">
              <ProductVisual product={p} />
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display text-sm font-medium">{p.name}</span>
                <AnimatedPrice value={p.price} className="text-sm" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
