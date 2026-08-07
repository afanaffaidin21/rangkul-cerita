import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getRateLimitPolicies, RateLimitPolicyName } from "./config";
import { enforceRateLimit, getRateLimiter, InMemoryRateLimiter, resetRateLimiterForTests, resetRateLimitStore } from "./limiter";
import { UpstashRateLimiter } from "./upstash";

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
      newsletterUnsubscribe: { max: 10, windowSeconds: 3600 },
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

describe("rate limiter driver selection", () => {
  beforeEach(() => resetRateLimiterForTests());
  afterEach(() => vi.unstubAllEnvs());

  it("uses the in-memory driver in development and tests", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(getRateLimiter()).toBeInstanceOf(InMemoryRateLimiter);
    resetRateLimiterForTests();

    vi.stubEnv("NODE_ENV", "test");
    expect(getRateLimiter()).toBeInstanceOf(InMemoryRateLimiter);
  });

  it("uses the shared Upstash driver in production when configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "synthetic-token");

    expect(getRateLimiter()).toBeInstanceOf(UpstashRateLimiter);
  });

  it("fails loudly in production when Upstash configuration is missing", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(() => getRateLimiter()).toThrow("UPSTASH_REDIS_REST_URL");
  });
});

describe("rate limiter infrastructure failure policy", () => {
  const failingLimiter: RateLimiter = {
    check: async () => ({ ok: false, infrastructureFailure: true }),
  };

  it("fails closed on the AI reflection path with a controlled 503", async () => {
    const response = await enforceRateLimit(request(), "reflect", failingLimiter);

    expect(response).not.toBeNull();
    expect(response!.status).toBe(503);
    expect(await response!.json()).toEqual({
      success: false,
      error: {
        code: "AI_UNAVAILABLE",
        message: "Refleksi sedang tidak tersedia. Coba lagi nanti.",
      },
    });
  });

  it.each(["newsletter", "newsletterUnsubscribe", "partnership"] as const)(
    "fails open for %s so forms keep working",
    async (policyName) => {
      const response = await enforceRateLimit(request(), policyName, failingLimiter);
      expect(response).toBeNull();
    },
  );

  it("does not expose infrastructure details in any failure response", async () => {
    const response = await enforceRateLimit(request(), "reflect", failingLimiter);
    const body = JSON.stringify(await response!.json());
    expect(body).not.toMatch(/upstash|redis|infrastructure/i);
  });
});
