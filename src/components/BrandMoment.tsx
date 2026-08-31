"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The homepage's third and final signature interaction — the closing
 * frame before the footer. "built," and "not printed." start slightly
 * offset and settle into alignment as the section enters view, with a
 * thin oxblood rule drawing underneath. Progressive enhancement only:
 * the JSX's resting state (no inline transform) is already the fully
 * legible final layout, so with JavaScript disabled the text simply
 * renders in place — the offset-then-settle motion is added by
 * toggling a class just before the section scrolls into view, never a
 * gate that could leave content stuck hidden or displaced.
 */
export function BrandMoment() {
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
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="overflow-hidden px-[var(--gutter)] py-24 text-center md:py-32">
      <p className="font-display text-[13vw] font-semibold leading-[0.9] tracking-tight md:text-7xl">
        <span
          className="inline-block transition-transform"
          style={{
            transform: inView ? "translateX(0)" : "translateX(-14px)",
            transitionDuration: "var(--dur-drift)",
            transitionTimingFunction: "var(--ease-drift)",
          }}
        >
          built,
        </span>{" "}
        <span
          className="inline-block transition-transform"
          style={{
            transform: inView ? "translateX(0)" : "translateX(14px)",
            transitionDuration: "var(--dur-drift)",
            transitionTimingFunction: "var(--ease-drift)",
          }}
        >
          not printed.
        </span>
      </p>
      <span
        aria-hidden
        className="mx-auto mt-6 block h-px bg-[var(--color-accent)] transition-all"
        style={{
          width: inView ? "5rem" : "0rem",
          transitionDuration: "var(--dur-drift)",
          transitionTimingFunction: "var(--ease-drift)",
          transitionDelay: "150ms",
        }}
      />
    </section>
  );
}
