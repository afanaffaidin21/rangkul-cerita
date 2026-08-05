import { describe, expect, it } from "vitest";
import { MoodCheckinResult } from "../../types";
import { getCheckinViewState, getSafetyLevel, replaceCheckinResult } from "./checkin-state";
import { SAFETY_RISK_LEVELS } from "./risk-levels";

function result(level: "LOW" | "ELEVATED" | "HIGH" | "IMMINENT"): MoodCheckinResult {
  return {
    isCrisis: level === "HIGH" || level === "IMMINENT",
    safety: { level, status: "TEST" },
    controlledResponse: null,
    reflection: level === "LOW" || level === "ELEVATED" ? "Refleksi" : null,
    summary: { mainTopic: "Test", emotions: [], userNeed: "Test", nextStep: "Test" },
    recommendedSteps: [],
  };
}

describe("check-in safety state integration", () => {
  it.each([
    ["LOW", "LOW_RESULT"],
    ["ELEVATED", "ELEVATED_RESULT"],
    ["HIGH", "HIGH_CONTROLLED"],
    ["IMMINENT", "IMMINENT_CONTROLLED"],
  ] as const)("maps %s to an explicit view state", (level, state) => {
    expect(getCheckinViewState(result(level))).toBe(state);
    expect(getSafetyLevel(result(level))).toBe(SAFETY_RISK_LEVELS[level]);
  });

  it("keeps IDLE and malformed safety responses explicit", () => {
    expect(getCheckinViewState(null)).toBe("IDLE");
    expect(getCheckinViewState({ ...result("LOW"), safety: undefined })).toBe("ERROR");
  });

  it.each([
    ["LOW", "HIGH", "HIGH_CONTROLLED"],
    ["HIGH", "LOW", "LOW_RESULT"],
    ["LOW", "IMMINENT", "IMMINENT_CONTROLLED"],
    ["IMMINENT", "LOW", "LOW_RESULT"],
    ["HIGH", "HIGH", "HIGH_CONTROLLED"],
    ["IMMINENT", "IMMINENT", "IMMINENT_CONTROLLED"],
  ] as const)("replaces %s with the trusted %s result", (current, next, expectedState) => {
    const nextResult = result(next);
    expect(getCheckinViewState(replaceCheckinResult(result(current), nextResult))).toBe(expectedState);
  });

  it("does not use modal visibility or isCrisis as the safety source", () => {
    const low = result("LOW");
    low.isCrisis = true;
    expect(getCheckinViewState(low)).toBe("LOW_RESULT");
  });
});
