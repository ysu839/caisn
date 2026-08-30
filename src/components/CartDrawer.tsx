"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart/CartContext";
import { getProductBySlug } from "@/lib/commerce/data";
import { Product, displayName } from "@/lib/commerce/types";
import { Price } from "@/components/Price";

function CartThumb({ product, className }: { product: Product; className: string }) {
  const image = product.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));
  return (
    <div className={`relative shrink-0 overflow-hidden bg-[var(--surface-plate)] ${className}`}>
      {image && <Image src={image.url} alt="" aria-hidden fill sizes="60px" className="object-contain p-1.5" />}
    </div>
  );
}

export function CartDrawer() {
  const { isOpen, close, lines, total, removeItem, setQuantity } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [recommended, setRecommended] = useState<Product | null>(null);
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);

  // Empty-cart state suggests the flagship product instead of sitting
  // dead — fetched from the catalog rather than hardcoded so it can
  // never drift from the real name/price.
  useEffect(() => {
    getProductBySlug("echo-zip-hoodie").then((p) => setHeroProduct(p ?? null));
  }, []);

  // Recommend the matching FORMA piece when the cart holds one half of
  // the pair but not the other — a light nudge, not a hard upsell.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const inCart = new Set(lines.map((l) => l.product.slug));
      const withPair = lines.find((l) => l.product.pairSlug && !inCart.has(l.product.pairSlug));
      if (!withPair?.product.pairSlug) {
        if (!cancelled) setRecommended(null);
        return;
      }
      const pair = await getProductBySlug(withPair.product.pairSlug);
      if (!cancelled) setRecommended(pair ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [lines]);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
            className="fixed inset-0 z-40 bg-black/40"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-heading"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 0.9, 0.2, 1.02] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-[var(--color-line)] bg-[var(--color-bg)] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 id="cart-drawer-heading" className="text-xs tracking-[0.15em]">
                CART ({lines.length})
              </h2>
              <button
                ref={closeRef}
                onClick={close}
                className="-m-2.5 p-2.5 text-xs tracking-[0.15em]"
                aria-label="Close cart"
              >
                CLOSE
              </button>
            </div>

            <div className="mt-8 flex-1 space-y-6 overflow-y-auto">
              {lines.length === 0 && (
                <div className="space-y-6">
                  <p className="text-sm text-[var(--color-fg-soft)]">Your cart is empty.</p>
                  {heroProduct && (
                    <Link
                      href={`/product/${heroProduct.slug}`}
                      onClick={close}
                      className="group block border border-[var(--color-line)] p-4 transition-colors hover:border-[var(--color-fg)]"
                      style={{ transitionDuration: "var(--dur-snap)" }}
                    >
                      <p className="text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">START WITH</p>
                      <p className="font-display mt-1 text-lg font-medium">{displayName(heroProduct.name)}</p>
                      <Price value={heroProduct.price} className="mt-1 block text-sm text-[var(--color-fg-soft)]" />
                    </Link>
                  )}
                </div>
              )}
              {lines.map((l, i) => (
                <div key={i} className="flex gap-3 border-b border-[var(--color-line)] pb-4 text-sm">
                  <CartThumb product={l.product} className="h-16 w-14" />
                  <div className="flex flex-1 justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-display truncate font-medium">{displayName(l.product.name)}</p>
                      <p className="tnum mt-1 text-xs text-[var(--color-fg-soft)]">
                        {l.variant.color} / {l.variant.size}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center border border-[var(--color-line)]">
                          <button
                            aria-label={`Decrease quantity of ${l.product.name}`}
                            onClick={() => setQuantity(l.product.id, l.variant.color, l.variant.size, l.quantity - 1)}
                            className="px-2.5 py-1 text-xs"
                          >
                            −
                          </button>
                          <span className="tnum min-w-[1.5rem] text-center text-xs">{l.quantity}</span>
                          <button
                            aria-label={`Increase quantity of ${l.product.name}`}
                            onClick={() => setQuantity(l.product.id, l.variant.color, l.variant.size, l.quantity + 1)}
                            className="px-2.5 py-1 text-xs"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(l.product.id, l.variant.color, l.variant.size)}
                          className="text-[10px] tracking-[0.1em] text-[var(--color-fg-soft)] underline underline-offset-2 hover:text-[var(--color-accent)]"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                    <Price
                      value={l.product.price !== null ? l.product.price * l.quantity : null}
                      className="shrink-0 text-sm"
                    />
                  </div>
                </div>
              ))}

              {recommended && (
                <Link
                  href={`/product/${recommended.slug}`}
                  onClick={close}
                  className="group flex items-center gap-3 border border-[var(--color-line)] p-3 transition-colors hover:border-[var(--color-accent)]"
                  style={{ transitionDuration: "var(--dur-snap)" }}
                >
                  <CartThumb product={recommended} className="h-14 w-12" />
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.15em] text-[var(--color-accent)]">COMPLETE THE FORMA</p>
                    <p className="font-display truncate text-sm font-medium">{displayName(recommended.name)}</p>
                  </div>
                </Link>
              )}
            </div>

            <div className="mt-6 space-y-4 border-t border-[var(--color-line)] pt-4">
              <div className="flex justify-between text-sm">
                <span className="tracking-[0.1em]">TOTAL</span>
                <Price value={total} className="font-display text-lg" />
              </div>
              {/* No live checkout/payment integration exists yet — showing a
                  functional-looking button here would be a false promise, so
                  this is a distinct, honestly-labeled early-access state
                  rather than a disabled "CHECKOUT". */}
              <button
                disabled={lines.length === 0}
                onClick={() => alert("CAISN checkout is opening soon. Thanks for your interest — we'll be in touch.")}
                className="w-full border border-[var(--color-fg)] py-3.5 text-xs tracking-[0.15em] transition-colors disabled:opacity-30 hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
                style={{ transitionDuration: "var(--dur-snap)" }}
              >
                RESERVE — EARLY ACCESS
              </button>
              <p className="text-center text-[10px] tracking-[0.1em] text-[var(--color-fg-soft)]">
                CHECKOUT OPENING SOON
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
