import { describe, expect, it } from "vitest";
import { getSupportVisibility } from "./support-visibility";

describe("human support visibility", () => {
  it.each([
    ["LOW", "available"],
    ["ELEVATED", "prominent"],
    ["HIGH", "primary"],
    ["IMMINENT", "emergency"],
  ] as const)("maps %s to %s support visibility", (level, visibility) => {
    expect(getSupportVisibility(level)).toBe(visibility);
  });

  it("keeps unknown states available without escalating them", () => {
    expect(getSupportVisibility(null)).toBe("available");
  });
});
