import { NextResponse } from "next/server";
import { AppError, apiFailure } from "../../../../src/lib/errors";
import { unsubscribeFromNewsletter } from "../../../../src/features/newsletter/services/unsubscribe";
import {
  newsletterUnsubscribeSchema,
  parseJson,
  validationError,
} from "../../../../src/lib/validation/public-boundaries";
import { enforceRateLimit } from "../../../../src/lib/rate-limit/limiter";

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, newsletterUnsubscribeSchema);
    if (!body) return validationError();

    const limited = await enforceRateLimit(request, "newsletterUnsubscribe");
    if (limited) return limited;

    await unsubscribeFromNewsletter(body.email);

    // Deliberately generic: the same response is returned whether the email is
    // subscribed, already unsubscribed, or unknown, so no subscriber
    // enumeration signal is exposed. The email is never echoed back.
    return NextResponse.json({
      success: true,
      message: "Permintaan berhenti berlangganan telah diproses.",
    });
  } catch (error) {
    return apiFailure(new AppError({
      code: "PERSISTENCE_FAILED",
      message: "Permintaan berhenti berlangganan belum dapat diproses",
      status: 500,
      cause: error,
    }));
  }
}
