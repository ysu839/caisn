"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export function Navbar() {
  const { count, open } = useCart();

  return (
    <nav className="flex items-center justify-between px-[var(--gutter)] py-6 text-sm tracking-[0.15em]">
      <Link href="/" className="font-display text-lg font-semibold">
        CAISN
      </Link>
      <div className="hidden gap-8 md:flex">
        <Link href="/shop">SHOP</Link>
        <Link href="/#collection">COLLECTION</Link>
        <Link href="/#about">ABOUT</Link>
      </div>
      <div className="flex gap-6">
        <span>SEARCH</span>
        <button onClick={open} className="tnum">
          CART ({count})
        </button>
      </div>
    </nav>
  );
}
