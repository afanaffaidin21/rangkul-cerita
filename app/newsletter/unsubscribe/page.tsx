import type { Metadata } from "next";
import { PublicPageShell } from "../../../src/components/PublicPageShell";
import { NewsletterUnsubscribeForm } from "../../../src/components/NewsletterUnsubscribeForm";

export const metadata: Metadata = {
  title: "Berhenti Berlangganan — Rangkul Cerita",
  description: "Berhenti berlangganan Kabar Rangkul Cerita tanpa perlu akun.",
};

export default function NewsletterUnsubscribePage() {
  return (
    <PublicPageShell>
      <main id="main-content" className="flex-1 py-16 lg:py-24">
        <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-8">
          <header className="space-y-3 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#173D30]">
              Berhenti berlangganan
            </h1>
            <p className="text-sm text-[#35413A] leading-relaxed">
              Masukkan alamat email yang ingin kamu hentikan dari Kabar Rangkul Cerita. Tidak perlu akun.
            </p>
          </header>
          <NewsletterUnsubscribeForm />
        </div>
      </main>
    </PublicPageShell>
  );
}
