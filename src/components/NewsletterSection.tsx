'use client';

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Heart } from "lucide-react";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes("@")) {
      setErrorMsg("Mohon masukkan alamat email yang valid.");
      return;
    }
    if (!consent) {
      setErrorMsg("Mohon menyetujui persetujuan privasi terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : data.error?.message || "Gagal mendaftar newsletter");
      }

      setSuccessMsg(data.message);
      setEmail("");
      setConsent(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-[#FAFBF8] border-b border-[#DDE4DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Inspirational Warm Quote */}
        <div className="p-8 sm:p-10 bg-white border border-[#DDE4DF] rounded-3xl text-center shadow-sm space-y-3">
          <Heart className="w-6 h-6 text-[#2E6F57] mx-auto fill-current" />
          <blockquote className="text-lg sm:text-xl font-serif italic text-[#173D30] leading-relaxed max-w-xl mx-auto">
            “Kamu tidak harus menyelesaikan semuanya hari ini. Kadang satu cerita adalah awal yang cukup.”
          </blockquote>
        </div>

        {/* Weekly Reflection Newsletter Box */}
        <div className="bg-[#173D30] text-white rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E6F57] text-[#BFDCCD] text-xs font-semibold">
              <Mail className="w-3.5 h-3.5" />
              <span>Teman Mingguan Rangkul Cerita</span>
            </div>
            <h3 className="text-2xl font-bold font-sans">
              Temani perjalananmu, satu pesan kecil setiap minggu.
            </h3>
            <p className="text-xs sm:text-sm text-[#BFDCCD]">
              Dapatkan refleksi singkat, latihan praktis 2 menit, dan panduan memahami emosi langsung di kotak masukmu. Bebas spam, bisa batal berlangganan kapan saja.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-3">
            {successMsg && (
              <div role="status" aria-live="polite" className="p-3 bg-[#EEF7F2] border border-[#BFDCCD] text-[#2E7D5B] text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
              </div>
            )}

            {errorMsg && (
              <div id="newsletter-error" role="alert" aria-live="assertive" className="p-3 bg-[#FBEAEC] border border-[#E89887] text-[#B8414E] text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <label htmlFor="newsletter-email" className="sr-only">Alamat email</label>
              <input
                id="newsletter-email"
                type="email"
                aria-invalid={Boolean(errorMsg && (!email || !email.includes("@")))}
                aria-describedby={errorMsg ? "newsletter-error" : undefined}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan alamat email kamu..."
                className="flex-1 px-4 py-3 text-xs bg-white text-[#17201B] border border-[#DDE4DF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#58A17F]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#58A17F] hover:bg-[#2E6F57] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Mengirim..." : "Kirim Teman Mingguan"}
              </button>
            </div>

            <label className="flex items-start gap-2 text-[11px] text-[#BFDCCD] cursor-pointer pt-1">
              <input
                id="newsletter-consent"
                type="checkbox"
                aria-describedby={errorMsg && !consent ? "newsletter-error" : undefined}
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-[#BFDCCD] text-[#2E6F57] focus:ring-[#2E6F57]"
              />
              <span>
                Saya menyetujui Kebijakan Privasi Rangkul Cerita dan bersedia menerima pesan refleksi mingguan.
              </span>
            </label>
          </form>
        </div>

      </div>
    </section>
  );
};
