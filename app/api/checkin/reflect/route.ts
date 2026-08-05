import { NextResponse } from "next/server";
import { checkinReflectionSchema, parseJson, validationError } from "../../../../src/lib/validation/public-boundaries";
import { generateReflection } from "../../../../src/lib/ai/provider";
import { reflectionOutputSchema } from "../../../../src/lib/ai/schemas";
import { isCrisisLevel, runSafetyGate } from "../../../../src/lib/safety/gate";
import {
  CONTROLLED_HIGH_RESPONSE,
  CONTROLLED_IMMINENT_RESPONSE,
} from "../../../../src/lib/safety/messages";

export async function POST(request: Request) {
  const body = await parseJson(request, checkinReflectionSchema);
  if (!body) return validationError();

  const safety = runSafetyGate(body.userNote);

  if (!safety.allowed) {
    return NextResponse.json({
        success: true,
        safety: {
          level: safety.classification?.level ?? null,
          status: "reason" in safety ? safety.reason : "CLASSIFIER_FAILURE",
        },
        isCrisis: safety.classification ? isCrisisLevel(safety.classification.level) : false,
        controlledResponse: "reason" in safety && safety.reason === "HIGH"
          ? CONTROLLED_HIGH_RESPONSE
          : "reason" in safety && safety.reason === "IMMINENT"
            ? CONTROLLED_IMMINENT_RESPONSE
            : null,
        reflection: null,
  });
  }

  const level = safety.classification.level;

  try {
    const generated = await generateReflection({
      emotions: body.emotions,
      intensity: body.intensity,
      need: body.need,
      userNote: body.userNote,
      history: body.history ?? [],
    });

    if (!generated.ok) {
      return NextResponse.json({
        success: false,
        error: { code: "AI_UNAVAILABLE", message: "Refleksi sedang tidak tersedia. Coba lagi nanti." },
        safety: { level, status: "ALLOWED" },
      }, { status: 503 });
    }

    const resultText = generated.text;
    if (!resultText) {
      return NextResponse.json({
        success: false,
        error: { code: "AI_EMPTY_RESPONSE", message: "Refleksi belum tersedia. Coba lagi." },
        safety: { level, status: "ALLOWED" },
      }, { status: 502 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(resultText);
    } catch {
      return NextResponse.json({
        success: false,
        error: { code: "AI_INVALID_RESPONSE", message: "Refleksi belum tersedia. Coba lagi." },
        safety: { level, status: "ALLOWED" },
      }, { status: 502 });
    }

    const validated = reflectionOutputSchema.safeParse(parsed);
    if (!validated.success) {
      return NextResponse.json({
        success: false,
        error: { code: "AI_INVALID_RESPONSE", message: "Refleksi belum tersedia. Coba lagi." },
        safety: { level, status: "ALLOWED" },
      }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      safety: { level, status: "ALLOWED" },
      isCrisis: false,
      ...validated.data,
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: { code: "AI_PROVIDER_ERROR", message: "Refleksi sedang tidak tersedia. Coba lagi nanti." },
      safety: { level, status: "ALLOWED" },
    }, { status: 502 });
  }
}
