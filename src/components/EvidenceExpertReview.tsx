'use client';

import React from "react";
import { ShieldCheck, UserCheck, CheckCircle2, Clock, Calendar } from "lucide-react";

export const EvidenceExpertReview: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-[#DDE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#2E6F57] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tinjauan Pakar & Metodologi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Dibangun dengan empati, ditinjau dengan tanggung jawab.
          </h2>
          <p className="text-sm text-[#66736C]">
            Pendekatan non-klinis berbasis bukti (evidence-informed) yang dievaluasi secara berkala oleh tim psikolog.
          </p>
        </div>

        {/* Process Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#FAFBF8] border border-[#DDE4DF] rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF7F2] text-[#2E6F57] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-base text-[#173D30]">Review Materi Self-Help</h3>
            <p className="text-xs text-[#66736C] leading-relaxed">
              Seluruh modul latihan grounding, pernapasan, artikel, dan template pesan dikurasi dan disesuaikan dengan konteks budaya anak muda Indonesia.
            </p>
          </div>

          <div className="p-6 bg-[#FAFBF8] border border-[#DDE4DF] rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF7F2] text-[#2E6F57] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-base text-[#173D30]">Pengujian Algoritma AI Safety</h3>
            <p className="text-xs text-[#66736C] leading-relaxed">
              Pengujian keselamatan AI menggunakan simulasi red-teaming untuk mendeteksi kata kunci krisis, slang, dan kalimat implisit bahaya.
            </p>
          </div>

          <div className="p-6 bg-[#FAFBF8] border border-[#DDE4DF] rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF7F2] text-[#2E6F57] flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-base text-[#173D30]">Evaluasi Jalur Rujukan</h3>
            <p className="text-xs text-[#66736C] leading-relaxed">
              Verifikasi jam operasional, kontak, dan keaktifan nomor hotline darurat secara berkala agar pengguna mendapatkan bantuan yang valid.
            </p>
          </div>
        </div>

        {/* Advisory Team Transparent Verified Placeholders */}
        <div className="p-6 bg-[#EEF7F2] border border-[#BFDCCD] rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#BFDCCD] pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173D30]">
              <UserCheck className="w-4 h-4 text-[#2E6F57]" />
              <span>Tim Advisor & Reviewer Konten</span>
            </div>
            <span className="text-[11px] text-[#2E6F57] font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Evaluasi Terakhir: Mei 2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-[#DDE4DF] space-y-1">
              <span className="font-bold text-[#173D30]">Tim Advisor Psikologi Klinis</span>
              <p className="text-[#66736C] text-[11px]">
                [Profil advisor terverifikasi dari himpunan psikolog klinis Indonesia akan ditampilkan setelah proses kemitraan selesai]
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#DDE4DF] space-y-1">
              <span className="font-bold text-[#173D30]">Tim Reviewer Keselamatan AI</span>
              <p className="text-[#66736C] text-[11px]">
                [Profil pakar keselamatan AI dan etika medis terverifikasi]
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
