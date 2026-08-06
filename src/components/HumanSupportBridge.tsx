'use client';

import React, { useState } from "react";
import { Users, Phone, MessageCircle, Heart, Copy, Check, Sparkles, UserCheck } from "lucide-react";
import { VERIFIED_HELPLINES } from "../lib/safety/contacts";

interface HumanSupportBridgeProps {
  onOpenSafetyModal: () => void;
}

export const HumanSupportBridge: React.FC<HumanSupportBridgeProps> = ({ onOpenSafetyModal }) => {
  const [recipient, setRecipient] = useState<"teman" | "orangtua" | "guru">("teman");
  const [copied, setCopied] = useState(false);

  const templates = {
    teman: "Halo [Nama Teman], aku lagi merasa agak berat dan butuh teman bicara sebentar. Apakah kamu ada waktu luang hari ini? Nggak perlu ngasih solusi kok, cuma butuh didengar aja. Terima kasih ya.",
    orangtua: "Ibu/Bapak, akhir-akhir ini aku merasa cemas dan lelah dengan [sekolah/tugas]. Aku belum tahu semua jawabannya, tapi aku butuh waktu ngobrol sebentar kalau Ibu/Bapak lagi senggang. Terima kasih ya.",
    guru: "Selamat pagi/siang [Bapak/Ibu Guru/Dosen], saya ingin berkonsultasi singkat mengenai kendala yang sedang saya hadapi terkait [pelajaran/tugas]. Apakah ada waktu luang untuk berdiskusi? Terima kasih.",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(templates[recipient]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="dukungan-manusia" className="py-16 lg:py-20 bg-white border-b border-[#DDE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#2E6F57] text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Jembatan Dukungan Manusia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Kadang, langkah berikutnya adalah berbicara dengan manusia.
          </h2>
          <p className="text-sm sm:text-base text-[#35413A] leading-relaxed">
            Rangkul Cerita tidak menahanmu di dalam chatbot. Kami membantumu menemukan keberanian untuk terhubung kembali dengan dunia nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Support Destinations List */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-bold text-lg text-[#173D30]">
              Pilihan Teman Bicara & Bantuan:
            </h3>

            <div className="border-y border-[#DDE4DF] divide-y divide-[#DDE4DF]">
              <div className="py-5 flex items-start gap-3.5">
                <div className="p-2.5 bg-[#EEF7F2] text-[#2E6F57] rounded-xl font-bold text-xs shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#17201B]">Teman atau Keluarga Tepercaya</h4>
                  <p className="text-sm text-[#66736C] mt-1 leading-relaxed">Orang terdekat yang membuatmu merasa aman dan tidak dihakimi.</p>
                </div>
              </div>

              <div className="py-5 flex items-start gap-3.5">
                <div className="p-2.5 bg-[#EEF7F2] text-[#2E6F57] rounded-xl font-bold text-xs shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#17201B]">Guru BK / Konselor Sekolah / Dosen Wali</h4>
                  <p className="text-sm text-[#66736C] mt-1 leading-relaxed">Pendamping profesional di lingkungan akademik tempatmu belajar.</p>
                </div>
              </div>

              <div className="py-5 flex items-start gap-3.5">
                <div className="p-2.5 bg-[#EEF7F2] text-[#2E6F57] rounded-xl font-bold text-xs shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#17201B]">Layanan Darurat & Pencegahan Bunuh Diri</h4>
                  <p className="text-sm text-[#66736C] mt-1 leading-relaxed">Layanan profesional terdaftar (Healing119, PSC 119, atau 112).</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenSafetyModal}
                className="w-full py-3 bg-[#2E6F57] hover:bg-[#173D30] text-white text-xs font-semibold rounded-xl transition-[background-color,box-shadow,color] shadow-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Lihat Direktori Layanan Bantuan Terverifikasi
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Message Template Builder */}
          <div className="lg:col-span-6 bg-[#FAFBF8] border border-[#DDE4DF] rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E6F57]">
              <MessageCircle className="w-4 h-4" />
              <span>Penyusun Pesan Siap Kirim</span>
            </div>

            <h3 className="font-bold text-base text-[#173D30]">
              Bantu Aku Menyusun Pesan Meminta Bantuan
            </h3>

            <p className="text-sm text-[#66736C] leading-relaxed">
              Pilih siapa yang ingin kamu hubungi hari ini untuk mendapatkan susunan kalimat yang sopan dan tenang:
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setRecipient("teman")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  recipient === "teman"
                    ? "bg-[#2E6F57] text-white"
                    : "bg-white border border-[#DDE4DF] text-[#35413A]"
                }`}
              >
                Ke Teman
              </button>
              <button
                onClick={() => setRecipient("orangtua")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  recipient === "orangtua"
                    ? "bg-[#2E6F57] text-white"
                    : "bg-white border border-[#DDE4DF] text-[#35413A]"
                }`}
              >
                Ke Orang Tua
              </button>
              <button
                onClick={() => setRecipient("guru")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  recipient === "guru"
                    ? "bg-[#2E6F57] text-white"
                    : "bg-white border border-[#DDE4DF] text-[#35413A]"
                }`}
              >
                Ke Guru / Dosen
              </button>
            </div>

            <div className="p-4 bg-white border border-[#DDE4DF] rounded-2xl text-xs text-[#17201B] leading-relaxed italic">
              “{templates[recipient]}”
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#66736C]">
                Kamu bisa menyalin pesan ini dan menyesuaikannya.
              </span>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-[#173D30] hover:bg-[#2E6F57] text-white text-xs font-semibold rounded-xl transition-[background-color,box-shadow,color] shadow-sm flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#BFDCCD]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Tersalin!" : "Salin Pesan"}
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
