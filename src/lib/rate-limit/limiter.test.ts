import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getRateLimitPolicies } from "./config";
import { enforceRateLimit, resetRateLimitStore } from "./limiter";

function request(headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
  });
}

describe("rate-limit configuration", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("provides conservative defaults for every public mutation endpoint", () => {
    expect(getRateLimitPolicies()).toEqual({
      reflect: { max: 5, windowSeconds: 60 },
      newsletter: { max: 5, windowSeconds: 3600 },
      partnership: { max: 3, windowSeconds: 3600 },
    });
  });

  it("applies environment overrides and rejects invalid values", () => {
    vi.stubEnv("RATE_LIMIT_REFLECT_MAX", "2");
    expect(getRateLimitPolicies().reflect).toEqual({ max: 2, windowSeconds: 60 });

    vi.stubEnv("RATE_LIMIT_REFLECT_MAX", "0");
    expect(() => getRateLimitPolicies()).toThrow("RATE_LIMIT_REFLECT_MAX");
  });
});

describe("in-memory rate limiter", () => {
  beforeEach(() => resetRateLimitStore());
  afterEach(() => vi.unstubAllEnvs());

  it("allows requests below the limit", async () => {
    vi.stubEnv("RATE_LIMIT_NEWSLETTER_MAX", "3");
    for (let i = 0; i < 3; i++) {
      expect(await enforceRateLimit(request(), "newsletter")).toBeNull();
    }
  });

  it("returns a controlled 429 with Retry-After once the limit is exceeded", async () => {
    vi.stubEnv("RATE_LIMIT_NEWSLETTER_MAX", "2");
    vi.stubEnv("RATE_LIMIT_NEWSLETTER_WINDOW_SECONDS", "60");

    await enforceRateLimit(request(), "newsletter");
    await enforceRateLimit(request(), "newsletter");
    const response = await enforceRateLimit(request(), "newsletter");

    expect(response).not.toBeNull();
    expect(response!.status).toBe(429);
    const retryAfter = Number(response!.headers.get("Retry-After"));
    expect(Number.isInteger(retryAfter)).toBe(true);
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(60);
    expect(await response!.json()).toEqual({
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Terlalu banyak permintaan. Coba lagi nanti.",
      },
    });
  });

  it("enforces endpoint policies independently", async () => {
    vi.stubEnv("RATE_LIMIT_REFLECT_MAX", "1");
    vi.stubEnv("RATE_LIMIT_NEWSLETTER_MAX", "5");

    expect(await enforceRateLimit(request(), "reflect")).toBeNull();
    expect((await enforceRateLimit(request(), "reflect"))!.status).toBe(429);
    expect(await enforceRateLimit(request(), "newsletter")).toBeNull();
  });

  it("groups requests by client key", async () => {
    vi.stubEnv("RATE_LIMIT_REFLECT_MAX", "1");

    expect(
      (await enforceRateLimit(request({ "x-forwarded-for": "1.2.3.4" }), "reflect")) === null,
    ).toBe(true);
    expect(
      (await enforceRateLimit(request({ "x-forwarded-for": "5.6.7.8" }), "reflect")) === null,
    ).toBe(true);
    expect(
      (await enforceRateLimit(request({ "x-forwarded-for": "1.2.3.4" }), "reflect"))!.status,
    ).toBe(429);
  });

  it("opens a new window after the window elapses", async () => {
    vi.useFakeTimers();
    try {
      vi.stubEnv("RATE_LIMIT_NEWSLETTER_MAX", "1");
      vi.stubEnv("RATE_LIMIT_NEWSLETTER_WINDOW_SECONDS", "60");

      expect(await enforceRateLimit(request(), "newsletter")).toBeNull();
      expect((await enforceRateLimit(request(), "newsletter"))!.status).toBe(429);

      vi.advanceTimersByTime(60_000);
      expect(await enforceRateLimit(request(), "newsletter")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("never reflects request content in the limit response", async () => {
    vi.stubEnv("RATE_LIMIT_REFLECT_MAX", "1");
    const secret = "rahasia pribadi yang sensitif";
    const limited = await enforceRateLimit(
      new Request("http://localhost/api/checkin/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userNote: secret }),
      }),
      "reflect",
    );
    expect(limited).toBeNull();
    const denied = await enforceRateLimit(
      new Request("http://localhost/api/checkin/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userNote: secret }),
      }),
      "reflect",
    );
    expect(denied!.status).toBe(429);
    expect(JSON.stringify(await denied!.json())).not.toContain(secret);
  });
});
