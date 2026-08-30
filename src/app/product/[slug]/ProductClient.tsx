"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Product } from "@/lib/commerce/types";
import { hasRealMedia } from "@/lib/commerce/data";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductGallery } from "@/components/ProductGallery";
import { Price } from "@/components/Price";
import { VariantSelector } from "@/components/VariantSelector";
import { StockIndicator } from "@/components/StockIndicator";
import { AddToCart } from "@/components/AddToCart";
import { Navbar } from "@/components/Navbar";
import { StickyAddToCart } from "@/components/StickyAddToCart";

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
  const [variant, setVariant] = useState(product.variants[0]);
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
      <section className="grid grid-cols-1 gap-10 px-[var(--gutter)] py-12 md:grid-cols-5 md:items-center md:gap-12 md:py-20">
        <div className="md:col-span-3">
          {realMedia ? (
            <ProductGallery product={product} />
          ) : (
            <ProductViewer label={product.name} spec={product.spec} index={product.id} />
          )}
        </div>
        <div className="md:col-span-2">
          <span className="tnum text-xs tracking-[0.15em] text-[var(--color-fg-soft)]">
            {product.edition}
          </span>
          <h1 className="font-display mt-3 text-6xl font-semibold leading-[0.92] md:text-7xl">
            {product.name}
          </h1>
          <Price value={product.price} className="font-display mt-5 block text-2xl" />

          <div className="mt-8">
            <VariantSelector variants={product.variants} selected={variant} onSelect={setVariant} />
          </div>

          <div className="mt-6">
            <StockIndicator stock={variant.stock} total={total} />
          </div>

          <div id="primary-add-to-cart" className="mt-6 max-w-xs">
            <AddToCart product={product} variant={variant} />
          </div>
        </div>
      </section>

      {/* PRODUCT BENTO — material / fit / construction */}
      <section className="px-[var(--gutter)] py-16">
        <h2 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">CONSTRUCTION</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {product.materials.map((m, i) => (
            <div key={i} className="border border-[var(--color-line)] p-4">
              <span className="tnum text-[10px] text-[var(--color-fg-soft)]">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-display mt-3 text-sm font-medium uppercase">{m}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCROLL UNBOXING — signature exploded-view sequence. Its
          construction labels are generic (SOLID BRASS, STRUCTURAL
          FRAME, etc.) and would misstate a real product's actual
          materials/hardware, so it's skipped once real photography
          exists — same reasoning as the hero above. */}
      {!realMedia && <ProductExplodedSection spec={product.spec} name={product.name} />}

      {/* PRODUCT STORY */}
      <section className="mx-auto max-w-2xl px-[var(--gutter)] py-16">
        <h2 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">STORY</h2>
        <div className="space-y-6">
          {product.story.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-[var(--color-fg-soft)]">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* COMPLETE THE FORMA — cross-link to the designed-to-pair piece.
          Sold separately; this is a styling pointer, not a bundle. */}
      {pair && (
        <section className="px-[var(--gutter)] py-16">
          <h2 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">
            COMPLETE THE FORMA
          </h2>
          <Link href={`/product/${pair.slug}`} className="group grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
            <div className="md:col-span-1">
              <ProductVisual product={pair} />
            </div>
            <div className="md:col-span-2">
              <p className="font-display text-2xl font-medium md:text-3xl">{pair.name}</p>
              <Price value={pair.price} className="mt-2 block text-base text-[var(--color-fg-soft)]" />
              <span className="mt-4 inline-block text-xs tracking-[0.15em] underline underline-offset-4">
                SHOP {pair.name}
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

      <StickyAddToCart product={product} variant={variant} />
    </main>
  );
}
