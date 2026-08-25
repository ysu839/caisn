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
    id: "01",
    slug: "shell-04",
    name: "SHELL 04",
    price: 420,
    edition: "EDITION 04",
    spec: "620G RAW WOOL",
    story: [
      "A single bolt of raw wool, cut on the architectural bias to hold its own shape without lining.",
      "Seams are left exposed on the interior — the construction is the finish.",
      "Hardware is machined, not stamped: solid brass, cold to the touch, built to outlast the garment.",
    ],
    materials: ["620g raw wool", "brass hardware", "unlined shell", "raw-edge seams"],
    media: [
      { type: "image", url: "plate:shell", alt: "SHELL 04 studio plate" },
      { type: "image", url: "plate:seam", alt: "Seam construction detail" },
    ],
    variants: [
      { color: "Ink", colorHex: "#0a0a0a", size: "S", stock: 4 },
      { color: "Ink", colorHex: "#0a0a0a", size: "M", stock: 9 },
      { color: "Ink", colorHex: "#0a0a0a", size: "L", stock: 3 },
      { color: "Raw", colorHex: "#b5651d", size: "M", stock: 12 },
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
