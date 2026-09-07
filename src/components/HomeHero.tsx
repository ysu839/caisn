"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Price } from "@/components/Price";
import { Product, displayName } from "@/lib/commerce/types";

/** Campaign-first hero: one garment, one idea, one clear route into the drop. */
export function HomeHero({ product }: { product?: Product }) {
  const reduceMotion = useReducedMotion();
  const image = product?.media.find((item) => item.type === "image" && !item.url.startsWith("plate:"));

  if (!product || !image) return null;

  return (
    <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[var(--ink)] text-[var(--paper)]">
      <div className="pointer-events-none absolute inset-x-0 top-[-2vw] overflow-hidden" aria-hidden>
        <motion.span
          initial={reduceMotion ? false : { y: "-18%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display block whitespace-nowrap text-center text-[28vw] font-semibold leading-[.72] tracking-[-0.105em] text-white/[0.065] md:text-[17.5vw]"
        >
          CAISN
        </motion.span>
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-[1800px] grid-cols-1 md:grid-cols-12">
        <div className="order-2 flex min-h-[46svh] flex-col justify-end px-[var(--gutter)] pb-10 pt-12 md:order-1 md:col-span-6 md:min-h-0 md:border-r md:border-white/15 md:pb-14 md:pt-28">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white/50">
              <span>01 / Current study</span>
              <span className="h-px w-12 bg-[var(--color-accent)]" />
              <span>Helmond / NL</span>
            </div>

            <h1 className="font-display text-[clamp(4.2rem,8.5vw,9.5rem)] font-semibold uppercase leading-[0.7] tracking-[-0.085em]">
              Form<br />
              follows<br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_var(--paper)]">motion.</span>
            </h1>

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/25 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                  {displayName(product.name)}
                </p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/65">
                  A new CAISN construction built around proportion, material and movement.
                </p>
              </div>
              <Price value={product.price} className="font-display text-2xl" />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={`/product/${product.slug}`}
                className="group inline-flex min-h-12 items-center justify-between gap-12 bg-[var(--paper)] px-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
              >
                View the piece
                <span className="transition-transform group-hover:translate-x-1" aria-hidden>↗</span>
              </Link>
              <Link
                href="#collection"
                className="inline-flex min-h-12 items-center border-b border-transparent px-3 text-[11px] uppercase tracking-[0.15em] text-white/60 transition-colors hover:border-white/50 hover:text-white"
              >
                Explore Drop 01
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="product-stage relative order-1 min-h-[54svh] overflow-hidden md:order-2 md:col-span-6 md:min-h-0"
        >
          <motion.div
            initial={reduceMotion ? false : { scale: 1.07, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1.25, ease: [0.16, 0.9, 0.2, 1.02] }}
            className="absolute inset-0"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-7 drop-shadow-[0_38px_52px_rgba(8,9,9,0.22)] md:p-12 lg:p-16"
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-[7%] border border-[var(--ink)]/15" aria-hidden />
          <div className="pointer-events-none absolute bottom-[7%] left-[7%] right-[7%] h-px bg-[var(--ink)]/15" aria-hidden />
          <span className="absolute left-[9%] top-[9%] text-[9px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
            Structure / 001
          </span>
          <span className="tnum absolute bottom-[9%] right-[9%] text-[9px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
            Front elevation
          </span>
          <span className="absolute right-[9%] top-[9%] h-2 w-2 bg-[var(--color-accent)]" aria-hidden />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 border-t border-white/15 px-[var(--gutter)] text-[9px] uppercase tracking-[0.16em] text-white/45 md:grid-cols-4">
        {["Structural fashion", "Designed in the Netherlands", "Limited first construction", "Built, not printed"].map((item) => (
          <span key={item} className="border-r border-white/15 px-4 py-3 first:pl-0 last:border-r-0">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
