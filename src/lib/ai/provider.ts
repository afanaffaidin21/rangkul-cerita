import { GoogleGenAI } from "@google/genai";
import { AI_CONFIG, getGeminiApiKey } from "./config";

export type ReflectionGenerationInput = {
  emotions: string[];
  intensity: number;
  need: string;
  userNote: string;
  history: Array<{ sender: "user" | "ai"; text: string }>;
};

export type ReflectionGenerationResult =
  | { ok: true; text: string }
  | { ok: false; reason: "UNAVAILABLE" };

const SYSTEM_INSTRUCTION = `
Kamu adalah pendamping refleksi emosi hangat dari "Rangkul Cerita" untuk anak muda Indonesia (usia 16-21 tahun).
Prinsip utama:
1. Bahasanya natural, empati, hangat, tidak menggurui, tidak klinis, dan tidak menghakimi.
2. JANGAN PERNAH memberikan diagnosis medis, psikologis, atau saran obat.
3. JANGAN memberikan janji pasti seperti "pasti sembuh" atau "semua akan baik-baik saja".
4. Tanyakan HANYA SATU pertanyaan reflektif sederhana yang membantu pengguna memahami emosi, pemicu, atau kebutuhannya.
5. Berikan 3 rekomendasi langkah kecil yang sangat praktis dan realistis.
6. Buatkan ringkasan refleksi yang terstruktur dalam format JSON.
`;

function buildPrompt(input: ReflectionGenerationInput): string {
  return `
Data Check-in Pengguna:
- Emosi yang dipilih: ${input.emotions.join(", ")}
- Skala Intensitas: ${input.intensity} dari 5
- Kebutuhan saat ini: ${input.need || "Belum tahu"}
- Catatan pengguna: "${input.userNote || "Tidak ada catatan tambahan"}"
- Riwayat percakapan sebelumnya: ${JSON.stringify(input.history)}

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
}

export async function generateReflection(input: ReflectionGenerationInput): Promise<ReflectionGenerationResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return { ok: false, reason: "UNAVAILABLE" };

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { "User-Agent": AI_CONFIG.userAgent },
      },
    });
    const response = await ai.models.generateContent({
      model: AI_CONFIG.model,
      contents: buildPrompt(input),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: AI_CONFIG.responseMimeType,
        temperature: AI_CONFIG.temperature,
      },
    });
    return { ok: true, text: response.text?.trim() ?? "" };
  } catch {
    throw new Error("AI_PROVIDER_ERROR");
  }
}
