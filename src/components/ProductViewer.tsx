"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { GarmentScene } from "@/lib/three/GarmentScene";
import { useDragOrbit } from "@/lib/three/useDragOrbit";
import { supportsWebGL, usePrefersReducedMotion } from "@/lib/three/capability";
import { CursorTarget } from "@/lib/motion/CustomCursor";
import { ProductPlate } from "@/components/ProductPlate";

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="tnum text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">LOADING PLATE…</span>
    </div>
  );
}

export function ProductViewer({
  spec,
  label,
  index,
}: {
  spec: string;
  label: string;
  index: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [capable, setCapable] = useState<boolean | null>(null);
  const rotation = useDragOrbit(dragTargetRef);

  useEffect(() => {
    // One-time browser capability probe on mount — not a subscription,
    // and SSR always renders `capable === null` (loading) so there is
    // no hydration mismatch to worry about here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCapable(supportsWebGL());
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reduced = usePrefersReducedMotion();
  // Reduced motion: keep the static plate — retains all product
  // information, drops the WebGL layer entirely rather than a
  // motionless-but-still-rendering canvas.
  if (capable === false || reduced) {
    return <ProductPlate label={label} spec={spec} index={index} />;
  }

  return (
    <div ref={containerRef} className="relative aspect-[4/5] w-full border border-[var(--color-line)]">
      <div ref={dragTargetRef} className="absolute inset-0">
        <CursorTarget label="DRAG" className="h-full w-full">
          {visible && capable !== null && (
            <Suspense fallback={<Loading />}>
              <Canvas
                frameloop="demand"
                dpr={[1, 1.75]}
                camera={{ position: [0, 0, 5.5], fov: 32 }}
                gl={{ antialias: true, alpha: true }}
              >
                <GarmentScene spec={spec} progress={0} rotation={rotation} />
              </Canvas>
            </Suspense>
          )}
          {!visible && <Loading />}
        </CursorTarget>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">
        DRAG TO ROTATE
      </div>
    </div>
  );
}
