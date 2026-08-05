'use client';

import React, { useState, type ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { PersistentHelpButton } from "./PersistentHelpButton";
import { SafetyUtilityBar } from "./SafetyUtilityBar";
import { DataPrivacyModal } from "./Modals/DataPrivacyModal";
import { SafetyModal } from "./Modals/SafetyModal";

interface PublicPageShellProps {
  children: ReactNode;
}

export const PublicPageShell: React.FC<PublicPageShellProps> = ({ children }) => {
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF8] text-[#17201B] font-sans antialiased">
      <SafetyUtilityBar onOpenSafetyModal={() => setSafetyModalOpen(true)} />
      <Navbar
        onStartCheckin={() => window.location.assign("/#mood-checker")}
        onOpenSafetyModal={() => setSafetyModalOpen(true)}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />
      {children}
      <Footer />
      <PersistentHelpButton onOpenSafetyModal={() => setSafetyModalOpen(true)} />
      <SafetyModal isOpen={safetyModalOpen} onClose={() => setSafetyModalOpen(false)} />
      <DataPrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
    </div>
  );
};
