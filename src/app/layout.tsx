import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { CustomCursorProvider } from "@/lib/motion/CustomCursor";
import { CartProvider } from "@/lib/cart/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
