'use client';

import React from "react";
import { Heart, Globe, Shield, Activity, Lock } from "lucide-react";

interface FooterProps {
  onOpenPrivacyModal: () => void;
  onOpenSafetyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacyModal, onOpenSafetyModal }) => {
  return (
    <footer className="bg-[#173D30] text-white border-t border-[#BFDCCD]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          
          {/* Col 1: Brand & Identity */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2E6F57] text-[#BFDCCD] flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-base font-sans text-white tracking-tight">
                Rangkul Cerita
              </span>
            </div>

            <p className="text-[#BFDCCD] leading-relaxed max-w-sm font-normal">
              Ruang aman digital untuk anak muda Indonesia memahami emosi, menceritakan masalah dengan privat, dan menemukan jalur bantuan manusia yang tepat.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#BFDCCD]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D5B] animate-pulse" />
              <span>Status Sistem: Operasional Normal (99.9%)</span>
            </div>
          </div>

          {/* Col 2: Rangkul Cerita */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Rangkul Cerita
            </h4>
            <ul className="space-y-2 text-[#BFDCCD]">
              <li><a href="#tentang" className="hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#tentang" className="hover:text-white transition-colors">Filosofi</a></li>
              <li><a href="#keamanan" className="hover:text-white transition-colors">Tim & Advisor</a></li>
              <li><a href="#keamanan" className="hover:text-white transition-colors">Kontak Kami</a></li>
            </ul>
          </div>

          {/* Col 3: Layanan */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Layanan
            </h4>
            <ul className="space-y-2 text-[#BFDCCD]">
              <li><a href="#mood-checker" className="hover:text-white transition-colors">Mood Check-in</a></li>
              <li><a href="#fitur" className="hover:text-white transition-colors">Jurnal Terpandu</a></li>
              <li><a href="#self-help" className="hover:text-white transition-colors">Self-Help Praktis</a></li>
              <li><button onClick={onOpenSafetyModal} className="hover:text-white transition-colors text-left">Direktori Bantuan</button></li>
            </ul>
          </div>

          {/* Col 4: Legal & Safety */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Legal & Privasi
            </h4>
            <ul className="space-y-2 text-[#BFDCCD]">
              <li><button onClick={onOpenPrivacyModal} className="hover:text-white transition-colors text-left">Kebijakan Privasi</button></li>
              <li><button onClick={onOpenPrivacyModal} className="hover:text-white transition-colors text-left">Kebijakan AI & Limits</button></li>
              <li><button onClick={onOpenSafetyModal} className="hover:text-white transition-colors text-left">Protokol Krisis</button></li>
              <li><button onClick={onOpenPrivacyModal} className="hover:text-white transition-colors text-left">Hapus Data Saya</button></li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 bg-[#2E6F57]/40 border border-[#BFDCCD]/20 rounded-2xl text-center text-xs text-[#BFDCCD]">
          <p>
            <strong>Disclaimer Penting:</strong> Rangkul Cerita bukan pengganti layanan kesehatan mental profesional, psikolog, psikiater, atau layanan darurat medis. Layanan ini adalah alat refleksi awal dan literasi emosi. Jika kamu berada dalam kondisi krisis atau tidak aman, segera hubungi Layanan Sehat Jiwa 119 Ext 8.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#BFDCCD]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#BFDCCD]">
          <p>© 2026 Rangkul Cerita Indonesia. Hak Cipta Dilindungi.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Bahasa Indonesia
            </span>
            <span>WCAG 2.2 AA Accessible</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
