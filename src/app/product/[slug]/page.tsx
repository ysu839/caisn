import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, totalStock } from "@/lib/commerce/data";
import { ProductClient } from "./ProductClient";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProducts()).filter((p) => p.id !== product.id).slice(0, 3);

  return <ProductClient product={product} related={related} total={totalStock(product)} />;
}
