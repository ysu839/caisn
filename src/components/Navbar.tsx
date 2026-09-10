"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { getProducts } from "@/lib/commerce/data";
import { Product } from "@/lib/commerce/types";
import { SearchOverlay } from "@/components/SearchOverlay";

export function Navbar() {
  const { count, open } = useCart();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const overHero = isHome && !scrolled;

  return (
    <>
      <nav
        className={`top-0 z-40 grid h-16 grid-cols-3 items-center px-[var(--gutter)] text-[9px] uppercase tracking-[0.18em] transition-colors duration-300 ${
          isHome ? "fixed inset-x-0" : "sticky"
        } ${
          overHero
            ? "border-b border-white/20 bg-transparent text-white"
            : "border-b border-black/10 bg-[#f6f5f1]/95 text-black backdrop-blur-md"
        }`}
      >
        <div className="flex justify-self-start gap-5">
          <Link href="/shop" className="-m-2 hidden p-2 transition-opacity hover:opacity-55 sm:block">Shop</Link>
          <Link href="/#about" className="-m-2 hidden p-2 transition-opacity hover:opacity-55 md:block">About</Link>
          <Link href="/contact" className="-m-2 p-2 transition-opacity hover:opacity-55 sm:hidden">Menu</Link>
        </div>
        <Link href="/" className="font-display -m-2 justify-self-center p-2 text-xl font-semibold tracking-[-0.065em]">
          CAISN
        </Link>
        <div className="flex items-center justify-self-end gap-2 sm:gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="-m-2.5 p-2.5 transition-opacity hover:opacity-55"
            aria-label="Open search"
          >
            <span className="hidden sm:inline">SEARCH</span>
            <span className="sm:hidden" aria-hidden>⌕</span>
          </button>
          <button
            onClick={open}
            className="tnum -m-2.5 p-2.5 transition-opacity hover:opacity-55"
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
