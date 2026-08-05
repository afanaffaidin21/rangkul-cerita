import type { Metadata } from "next";
import { ResourcesPageContent } from "../../src/components/ResourcesPageContent";

export const metadata: Metadata = {
  title: "Materi Self-Help — Rangkul Cerita",
  description: "Latihan singkat, panduan, dan template pesan untuk refleksi awal.",
};

export default function ResourcesPage() {
  return <ResourcesPageContent />;
}
