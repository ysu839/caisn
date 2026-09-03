"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductMedia } from "@/lib/commerce/types";

/**
 * Product-grid image with a restrained loading state — a small static
 * CAISN mark on the plate, not a shimmer/skeleton — that fades out as
 * the real photo fades in once decoded. Fixes a real cold-cache issue
 * where a card could sit visually blank for ~1-2s next to already-
 * loaded neighbors with nothing marking it as "still coming."
 */
export function ProductCardImage({
  front,
  back,
  secondaryFront,
  priority,
}: {
  front: ProductMedia;
  back?: ProductMedia;
  secondaryFront?: ProductMedia;
  priority: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  if (secondaryFront) {
    return (
      <div className="product-stage relative aspect-[4/5] w-full overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-semibold tracking-[0.3em] text-[var(--color-line)] transition-opacity"
          style={{ opacity: loaded ? 0 : 1, transitionDuration: "200ms" }}
        >
          C
        </span>
        <div className="flex h-full w-full">
          <div className="relative h-full flex-1">
            <Image
              src={front.url}
              alt={front.alt}
              fill
              priority={priority}
              onLoad={() => setLoaded(true)}
              sizes="(min-width: 1024px) 15vw, (min-width: 640px) 22vw, 45vw"
              className="object-contain p-4 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)] transition-opacity"
              style={{ opacity: loaded ? 1 : 0, transitionDuration: "220ms" }}
            />
          </div>
          <div className="relative h-full flex-1">
            <Image
              src={secondaryFront.url}
              alt={secondaryFront.alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 15vw, (min-width: 640px) 22vw, 45vw"
              className="object-contain p-4 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-stage relative aspect-[4/5] w-full overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-semibold tracking-[0.3em] text-[var(--color-line)] transition-opacity"
        style={{ opacity: loaded ? 0 : 1, transitionDuration: "200ms" }}
      >
        C
      </span>
      <Image
        src={front.url}
        alt={front.alt}
        fill
        priority={priority}
        onLoad={() => setLoaded(true)}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
        className="object-contain p-6 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)] transition-opacity"
        style={{ opacity: loaded ? 1 : 0, transitionDuration: "220ms" }}
      />
      {/* Front/back crossfade on hover — pointer devices only, so touch
          never gets stuck showing the back image. */}
      {back && (
        <Image
          src={back.url}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-6 opacity-0 drop-shadow-[0_18px_28px_rgba(10,10,10,0.16)] transition-opacity [@media(hover:hover)]:group-hover:opacity-100"
          style={{ transitionDuration: "var(--dur-drift)" }}
        />
      )}
    </div>
  );
}
