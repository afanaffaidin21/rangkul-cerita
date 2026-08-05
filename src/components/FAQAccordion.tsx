'use client';

import React, { useState } from "react";
import { FAQ_DATA } from "../data/landingData";
import { ChevronDown, Search } from "lucide-react";

export const FAQAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFAQs = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="py-16 lg:py-20 bg-white border-b border-[#DDE4DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Pertanyaan seputar Rangkul Cerita.
          </h2>
          <p className="text-sm sm:text-base text-[#35413A] leading-relaxed">
            Jawaban jujur, transparan, dan tidak defensif tentang batas AI, privasi, dan krisis.
          </p>
        </div>

        {/* Search Filter */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-[#A0AAA4] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pertanyaan... (misal: diagnosis, privasi, krisis)"
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF8] border border-[#DDE4DF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E6F57] text-[#17201B]"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFAQs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#FAFBF8] border border-[#DDE4DF] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-left font-bold text-sm text-[#173D30] flex items-center justify-between gap-4 hover:bg-[#EEF7F2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E6F57]"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EEF7F2] text-[#2E6F57] border border-[#BFDCCD]">
                      {faq.category}
                    </span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#2E6F57] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-sm text-[#35413A] leading-relaxed border-t border-[#DDE4DF]/60 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
