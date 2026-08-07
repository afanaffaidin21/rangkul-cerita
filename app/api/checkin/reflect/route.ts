import { NextResponse } from "next/server";
import { AppError, apiFailure } from "../../../../src/lib/errors";
import { checkinReflectionSchema, parseJson, validationError } from "../../../../src/lib/validation/public-boundaries";
import { generateReflection } from "../../../../src/lib/ai/provider";
import { reflectionOutputSchema } from "../../../../src/lib/ai/schemas";
import { enforceRateLimit } from "../../../../src/lib/rate-limit/limiter";
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

  // Rate limiting protects the paid generative-AI path only. It runs AFTER
  // the Safety Gate so deterministic HIGH/IMMINENT escalation never depends
  // on rate-limit store or provider availability.
  const limited = await enforceRateLimit(request, "reflect");
  if (limited) return limited;

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
      return apiFailure(new AppError({
        code: "AI_UNAVAILABLE",
        message: "Refleksi sedang tidak tersedia. Coba lagi nanti.",
        status: 503,
      }), { safety: { level, status: "ALLOWED" } });
    }

    const resultText = generated.text;
    if (!resultText) {
      return apiFailure(new AppError({
        code: "AI_EMPTY_RESPONSE",
        message: "Refleksi belum tersedia. Coba lagi.",
        status: 502,
      }), { safety: { level, status: "ALLOWED" } });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(resultText);
    } catch {
      return apiFailure(new AppError({
        code: "AI_INVALID_RESPONSE",
        message: "Refleksi belum tersedia. Coba lagi.",
        status: 502,
      }), { safety: { level, status: "ALLOWED" } });
    }

    const validated = reflectionOutputSchema.safeParse(parsed);
    if (!validated.success) {
      return apiFailure(new AppError({
        code: "AI_INVALID_RESPONSE",
        message: "Refleksi belum tersedia. Coba lagi.",
        status: 502,
      }), { safety: { level, status: "ALLOWED" } });
    }

    return NextResponse.json({
      success: true,
      safety: { level, status: "ALLOWED" },
      isCrisis: false,
      ...validated.data,
    });

  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError({
      code: "AI_PROVIDER_ERROR",
      message: "Refleksi sedang tidak tersedia. Coba lagi nanti.",
      status: 502,
      cause: error,
    });
    return apiFailure(appError, { safety: { level, status: "ALLOWED" } });
  }
}
