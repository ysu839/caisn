import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Shipping — CAISN" };

export default function ShippingPage() {
  return <InfoPage title="Shipping" />;
}
