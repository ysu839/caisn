"use client";

import { useSyncExternalStore } from "react";

/**
 * Device capability gate for the 3D layer. A device that can't
 * reliably run WebGL falls back to the static ProductPlate rather
 * than a broken canvas — the experimental layer never blocks commerce.
 */
export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Hydration-safe reduced-motion hook. Reading matchMedia directly in a
 * render body mismatches SSR (always false) vs client, which React
 * flags as a hydration error — useSyncExternalStore resolves this the
 * same way the custom cursor's pointer-fine check does.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

/** Rough low-power heuristic for texture/geometry downgrades on mobile. */
export function isLowPowerDevice(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowCores = (nav.hardwareConcurrency ?? 8) <= 4;
  const lowMemory = (nav.deviceMemory ?? 8) <= 4;
  return isCoarsePointer() && (lowCores || lowMemory);
}
