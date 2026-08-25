"use client";

import { useMagnetic } from "@/lib/motion/useMagnetic";
import { CursorTarget } from "@/lib/motion/CustomCursor";

export default function Home() {
  const ctaRef = useMagnetic<HTMLButtonElement>();

  return (
    <main className="relative flex min-h-svh flex-col justify-between overflow-hidden px-[var(--gutter)] py-8">
      {/* index rail — the spine */}
      <div className="pointer-events-none fixed left-0 top-0 hidden h-full w-[var(--rail-width)] flex-col items-center justify-between border-r border-[var(--color-line)] py-8 md:flex">
        <span className="tnum -rotate-90 text-xs tracking-[0.2em] text-[var(--color-fg-soft)]">
          01 / 06
        </span>
      </div>

      <nav className="flex items-center justify-between text-sm tracking-[0.15em]">
        <span className="font-display text-lg font-semibold">CAISN</span>
        <div className="hidden gap-8 md:flex">
          <span>SHOP</span>
          <span>COLLECTION</span>
          <span>ABOUT</span>
        </div>
        <div className="flex gap-6">
          <span>SEARCH</span>
          <span>CART (0)</span>
        </div>
      </nav>

      <section className="flex flex-1 flex-col items-center justify-center text-center">
        <CursorTarget label="EXPLORE">
          <h1 className="font-display select-none text-[16vw] font-semibold leading-[0.85] tracking-tight md:text-[10vw]">
            CAISN
          </h1>
        </CursorTarget>
        <p className="mt-6 max-w-md text-sm text-[var(--color-fg-soft)]">
          built, not printed.
        </p>
      </section>

      <div className="flex items-end justify-between">
        <span className="tnum text-xs text-[var(--color-fg-soft)]">
          EDITION 04 / 620G RAW WOOL
        </span>
        <CursorTarget label="ADD">
          <button
            ref={ctaRef}
            className="rounded-[var(--radius)] border border-[var(--color-fg)] px-6 py-3 text-xs font-medium tracking-[0.15em] transition-colors hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
          >
            ADD TO CART
          </button>
        </CursorTarget>
      </div>
    </main>
  );
}
