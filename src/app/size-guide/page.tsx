import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Size Guide — CAISN" };

export default function SizeGuidePage() {
  return <InfoPage title="Size Guide" />;
}
