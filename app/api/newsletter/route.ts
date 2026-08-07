import { NextResponse } from "next/server";
import { AppError, apiFailure } from "../../../src/lib/errors";
import { subscribeToNewsletter } from "../../../src/features/newsletter/services/subscribe";
import { newsletterSchema, parseJson, validationError } from "../../../src/lib/validation/public-boundaries";
import { enforceRateLimit } from "../../../src/lib/rate-limit/limiter";

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, newsletterSchema);
    if (!body) return validationError();

    const limited = await enforceRateLimit(request, "newsletter");
    if (limited) return limited;

    const result = await subscribeToNewsletter(body.email);
    return NextResponse.json({
      success: true,
      alreadySubscribed: !result.created,
      message: result.created
        ? "Terima kasih telah mendaftar Kabar Rangkul Cerita!"
        : "Email ini sudah terdaftar di Kabar Rangkul Cerita.",
    });
  } catch (error) {
    return apiFailure(new AppError({
      code: "PERSISTENCE_FAILED",
      message: "Pendaftaran newsletter belum dapat diproses",
      status: 500,
      cause: error,
    }));
  }
}
