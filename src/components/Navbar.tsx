"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { getProducts } from "@/lib/commerce/data";
import { Product } from "@/lib/commerce/types";
import { SearchOverlay } from "@/components/SearchOverlay";

export function Navbar() {
  const { count, open } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // Background/blur only kicks in once the page has actually scrolled
  // past the hero's top padding — the nav stays transparent over the
  // hero itself, then gains a readable ground for the darker sections
  // (CategorySection, CampaignSection) further down.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-[var(--gutter)] py-4 text-sm tracking-[0.15em] transition-colors"
        style={{
          backgroundColor: scrolled ? "var(--color-bg)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--color-line)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          transitionDuration: "var(--dur-snap)",
          transitionTimingFunction: "var(--ease-snap)",
        }}
      >
        <Link href="/" className="font-display -m-2 p-2 text-lg font-semibold">
          CAISN
        </Link>
        <div className="hidden gap-8 md:flex">
          <Link
            href="/shop"
            className="-m-2.5 p-2.5 transition-colors hover:text-[var(--color-accent)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
          >
            SHOP
          </Link>
          <Link
            href="/#collection"
            className="-m-2.5 p-2.5 transition-colors hover:text-[var(--color-accent)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
          >
            COLLECTION
          </Link>
          <Link
            href="/#about"
            className="-m-2.5 p-2.5 transition-colors hover:text-[var(--color-accent)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
          >
            ABOUT
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="-m-2.5 p-2.5 transition-colors hover:text-[var(--color-accent)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
            aria-label="Open search"
          >
            SEARCH
          </button>
          <button
            onClick={open}
            className="tnum -m-2.5 p-2.5"
            style={{ color: count > 0 ? "var(--color-accent)" : undefined }}
            aria-label={`Open cart, ${count} items`}
          >
            CART ({count})
          </button>
        </div>
      </nav>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} products={products} />
    </>
  );
}
