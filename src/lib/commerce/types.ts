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
};
