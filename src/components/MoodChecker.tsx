'use client';

import React, { useState } from "react";
import {
  EMOTION_OPTIONS
} from "../data/landingData";
import { EmotionType, NeedType, MoodCheckinResult } from "../types";
import { isControlledHighState, isControlledImminentState } from "../lib/safety/ui-state";
import { getCheckinViewState } from "../lib/safety/checkin-state";
import { CHECKIN_STEPS } from "../lib/checkin/progression";
import { Sparkles, ArrowRight, RefreshCw, Heart, Check, Play, Phone, ShieldAlert } from "lucide-react";

interface MoodCheckerProps {
  onOpenJournalWithData: (emotions: EmotionType[], intensity: number, need: NeedType) => void;
  onOpenSafetyModal: () => void;
  onOpenExerciseModal: () => void;
}

export const MoodChecker: React.FC<MoodCheckerProps> = ({
  onOpenJournalWithData,
  onOpenSafetyModal,
  onOpenExerciseModal,
}) => {
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionType[]>(["Cemas"]);
  const [intensity, setIntensity] = useState<number>(3);
  const [need, setNeed] = useState<NeedType>("Cerita sebentar");
  const [userNote, setUserNote] = useState<string>("");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(CHECKIN_STEPS.indexOf("feeling") + 1 as 1 | 2 | 3 | 4);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [requestError, setRequestError] = useState(false);
  const [result, setResult] = useState<MoodCheckinResult | null>(null);

  const intensityLabels: Record<number, string> = {
    1: "1 — Sedikit terasa",
    2: "2 — Ringan",
    3: "3 — Cukup terasa",
    4: "4 — Berat",
    5: "5 — Sangat berat",
  };

  const needOptions: NeedType[] = [
    "Cerita sebentar",
    "Tenangkan diri",
    "Pahami penyebabnya",
    "Cari bantuan",
    "Aku belum tahu",
  ];

  const toggleEmotion = (emotionId: EmotionType) => {
    if (selectedEmotions.includes(emotionId)) {
      if (selectedEmotions.length > 1) {
        setSelectedEmotions(selectedEmotions.filter((e) => e !== emotionId));
      }
    } else {
      setSelectedEmotions([...selectedEmotions, emotionId]);
    }
  };

  const resultState = getCheckinViewState(result);
  const viewState = requestError && resultState !== "HIGH_CONTROLLED" && resultState !== "IMMINENT_CONTROLLED"
    ? "ERROR"
    : isLoading
      ? "SUBMITTING"
      : resultState;

  const handleProcessCheckin = async () => {
    if (isLoading) return;
    setRequestError(false);
    if (result && getCheckinViewState(result) !== "HIGH_CONTROLLED" && getCheckinViewState(result) !== "IMMINENT_CONTROLLED") {
      setResult(null);
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkin/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotions: selectedEmotions,
          intensity,
          need,
          userNote,
        }),
      });

      const data = await response.json();

       if (data.safety?.level === "HIGH" || data.safety?.level === "IMMINENT") {
         onOpenSafetyModal();
         setResult(data);
         return;
       }

       if (!response.ok || data.success !== true || typeof data.reflection !== "string") {
         setRequestError(true);
         setResult(null);
         return;
       }

       setResult(data);
    } catch {
      setRequestError(true);
      console.error("Check-in reflection request failed");
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextStep = () => {
    setStep((current) => Math.min(4, current + 1) as 1 | 2 | 3 | 4);
  };

  const goToPreviousStep = () => {
    setStep((current) => Math.max(1, current - 1) as 1 | 2 | 3 | 4);
  };

  return (
    <section id="mood-checker" className="py-16 lg:py-24 bg-[#FAFBF8] border-b border-[#DDE4DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#2E6F57] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pengecekan Emosi Interaktif</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Apa yang paling terasa hari ini?
          </h2>
          <p className="text-sm sm:text-base text-[#66736C] max-w-xl mx-auto">
            Tidak ada jawaban benar atau salah. Pilih yang paling mendekati perasaanmu saat ini.
          </p>
        </div>

        {/* Interactive Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DDE4DF] shadow-lg space-y-8">
          
          {/* STEP 1: Emotion Selection */}
          <div className={`${step === 1 ? "" : "hidden"} space-y-4`}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[#173D30] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2E6F57] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                Pilih satu atau beberapa perasaan:
              </label>
              <span className="text-xs text-[#66736C]">
                {selectedEmotions.length} terpilih
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EMOTION_OPTIONS.map((opt) => {
                const isSelected = selectedEmotions.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleEmotion(opt.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "border-[#2E6F57] bg-[#EEF7F2] ring-2 ring-[#2E6F57]/30 shadow-sm"
                        : "border-[#DDE4DF] bg-white hover:border-[#BFDCCD] hover:bg-[#FAFBF8]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: opt.bgHex, color: opt.colorHex }}
                      >
                        {opt.label}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#2E6F57]" />}
                    </div>
                    <p className="text-[11px] text-[#66736C] leading-snug">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Intensity Slider */}
          <div className={`${step === 2 ? "" : "hidden"} space-y-4 pt-4 border-t border-[#DDE4DF]`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-bold text-[#173D30] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2E6F57] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                Seberapa kuat perasaan ini?
              </label>
              <span className="self-start ml-8 text-xs font-bold text-[#2E6F57] px-3 py-1 bg-[#EEF7F2] rounded-full border border-[#BFDCCD] sm:self-auto sm:ml-0">
                {intensityLabels[intensity]}
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2.5 bg-[#EEF7F2] rounded-lg appearance-none cursor-pointer accent-[#2E6F57]"
              />
              <div className="flex justify-between text-[11px] text-[#66736C]">
                <span>1 (Sedikit terasa)</span>
                <span>3 (Cukup terasa)</span>
                <span>5 (Sangat berat)</span>
              </div>
            </div>
          </div>

          {/* STEP 3: Current Need */}
          <div className={`${step === 3 ? "" : "hidden"} space-y-4 pt-4 border-t border-[#DDE4DF]`}>
            <label className="text-sm font-bold text-[#173D30] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2E6F57] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              Sekarang kamu paling butuh apa?
            </label>

            <div className="flex flex-wrap gap-2.5">
              {needOptions.map((opt) => {
                const isSelected = need === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setNeed(opt)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-[#2E6F57] text-white border-[#2E6F57] shadow-sm"
                        : "bg-white text-[#35413A] border-[#DDE4DF] hover:bg-[#F3F5F2]"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Short Note */}
          <div className={`${step === 4 ? "" : "hidden"} space-y-2 pt-2`}>
            <label className="text-xs font-semibold text-[#173D30]">
              Catatan singkat tentang pemicu atau apa yang terjadi (Opsional):
            </label>
            <input
              type="text"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Misal: Tiba-tiba cemas ingat deadline skripsi besok pagi..."
              className="w-full px-4 py-3 text-xs bg-[#FAFBF8] border border-[#DDE4DF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E6F57] text-[#17201B]"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {step > 1 ? (
              <button type="button" onClick={goToPreviousStep} disabled={isLoading} className="px-4 py-3 text-xs font-semibold text-[#2E6F57] border border-[#BFDCCD] rounded-xl disabled:opacity-50">
                Kembali
              </button>
            ) : <span />}
            {step < 4 ? (
              <button type="button" onClick={goToNextStep} className="ml-auto px-5 py-3 bg-[#2E6F57] hover:bg-[#173D30] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
                Lanjut <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleProcessCheckin} disabled={isLoading} className="ml-auto px-5 py-3 bg-[#2E6F57] hover:bg-[#173D30] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                {isLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Merangkum Perasaan...</> : <><Sparkles className="w-4 h-4 text-[#BFDCCD]" /> Dapatkan Refleksi Awal</>}
              </button>
            )}
          </div>

          {viewState === "ERROR" ? (
            <div className="p-4 mt-6 rounded-2xl border border-[#E89887] bg-[#FAF0EE] text-sm text-[#8F2E3B] space-y-3" role="alert">
              <p>Refleksi belum tersedia. Coba lagi atau pilih jalur bantuan.</p>
              <button
                type="button"
                onClick={onOpenSafetyModal}
                className="px-4 py-2.5 bg-white text-[#173D30] border border-[#DDE4DF] text-xs font-semibold rounded-xl"
              >
                Lihat Pilihan Bantuan
              </button>
            </div>
          ) : viewState === "IMMINENT_CONTROLLED" && result && isControlledImminentState(result.safety?.level) ? (
            <div className="p-6 bg-[#FAF0EE] border-2 border-[#B8414E] rounded-2xl space-y-4 animate-fade-in mt-6" role="alert" aria-labelledby="imminent-safety-title">
              <div className="flex items-center gap-2 text-xs font-bold text-[#B8414E]">
                <ShieldAlert className="w-4 h-4" />
                <span id="imminent-safety-title">Cari bantuan langsung sekarang</span>
              </div>
              <p className="text-sm text-[#17201B] leading-relaxed font-sans font-medium">
                {result.controlledResponse?.message || "Hubungi bantuan darurat sekarang dan dekati orang yang bisa menemanimu."}
              </p>
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={onOpenSafetyModal}
                  className="w-full px-5 py-3 bg-[#B8414E] hover:bg-[#8F2E3B] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8414E] focus:ring-offset-2"
                >
                  <Phone className="w-4 h-4" /> Hubungi PSC 119
                </button>
                <button
                  onClick={onOpenSafetyModal}
                  className="w-full px-5 py-2.5 bg-white hover:bg-[#F3F5F2] text-[#173D30] border border-[#DDE4DF] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2E6F57] focus:ring-offset-2"
                >
                  Coba 112 jika tersedia di wilayahmu
                </button>
                <button
                  onClick={onOpenSafetyModal}
                  className="w-full px-5 py-2.5 bg-white hover:bg-[#F3F5F2] text-[#173D30] border border-[#DDE4DF] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2E6F57] focus:ring-offset-2"
                >
                  Hubungi Orang Tepercaya Sekarang
                </button>
              </div>
            </div>
          ) : viewState === "HIGH_CONTROLLED" && result && isControlledHighState(result.safety?.level) ? (
            <div className="p-6 bg-[#FAF0EE] border border-[#E89887] rounded-2xl space-y-4 animate-fade-in mt-6" role="alert" aria-labelledby="high-safety-title">
              <div className="flex items-center gap-2 text-xs font-bold text-[#B8414E]">
                <ShieldAlert className="w-4 h-4" />
                <span id="high-safety-title">Dukungan manusia lebih penting sekarang</span>
              </div>
              <p className="text-sm text-[#17201B] leading-relaxed font-sans font-medium">
                {result.controlledResponse?.message || "Untuk saat ini, hubungi orang yang bisa menemanimu dan dukungan manusia yang tersedia."}
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={onOpenSafetyModal}
                  className="px-5 py-2.5 bg-[#B8414E] hover:bg-[#8F2E3B] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8414E] focus:ring-offset-2"
                >
                  <Phone className="w-3.5 h-3.5" /> Lihat Jalur Healing119
                </button>
                <button
                  onClick={onOpenSafetyModal}
                  className="px-5 py-2.5 bg-white hover:bg-[#F3F5F2] text-[#173D30] border border-[#DDE4DF] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2E6F57] focus:ring-offset-2"
                >
                  Hubungi Orang Tepercaya
                </button>
              </div>
            </div>
          ) : result && (
            <div className="p-6 bg-[#EEF7F2] border border-[#BFDCCD] rounded-2xl space-y-4 animate-fade-in mt-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2E6F57]">
                <Heart className="w-4 h-4 fill-current" />
                <span>Refleksi Awal Rangkul Cerita</span>
              </div>

              <p className="text-sm text-[#17201B] leading-relaxed font-sans font-medium">
                “{result.reflection}”
              </p>

              {result.suggestedQuestion && (
                <div className="p-3.5 bg-white/80 rounded-xl text-xs text-[#35413A] border border-[#DDE4DF]">
                  <strong className="text-[#173D30]">Pertanyaan Refleksi: </strong>
                  {result.suggestedQuestion}
                </div>
              )}

              {/* CTAs from Result */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => onOpenJournalWithData(selectedEmotions, intensity, need)}
                  className="px-5 py-2.5 bg-[#2E6F57] hover:bg-[#173D30] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#BFDCCD]" /> Mulai Jurnal Terpandu
                </button>

                <button
                  onClick={onOpenExerciseModal}
                  className="px-5 py-2.5 bg-white hover:bg-[#F3F5F2] text-[#173D30] border border-[#DDE4DF] text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 text-[#2E6F57] fill-current" /> Coba Latihan 2 Menit
                </button>

                <button
                  onClick={onOpenSafetyModal}
                  className="px-5 py-2.5 bg-[#FBEAEC] hover:bg-[#E89887]/30 text-[#B8414E] border border-[#E89887]/40 text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> Lihat Pilihan Bantuan
                </button>
              </div>
            </div>
          )}

          <div className="text-center text-[11px] text-[#66736C]">
            📌 Check-in emosi ini bukan alat diagnosis klinis dan tidak menyimpan data sensitif tanpa izinmu.
          </div>

        </div>
      </div>
    </section>
  );
};
