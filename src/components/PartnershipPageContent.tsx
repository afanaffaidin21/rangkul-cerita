'use client';

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { PARTNERSHIP_PROGRAMS } from "../data/landingData";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { PartnershipForm } from "./PartnershipForm";
import { PersistentHelpButton } from "./PersistentHelpButton";
import { SafetyUtilityBar } from "./SafetyUtilityBar";
import { SafetyModal } from "./Modals/SafetyModal";

export const PartnershipPageContent: React.FC = () => {
  const [safetyOpen, setSafetyOpen] = useState(false);
  return <div className="min-h-screen flex flex-col bg-[#FAFBF8]"><SafetyUtilityBar onOpenSafetyModal={() => setSafetyOpen(true)} /><Navbar onStartCheckin={() => window.location.assign("/#mood-checker")} onOpenSafetyModal={() => setSafetyOpen(true)} onOpenPrivacyModal={() => window.location.assign("/privacy")} /><main id="main-content" className="flex-1 py-16 lg:py-24"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14"><header className="max-w-3xl space-y-4"><p className="text-xs font-semibold text-[#2E6F57]">Kemitraan Institusi & Komunitas</p><h1 className="text-3xl sm:text-4xl font-bold text-[#173D30]">Bawa ruang refleksi awal ke sekolah atau komunitasmu.</h1><p className="text-base text-[#35413A] leading-relaxed">Pelajari program yang sedang dikembangkan dan kirim permintaan informasi melalui formulir yang tersimpan secara nyata.</p></header><div className="grid grid-cols-1 md:grid-cols-2 border-y border-[#DDE4DF] md:divide-x md:divide-[#DDE4DF]">{PARTNERSHIP_PROGRAMS.map((program, index) => <section key={program.title} className={`py-8 md:px-8 space-y-4 ${index === 0 ? "border-b border-[#DDE4DF] md:border-b-0 md:pl-0" : "md:pr-0"}`}><p className="text-xs font-semibold text-[#2E6F57]">{program.target}</p><h2 className="text-xl font-bold text-[#173D30]">{program.title}</h2><p className="text-sm text-[#66736C] leading-relaxed">{program.description}</p><ul className="space-y-2">{program.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm text-[#35413A]"><CheckCircle2 className="w-4 h-4 text-[#2E7D5B] shrink-0 mt-0.5" />{feature}</li>)}</ul><p className="flex items-start gap-2 p-3 bg-[#F3F5F2] rounded-xl text-xs text-[#66736C]"><ShieldCheck className="w-4 h-4 text-[#2E6F57] shrink-0" />Fitur laporan institusi belum tersedia; jurnal pengguna tidak disediakan sebagai laporan kemitraan.</p></section>)}</div><section id="formulir-kemitraan" className="max-w-3xl mx-auto space-y-5"><div className="text-center space-y-2"><h2 className="text-2xl font-bold text-[#173D30]">Minta informasi kemitraan</h2><p className="text-sm text-[#35413A]">Isi informasi yang diperlukan agar permintaan dapat dicatat.</p></div><PartnershipForm /></section></div></main><Footer /><PersistentHelpButton onOpenSafetyModal={() => setSafetyOpen(true)} /><SafetyModal isOpen={safetyOpen} onClose={() => setSafetyOpen(false)} /></div>;
};
