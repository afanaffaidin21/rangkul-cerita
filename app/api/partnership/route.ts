import { NextResponse } from "next/server";
import { createPartnershipLead } from "../../../src/lib/database/partnership";
import { parseJson, partnershipSchema, validationError } from "../../../src/lib/validation/public-boundaries";

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, partnershipSchema);
    if (!body) return validationError();

    const result = await createPartnershipLead(body);
    if (!result.created) throw new Error("Partnership lead persistence was not confirmed");
    return NextResponse.json({
      success: true,
      message: `Terima kasih ${body.contactName}! Proposal & informasi kemitraan Rangkul Cerita untuk ${body.institutionName} telah kami catat.`,
    });
  } catch {
    return NextResponse.json({ error: { code: "PERSISTENCE_ERROR", message: "Formulir kemitraan belum dapat diproses" } }, { status: 500 });
  }
}
