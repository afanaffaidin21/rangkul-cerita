import { z } from "zod";

const boundedText = (max: number) => z.string().trim().min(1).max(max);

export const checkinReflectionSchema = z.object({
  emotions: z.array(z.enum(["Cemas", "Sedih", "Kesepian", "Lelah", "Marah", "Bingung", "Mati rasa", "Lumayan baik"])).min(1).max(8).default([]),
  intensity: z.number().int().min(1).max(5).default(3),
  need: z.enum(["Cerita sebentar", "Tenangkan diri", "Pahami penyebabnya", "Cari bantuan", "Aku belum tahu"]).default("Aku belum tahu"),
  userNote: z.string().trim().max(2000).default(""),
  history: z.array(z.object({
    sender: z.enum(["user", "ai"]),
    text: z.string().max(2000),
  }).strict()).max(20).default([]),
  isCrisis: z.boolean().optional(),
  riskLevel: z.enum(["LOW", "ELEVATED", "HIGH", "IMMINENT"]).optional(),
}).strict();

export const safetyClassificationSchema = z.object({
  text: boundedText(4000),
}).strict();

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  consent: z.literal(true),
}).strict();

export const partnershipSchema = z.object({
  institutionName: boundedText(160),
  category: z.enum(["Sekolah / SMA / SMK", "Universitas / BEM / Fakultas", "Komunitas Pemuda / OSIS", "Yayasan / NGO", "Lainnya"]),
  contactName: boundedText(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).regex(/^[0-9+().\s-]*$/),
  message: z.string().trim().max(2000),
}).strict();

export type CheckinReflectionInput = z.infer<typeof checkinReflectionSchema>;

export function validationError() {
  return Response.json({ error: { code: "VALIDATION_ERROR", message: "Permintaan tidak valid" } }, { status: 400 });
}

export async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  try {
    const result = schema.safeParse(await request.json());
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
