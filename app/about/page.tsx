import type { Metadata } from "next";
import { AboutPhilosophy } from "../../src/components/AboutPhilosophy";
import { PublicPageShell } from "../../src/components/PublicPageShell";

export const metadata: Metadata = { title: "Tentang — Rangkul Cerita", description: "Filosofi dan batas peran Rangkul Cerita." };

export default function AboutPage() {
  return <PublicPageShell><main id="main-content" className="flex-1"><h1 className="sr-only">Tentang Rangkul Cerita</h1><AboutPhilosophy /></main></PublicPageShell>;
}
