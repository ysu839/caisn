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

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <>
      <nav
        className="sticky top-0 z-40 grid h-[4.5rem] grid-cols-3 items-center border-b border-white/15 bg-[var(--ink)] px-[var(--gutter)] text-[11px] uppercase tracking-[0.15em] text-[var(--paper)]"
      >
        <Link href="/" className="font-display -m-2 justify-self-start p-2 text-xl font-semibold tracking-[-0.06em]">
          CAISN
        </Link>
        <div className="hidden justify-self-center gap-8 md:flex">
          <Link
            href="/shop"
            className="-m-2.5 p-2.5 text-white/70 transition-colors hover:text-[var(--color-accent-soft)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
          >
            SHOP
          </Link>
          <Link
            href="/#collection"
            className="-m-2.5 p-2.5 text-white/70 transition-colors hover:text-[var(--color-accent-soft)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
          >
            COLLECTION
          </Link>
          <Link
            href="/#about"
            className="-m-2.5 p-2.5 text-white/70 transition-colors hover:text-[var(--color-accent-soft)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
          >
            ABOUT
          </Link>
        </div>
        <div className="flex items-center justify-self-end gap-2 sm:gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="-m-2.5 p-2.5 text-white/70 transition-colors hover:text-[var(--color-accent-soft)]"
            style={{ transitionDuration: "var(--dur-snap)" }}
            aria-label="Open search"
          >
            <span className="hidden sm:inline">SEARCH</span>
            <span className="sm:hidden" aria-hidden>⌕</span>
          </button>
          <button
            onClick={open}
            className="tnum -m-2.5 p-2.5"
            style={{ color: count > 0 ? "var(--color-accent)" : undefined }}
            aria-label={`Open cart, ${count} items`}
          >
            CART <span className="tnum">({count})</span>
          </button>
        </div>
      </nav>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} products={products} />
    </>
  );
}
