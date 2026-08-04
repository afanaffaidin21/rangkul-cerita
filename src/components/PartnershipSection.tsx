'use client';

import React from "react";
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, Download } from "lucide-react";
import { PARTNERSHIP_PROGRAMS } from "../data/landingData";

interface PartnershipSectionProps {
  onOpenPartnershipModal: () => void;
}

export const PartnershipSection: React.FC<PartnershipSectionProps> = ({ onOpenPartnershipModal }) => {
  return (
    <section className="py-16 lg:py-24 bg-[#FAFBF8] border-b border-[#DDE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#2E6F57] text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Kemitraan Institusi & Komunitas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Bawa ruang aman ke sekolah dan komunitasmu.
          </h2>
          <p className="text-sm text-[#66736C]">
            Program kesehatan emosional kolektif untuk SMA, Kampus, BEM, OSIS, dan Yayasan Kepemudaan.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PARTNERSHIP_PROGRAMS.map((prog, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-[#DDE4DF] shadow-sm rangkul-card-hover flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <span className="text-xs font-bold px-3 py-1 bg-[#EEF7F2] text-[#2E6F57] rounded-full border border-[#BFDCCD]">
                  {prog.target}
                </span>

                <h3 className="text-xl font-bold text-[#173D30]">{prog.title}</h3>

                <p className="text-xs text-[#66736C] leading-relaxed">{prog.description}</p>

                <ul className="space-y-2 pt-2 border-t border-[#DDE4DF]">
                  {prog.features.map((feat, fIdx) => (
                    <li key={fIdx} className="text-xs text-[#35413A] flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D5B] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-[#F3F5F2] rounded-xl text-xs text-[#66736C] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E6F57] shrink-0" />
                <span>
                  <strong>Jaminan Privasi:</strong> Institusi HANYA menerima laporan agregat tren (anonim) dan TIDAK PERNAH membaca isi jurnal siswa/mahasiswa.
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onOpenPartnershipModal}
            className="w-full sm:w-auto px-8 py-4 bg-[#2E6F57] hover:bg-[#173D30] text-white text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4" /> Jadi Mitra Rangkul Cerita
          </button>

          <button
            onClick={onOpenPartnershipModal}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-[#F3F5F2] text-[#173D30] border border-[#DDE4DF] text-sm font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-[#2E6F57]" /> Unduh Dokumen Informasi Kemitraan
          </button>
        </div>

      </div>
    </section>
  );
};
