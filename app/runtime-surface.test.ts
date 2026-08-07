import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appDir = join(process.cwd(), "app");

// Guards the confirmed-dead public surface removed in issue #41 so it cannot
// silently reappear in the runtime route tree.
describe("removed dead runtime surface", () => {
  it("does not expose /api/safety/classify", () => {
    expect(existsSync(join(appDir, "api", "safety", "classify"))).toBe(false);
  });

  it("does not expose /download-zip", () => {
    expect(existsSync(join(appDir, "download-zip"))).toBe(false);
  });
});
