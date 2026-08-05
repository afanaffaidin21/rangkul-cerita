'use client';

import React from "react";
import { UserX, Lock, ShieldAlert, FileKey, ArrowRight, ShieldCheck } from "lucide-react";

interface SafetyPrivacySectionProps {
  onOpenPrivacyModal: () => void;
  onOpenSafetyModal: () => void;
}

export const SafetyPrivacySection: React.FC<SafetyPrivacySectionProps> = ({
  onOpenPrivacyModal,
  onOpenSafetyModal,
}) => {
  const pillars = [
    {
      title: "1. Identitas Minimum",
      description: "Pengguna dapat menggunakan nama samaran (alias) dan hanya memberikan data minimum yang diperlukan.",
      icon: UserX,
    },
    {
      title: "2. Cerita Tetap Milikmu",
      description: "Data yang disimpan aplikasi berada di browser perangkat ini. Kamu dapat mengunduh data yang tersedia atau menghapus penyimpanan aplikasi dari sini.",
      icon: Lock,
    },
    {
      title: "3. AI dengan Batas Jelas",
      description: "AI bertindak sebagai teman refleksi, tidak mendiagnosis, tidak meresepkan obat, dan tidak menggantikan psikolog.",
      icon: ShieldCheck,
    },
    {
      title: "4. Safety Escalation",
      description: "Ketika terdapat indikasi krisis atau risiko bahaya, sistem segera mengarahkan pengguna menuju bantuan manusia.",
      icon: ShieldAlert,
    },
  ];

  return (
    <section id="keamanan" className="py-20 lg:py-28 bg-[#173D30] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2E6F57] text-[#BFDCCD] text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Keamanan & Batas AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sans">
            Ceritamu sensitif. Perlindungannya juga harus serius.
          </h2>
          <p className="text-sm sm:text-base text-[#BFDCCD] font-normal leading-relaxed">
            Rangkul Cerita dibangun dengan prinsip Privacy by Default dan pertimbangan keselamatan utama di setiap fitur.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {pillars.map((pil, idx) => {
            const IconComp = pil.icon;
            return (
              <div
                key={idx}
                className="bg-[#2E6F57]/35 border border-[#BFDCCD]/20 rounded-2xl p-6 space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2E6F57] text-[#BFDCCD] flex items-center justify-center">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">{pil.title}</h3>
                <p className="text-sm text-[#BFDCCD] leading-relaxed font-normal">
                  {pil.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Visual Flow Diagram */}
        <div className="bg-[#2E6F57]/30 border border-[#BFDCCD]/20 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-4">
          <h3 className="text-center text-xs font-bold text-[#BFDCCD] uppercase tracking-wider">
            Alur Keamanan Data Pengguna:
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center text-xs">
            <div className="py-3 w-full sm:w-auto">
              1. Tulis Cerita
            </div>
            <ArrowRight className="w-4 h-4 text-[#BFDCCD] hidden sm:block" />
            <div className="py-3 w-full sm:w-auto">
              2. Penyimpanan Lokal
            </div>
            <ArrowRight className="w-4 h-4 text-[#BFDCCD] hidden sm:block" />
            <div className="py-3 w-full sm:w-auto">
              3. Kontrol Pengguna
            </div>
            <ArrowRight className="w-4 h-4 text-[#BFDCCD] hidden sm:block" />
            <div className="py-3 font-bold text-[#BFDCCD] w-full sm:w-auto">
              4. Tidak Disimpan di Server oleh Default
            </div>
          </div>
        </div>

        {/* Quick Privacy Control Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs">
          <button
            onClick={onOpenPrivacyModal}
            className="px-5 py-2.5 bg-[#BFDCCD] hover:bg-white text-[#173D30] font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <FileKey className="w-4 h-4" /> Buka Pusat Kontrol Privasi
          </button>
          <button
            onClick={onOpenSafetyModal}
            className="px-5 py-2.5 bg-[#B8414E] hover:bg-[#8F2E3B] text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" /> Protokol Krisis & Bantuan
          </button>
        </div>

      </div>
    </section>
  );
};
