"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/commerce/types";

/**
 * The homepage's closing signature interaction. Oversized "CAISN"
 * lettering sits behind a real garment crop; as the section enters
 * view, a mask wipes open across the image and the wordmark settles
 * into place — a controlled reveal, not a decorative animation loop.
 * No WebGL: a CSS clip-path transition toggled once by
 * IntersectionObserver. The resting DOM (no inline transform/clip
 * applied until the class flips) is already the fully legible final
 * layout, so it renders correctly with JavaScript disabled — the
 * reveal is progressive enhancement layered on top, and it fires once
 * (no scroll hijacking, no re-triggering, no long animation).
 */
export function BrandMoment({ product }: { product?: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Construction-detail crop of the back panel — distinct from every
  // other homepage use of this image (hero: full front garment,
  // product card: commerce, About: close-up neck branding, Campaign:
  // off-center construction detail). This one is a wide, low crop
  // framed to sit behind oversized type rather than stand alone.
  const images = product?.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:")) ?? [];
  const image = images[1] ?? images[0];

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-[var(--color-line)] bg-[var(--ink)] py-24 md:py-32">
      {image && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            transitionProperty: "clip-path",
            transitionDuration: "var(--dur-drift)",
            transitionTimingFunction: "var(--ease-drift)",
          }}
        >
          <Image
            src={image.url}
            alt=""
            fill
            sizes="100vw"
            className="scale-[1.4] object-cover object-[70%_20%] grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/60 to-[var(--ink)]" />
        </div>
      )}

      <div className="relative px-[var(--gutter)] text-center">
        <span className="tnum text-[10px] tracking-[0.15em] text-[var(--color-accent-soft)]">CAISN</span>
        <p
          className="font-display mt-3 text-[16vw] font-semibold leading-[0.85] tracking-tight text-[var(--paper)] md:text-8xl"
          style={{
            transform: inView ? "translateY(0)" : "translateY(14px)",
            transitionProperty: "transform",
            transitionDuration: "var(--dur-drift)",
            transitionTimingFunction: "var(--ease-drift)",
          }}
        >
          built, not
          <br />
          printed<span className="text-[var(--color-accent-soft)]">.</span>
        </p>
        <span
          aria-hidden
          className="mx-auto mt-6 block h-px bg-[var(--color-accent)]"
          style={{
            width: inView ? "5rem" : "0rem",
            transitionProperty: "width",
            transitionDuration: "var(--dur-drift)",
            transitionTimingFunction: "var(--ease-drift)",
            transitionDelay: "150ms",
          }}
        />
      </div>
    </section>
  );
}
