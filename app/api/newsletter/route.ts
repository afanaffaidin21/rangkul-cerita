import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, consent } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Alamat email tidak valid" }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: "Mohon menyetujui persetujuan privasi" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Terima kasih telah mendaftar Teman Mingguan Rangkul Cerita! Pesan refleksi pertama akan segera dikirimkan ke email kamu."
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Gagal memproses pendaftaran newsletter" }, { status: 500 });
  }
}
