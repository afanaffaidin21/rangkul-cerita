'use client';

import React, { useState, useEffect } from "react";
import { X, Play, Pause, RotateCcw, CheckCircle2, Heart, Sparkles } from "lucide-react";

interface GroundingExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseType?: "grounding" | "breathing";
}

export const GroundingExerciseModal: React.FC<GroundingExerciseModalProps> = ({
  isOpen,
  onClose,
  exerciseType = "grounding",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const groundingSteps = [
    { title: "Lihat 5 Benda di Sekitarmu", text: "Perhatikan warna, bentuk, atau tekstur 5 benda yang berada dekat denganmu.", count: 5 },
    { title: "Sentuh 4 Benda yang Bisa Dirasakan", text: "Rasakan permukaan baju, meja, kain, atau dinginnya ponselmu.", count: 4 },
    { title: "Dengar 3 Suara di Sekitarmu", text: "Dengarkan desir angin, detik jam, atau suara kendaraan di kejauhan.", count: 3 },
    { title: "Cium 2 Aroma yang Ada", text: "Sadari aroma pakaian, ruangan, atau hirup napas dalam-dalam.", count: 2 },
    { title: "Rasakan 1 Sensasi di Lidahmu", text: "Rasakan sisa rasa minuman, air liur, atau basahi bibirmu perlahan.", count: 1 },
  ];

  const breathingPhases = ["Tarik Napas (4d)", "Tahan Napas (4d)", "Hembuskan (4d)", "Tahan Kosong (4d)"];

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((sec) => sec + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  if (!isOpen) return null;

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    setCurrentStep(0);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#17201B]/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-[#FAFBF8] rounded-2xl shadow-2xl border border-[#DDE4DF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2E6F57] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#BFDCCD]" />
            <h2 className="text-base font-bold">
              {exerciseType === "grounding" ? "Latihan Grounding 5-4-3-2-1" : "Pernapasan Kotak 4-4-4-4"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#BFDCCD] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-center">
          {exerciseType === "grounding" ? (
            <div className="space-y-4">
              <div className="p-6 bg-white border border-[#DDE4DF] rounded-2xl shadow-sm min-h-[180px] flex flex-col justify-center items-center">
                <span className="w-10 h-10 rounded-full bg-[#EEF7F2] text-[#2E6F57] font-bold text-lg flex items-center justify-center mb-3">
                  {groundingSteps[currentStep].count}
                </span>
                <h3 className="font-bold text-lg text-[#17201B]">
                  {groundingSteps[currentStep].title}
                </h3>
                <p className="text-sm text-[#66736C] max-w-md mt-2 leading-relaxed">
                  {groundingSteps[currentStep].text}
                </p>
              </div>

              {/* Progress step dots */}
              <div className="flex justify-center gap-2">
                {groundingSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      currentStep === idx ? "w-8 bg-[#2E6F57]" : "w-2.5 bg-[#DDE4DF]"
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 border border-[#DDE4DF] rounded-xl text-xs font-semibold text-[#35413A] disabled:opacity-40"
                >
                  Sebelumnya
                </button>

                {currentStep < groundingSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="px-5 py-2.5 bg-[#2E6F57] hover:bg-[#173D30] text-white text-xs font-semibold rounded-xl shadow-sm"
                  >
                    Langkah Berikutnya
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-[#2E7D5B] hover:bg-[#173D30] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Selesai Latihan
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Animated breathing circle */}
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full bg-[#BFDCCD] opacity-30 transition-transform duration-1000 motion-reduce:transition-none motion-reduce:animate-none motion-reduce:scale-100 ${
                    isActive ? "scale-125 animate-pulse" : "scale-100"
                  }`}
                />
                <div className="relative w-32 h-32 rounded-full bg-[#2E6F57] text-white flex flex-col items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold">{seconds}s</span>
                  <span className="text-[11px] text-[#BFDCCD] mt-1">
                    {breathingPhases[Math.floor((seconds % 16) / 4)]}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="px-5 py-2.5 bg-[#2E6F57] text-white text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isActive ? "Jeda" : "Mulai Pernapasan"}
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 border border-[#DDE4DF] text-[#35413A] text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F3F5F2] border-t border-[#DDE4DF] text-center text-xs text-[#66736C]">
          Rasakan napasmu yang perlahan dan hangat. Tubuhmu sedang aman saat ini.
        </div>
      </div>
    </div>
  );
};
