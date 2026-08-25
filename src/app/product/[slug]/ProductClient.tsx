"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/commerce/types";
import { ProductPlate } from "@/components/ProductPlate";
import { AnimatedPrice } from "@/components/AnimatedPrice";
import { VariantSelector } from "@/components/VariantSelector";
import { StockIndicator } from "@/components/StockIndicator";
import { AddToCart } from "@/components/AddToCart";
import { Navbar } from "@/components/Navbar";

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
        <ProductPlate label={product.name} spec={product.spec} index={product.id} />
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

          <div className="mt-6 max-w-xs">
            <AddToCart product={product} variant={variant} />
          </div>
        </div>
      </section>

      {/* PRODUCT BENTO — material / fit / construction */}
      <section className="px-[var(--gutter)] py-16">
        <p className="mb-6 text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">CONSTRUCTION</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {product.materials.map((m, i) => (
            <div key={i} className="border border-[var(--color-line)] p-4">
              <span className="tnum text-[10px] text-[var(--color-fg-soft)]">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-display mt-3 text-sm font-medium uppercase">{m}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT STORY */}
      <section className="mx-auto max-w-2xl px-[var(--gutter)] py-16">
        <p className="mb-6 text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">STORY</p>
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
        <p className="mb-6 text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">RELATED</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {related.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`}>
              <ProductPlate label={p.name} spec={p.spec} index={p.id} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
