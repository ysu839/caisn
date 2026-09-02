import Image from "next/image";
import { Product } from "@/lib/commerce/types";

/**
 * Flat-lay set gallery for the FORMA TRACKSUIT: front and back of both
 * pieces shown together in one 2x2 grid, rather than a single-image
 * switcher — the requested "pose" for a set listing. Reads directly
 * from product.media (which carries all four real angles for this
 * product — see data.ts), so it stays correct if the media order ever
 * changes; each cell is matched by its alt text rather than array index.
 */
export function TracksuitGallery({ product }: { product: Product }) {
  const images = product.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:"));
  const find = (needle: string) => images.find((m) => m.alt.toLowerCase().includes(needle));

  const cells = [
    { media: find("zip-up front"), label: "ZIP-UP — FRONT" },
    { media: find("zip-up back"), label: "ZIP-UP — BACK" },
    { media: find("jogger front"), label: "JOGGER — FRONT" },
    { media: find("jogger back"), label: "JOGGER — BACK" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cells.map((cell, i) => (
        <div key={i} className="product-stage relative aspect-[4/5] overflow-hidden">
          {cell.media && (
            <>
              <Image
                src={cell.media.url}
                alt={cell.media.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 768px) 21vw, 45vw"
                className="object-contain p-4 drop-shadow-[0_14px_22px_rgba(10,10,10,0.14)]"
              />
              <span className="pointer-events-none absolute bottom-2 left-2 text-[9px] tracking-[0.1em] text-white/55">
                {cell.label}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
