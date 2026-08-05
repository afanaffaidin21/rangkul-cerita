import { NextResponse } from "next/server";
import { isCrisisLevel, runSafetyGate } from "../../../../src/lib/safety/gate";
import { parseJson, safetyClassificationSchema, validationError } from "../../../../src/lib/validation/public-boundaries";

export async function POST(request: Request) {
  const body = await parseJson(request, safetyClassificationSchema);
  if (!body) return validationError();

  try {
    const safety = runSafetyGate(body.text);

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
