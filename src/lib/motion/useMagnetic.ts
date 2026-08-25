"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "./tokens";

/**
 * Magnetic pull for CTAs / nav items — a handshake, not a chase.
 * Pull resolves the instant contact is "made"; capped small so the
 * element never travels far from its resting position.
 */
export function useMagnetic<T extends HTMLElement>(
  strength: number = motion.magnetic.strength,
  radius: number = motion.magnetic.radius
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        const pull = 1 - dist / radius;
        gsap.to(el, {
          x: dx * pull * (strength / radius),
          y: dy * pull * (strength / radius),
          duration: motion.duration.snap,
          ease: "power3.out",
          overwrite: true,
        });
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: motion.duration.snap,
          ease: "power3.out",
          overwrite: true,
        });
      }
    };

    const handleLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: motion.duration.snap,
        ease: "power3.out",
      });
    };

    window.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [strength, radius]);

  return ref;
}
