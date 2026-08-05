import React from "react";
import { UserCheck, ShieldCheck, Lock, HeartHandshake } from "lucide-react";

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: UserCheck,
       title: "Batas Produk Jelas",
       description: "Refleksi awal non-klinis dengan batas AI yang dijelaskan secara terbuka.",
    },
    {
      icon: ShieldCheck,
      title: "AI dengan Guardrail",
      description: "AI memiliki batas peran ketat, tidak mendiagnosis & tidak meresepkan.",
    },
    {
      icon: Lock,
       title: "Batas Data Dijelaskan",
       description: "Data aplikasi tetap lokal di browser secara default; browser storage bukan vault terenkripsi.",
    },
    {
      icon: HeartHandshake,
      title: "Bantuan Manusia Tersedia",
      description: "Menjadi jembatan menuju orang tepercaya & layanan bantuan profesional.",
    },
  ];

  return (
    <div className="bg-white border-y border-[#DDE4DF] py-6 px-4 sm:px-6 lg:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[#FAFBF8] transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-[#EEF7F2] text-[#2E6F57] shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#173D30] font-sans">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#66736C] mt-1 leading-relaxed">
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
