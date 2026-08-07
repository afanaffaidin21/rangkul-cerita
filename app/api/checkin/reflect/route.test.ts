import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { resetRateLimitStore } from "../../../../src/lib/rate-limit/limiter";
import * as rateLimitModule from "../../../../src/lib/rate-limit/limiter";

const { generateReflection } = vi.hoisted(() => ({
  generateReflection: vi.fn(),
}));

vi.mock("../../../../src/lib/ai/provider", () => ({ generateReflection }));

function request(body: Record<string, unknown>) {
  return new Request("http://localhost/api/checkin/reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("journal reflection safety boundary", () => {
  beforeEach(() => {
    resetRateLimitStore();
    generateReflection.mockReset();
    generateReflection.mockResolvedValue({ ok: false, reason: "UNAVAILABLE" });
  });

  it.each([
    "Aku kepikiran bunuh diri.",
    "Aku sedang mau menyakiti diri sekarang.",
  ])("returns a controlled response without reflection for %s", async (userNote) => {
    const response = await POST(request({ userNote, isCrisis: false, riskLevel: "LOW" }));
    const data = await response.json();

    expect(data.safety.level).toMatch(/HIGH|IMMINENT/);
    expect(data.reflection).toBeNull();
    expect(data.controlledResponse).not.toBeNull();
    expect(generateReflection).not.toHaveBeenCalled();
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

  it("rate-limits the AI path with a controlled 429", async () => {
    for (let i = 0; i < 5; i++) {
      const response = await POST(request({ userNote: "Aku capek setelah hari yang panjang." }));
      expect(response.status).toBe(503);
    }

    const limited = await POST(request({ userNote: "Aku capek setelah hari yang panjang." }));
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(await limited.json()).toMatchObject({
      success: false,
      error: { code: "RATE_LIMITED" },
    });
    expect(generateReflection).toHaveBeenCalledTimes(5);
  });

  it("keeps crisis escalation available even when the AI path is rate-limited", async () => {
    for (let i = 0; i < 6; i++) {
      await POST(request({ userNote: "Aku capek setelah hari yang panjang." }));
    }
    const callsBeforeCrisis = generateReflection.mock.calls.length;

    const crisis = await POST(request({ userNote: "Aku kepikiran bunuh diri." }));
    const data = await crisis.json();

    expect(crisis.status).toBe(200);
    expect(data.safety.level).toMatch(/HIGH|IMMINENT/);
    expect(data.reflection).toBeNull();
    expect(data.controlledResponse).not.toBeNull();
    // The crisis request must not reach the provider even while rate-limited.
    expect(generateReflection.mock.calls.length).toBe(callsBeforeCrisis);
  });

  it("keeps HIGH escalation deterministic when the rate-limit backend is unavailable", async () => {
    const enforceSpy = vi
      .spyOn(rateLimitModule, "enforceRateLimit")
      .mockRejectedValue(new Error("rate-limit store unavailable"));
    enforceSpy.mockClear();
    try {
      const response = await POST(request({ userNote: "Aku kepikiran bunuh diri." }));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.safety.level).toMatch(/HIGH|IMMINENT/);
      expect(data.reflection).toBeNull();
      expect(data.controlledResponse).not.toBeNull();
      // The Safety Gate returns before the limiter is ever consulted.
      expect(enforceSpy).not.toHaveBeenCalled();
      expect(generateReflection).not.toHaveBeenCalled();
    } finally {
      enforceSpy.mockRestore();
    }
  });
});
