'use client';

import React, { useState } from "react";
import { SELF_HELP_RESOURCES } from "../data/landingData";
import { SelfHelpResource } from "../types";
import { Sparkles, Clock, ShieldCheck, Play, ArrowRight, BookOpen, Layers } from "lucide-react";

interface SelfHelpLibraryProps {
  onOpenExerciseModal: () => void;
}

export const SelfHelpLibrary: React.FC<SelfHelpLibraryProps> = ({ onOpenExerciseModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = [
    "Semua",
    "Cemas dan Overthinking",
    "Kesepian",
    "Stres Sekolah atau Kuliah",
    "Keluarga",
    "Pertemanan",
  ];

  const filteredResources =
    selectedCategory === "Semua"
      ? SELF_HELP_RESOURCES
      : SELF_HELP_RESOURCES.filter((r) => r.category === selectedCategory);

  return (
    <section id="self-help" className="py-16 lg:py-24 bg-white border-b border-[#DDE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#2E6F57] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Materi Self-Help untuk Refleksi Awal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Temukan yang paling relevan dengan ceritamu.
          </h2>
          <p className="text-sm sm:text-base text-[#66736C] max-w-xl mx-auto">
             Latihan singkat, artikel panduan, dan template pesan untuk membantu refleksi awal.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#2E6F57] text-white shadow-sm"
                  : "bg-[#F3F5F2] text-[#35413A] hover:bg-[#DDE4DF]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAFBF8] rounded-3xl p-6 border border-[#DDE4DF] shadow-sm rangkul-card-hover flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#EEF7F2] text-[#2E6F57] border border-[#BFDCCD]">
                    {item.category}
                  </span>
                  <span className="text-xs text-[#66736C] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {item.duration}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#173D30]">
                  {item.title}
                </h3>

                <p className="text-xs text-[#66736C] leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#DDE4DF] space-y-3">
                <div className="text-[11px] text-[#35413A] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E6F57]" />
                  <span>{item.reviewer}</span>
                </div>

                {item.isInteractiveExercise ? (
                  <button
                    onClick={onOpenExerciseModal}
                    className="w-full py-2.5 bg-[#2E6F57] hover:bg-[#173D30] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-[#BFDCCD]" /> Mulai Latihan Sekarang
                  </button>
                ) : (
                  <button
                    onClick={onOpenExerciseModal}
                    className="w-full py-2.5 border border-[#DDE4DF] bg-white hover:bg-[#F3F5F2] text-[#173D30] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#2E6F57]" /> Baca Panduan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
