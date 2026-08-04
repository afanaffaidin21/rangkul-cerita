'use client';

import React from "react";
import { Sparkles, Phone, ArrowRight, CheckCircle2 } from "lucide-react";

interface FinalCTAProps {
  onStartCheckin: () => void;
  onOpenSafetyModal: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartCheckin, onOpenSafetyModal }) => {
  return (
    <section className="py-20 lg:py-28 bg-white text-center relative overflow-hidden">
      {/* Background soft organic glow */}
      <div className="absolute inset-0 bg-rangkul-lines opacity-60 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF7F2] border border-[#BFDCCD] text-[#2E6F57] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#58A17F]" />
          <span>Ruang Aman Selalu Terbuka</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173D30] font-sans leading-tight">
          Kamu tidak perlu menunggu sampai semuanya terasa{" "}
          <span className="font-serif italic text-[#2E6F57] font-normal underline decoration-[#BFDCCD] underline-offset-4">
            terlalu berat.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-[#66736C] max-w-2xl mx-auto leading-relaxed">
          Mulai dengan check-in singkat. Tidak perlu tahu harus menulis apa dan tidak harus langsung berbicara dengan orang lain.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onStartCheckin}
            className="w-full sm:w-auto px-8 py-4 bg-[#2E6F57] hover:bg-[#173D30] text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5"
          >
            <span>Mulai Check-in Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSafetyModal}
            className="w-full sm:w-auto px-6 py-4 bg-[#FAFBF8] hover:bg-[#F3F5F2] text-[#173D30] border border-[#DDE4DF] text-sm font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#2E6F57]" />
            <span>Lihat Pilihan Bantuan</span>
          </button>
        </div>

        {/* Microcopy */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs text-[#66736C] pt-2">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" /> Sekitar dua menit
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" /> Bisa pakai nama samaran
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" /> Bukan diagnosis medis
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" /> Dapat berhenti kapan saja
          </span>
        </div>
      </div>
    </section>
  );
};
