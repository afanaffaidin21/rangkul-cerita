import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { checkinReflectionSchema, parseJson, validationError } from "../../../../src/lib/validation/public-boundaries";
import { reflectionOutputSchema } from "../../../../src/lib/ai/schemas";
import { isCrisisLevel, runSafetyGate } from "../../../../src/lib/safety/gate";
import {
  CONTROLLED_HIGH_RESPONSE,
  CONTROLLED_IMMINENT_RESPONSE,
} from "../../../../src/lib/safety/messages";

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function POST(request: Request) {
  const body = await parseJson(request, checkinReflectionSchema);
  if (!body) return validationError();

  const safety = runSafetyGate(body.userNote);

  if (!safety.allowed) {
    return NextResponse.json({
        success: true,
        safety: {
          level: safety.classification?.level ?? null,
          status: "reason" in safety ? safety.reason : "CLASSIFIER_FAILURE",
        },
        isCrisis: safety.classification ? isCrisisLevel(safety.classification.level) : false,
        controlledResponse: "reason" in safety && safety.reason === "HIGH"
          ? CONTROLLED_HIGH_RESPONSE
          : "reason" in safety && safety.reason === "IMMINENT"
            ? CONTROLLED_IMMINENT_RESPONSE
            : null,
        reflection: null,
  });
  }

  const level = safety.classification.level;

  try {
    const { emotions, intensity, need, userNote, history = [] } = body;
    const ai = getGenAI();

    if (!ai) {
      return NextResponse.json({
        success: false,
        error: { code: "AI_UNAVAILABLE", message: "Refleksi sedang tidak tersedia. Coba lagi nanti." },
        safety: { level, status: "ALLOWED" },
      }, { status: 503 });
    }

    const systemInstruction = `
Kamu adalah pendamping refleksi emosi hangat dari "Rangkul Cerita" untuk anak muda Indonesia (usia 16-21 tahun).
Prinsip utama:
1. Bahasanya natural, empati, hangat, tidak menggurui, tidak klinis, dan tidak menghakimi.
2. JANGAN PERNAH memberikan diagnosis medis, psikologis, atau saran obat.
3. JANGAN memberikan janji pasti seperti "pasti sembuh" atau "semua akan baik-baik saja".
4. Tanyakan HANYA SATU pertanyaan reflektif sederhana yang membantu pengguna memahami emosi, pemicu, atau kebutuhannya.
5. Berikan 3 rekomendasi langkah kecil yang sangat praktis dan realistis.
6. Buatkan ringkasan refleksi yang terstruktur dalam format JSON.
`;

    const prompt = `
Data Check-in Pengguna:
- Emosi yang dipilih: ${Array.isArray(emotions) ? emotions.join(", ") : emotions}
- Skala Intensitas: ${intensity} dari 5
- Kebutuhan saat ini: ${need || "Belum tahu"}
- Catatan pengguna: "${userNote || "Tidak ada catatan tambahan"}"
- Riwayat percakapan sebelumnya: ${JSON.stringify(history)}

Buatkan respon dengan format JSON persis seperti berikut:
{
  "reflection": "Respons reflektif hangat (2-3 kalimat)",
  "suggestedQuestion": "1 pertanyaan reflektif sederhana",
  "summary": {
    "mainTopic": "Topik utama",
    "emotions": ["emosi1", "emosi2"],
    "possibleTriggers": "Kemungkinan pemicu",
    "userNeed": "Kebutuhan utama",
    "nextStep": "Rekomendasi langkah kecil utama"
  },
  "recommendedSteps": [
    "Langkah kecil 1",
    "Langkah kecil 2",
    "Langkah kecil 3"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const resultText = response.text?.trim();
    if (!resultText) {
      return NextResponse.json({
        success: false,
        error: { code: "AI_EMPTY_RESPONSE", message: "Refleksi belum tersedia. Coba lagi." },
        safety: { level, status: "ALLOWED" },
      }, { status: 502 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(resultText);
    } catch {
      return NextResponse.json({
        success: false,
        error: { code: "AI_INVALID_RESPONSE", message: "Refleksi belum tersedia. Coba lagi." },
        safety: { level, status: "ALLOWED" },
      }, { status: 502 });
    }

    const validated = reflectionOutputSchema.safeParse(parsed);
    if (!validated.success) {
      return NextResponse.json({
        success: false,
        error: { code: "AI_INVALID_RESPONSE", message: "Refleksi belum tersedia. Coba lagi." },
        safety: { level, status: "ALLOWED" },
      }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      safety: { level, status: "ALLOWED" },
      isCrisis: false,
      ...validated.data,
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: { code: "AI_PROVIDER_ERROR", message: "Refleksi sedang tidak tersedia. Coba lagi nanti." },
      safety: { level, status: "ALLOWED" },
    }, { status: 502 });
  }
}
