import Image from "next/image";
import { Product, displayName } from "@/lib/commerce/types";

/**
 * Campaign module architecture. `modelImages` is the slot for future
 * real photography (full-body, walking, three-quarter, torso crop,
 * back-fit, material close-up — see CAMPAIGN_PHOTO_BRIEF.md for exact
 * specs) and is intentionally optional: no genuine model photography
 * exists yet, so this never renders an empty box, a "coming soon"
 * label, a skeleton, or a fake silhouette. Today it always takes the
 * honest fallback branch below — real garment photography, oversized
 * type and intentional composition — so the page stays visually
 * finished either way. Swapping in real shots later is a data change
 * (populate `modelImages`), not a component rewrite.
 */
export function CampaignSection({
  product,
  modelImages,
}: {
  product: Product;
  modelImages?: { url: string; alt: string }[];
}) {
  if (modelImages && modelImages.length > 0) {
    // Future path — not reachable today, kept honest rather than
    // building and hiding an empty scaffold with fake content.
    return (
      <section className="bg-[var(--ink)] px-[var(--gutter)] py-20 md:py-28">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {modelImages.map((img) => (
            <div key={img.url} className="relative aspect-[4/5] overflow-hidden bg-[#161615]">
              <Image src={img.url} alt={img.alt} fill sizes="33vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const detail = product.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));

  return (
    <section className="bg-[var(--ink)] px-[var(--gutter)] py-20 md:py-28">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6">
          <span className="tnum text-[10px] tracking-[0.15em] text-[var(--color-accent-soft)]">CONSTRUCTION 01</span>
          <p className="font-display mt-4 text-4xl font-medium leading-[0.95] text-[var(--paper)] md:text-5xl">
            Made to be worn hard, washed often, and to hold its shape.
          </p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--paper)]/70">
            {displayName(product.name)} carries its construction on the outside — every seam, panel and
            wash mark is part of the design, not hidden under it.
          </p>
        </div>
        {detail && (
          <div className="relative aspect-[3/4] overflow-hidden md:col-span-6">
            {/* A deliberate detail crop from the real product photo — a
                zoomed, off-center framing rather than the standard
                catalog shot, so its reuse has a different storytelling
                purpose than the hero/PDP/shop instances of this image. */}
            <Image
              src={detail.url}
              alt={detail.alt}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="scale-[1.7] object-cover object-[65%_35%]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
