"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Product, displayName } from "@/lib/commerce/types";
import { Price } from "@/components/Price";

/**
 * Local, instant search over the real catalog only — no fake
 * suggestions, no external API. Matches name, category and color
 * (variant colors), which is everything a shopper could reasonably
 * search a 4-product catalog for.
 */
export function SearchOverlay({
  open,
  onClose,
  products,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // Tracks the previous `open` value so a fresh open can reset `query`
  // during render (React's documented pattern for "adjusting state when
  // a prop changes") instead of a setState-in-effect, which triggers an
  // avoidable extra render pass.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setQuery("");
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => {
      const colors = p.variants.map((v) => v.color.toLowerCase());
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        colors.some((c) => c.includes(q))
      );
    });
  }, [query, products]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  // Pure side effects only (focus, scroll lock) — no setState here.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown" && results.length > 0) {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % results.length);
      } else if (e.key === "ArrowUp" && results.length > 0) {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results[activeIndex]) {
        onClose();
        router.push(`/product/${results[activeIndex].slug}`);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, results, activeIndex, router]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
            className="fixed inset-0 z-40 bg-black/40"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-50 mx-auto max-h-[85vh] w-full max-w-xl overflow-y-auto border-b border-[var(--color-line)] bg-[var(--color-bg)] px-[var(--gutter)] pb-6 pt-6 shadow-xl sm:top-4 sm:rounded-[var(--radius)] sm:border"
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-line)] pb-4">
              <span aria-hidden className="text-[var(--color-fg-soft)]">
                ⌕
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search products, categories, colors…"
                className="w-full bg-transparent text-base outline-none placeholder:text-[var(--color-fg-soft)]"
                aria-label="Search"
                autoComplete="off"
              />
              <button
                onClick={onClose}
                className="shrink-0 text-xs tracking-[0.1em] text-[var(--color-fg-soft)] hover:text-[var(--color-fg)]"
              >
                ESC
              </button>
            </div>

            <div className="mt-4">
              {query.trim() === "" && (
                <p className="py-6 text-center text-sm text-[var(--color-fg-soft)]">
                  Search CAISN by product, category or color.
                </p>
              )}
              {query.trim() !== "" && results.length === 0 && (
                <p className="py-6 text-center text-sm text-[var(--color-fg-soft)]">
                  No results for “{query}”.
                </p>
              )}
              <ul>
                {results.map((p, i) => {
                  const image = p.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={onClose}
                        onMouseEnter={() => setActiveIndex(i)}
                        className="flex items-center gap-4 rounded-[var(--radius)] p-2 transition-colors"
                        style={{
                          backgroundColor: i === activeIndex ? "var(--surface-plate)" : "transparent",
                          transitionDuration: "var(--dur-snap)",
                        }}
                      >
                        <div className="product-stage relative h-16 w-14 shrink-0 overflow-hidden">
                          {image && (
                            <Image src={image.url} alt="" aria-hidden fill sizes="56px" className="object-contain p-1.5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display truncate text-sm font-medium">{displayName(p.name)}</p>
                          <p className="text-xs text-[var(--color-fg-soft)]">{p.category}</p>
                        </div>
                        <Price value={p.price} className="shrink-0 text-sm" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
