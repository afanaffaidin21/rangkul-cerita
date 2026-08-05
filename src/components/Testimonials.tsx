'use client';

import React, { useState } from "react";
import { TESTIMONIALS_DATA } from "../data/landingData";
import { Heart, ChevronLeft, ChevronRight, Sparkles, UserCheck } from "lucide-react";

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  return (
    <section className="py-16 lg:py-24 bg-[#FAFBF8] border-b border-[#DDE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#2E6F57] text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Pengalaman Pengguna Pilot</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Cerita kecil dari mereka yang pernah memulai.
          </h2>
          <p className="text-sm text-[#66736C]">
             Contoh ilustratif untuk menunjukkan jenis pengalaman yang dapat didukung fitur ini; bukan testimoni pengguna terverifikasi.
          </p>
        </div>

        {/* Testimonials Grid & User Controlled Navigation */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#DDE4DF] shadow-md space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#DDE4DF] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF7F2] text-[#2E6F57] font-bold flex items-center justify-center text-sm border border-[#BFDCCD]">
                  {TESTIMONIALS_DATA[currentIndex].pseudonym[0]}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#173D30]">
                    {TESTIMONIALS_DATA[currentIndex].pseudonym},{" "}
                    <span className="font-normal text-xs text-[#66736C]">
                      {TESTIMONIALS_DATA[currentIndex].age} tahun • {TESTIMONIALS_DATA[currentIndex].city}
                    </span>
                  </h3>
                  <p className="text-xs text-[#2E6F57] font-semibold">
                    {TESTIMONIALS_DATA[currentIndex].role}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-1 bg-[#EEF7F2] text-[#2E6F57] rounded-full border border-[#BFDCCD]">
                [Testimoni pengguna pilot dengan izin]
              </span>
            </div>

            <p className="text-base text-[#17201B] font-serif italic leading-relaxed">
              “{TESTIMONIALS_DATA[currentIndex].story}”
            </p>

            <div className="pt-4 border-t border-[#DDE4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[#66736C]">Fitur yang digunakan: </span>
                <span className="font-bold text-[#173D30]">{TESTIMONIALS_DATA[currentIndex].featureUsed}</span>
              </div>

              <div className="text-[#2E7D5B] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{TESTIMONIALS_DATA[currentIndex].subjectiveOutcome}</span>
              </div>
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              className="p-3 bg-white border border-[#DDE4DF] text-[#173D30] hover:bg-[#EEF7F2] rounded-xl transition-colors shadow-sm"
              aria-label="Testimoni Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-semibold text-[#66736C]">
              {currentIndex + 1} dari {TESTIMONIALS_DATA.length}
            </span>

            <button
              onClick={handleNext}
              className="p-3 bg-white border border-[#DDE4DF] text-[#173D30] hover:bg-[#EEF7F2] rounded-xl transition-colors shadow-sm"
              aria-label="Testimoni Berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
