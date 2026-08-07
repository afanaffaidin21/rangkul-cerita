"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

export const NewsletterUnsubscribeForm: React.FC = () => {
  const [email, setEmail] = useState("");
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

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Permintaan belum dapat diproses. Coba lagi nanti.");
      }

      setSuccessMsg(data.message);
      setEmail("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#DDE4DF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
      {successMsg && (
        <div role="status" aria-live="polite" className="p-3 bg-[#EEF7F2] border border-[#BFDCCD] text-[#2E7D5B] text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div id="newsletter-unsubscribe-error" role="alert" aria-live="assertive" className="p-3 bg-[#FBEAEC] border border-[#E89887] text-[#B8414E] text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="newsletter-unsubscribe-email" className="sr-only">
          Alamat email
        </label>
        <input
          id="newsletter-unsubscribe-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errorMsg && (!email || !email.includes("@")))}
          aria-describedby={errorMsg ? "newsletter-unsubscribe-error" : undefined}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan alamat email kamu..."
          className="w-full px-4 py-3 text-sm bg-white text-[#17201B] border border-[#DDE4DF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#58A17F]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-[#173D30] hover:bg-[#2E6F57] text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Memproses..." : "Berhenti Berlangganan"}
        </button>
      </form>
    </div>
  );
};
