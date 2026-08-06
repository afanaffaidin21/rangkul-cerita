'use client';

import React, { useState } from "react";
import { CheckCircle2, Send, ShieldCheck } from "lucide-react";

const initialForm = { institutionName: "", category: "Sekolah / SMA / SMK", contactName: "", email: "", phone: "", message: "" };

export const PartnershipForm: React.FC = () => {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const update = (field: keyof typeof formData, value: string) => setFormData((current) => ({ ...current, [field]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    setFieldError(null);
    try {
      const response = await fetch("/api/partnership", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error?.message || "Formulir kemitraan belum dapat diproses");
      setStatus("success");
    } catch (cause: unknown) {
      setStatus("idle");
      setError(cause instanceof Error ? cause.message : "Terjadi kesalahan. Silakan coba lagi.");
    }
  };
  if (status === "success") return <div role="status" className="p-8 bg-[#EEF7F2] rounded-3xl text-center space-y-3"><CheckCircle2 className="w-8 h-8 text-[#2E7D5B] mx-auto" /><h2 className="text-xl font-bold text-[#173D30]">Permintaan kemitraan telah dicatat.</h2><p className="text-sm text-[#35413A]">Terima kasih, {formData.contactName}. Informasi dari {formData.institutionName} berhasil tersimpan.</p></div>;
  return <form onSubmit={submit} className="p-6 sm:p-8 bg-white rounded-3xl shadow-sm space-y-5"><div className="flex items-start gap-2 p-4 bg-[#EEF7F2] rounded-2xl text-sm text-[#35413A]"><ShieldCheck className="w-4 h-4 text-[#2E6F57] shrink-0 mt-0.5" /><span>Fitur laporan institusi belum tersedia dan mitra tidak mendapat akses ke jurnal pengguna.</span></div>{error && <p id="partnership-error" role="alert" className="p-3 bg-[#FBEAEC] text-[#B8414E] rounded-xl text-sm">{error}</p>}<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="Nama institusi / organisasi" value={formData.institutionName} onChange={(value) => update("institutionName", value)} required maxLength={160} /><label className="space-y-1 text-sm font-semibold text-[#17201B]">Kategori<select value={formData.category} onChange={(event) => update("category", event.target.value)} className="w-full px-4 py-3 bg-white border border-[#DDE4DF] rounded-xl font-normal"><option>Sekolah / SMA / SMK</option><option>Universitas / BEM / Fakultas</option><option>Komunitas Pemuda / OSIS</option><option>Yayasan / NGO</option><option>Lainnya</option></select></label><Field label="Nama kontak perwakilan" value={formData.contactName} onChange={(value) => update("contactName", value)} required maxLength={120} /><Field label="Email aktif" type="email" value={formData.email} onChange={(value) => update("email", value)} required maxLength={254} /><Field label="Nomor telepon (opsional)" type="tel" value={formData.phone} onChange={(value) => update("phone", value)} maxLength={30} /></div><label className="block space-y-1 text-sm font-semibold text-[#17201B]">Pesan atau pertanyaan (opsional)<textarea value={formData.message} onChange={(event) => update("message", event.target.value)} maxLength={2000} rows={4} className="w-full px-4 py-3 bg-white border border-[#DDE4DF] rounded-xl font-normal" /></label><button type="submit" disabled={status === "submitting"} className="w-full py-3 bg-[#2E6F57] text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"><Send className="w-4 h-4" />{status === "submitting" ? "Mengirim permintaan..." : "Kirim permintaan kemitraan"}</button></form>;
};

const Field = ({ label, type = "text", value, onChange, required = false, maxLength }: { label: string; type?: string; value: string; onChange: (value: string) => void; required?: boolean; maxLength: number }) => { const id = `partnership-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`; return <label htmlFor={id} className="space-y-1 text-sm font-semibold text-[#17201B]">{label}<input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} maxLength={maxLength} aria-invalid={false} className="w-full px-4 py-3 bg-white border border-[#DDE4DF] rounded-xl font-normal" /></label>; };
