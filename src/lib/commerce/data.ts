import { Product } from "./types";

const sizes = (color: string, colorHex: string) =>
  ["XS", "S", "M", "L", "XL"].map((size) => ({ color, colorHex, size, stock: 0 }));

const products: Product[] = [
  {
    id: "S01-Z01",
    slug: "caisn-vault-wash-zip",
    name: "CAISN VAULT WASH ZIP",
    price: 89,
    category: "Hoodies & Zip-Ups",
    edition: "STRUCTURE 01",
    spec: "WASHED 520G FLEECE",
    story: [
      "A compact full-zip structure shaped through dropped shoulders, controlled volume and exposed tonal seam lines.",
      "The washed graphite finish keeps the architecture visible without turning the piece into a loud graphic hoodie.",
    ],
    materials: ["520gsm cotton-rich fleece", "double-layer hood", "metal two-way zip", "ribbed cuffs and hem", "embroidered CAISN marks"],
    media: [{ type: "image", url: "/products/structure-01/vault-wash-zip-front.jpeg", alt: "CAISN Vault Wash Zip in Graphite — front" }],
    variants: sizes("Washed Graphite", "#3F403F"),
    pairSlug: "caisn-axis-wide-jogger",
    comingSoon: true,
  },
  {
    id: "S01-J01",
    slug: "caisn-axis-wide-jogger",
    name: "CAISN AXIS WIDE JOGGER",
    price: 79,
    category: "Bottoms",
    edition: "STRUCTURE 01",
    spec: "WASHED WIDE LEG",
    story: [
      "A wide straight-leg jogger built around one curved seam axis that travels from pocket to knee.",
      "Long tonal cords and restrained vertical branding keep the silhouette doing the heavy lifting.",
    ],
    materials: ["heavyweight brushed fleece", "wide straight leg", "ribbed elastic waist", "tonal drawcord", "embroidered CN mark"],
    media: [{ type: "image", url: "/products/structure-01/axis-wide-jogger-front.jpeg", alt: "CAISN Axis Wide Jogger in Washed Umber — front" }],
    variants: sizes("Washed Umber", "#57483D"),
    pairSlug: "caisn-vault-wash-zip",
    comingSoon: true,
  },
  {
    id: "S01-L01",
    slug: "caisn-fieldline-longsleeve",
    name: "CAISN FIELDLINE LONGSLEEVE",
    price: 55,
    category: "Longsleeves",
    edition: "STRUCTURE 01",
    spec: "BONE / WOODLAND",
    story: [
      "A clean bone body interrupted at the shoulder by full-length washed woodland sleeves.",
      "The extended CAISN wordmark acts like a measured line across an otherwise quiet front.",
    ],
    materials: ["260gsm cotton jersey", "relaxed boxy fit", "printed woodland sleeves", "ribbed collar and cuffs", "screen-printed chest mark"],
    media: [{ type: "image", url: "/products/structure-01/fieldline-longsleeve-front.jpeg", alt: "CAISN Fieldline Longsleeve in Bone and Woodland — front" }],
    variants: sizes("Bone / Woodland", "#E6E0D3"),
    comingSoon: true,
  },
  {
    id: "S01-D01",
    slug: "caisn-arc-flared-denim",
    name: "CAISN ARC FLARED DENIM",
    price: 95,
    category: "Denim",
    edition: "STRUCTURE 01",
    spec: "SMOKE WASH FLARE",
    story: [
      "Slim through the upper leg before opening into a controlled flare from the knee.",
      "A smoky seam-led wash gives the denim depth while keeping the construction clean and wearable.",
    ],
    materials: ["13.5oz cotton denim", "controlled flared leg", "custom smoke wash", "antique silver hardware", "reinforced curved pocket stitch"],
    media: [{ type: "image", url: "/products/structure-01/arc-flared-denim-front.jpeg", alt: "CAISN Arc Flared Denim in Smoke Black — front" }],
    variants: sizes("Smoke Black", "#292928"),
    comingSoon: true,
  },
  {
    id: "S01-O01",
    slug: "caisn-grid-overshirt",
    name: "CAISN GRID OVERSHIRT",
    price: 85,
    category: "Overshirts",
    edition: "STRUCTURE 01",
    spec: "BRUSHED MICRO-GRID",
    story: [
      "A long-sleeve outer layer cut with a compact boxy body and full coverage through the arm.",
      "Muted black, stone and moss lines turn a familiar check into a quieter architectural grid.",
    ],
    materials: ["brushed heavyweight cotton", "boxy overshirt cut", "matte snap closure", "two integrated chest pockets", "embroidered CAISN mark"],
    media: [{ type: "image", url: "/products/structure-01/grid-overshirt-front.jpeg", alt: "CAISN Grid Overshirt in Black Moss — front" }],
    variants: sizes("Black Moss", "#34372F"),
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
