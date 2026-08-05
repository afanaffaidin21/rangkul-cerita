import { describe, expect, it, vi } from "vitest";
import { POST } from "../../../app/api/checkin/reflect/route";
import { getCheckinViewState } from "./checkin-state";
import { VERIFIED_HELPLINES } from "./contacts";
import { runSafetyGate } from "./gate";
import { CONTROLLED_HIGH_RESPONSE, CONTROLLED_IMMINENT_RESPONSE } from "./messages";
import { SAFETY_RISK_LEVELS } from "./risk-levels";

function request(body: Record<string, unknown>) {
  return new Request("http://localhost/api/checkin/reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("P0 safety classification and routing regression coverage", () => {
  it.each([
    ["LOW", "Aku cemas menghadapi tugas besok.", true],
    ["ELEVATED", "Rasanya semuanya sia-sia.", true],
    ["HIGH", "Aku kepikiran bunuh diri.", false],
    ["IMMINENT", "Aku sedang mau menyakiti diri sekarang.", false],
  ] as const)("routes %s through the Safety Gate", (level, text, allowed) => {
    const generateReflection = vi.fn();
    const result = runSafetyGate(text);

    if (result.allowed) generateReflection();

    expect(result.classification?.level).toBe(level);
    expect(result.allowed).toBe(allowed);
    expect(generateReflection).toHaveBeenCalledTimes(allowed ? 1 : 0);
  });

  it("fails closed when the classifier fails", () => {
    const result = runSafetyGate("teks sintetis", () => {
      throw new Error("synthetic classifier failure");
    });

    expect(result).toEqual({
      allowed: false,
      classification: null,
      reason: "CLASSIFIER_FAILURE",
    });
  });

  it("keeps context handling from weakening self-directed risk", () => {
    expect(runSafetyGate("Temanku bilang ingin mati.").allowed).toBe(true);
    expect(runSafetyGate("Aku membaca 'aku ingin mati' di cerita.").allowed).toBe(true);
    expect(runSafetyGate("Dulu aku pernah kepikiran bunuh diri.").allowed).toBe(true);
    expect(runSafetyGate("Temanku bilang ingin mati, tapi aku juga gak mau hidup lagi.").allowed).toBe(false);
    expect(runSafetyGate("Aku gak ingin menyakiti diri.").classification?.level).not.toBe(SAFETY_RISK_LEVELS.HIGH);
  });

  it("does not allow client risk metadata to bypass server classification", async () => {
    const response = await POST(request({
      userNote: "Aku sedang mau menyakiti diri sekarang.",
      isCrisis: false,
      riskLevel: "LOW",
    }));
    const data = await response.json();

    expect(data.safety.level).toBe(SAFETY_RISK_LEVELS.IMMINENT);
    expect(data.reflection).toBeNull();
  });

  it.each([
    ["HIGH", CONTROLLED_HIGH_RESPONSE],
    ["IMMINENT", CONTROLLED_IMMINENT_RESPONSE],
  ] as const)("returns the controlled response for %s Journal input", async (level, controlledResponse) => {
    const userNote = level === "HIGH" ? "Aku gak mau hidup lagi." : "Aku akan menyakiti diri sebentar lagi.";
    const response = await POST(request({ userNote }));
    const data = await response.json();

    expect(data.controlledResponse).toEqual(controlledResponse);
    expect(data.reflection).toBeNull();
  });

  it("maps trusted Check-in results to safe view states", () => {
    expect(getCheckinViewState({ safety: { level: "LOW", status: "ALLOWED" } } as never)).toBe("LOW_RESULT");
    expect(getCheckinViewState({ safety: { level: "ELEVATED", status: "ALLOWED" } } as never)).toBe("ELEVATED_RESULT");
    expect(getCheckinViewState({ safety: { level: "HIGH", status: "HIGH" } } as never)).toBe("HIGH_CONTROLLED");
    expect(getCheckinViewState({ safety: { level: "IMMINENT", status: "IMMINENT" } } as never)).toBe("IMMINENT_CONTROLLED");
  });

  it("uses canonical crisis contacts in controlled responses", () => {
    expect(CONTROLLED_HIGH_RESPONSE.primaryContact).toBe(VERIFIED_HELPLINES[0]);
    expect(CONTROLLED_IMMINENT_RESPONSE.primaryContact).toBe(VERIFIED_HELPLINES[1]);
    expect(CONTROLLED_IMMINENT_RESPONSE.secondaryContact).toBe(VERIFIED_HELPLINES[2]);
  });
});
