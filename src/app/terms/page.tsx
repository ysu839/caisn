import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Terms — CAISN" };

export default function TermsPage() {
  return <InfoPage title="Terms of Service" />;
}
