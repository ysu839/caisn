export type Money = number; // minor-unit-free display value, e.g. 145 => €145

/**
 * A product's real price, or null if it genuinely hasn't been set
 * yet. `null` is a real, honest state — not a placeholder to work
 * around — see components/Price.tsx, which every price display in
 * the app reads through. Unlike stock (gated by LIVE_INVENTORY, a
 * site-wide switch), price is per-product: some products can be
 * priced and purchasable while others are still pending.
 */
export type PriceOrPending = Money | null;

export type Variant = {
  color: string;
  colorHex: string;
  size: string;
  stock: number;
};

export type ProductMedia = {
  type: "image" | "video";
  url: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: PriceOrPending;
  edition: string; // e.g. "EDITION 04"
  spec: string; // e.g. "620G RAW WOOL"
  story: string[];
  materials: string[];
  /**
   * Consumed by ProductVisual (components/ProductVisual.tsx), used
   * anywhere a flat product image is shown (shop grid, horizontal
   * showcase, related products, bento fullscreen). A "plate:*" URL
   * is a placeholder sentinel — ProductVisual falls back to the
   * art-directed ProductPlate graphic for those. Any other `type:
   * "image"` entry is treated as a real, resolvable path under
   * /public and rendered directly (see ECHO for the first real
   * example). The interactive 3D viewer/hero is separate — that
   * reads `model3dUrl` below, not this field.
   */
  media: ProductMedia[];
  variants: Variant[];
  model3dUrl?: string;
  /**
   * Slug of a separately-sold product designed to pair with this one
   * (e.g. a set's top + bottom). Purely a cross-link — the two remain
   * distinct, independently purchasable products; this does not imply
   * a bundle/set SKU.
   */
  pairSlug?: string;
  /**
   * True for concept/placeholder entries without enough real
   * assets/content to present professionally — withheld from
   * customer-facing commerce (see visibleProducts in data.ts).
   */
  hidden?: boolean;
};

/**
 * A literal hyphen (e.g. in "ZIP-UP") is a valid line-break point for
 * the browser, which can split a compound product name awkwardly at
 * small sizes. Swap it for a non-breaking hyphen (U+2011) wherever a
 * product name is displayed as a heading/title — purely visual, the
 * underlying data/slug/copy stays a normal hyphen.
 */
export function displayName(name: string): string {
  return name.replace(/-/g, "‑");
}
