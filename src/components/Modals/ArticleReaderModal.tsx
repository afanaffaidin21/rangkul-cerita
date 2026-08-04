'use client';

import React from "react";
import { X, BookOpen, Clock, ShieldCheck, Share2 } from "lucide-react";
import { ArticleItem } from "../../types";

interface ArticleReaderModalProps {
  article: ArticleItem | null;
  onClose: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#17201B]/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#FAFBF8] rounded-2xl shadow-2xl border border-[#DDE4DF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#173D30] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-[#2E6F57] text-[#BFDCCD] font-semibold rounded-md">
              {article.category}
            </span>
            <span className="text-xs text-[#BFDCCD] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#BFDCCD] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#17201B] leading-snug">
              {article.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#66736C] mt-2 pt-2 border-t border-[#DDE4DF]">
              <ShieldCheck className="w-4 h-4 text-[#2E6F57]" />
              <span>{article.reviewer}</span> • <span>Diperbarui {article.updatedAt}</span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-[#35413A] leading-relaxed">
            {article.fullBody.map((paragraph, idx) => (
              <p key={idx} className="bg-white p-4 rounded-xl border border-[#DDE4DF]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F3F5F2] border-t border-[#DDE4DF] flex items-center justify-between text-xs text-[#66736C]">
          <span>Materi self-help berbasis bukti untuk literasi emosi.</span>
          <button onClick={onClose} className="px-4 py-2 bg-[#2E6F57] text-white font-semibold rounded-xl">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
