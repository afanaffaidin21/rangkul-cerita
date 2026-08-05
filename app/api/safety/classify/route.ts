import { NextResponse } from "next/server";
import { isCrisisLevel, runSafetyGate } from "../../../../src/lib/safety/gate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Teks wajib diisi" }, { status: 400 });
    }

    const safety = runSafetyGate(text);

    if (!safety.allowed) {
      return NextResponse.json({
        success: true,
        safety: {
          level: safety.classification?.level ?? null,
          status: "reason" in safety ? safety.reason : "CLASSIFIER_FAILURE",
        },
        isCrisis: safety.classification ? isCrisisLevel(safety.classification.level) : false,
      });
    }

    return NextResponse.json({
      success: true,
      safety: {
        level: safety.classification.level,
        status: "ALLOWED",
      },
      isCrisis: false,
    });
  } catch {
    console.error("Safety classification error");
    return NextResponse.json(
      { error: "Gagal memproses pengecekan keselamatan" },
      { status: 500 }
    );
  }
}
