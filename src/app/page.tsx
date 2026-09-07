import Link from "next/link";
import { getProducts } from "@/lib/commerce/data";
import { Navbar } from "@/components/Navbar";
import { BentoGrid } from "@/components/BentoGrid";
import { HomeHero } from "@/components/HomeHero";
import { FormaConnection } from "@/components/FormaConnection";
import { AboutSection } from "@/components/AboutSection";
import { DropAccessSection } from "@/components/DropAccessSection";
import { Footer } from "@/components/Footer";

export default async function Home() {
  const products = await getProducts();
  // FORMA is the strongest expression of the current visual system and
  // leads the campaign; the wider catalog remains immediately below.
  const featured = products.find((p) => p.slug === "forma-zip-up") ?? products[0];
  const zipUp = products.find((p) => p.slug === "forma-zip-up");
  const jogger = products.find((p) => p.slug === "forma-jogger");
  const tracksuit = products.find((p) => p.slug === "forma-tracksuit");

  return (
    <main className="relative">
      <Navbar />
      <HomeHero product={featured} />

      <section id="collection" className="bg-[var(--paper)] px-[var(--gutter)] py-20 text-[var(--ink)] md:py-32">
        <div className="mb-10 grid grid-cols-1 items-end gap-6 border-b border-[var(--color-line)] pb-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <span className="tnum text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">02 / Current structures</span>
            <h2 className="font-display mt-4 text-[clamp(4rem,9vw,9rem)] font-semibold uppercase leading-[0.74] tracking-[-0.075em]">
              Drop<br /><span className="text-transparent [-webkit-text-stroke:1.5px_var(--ink)]">zero one.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-fg-soft)] md:col-span-4 md:justify-self-end">
            Washed surfaces, controlled volume and silhouettes that hold their shape. Every piece belongs to one system.
          </p>
        </div>
        <nav
          aria-label="Shop by category"
          className="mb-8 flex flex-col gap-5 border-y border-[var(--color-line)] py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="tnum text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
            Shop by category
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Link
              href="/shop?category=Hoodies%20%26%20Zip-Ups"
              className="flex shrink-0 items-center gap-2 border-b border-transparent px-1 py-2 text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <span className="text-[var(--color-accent)]" aria-hidden>01</span>
              Hoodies &amp; Zip-Ups
            </Link>
            <Link
              href="/shop?category=Bottoms"
              className="flex shrink-0 items-center gap-2 border-b border-transparent px-1 py-2 text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <span className="text-[var(--color-accent)]" aria-hidden>02</span>
              Bottoms
            </Link>
            <Link
              href="/shop?category=Sets"
              className="flex shrink-0 items-center gap-2 border-b border-transparent px-1 py-2 text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <span className="text-[var(--color-accent)]" aria-hidden>03</span>
              Sets
            </Link>
            <Link
              href="/shop?category=Longsleeves"
              className="flex shrink-0 items-center gap-2 border-b border-transparent px-1 py-2 text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <span className="text-[var(--color-accent)]" aria-hidden>04</span>
              Longsleeves
            </Link>
          </div>
        </nav>

        <BentoGrid products={products} />
      </section>

      {zipUp && jogger && tracksuit && (
        <FormaConnection zipUp={zipUp} jogger={jogger} tracksuit={tracksuit} />
      )}

      <AboutSection product={featured} />

      <DropAccessSection product={jogger} />

      <Footer />
    </main>
  );
}
