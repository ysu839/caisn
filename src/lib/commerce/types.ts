export type Money = number; // minor-unit-free display value, e.g. 145 => €145

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
  price: Money;
  edition: string; // e.g. "EDITION 04"
  spec: string; // e.g. "620G RAW WOOL"
  story: string[];
  materials: string[];
  /**
   * NOT YET WIRED TO ANY RENDERER. Reserved for a future product
   * gallery component; the "plate:*" URLs in the mock data are
   * placeholder sentinels, not resolvable asset paths. The actual
   * swap points in use today are ProductPlate's `label`/`spec`/
   * `index` props (art-directed placeholder graphic) and
   * `model3dUrl` below (real 3D asset). Don't assume setting this
   * field changes what's displayed until a gallery consumer exists.
   */
  media: ProductMedia[];
  variants: Variant[];
  model3dUrl?: string;
};
