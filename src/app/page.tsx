import { getProducts } from "@/lib/commerce/data";
import { Navbar } from "@/components/Navbar";
import { BentoGrid } from "@/components/BentoGrid";
import { HomeHero } from "@/components/HomeHero";
import { FormaConnection } from "@/components/FormaConnection";
import { CategorySection } from "@/components/CategorySection";
import { CampaignSection } from "@/components/CampaignSection";
import { AboutSection } from "@/components/AboutSection";
import { BrandMoment } from "@/components/BrandMoment";
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

      {/* Single shopping section — the previous "THE LINEUP" pinned
          showcase repeated the same three products already shown here,
          and its horizontal-scroll animation left a genuine blank-frame
          bug with only three cards to drive it. The editorial grid
          below is now the one product experience on the homepage. */}
      <section id="collection" className="px-[var(--gutter)] py-16">
        <h2 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">
          DROP 01 — THE FIRST CONSTRUCTION
        </h2>
        <BentoGrid products={products} />
      </section>

      {zipUp && jogger && tracksuit && (
        <FormaConnection zipUp={zipUp} jogger={jogger} tracksuit={tracksuit} />
      )}

      <CategorySection products={products} />

      {featured && <CampaignSection product={featured} />}

      <AboutSection product={featured} />

      <section className="border-t border-[var(--color-line)] px-[var(--gutter)] py-16 text-center">
        <h2 className="mb-3 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">EARLY ACCESS</h2>
        <p className="font-display text-2xl font-medium">Checkout and the next drop are opening soon.</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-fg-soft)]">
          Browse the current construction now — full checkout access is coming shortly.
        </p>
      </section>

      <BrandMoment />

      <Footer />
    </main>
  );
}
