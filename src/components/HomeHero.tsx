"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Product, displayName } from "@/lib/commerce/types";
import { Price } from "@/components/Price";

/** A single campaign frame: product, name and drop information share one editorial grid. */
export function HomeHero({ product }: { product?: Product }) {
  const reduceMotion = useReducedMotion();
  const image = product?.media.find((media) => media.type === "image" && !media.url.startsWith("plate:"));

  if (!product || !image) return null;

  return (
    <section className="hero-shell px-[var(--gutter)] pb-5 pt-3 md:pb-8">
      <div className="relative min-h-[calc(100svh-5.5rem)] overflow-hidden bg-[var(--ink)] text-[var(--paper)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden" aria-hidden>
          <span className="font-display block translate-y-[-13%] whitespace-nowrap text-center text-[27vw] font-semibold leading-none tracking-[-0.075em] text-white/[0.055] md:text-[17vw]">
            CAISN
          </span>
        </div>

        <div className="relative grid min-h-[calc(100svh-5.5rem)] grid-cols-1 md:grid-cols-12">
          <div className="order-2 flex flex-col justify-end border-white/15 p-6 md:order-1 md:col-span-5 md:border-r md:p-10 lg:p-14">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/55">
                <span>Drop 01</span>
                <span className="h-px w-8 bg-[var(--color-accent-soft)]" />
                <span>{product.edition || "Current edition"}</span>
              </div>

              <h1 className="font-display max-w-xl text-[clamp(3rem,6.2vw,6.8rem)] font-medium uppercase leading-[0.84] tracking-[-0.055em]">
                {displayName(product.name).replace("CAISN ", "")}
              </h1>

              <div className="mt-6 flex items-end justify-between gap-6 border-t border-white/15 pt-5">
                <div>
                  <p className="max-w-xs text-sm leading-relaxed text-white/60">
                    Washed graphite. Tonal construction. Built to change with wear.
                  </p>
                  <Price value={product.price} className="font-display mt-3 block text-xl" />
                </div>
                <span className="hidden text-right text-[9px] uppercase leading-relaxed tracking-[0.18em] text-white/40 sm:block">
                  Heavyweight<br />construction
                </span>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={`/product/${product.slug}`}
                  className="group inline-flex min-h-12 items-center gap-8 bg-[var(--paper)] px-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink)] transition-colors hover:bg-[var(--color-accent-soft)] hover:text-white"
                >
                  SHOP ECHO
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                </Link>
                <Link
                  href="#collection"
                  className="inline-flex min-h-12 items-center px-4 text-[11px] uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white"
                >
                  EXPLORE DROP 01
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 min-h-[54svh] bg-[var(--surface-plate)] md:order-2 md:col-span-7 md:min-h-0"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-contain p-4 drop-shadow-[0_34px_50px_rgba(10,10,10,0.22)] md:p-8 lg:p-12"
            />

            <div className="absolute left-4 top-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[var(--ink-soft)] md:left-6 md:top-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              Construction 01
            </div>
            <span className="tnum absolute bottom-4 right-4 text-[9px] tracking-[0.18em] text-[var(--ink-soft)] md:bottom-6 md:right-6">
              FRONT / 01
            </span>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-x border-b border-[var(--color-line)] text-[9px] uppercase tracking-[0.16em] text-[var(--color-fg-soft)] md:grid-cols-4">
        {["Designed in the Netherlands", "Limited first construction", "Unisex silhouettes", "Built, not printed"].map((item) => (
          <span key={item} className="border-r border-t border-[var(--color-line)] px-4 py-3 last:border-r-0 md:border-t-0">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
