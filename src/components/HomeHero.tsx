"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMagnetic } from "@/lib/motion/useMagnetic";
import { CursorTarget } from "@/lib/motion/CustomCursor";
import { Product, displayName } from "@/lib/commerce/types";
import { Price } from "@/components/Price";

/**
 * Architectural editorial hero: the oversized CAISN wordmark sits
 * behind the garment rather than beside it, the garment overlaps it
 * directly, and a small inset shows the back view — closer to a
 * campaign composition while staying a functioning product hero (name,
 * price and CTA are never hidden behind the typography).
 */
export function HomeHero({ product }: { product?: Product }) {
  const ctaRef = useMagnetic<HTMLAnchorElement>();
  const frameRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const images = product?.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:")) ?? [];
  const front = images[0];
  const back = images[1];

  // Reveal once mounted — fast (see the 600ms transition below), never
  // a multi-second wait, and skipped visually under reduced-motion
  // (the element is already in its resting position, just not yet
  // "ready" for the opacity transition, which reduced-motion CSS below
  // makes instant anyway).
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Very small pointer-driven parallax between the background wordmark
  // and the garment — desktop, fine-pointer, motion-enabled only.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !fine) return;
    const el = frameRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x, y });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="relative overflow-hidden px-[var(--gutter)] pb-10 pt-6 md:pb-16">
      <div className="pointer-events-none fixed left-0 top-0 hidden h-full w-[var(--rail-width)] flex-col items-center justify-center border-r border-[var(--color-line)] md:flex">
        <span className="tnum -rotate-90 whitespace-nowrap text-xs tracking-[0.2em] text-[var(--color-fg-soft)]">
          CAISN — BUILT, NOT PRINTED
        </span>
      </div>

      <div
        ref={frameRef}
        className="relative border border-[var(--color-line)] px-[max(4vw,var(--gutter))] py-10 md:py-16"
      >
        {/* Oversized wordmark behind the garment — a background layer,
            not a heading; the real <h1> is the small label below so
            screen readers get "CAISN" once, not shouted twice. */}
        <span
          aria-hidden
          className="font-display pointer-events-none absolute inset-x-0 top-1/2 block -translate-y-1/2 select-none text-center text-[26vw] font-semibold leading-none tracking-tight text-[var(--color-fg)] opacity-[0.06] md:text-[15vw]"
          style={{
            transform: `translate(${tilt.x * -6}px, calc(-50% + ${tilt.y * -6}px))`,
            transitionDuration: "var(--dur-drift)",
            transitionTimingFunction: "var(--ease-drift)",
            transitionProperty: "transform",
          }}
        >
          CAISN
        </span>

        <div className="relative grid grid-cols-1 items-end gap-8 md:grid-cols-[1fr_auto] md:gap-12">
          <div className="relative z-10">
            <div className="flex items-baseline gap-3">
              <h1 className="font-display text-sm font-semibold tracking-[0.2em]">CAISN</h1>
              <span className="text-xs tracking-[0.1em] text-[var(--color-fg-soft)]">built, not printed.</span>
            </div>

            {product && front && (
              <div
                className="relative mt-6 opacity-0 transition-[opacity,transform]"
                style={{
                  opacity: ready ? 1 : 0,
                  transform: ready ? "translateY(0)" : "translateY(12px)",
                  transitionDuration: "600ms",
                  transitionTimingFunction: "var(--ease-drift)",
                }}
              >
                <span className="tnum text-[10px] tracking-[0.15em] text-[var(--color-accent)]">
                  CONSTRUCTION 01 {product.edition && `/ ${product.edition.toUpperCase()}`}
                </span>

                <Link href={`/product/${product.slug}`} className="group relative mt-4 block">
                  <div
                    className="relative aspect-[4/5] w-full max-w-md overflow-hidden bg-[var(--surface-plate)]"
                    style={{
                      transform: `translate(${tilt.x * 4}px, ${tilt.y * 4}px)`,
                      transitionDuration: "var(--dur-drift)",
                      transitionTimingFunction: "var(--ease-drift)",
                      transitionProperty: "transform",
                    }}
                  >
                    <Image
                      src={front.url}
                      alt={front.alt}
                      fill
                      priority
                      sizes="(min-width: 768px) 40vw, 90vw"
                      className="object-contain p-8 drop-shadow-[0_24px_36px_rgba(10,10,10,0.18)] transition-transform group-hover:scale-[1.02]"
                      style={{ transitionDuration: "var(--dur-drift)", transitionTimingFunction: "var(--ease-drift)" }}
                    />
                  </div>

                  {back && (
                    <div
                      className="absolute -bottom-6 -right-6 h-24 w-20 overflow-hidden bg-[var(--surface-plate)] opacity-0 shadow-lg ring-1 ring-[var(--color-accent)] transition-opacity md:h-32 md:w-28"
                      style={{
                        opacity: ready ? 1 : 0,
                        transitionDelay: "150ms",
                        transitionDuration: "500ms",
                      }}
                    >
                      <Image src={back.url} alt="" aria-hidden fill sizes="112px" className="object-contain p-3" />
                    </div>
                  )}
                </Link>

                <p className="font-display mt-8 text-2xl font-medium">{displayName(product.name)}</p>
                <Price value={product.price} className="font-display mt-1 block text-lg" />
                <CursorTarget label="VIEW">
                  <Link
                    ref={ctaRef}
                    href={`/product/${product.slug}`}
                    className="mt-5 inline-block whitespace-nowrap rounded-[var(--radius)] border border-[var(--color-fg)] px-6 py-3 text-xs font-medium tracking-[0.15em] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--paper)]"
                    style={{ transitionDuration: "var(--dur-snap)" }}
                  >
                    VIEW PRODUCT
                  </Link>
                </CursorTarget>
              </div>
            )}
          </div>

          <div className="hidden text-right md:block">
            <span className="tnum text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">FIRST EDITION</span>
          </div>
        </div>
      </div>
    </section>
  );
}
