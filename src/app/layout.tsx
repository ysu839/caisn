import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
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
        <CartProvider>
          <CustomCursorProvider>
            {children}
            <CartDrawer />
          </CustomCursorProvider>
        </CartProvider>
      </body>
    </html>
  );
}
