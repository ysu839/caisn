"use client";

import Link from "next/link";
import Image from "next/image";
import { useMagnetic } from "@/lib/motion/useMagnetic";
import { CursorTarget } from "@/lib/motion/CustomCursor";
import { Product, displayName } from "@/lib/commerce/types";
import { Price } from "@/components/Price";

/**
 * Product-led hero: the wordmark still leads, but the flagship
 * garment is visible in the same viewport, not several scrolls below
 * it — a fashion storefront should show clothing immediately, not
 * make a shopper hunt for the first product.
 */
export function HomeHero({ product }: { product?: Product }) {
  const ctaRef = useMagnetic<HTMLAnchorElement>();
  const image = product?.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));

  return (
    <section className="relative overflow-hidden px-[var(--gutter)] pb-10 pt-6 md:pb-16">
      <div className="pointer-events-none fixed left-0 top-0 hidden h-full w-[var(--rail-width)] flex-col items-center justify-center border-r border-[var(--color-line)] md:flex">
        <span className="tnum -rotate-90 whitespace-nowrap text-xs tracking-[0.2em] text-[var(--color-fg-soft)]">
          CAISN — BUILT, NOT PRINTED
        </span>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <h1 className="font-display select-none text-[16vw] font-semibold leading-[0.85] tracking-tight md:text-[6vw]">
            CAISN
          </h1>
          <p className="mt-3 text-sm tracking-[0.1em] text-[var(--color-fg-soft)]">built, not printed.</p>

          {product && (
            <div className="mt-8 max-w-xs">
              {product.edition && (
                <span className="tnum text-xs tracking-[0.15em] text-[var(--color-fg-soft)]">
                  {product.edition} / {product.spec}
                </span>
              )}
              <p className="font-display mt-2 text-2xl font-medium">{displayName(product.name)}</p>
              <Price value={product.price} className="font-display mt-1 block text-lg" />
              <CursorTarget label="VIEW">
                <Link
                  ref={ctaRef}
                  href={`/product/${product.slug}`}
                  className="mt-5 inline-block whitespace-nowrap rounded-[var(--radius)] border border-[var(--color-fg)] px-6 py-3 text-xs font-medium tracking-[0.15em] transition-colors hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
                  style={{ transitionDuration: "var(--dur-snap)" }}
                >
                  VIEW PRODUCT
                </Link>
              </CursorTarget>
            </div>
          )}
        </div>

        {product && image && (
          <Link href={`/product/${product.slug}`} className="group relative block">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-plate)]">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                priority
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-contain p-8 drop-shadow-[0_24px_36px_rgba(10,10,10,0.18)] transition-transform group-hover:scale-[1.02]"
                style={{ transitionDuration: "var(--dur-drift)", transitionTimingFunction: "var(--ease-drift)" }}
              />
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
