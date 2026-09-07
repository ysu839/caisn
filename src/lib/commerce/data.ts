import { Product } from "./types";

/**
 * Empty catalog baseline.
 *
 * New products can be added here once their names, prices, materials,
 * photography and variants are confirmed. Keeping the adapter API stable
 * means the shop, search, cart and product routes are ready for the rebuild.
 */
const products: Product[] = [];

export const LIVE_INVENTORY = false;

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
}

export function hasRealMedia(product: Product): boolean {
  return product.media.some((media) => media.type === "image" && !media.url.startsWith("plate:"));
}
