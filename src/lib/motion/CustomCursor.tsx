"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";

function subscribeNoop() {
  return () => {};
}

function useFinePointerAndMotionEnabled() {
  return useSyncExternalStore(
    subscribeNoop,
    () =>
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

type CursorLabel = "" | "VIEW" | "DRAG" | "EXPLORE" | "ADD";

const CursorContext = createContext<{
  setLabel: (label: CursorLabel) => void;
} | null>(null);

export function useCursor() {
  const ctx = useContext(CursorContext);
  return ctx?.setLabel ?? (() => {});
}

/**
 * CAISN cursor — a quiet narrator, one imperative word.
 * Disabled entirely on coarse pointers (touch) and reduced-motion.
 */
export function CustomCursorProvider({ children }: { children: React.ReactNode }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<CursorLabel>("");
  const enabled = useFinePointerAndMotionEnabled();

  useEffect(() => {
    if (!enabled) return;
    const el = dotRef.current;
    if (!el) return;

    const move = (e: PointerEvent) => {
      gsap.to(el, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: "power3.out",
      });
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [enabled]);

  return (
    <CursorContext.Provider value={{ setLabel }}>
      {enabled && (
        <div
          ref={dotRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        >
          <div
            className={`flex items-center justify-center rounded-full border border-[var(--paper)] transition-[width,height] duration-200 ${
              label ? "h-16 w-16" : "h-2.5 w-2.5"
            }`}
          >
            {label && (
              <span className="font-body text-[10px] font-medium tracking-[0.15em] text-[var(--paper)]">
                {label}
              </span>
            )}
          </div>
        </div>
      )}
      <div className={enabled ? "cursor-none-fine" : ""}>{children}</div>
    </CursorContext.Provider>
  );
}

/** Attach to any hoverable to set the cursor's contextual verb. */
export function CursorTarget({
  label,
  children,
  className,
}: {
  label: CursorLabel;
  children: React.ReactNode;
  className?: string;
}) {
  const setLabel = useCursor();
  return (
    <div
      className={className}
      onPointerEnter={() => setLabel(label)}
      onPointerLeave={() => setLabel("")}
    >
      {children}
    </div>
  );
}
