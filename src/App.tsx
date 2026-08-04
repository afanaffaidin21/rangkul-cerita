'use client';

import React, { useState } from "react";
import { SafetyUtilityBar } from "./components/SafetyUtilityBar";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { MoodChecker } from "./components/MoodChecker";
import { HowItWorks } from "./components/HowItWorks";
import { MainFeatures } from "./components/MainFeatures";
import { SelfHelpLibrary } from "./components/SelfHelpLibrary";
import { SafetyPrivacySection } from "./components/SafetyPrivacySection";
import { HumanSupportBridge } from "./components/HumanSupportBridge";
import { Testimonials } from "./components/Testimonials";
import { EvidenceExpertReview } from "./components/EvidenceExpertReview";
import { ArticleSection } from "./components/ArticleSection";
import { AboutPhilosophy } from "./components/AboutPhilosophy";
import { PartnershipSection } from "./components/PartnershipSection";
import { FAQAccordion } from "./components/FAQAccordion";
import { NewsletterSection } from "./components/NewsletterSection";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { PersistentHelpButton } from "./components/PersistentHelpButton";

// Modals
import { SafetyModal } from "./components/Modals/SafetyModal";
import { JournalingModal } from "./components/Modals/JournalingModal";
import { GroundingExerciseModal } from "./components/Modals/GroundingExerciseModal";
import { PartnershipModal } from "./components/Modals/PartnershipModal";
import { ArticleReaderModal } from "./components/Modals/ArticleReaderModal";
import { DataPrivacyModal } from "./components/Modals/DataPrivacyModal";

import { EmotionType, NeedType, ArticleItem } from "./types";

export default function App() {
  // Modal states
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [partnershipModalOpen, setPartnershipModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

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
        onOpenJournalModal={() => setJournalModalOpen(true)}
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
        <TrustStrip />

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

        {/* 8. Self-Help Library */}
        <SelfHelpLibrary onOpenExerciseModal={() => setExerciseModalOpen(true)} />

        {/* 9. Safety, Privacy, and AI Boundaries */}
        <SafetyPrivacySection
          onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
          onOpenSafetyModal={() => setSafetyModalOpen(true)}
        />

        {/* 10. Human Support Bridge */}
        <HumanSupportBridge onOpenSafetyModal={() => setSafetyModalOpen(true)} />

        {/* 11. Testimonials */}
        <Testimonials />

        {/* 12. Evidence and Expert Review */}
        <EvidenceExpertReview />

        {/* 13. Article and Blog Section */}
        <ArticleSection onSelectArticle={(article) => setSelectedArticle(article)} />

        {/* 14. About and Philosophy */}
        <AboutPhilosophy />

        {/* 15. Partnership Section */}
        <PartnershipSection onOpenPartnershipModal={() => setPartnershipModalOpen(true)} />

        {/* 16. FAQ Accordion */}
        <FAQAccordion />

        {/* 17. Quote and Newsletter */}
        <NewsletterSection />

        {/* 18. Final CTA */}
        <FinalCTA
          onStartCheckin={handleStartCheckinScroll}
          onOpenSafetyModal={() => setSafetyModalOpen(true)}
        />
      </main>

      {/* 19. Footer */}
      <Footer
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenSafetyModal={() => setSafetyModalOpen(true)}
      />

      {/* 20. Persistent Help Button */}
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

      <PartnershipModal
        isOpen={partnershipModalOpen}
        onClose={() => setPartnershipModalOpen(false)}
      />

      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <DataPrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
    </div>
  );
}
