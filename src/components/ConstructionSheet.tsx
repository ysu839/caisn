import Image from "next/image";
import { Product, displayName } from "@/lib/commerce/types";
import { Price } from "@/components/Price";

/**
 * An editorial garment-development-sheet layout — CAISN's own "build
 * sheet," not a generic details accordion. Only renders facts already
 * present in product data (name, price, edition, spec, materials,
 * story) — nothing here is invented (no composition %, no measurements,
 * no production country, no stock/edition counts).
 */
export function ConstructionSheet({ product }: { product: Product }) {
  const images = product.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:"));
  const front = images[0];
  const back = images[1];

  return (
    <section className="border-y border-[var(--color-line)] px-[var(--gutter)] py-16 md:py-24">
      <div className="mb-10 flex items-baseline justify-between">
        <span className="tnum text-[10px] tracking-[0.15em] text-[var(--color-accent)]">CONSTRUCTION / 01</span>
        <span className="tnum text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">
          {product.edition || product.spec}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        {front && (
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[var(--color-line)] bg-[var(--surface-plate)]">
              <Image
                src={front.url}
                alt={front.alt}
                fill
                sizes="(min-width: 768px) 35vw, 90vw"
                className="object-contain p-6 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)]"
              />
            </div>
          </div>
        )}

        <div className="md:col-span-7">
          <h2 className="font-display text-3xl font-semibold leading-[0.95] md:text-4xl">
            {displayName(product.name)}
          </h2>
          <Price value={product.price} className="font-display mt-2 block text-xl" />

          <dl className="mt-8 divide-y divide-[var(--color-line)] border-t border-[var(--color-line)]">
            {product.materials.map((m, i) => (
              <div key={i} className="flex items-baseline gap-4 py-2.5 text-sm">
                <dt className="tnum w-6 shrink-0 text-[var(--color-fg-soft)]">{String(i + 1).padStart(2, "0")}</dt>
                <dd className="capitalize leading-relaxed">{m}</dd>
              </div>
            ))}
          </dl>

          {back && (
            <div className="relative float-right mt-8 aspect-[4/5] w-32 overflow-hidden border border-[var(--color-line)] bg-[var(--surface-plate)] md:w-40">
              <Image src={back.url} alt={back.alt} fill sizes="160px" className="object-contain p-3" />
            </div>
          )}

          {product.story[0] && (
            <p className="mt-8 max-w-md text-sm leading-relaxed text-[var(--color-fg-soft)]">{product.story[0]}</p>
          )}
        </div>
      </div>
    </section>
  );
}
