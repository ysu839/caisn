import Image from "next/image";
import { Product } from "@/lib/commerce/types";
import { ProductPlate } from "@/components/ProductPlate";

/**
 * The one place that decides whether a product has real, resolvable
 * media or should fall back to the art-directed placeholder plate.
 * Every flat product-image slot (shop grid, horizontal showcase,
 * related products, bento fullscreen) reads through here instead of
 * rendering ProductPlate directly, so a product goes from placeholder
 * to real photography by data alone — no call site changes.
 */
export function ProductVisual({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  const image = product.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));

  if (!image) {
    return <ProductPlate label={product.name} spec={product.spec} index={product.id} className={className} />;
  }

  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-plate)] ${className ?? ""}`}
    >
      <Image
        src={image.url}
        alt={image.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
        className="object-contain p-6"
      />
    </div>
  );
}
