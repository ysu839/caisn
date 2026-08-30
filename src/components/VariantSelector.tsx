"use client";

import { Variant } from "@/lib/commerce/types";

/**
 * `selected` is null until the shopper has explicitly chosen a size —
 * no size is pre-selected on load, so an inattentive shopper can't
 * add the wrong one by default. `activeColor` (defaulting to the
 * first variant's color) drives which color swatch reads as chosen
 * and which sizes are listed, independent of size selection.
 */
export function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: Variant[];
  selected: Variant | null;
  onSelect: (v: Variant | null) => void;
}) {
  const colors = Array.from(new Map(variants.map((v) => [v.color, v])).values());
  const activeColor = selected?.color ?? colors[0]?.color;
  const sizesForColor = variants.filter((v) => v.color === activeColor);

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">COLOR — {activeColor?.toUpperCase()}</p>
        <div className="flex gap-1">
          {colors.map((v) => (
            <button
              key={v.color}
              onClick={() => onSelect(null)}
              aria-label={v.color}
              aria-pressed={activeColor === v.color}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                className="h-7 w-7 rounded-full border transition-transform"
                style={{
                  backgroundColor: v.colorHex,
                  borderColor: activeColor === v.color ? "var(--color-accent)" : "var(--color-line)",
                  transform: activeColor === v.color ? "scale(1.15)" : "scale(1)",
                  transitionDuration: "var(--dur-snap)",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">
          SIZE{!selected && <span className="text-[var(--color-accent)]"> — SELECT</span>}
        </p>
        <div className="flex gap-2">
          {sizesForColor.map((v) => {
            const isSelected = selected?.size === v.size && selected?.color === v.color;
            return (
              <button
                key={v.size}
                disabled={v.stock === 0}
                onClick={() => onSelect(v)}
                aria-pressed={isSelected}
                className="tnum min-h-11 min-w-11 border px-3.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                style={{
                  borderColor: isSelected ? "var(--color-accent)" : "var(--color-line)",
                  backgroundColor: isSelected ? "var(--color-accent)" : "transparent",
                  color: isSelected ? "var(--paper)" : "var(--color-fg)",
                  transitionDuration: "var(--dur-snap)",
                }}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
