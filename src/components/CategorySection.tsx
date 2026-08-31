import Link from "next/link";
import Image from "next/image";
import { Product, Category, CATEGORIES } from "@/lib/commerce/types";

/**
 * The homepage's one strong dark section — near-black ground, real
 * product cutouts, category links backed by the actual catalog (no
 * empty category pages: a category with zero visible products simply
 * isn't linked here). Deep-links into /shop with the category
 * pre-filtered.
 */
export function CategorySection({ products }: { products: Product[] }) {
  const withRepImage = (category: Category) => {
    const match = products.find((p) => p.category === category);
    const image = match?.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));
    return { match, image };
  };

  const categories = CATEGORIES.map((c) => ({ category: c, ...withRepImage(c) })).filter((c) => c.match);

  return (
    <section className="bg-[var(--ink)] px-[var(--gutter)] py-16 md:py-24">
      <div className="mb-10 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-semibold text-[var(--paper)] md:text-3xl">Shop by Category</h2>
        <Link
          href="/shop"
          className="text-xs tracking-[0.1em] text-[var(--paper)]/70 underline underline-offset-2 hover:text-[var(--color-accent-soft)]"
        >
          VIEW ALL
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {categories.map(({ category, image }) => (
          <Link
            key={category}
            href={`/shop?category=${encodeURIComponent(category)}`}
            className="group relative block aspect-[3/4] overflow-hidden bg-[#161615] ring-1 ring-transparent ring-inset transition-[transform,box-shadow] active:scale-[0.98] [@media(hover:hover)]:hover:ring-[var(--color-accent)]/60"
            style={{ transitionDuration: "var(--dur-snap)", transitionTimingFunction: "var(--ease-snap)" }}
          >
            {image && (
              <Image
                src={image.url}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 640px) 30vw, 90vw"
                className="object-contain p-8 opacity-90 drop-shadow-[0_18px_28px_rgba(0,0,0,0.5)] transition-transform [@media(hover:hover)]:group-hover:scale-[1.04]"
                style={{ transitionDuration: "var(--dur-snap)", transitionTimingFunction: "var(--ease-snap)" }}
              />
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-12">
              <span className="font-display text-lg font-medium text-[var(--paper)]">{category}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
