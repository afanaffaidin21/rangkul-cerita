import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AI_CONFIG, getGeminiApiKey } from "./config";

const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContent };
  },
}));

import { generateReflection } from "./provider";

const input = {
  emotions: ["Cemas"],
  intensity: 3,
  need: "Cerita sebentar",
  userNote: "Catatan sintetis.",
  history: [],
};

describe("AI provider boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "synthetic-key";
    generateContent.mockResolvedValue({ text: "{\"reflection\":\"synthetic\"}" });
  });

  afterEach(() => vi.unstubAllEnvs());

  it("owns the current Gemini generation configuration", () => {
    expect(AI_CONFIG).toEqual({
      model: "gemini-3.6-flash",
      temperature: 0.7,
      responseMimeType: "application/json",
      userAgent: "aistudio-build",
    });
  });

  it("does not expose unavailable or placeholder keys", () => {
    process.env.GEMINI_API_KEY = "";
    expect(getGeminiApiKey()).toBeNull();
    process.env.GEMINI_API_KEY = "MY_GEMINI_API_KEY";
    expect(getGeminiApiKey()).toBeNull();
  });

  it("keeps provider SDK access behind one generation operation", async () => {
    const result = await generateReflection(input);

    expect(result).toEqual({ ok: true, text: "{\"reflection\":\"synthetic\"}" });
    expect(generateContent).toHaveBeenCalledTimes(1);
    expect(generateContent.mock.calls[0][0]).toMatchObject({
      model: AI_CONFIG.model,
      config: {
        responseMimeType: AI_CONFIG.responseMimeType,
        temperature: AI_CONFIG.temperature,
      },
    });
  });

  it("reports unavailable configuration without calling Gemini", async () => {
    process.env.GEMINI_API_KEY = "";

    await expect(generateReflection(input)).resolves.toEqual({ ok: false, reason: "UNAVAILABLE" });
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("does not leak provider errors", async () => {
    generateContent.mockRejectedValue(new Error("synthetic provider detail"));

    await expect(generateReflection(input)).rejects.toThrow("AI_PROVIDER_ERROR");
    await expect(generateReflection(input)).rejects.not.toThrow("synthetic provider detail");
  });

  it("bounds provider calls and reports timeout through the graceful path", async () => {
    vi.stubEnv("AI_PROVIDER_TIMEOUT_MS", "1000");
    generateContent.mockReturnValue(new Promise(() => {}));
    vi.useFakeTimers();
    try {
      const pending = generateReflection(input);
      vi.advanceTimersByTime(1000);
      await expect(pending).resolves.toEqual({ ok: false, reason: "TIMEOUT" });
    } finally {
      vi.useRealTimers();
    }
  });
});
