import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";
import { ClearCartOnSuccess } from "@/components/ClearCartOnSuccess";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Order confirmed — CAISN" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let paid = false;
  let reference = "";

  if (sessionId) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      reference = session.id.slice(-10).toUpperCase();
    } catch {
      paid = false;
    }
  }

  return (
    <InfoPage title={paid ? "Order confirmed" : "Payment not verified"}>
      {paid ? (
        <>
          <ClearCartOnSuccess />
          <p className="mt-6 leading-relaxed text-[var(--color-fg-soft)]">
            Payment received. Your CAISN order is now being prepared.
          </p>
          <p className="tnum mt-4 text-xs tracking-[0.12em]">REFERENCE {reference}</p>
        </>
      ) : (
        <p className="mt-6 leading-relaxed text-[var(--color-fg-soft)]">
          We could not verify a completed payment. Your cart has not been cleared.
        </p>
      )}
      <Link href="/shop" className="mt-8 inline-block border-b border-current pb-1 text-xs tracking-[0.15em]">
        RETURN TO SHOP
      </Link>
    </InfoPage>
  );
}
