'use client';

import React from "react";
import { ARTICLES_DATA } from "../data/landingData";
import { ArticleItem } from "../types";
import { BookOpen, Clock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface ArticleSectionProps {
  onSelectArticle: (article: ArticleItem) => void;
}

export const ArticleSection: React.FC<ArticleSectionProps> = ({ onSelectArticle }) => {
  return (
    <section id="artikel" className="py-16 lg:py-24 bg-[#FAFBF8] border-b border-[#DDE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#2E6F57] text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bacaan & Edukasi Emosi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Bacaan untuk membantu memahami yang kamu rasakan.
          </h2>
          <p className="text-sm text-[#66736C]">
             Artikel ringkas berbahasa Indonesia yang ramah untuk refleksi awal dan literasi emosi.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES_DATA.map((art) => (
            <article
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="bg-white rounded-3xl p-6 border border-[#DDE4DF] shadow-sm rangkul-card-hover cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#EEF7F2] text-[#2E6F57] border border-[#BFDCCD]">
                    {art.category}
                  </span>
                  <span className="text-xs text-[#66736C] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {art.readTime}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#173D30] font-sans leading-snug hover:text-[#2E6F57] transition-colors">
                  {art.title}
                </h3>

                <p className="text-xs text-[#66736C] leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#DDE4DF] space-y-2">
                <div className="text-[11px] text-[#35413A] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E6F57]" />
                  <span>{art.reviewer}</span>
                </div>

                <div className="text-xs font-bold text-[#2E6F57] flex items-center gap-1 pt-1">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
