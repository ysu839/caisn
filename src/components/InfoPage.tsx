import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/**
 * Shell for policy/service pages (Size Guide, Care, Shipping, Returns,
 * Privacy, Terms, Contact) whose real content hasn't been supplied by
 * the CAISN team yet. Renders an honest "content pending" state rather
 * than inventing legal or policy copy — the route exists (so the
 * footer link works and isn't a dead end) but says plainly that
 * factual content is still required before launch.
 */
export function InfoPage({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-2xl px-[var(--gutter)] py-16 md:py-24">
        <h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1>
        {children ?? (
          <p className="mt-6 text-base leading-relaxed text-[var(--color-fg-soft)]">
            This page is being finalized. Full {title.toLowerCase()} details will be published here before CAISN
            opens for checkout.
          </p>
        )}
      </section>
      <Footer />
    </main>
  );
}
