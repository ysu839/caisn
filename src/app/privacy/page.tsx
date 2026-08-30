import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Privacy — CAISN" };

export default function PrivacyPage() {
  return <InfoPage title="Privacy Policy" />;
}
