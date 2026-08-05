'use client';

import React, { useState } from "react";
import { Footer } from "./Footer";
import { HumanSupportBridge } from "./HumanSupportBridge";
import { Navbar } from "./Navbar";
import { PersistentHelpButton } from "./PersistentHelpButton";
import { SafetyUtilityBar } from "./SafetyUtilityBar";
import { SafetyModal } from "./Modals/SafetyModal";

export const HumanSupportPageContent: React.FC = () => {
  const [safetyOpen, setSafetyOpen] = useState(false);
  return <div className="min-h-screen flex flex-col bg-[#FAFBF8]"><SafetyUtilityBar onOpenSafetyModal={() => setSafetyOpen(true)} /><Navbar onStartCheckin={() => window.location.assign("/#mood-checker")} onOpenSafetyModal={() => setSafetyOpen(true)} onOpenPrivacyModal={() => window.location.assign("/privacy")} /><main id="main-content" className="flex-1"><header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"><h1 className="text-3xl sm:text-4xl font-bold text-[#173D30]">Temukan dukungan manusia yang tepat.</h1><p className="mt-4 max-w-2xl text-base text-[#35413A] leading-relaxed">Mulai dari orang tepercaya atau buka pilihan layanan bantuan saat kamu membutuhkannya.</p></header><HumanSupportBridge onOpenSafetyModal={() => setSafetyOpen(true)} /></main><Footer /><PersistentHelpButton onOpenSafetyModal={() => setSafetyOpen(true)} /><SafetyModal isOpen={safetyOpen} onClose={() => setSafetyOpen(false)} /></div>;
};
