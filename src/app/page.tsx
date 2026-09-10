import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/commerce/data";
import { displayName } from "@/lib/commerce/types";
import { Navbar } from "@/components/Navbar";
import { HomeHero } from "@/components/HomeHero";
import { Price } from "@/components/Price";
import { Footer } from "@/components/Footer";

export default async function Home() {
  const products = await getProducts();
  const featured = products[0];
  const campaign = products[2] ?? products[1] ?? featured;
  const campaignImage = campaign?.media.find((item) => item.type === "image" && !item.url.startsWith("plate:"));

  return (
    <main className="relative bg-[#f6f5f1] text-[#111211]">
      <Navbar />
      <HomeHero product={featured} />

      <section className="px-[var(--gutter)] py-20 md:py-28">
        <div className="mx-auto max-w-[74rem] text-center">
          <p className="text-[9px] uppercase tracking-[0.22em] text-black/45">CAISN / Structure 01</p>
          <h2 className="font-display mx-auto mt-5 max-w-[24ch] text-2xl font-medium leading-tight tracking-[-0.035em] md:text-4xl">
            Introducing a study in weight, proportion and movement. Garments designed as structure — never surface.
          </h2>
          <Link
            href="/shop"
            className="mt-7 inline-flex border border-black px-5 py-3 text-[9px] uppercase tracking-[0.17em] transition-colors hover:bg-black hover:text-white"
          >
            Shop the collection
          </Link>
        </div>
      </section>

      <section id="collection" className="border-t border-black/10">
        <div className="flex items-center justify-between px-[var(--gutter)] py-4 text-[9px] uppercase tracking-[0.18em]">
          <span>Current structures</span>
          <Link href="/shop" className="text-black/50 transition-colors hover:text-black">View all</Link>
        </div>

        <div className="grid grid-cols-2 border-t border-black/10 md:grid-cols-4">
          {products.slice(0, 4).map((product) => {
            const image = product.media.find((item) => item.type === "image" && !item.url.startsWith("plate:"));
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group border-b border-r border-black/10 bg-[#efeee9] last:border-r-0 md:border-b-0"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {image && (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                  )}
                  {product.comingSoon && (
                    <span className="absolute left-3 top-3 text-[8px] uppercase tracking-[0.16em] text-black/55">Coming soon</span>
                  )}
                </div>
                <div className="flex items-start justify-between gap-3 border-t border-black/10 bg-[#f6f5f1] p-3 text-[9px] uppercase tracking-[0.11em] md:p-4">
                  <div>
                    <p className="font-medium">{displayName(product.name).replace("CAISN ", "")}</p>
                    <p className="mt-1 text-black/45">{product.spec}</p>
                  </div>
                  <Price value={product.price} className="tnum shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {campaignImage && (
        <section className="relative min-h-[68svh] overflow-hidden bg-[#b9b4aa] text-white md:min-h-[86svh]">
          <Image
            src={campaignImage.url}
            alt={campaignImage.alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-[var(--gutter)] py-8 md:py-10">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/70">Field study / 001</p>
              <p className="font-display mt-2 text-3xl font-medium uppercase tracking-[-0.045em] md:text-6xl">Built, not printed.</p>
            </div>
            <Link href={`/product/${campaign.slug}`} className="hidden border-b border-white pb-1 text-[9px] uppercase tracking-[0.16em] sm:block">
              View structure ↗
            </Link>
          </div>
        </section>
      )}

      <section id="about" className="grid gap-10 px-[var(--gutter)] py-20 md:grid-cols-12 md:py-32">
        <p className="text-[9px] uppercase tracking-[0.2em] text-black/45 md:col-span-3">About CAISN</p>
        <div className="md:col-span-7 md:col-start-5">
          <h2 className="font-display text-3xl font-medium leading-[1.02] tracking-[-0.045em] md:text-5xl">
            Clothing shaped through construction, balance and restraint.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-black/55">
            CAISN treats every seam, proportion and material choice as part of the architecture. The result is quiet from a distance and considered up close.
          </p>
          <Link href="/shop" className="mt-7 inline-block border-b border-black pb-1 text-[9px] uppercase tracking-[0.16em]">
            Explore Structure 01
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
