"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Product } from "@/lib/commerce/types";
import { ProductPlate } from "@/components/ProductPlate";
import { AnimatedPrice } from "@/components/AnimatedPrice";
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
  total,
}: {
  product: Product;
  related: Product[];
  total: number;
}) {
  const [variant, setVariant] = useState(product.variants[0]);

  return (
    <main>
      <Navbar />

      {/* HERO */}
      <section className="grid grid-cols-1 gap-10 px-[var(--gutter)] py-10 md:grid-cols-2 md:items-center">
        <ProductViewer label={product.name} spec={product.spec} index={product.id} />
        <div>
          <span className="tnum text-xs tracking-[0.15em] text-[var(--color-fg-soft)]">
            {product.edition}
          </span>
          <h1 className="font-display mt-2 text-5xl font-semibold leading-[0.95] md:text-6xl">
            {product.name}
          </h1>
          <AnimatedPrice value={product.price} className="font-display mt-4 block text-2xl" />

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

      {/* SCROLL UNBOXING — signature exploded-view sequence */}
      <ProductExplodedSection spec={product.spec} name={product.name} />

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

      {/* RELATED */}
      <section className="px-[var(--gutter)] py-16">
        <h2 className="mb-6 text-[10px] font-normal tracking-[0.15em] text-[var(--color-fg-soft)]">RELATED</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {related.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`}>
              <ProductPlate label={p.name} spec={p.spec} index={p.id} />
            </Link>
          ))}
        </div>
      </section>

      <StickyAddToCart product={product} variant={variant} />
    </main>
  );
}
