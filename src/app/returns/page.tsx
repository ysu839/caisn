import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Returns — CAISN" };

export default function ReturnsPage() {
  return <InfoPage title="Returns" />;
}
