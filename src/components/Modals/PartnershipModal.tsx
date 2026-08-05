'use client';

import React, { useState } from "react";
import { Building2, X, Send, CheckCircle2, ShieldCheck, Mail, Phone, User } from "lucide-react";

interface PartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnershipModal: React.FC<PartnershipModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    institutionName: "",
    category: "Sekolah / SMA / SMK",
    contactName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/partnership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal mengirim formulir");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
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
            <Building2 className="w-5 h-5 text-[#BFDCCD]" />
            <h2 className="text-base font-bold">Kemitraan Sekolah & Komunitas</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#BFDCCD] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EEF7F2] text-[#2E7D5B] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#17201B]">Permintaan Kemitraan Terkirim!</h3>
              <p className="text-xs text-[#66736C] max-w-sm mx-auto leading-relaxed">
                Terima kasih <strong>{formData.contactName}</strong> dari <strong>{formData.institutionName}</strong>. Proposal dan informasi kemitraan telah kami catat. Tim Partnership akan menghubungi email kamu ({formData.email}) dalam 1x24 jam kerja.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#2E6F57] text-white text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-[#EEF7F2] border border-[#BFDCCD] rounded-xl text-xs text-[#173D30] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#2E6F57]" />
                <span>
                   <strong>Batas Kemitraan:</strong> Fitur laporan institusi belum tersedia dan tidak ada akses kemitraan ke Journal pengguna.
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-[#FBEAEC] border border-[#E89887] text-[#B8414E] text-xs rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#17201B]">Nama Institusi / Organisasi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMA Negeri 1 / BEM UNPAD"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDE4DF] rounded-xl focus:ring-2 focus:ring-[#2E6F57] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#17201B]">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDE4DF] rounded-xl focus:ring-2 focus:ring-[#2E6F57] focus:outline-none"
                  >
                    <option value="Sekolah / SMA / SMK">Sekolah / SMA / SMK</option>
                    <option value="Universitas / BEM / Fakultas">Universitas / BEM / Fakultas</option>
                    <option value="Komunitas Pemuda / OSIS">Komunitas Pemuda / OSIS</option>
                    <option value="Yayasan / NGO">Yayasan / NGO</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#17201B]">Nama Kontak Perwakilan</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap kamu"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDE4DF] rounded-xl focus:ring-2 focus:ring-[#2E6F57] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#17201B]">Email Resmi / Aktif</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@sekolah.sch.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDE4DF] rounded-xl focus:ring-2 focus:ring-[#2E6F57] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17201B]">Pesan atau Pertanyaan Khusus (Opsional)</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan rencana kolaborasi, perkiraan jumlah siswa/anggota, atau jadwal workshop yang diinginkan..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDE4DF] rounded-xl focus:ring-2 focus:ring-[#2E6F57] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#2E6F57] hover:bg-[#173D30] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Mengirim Permintaan..." : "Kirim Permintaan Informasi Kemitraan"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
