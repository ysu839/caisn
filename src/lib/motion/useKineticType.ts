"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "./tokens";
import { usePrefersReducedMotion } from "@/lib/three/capability";

const MAX_VELOCITY_PX_PER_FRAME = 55; // clamp — beyond this, no further distortion
const BASE_WEIGHT = 600; // matches the element's static font-semibold at rest
const MAX_WEIGHT_BOOST = 200; // 600 -> 800 at full velocity, stays comfortably readable
const BASE_WIDTH = 100;
const MAX_WIDTH_BOOST = 6; // 100 -> 106, deliberately subtle — no excessive distortion
const SETTLE_EPSILON = 0.003;

/**
 * Kinetic typography — variable-font weight/width react to scroll
 * VELOCITY, not scroll position, using the same "snap" (instant
 * reaction) / "drift" (natural decay) two-speed language as the rest
 * of the CAISN motion system. Built on gsap.ticker rather than a raw
 * rAF loop or a second animation library — still GSAP, just driving
 * font-variation-settings directly instead of a tween target.
 *
 * The ticker callback is only attached while intensity is non-zero:
 * a scroll event starts it, decay stops and detaches it once settled,
 * so nothing runs on an idle page.
 */
export function useKineticType<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      // Mobile/touch gets static typography — no scroll-velocity listener,
      // no ticker, nothing running in the background on the device class
      // least able to spare it.
      return;
    }

    const intensity = { current: 0 };
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let ticking = false;

    // decayPerSecond chosen so intensity falls to ~2% after one "drift"
    // duration — the natural-return speed already defined for scroll-
    // scrubbed motion elsewhere in the app.
    const decayPerSecond = Math.pow(0.02, 1 / motion.duration.drift);

    const applyStyle = (i: number) => {
      const weight = Math.round(BASE_WEIGHT + MAX_WEIGHT_BOOST * i);
      const width = +(BASE_WIDTH + MAX_WIDTH_BOOST * i).toFixed(2);
      el.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${width}`;
    };

    const tick = (_time: number, deltaMs: number) => {
      intensity.current *= Math.pow(decayPerSecond, deltaMs / 1000);
      if (intensity.current < SETTLE_EPSILON) {
        intensity.current = 0;
        applyStyle(0);
        gsap.ticker.remove(tick);
        ticking = false;
        return;
      }
      applyStyle(intensity.current);
    };

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(1, now - lastTime); // ms, guard against 0
      const velocity = ((y - lastY) / dt) * 16.67; // normalize to px/frame @60fps
      lastY = y;
      lastTime = now;

      const clamped = Math.min(1, Math.abs(velocity) / MAX_VELOCITY_PX_PER_FRAME);
      // Snap upward instantly on new velocity (matches the "snap" — direct,
      // immediate reaction); decay handles the return to rest.
      if (clamped > intensity.current) {
        intensity.current = clamped;
        applyStyle(intensity.current);
      }
      if (!ticking) {
        ticking = true;
        gsap.ticker.add(tick);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (ticking) gsap.ticker.remove(tick);
      el.style.fontVariationSettings = "";
    };
  }, [reducedMotion]);

  return ref;
}
