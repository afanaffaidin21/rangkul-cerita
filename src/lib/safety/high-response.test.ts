import { describe, expect, it } from "vitest";
import { CONTROLLED_HIGH_RESPONSE, CONTROLLED_IMMINENT_RESPONSE } from "./messages";
import { isControlledHighState, isControlledImminentState } from "./ui-state";
import { SAFETY_RISK_LEVELS } from "./risk-levels";

describe("controlled HIGH response", () => {
  it("contains deterministic non-diagnostic support content", () => {
    expect(CONTROLLED_HIGH_RESPONSE.message).not.toContain("HIGH RISK");
    expect(CONTROLLED_HIGH_RESPONSE.message).not.toContain("suicidal");
    expect(CONTROLLED_HIGH_RESPONSE.primaryContact.id).toBe("healing-119");
    expect(CONTROLLED_HIGH_RESPONSE.primaryContact.website).toBe("https://www.healing119.id/");
    expect(CONTROLLED_HIGH_RESPONSE.trustedPersonAction).toBeTruthy();
  });

  it("uses an explicit HIGH state instead of an empty reflection state", () => {
    expect(isControlledHighState(SAFETY_RISK_LEVELS.HIGH)).toBe(true);
    expect(isControlledHighState(SAFETY_RISK_LEVELS.LOW)).toBe(false);
    expect(isControlledHighState(SAFETY_RISK_LEVELS.IMMINENT)).toBe(false);
  });

  it("defines a distinct deterministic IMMINENT emergency response", () => {
    expect(CONTROLLED_IMMINENT_RESPONSE).not.toBe(CONTROLLED_HIGH_RESPONSE);
    expect(CONTROLLED_IMMINENT_RESPONSE.primaryContact.id).toBe("psc-119");
    expect(CONTROLLED_IMMINENT_RESPONSE.secondaryContact.id).toBe("emergency-112");
    expect(CONTROLLED_IMMINENT_RESPONSE.secondaryContact.city).toBe("Wilayah Cakupan 112");
    expect(CONTROLLED_IMMINENT_RESPONSE.supportContact.id).toBe("healing-119");
    expect(CONTROLLED_IMMINENT_RESPONSE.message).not.toContain("HIGH RISK");
    expect(CONTROLLED_IMMINENT_RESPONSE.message).not.toContain("suicidal");
  });

  it("keeps HIGH and IMMINENT UI states distinct", () => {
    expect(isControlledImminentState(SAFETY_RISK_LEVELS.IMMINENT)).toBe(true);
    expect(isControlledImminentState(SAFETY_RISK_LEVELS.HIGH)).toBe(false);
    expect(isControlledHighState(SAFETY_RISK_LEVELS.IMMINENT)).toBe(false);
  });
});
