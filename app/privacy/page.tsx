import type { Metadata } from "next";
import { PublicPageShell } from "../../src/components/PublicPageShell";
import { PrivacyControls } from "../../src/components/PrivacyControls";

export const metadata: Metadata = { title: "Privasi & Data — Rangkul Cerita", description: "Pelajari batas penyimpanan dan kelola data Rangkul Cerita di browser ini." };

export default function PrivacyPage() {
  return <PublicPageShell><main id="main-content" className="flex-1 py-16 lg:py-24"><div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10"><header className="space-y-4"><h1 className="text-3xl sm:text-4xl font-bold text-[#173D30]">Privasi dan kontrol data yang tersedia.</h1><p className="text-base text-[#35413A] leading-relaxed">Data jurnal yang disimpan di aplikasi tetap lokal di browser ini. Penyimpanan browser bukan vault terenkripsi. Teks yang kamu kirim untuk refleksi AI diproses melalui server dan penyedia AI saat fitur tersebut digunakan.</p></header><section className="space-y-4"><h2 className="text-xl font-bold text-[#173D30]">Batas yang perlu kamu ketahui</h2><ul className="list-disc pl-5 space-y-2 text-sm text-[#35413A]"><li>Kamu dapat menggunakan nama samaran.</li><li>Data lokal dapat diakses oleh orang yang memiliki akses ke perangkat atau profil browser yang sama.</li><li>Kontrol unduh dan hapus di bawah hanya berlaku untuk data Rangkul Cerita yang tersedia di browser ini.</li></ul></section><PrivacyControls /></div></main></PublicPageShell>;
}
