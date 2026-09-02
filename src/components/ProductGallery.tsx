"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/commerce/types";
import { ProductVisual } from "@/components/ProductVisual";

/**
 * PDP hero image. With one real photo it behaves exactly like
 * ProductVisual (no thumbnails). With more than one, a thumbnail
 * strip lets the shopper switch the main image — reuses assets
 * already in product.media rather than any new asset type. Caption
 * per thumbnail is derived from its alt text (the part after the
 * em-dash, e.g. "front"/"back"), so this works for any future
 * product's angle set without hardcoding labels.
 */
export function ProductGallery({ product }: { product: Product }) {
  const images = product.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:"));
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return <ProductVisual product={product} />;
  }

  if (images.length === 1) {
    return <ProductVisual product={product} priority />;
  }

  const active = images[activeIndex];
  const captionFor = (alt: string) => (alt.includes("—") ? alt.split("—").pop()?.trim().toUpperCase() : null);

  const thumbs = (
    <div className="flex gap-2 md:flex-col">
      {images.map((img, i) => (
        <button
          key={img.url}
          onClick={() => setActiveIndex(i)}
          aria-label={img.alt}
          aria-current={i === activeIndex}
          className="group flex flex-col items-center gap-1.5"
        >
          <span
            className="product-stage relative block h-16 w-14 overflow-hidden transition-opacity md:h-20 md:w-16"
            style={{
              opacity: i === activeIndex ? 1 : 0.55,
              transitionDuration: "var(--dur-snap)",
            }}
          >
            <Image src={img.url} alt="" aria-hidden fill sizes="80px" className="object-contain p-1.5" />
          </span>
          {captionFor(img.alt) && (
            <span
              className="text-[9px] tracking-[0.1em] transition-colors"
              style={{
                color: i === activeIndex ? "var(--color-fg)" : "var(--color-fg-soft)",
                transitionDuration: "var(--dur-snap)",
              }}
            >
              {captionFor(img.alt)}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    // Thumbnail rail beside the image on desktop (a vertical strip to
    // its left), stacked below it on mobile/tablet where there isn't
    // width to spare for a side rail.
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {thumbs}
      <div className="product-stage relative aspect-[4/5] w-full flex-1 overflow-hidden">
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt}
          fill
          priority
          sizes="(min-width: 768px) 42vw, 90vw"
          className="object-contain p-6 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)]"
        />
      </div>
    </div>
  );
}
