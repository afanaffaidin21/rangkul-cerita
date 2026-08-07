'use client';

import React from "react";
import {
  HeartHandshake,
  BookOpen,
  Sparkles,
  Footprints,
  FileText,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface MainFeaturesProps {
  onOpenJournalModal: () => void;
  onOpenSafetyModal: () => void;
  onOpenExerciseModal: () => void;
}

export const MainFeatures: React.FC<MainFeaturesProps> = ({
  onOpenJournalModal,
  onOpenSafetyModal,
  onOpenExerciseModal,
}) => {
  const features = [
    {
      id: "checkin",
      title: "Mood Check-in",
      badge: null,
      description: "Kenali emosi, skala intensitas, energi, dan pemicu utama dalam waktu kurang dari 2 menit.",
      icon: HeartHandshake,
      actionText: "Coba Check-in",
      onClick: onOpenJournalModal,
    },
    {
      id: "journal",
      title: "Jurnal AI Terpandu",
      badge: "Responsif & Privat",
      description: "Tidak perlu pusing mulai dari halaman kosong. AI mendampingi dengan 1 pertanyaan reflektif hangat.",
      icon: BookOpen,
      actionText: "Mulai Jurnal",
      onClick: onOpenJournalModal,
    },
    {
      id: "summary",
      title: "Ringkasan Emosi",
      badge: null,
      description: "Dapatkan rangkuman otomatis mengenai emosi utama, pemicu, kebutuhan, dan ide langkah selanjutnya.",
      icon: Sparkles,
      actionText: "Lihat Contoh",
      onClick: onOpenJournalModal,
    },
    {
      id: "steps",
      title: "Langkah Kecil Realistis",
      badge: null,
      description: "Pilih 1–3 tindakan konkret yang dapat kamu selesaikan hari ini tanpa merasa terbebani.",
      icon: Footprints,
      actionText: "Pilih Langkah",
      onClick: onOpenJournalModal,
    },
    {
      id: "selfhelp",
      title: "Self-Help Praktis",
      badge: "Latihan Praktis",
      description: "Akses latihan grounding 2 menit, audio pernapasan, artikel panduan, dan template pesan meminta bantuan.",
      icon: FileText,
      actionText: "Buka Latihan",
      onClick: onOpenExerciseModal,
    },
    {
      id: "safetysos",
      title: "Safety SOS & Krisis",
      badge: "Bantuan Darurat",
      description: "Jalur darurat 1-klik menuju Healing119 (119 ext 8), PSC 119, 112, dan langkah penanganan krisis.",
      icon: ShieldAlert,
      actionText: "Jalur Bantuan",
      onClick: onOpenSafetyModal,
    },
  ];

  return (
    <section id="fitur" className="py-20 lg:py-28 bg-[#FAFBF8] border-b border-[#DDE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Satu ruang, beberapa cara untuk merasa lebih terbantu.
          </h2>
          <p className="text-sm sm:text-base text-[#35413A] leading-relaxed max-w-xl mx-auto">
            Setiap fitur dirancang untuk fokus memberikan manfaat pengguna tanpa membuatnya merasa kewalahan.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-10">
          {features.map((feat, index) => {
            const IconComponent = feat.icon;
            const isSpotlight = index < 3;
            return (
              <div
                key={feat.id}
                className={`${isSpotlight ? "lg:col-span-2 bg-white border border-[#DDE4DF] rounded-3xl p-7 shadow-sm" : "lg:col-span-2 bg-white border border-[#DDE4DF] rounded-3xl p-5"} flex flex-col justify-between gap-5`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className={`${isSpotlight ? "w-10 h-10 rounded-xl bg-[#EEF7F2] flex items-center justify-center" : "w-8 h-8 rounded-lg bg-[#E8F0EA] flex items-center justify-center"}`}>
                      <IconComponent className="w-5 h-5 text-[#2E6F57]" />
                    </div>
                    {feat.badge && (
                      <span className="text-[10px] font-bold text-[#2E6F57]">
                        {feat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className={`${isSpotlight ? "text-lg" : "text-base"} font-bold text-[#173D30]`}>
                    {feat.title}
                  </h3>
                  <p className="text-sm text-[#66736C] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <button
                  onClick={feat.onClick}
                  className="text-xs font-bold text-[#2E6F57] hover:text-[#173D30] inline-flex items-center gap-1 transition-colors w-fit"
                >
                  <span>{feat.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
