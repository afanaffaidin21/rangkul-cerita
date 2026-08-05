'use client';

import React from "react";
import { LifeBuoy, PhoneCall } from "lucide-react";

interface SafetyUtilityBarProps {
  onOpenSafetyModal: () => void;
}

export const SafetyUtilityBar: React.FC<SafetyUtilityBarProps> = ({ onOpenSafetyModal }) => {
  return (
    <div className="w-full bg-[#FBEAEC] border-b border-[#E89887]/30 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs sm:text-sm text-[#17201B]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-[#B8414E] text-white shrink-0">
            <LifeBuoy className="w-3.5 h-3.5" />
          </span>
          <span className="font-medium text-[#17201B]">
            Sedang merasa tidak aman atau membutuhkan bantuan segera?
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-[#66736C]">
            Hubungi Healing119 (119 Ext 8) atau 112
          </span>
          <button
            onClick={onOpenSafetyModal}
            className="px-3.5 py-1.5 bg-[#B8414E] hover:bg-[#8F2E3B] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#B8414E] focus:ring-offset-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Cari Bantuan Segera</span>
          </button>
        </div>
      </div>
    </div>
  );
};
