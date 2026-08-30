import Link from "next/link";

const columns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "SHOP",
    links: [
      { label: "All Editions", href: "/shop" },
      { label: "About CAISN", href: "/#about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "SUPPORT",
    links: [
      { label: "Size Guide", href: "/size-guide" },
      { label: "Care", href: "/care" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
  },
  {
    heading: "LEGAL",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

/**
 * Full site footer. Every link routes to a real page (InfoPage shell)
 * rather than a dead "#" — pages without confirmed policy copy yet
 * show an honest pending state instead of inventing one. No social
 * link is included: no verified CAISN social handle exists in the
 * data this app has, and a guessed URL would be worse than none.
 */
export function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)]">
      {/* Bold wordmark band — a quiet close to the page rather than the
          previous plain small logo line, without borrowing anyone
          else's palette: CAISN's own ink/paper roles, just inverted. */}
      <div className="overflow-hidden bg-[var(--ink)] px-[var(--gutter)] pb-6 pt-10">
        <span className="font-display block select-none text-[16vw] font-semibold leading-[0.8] tracking-tight text-[var(--paper)] md:text-[7vw]">
          CAISN
        </span>
      </div>
      <div className="grid grid-cols-2 gap-8 px-[var(--gutter)] py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="font-display text-lg font-semibold">
            CAISN
          </Link>
          <p className="mt-3 max-w-[22ch] text-xs leading-relaxed text-[var(--color-fg-soft)]">
            built, not printed.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.heading}>
            <p className="text-[10px] tracking-[0.15em] text-[var(--color-fg-soft)]">{col.heading}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:text-[var(--color-accent)]"
                    style={{ transitionDuration: "var(--dur-snap)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-[var(--color-line)] px-[var(--gutter)] py-6 text-xs tracking-[0.05em] text-[var(--color-fg-soft)] sm:flex-row sm:items-center sm:justify-between">
        <span>CAISN © 2026</span>
        <span>Prices shown in EUR.</span>
      </div>
    </footer>
  );
}
