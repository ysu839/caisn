"use client";

import Link from "next/link";
import { useMagnetic } from "@/lib/motion/useMagnetic";
import { useKineticType } from "@/lib/motion/useKineticType";
import { CursorTarget } from "@/lib/motion/CustomCursor";
import { Product } from "@/lib/commerce/types";

/**
 * Featured product is passed in from the data layer (the catalog's
 * first entry — see page.tsx) rather than hard-coded here, so
 * changing what the homepage leads with is a data edit, not a
 * component edit.
 */
export function HomeHero({ product }: { product?: Product }) {
  const ctaRef = useMagnetic<HTMLAnchorElement>();
  const kineticRef = useKineticType<HTMLHeadingElement>();

  return (
    <section className="relative flex min-h-[85svh] flex-col justify-between overflow-hidden px-[var(--gutter)] pb-8">
      <div className="pointer-events-none fixed left-0 top-0 hidden h-full w-[var(--rail-width)] flex-col items-center justify-center border-r border-[var(--color-line)] md:flex">
        <span className="tnum -rotate-90 whitespace-nowrap text-xs tracking-[0.2em] text-[var(--color-fg-soft)]">
          01 / 06 — COLD OPEN
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <CursorTarget label="EXPLORE">
          <h1
            ref={kineticRef}
            className="font-display select-none text-[18vw] font-semibold leading-[0.82] tracking-tight md:text-[11vw]"
          >
            CAISN
          </h1>
        </CursorTarget>
        <p className="mt-6 text-sm tracking-[0.1em] text-[var(--color-fg-soft)]">built, not printed.</p>
      </div>

      {product && (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <span className="tnum text-xs text-[var(--color-fg-soft)]">
            {product.edition} / {product.spec}
          </span>
          <CursorTarget label="VIEW">
            <Link
              ref={ctaRef}
              href={`/product/${product.slug}`}
              className="whitespace-nowrap rounded-[var(--radius)] border border-[var(--color-fg)] px-6 py-3 text-xs font-medium tracking-[0.15em] transition-colors hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
              style={{ transitionDuration: "var(--dur-snap)" }}
            >
              VIEW {product.name}
            </Link>
          </CursorTarget>
        </div>
      )}
    </section>
  );
}
