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
  // Featured hero product is the catalog's first entry — reorder or
  // edit data.ts to change what the homepage leads with; no component
  // change required.
  const featured = products[0];
  const zipUp = products.find((p) => p.slug === "forma-zip-up");
  const jogger = products.find((p) => p.slug === "forma-jogger");
  const tracksuit = products.find((p) => p.slug === "forma-tracksuit");

  return (
    <main className="relative">
      <Navbar />
      <HomeHero product={featured} />

      <section id="collection" className="px-[var(--gutter)] py-20 md:py-28">
        <div className="mb-10 grid grid-cols-1 items-end gap-6 border-b border-[var(--color-line)] pb-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <span className="tnum text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">Drop 01 / Current line</span>
            <h2 className="font-display mt-3 text-[clamp(3rem,7vw,7rem)] font-medium uppercase leading-[0.82] tracking-[-0.06em]">
              The first<br />construction.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-fg-soft)] md:col-span-4 md:justify-self-end">
            A compact study in washed surfaces, raised artwork and silhouettes that hold their shape.
          </p>
        </div>
        <nav
          aria-label="Shop by category"
          className="mb-8 flex flex-col gap-4 border-y border-[var(--color-line)] py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="tnum text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
            Shop by category
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Link
              href="/shop?category=Hoodies%20%26%20Zip-Ups"
              className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2 text-[10px] uppercase tracking-[0.12em] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
              Hoodies &amp; Zip-Ups
            </Link>
            <Link
              href="/shop?category=Bottoms"
              className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2 text-[10px] uppercase tracking-[0.12em] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
              Bottoms
            </Link>
            <Link
              href="/shop?category=Sets"
              className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2 text-[10px] uppercase tracking-[0.12em] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
              Sets
            </Link>
            <Link
              href="/shop?category=Longsleeves"
              className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2 text-[10px] uppercase tracking-[0.12em] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
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
