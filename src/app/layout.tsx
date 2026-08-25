import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { CustomCursorProvider } from "@/lib/motion/CustomCursor";
import { CartProvider } from "@/lib/cart/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import "./globals.css";

// No fixed `weight` array — this loads Archivo's actual variable font file
// (wght axis) rather than a set of static instances, so `font-variation-
// settings: 'wght' N` can be animated at runtime (needed for kinetic type).
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAISN",
  description: "Built, not printed.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-fg)]">
        {/* reducedMotion="user" makes every Framer Motion animation in the
            app (bento card->fullscreen, animated price, cart drawer slide)
            respect prefers-reduced-motion automatically — GSAP/Three paths
            are gated per-component since they don't share this config. */}
        <MotionConfig reducedMotion="user">
          <CartProvider>
            <CustomCursorProvider>
              {children}
              <CartDrawer />
            </CustomCursorProvider>
          </CartProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
