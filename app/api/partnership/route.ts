import { NextResponse } from "next/server";
import { AppError, apiFailure } from "../../../src/lib/errors";
import { createPartnershipLead } from "../../../src/features/partnership/services/leads";
import { parseJson, partnershipSchema, validationError } from "../../../src/lib/validation/public-boundaries";
import { enforceRateLimit } from "../../../src/lib/rate-limit/limiter";

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, partnershipSchema);
    if (!body) return validationError();

    const limited = await enforceRateLimit(request, "partnership");
    if (limited) return limited;

    const result = await createPartnershipLead(body);
    if (!result.created) throw new Error("Partnership lead persistence was not confirmed");
    return NextResponse.json({
      success: true,
      message: `Terima kasih ${body.contactName}! Proposal & informasi kemitraan Rangkul Cerita untuk ${body.institutionName} telah kami catat.`,
    });
  } catch (error) {
    return apiFailure(new AppError({
      code: "PERSISTENCE_FAILED",
      message: "Formulir kemitraan belum dapat diproses",
      status: 500,
      cause: error,
    }));
  }
}
