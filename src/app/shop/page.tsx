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
      <section className="px-[var(--gutter)] py-10">
        <h1 className="mb-8 flex items-center gap-2 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">
          SHOP — ALL EDITIONS
          <span className="tnum flex h-4 min-w-4 items-center justify-center rounded-full border border-[var(--color-line)] px-1 text-[9px]">
            {products.length}
          </span>
        </h1>

        <Suspense fallback={null}>
          <ShopGrid products={products} />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}
