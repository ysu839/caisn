"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Product, displayName } from "@/lib/commerce/types";

/** Image-led campaign hero inspired by independent fashion lookbooks. */
export function HomeHero({ product }: { product?: Product }) {
  const reduceMotion = useReducedMotion();
  const image = product?.media.find((item) => item.type === "image" && !item.url.startsWith("plate:"));

  if (!product || !image) return null;

  return (
    <section className="relative min-h-[82svh] overflow-hidden bg-[#b8b2aa] text-white md:min-h-screen">
      <motion.div
        initial={reduceMotion ? false : { scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={image.url}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_25%] md:object-[50%_28%]"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/5 to-black/45" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex min-h-[82svh] flex-col justify-between px-[var(--gutter)] pb-7 pt-28 md:min-h-screen md:pb-10 md:pt-32"
      >
        <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] text-white/75">
          <span>Structure 01</span>
          <span>Helmond / NL</span>
        </div>

        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/75">New construction</p>
            <h1 className="font-display max-w-[9ch] text-[clamp(3rem,7vw,7rem)] font-medium uppercase leading-[0.82] tracking-[-0.065em]">
              Form built for motion.
            </h1>
          </div>

          <div className="md:col-span-4 md:col-start-9 md:justify-self-end">
            <p className="max-w-[34ch] text-xs leading-relaxed text-white/85 md:text-sm">
              {displayName(product.name)} — washed weight, controlled volume and quiet structural detail.
            </p>
            <Link
              href={`/product/${product.slug}`}
              className="mt-5 inline-flex items-center gap-8 border border-white/75 px-5 py-3 text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-white hover:text-black"
            >
              Discover the piece <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
