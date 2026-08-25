"use client";

import { useEffect, useRef, useState } from "react";

const VERTICAL_LIMIT = 0.5; // radians — keeps the product from flipping into unusable orientations
const DAMPING = 0.92;
const DRAG_SPEED = 0.006;

/**
 * Pointer + touch orbit with damped inertia. Vertical rotation is
 * clamped so the product can never be dragged upside down or into a
 * disorienting angle — control always resolves to something readable.
 */
export function useDragOrbit(elRef: React.RefObject<HTMLElement | null>) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const clampX = (v: number) => Math.min(VERTICAL_LIMIT, Math.max(-VERTICAL_LIMIT, v));

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };

      const next = {
        x: clampX(rotationRef.current.x + dy * DRAG_SPEED),
        y: rotationRef.current.y + dx * DRAG_SPEED,
      };
      velocity.current = { x: next.x - rotationRef.current.x, y: next.y - rotationRef.current.y };
      rotationRef.current = next;
      setRotation(next);
    };

    const onUp = () => {
      dragging.current = false;
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const tick = () => {
      if (!dragging.current) {
        const v = velocity.current;
        if (Math.abs(v.x) > 0.0001 || Math.abs(v.y) > 0.0001) {
          const next = {
            x: clampX(rotationRef.current.x + v.x),
            y: rotationRef.current.y + v.y,
          };
          rotationRef.current = next;
          velocity.current = { x: v.x * DAMPING, y: v.y * DAMPING };
          setRotation(next);
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [elRef]);

  return rotation;
}
