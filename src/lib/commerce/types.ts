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
  media: ProductMedia[];
  variants: Variant[];
  model3dUrl?: string;
};
