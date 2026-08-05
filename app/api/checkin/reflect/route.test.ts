import { describe, expect, it } from "vitest";
import { POST } from "./route";

function request(body: Record<string, unknown>) {
  return new Request("http://localhost/api/checkin/reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("journal reflection safety boundary", () => {
  it.each([
    "Aku kepikiran bunuh diri.",
    "Aku sedang mau menyakiti diri sekarang.",
  ])("returns a controlled response without reflection for %s", async (userNote) => {
    const response = await POST(request({ userNote, isCrisis: false, riskLevel: "LOW" }));
    const data = await response.json();

    expect(data.safety.level).toMatch(/HIGH|IMMINENT/);
    expect(data.reflection).toBeNull();
    expect(data.controlledResponse).not.toBeNull();
  });

  it("reports unavailable AI without fabricating a LOW reflection", async () => {
    const response = await POST(request({ userNote: "Aku capek setelah hari yang panjang." }));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.safety).toEqual({ level: "LOW", status: "ALLOWED" });
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("AI_UNAVAILABLE");
    expect(data.reflection).toBeUndefined();
  });
});
