import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Contact — CAISN" };

export default function ContactPage() {
  return <InfoPage title="Contact" />;
}
