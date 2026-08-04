'use client';

import React from "react";
import { UserCheck, ShieldCheck, Lock, HeartHandshake } from "lucide-react";

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: UserCheck,
      title: "Ditinjau Profesional",
      description: "Materi self-help & algoritma evaluasi ditinjau oleh psikolog klinis.",
    },
    {
      icon: ShieldCheck,
      title: "AI dengan Guardrail",
      description: "AI memiliki batas peran ketat, tidak mendiagnosis & tidak meresepkan.",
    },
    {
      icon: Lock,
      title: "Data Sensitif Dilindungi",
      description: "Privasi sebagai standar utama dengan opsi identitas anonim.",
    },
    {
      icon: HeartHandshake,
      title: "Bantuan Manusia Tersedia",
      description: "Menjadi jembatan menuju orang tepercaya & layanan bantuan profesional.",
    },
  ];

  return (
    <div className="bg-white border-y border-[#DDE4DF] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[#FAFBF8] transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-[#EEF7F2] text-[#2E6F57] border border-[#BFDCCD] shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#173D30] font-sans">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#66736C] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
