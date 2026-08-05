'use client';

import React, { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { deleteOwnedStorage, readOwnedStorage } from "../lib/privacy/storage";

export const PrivacyControls: React.FC = () => {
  const [message, setMessage] = useState("");
  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), storage: readOwnedStorage(localStorage) }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `rangkul-cerita-export-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Data Rangkul Cerita yang tersedia berhasil diunduh.");
  };
  const handleDelete = () => {
    if (!confirm("Hapus data Rangkul Cerita yang tersedia dari browser ini?")) return;
    const count = deleteOwnedStorage(localStorage);
    setMessage(`${count} penyimpanan Rangkul Cerita dihapus dari browser ini.`);
  };
  return <section className="p-6 bg-white rounded-3xl shadow-sm space-y-4"><h2 className="text-xl font-bold text-[#173D30]">Kontrol data browser</h2>{message && <p role="status" className="p-3 rounded-xl bg-[#EEF7F2] text-sm text-[#2E6F57]">{message}</p>}<div className="flex flex-col sm:flex-row gap-3"><button type="button" onClick={handleExport} className="flex-1 px-5 py-3 bg-[#2E6F57] text-white rounded-xl font-semibold flex items-center justify-center gap-2"><Download className="w-4 h-4" />Unduh data tersedia</button><button type="button" onClick={handleDelete} className="flex-1 px-5 py-3 bg-[#FBEAEC] text-[#B8414E] rounded-xl font-semibold flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" />Hapus data lokal</button></div></section>;
};
