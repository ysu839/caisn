"use client";

/**
 * Art-directed placeholder for product media — a "technical drawing"
 * plate, not a stock photo or gradient card. Coherent enough to read
 * as intentional; swap for real photography/video without touching
 * layout (same aspect ratio, same slot).
 */
export function ProductPlate({
  label,
  spec,
  index = "01",
  className,
}: {
  label: string;
  spec: string;
  index?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden border border-[var(--color-line)] bg-[var(--color-bg)] p-4 ${className ?? ""}`}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.9]"
        viewBox="0 0 400 500"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line x1="0" y1="0" x2="400" y2="500" stroke="var(--color-line)" strokeWidth="1" />
        <line x1="400" y1="0" x2="0" y2="500" stroke="var(--color-line)" strokeWidth="1" />
        <rect x="60" y="70" width="280" height="360" fill="none" stroke="var(--color-fg)" strokeWidth="1.25" />
        <circle cx="200" cy="250" r="70" fill="none" stroke="var(--color-fg)" strokeWidth="0.75" />
      </svg>
      <div className="relative flex justify-between text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">
        <span className="tnum">{index}</span>
        <span>PLATE</span>
      </div>
      <div className="relative">
        <p className="font-display text-lg font-semibold leading-tight">{label}</p>
        <p className="tnum mt-1 text-[10px] tracking-[0.1em] text-[var(--color-fg-soft)]">{spec}</p>
      </div>
    </div>
  );
}
