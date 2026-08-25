"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Product } from "@/lib/commerce/types";
import { ProductPlate } from "@/components/ProductPlate";
import { CursorTarget } from "@/lib/motion/CustomCursor";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Vertical scroll pins this section and drives a horizontal product
 * progression — a technical lineup sheet, not a carousel. Desktop
 * gets the pinned GSAP scene; mobile and reduced-motion get native
 * horizontal touch scroll with snap, via gsap.matchMedia so neither
 * path is a forced adaptation of the other (same markup either way —
 * only whether ScrollTrigger takes over the transform changes).
 */
export function HorizontalShowcase({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      // Native overflow-scroll is the default (see the track's base classes)
      // so mobile — and desktop under reduced-motion, where this whole
      // matchMedia branch never runs — always has a working way to reach
      // every card. Only override it here, once GSAP actually owns the
      // horizontal transform, and only for the width this branch matches.
      track.style.overflowX = "hidden";
      track.style.scrollSnapType = "none";

      const distance = () => Math.max(0, track.scrollWidth - container.clientWidth);

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        animation: gsap.to(track, { x: () => -distance(), ease: "none" }),
      });

      return () => {
        trigger.kill();
        track.style.overflowX = "";
        track.style.scrollSnapType = "";
        gsap.set(track, { x: 0 });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden md:h-svh">
      <div className="flex items-center justify-between px-[var(--gutter)] pt-10 md:absolute md:inset-x-0 md:top-10 md:z-10 md:pt-0">
        <h2 className="text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">02 / 06 — THE LINEUP</h2>
        <span className="hidden text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)] md:inline">
          SCROLL TO ADVANCE
        </span>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-label="Product showcase — scroll horizontally"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-8 pt-20 outline-none md:h-full md:items-center md:pb-0"
      >
        {products.map((p, i) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="w-[78vw] shrink-0 snap-center sm:w-[56vw] md:w-[42vw] lg:w-[36vw]"
          >
            <CursorTarget label="VIEW">
              <div>
                <ProductPlate label={p.name} spec={p.spec} index={p.id} />
                <div className="mt-3 flex items-center justify-between text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">
                  <span className="tnum">
                    {String(i + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
                  </span>
                  <span>{p.edition}</span>
                </div>
              </div>
            </CursorTarget>
          </Link>
        ))}
      </div>
    </section>
  );
}
