import type { Metadata } from "next";
import { HumanSupportPageContent } from "../../src/components/HumanSupportPageContent";

export const metadata: Metadata = { title: "Dukungan Manusia — Rangkul Cerita", description: "Temukan orang tepercaya dan layanan bantuan manusia yang sesuai." };

export default function HelpPage() {
  return <HumanSupportPageContent />;
}
