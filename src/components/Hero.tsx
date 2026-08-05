'use client';

import React from "react";
import { Sparkles, Shield, Lock, Heart, ArrowRight, CheckCircle2, UserCheck, Play } from "lucide-react";

interface HeroProps {
  onStartCheckin: () => void;
  onOpenJournalModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartCheckin, onOpenJournalModal }) => {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 rangkul-gradient">
      {/* Decorative organic shape background */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#BFDCCD]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#58A17F]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#EEF7F2] text-[#2E6F57] text-xs font-semibold">
              <span>Ruang refleksi untuk anak muda Indonesia</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173D30] font-sans leading-[1.1] tracking-[-0.025em] max-w-3xl">
              Ruang aman untuk memahami perasaanmu,{" "}
              <span className="font-serif italic text-[#2E6F57] font-normal underline decoration-[#BFDCCD]/80 decoration-wavy underline-offset-4">
                pelan-pelan.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#35413A] leading-7 max-w-xl font-normal">
              Lakukan check-in emosi, tulis cerita dengan panduan yang hangat, dan temukan langkah berikutnya tanpa buru-buru diberi label.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={onStartCheckin}
                className="px-7 py-4 bg-[#2E6F57] hover:bg-[#173D30] text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#2E6F57] focus:ring-offset-2"
              >
                <span>Mulai Check-in Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#cara-kerja"
                className="px-6 py-4 bg-transparent hover:bg-white/70 text-[#35413A] text-sm font-medium rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-[#2E6F57]" />
                <span>Lihat Cara Kerjanya</span>
              </a>
            </div>

            {/* Microcopy bullets */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-y-2 gap-x-4 text-xs text-[#66736C] pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" /> Sekitar 2 menit
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" /> Boleh pakai nama samaran
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" /> Bukan diagnosis medis
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" /> Bebas berhenti kapan saja
              </span>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-[#DDE4DF] flex flex-wrap items-center gap-4 text-xs text-[#35413A]">
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <UserCheck className="w-4 h-4 text-[#2E6F57]" />
                <span className="font-medium">Identitas Minimum</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <Lock className="w-4 h-4 text-[#2E6F57]" />
                <span className="font-medium">Privasi sebagai Standar</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <Shield className="w-4 h-4 text-[#2E6F57]" />
                <span className="font-medium">AI dengan Safety Guardrail</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Visual Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#DDE4DF] rangkul-card-hover space-y-5">
              
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-[#DDE4DF] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF7F2] text-[#2E6F57] font-bold flex items-center justify-center text-sm">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#173D30] block">
                      Refleksi Emosi Harian
                    </span>
                    <span className="text-[10px] text-[#66736C]">
                      Rangkul Cerita • Sesi Privat
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#EEF7F2] text-[#2E6F57] border border-[#BFDCCD] text-[10px] font-bold rounded-full">
                  Privat & Aman
                </span>
              </div>

              {/* Step preview snippet */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#173D30]">
                  1. Pilih apa yang paling terasa hari ini:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-[#F7F0FA] text-[#C8A4D8] border border-[#C8A4D8]/50 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                    🌀 Cemas
                  </span>
                  <span className="px-3 py-1.5 bg-[#EFF5FA] text-[#8FAFD0] border border-[#DDE4DF] text-xs font-medium rounded-xl">
                    💧 Sedih
                  </span>
                  <span className="px-3 py-1.5 bg-[#F8F5F0] text-[#C8B59A] border border-[#DDE4DF] text-xs font-medium rounded-xl">
                    🪫 Lelah
                  </span>
                  <span className="px-3 py-1.5 bg-[#EEF7F2] text-[#2E6F57] border border-[#DDE4DF] text-xs font-medium rounded-xl">
                    🌿 Lumayan
                  </span>
                </div>
              </div>

              {/* Reflection bubble snippet */}
              <div className="p-4 bg-[#F3F5F2] rounded-2xl border border-[#DDE4DF] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E6F57]">
                  <Sparkles className="w-3.5 h-3.5" /> Respons Reflektif Hangat
                </div>
                <p className="text-xs text-[#35413A] italic leading-relaxed">
                  “Kedengarannya hari ini pikiranmu sedang memutar cukup kencang. Mengakui bahwa kamu cemas adalah langkah keberanian pertama.”
                </p>
              </div>

              {/* Action recommendation snippet */}
              <div className="p-3.5 bg-[#EEF7F2] border border-[#BFDCCD] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#173D30] block">Rekomendasi Langkah Kecil:</span>
                  <span className="text-[#35413A] text-[11px]">Latihan Grounding 5-4-3-2-1 (2 Menit)</span>
                </div>
                <button
                  onClick={onOpenJournalModal}
                  className="px-3 py-1.5 bg-[#2E6F57] text-white text-[11px] font-semibold rounded-lg shrink-0 hover:bg-[#173D30] transition-colors"
                >
                  Coba Sekarang
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
