import { describe, expect, it } from "vitest";
import { CHECKIN_STEPS, getNextCheckinStep, getPreviousCheckinStep } from "./progression";

describe("check-in progression", () => {
  it("keeps the four inputs in progressive order", () => {
    expect(CHECKIN_STEPS).toEqual(["feeling", "intensity", "need", "note"]);
  });

  it("moves forward and backward without passing the boundaries", () => {
    expect(getNextCheckinStep("feeling")).toBe("intensity");
    expect(getPreviousCheckinStep("intensity")).toBe("feeling");
    expect(getNextCheckinStep("note")).toBeNull();
    expect(getPreviousCheckinStep("feeling")).toBeNull();
  });
});
