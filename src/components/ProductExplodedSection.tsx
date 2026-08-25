"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GarmentScene } from "@/lib/three/GarmentScene";
import { CameraRig } from "@/lib/three/CameraRig";
import { buildGarmentNodes, activeAnnotations, STAGES } from "@/lib/three/garmentModel";
import { supportsWebGL, usePrefersReducedMotion, isLowPowerDevice } from "@/lib/three/capability";
import { ProductViewer } from "@/components/ProductViewer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function currentStageName(progress: number): string {
  let current: string = STAGES[0].name;
  for (const s of STAGES) {
    if (progress >= s.at) current = s.name;
  }
  return current;
}

/** Static, non-animated fallback — preserves all construction info without scroll-scrubbed motion. */
function StaticConstructionList({ spec }: { spec: string }) {
  const nodes = useMemo(() => buildGarmentNodes(spec), [spec]);
  return (
    <section className="px-[var(--gutter)] py-16">
      <p className="mb-6 text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">CONSTRUCTION — FULL BREAKDOWN</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {nodes.map((n) => (
          <div key={n.id} className="flex justify-between border border-[var(--color-line)] px-4 py-3 text-xs">
            <span className="tracking-[0.1em]">{n.label}</span>
            <span className="tnum text-[var(--color-fg-soft)]">{n.spec}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductExplodedSection({ spec, name }: { spec: string; name: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [capable, setCapable] = useState<boolean | null>(null);
  const [lowPower, setLowPower] = useState(false);
  const reduced = usePrefersReducedMotion();
  const nodes = useMemo(() => buildGarmentNodes(spec), [spec]);
  const annotations = useMemo(() => activeAnnotations(nodes, progress), [nodes, progress]);

  useEffect(() => {
    // One-time browser capability probe on mount — see ProductViewer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCapable(supportsWebGL());
    setLowPower(isLowPowerDevice());
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || capable === false || !sectionRef.current) return;
    const pinHeight = lowPower ? "180vh" : "260vh"; // shorter choreography on low-power/mobile devices
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${pinHeight}`,
        pin: pinRef.current,
        scrub: 0.6,
        onUpdate: (self) => setProgress(self.progress),
      });
      return () => trigger.kill();
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced, capable, lowPower]);

  if (reduced) {
    return (
      <div className="space-y-8">
        <div className="px-[var(--gutter)]">
          <ProductViewer spec={spec} label={name} index="00" />
        </div>
        <StaticConstructionList spec={spec} />
      </div>
    );
  }

  if (capable === false) {
    return <StaticConstructionList spec={spec} />;
  }

  return (
    <div ref={sectionRef} className="relative">
      <div ref={pinRef} className="relative flex h-svh flex-col justify-between overflow-hidden px-[var(--gutter)] py-10">
        <div className="flex justify-between text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">
          <span>THE BUILD</span>
          <span className="tnum">{currentStageName(progress)}</span>
        </div>

        <div className="absolute inset-0">
          {visible && capable !== null && (
            <Suspense fallback={null}>
              <Canvas
                dpr={lowPower ? [1, 1.25] : [1, 1.75]}
                camera={{ position: [0, 0, 5.5], fov: 32 }}
                gl={{ antialias: true, alpha: true }}
              >
                <CameraRig progress={progress} />
                <GarmentScene spec={spec} progress={progress} rotation={{ x: 0, y: 0 }} />
              </Canvas>
            </Suspense>
          )}
        </div>

        {/* DOM annotation panel — legible spec callouts, not floating 3D labels */}
        <div className="relative flex max-w-xs flex-col gap-1.5 self-end">
          {annotations.map((n) => (
            <div
              key={n.id}
              className="flex justify-between gap-4 text-[11px] tracking-[0.1em] transition-opacity duration-500"
              style={{ transitionTimingFunction: "var(--ease-drift)" }}
            >
              <span>{n.label}</span>
              <span className="tnum text-[var(--color-fg-soft)]">{n.spec}</span>
            </div>
          ))}
        </div>

        <div className="relative flex items-end justify-between">
          <span className="tnum text-xs text-[var(--color-fg-soft)]">
            {String(Math.round(progress * 100)).padStart(3, "0")}%
          </span>
          <span className="text-xs tracking-[0.1em] text-[var(--color-fg-soft)]">SCROLL TO DECONSTRUCT</span>
        </div>
      </div>
    </div>
  );
}
