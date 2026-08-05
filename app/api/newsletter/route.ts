import { NextResponse } from "next/server";
import { newsletterSchema, parseJson, validationError } from "../../../src/lib/validation/public-boundaries";

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, newsletterSchema);
    if (!body) return validationError();
    const { email } = body;

    return NextResponse.json({
      success: true,
      message: "Terima kasih telah mendaftar Teman Mingguan Rangkul Cerita! Pesan refleksi pertama akan segera dikirimkan ke email kamu."
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Gagal memproses pendaftaran newsletter" }, { status: 500 });
  }
}
