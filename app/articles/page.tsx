import type { Metadata } from "next";
import { ARTICLES_DATA } from "../../src/data/landingData";
import { PublicPageShell } from "../../src/components/PublicPageShell";

export const metadata: Metadata = { title: "Artikel — Rangkul Cerita", description: "Bacaan ringkas untuk literasi emosi dan refleksi awal." };

export default function ArticlesPage() {
  return <PublicPageShell><main id="main-content" className="flex-1 py-16 lg:py-24"><div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12"><header className="space-y-4"><h1 className="text-3xl sm:text-4xl font-bold text-[#173D30]">Bacaan untuk memahami yang kamu rasakan.</h1><p className="text-base text-[#35413A]">Artikel ringkas berbahasa Indonesia untuk refleksi awal dan literasi emosi.</p></header><div className="space-y-10">{ARTICLES_DATA.map((article) => <article key={article.id} className="space-y-4"><div className="text-xs text-[#66736C]">{article.category} · {article.readTime} · Diperbarui {article.updatedAt}</div><h2 className="text-2xl font-bold text-[#173D30]">{article.title}</h2><p className="text-sm font-semibold text-[#35413A]">{article.excerpt}</p><div className="space-y-3 text-base text-[#35413A] leading-relaxed">{article.fullBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><p className="text-xs text-[#66736C]">{article.reviewer}</p></article>)}</div></div></main></PublicPageShell>;
}
