'use client';

import React, { useState, useEffect } from "react";
import { Heart, Menu, X, Sparkles, Phone, ShieldCheck } from "lucide-react";

interface NavbarProps {
  onStartCheckin: () => void;
  onOpenSafetyModal: () => void;
  onOpenPrivacyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartCheckin,
  onOpenSafetyModal,
  onOpenPrivacyModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Check-in", href: "/#mood-checker" },
    { label: "Materi", href: "/resources" },
    { label: "Artikel", href: "/articles" },
    { label: "Dukungan", href: "/help" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        isScrolled
          ? "bg-[#FAFBF8]/95 backdrop-blur-md shadow-sm border-b border-[#DDE4DF]"
          : "bg-[#FAFBF8] border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Logo */}
        <a href="/" className="min-w-0 flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#2E6F57] rounded-lg p-1">
          <div className="w-10 h-10 rounded-2xl bg-[#2E6F57] text-[#BFDCCD] flex items-center justify-center shadow-sm group-hover:bg-[#173D30] transition-colors">
            <Heart className="w-5 h-5 fill-current" />
          </div>
           <div className="min-w-0">
             <span className="font-bold text-lg text-[#173D30] tracking-tight font-sans block leading-none">
              Rangkul Cerita
            </span>
            <span className="text-[10px] text-[#66736C] tracking-wide block mt-0.5">
              Ruang Refleksi Digital
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#35413A]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#2E6F57] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E6F57] rounded-md px-1 py-0.5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right CTAs */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={onOpenPrivacyModal}
            className="p-2 text-[#66736C] hover:text-[#173D30] hover:bg-[#EEF7F2] rounded-xl transition-colors"
            aria-label="Pusat Privasi & Data"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenSafetyModal}
            className="p-2 text-[#66736C] hover:text-[#B8414E] hover:bg-[#FBEAEC] rounded-xl transition-colors"
            aria-label="Buka pilihan dukungan manusia"
          >
            <Phone className="w-5 h-5" />
          </button>

          <button
            onClick={onStartCheckin}
            className="px-5 py-2.5 bg-[#2E6F57] hover:bg-[#173D30] text-white text-xs font-semibold rounded-xl shadow-sm transition-[background-color,box-shadow,color] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2E6F57]"
          >
            <Sparkles className="w-4 h-4 text-[#BFDCCD]" />
            <span>Mulai Check-in</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenSafetyModal}
            className="min-w-11 min-h-11 p-2.5 text-[#66736C] hover:text-[#B8414E] hover:bg-[#FBEAEC] rounded-xl flex items-center justify-center"
            aria-label="Buka pilihan dukungan manusia"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-w-11 min-h-11 p-2.5 border border-[#DDE4DF] bg-white text-[#17201B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E6F57] flex items-center justify-center"
            aria-label={mobileMenuOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto bg-[#FAFBF8] border-b border-[#DDE4DF] px-6 py-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#17201B] hover:text-[#2E6F57] py-2 border-b border-[#DDE4DF]/50"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartCheckin();
              }}
              className="w-full py-3 bg-[#2E6F57] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#BFDCCD]" /> Mulai Check-in
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrivacyModal();
              }}
              className="w-full py-2.5 border border-[#DDE4DF] text-[#173D30] text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Pengaturan Privasi & Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
