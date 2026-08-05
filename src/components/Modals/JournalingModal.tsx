'use client';

import React, { useEffect, useState } from "react";
import { Sparkles, X, Send, ShieldAlert, Check, Copy, ArrowRight, Heart, RefreshCw, BookOpen, Trash2 } from "lucide-react";
import { EmotionType, NeedType, MoodCheckinResult } from "../../types";
import { deleteJournalEntry, JournalEntry, readJournalEntries, saveJournalEntry } from "../../lib/privacy/journal-storage";

interface JournalingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmotions?: EmotionType[];
  initialIntensity?: number;
  initialNeed?: NeedType;
  onOpenSafetyModal: () => void;
}

export const JournalingModal: React.FC<JournalingModalProps> = ({
  isOpen,
  onClose,
  initialEmotions = ["Cemas"],
  initialIntensity = 3,
  initialNeed = "Cerita sebentar",
  onOpenSafetyModal,
}) => {
  const [userNote, setUserNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MoodCheckinResult | null>(null);
  const [conversation, setConversation] = useState<
    Array<{ sender: "user" | "ai"; text: string }>
  >([]);
  const [followUpText, setFollowUpText] = useState("");
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([]);
  const [journalMessage, setJournalMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    setSavedEntries(readJournalEntries(window.localStorage));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveJournal = () => {
    if (typeof window === "undefined") return;
    const saved = saveJournalEntry(window.localStorage, userNote);
    if (saved.ok === false) {
      setJournalMessage(saved.reason === "EMPTY" ? "Tulis sedikit cerita sebelum menyimpan." : "Cerita belum tersimpan. Periksa ruang penyimpanan browser lalu coba lagi.");
      return;
    }
    setSavedEntries((entries) => [...entries, saved.entry]);
    setUserNote("");
    setJournalMessage("Cerita tersimpan di browser ini.");
  };

  const handleDeleteJournal = (id: string) => {
    if (typeof window === "undefined") return;
    if (deleteJournalEntry(window.localStorage, id)) {
      setSavedEntries((entries) => entries.filter((entry) => entry.id !== id));
      setJournalMessage("Cerita dihapus dari browser ini.");
    }
  };

  const handleStartReflect = async () => {
    setJournalMessage(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkin/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotions: initialEmotions,
          intensity: initialIntensity,
          need: initialNeed,
          userNote,
        }),
      });

      const data: MoodCheckinResult & { success?: boolean; error?: { message?: string } } = await response.json();

      if (data.safety?.level === "HIGH" || data.safety?.level === "IMMINENT") {
        onOpenSafetyModal();
        return;
      }

      if (!response.ok || data.success !== true || typeof data.reflection !== "string") {
        setJournalMessage(data.error?.message || "Refleksi belum tersedia. Coba lagi.");
        return;
      }

      setResult(data);
      setConversation([
        { sender: "user", text: userNote || `Check-in: ${initialEmotions.join(", ")} (Skala ${initialIntensity}/5)` },
        { sender: "ai", text: data.reflection || "" },
      ]);
    } catch {
      setJournalMessage("Refleksi belum tersedia. Periksa koneksi lalu coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim() || isLoading) return;

    const userMessage = followUpText.trim();
    setFollowUpText("");
    const newHistory = [...conversation, { sender: "user" as const, text: userMessage }];
    setConversation(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkin/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotions: initialEmotions,
          intensity: initialIntensity,
          need: initialNeed,
          userNote: userMessage,
          history: newHistory,
        }),
      });

      const data: MoodCheckinResult & { success?: boolean; error?: { message?: string } } = await response.json();

      if (data.safety?.level === "HIGH" || data.safety?.level === "IMMINENT") {
        onOpenSafetyModal();
        return;
      }

      if (!response.ok || data.success !== true || typeof data.reflection !== "string") {
        setJournalMessage(data.error?.message || "Refleksi belum tersedia. Coba lagi.");
        return;
      }

      setResult(data);
      setConversation((prev) => [...prev, { sender: "ai", text: data.reflection || "" }]);
    } catch {
      setJournalMessage("Refleksi belum tersedia. Periksa koneksi lalu coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const textToCopy = `=== Ringkasan Refleksi Rangkul Cerita ===
Topik Utama: ${result.summary.mainTopic}
Emosi: ${result.summary.emotions.join(", ")}
Kebutuhan: ${result.summary.userNeed}
Langkah Selanjutnya: ${result.summary.nextStep}
Langkah Kecil Rekomendasi:
${result.recommendedSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#17201B]/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#FAFBF8] rounded-2xl shadow-2xl border border-[#DDE4DF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#173D30] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2E6F57] rounded-xl text-[#BFDCCD]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="journal-modal-title" className="text-lg font-bold font-sans">
                Sesi Jurnal AI Terpandu
              </h2>
              <p className="text-xs text-[#BFDCCD]">
                Ruang refleksi hangat, privat, dan tanpa penghakiman.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#BFDCCD] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup Jurnal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Initial prompt input state */}
        {!result && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            <div className="p-4 bg-[#EEF7F2] border border-[#BFDCCD] rounded-xl text-xs text-[#173D30] flex items-center justify-between">
              <div>
                <span className="font-bold">Check-in Terpilih: </span>
                {initialEmotions.join(", ")} (Skala {initialIntensity}/5) • Kebutuhan: {initialNeed}
              </div>
              <span className="text-[11px] bg-white px-2.5 py-1 rounded-md text-[#2E6F57] border border-[#BFDCCD]">
                Bukan Diagnosis
              </span>
            </div>

             {savedEntries.length > 0 && (
               <div className="space-y-2">
                 <h3 className="text-sm font-semibold text-[#17201B]">Cerita tersimpan di browser ini</h3>
                 {savedEntries.map((entry) => (
                   <div key={entry.id} className="flex items-start justify-between gap-3 p-3 bg-white border border-[#DDE4DF] rounded-xl">
                     <p className="text-xs text-[#35413A] whitespace-pre-line">{entry.text}</p>
                     <button type="button" onClick={() => handleDeleteJournal(entry.id)} aria-label="Hapus cerita tersimpan" className="shrink-0 p-2 text-[#B8414E] hover:bg-[#FAF0EE] rounded-lg">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
               </div>
             )}

             <div className="space-y-2">
               <label className="text-sm font-semibold text-[#17201B]">
                Ingin menceritakan apa yang terjadi hari ini? (Boleh dikosongkan)
              </label>
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="Tulis sesuka hatimu... misalnya: 'Aku kepikiran tentang tugas sekolah dan takut ngecewain orang tua', atau 'Tiba-tiba merasa sedih tanpa sebab'."
                rows={5}
                className="w-full p-4 text-sm bg-white border border-[#DDE4DF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E6F57] text-[#17201B] leading-relaxed"
              />
            </div>

               <div className="flex flex-col gap-3 pt-2">
                 <div className="text-xs text-[#66736C]">
                   Cerita hanya tersimpan di browser ini setelah kamu memilih Simpan. Tidak ada pengiriman otomatis. Refleksi AI hanya berjalan setelah kamu memilih Mulai Refleksi.
                 </div>
                 {journalMessage && <p className="text-xs text-[#8F2E3B]" role="status">{journalMessage}</p>}
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
               <button
                 type="button"
                 onClick={handleSaveJournal}
                 className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#F3F5F2] text-[#173D30] border border-[#BFDCCD] text-sm font-semibold rounded-xl"
               >
                 Simpan di Browser
               </button>
               <button
                onClick={handleStartReflect}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-[#2E6F57] hover:bg-[#173D30] text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Menyusun Refleksi...
                  </>
                ) : (
                  <>
                    Mulai Refleksi <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
                </div>
              </div>
            </div>
          )}

          {/* Active reflection dialogue & summary state */}
          {result && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAFBF8]">
            {/* Conversation log */}
            <div className="space-y-4">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#2E6F57] text-white rounded-tr-none shadow-sm"
                        : "bg-white border border-[#DDE4DF] text-[#17201B] rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E6F57] mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Pendamping Rangkul Cerita
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#DDE4DF] p-4 rounded-2xl text-xs text-[#66736C] flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2E6F57]" />
                    Mendengarkan dan menyusun refleksi hangat...
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Question prompt */}
            {result.suggestedQuestion && !isLoading && (
              <div className="p-4 bg-[#F3F5F2] border border-[#DDE4DF] rounded-xl text-xs text-[#35413A]">
                <strong className="text-[#173D30]">Pertanyaan Reflektif:</strong>{" "}
                {result.suggestedQuestion}
              </div>
            )}

            {/* Structured Session Summary */}
            <div className="p-5 bg-white border border-[#DDE4DF] rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#DDE4DF] pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#2E6F57]" />
                  <h3 className="font-bold text-sm text-[#173D30]">
                    Ringkasan Refleksi Sesi Ini
                  </h3>
                </div>
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 text-xs text-[#2E6F57] hover:text-[#173D30] font-medium"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSummary ? "Tersalin" : "Salin Ringkasan"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#66736C]">Topik Utama:</span>
                  <p className="font-semibold text-[#17201B] mt-0.5">{result.summary.mainTopic}</p>
                </div>
                <div>
                  <span className="text-[#66736C]">Emosi Teridentifikasi:</span>
                  <p className="font-semibold text-[#17201B] mt-0.5">
                    {result.summary.emotions.join(", ")}
                  </p>
                </div>
                <div>
                  <span className="text-[#66736C]">Kebutuhan Utama:</span>
                  <p className="font-semibold text-[#17201B] mt-0.5">{result.summary.userNeed}</p>
                </div>
                <div>
                  <span className="text-[#66736C]">Rekomendasi Langkah:</span>
                  <p className="font-semibold text-[#2E6F57] mt-0.5">{result.summary.nextStep}</p>
                </div>
              </div>

              {/* Recommended Action Steps */}
              {result.recommendedSteps && result.recommendedSteps.length > 0 && (
                <div className="pt-2 border-t border-[#DDE4DF]">
                  <span className="text-xs font-semibold text-[#173D30] block mb-2">
                    Langkah Kecil Realistis Hari Ini:
                  </span>
                  <ul className="space-y-1.5">
                    {result.recommendedSteps.map((step, idx) => (
                      <li key={idx} className="text-xs text-[#35413A] flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#EEF7F2] text-[#2E6F57] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Follow up text form */}
            <form onSubmit={handleSendFollowUp} className="flex gap-2 pt-2">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                placeholder="Balas atau ceritakan lebih lanjut..."
                className="flex-1 px-4 py-3 text-sm bg-white border border-[#DDE4DF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E6F57] text-[#17201B]"
              />
              <button
                type="submit"
                disabled={isLoading || !followUpText.trim()}
                className="px-5 py-3 bg-[#2E6F57] hover:bg-[#173D30] text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#F3F5F2] border-t border-[#DDE4DF] flex items-center justify-between text-xs text-[#66736C]">
          <button
            onClick={onOpenSafetyModal}
            className="flex items-center gap-1.5 text-[#B8414E] font-medium hover:underline"
          >
            <ShieldAlert className="w-4 h-4" /> Butuh Bantuan Segera?
          </button>
          <span>Cerita disimpan di memori lokal perambanmu.</span>
        </div>
      </div>
    </div>
  );
};
