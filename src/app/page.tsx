import { getProducts } from "@/lib/commerce/data";
import { Navbar } from "@/components/Navbar";
import { BentoGrid } from "@/components/BentoGrid";
import { HomeHero } from "@/components/HomeHero";
import { HorizontalShowcase } from "@/components/HorizontalShowcase";

export default async function Home() {
  const products = await getProducts();
  // Featured hero product is the catalog's first entry — reorder or
  // edit data.ts to change what the homepage leads with; no component
  // change required.
  const featured = products[0];

  return (
    <main className="relative">
      <Navbar />
      <HomeHero product={featured} />

      <HorizontalShowcase products={products} />

      <section id="collection" className="px-[var(--gutter)] py-16">
        <h2 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">
          03 / 06 — INDEX
        </h2>
        <BentoGrid products={products} />
      </section>

      <section id="about" className="px-[var(--gutter)] py-24 text-center">
        <h2 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">
          04 / 06 — STATEMENT
        </h2>
        <p className="font-display mx-auto max-w-2xl text-3xl font-medium leading-tight md:text-4xl">
          Every seam is a decision. We show you all of them.
        </p>
      </section>

      <footer className="flex items-center justify-between border-t border-[var(--color-line)] px-[var(--gutter)] py-8 text-xs tracking-[0.1em] text-[var(--color-fg-soft)]">
        <span>CAISN © 2026</span>
        <span className="tnum">06 / 06</span>
      </footer>
    </main>
  );
}
