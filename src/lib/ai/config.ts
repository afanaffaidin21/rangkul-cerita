export const AI_CONFIG = {
  model: "gemini-3.6-flash",
  temperature: 0.7,
  responseMimeType: "application/json" as const,
  userAgent: "aistudio-build",
} as const;

export function getGeminiApiKey(): string | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") return null;
  return apiKey;
}
