import { Product } from "./types";

const archiveBrownSizes = ["XS", "S", "M", "L", "XL"].map((size) => ({
  color: "Washed Umber",
  colorHex: "#514433",
  size,
  stock: 0,
}));

const products: Product[] = [
  {
    id: "A03-H01",
    slug: "caisn-archive-03-hoodie",
    name: "CAISN ARCHIVE 03 HOODIE",
    price: 89,
    category: "Hoodies & Zip-Ups",
    edition: "ARCHIVE 03",
    spec: "WASHED HEAVYWEIGHT",
    story: [
      "A heavyweight pullover built around the CAISN Structural Division identity. The washed umber finish, dropped shoulders and compact oversized shape give the hoodie an already-lived-in character.",
      "A restrained CN archive mark leads the front. The full architectural seal takes over the back, turning the matching set into the first complete expression of Archive 03.",
    ],
    materials: [
      "washed heavyweight fleece construction",
      "oversized fit with dropped shoulders",
      "ribbed cuffs and hem",
      "kangaroo pocket",
      "front archive mark and structural division back artwork",
    ],
    media: [
      {
        type: "image",
        url: "/products/archive-03/hoodie-front.jpeg",
        alt: "CAISN Archive 03 Hoodie in Washed Umber — front",
      },
      {
        type: "image",
        url: "/products/archive-03/hoodie-back.jpeg",
        alt: "CAISN Archive 03 Hoodie in Washed Umber — back",
      },
    ],
    variants: archiveBrownSizes,
    pairSlug: "caisn-archive-03-wide-jogger",
    comingSoon: true,
  },
  {
    id: "A03-J01",
    slug: "caisn-archive-03-wide-jogger",
    name: "CAISN ARCHIVE 03 WIDE JOGGER",
    price: 79,
    category: "Bottoms",
    edition: "ARCHIVE 03",
    spec: "WASHED WIDE LEG",
    story: [
      "The lower structure of Archive 03. A wide, straight leg creates a clean fall over footwear, balanced by a ribbed waistband and long tonal drawcords.",
      "Minimal CN branding at the upper leg is contrasted by the vertical CAISN artwork. Archive 03 marks the back and connects the jogger to its matching hoodie.",
    ],
    materials: [
      "washed heavyweight fleece construction",
      "wide straight-leg silhouette",
      "ribbed elasticated waistband with tonal drawcord",
      "angled side pockets and twin rear welt pockets",
      "front CAISN artwork and Archive 03 rear mark",
    ],
    media: [
      {
        type: "image",
        url: "/products/archive-03/jogger-front.jpeg",
        alt: "CAISN Archive 03 Wide Jogger in Washed Umber — front",
      },
      {
        type: "image",
        url: "/products/archive-03/jogger-back.jpeg",
        alt: "CAISN Archive 03 Wide Jogger in Washed Umber — back",
      },
    ],
    variants: archiveBrownSizes,
    pairSlug: "caisn-archive-03-hoodie",
    comingSoon: true,
  },
];

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
