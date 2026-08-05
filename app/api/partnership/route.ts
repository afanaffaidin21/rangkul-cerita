import { NextResponse } from "next/server";
import { parseJson, partnershipSchema, validationError } from "../../../src/lib/validation/public-boundaries";

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, partnershipSchema);
    if (!body) return validationError();
    const { institutionName, category, contactName, email } = body;

    return NextResponse.json({
      success: true,
      message: `Terima kasih ${contactName}! Proposal & informasi kemitraan Rangkul Cerita untuk ${institutionName} telah kami catat dan tim Partnership akan menghubungi kamu melalui email (${email}) dalam 1x24 jam kerja.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Gagal memproses formulir kemitraan" }, { status: 500 });
  }
}
