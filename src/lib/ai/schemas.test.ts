import { describe, expect, it } from "vitest";
import { reflectionOutputSchema } from "./schemas";

const validReflection = {
  reflection: "Kamu sedang menghadapi hari yang berat, dan wajar jika butuh jeda.",
  suggestedQuestion: "Apa yang paling kamu butuhkan sekarang?",
  summary: {
    mainTopic: "Beban harian",
    emotions: ["Cemas"],
    possibleTriggers: "Tugas yang menumpuk",
    userNeed: "Tenangkan diri",
    nextStep: "Berhenti sejenak dan atur napas.",
  },
  recommendedSteps: ["Atur napas selama satu menit.", "Minum air.", "Tulis satu hal yang bisa dikendalikan."],
};

describe("reflection output validation", () => {
  it("accepts a complete structured reflection", () => {
    expect(reflectionOutputSchema.safeParse(validReflection).success).toBe(true);
  });

  it.each([
    {},
    { ...validReflection, reflection: "" },
    { ...validReflection, summary: { ...validReflection.summary, nextStep: undefined } },
    { ...validReflection, recommendedSteps: ["Satu langkah"] },
    { ...validReflection, unexpected: "internal data" },
  ])("rejects incomplete or malformed output", (output) => {
    expect(reflectionOutputSchema.safeParse(output).success).toBe(false);
  });
});
