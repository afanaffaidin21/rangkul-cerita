'use client';

import React from "react";
import {
  HeartHandshake,
  BookOpen,
  Sparkles,
  Footprints,
  FileText,
  TrendingUp,
  Users,
  ShieldAlert,
  Search,
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
      badge: "Berbasis Bukti",
      description: "Akses latihan grounding 2 menit, audio pernapasan, artikel panduan, dan template pesan meminta bantuan.",
      icon: FileText,
      actionText: "Buka Latihan",
      onClick: onOpenExerciseModal,
    },
    {
      id: "insights",
      title: "Mood History & Insight",
      badge: "Non-Diagnosis",
      description: "Lihat tren emosi mingguan tanpa skor atau label depresi otomatis. Pahami pola pemicu dengan tenang.",
      icon: TrendingUp,
      actionText: "Lihat Tren",
      onClick: onOpenJournalModal,
    },
    {
      id: "peersupport",
      title: "Peer Support Terstruktur",
      badge: "Pilot Terbatas",
      description: "Grup refleksi kecil dengan nama samaran, fasilitator terlatih, dan aturan komunitas ketat tanpa DM liar.",
      icon: Users,
      actionText: "Info Pilot",
      onClick: onOpenJournalModal,
    },
    {
      id: "safetysos",
      title: "Safety SOS & Krisis",
      badge: "Siap 24/7",
      description: "Jalur darurat 1-klik menuju Layanan Sehat Jiwa 119 Ext 8, LISA Helpline, dan langkah penanganan krisis.",
      icon: ShieldAlert,
      actionText: "Jalur Bantuan",
      onClick: onOpenSafetyModal,
    },
    {
      id: "directory",
      title: "Direktori Bantuan",
      badge: "Terverifikasi",
      description: "Cari layanan psikolog, konselor kampus, dan rumah sakit berdasarkan kota, biaya, dan jam operasional.",
      icon: Search,
      actionText: "Cari Layanan",
      onClick: onOpenSafetyModal,
    },
  ];

  return (
    <section id="fitur" className="py-16 lg:py-24 bg-[#FAFBF8] border-b border-[#DDE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#2E6F57] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fitur Utama Rangkul Cerita</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Satu ruang, beberapa cara untuk merasa lebih terbantu.
          </h2>
          <p className="text-sm sm:text-base text-[#66736C] max-w-xl mx-auto">
            Setiap fitur dirancang untuk fokus memberikan manfaat pengguna tanpa membuatnya merasa kewalahan.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white rounded-3xl p-6 border border-[#DDE4DF] shadow-sm rangkul-card-hover flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[#EEF7F2] text-[#2E6F57] border border-[#BFDCCD]">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {feat.badge && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F3F5F2] text-[#173D30] border border-[#DDE4DF]">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-[#173D30]">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-[#66736C] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#DDE4DF]">
                  <button
                    onClick={feat.onClick}
                    className="text-xs font-bold text-[#2E6F57] hover:text-[#173D30] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{feat.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
