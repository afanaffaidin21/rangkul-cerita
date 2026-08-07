import type { Metadata } from "next";
import "./globals.css";

// Server-render every request so Next.js can apply the per-request CSP nonce
// (read from the middleware-provided Content-Security-Policy request header)
// to its inline bootstrap/flight scripts. Prebuilt static HTML cannot carry a
// per-request nonce, so a nonce CSP would block hydration on static pages.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rangkul Cerita — Ruang Aman untuk Memahami Perasaanmu",
  description: "Lakukan check-in emosi, tulis jurnal terpandu, dan temukan langkah bantuan yang tepat bersama Rangkul Cerita. Ruang refleksi digital aman untuk anak muda Indonesia.",
  openGraph: {
    type: "website",
    title: "Rangkul Cerita — Ruang Aman untuk Memahami Perasaanmu",
    description: "Cerita pelan-pelan. Pahami perasaanmu. Temukan langkah berikutnya bersama Rangkul Cerita.",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rangkul Cerita — Ruang Aman untuk Memahami Perasaanmu",
    description: "Lakukan check-in emosi dan tulis jurnal terpandu dengan hangat dan privat.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAFBF8] text-[#17201B] antialiased selection:bg-[#BFDCCD] selection:text-[#173D30]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#173D30] focus:text-white focus:rounded-lg"
        >
          Lompati ke Konten Utama (Skip to Content)
        </a>
        {children}
      </body>
    </html>
  );
}
