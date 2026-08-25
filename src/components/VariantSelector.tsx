"use client";

import { Variant } from "@/lib/commerce/types";

export function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: Variant[];
  selected: Variant;
  onSelect: (v: Variant) => void;
}) {
  const colors = Array.from(new Map(variants.map((v) => [v.color, v])).values());
  const sizesForColor = variants.filter((v) => v.color === selected.color);

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">COLOR — {selected.color.toUpperCase()}</p>
        <div className="flex gap-2">
          {colors.map((v) => (
            <button
              key={v.color}
              onClick={() => onSelect(sizesForColor.find((s) => s.color === v.color) ?? v)}
              aria-label={v.color}
              aria-pressed={selected.color === v.color}
              className="h-7 w-7 rounded-full border transition-transform"
              style={{
                backgroundColor: v.colorHex,
                borderColor: selected.color === v.color ? "var(--color-accent)" : "var(--color-line)",
                transform: selected.color === v.color ? "scale(1.15)" : "scale(1)",
                transitionDuration: "var(--dur-snap)",
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">SIZE</p>
        <div className="flex gap-2">
          {sizesForColor.map((v) => (
            <button
              key={v.size}
              disabled={v.stock === 0}
              onClick={() => onSelect(v)}
              className="tnum border px-3.5 py-2 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30"
              style={{
                borderColor: selected.size === v.size ? "var(--color-fg)" : "var(--color-line)",
                backgroundColor: selected.size === v.size ? "var(--color-fg)" : "transparent",
                color: selected.size === v.size ? "var(--color-bg)" : "var(--color-fg)",
                transitionDuration: "var(--dur-snap)",
              }}
            >
              {v.size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
