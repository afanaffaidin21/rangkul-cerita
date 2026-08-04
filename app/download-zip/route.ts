import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const zipPath = path.join(process.cwd(), "public", "rangkul-cerita.zip");
  if (!fs.existsSync(zipPath)) {
    return NextResponse.json({ error: "File zip tidak ditemukan" }, { status: 404 });
  }

  const fileStream = fs.readFileSync(zipPath);
  return new NextResponse(fileStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="rangkul-cerita.zip"',
    },
  });
}
