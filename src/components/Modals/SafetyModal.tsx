'use client';

import React, { useState } from "react";
import { Phone, ShieldAlert, HeartHandshake, X, Copy, Check, ExternalLink, LifeBuoy } from "lucide-react";
import { useAccessibleDialog } from "../../lib/accessibility/useAccessibleDialog";
import { VERIFIED_HELPLINES } from "../../lib/safety/contacts";

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"helplines" | "template" | "steps">("helplines");

  const sampleTemplate = `Halo [Nama Teman/Keluarga], akhir-akhir ini aku merasa sedang tidak baik-baik saja dan agak kewalahan dengan perasaanku. Apakah kamu ada waktu luang hari ini untuk ngobrol sebentar? Aku butuh seseorang yang mau mendengar tanpa menghakimi. Terima kasih ya.`;

  const [customTemplate, setCustomTemplate] = useState(sampleTemplate);
  const [isCopiedTemplate, setIsCopiedTemplate] = useState(false);

  const dialogRef = useAccessibleDialog(isOpen, onClose);

  if (!isOpen) return null;

  const handleCopyPhone = (id: string, phone: string, ext?: string) => {
    const fullText = ext ? `${phone} (Ext ${ext})` : phone;
    navigator.clipboard.writeText(fullText);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(customTemplate);
    setIsCopiedTemplate(true);
    setTimeout(() => setIsCopiedTemplate(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start sm:items-center justify-center p-2 sm:p-4 bg-[#17201B]/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-modal-title"
    >
      <div ref={dialogRef} tabIndex={-1} className="relative w-full max-w-2xl max-h-[calc(100dvh-1rem)] sm:max-h-[90vh] flex flex-col bg-[#FAFBF8] rounded-2xl shadow-2xl border border-[#DDE4DF] overflow-hidden">
        {/* Soft danger banner */}
        <div className="bg-[#FBEAEC] border-b border-[#E89887]/30 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-3">
            <div className="p-2 bg-[#B8414E] text-white rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="safety-modal-title" className="text-lg font-bold text-[#17201B] font-sans">
                Jalur Bantuan & Keselamatan Segera
              </h2>
              <p className="text-xs text-[#66736C]">
                Kamu tidak harus menghadapi krisis ini sendirian. Bantuan manusia siap mendengarkan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#66736C] hover:text-[#17201B] hover:bg-black/5 transition-colors"
            aria-label="Tutup Modal Keselamatan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div role="tablist" aria-label="Pilihan bantuan" className="flex flex-wrap border-b border-[#DDE4DF] bg-[#F3F5F2] px-3 sm:px-6">
          <button
            id="safety-tab-helplines"
            role="tab"
            aria-selected={activeTab === "helplines"}
            aria-controls="safety-panel-helplines"
            tabIndex={activeTab === "helplines" ? 0 : -1}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") setActiveTab("template");
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") setActiveTab("steps");
            }}
            onClick={() => setActiveTab("helplines")}
            className={`min-h-11 py-3 px-3 sm:px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "helplines"
                ? "border-[#2E6F57] text-[#173D30]"
                : "border-transparent text-[#66736C] hover:text-[#17201B]"
            }`}
          >
            Layanan Darurat & Telepon
          </button>
          <button
            id="safety-tab-template"
            role="tab"
            aria-selected={activeTab === "template"}
            aria-controls="safety-panel-template"
            tabIndex={activeTab === "template" ? 0 : -1}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") setActiveTab("steps");
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") setActiveTab("helplines");
            }}
            onClick={() => setActiveTab("template")}
            className={`min-h-11 py-3 px-3 sm:px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "template"
                ? "border-[#2E6F57] text-[#173D30]"
                : "border-transparent text-[#66736C] hover:text-[#17201B]"
            }`}
          >
            Pesan ke Orang Tepercaya
          </button>
          <button
            id="safety-tab-steps"
            role="tab"
            aria-selected={activeTab === "steps"}
            aria-controls="safety-panel-steps"
            tabIndex={activeTab === "steps" ? 0 : -1}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") setActiveTab("helplines");
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") setActiveTab("template");
            }}
            onClick={() => setActiveTab("steps")}
            className={`min-h-11 py-3 px-3 sm:px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "steps"
                ? "border-[#2E6F57] text-[#173D30]"
                : "border-transparent text-[#66736C] hover:text-[#17201B]"
            }`}
          >
            Langkah Praktis
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === "helplines" && (
            <div id="safety-panel-helplines" role="tabpanel" aria-labelledby="safety-tab-helplines" tabIndex={0} className="space-y-4">
              <p className="text-sm text-[#35413A] leading-relaxed">
                Jika kamu merasa tidak aman, memiliki pikiran menyakiti diri sendiri, atau membutuhkan teman bicara saat ini juga, silakan hubungi salah satu layanan terverifikasi di bawah ini:
              </p>

              <div className="space-y-3">
                {VERIFIED_HELPLINES.map((helpline) => (
                  <div
                    key={helpline.id}
                    className={`p-4 rounded-xl border transition-all ${
                      helpline.isCrisisTarget
                        ? "border-[#E89887] bg-[#FAF0EE]"
                        : "border-[#DDE4DF] bg-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#17201B] text-base">
                            {helpline.name}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF7F2] text-[#2E6F57] border border-[#BFDCCD]">
                            {helpline.cost}
                          </span>
                        </div>
                        <p className="text-xs text-[#66736C] mt-1">{helpline.description}</p>
                        <div className="flex items-center gap-4 text-xs text-[#35413A] mt-2">
                          <span>🕒 {helpline.operatingHours}</span>
                          <span>📍 {helpline.city}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {helpline.website && (
                          <a
                            href={helpline.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DDE4DF] hover:bg-[#F3F5F2] text-[#173D30] text-xs font-semibold rounded-xl transition-all shadow-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Kunjungi Web/Chat
                          </a>
                        )}
                        <a
                          href={`tel:${helpline.phone.replace(/[^0-9]/g, "")}`}
                          className="flex items-center gap-2 px-4 py-2 bg-[#2E6F57] hover:bg-[#173D30] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Hubungi {helpline.phone} {helpline.ext ? `(Tekan ${helpline.ext})` : ""}
                        </a>
                        <button
                          onClick={() => handleCopyPhone(helpline.id, helpline.phone, helpline.ext)}
                           className="min-w-11 min-h-11 p-2 border border-[#DDE4DF] bg-white hover:bg-[#F3F5F2] text-[#35413A] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E6F57]"
                           aria-label={`Salin nomor telepon ${helpline.phone}`}
                           title="Salin Nomor Telepon"
                        >
                          {copiedIndex === helpline.id ? (
                            <Check className="w-4 h-4 text-[#2E7D5B]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "template" && (
            <div id="safety-panel-template" role="tabpanel" aria-labelledby="safety-tab-template" tabIndex={0} className="space-y-4">
              <p className="text-sm text-[#35413A]">
                Kadang hal tersulit adalah menemukan kata-kata pertama. Kamu bisa menyunting dan menyalin template pesan berikut untuk dikirim ke teman, keluarga, atau guru yang kamu percayai:
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#173D30]">
                  Template Pesan Siap Kirim:
                </label>
                <textarea
                  value={customTemplate}
                  onChange={(e) => setCustomTemplate(e.target.value)}
                  rows={5}
                  className="w-full p-3.5 text-sm bg-white border border-[#DDE4DF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E6F57] text-[#17201B] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#66736C]">
                  Klik salin untuk menempelkan ke WhatsApp atau aplikasi perpesananmu.
                </span>
                <button
                  onClick={handleCopyTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-[#173D30] hover:bg-[#2E6F57] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  {isCopiedTemplate ? (
                    <>
                      <Check className="w-4 h-4 text-[#BFDCCD]" /> Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Salin Pesan
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "steps" && (
            <div id="safety-panel-steps" role="tabpanel" aria-labelledby="safety-tab-steps" tabIndex={0} className="space-y-4 text-sm text-[#35413A] leading-relaxed">
              <h3 className="font-bold text-[#173D30] text-base">3 Langkah Praktis Menuju Keselamatan Diri:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong className="text-[#17201B]">Pindah ke tempat yang lebih aman:</strong> Duduklah di tempat terang, dekat jendela, atau dekat orang lain di rumah/kos.
                </li>
                <li>
                  <strong className="text-[#17201B]">Jauhkan benda berbahaya:</strong> Letakkan benda tajam, obat-obatan, atau benda pemicu di tempat yang sulit dijangkau.
                </li>
                <li>
                  <strong className="text-[#17201B]">Fokus pada 5 menit ke depan saja:</strong> Jangan memikirkan hari esok. Fokuslah bernapas dan bertahan untuk 5 menit ini.
                </li>
              </ol>

              <div className="p-4 bg-[#EEF7F2] border border-[#BFDCCD] rounded-xl flex items-start gap-3 mt-4">
                <HeartHandshake className="w-5 h-5 text-[#2E6F57] shrink-0 mt-0.5" />
                <p className="text-xs text-[#173D30]">
                  Ingat: Mengakui bahwa kamu butuh bantuan adalah bukti keberanian besar. Perasaan berat ini nyata, tetapi ia bisa mereda dengan bantuan yang tepat.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer disclaimer */}
        <div className="p-4 bg-[#F3F5F2] border-t border-[#DDE4DF] text-center text-xs text-[#66736C]">
          <p>
            <strong>Disclaimer:</strong> Rangkul Cerita bukan penyedia layanan darurat klinis mandiri.
            Layanan ini membantu mengarahkanmu ke jalur bantuan manusia yang terverifikasi.
          </p>
        </div>
      </div>
    </div>
  );
};
