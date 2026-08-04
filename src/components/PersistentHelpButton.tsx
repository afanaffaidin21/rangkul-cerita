'use client';

import React from "react";
import { LifeBuoy, Phone } from "lucide-react";

interface PersistentHelpButtonProps {
  onOpenSafetyModal: () => void;
}

export const PersistentHelpButton: React.FC<PersistentHelpButtonProps> = ({ onOpenSafetyModal }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      <button
        onClick={onOpenSafetyModal}
        className="px-4 py-3 bg-[#B8414E] hover:bg-[#8F2E3B] text-white text-xs sm:text-sm font-bold rounded-full shadow-xl transition-all duration-200 flex items-center gap-2 border-2 border-white focus:outline-none focus:ring-4 focus:ring-[#B8414E]/40"
        aria-label="Buka Menu Bantuan Krisis & Telepon Darurat"
      >
        <LifeBuoy className="w-4 h-4 animate-spin-slow text-[#FBEAEC]" />
        <span>Butuh Bantuan?</span>
      </button>
    </div>
  );
};
