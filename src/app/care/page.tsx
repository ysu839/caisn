import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Care — CAISN" };

export default function CarePage() {
  return <InfoPage title="Care" />;
}
