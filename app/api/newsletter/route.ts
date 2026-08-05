import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "../../../src/lib/database/newsletter";
import { newsletterSchema, parseJson, validationError } from "../../../src/lib/validation/public-boundaries";

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, newsletterSchema);
    if (!body) return validationError();

    const result = await subscribeToNewsletter(body.email);
    return NextResponse.json({
      success: true,
      alreadySubscribed: !result.created,
      message: result.created
        ? "Terima kasih telah mendaftar Teman Mingguan Rangkul Cerita!"
        : "Email ini sudah terdaftar di Teman Mingguan Rangkul Cerita.",
    });
  } catch {
    return NextResponse.json({ error: { code: "PERSISTENCE_ERROR", message: "Pendaftaran newsletter belum dapat diproses" } }, { status: 500 });
  }
}
