'use client';

import React, { useState } from "react";
import { Clock, ShieldCheck } from "lucide-react";
import { SELF_HELP_RESOURCES } from "../data/landingData";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { PersistentHelpButton } from "./PersistentHelpButton";
import { SafetyUtilityBar } from "./SafetyUtilityBar";
import { SafetyModal } from "./Modals/SafetyModal";

export const ResourcesPageContent: React.FC = () => {
  const [category, setCategory] = useState("Semua");
  const [safetyOpen, setSafetyOpen] = useState(false);
  const categories = ["Semua", ...Array.from(new Set(SELF_HELP_RESOURCES.map((item) => item.category)))];
  const resources = category === "Semua" ? SELF_HELP_RESOURCES : SELF_HELP_RESOURCES.filter((item) => item.category === category);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF8]">
      <SafetyUtilityBar onOpenSafetyModal={() => setSafetyOpen(true)} />
      <Navbar onStartCheckin={() => window.location.assign("/#mood-checker")} onOpenSafetyModal={() => setSafetyOpen(true)} onOpenPrivacyModal={() => window.location.assign("/privacy")} />
      <main id="main-content" className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <header className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold text-[#2E6F57]">Materi Self-Help</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#173D30]">Temukan materi yang relevan dengan ceritamu.</h1>
            <p className="text-base text-[#35413A] leading-relaxed">Latihan singkat, panduan, dan template pesan untuk membantu refleksi awal. Materi ini bukan diagnosis atau pengganti dukungan profesional.</p>
          </header>
          <div className="flex flex-wrap gap-2" aria-label="Filter kategori materi">
            {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold ${category === item ? "bg-[#2E6F57] text-white" : "bg-white text-[#35413A]"}`}>{item}</button>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {resources.map((item) => <article key={item.id} className="group border-t border-[#DDE4DF] pt-5 space-y-4">
              <div className="flex items-center justify-between gap-3 text-xs text-[#66736C]"><span className="font-semibold text-[#2E6F57]">{item.format}</span><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{item.duration}</span></div>
              <h2 className="text-lg font-bold text-[#173D30] group-hover:text-[#2E6F57] transition-colors">{item.title}</h2>
              <p className="text-sm text-[#66736C] leading-relaxed">{item.summary}</p>
              {item.steps && <ol className="list-decimal pl-5 space-y-2 text-sm text-[#35413A]">{item.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
              {item.contentMarkdown && <div className="p-4 rounded-xl bg-[#EEF7F2] text-sm text-[#35413A] leading-relaxed">{item.contentMarkdown}</div>}
              <p className="flex items-center gap-1.5 text-xs text-[#66736C]"><ShieldCheck className="w-3.5 h-3.5 text-[#2E6F57]" />{item.reviewer}</p>
            </article>)}
          </div>
        </div>
      </main>
      <Footer />
      <PersistentHelpButton onOpenSafetyModal={() => setSafetyOpen(true)} />
      <SafetyModal isOpen={safetyOpen} onClose={() => setSafetyOpen(false)} />
    </div>
  );
};
