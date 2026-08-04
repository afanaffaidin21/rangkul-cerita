import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { institutionName, category, contactName, email, phone, message } = body;

    if (!institutionName || !contactName || !email) {
      return NextResponse.json({ error: "Mohon isi nama institusi, kontak, dan email" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Terima kasih ${contactName}! Proposal & informasi kemitraan Rangkul Cerita untuk ${institutionName} telah kami catat dan tim Partnership akan menghubungi kamu melalui email (${email}) dalam 1x24 jam kerja.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Gagal memproses formulir kemitraan" }, { status: 500 });
  }
}
