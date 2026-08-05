import { NextResponse } from "next/server";
import { VERIFIED_HELPLINES } from "../../../../src/lib/safety/contacts";
import { SAFETY_RISK_LEVELS } from "../../../../src/lib/safety/risk-levels";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Teks wajib diisi" }, { status: 400 });
    }

    const lowercase = text.toLowerCase();
    const crisisKeywords = [
      "bunuh diri", "akhiri hidup", "sayat", "potong urat", "overdosis", "gantung diri",
      "ingin mati", "racun", "loncat dari", "menyakiti diri", "gak kuat lagi pengen mati"
    ];

    const isHighRisk = crisisKeywords.some((kw) => lowercase.includes(kw));

    if (isHighRisk) {
      return NextResponse.json({
        riskLevel: SAFETY_RISK_LEVELS.HIGH,
        isCrisis: true,
        message: "Sistem mendeteksi sinyal krisis. Silakan akses jalur bantuan darurat segera.",
        recommendedHelplines: VERIFIED_HELPLINES
      });
    }

    return NextResponse.json({ riskLevel: SAFETY_RISK_LEVELS.LOW, isCrisis: false });
  } catch (err: any) {
    console.error("Safety classification error:", err);
    return NextResponse.json(
      { error: "Gagal memproses pengecekan keselamatan" },
      { status: 500 }
    );
  }
}
