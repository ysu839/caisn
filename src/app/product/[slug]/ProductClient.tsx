"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Product, displayName } from "@/lib/commerce/types";
import { hasRealMedia } from "@/lib/commerce/data";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductGallery } from "@/components/ProductGallery";
import { Price } from "@/components/Price";
import { VariantSelector } from "@/components/VariantSelector";
import { StockIndicator } from "@/components/StockIndicator";
import { AddToCart } from "@/components/AddToCart";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyAddToCart } from "@/components/StickyAddToCart";
import { ConstructionSheet } from "@/components/ConstructionSheet";

// Code-split the 3D layer (three.js + r3f + gsap) out of the initial PDP
// bundle so price/variant/cart interactivity doesn't wait on it — commerce
// stays fast even before the experimental layer has finished loading.
const ProductViewer = dynamic(() => import("@/components/ProductViewer").then((m) => m.ProductViewer), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[4/5] w-full items-center justify-center border border-[var(--color-line)]">
      <span className="tnum text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">LOADING PLATE…</span>
    </div>
  ),
});

const ProductExplodedSection = dynamic(
  () => import("@/components/ProductExplodedSection").then((m) => m.ProductExplodedSection),
  { ssr: false }
);

export function ProductClient({
  product,
  related,
  pair,
  total,
}: {
  product: Product;
  related: Product[];
  pair?: Product;
  total: number;
}) {
  // No size pre-selected — the shopper must actively choose one (see
  // VariantSelector/AddToCart), so an inattentive click can never add
  // the wrong size by default.
  const [variant, setVariant] = useState<(typeof product.variants)[number] | null>(null);
  // Real photography beats the procedural 3D placeholder system — it
  // stands in for a real *3D asset*/construction breakdown that
  // doesn't exist yet, not for real photography that already does.
  // Once a product has a real model3dUrl this should prefer the
  // interactive systems again; no product has one yet, so that case
  // isn't handled here.
  const realMedia = hasRealMedia(product);

  return (
    <main>
      <Navbar />

      {/* HERO — image-forward 3:2 split (not a dead 50/50), and a much
          larger display headline against unchanged small info text:
          the contrast itself is the point, not just bigger type. */}
      <section className="grid grid-cols-1 gap-6 px-[var(--gutter)] py-8 md:grid-cols-5 md:items-center md:gap-12 md:py-20">
        <div className="md:col-span-3">
          {realMedia ? (
            <ProductGallery product={product} />
          ) : (
            <ProductViewer label={product.name} spec={product.spec} index={product.id} />
          )}
        </div>
        <div className="md:col-span-2">
          {product.edition && (
            <span className="tnum text-xs tracking-[0.15em] text-[var(--color-fg-soft)]">{product.edition}</span>
          )}
          <h1 className="font-display mt-3 text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl md:text-7xl">
            {displayName(product.name)}
          </h1>
          <Price value={product.price} className="font-display mt-4 block text-xl md:mt-5 md:text-2xl" />

          <div className="mt-8">
            <VariantSelector variants={product.variants} selected={variant} onSelect={setVariant} />
          </div>
          <Link
            href="/size-guide"
            className="mt-2 inline-block text-[10px] tracking-[0.1em] text-[var(--color-fg-soft)] underline underline-offset-2 hover:text-[var(--color-accent)]"
          >
            SIZE GUIDE
          </Link>

          {variant && (
            <div className="mt-6">
              <StockIndicator stock={variant.stock} total={total} />
            </div>
          )}

          <div id="primary-add-to-cart" className="mt-6 max-w-xs">
            <AddToCart product={product} variant={variant} />
          </div>

          <p className="mt-4 text-xs text-[var(--color-fg-soft)]">
            <Link href="/shipping" className="underline underline-offset-2 hover:text-[var(--color-accent)]">
              Shipping
            </Link>{" "}
            &{" "}
            <Link href="/returns" className="underline underline-offset-2 hover:text-[var(--color-accent)]">
              returns
            </Link>{" "}
            details.
          </p>
        </div>
      </section>

      {/* CONSTRUCTION SHEET — an editorial garment-development-sheet
          layout for products with real photography, replacing the
          plain DETAILS list. Falls back to the plain list when there's
          no real photography to compose it around. */}
      {realMedia ? (
        <ConstructionSheet product={product} />
      ) : (
        <section className="mx-auto max-w-2xl px-[var(--gutter)] py-16">
          <h2 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">DETAILS</h2>
          <ul className="divide-y divide-[var(--color-line)] border-t border-[var(--color-line)]">
            {product.materials.map((m, i) => (
              <li key={i} className="py-3 text-sm capitalize leading-relaxed text-[var(--color-fg)]">
                {m}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* SCROLL UNBOXING — signature exploded-view sequence. Its
          construction labels are generic (SOLID BRASS, STRUCTURAL
          FRAME, etc.) and would misstate a real product's actual
          materials/hardware, so it's skipped once real photography
          exists — same reasoning as the hero above. */}
      {!realMedia && <ProductExplodedSection spec={product.spec} name={product.name} />}

      {/* PRODUCT STORY — the first paragraph already appears inside the
          Construction Sheet above (realMedia case), so only the rest
          renders here to avoid repeating it. */}
      {(() => {
        const remainingStory = realMedia ? product.story.slice(1) : product.story;
        return remainingStory.length > 0 ? (
          <section className="mx-auto max-w-2xl px-[var(--gutter)] py-16">
            <h2 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">STORY</h2>
            <div className="space-y-6">
              {remainingStory.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-[var(--color-fg-soft)]">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ) : null;
      })()}

      {/* COMPLETE THE FORMA — cross-link to the designed-to-pair piece.
          Sold separately; this is a styling pointer, not a bundle. */}
      {pair && (
        <section className="px-[var(--gutter)] py-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">
              COMPLETE THE FORMA
            </h2>
            <span className="text-[10px] tracking-[0.1em] text-[var(--color-accent)]">SOLD SEPARATELY</span>
          </div>
          <Link href={`/product/${pair.slug}`} className="group grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
            <div className="md:col-span-1">
              <ProductVisual product={pair} />
            </div>
            <div className="md:col-span-2">
              <p className="font-display text-2xl font-medium md:text-3xl">{displayName(pair.name)}</p>
              <Price value={pair.price} className="mt-2 block text-base text-[var(--color-fg-soft)]" />
              <span className="mt-4 inline-block text-xs tracking-[0.15em] underline underline-offset-4">
                SHOP {displayName(pair.name)}
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* RELATED */}
      <section className="px-[var(--gutter)] py-16">
        <h2 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">RELATED</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {related.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`}>
              <ProductVisual product={p} />
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <StickyAddToCart product={product} variant={variant} />
    </main>
  );
}
