import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/commerce/types";

/**
 * Replaces the old "EARLY ACCESS" section, which was a large empty
 * text block promising a signup that doesn't exist. No email backend
 * exists, so this never collects an address or claims exclusivity —
 * it's a compact, honest routing module: browse now, checkout is
 * coming. One real garment crop distinct from the jogger's other
 * homepage appearance (FormaConnection shows the front; this uses the
 * back, for a different storytelling purpose).
 */
export function DropAccessSection({ product }: { product?: Product }) {
  const images = product?.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:")) ?? [];
  const image = images[1] ?? images[0];

  return (
    <section className="border-t border-[var(--color-line)] px-[var(--gutter)] py-20 md:py-28">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-plate)] md:col-span-5">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 30vw, 90vw"
              className="object-contain p-6"
            />
          </div>
        )}
        <div className={image ? "md:col-span-6 md:col-start-7" : "md:col-span-12 text-center md:text-left"}>
          <span className="tnum text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">DROP 01 ACCESS / SOON</span>
          <p className="font-display mt-3 text-4xl font-medium uppercase leading-[0.9] tracking-[-0.045em] md:text-6xl">
            The first drop<br />is taking shape.
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--color-fg-soft)]">
            Explore every current construction now. Checkout and full drop access are opening shortly.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="#collection"
              className="inline-block whitespace-nowrap rounded-[var(--radius)] border border-[var(--color-fg)] bg-[var(--color-fg)] px-6 py-3 text-xs font-medium tracking-[0.15em] text-[var(--color-bg)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]"
              style={{ transitionDuration: "var(--dur-snap)" }}
            >
              EXPLORE DROP 01
            </Link>
            <Link
              href="/shop"
              className="inline-block whitespace-nowrap text-xs font-medium tracking-[0.15em] text-[var(--color-fg-soft)] underline underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
              style={{ transitionDuration: "var(--dur-snap)" }}
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
