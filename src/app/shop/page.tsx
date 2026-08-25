import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/commerce/data";
import { Navbar } from "@/components/Navbar";
import { ProductPlate } from "@/components/ProductPlate";
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
        <h1 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">
          SHOP — ALL EDITIONS
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group">
              <ProductPlate label={p.name} spec={p.spec} index={p.id} />
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
