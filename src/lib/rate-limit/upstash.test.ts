import { afterEach, describe, expect, it, vi } from "vitest";
import { getUpstashRedisConfig } from "./config";
import { createUpstashRateLimiter, UpstashRateLimiter } from "./upstash";

const RATE_LIMIT_KEY_PREFIX = "rangkul:ratelimit:";

function fakeScript(impl: () => Promise<[number, number]>) {
  return { eval: vi.fn(impl) };
}

describe("Upstash rate limiter config", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("requires both Upstash credentials in production", () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    expect(() => getUpstashRedisConfig()).toThrow("UPSTASH_REDIS_REST_URL");

    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "synthetic-token");
    expect(getUpstashRedisConfig()).toEqual({
      url: "https://example.upstash.io",
      token: "synthetic-token",
    });
  });

  it("throws a clear error when both credentials are missing", () => {
    expect(() => getUpstashRedisConfig()).toThrow("UPSTASH_REDIS_REST_TOKEN");
  });

  it("logs a sanitized category and rethrows when production config is missing", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => createUpstashRateLimiter()).toThrow("UPSTASH_REDIS_REST_URL");
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("[rate-limit] production misconfiguration"),
      );
    } finally {
      errorSpy.mockRestore();
    }
  });
});

describe("UpstashRateLimiter", () => {
  it("allows a request below the configured limit", async () => {
    const script = fakeScript(async () => [1, 60]);
    const limiter = new UpstashRateLimiter(script);

    await expect(
      limiter.check("reflect:203.0.113.7", { max: 5, windowSeconds: 60 }),
    ).resolves.toEqual({ ok: true });
    expect(script.eval).toHaveBeenCalledWith(
      [`${RATE_LIMIT_KEY_PREFIX}reflect:203.0.113.7`],
      ["60", "5"],
    );
  });

  it("blocks with Retry-After derived from the remaining window TTL", async () => {
    const script = fakeScript(async () => [0, 42]);
    const limiter = new UpstashRateLimiter(script);

    await expect(
      limiter.check("newsletter:203.0.113.7", { max: 5, windowSeconds: 3600 }),
    ).resolves.toEqual({ ok: false, retryAfterSeconds: 42 });
  });

  it("never reports a Retry-After below one second", async () => {
    const script = fakeScript(async () => [0, 0]);
    const limiter = new UpstashRateLimiter(script);

    await expect(
      limiter.check("partnership:203.0.113.7", { max: 3, windowSeconds: 3600 }),
    ).resolves.toEqual({ ok: false, retryAfterSeconds: 1 });
  });

  it("isolates policies and clients through namespaced keys", async () => {
    const script = fakeScript(async () => [1, 60]);
    const limiter = new UpstashRateLimiter(script);

    await limiter.check("reflect:203.0.113.7", { max: 5, windowSeconds: 60 });
    await limiter.check("newsletter:198.51.100.9", { max: 10, windowSeconds: 3600 });

    expect(script.eval).toHaveBeenNthCalledWith(
      1,
      [`${RATE_LIMIT_KEY_PREFIX}reflect:203.0.113.7`],
      ["60", "5"],
    );
    expect(script.eval).toHaveBeenNthCalledWith(
      2,
      [`${RATE_LIMIT_KEY_PREFIX}newsletter:198.51.100.9`],
      ["3600", "10"],
    );
  });

  it("stores only policy metadata and a privacy-safe key, never request content", async () => {
    const script = fakeScript(async () => [1, 60]);
    const limiter = new UpstashRateLimiter(script);

    // The key passed by the route layer contains policy + client identifier
    // only. The store receives that key plus numeric window/max metadata;
    // journal text, check-in notes, emails, and messages never reach Redis.
    await limiter.check("newsletter:203.0.113.7", { max: 5, windowSeconds: 3600 });

    const [keys, args] = script.eval.mock.calls[0] as [string[], string[]];
    expect(keys).toEqual([`${RATE_LIMIT_KEY_PREFIX}newsletter:203.0.113.7`]);
    expect(args).toEqual(["3600", "5"]);
    expect(JSON.stringify(script.eval.mock.calls)).not.toMatch(/email|jurnal|pesan|catatan/i);
  });

  it("reports an infrastructure failure with a sanitized log entry when Upstash is unreachable", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const script = fakeScript(async () => {
        throw new Error("connection refused");
      });
      const limiter = new UpstashRateLimiter(script);

      await expect(
        limiter.check("reflect:203.0.113.7", { max: 5, windowSeconds: 60 }),
      ).resolves.toEqual({ ok: false, infrastructureFailure: true });
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("[rate-limit] upstash check failed"),
      );
      const logged = String(errorSpy.mock.calls[0][0]);
      expect(logged).not.toMatch(/connection refused|token|secret/i);
    } finally {
      errorSpy.mockRestore();
    }
  });
});
