'use client';

import React, { useState, type ReactNode } from "react";
import { SafetyUtilityBar } from "./components/SafetyUtilityBar";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { MoodChecker } from "./components/MoodChecker";
import { HowItWorks } from "./components/HowItWorks";
import { MainFeatures } from "./components/MainFeatures";
import { SafetyPrivacySection } from "./components/SafetyPrivacySection";
import { HumanSupportBridge } from "./components/HumanSupportBridge";
import { FAQAccordion } from "./components/FAQAccordion";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { PersistentHelpButton } from "./components/PersistentHelpButton";

// Modals
import { SafetyModal } from "./components/Modals/SafetyModal";
import { JournalingModal } from "./components/Modals/JournalingModal";
import { GroundingExerciseModal } from "./components/Modals/GroundingExerciseModal";
import { DataPrivacyModal } from "./components/Modals/DataPrivacyModal";

import { EmotionType, NeedType } from "./types";

interface AppProps {
  trustStrip: ReactNode;
  evidenceExpertReview: ReactNode;
}

export default function App({ trustStrip, evidenceExpertReview }: AppProps) {
  // Modal states
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Journal pre-filled state
  const [journalEmotions, setJournalEmotions] = useState<EmotionType[]>(["Cemas"]);
  const [journalIntensity, setJournalIntensity] = useState<number>(3);
  const [journalNeed, setJournalNeed] = useState<NeedType>("Cerita sebentar");

  const handleStartCheckinScroll = () => {
    const moodSection = document.getElementById("mood-checker");
    if (moodSection) {
      moodSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenJournalWithData = (
    emotions: EmotionType[],
    intensity: number,
    need: NeedType
  ) => {
    setJournalEmotions(emotions);
    setJournalIntensity(intensity);
    setJournalNeed(need);
    setJournalModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF8] text-[#17201B] font-sans antialiased">
      {/* 1. Safety Utility Bar */}
      <SafetyUtilityBar onOpenSafetyModal={() => setSafetyModalOpen(true)} />

      {/* 2. Navbar */}
      <Navbar
        onStartCheckin={handleStartCheckinScroll}
        onOpenSafetyModal={() => setSafetyModalOpen(true)}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* Main Content Area with Skip Link target */}
      <main id="main-content" className="flex-1">
        {/* 3. Hero Section */}
        <Hero
          onStartCheckin={handleStartCheckinScroll}
          onOpenJournalModal={() => setJournalModalOpen(true)}
        />

        {/* 4. Trust Strip */}
          {trustStrip}

        {/* 5. Interactive Mood Checker */}
        <MoodChecker
          onOpenJournalWithData={handleOpenJournalWithData}
          onOpenSafetyModal={() => setSafetyModalOpen(true)}
          onOpenExerciseModal={() => setExerciseModalOpen(true)}
        />

        {/* 6. How It Works */}
        <HowItWorks onOpenJournalModal={() => setJournalModalOpen(true)} />

        {/* 7. Main Features */}
        <MainFeatures
          onOpenJournalModal={() => setJournalModalOpen(true)}
          onOpenSafetyModal={() => setSafetyModalOpen(true)}
          onOpenExerciseModal={() => setExerciseModalOpen(true)}
        />

        {/* 8. Human Support Bridge */}
        <HumanSupportBridge onOpenSafetyModal={() => setSafetyModalOpen(true)} />

        {/* 9. Safety, Privacy, and AI Boundaries */}
        <SafetyPrivacySection
          onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
          onOpenSafetyModal={() => setSafetyModalOpen(true)}
        />

        {/* 10. Evidence and Expert Review */}
        {evidenceExpertReview}

        {/* 11. FAQ Accordion */}
        <FAQAccordion />

        {/* 12. Final CTA */}
        <FinalCTA
          onStartCheckin={handleStartCheckinScroll}
          onOpenSafetyModal={() => setSafetyModalOpen(true)}
        />
      </main>

      {/* 13. Footer */}
      <Footer />

      {/* 14. Persistent Help Button */}
      <PersistentHelpButton onOpenSafetyModal={() => setSafetyModalOpen(true)} />

      {/* Modals */}
      <SafetyModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
      />

      <JournalingModal
        isOpen={journalModalOpen}
        onClose={() => setJournalModalOpen(false)}
        initialEmotions={journalEmotions}
        initialIntensity={journalIntensity}
        initialNeed={journalNeed}
        onOpenSafetyModal={() => setSafetyModalOpen(true)}
      />

      <GroundingExerciseModal
        isOpen={exerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
      />

      <DataPrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
    </div>
  );
}
