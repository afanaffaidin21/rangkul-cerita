'use client';

import React from "react";
import { MessageSquarePlus, Compass, Footprints, Sparkles, ArrowRight } from "lucide-react";

interface HowItWorksProps {
  onOpenJournalModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenJournalModal }) => {
  const steps = [
    {
      stepNumber: "01",
      title: "Ceritakan",
      subtitle: "Tanpa Takut Dihakimi",
      description: "Pilih perasaan dari mood checker atau tuliskan apa yang sedang mengganjal di pikiranmu, sekecil apa pun itu.",
      icon: MessageSquarePlus,
      bg: "bg-[#EFF5FA]",
      accent: "text-[#8FAFD0]",
    },
    {
      stepNumber: "02",
      title: "Pahami",
      subtitle: "Emosi & Kebutuhanmu",
      description: "AI pendamping merangkum cerita menjadi poin sederhana: emosi utama, kemungkinan pemicu, dan apa yang sebenarnya kamu butuhkan.",
      icon: Compass,
      bg: "bg-[#EEF7F2]",
      accent: "text-[#2E6F57]",
    },
    {
      stepNumber: "03",
      title: "Ambil Langkah",
      subtitle: "Satu Tindakan Kecil",
      description: "Pilih 1–3 langkah realistis: latihan pernapasan 2 menit, template pesan ke teman, atau rujukan layanan bantuan manusia.",
      icon: Footprints,
      bg: "bg-[#F7F0FA]",
      accent: "text-[#C8A4D8]",
    },
  ];

  return (
    <section id="cara-kerja" className="py-16 lg:py-20 bg-white border-b border-[#DDE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Begini cara Rangkul Cerita membantumu.
          </h2>
          <p className="text-sm sm:text-base text-[#35413A] leading-relaxed max-w-xl mx-auto">
            Tiga langkah tenang untuk berpindah dari merasa bingung menuju tindakan kecil yang terasa aman.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#FAFBF8] rounded-3xl p-8 shadow-sm rangkul-card-hover flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl ${item.bg} ${item.accent}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="font-serif italic font-normal text-2xl text-[#A0AAA4]">
                      {item.stepNumber}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#173D30] font-sans">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#2E6F57] mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-[#66736C] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 text-xs font-semibold text-[#2E6F57] flex items-center gap-1.5">
                  <span>Ditinjau tanpa label diagnosis</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action CTA */}
        <div className="text-center mt-12">
          <button
            onClick={onOpenJournalModal}
            className="px-8 py-4 bg-[#2E6F57] hover:bg-[#173D30] text-white text-sm font-bold rounded-2xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#BFDCCD]" />
            <span>Coba Sesi Pertamamu Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
