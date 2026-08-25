"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Odometer-style price transition — digits exit/enter vertically
 * along their own axis, alignment preserved, extremely fast.
 */
export function AnimatedPrice({
  value,
  currency = "€",
  className,
}: {
  value: number;
  currency?: string;
  className?: string;
}) {
  const digits = String(value).split("");

  return (
    <span className={`tnum inline-flex overflow-hidden ${className ?? ""}`}>
      <span aria-hidden={false} className="sr-only">
        {currency}
        {value}
      </span>
      <span aria-hidden className="inline-flex">
        <span className="inline-block">{currency}</span>
        {digits.map((d, i) => (
          <span key={`${i}-slot`} className="relative inline-block h-[1.2em] w-[0.62em] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={d + i}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 inline-block"
              >
                {d}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </span>
    </span>
  );
}
