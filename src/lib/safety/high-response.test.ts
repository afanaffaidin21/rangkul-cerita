import { describe, expect, it } from "vitest";
import { CONTROLLED_HIGH_RESPONSE } from "./messages";
import { isControlledHighState } from "./ui-state";
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
});
