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

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-7 top-8 bottom-8 w-px bg-[#BFDCCD] md:left-[16.666%] md:right-[16.666%] md:top-7 md:bottom-auto md:h-px md:w-auto" />
          <div className="relative grid gap-8 md:grid-cols-3 md:gap-10">
            {steps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="relative grid grid-cols-[3.5rem_1fr] gap-5 md:block md:text-center">
                  <div className={`relative z-10 w-14 h-14 rounded-full ${item.bg} ${item.accent} border-4 border-white shadow-sm flex items-center justify-center md:mx-auto`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="space-y-3 md:mt-5">
                    <div className="flex items-baseline gap-3 md:block">
                      <span className="font-serif italic text-xl text-[#A0AAA4]">{item.stepNumber}</span>
                      <h3 className="text-xl font-bold text-[#173D30] font-sans md:mt-1">{item.title}</h3>
                    </div>
                    <p className="text-xs font-semibold text-[#2E6F57]">{item.subtitle}</p>
                    <p className="text-sm text-[#66736C] leading-relaxed">{item.description}</p>
                    <p className="text-xs font-semibold text-[#2E6F57]">Ditinjau tanpa label diagnosis</p>
                  </div>
                </div>
              );
            })}
          </div>
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
