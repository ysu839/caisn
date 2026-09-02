import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, totalStock } from "@/lib/commerce/data";
import { ProductClient } from "./ProductClient";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "CAISN" };
  const priceText = product.price !== null ? ` €${product.price}.` : "";
  const statusText = product.comingSoon ? " Coming soon." : "";
  const description = `${product.edition} / ${product.spec}.${priceText}${statusText}`;
  const image = product.media.find((m) => m.type === "image" && !m.url.startsWith("plate:"));

  return {
    title: `${product.name} — CAISN`,
    description,
    openGraph: {
      title: `${product.name} — CAISN`,
      description,
      images: image ? [{ url: image.url, alt: image.alt }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const pair = product.pairSlug ? await getProductBySlug(product.pairSlug) : undefined;
  const related = (await getProducts())
    .filter((p) => p.id !== product.id && p.id !== pair?.id)
    .slice(0, 3);
  const stock = totalStock(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.story.join(" "),
    sku: product.id,
    material: product.materials.join(", "),
    // Omit the offer entirely rather than emit invalid/fabricated
    // structured data when pricing hasn't been confirmed yet — a
    // Product with no Offer is valid schema.org, a fake price isn't.
    ...(product.price !== null && {
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: product.price,
        // Coming Soon is a real, distinct availability state — a
        // priced product that isn't purchasable yet — not the same
        // claim as InStock/OutOfStock, so it gets its own enum value
        // rather than a availability that would misstate readiness.
        availability: product.comingSoon
          ? "https://schema.org/PreOrder"
          : stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
    }),
  };

  return (
    <>
      {/* Escape "<" so this can never be interpreted as closing the script tag
          early — this is our own commerce data, not user input, but the habit
          is cheap and the failure mode (broken page) isn't worth risking. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductClient product={product} related={related} pair={pair} total={stock} />
    </>
  );
}
