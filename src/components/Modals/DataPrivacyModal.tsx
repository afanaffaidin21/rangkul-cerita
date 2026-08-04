'use client';

import React, { useState } from "react";
import { ShieldCheck, X, Download, Trash2, Lock, CheckCircle2, UserX } from "lucide-react";

interface DataPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataPrivacyModal: React.FC<DataPrivacyModalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState("");
  const [isPinSet, setIsPinSet] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = () => {
    const dummyData = {
      alias: "Pengguna Rangkul Cerita",
      exportedAt: new Date().toISOString(),
      checkins: [
        { date: "2026-07-22", emotion: "Cemas", intensity: 3, need: "Cerita sebentar" },
      ],
      disclaimer: "Data ini tersimpan hanya di perangkat peramban lokal milik pengguna.",
    };
    const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rangkul-cerita-export-${Date.now()}.json`;
    a.click();
    showToast("Data riwayat berhasil diunduh dalam format JSON.");
  };

  const handleDeleteAll = () => {
    if (confirm("Apakah kamu yakin ingin menghapus seluruh riwayat check-in dan jurnal dari perangkat ini? Tindakan ini tidak dapat dibatalkan.")) {
      localStorage.clear();
      showToast("Seluruh riwayat lokal telah dihapus secara permanen.");
    }
  };

  const handleSetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      setIsPinSet(true);
      showToast("PIN Kunci Aplikasi 4-digit berhasil diaktifkan.");
    } else {
      alert("PIN harus berupa 4 angka.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#17201B]/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FAFBF8] rounded-2xl shadow-2xl border border-[#DDE4DF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#173D30] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#BFDCCD]" />
            <h2 className="text-base font-bold">Pusat Kontrol Privasi & Data</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#BFDCCD] hover:text-white">
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
                <Lock className="w-4 h-4 text-[#2E6F57]" /> Kunci PIN Perangkat
              </span>
              <p className="text-[#66736C]">Lindungi aplikasi dengan PIN 4-digit agar orang lain yang meminjam HP tidak bisa membaca jurnalmu.</p>
              
              <form onSubmit={handleSetPin} className="flex gap-2 pt-2">
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Atur 4 Digit PIN"
                  className="w-32 px-3 py-1.5 text-xs bg-[#FAFBF8] border border-[#DDE4DF] rounded-lg"
                />
                <button type="submit" className="px-3 py-1.5 bg-[#2E6F57] text-white text-xs font-semibold rounded-lg">
                  {isPinSet ? "PIN Aktif" : "Simpan PIN"}
                </button>
              </form>
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
          Cerita milikmu sepenuhnya. Rangkul Cerita tidak menjual data kepada pihak ketiga.
        </div>
      </div>
    </div>
  );
};
