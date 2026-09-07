import Link from "next/link";
import { getProducts } from "@/lib/commerce/data";
import { Navbar } from "@/components/Navbar";
import { BentoGrid } from "@/components/BentoGrid";
import { HomeHero } from "@/components/HomeHero";
import { AboutSection } from "@/components/AboutSection";
import { DropAccessSection } from "@/components/DropAccessSection";
import { Footer } from "@/components/Footer";

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

        <section
          id="more-products"
          className="bg-[var(--paper)] px-[var(--gutter)] py-20 text-[var(--ink)] md:py-32"
        >
          <div className="grid gap-10 border-b border-[var(--color-line)] pb-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-9">
              <span className="tnum text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                02 / In development
              </span>
              <h2 className="font-display mt-5 text-[clamp(4.5rem,11vw,11rem)] font-semibold uppercase leading-[0.7] tracking-[-0.08em]">
                More<br />
                <span className="text-transparent [-webkit-text-stroke:1.5px_var(--ink)]">
                  products.
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--color-fg-soft)] md:col-span-3 md:justify-self-end">
              New CAISN pieces are being developed. Nothing enters the collection until the construction, fit and imagery are right.
            </p>
          </div>

          <div className="grid min-h-64 place-items-center border-b border-[var(--color-line)] py-16 text-center md:min-h-80">
            <div>
              <span className="tnum text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-soft)]">
                Catalog 00
              </span>
              <p className="font-display mt-4 text-3xl font-medium uppercase tracking-[-0.04em] md:text-5xl">
                New structures incoming.
              </p>
            </div>
          </div>
        </section>

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

      <AboutSection product={featured} />

      <DropAccessSection product={featured} />

      <Footer />
    </main>
  );
}
