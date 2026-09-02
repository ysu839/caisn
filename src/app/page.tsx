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
