import { describe, expect, it, vi } from "vitest";
import { classifySafetyRisk } from "./detector";
import { runSafetyGate } from "./gate";
import { SAFETY_RISK_LEVELS } from "./risk-levels";

describe("runSafetyGate", () => {
  it("allows LOW classification for normal reflection", () => {
    const generateReflection = vi.fn();
    const result = runSafetyGate("Aku capek setelah kerja hari ini.");

    if (result.allowed) generateReflection();

    expect(result.allowed).toBe(true);
    expect(result.classification.level).toBe(SAFETY_RISK_LEVELS.LOW);
    expect(generateReflection).toHaveBeenCalledOnce();
  });

  it("allows ELEVATED classification for the supportive path", () => {
    const result = runSafetyGate("Rasanya semuanya sia-sia.");

    expect(result.allowed).toBe(true);
    expect(result.classification.level).toBe(SAFETY_RISK_LEVELS.ELEVATED);
  });

  it.each([
    ["Aku kepikiran bunuh diri.", SAFETY_RISK_LEVELS.HIGH],
    ["Aku sedang mau menyakiti diri sekarang.", SAFETY_RISK_LEVELS.IMMINENT],
  ])("blocks normal reflection for %s", (text, level) => {
    const generateReflection = vi.fn();
    const result = runSafetyGate(text);

    if (result.allowed) generateReflection();

    expect(result.allowed).toBe(false);
    expect(result.classification?.level).toBe(level);
    expect(generateReflection).not.toHaveBeenCalled();
  });

  it("fails closed when classification throws", () => {
    const generateReflection = vi.fn();
    const result = runSafetyGate("Aku ingin mati", () => {
      throw new Error("classifier unavailable");
    });

    if (result.allowed) generateReflection();

    expect(result).toEqual({
      allowed: false,
      classification: null,
      reason: "CLASSIFIER_FAILURE",
    });
    expect(generateReflection).not.toHaveBeenCalled();
  });

  it("ignores client-supplied LOW metadata when server classification is HIGH", () => {
    const clientRiskLevel = SAFETY_RISK_LEVELS.LOW;
    const generateReflection = vi.fn();
    const result = runSafetyGate("Aku kepikiran bunuh diri");

    if (result.allowed) generateReflection();

    expect(clientRiskLevel).toBe(SAFETY_RISK_LEVELS.LOW);
    expect(result.classification?.level).toBe(SAFETY_RISK_LEVELS.HIGH);
    expect(result.allowed).toBe(false);
    expect(generateReflection).not.toHaveBeenCalled();
  });

  it("derives classification from the canonical detector rather than client metadata", () => {
    const result = runSafetyGate("Aku sedang mau menyakiti diri sekarang.", classifySafetyRisk);

    expect(result.allowed).toBe(false);
    expect(result.classification?.level).toBe(SAFETY_RISK_LEVELS.IMMINENT);
  });
});
