import React from "react";
import { Heart, Compass, ShieldCheck, Users, Lock, Sparkles } from "lucide-react";

export const AboutPhilosophy: React.FC = () => {
  const principles = [
    {
      title: "Memahami Sebelum Menilai",
      desc: "Menyediakan ruang mendengarkan yang aman tanpa langsung melabeli atau menghakimi rasa sakitmu.",
      icon: Heart,
    },
    {
      title: "Mendampingi Tanpa Menggantikan",
      desc: "AI membantu merapikan cerita, bukan bertindak sebagai dokter, psikolog, atau terapis mandiri.",
      icon: Compass,
    },
    {
      title: "Mendorong Koneksi Manusia",
      desc: "Membantu pengguna merasa cukup aman untuk terhubung kembali dengan teman, keluarga, atau profesional.",
      icon: Users,
    },
    {
      title: "Relevan Konteks Indonesia",
      desc: "Kehangatan bahasa, norma keluarga, tekanan sekolah, dan kearifan lokal anak muda Indonesia.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="tentang" className="py-16 lg:py-24 bg-white border-b border-[#DDE4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F2] text-[#2E6F57] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Filosofi & Alasan Dibangun</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173D30] font-sans">
            Setiap cerita layak didengar,{" "}
            <span className="font-serif italic font-normal text-[#2E6F57]">
              tanpa buru-buru diberi label.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#66736C] leading-relaxed">
            Rangkul Cerita hadir dari kesadaran bahwa banyak anak muda Indonesia merasa lelah, cemas, dan kesepian, tetapi takut untuk bercerita karena takut dihakimi atau dianggap kurang bersyukur.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-[#DDE4DF] md:divide-x md:divide-[#DDE4DF]">
          {principles.map((pr, idx) => {
            const IconComp = pr.icon;
            return (
              <div
                key={idx}
                className={`py-7 md:px-8 border-b border-[#DDE4DF] space-y-3 ${idx % 2 === 0 ? "md:pl-0" : "md:pr-0"}`}
              >
                <IconComp className="w-5 h-5 text-[#2E6F57]" />
                <h3 className="font-bold text-lg text-[#173D30]">{pr.title}</h3>
                <p className="text-sm text-[#66736C] leading-relaxed">{pr.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
