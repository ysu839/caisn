import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/commerce/data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Shop — CAISN",
  description: "All CAISN editions — structural fashion, built not printed.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main>
      <Navbar />
      <section className="px-[var(--gutter)] pb-20 pt-12 md:pt-20">
        <div className="mb-12 grid grid-cols-1 items-end gap-6 border-b border-[var(--color-line)] pb-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <span className="tnum text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">CAISN / SHOP</span>
            <h1 className="font-display mt-3 text-[clamp(4rem,10vw,10rem)] font-medium uppercase leading-[0.78] tracking-[-0.075em]">
              All pieces.
            </h1>
          </div>
          <div className="flex items-end justify-between gap-6 md:col-span-4">
            <p className="max-w-xs text-sm leading-relaxed text-[var(--color-fg-soft)]">
              Drop 01 and current constructions. Designed as individual pieces, built to work together.
            </p>
            <span className="tnum text-3xl font-light">{String(products.length).padStart(2, "0")}</span>
          </div>
        </div>

        <Suspense fallback={null}>
          <ShopGrid products={products} />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}
