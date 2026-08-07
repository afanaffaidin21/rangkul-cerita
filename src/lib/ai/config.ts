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

const DEFAULT_AI_PROVIDER_TIMEOUT_MS = 30_000;

/**
 * Bounded provider-call duration. A safe default plus explicit production
 * tuning; an invalid configured value fails loudly rather than silently
 * hanging provider calls.
 */
export function getAiProviderTimeoutMs(env: NodeJS.ProcessEnv = process.env): number {
  const raw = getRuntimeEnv(env).AI_PROVIDER_TIMEOUT_MS;
  if (raw === undefined || raw === "") return DEFAULT_AI_PROVIDER_TIMEOUT_MS;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1000 || parsed > 120_000) {
    throw new Error("AI_PROVIDER_TIMEOUT_MS must be an integer between 1000 and 120000");
  }
  return parsed;
}
