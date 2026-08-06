'use client';

import React, { useState } from "react";
import { ShieldCheck, X, Download, Trash2, CheckCircle2, UserX } from "lucide-react";
import { deleteOwnedStorage, readOwnedStorage } from "../../lib/privacy/storage";
import { useAccessibleDialog } from "../../lib/accessibility/useAccessibleDialog";

interface DataPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataPrivacyModal: React.FC<DataPrivacyModalProps> = ({ isOpen, onClose }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dialogRef = useAccessibleDialog(isOpen, onClose);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      storage: readOwnedStorage(localStorage),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rangkul-cerita-export-${Date.now()}.json`;
    a.click();
    showToast("Data Rangkul Cerita yang tersedia berhasil diunduh dalam format JSON.");
  };

  const handleDeleteAll = () => {
    if (confirm("Apakah kamu yakin ingin menghapus data Rangkul Cerita dari perangkat ini? Data aplikasi yang tersedia akan dihapus.")) {
      const deletedCount = deleteOwnedStorage(localStorage);
      showToast(`${deletedCount} penyimpanan Rangkul Cerita berhasil dihapus dari perangkat ini.`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#17201B]/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div ref={dialogRef} tabIndex={-1} className="relative w-full max-w-lg bg-[#FAFBF8] rounded-2xl shadow-2xl border border-[#DDE4DF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#173D30] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#BFDCCD]" />
            <h2 id="privacy-modal-title" className="text-base font-bold">Pusat Kontrol Privasi & Data</h2>
          </div>
          <button onClick={onClose} aria-label="Tutup Pusat Kontrol Privasi & Data" className="min-w-11 min-h-11 p-1.5 rounded-lg text-[#BFDCCD] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFDCCD]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {toastMessage && (
            <div className="p-3 bg-[#EEF7F2] border border-[#BFDCCD] text-[#2E7D5B] text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {toastMessage}
            </div>
          )}

          {/* 4 Privacy Pillars */}
          <div className="space-y-3">
            <div className="p-3.5 bg-white border border-[#DDE4DF] rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#173D30] flex items-center gap-1.5">
                <UserX className="w-4 h-4 text-[#2E6F57]" /> Identitas Minimum & Alias
              </span>
              <p className="text-[#66736C]">Kamu bisa memilih nama samaran tanpa mencantumkan identitas asli.</p>
            </div>

            <div className="p-3.5 bg-white border border-[#DDE4DF] rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#173D30] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2E6F57]" /> Batas Perlindungan
              </span>
              <p className="text-[#66736C]">Data aplikasi disimpan di browser perangkat ini. Penyimpanan browser bukan vault terenkripsi dan dapat diakses melalui perangkat atau profil browser.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#DDE4DF] flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleExport}
              className="flex-1 py-2.5 px-4 bg-[#F3F5F2] hover:bg-[#DDE4DF] text-[#173D30] text-xs font-semibold rounded-xl border border-[#DDE4DF] flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Unduh Data Saya
            </button>
            <button
              onClick={handleDeleteAll}
              className="flex-1 py-2.5 px-4 bg-[#FBEAEC] hover:bg-[#E89887]/30 text-[#B8414E] text-xs font-semibold rounded-xl border border-[#E89887]/40 flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Hapus Seluruh Data
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F3F5F2] border-t border-[#DDE4DF] text-center text-xs text-[#66736C]">
          Data yang tersimpan di browser ini dapat kamu unduh atau hapus dari perangkatmu. Teks yang dikirim untuk fitur AI diproses melalui server dan penyedia AI saat kamu memintanya.
        </div>
      </div>
    </div>
  );
};
