import Image from "next/image";
import { Product } from "@/lib/commerce/types";

/**
 * CAISN's about statement, composed like a blueprint annotation rather
 * than a generic "About Us" block — thin structural rules, a real
 * garment detail crop (not a fake browser chrome or stock photo), and
 * a small section index. Copy is unchanged from the previous version;
 * only the composition changes.
 */
export function AboutSection({ product }: { product?: Product }) {
  const images = product?.media.filter((m) => m.type === "image" && !m.url.startsWith("plate:")) ?? [];
  // Back image, not front — the hero and Construction Sheet already
  // use the front shot; this crop needs a different storytelling
  // purpose, not another repeat of the same view.
  const detailImage = images[1] ?? images[0];

  const index = [
    { n: "01", label: "STRUCTURE" },
    { n: "02", label: "MATERIAL" },
    { n: "03", label: "INTENT" },
  ];

  return (
    <section id="about" className="border-t border-[var(--color-line)] px-[var(--gutter)] py-24 md:py-36">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <span className="tnum text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">ABOUT CAISN</span>
          <h2 className="font-display mt-4 text-[15vw] font-medium uppercase leading-[0.82] tracking-[-0.065em] md:text-7xl lg:text-8xl">
            BUILT, NOT
            <br />
            PRINTED<span className="text-[var(--color-accent)]">.</span>
          </h2>

          <div className="mt-12 max-w-lg border-l border-[var(--color-accent)] pl-6 md:ml-[14%]">
            <p className="font-display text-lg font-medium leading-snug">
              Every seam is a decision. We show you all of them.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-soft)]">
              CAISN is a structural-fashion label: garments engineered like architecture, not decorated like
              merchandise. Construction, panel lines and hardware are treated as the design itself — visible on
              purpose, never hidden under print.
            </p>
          </div>

          <ul className="mt-12 flex gap-8 border-t border-[var(--color-line)] pt-4">
            {index.map((item) => (
              <li key={item.n} className="flex items-baseline gap-2">
                <span className="tnum text-[10px] text-[var(--color-accent)]">{item.n}</span>
                <span className="text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {detailImage && (
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[var(--color-line)] bg-[var(--surface-plate)]">
              {/* A tight crop of the real garment — a detail, not the
                  full product shot already shown elsewhere on the page. */}
              <Image
                src={detailImage.url}
                alt={detailImage.alt}
                fill
                sizes="(min-width: 768px) 35vw, 90vw"
                className="scale-[1.6] object-cover object-[50%_32%]"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
