import { describe, expect, it } from "vitest";
import { classifySafetyRisk, tryClassifySafetyRisk } from "./detector";
import { SAFETY_RISK_LEVELS } from "./risk-levels";

describe("classifySafetyRisk", () => {
  it.each([
    "Aku capek setelah kerja hari ini.",
    "Aku lagi sedih dan ingin istirahat.",
    "Hari ini berat banget.",
  ])("classifies ordinary distress as LOW: %s", (text) => {
    expect(classifySafetyRisk(text).level).toBe(SAFETY_RISK_LEVELS.LOW);
  });

  it.each([
    "Rasanya semuanya sia-sia.",
    "Aku merasa benar-benar sendirian.",
    "Aku sudah tidak berdaya menghadapi ini.",
  ])("classifies hopelessness without explicit intent as ELEVATED: %s", (text) => {
    expect(classifySafetyRisk(text).level).toBe(SAFETY_RISK_LEVELS.ELEVATED);
  });

  it.each([
    "Aku kepikiran bunuh diri.",
    "Kayaknya lebih baik aku gak ada.",
    "Aku gak mau hidup lagi.",
  ])("classifies current self-directed safety signals as HIGH: %s", (text) => {
    const result = classifySafetyRisk(text);
    expect(result.level).toBe(SAFETY_RISK_LEVELS.HIGH);
    expect(result.context).toBe("SELF");
  });

  it("gives immediate danger precedence over a general high-risk signal", () => {
    const result = classifySafetyRisk("Aku sedang mau menyakiti diri sekarang.");

    expect(result.level).toBe(SAFETY_RISK_LEVELS.IMMINENT);
    expect(result.signals).toContain("IMMEDIACY_OR_PREPARATION");
  });

  it.each([
    "Aku tidak ingin bunuh diri.",
    "Aku gak mau hidup lagi, tapi bukan karena ingin mati.",
    "Aku nggak ingin menyakiti diri.",
  ])("does not treat negated language as current HIGH: %s", (text) => {
    const result = classifySafetyRisk(text);
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.HIGH);
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.IMMINENT);
    expect(result.signals).toContain("NEGATION");
  });

  it("distinguishes a third-person statement from the user's self-context", () => {
    const result = classifySafetyRisk("Temanku bilang dia ingin mati.");

    expect(result.context).toBe("THIRD_PERSON");
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.HIGH);
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.IMMINENT);
  });

  it("distinguishes quoted or referenced content from self-directed intent", () => {
    const result = classifySafetyRisk("Aku membaca kalimat 'aku ingin mati' di sebuah cerita.");

    expect(result.context).toBe("QUOTED");
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.HIGH);
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.IMMINENT);
  });

  it("does not classify historical ideation as IMMINENT without current evidence", () => {
    const result = classifySafetyRisk("Dulu aku pernah kepikiran bunuh diri.");

    expect(result.context).toBe("SELF");
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.IMMINENT);
    expect(result.signals).toContain("HISTORICAL");
  });

  it("uses conservative handling for strong signals with unknown context", () => {
    const result = classifySafetyRisk("Ingin bunuh diri");

    expect(result.context).toBe("UNKNOWN");
    expect(result.level).toBe(SAFETY_RISK_LEVELS.ELEVATED);
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.LOW);
  });

  it("keeps a third-person concern contextual without treating it as the user's HIGH state", () => {
    const result = classifySafetyRisk("Temanku bilang ingin mati, dan aku ingin membantunya.");

    expect(result.context).toBe("THIRD_PERSON");
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.HIGH);
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.IMMINENT);
  });

  it("does not let third-person content mask a self-directed clause", () => {
    const result = classifySafetyRisk("Temanku bilang ingin mati, tapi aku juga merasa aku gak mau hidup lagi.");

    expect(result.context).toBe("SELF");
    expect(result.level).toBe(SAFETY_RISK_LEVELS.HIGH);
  });

  it("does not let quoted content mask current self-directed evidence", () => {
    const result = classifySafetyRisk("Aku membaca kalimat 'aku ingin mati', tapi sekarang aku sendiri merasa begitu.");

    expect(result.context).toBe("SELF");
    expect(result.level).toBe(SAFETY_RISK_LEVELS.HIGH);
  });

  it("preserves concern for historical self-directed language without IMMINENT escalation", () => {
    const result = classifySafetyRisk("Dulu aku pernah kepikiran bunuh diri dan sekarang merasa putus asa.");

    expect(result.context).toBe("SELF");
    expect(result.level).toBe(SAFETY_RISK_LEVELS.ELEVATED);
    expect(result.level).not.toBe(SAFETY_RISK_LEVELS.IMMINENT);
  });

  it("does not treat a current death wish as negation because it uses informal wording", () => {
    const result = classifySafetyRisk("Aku gak mau hidup lagi.");

    expect(result.level).toBe(SAFETY_RISK_LEVELS.HIGH);
    expect(result.signals).not.toContain("NEGATION");
  });

  it("keeps immediate self-directed evidence stronger than historical context", () => {
    const result = classifySafetyRisk("Dulu aku pernah berpikir begitu, tapi sekarang sedang mau menyakiti diri.");

    expect(result.context).toBe("SELF");
    expect(result.level).toBe(SAFETY_RISK_LEVELS.IMMINENT);
  });

  it("returns a safe failure result instead of defaulting invalid input to LOW", () => {
    expect(tryClassifySafetyRisk(null)).toBeNull();
    expect(tryClassifySafetyRisk({ text: "Aku ingin mati" })).toBeNull();
    expect(() => classifySafetyRisk(null as unknown as string)).toThrow(TypeError);
  });
});
