export const AI_CONFIG = {
  model: "gemini-3.6-flash",
  temperature: 0.7,
  responseMimeType: "application/json" as const,
  userAgent: "aistudio-build",
} as const;

import { getRuntimeEnv } from "../config/env";

export function getGeminiApiKey(env: NodeJS.ProcessEnv = process.env): string | null {
  const apiKey = getRuntimeEnv(env).GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") return null;
  return apiKey;
}
