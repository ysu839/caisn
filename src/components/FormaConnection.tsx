"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Product, displayName } from "@/lib/commerce/types";
import { Price } from "@/components/Price";

/**
 * The second of three homepage signature interactions: as this
 * section scrolls through view, the zip-up and jogger images drift
 * toward each other and a seam line closes between them — a visual
 * answer to "are these sold together or separately?" rather than a
 * decorative demo. Scroll-linked via Framer Motion's useScroll (not a
 * pinned/hijacked scroll — the page scrolls normally throughout), and
 * fully inert under prefers-reduced-motion (images sit at rest, seam
 * line static).
 */
export function FormaConnection({
  zipUp,
  jogger,
  tracksuit,
}: {
  zipUp: Product;
  jogger: Product;
  tracksuit: Product;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.85", "end 0.4"] });

  const zipUpX = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-40, 0]);
  const joggerX = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [40, 0]);
  const seamScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const zipUpImage = zipUp.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));
  const joggerImage = jogger.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));

  return (
    <section ref={sectionRef} className="bg-[var(--ink)] px-[var(--gutter)] py-20 text-[var(--paper)] md:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <span className="tnum text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent-soft)]">The Forma System / 02</span>
        <h2 className="font-display mx-auto mt-4 max-w-4xl text-[clamp(3rem,7vw,7.5rem)] font-medium uppercase leading-[0.84] tracking-[-0.06em]">
          Apart by design.<br />Better together.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/55">
          One visual system across two relaxed silhouettes. Wear either piece alone or complete the construction.
        </p>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-5xl grid-cols-2 items-center gap-px overflow-hidden bg-white/15">
        <motion.div style={{ x: zipUpX }} className="product-stage relative aspect-[4/5] overflow-hidden">
          {zipUpImage && (
            <Image
              src={zipUpImage.url}
              alt={zipUpImage.alt}
              fill
              sizes="(min-width: 768px) 30vw, 45vw"
              className="object-contain p-6 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)]"
            />
          )}
        </motion.div>
        <motion.div style={{ x: joggerX }} className="product-stage relative aspect-[4/5] overflow-hidden">
          {joggerImage && (
            <Image
              src={joggerImage.url}
              alt={joggerImage.alt}
              fill
              sizes="(min-width: 768px) 30vw, 45vw"
              className="object-contain p-6 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)]"
            />
          )}
        </motion.div>
        {/* Seam line — closes as the two garments align. Purely
            decorative (aria-hidden); the real relationship is stated
            in the text/links around it. */}
        <motion.span
          aria-hidden
          style={{ scaleY: reduceMotion ? 1 : seamScale }}
          className="pointer-events-none absolute inset-y-6 left-1/2 w-px origin-center -translate-x-1/2 bg-[var(--color-accent)]"
        />
      </div>

      <div className="mx-auto mt-10 max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          <Link
            href={`/product/${zipUp.slug}`}
            className="text-white/70 underline underline-offset-4 transition-colors hover:text-[var(--color-accent-soft)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
          >
            View {displayName(zipUp.name).replace("CAISN ", "")}
            {" — "}
            <Price value={zipUp.price} className="inline" />
          </Link>
          <Link
            href={`/product/${jogger.slug}`}
            className="text-white/70 underline underline-offset-4 transition-colors hover:text-[var(--color-accent-soft)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
          >
            View {displayName(jogger.name).replace("CAISN ", "")}
            {" — "}
            <Price value={jogger.price} className="inline" />
          </Link>
        </div>

        <Link
          href={`/product/${tracksuit.slug}`}
          className="group mt-8 flex items-center justify-between border-t border-white/20 pt-6 transition-colors hover:border-[var(--color-accent-soft)]"
          style={{ transitionDuration: "var(--dur-snap)" }}
        >
          <div>
            <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[9px] tracking-[0.1em] text-[var(--paper)]">
              SET — 2 PIECES
            </span>
            <p className="font-display mt-2 text-xl font-medium">View Complete Set</p>
            <p className="text-sm text-white/50">Both pieces, one price.</p>
          </div>
          <Price value={tracksuit.price} className="font-display text-2xl" />
        </Link>
      </div>
    </section>
  );
}
