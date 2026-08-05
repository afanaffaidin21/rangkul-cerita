import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
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
  let body: any = {};
  let safety: ReturnType<typeof runSafetyGate>;
  try {
    body = await request.json();
    const { userNote } = body;
    safety = runSafetyGate(typeof userNote === "string" ? userNote : "");
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  }

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

  try {
    const { emotions, intensity, need, userNote, history = [] } = body;
    const ai = getGenAI();
    const level = safety.classification.level;

    if (!ai) {
      // Fallback warm response when API key is not configured yet
      const primaryEmotion = emotions && emotions.length > 0 ? emotions.join(", ") : "yang dirasakan";
      return NextResponse.json({
        success: true,
        safety: { level, status: "ALLOWED" },
        isCrisis: false,
        reflection: `Kedengarannya hari ini cukup melelahkan bagi kamu yang merasakan ${primaryEmotion} (intensitas ${intensity}/5). Sangat wajar jika kamu merasa butuh waktu untuk ${need || "memahami perasaan ini"}. Tidak perlu terburu-buru mencari semua jawaban hari ini.`,
        suggestedQuestion: "Apa satu hal kecil yang membuat perasaan ini terasa makin berat belakangan ini?",
        summary: {
          mainTopic: "Pencek-inan Emosi Harian",
          emotions: emotions || ["Cemas"],
          possibleTriggers: "Beban harian atau rasa lelah yang menumpuk",
          userNeed: need || "Waktu untuk menenangkan diri",
          nextStep: "Mencoba latihan grounding 2 menit atau menulis cerita pelan-pelan."
        },
        recommendedSteps: [
          "Ambil napas dalam 4 detik, tahan 4 detik, hembuskan 6 detik",
          "Tulis 2 kalimat singkat tentang apa yang kamu butuhkan sekarang",
          "Istirahat sejenak dari media sosial selama 30 menit"
        ]
      });
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

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);

    return NextResponse.json({
      success: true,
      safety: { level, status: "ALLOWED" },
      isCrisis: false,
      reflection: parsed.reflection || "Terima kasih sudah berbagi cerita dengan Rangkul Cerita hari ini.",
      suggestedQuestion: parsed.suggestedQuestion || "Bagaimana jika kita mulai dengan mengenali apa yang paling kamu butuhkan saat ini?",
      summary: parsed.summary || {
        mainTopic: "Refleksi Perasaan",
        emotions: emotions || [],
        userNeed: need || "Waktu untuk mendengar diri sendiri",
        nextStep: "Mengambil napas dan istirahat sejenak"
      },
      recommendedSteps: parsed.recommendedSteps || [
        "Latihan pernapasan 1 menit",
        "Menulis 1 hal yang bisa dikontrol saat ini",
        "Minum air hangat dan rehat sejenak"
      ]
    });

  } catch {
    console.error("Gemini reflection error");
    return NextResponse.json({
      isCrisis: false,
      reflection: "Kedengarannya hari ini ada banyak hal yang menumpuk di pikiranmu. Mengakui bahwa kamu sedang tidak baik-baik saja adalah langkah keberanian pertama yang sangat berarti.",
      suggestedQuestion: "Apa yang bisa membuat tubuh atau pikiranmu terasa 5% lebih tenang sekarang?",
      summary: {
        mainTopic: "Refleksi Emosi Harian",
        emotions: body.emotions || ["Perasaan bercampur"],
        userNeed: body.need || "Ruang tenang",
        nextStep: "Mencoba pernapasan atau grounding"
      },
      recommendedSteps: [
        "Cobalah latihan pernapasan tenang 1 menit",
        "Tuliskan 1 hal yang paling menyita energimu hari ini",
        "Simpan kontak bantuan jika sewaktu-waktu membutuhkan teman bicara"
      ]
    });
  }
}
