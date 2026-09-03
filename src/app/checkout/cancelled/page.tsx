import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Checkout cancelled — CAISN" };

export default function CheckoutCancelledPage() {
  return (
    <InfoPage title="Checkout cancelled">
      <p className="mt-6 leading-relaxed text-[var(--color-fg-soft)]">
        No payment was taken. Your items are still waiting in your cart.
      </p>
      <Link href="/shop" className="mt-8 inline-block border-b border-current pb-1 text-xs tracking-[0.15em]">
        CONTINUE SHOPPING
      </Link>
    </InfoPage>
  );
}
