import type { Metadata } from "next";
import { PartnershipPageContent } from "../../src/components/PartnershipPageContent";

export const metadata: Metadata = { title: "Kemitraan — Rangkul Cerita", description: "Informasi dan formulir permintaan kemitraan institusi atau komunitas." };

export default function PartnershipPage() {
  return <PartnershipPageContent />;
}
