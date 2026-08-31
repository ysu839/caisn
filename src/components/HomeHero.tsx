"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMagnetic } from "@/lib/motion/useMagnetic";
import { CursorTarget } from "@/lib/motion/CustomCursor";
import { Product, displayName } from "@/lib/commerce/types";
import { Price } from "@/components/Price";

/**
 * CAISN / CONTROLLED DISTORTION hero. The garment is the dominant
 * element — an oversized cropped wordmark sits behind it and a second
 * fragment overlaps its lower edge in front, both purely decorative
 * (aria-hidden) so the real product name/price/CTAs below carry the
 * actual information. The panel-style reveal is a plain CSS animation
 * (see .hero-panel-reveal in globals.css) — fully visible with
 * JavaScript disabled, not gated behind a scripted opacity state.
 * Pointer parallax is a pure enhancement layered on top of that.
 */
export function HomeHero({ product }: { product?: Product }) {
  const shopRef = useMagnetic<HTMLAnchorElement>();
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const images = product?.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:")) ?? [];
  const front = images[0];
  const back = images[1];

  // Very small pointer-driven parallax between the background wordmark
  // and the garment — desktop, fine-pointer, motion-enabled only. Pure
  // enhancement: the hero is already complete without it.
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
    <section className="relative overflow-hidden px-[var(--gutter)] pb-12 pt-6 md:pb-20">
      <div className="pointer-events-none fixed left-0 top-0 hidden h-full w-[var(--rail-width)] flex-col items-center justify-center border-r border-[var(--color-line)] md:flex">
        <span className="tnum -rotate-90 whitespace-nowrap text-xs tracking-[0.2em] text-[var(--color-fg-soft)]">
          CAISN — BUILT, NOT PRINTED
        </span>
      </div>

      <div ref={frameRef} className="relative">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-sm font-semibold tracking-[0.2em]">CAISN</h1>
          <span className="text-xs tracking-[0.1em] text-[var(--color-fg-soft)]">built, not printed.</span>
        </div>

        {/* Oversized cropped wordmark behind the garment — decorative
            layer, not a heading (the real <h1> is above). */}
        <span
          aria-hidden
          className="font-display pointer-events-none absolute inset-x-0 top-1/2 block -translate-y-1/2 select-none text-center text-[30vw] font-semibold leading-none tracking-tight text-[var(--color-fg)] opacity-[0.05] md:text-[16vw]"
          style={{
            transform: `translate(${tilt.x * -8}px, calc(-50% + ${tilt.y * -8}px))`,
            transitionDuration: "var(--dur-drift)",
            transitionTimingFunction: "var(--ease-drift)",
            transitionProperty: "transform",
          }}
        >
          CAISN
        </span>

        <div className="relative mt-8 grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-6">
          {/* GARMENT — dominant, full-bleed within its column. Panel
              reveal runs via CSS (.hero-panel-reveal), not JS state. */}
          {product && front && (
            <div className="relative md:col-span-7 md:col-start-1">
              <Link href={`/product/${product.slug}`} className="group relative block">
                <div
                  className="hero-panel-reveal relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-plate)] md:aspect-[5/6]"
                  style={{
                    transform: `translate(${tilt.x * 5}px, ${tilt.y * 5}px)`,
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
                    sizes="(min-width: 768px) 55vw, 92vw"
                    className="object-contain p-6 drop-shadow-[0_28px_40px_rgba(10,10,10,0.2)] transition-transform group-hover:scale-[1.02] md:p-10"
                    style={{ transitionDuration: "var(--dur-drift)", transitionTimingFunction: "var(--ease-drift)" }}
                  />
                  {/* A cropped wordmark fragment in front of the garment's
                      lower edge — partial letterforms only (overflow
                      clips it), so it reads as graphic distortion rather
                      than a duplicate label. */}
                  <span
                    aria-hidden
                    className="font-display pointer-events-none absolute -bottom-[6%] left-1/2 block -translate-x-1/2 select-none text-[13vw] font-semibold leading-none tracking-tight text-[var(--ink)] opacity-[0.85] mix-blend-overlay md:text-[7vw]"
                  >
                    CAISN
                  </span>
                </div>
                {/* Oxblood alignment line — a single signature mark
                    connecting the garment to the info panel. */}
                <span
                  aria-hidden
                  className="absolute -bottom-5 left-0 hidden h-px w-16 bg-[var(--color-accent)] md:block"
                />
              </Link>

              {back && (
                <div
                  className="hero-fade-up absolute -right-4 -top-4 hidden h-28 w-24 overflow-hidden bg-[var(--surface-plate)] shadow-lg ring-1 ring-[var(--color-accent)] md:block md:h-36 md:w-28"
                  style={{ animationDelay: "250ms" }}
                >
                  <Image src={back.url} alt="" aria-hidden fill sizes="112px" className="object-contain p-3" />
                </div>
              )}
            </div>
          )}

          {/* INFO — name, price, two CTAs. Never hidden behind the
              garment or the wordmark layers. */}
          {product && (
            <div className="hero-fade-up md:col-span-5 md:col-start-8" style={{ animationDelay: "120ms" }}>
              <span className="tnum text-[10px] tracking-[0.15em] text-[var(--color-accent)]">
                CONSTRUCTION 01 {product.edition && `/ ${product.edition.toUpperCase()}`}
              </span>
              <p className="font-display mt-3 text-4xl font-medium leading-[0.95] md:text-5xl">
                {displayName(product.name)}
              </p>
              <Price value={product.price} className="font-display mt-3 block text-xl" />

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <CursorTarget label="VIEW">
                  <Link
                    ref={shopRef}
                    href={`/product/${product.slug}`}
                    className="inline-block whitespace-nowrap rounded-[var(--radius)] border border-[var(--color-fg)] bg-[var(--color-fg)] px-6 py-3 text-xs font-medium tracking-[0.15em] text-[var(--color-bg)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]"
                    style={{ transitionDuration: "var(--dur-snap)" }}
                  >
                    SHOP ECHO
                  </Link>
                </CursorTarget>
                <Link
                  href="#collection"
                  className="inline-block whitespace-nowrap text-xs font-medium tracking-[0.15em] text-[var(--color-fg-soft)] underline underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
                  style={{ transitionDuration: "var(--dur-snap)" }}
                >
                  EXPLORE DROP 01
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
