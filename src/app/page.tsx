import Link from "next/link";
import { getProducts } from "@/lib/commerce/data";
import { Navbar } from "@/components/Navbar";
import { BentoGrid } from "@/components/BentoGrid";
import { HomeHero } from "@/components/HomeHero";
import { AboutSection } from "@/components/AboutSection";
import { DropAccessSection } from "@/components/DropAccessSection";
import { Footer } from "@/components/Footer";

function MoreProductsSection() {
  return (
    <section
      id="more-products"
      className="bg-[var(--paper)] px-[var(--gutter)] py-16 text-[var(--ink)] md:py-24"
    >
      <div className="mb-7 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end sm:gap-6">
        <h2 className="font-display text-3xl font-medium tracking-[-0.04em] md:text-5xl">
          More products
        </h2>
        <span className="text-sm text-[var(--color-fg-soft)]">Coming soon</span>
      </div>

      <div className="grid min-h-80 place-items-center bg-[var(--color-surface-soft)] px-6 py-16 text-center md:min-h-[28rem]">
        <div>
          <p className="font-display text-2xl font-medium tracking-[-0.03em] md:text-3xl">
            New products coming soon.
          </p>
          <p className="mt-3 text-sm text-[var(--color-fg-soft)]">The next CAISN collection is in development.</p>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const products = await getProducts();
  if (products.length === 0) {
    return (
      <main className="relative">
        <Navbar />
        <section className="relative flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden bg-[var(--ink)] px-[var(--gutter)] py-10 text-[var(--paper)] md:py-14">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/45">
            <span>CAISN / RESET 001</span>
            <span>HELMOND / NL</span>
          </div>
          <div className="my-auto">
            <p className="mb-5 text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-soft)]">
              New system in development
            </p>
            <h1 className="font-display text-[clamp(4.8rem,13vw,14rem)] font-semibold uppercase leading-[0.67] tracking-[-0.09em]">
              The next<br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_var(--paper)]">structure.</span>
            </h1>
          </div>
          <div className="grid gap-6 border-t border-white/20 pt-5 text-xs uppercase tracking-[0.14em] text-white/55 md:grid-cols-3">
            <span>Catalog cleared</span>
            <span>New products incoming</span>
            <span className="md:text-right">Built, not printed</span>
          </div>
        </section>

        <MoreProductsSection />

        <AboutSection />
        <Footer />
      </main>
    );
  }

  const featured = products[0];

  return (
    <main className="relative">
      <Navbar />
      <HomeHero product={featured} />

      <section id="collection" className="bg-[var(--paper)] px-[var(--gutter)] py-20 text-[var(--ink)] md:py-32">
        <div className="mb-10 grid grid-cols-1 items-end gap-6 border-b border-[var(--color-line)] pb-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <span className="tnum text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">02 / Archive 03</span>
            <h2 className="font-display mt-4 text-[clamp(4rem,9vw,9rem)] font-semibold uppercase leading-[0.74] tracking-[-0.075em]">
              Archive<br /><span className="text-transparent [-webkit-text-stroke:1.5px_var(--ink)]">zero three.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-fg-soft)] md:col-span-4 md:justify-self-end">
            Archive 03 introduces washed umber fleece, controlled volume and two silhouettes designed to work as one system.
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
          </div>
        </nav>

        <BentoGrid products={products} />
      </section>

      <MoreProductsSection />

      <AboutSection product={featured} />

      <DropAccessSection product={featured} />

      <Footer />
    </main>
  );
}
