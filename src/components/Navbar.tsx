"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export function Navbar() {
  const { count, open } = useCart();

  return (
    <nav className="flex items-center justify-between px-[var(--gutter)] py-4 text-sm tracking-[0.15em]">
      <Link href="/" className="font-display -m-2 p-2 text-lg font-semibold">
        CAISN
      </Link>
      <div className="hidden gap-8 md:flex">
        <Link href="/shop" className="-m-2.5 p-2.5">
          SHOP
        </Link>
        <Link href="/#collection" className="-m-2.5 p-2.5">
          COLLECTION
        </Link>
        <Link href="/#about" className="-m-2.5 p-2.5">
          ABOUT
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button
          disabled
          aria-disabled="true"
          title="Search — coming soon"
          className="-m-2.5 cursor-default p-2.5 text-[var(--color-fg-soft)]"
        >
          SEARCH
        </button>
        <button onClick={open} className="tnum -m-2.5 p-2.5" aria-label={`Open cart, ${count} items`}>
          CART ({count})
        </button>
      </div>
    </nav>
  );
}
