import { Product } from "./types";

/**
 * Single source of truth for whether inventory numbers below are real.
 * UI components that display stock (see StockIndicator) must check
 * this and show a non-live "DATA PENDING" state instead of the
 * numbers when false — flip this once a real commerce backend is
 * wired in behind this adapter.
 */
export const LIVE_INVENTORY = false;

/**
 * Mock commerce data behind the adapter boundary. Swappable for a
 * Shopify Storefront API-backed implementation without touching UI.
 * Stock numbers here are seed/placeholder data — never presented as
 * live inventory until a real backend is wired in (LIVE_INVENTORY
 * above gates that in the UI).
 */
const products: Product[] = [
  {
    // CAISN's first real product — replaces the SHELL 04 mock. Real
    // facts only below; anything the brand hasn't confirmed yet
    // (rib composition, real photography, 3D asset, live inventory)
    // is left pending rather than invented. See git history for the
    // SHELL 04 placeholder this replaced.
    id: "01",
    slug: "echo-zip-hoodie",
    name: "CAISN ECHO ZIP HOODIE",
    price: 119.95,
    edition: "FIRST EDITION",
    spec: "420G LOOPBACK TERRY",
    story: [
      "ECHO is built around contrast without relying on colour. Its washed graphite shell is interrupted by a darker lower panel, creating a subtle division between fading, texture and structure.",
      "A raised tonal CAISN appliqué spans the chest and aligns across the two-way zipper. Raw finishing and natural wash variation make every garment slightly different, while the heavyweight cotton construction maintains its boxy silhouette.",
      "Designed as the first expression of CAISN's visual language: bold from a distance, detailed up close.",
    ],
    materials: [
      "100% cotton loopback french terry",
      "420gsm heavyweight construction",
      "antique-silver two-way zipper",
      "rib trim — composition pending factory confirmation",
    ],
    // Front/back photography not yet uploaded to the repo — keep the
    // placeholder plate until real files arrive (see ProductPlate).
    // "plate:echo" is a sentinel only; see the note on ProductMedia
    // in types.ts before assuming this drives any rendering.
    media: [{ type: "image", url: "plate:echo", alt: "CAISN ECHO ZIP HOODIE — pending real photography" }],
    // Launch run: limited initial run of 50 pieces, not individually
    // numbered; restock depends on demand. Real per-size stock is
    // unconfirmed (LIVE_INVENTORY gates display) — the numbers below
    // are inert placeholders, not a claim.
    variants: [
      { color: "Washed Graphite", colorHex: "#3f3f40", size: "XS", stock: 1 },
      { color: "Washed Graphite", colorHex: "#3f3f40", size: "S", stock: 1 },
      { color: "Washed Graphite", colorHex: "#3f3f40", size: "M", stock: 1 },
      { color: "Washed Graphite", colorHex: "#3f3f40", size: "L", stock: 1 },
      { color: "Washed Graphite", colorHex: "#3f3f40", size: "XL", stock: 1 },
    ],
    model3dUrl: undefined,
  },
  {
    id: "02",
    slug: "frame-jacket",
    name: "FRAME JACKET",
    price: 560,
    edition: "EDITION 02",
    spec: "TWILL / STEEL STAY",
    story: [
      "A steel stay runs the collar's spine — the only rigid element in an otherwise soft construction.",
      "Fifty pieces per run. Numbered on the interior placket.",
    ],
    materials: ["cotton twill", "steel collar stay", "corozo buttons"],
    media: [{ type: "image", url: "plate:frame", alt: "FRAME JACKET studio plate" }],
    variants: [
      { color: "Ink", colorHex: "#0a0a0a", size: "M", stock: 7 },
      { color: "Ink", colorHex: "#0a0a0a", size: "L", stock: 2 },
    ],
  },
  {
    id: "03",
    slug: "column-trouser",
    name: "COLUMN TROUSER",
    price: 310,
    edition: "EDITION 01",
    spec: "STRUCTURED DRILL",
    story: ["Straight from hip to hem — no taper, no break. The leg reads as one continuous line."],
    materials: ["cotton drill", "articulated knee", "hidden waistband hook"],
    media: [{ type: "image", url: "plate:column", alt: "COLUMN TROUSER studio plate" }],
    variants: [
      { color: "Paper", colorHex: "#f6f5f2", size: "30", stock: 5 },
      { color: "Ink", colorHex: "#0a0a0a", size: "32", stock: 11 },
    ],
  },
  {
    id: "04",
    slug: "plate-vest",
    name: "PLATE VEST",
    price: 260,
    edition: "EDITION 07",
    spec: "BONDED PANEL",
    story: ["Two panels, bonded not sewn, at the side seam — a construction borrowed from technical outerwear."],
    materials: ["bonded panel construction", "recycled shell face"],
    media: [{ type: "image", url: "plate:vest", alt: "PLATE VEST studio plate" }],
    variants: [
      { color: "Ink", colorHex: "#0a0a0a", size: "M", stock: 1 },
      { color: "Ink", colorHex: "#0a0a0a", size: "L", stock: 6 },
    ],
  },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export function totalStock(p: Product): number {
  return p.variants.reduce((sum, v) => sum + v.stock, 0);
}
