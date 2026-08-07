import { Redis } from "@upstash/redis";
import { getUpstashRedisConfig, RateLimitPolicy } from "./config";
import type { RateLimiter, RateLimitResult } from "./limiter";

/**
 * Minimal surface of an Upstash Lua script client. Kept structural so unit
 * tests can substitute a fake without touching the real REST client.
 */
export type RateLimitScriptClient = {
  eval(keys: string[], args: string[]): Promise<[number, number]>;
};

/**
 * Atomic fixed-window counter. INCR starts a new window on first request and
 * sets the key TTL; blocked requests read the remaining TTL so `Retry-After`
 * matches the current window semantics of the in-memory driver.
 *
 * Keys hold only a namespaced policy/counter state. The script never receives
 * or returns request content (no journal, check-in, reflection, crisis,
 * email, or message text).
 */
const FIXED_WINDOW_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
local ttl = redis.call("TTL", KEYS[1])
if current > tonumber(ARGV[2]) then
  return { 0, ttl }
end
return { 1, ttl }
`;

const RATE_LIMIT_KEY_PREFIX = "rangkul:ratelimit:";

/**
 * Distributed fixed-window limiter backed by Upstash Redis over REST. Safe for
 * Vercel serverless: no persistent TCP connection pool, every check is a
 * single stateless HTTP request.
 *
 * On transient Upstash failure the check reports an infrastructure-failure
 * result with a sanitized log entry; `enforceRateLimit` decides endpoint
 * behavior (fail closed on the paid reflection path, fail open on forms).
 * The Safety Gate runs before the limiter, so HIGH/IMMINENT escalation is
 * never affected by limiter availability. Missing production configuration is
 * NOT a transient failure: it throws (fail loudly) instead of silently
 * falling back to per-instance limits.
 */
export class UpstashRateLimiter implements RateLimiter {
  constructor(private readonly script: RateLimitScriptClient) {}

  async check(key: string, policy: RateLimitPolicy): Promise<RateLimitResult> {
    try {
      const [allowed, ttlSeconds] = await this.script.eval(
        [`${RATE_LIMIT_KEY_PREFIX}${key}`],
        [String(policy.windowSeconds), String(policy.max)],
      );

      if (allowed === 1) return { ok: true };

      return { ok: false, retryAfterSeconds: Math.max(1, ttlSeconds) };
    } catch (error) {
      console.error(
        `[rate-limit] upstash check failed (${error instanceof Error ? error.name : "unknown"})`,
      );
      // Endpoint-specific handling (fail closed on reflection, fail open on
      // forms) happens in enforceRateLimit based on this infrastructure marker.
      return { ok: false, infrastructureFailure: true };
    }
  }
}

/** Builds the production driver from validated environment credentials. */
export function createUpstashRateLimiter(): RateLimiter {
  let config;
  try {
    config = getUpstashRedisConfig();
  } catch (error) {
    // Sanitized: the message references variable names only, never values.
    console.error(
      `[rate-limit] production misconfiguration: ${error instanceof Error ? error.message : "unknown"}`,
    );
    throw error;
  }

  const redis = new Redis({ url: config.url, token: config.token });
  const script = redis.createScript<[number, number]>(FIXED_WINDOW_SCRIPT);
  return new UpstashRateLimiter(script);
}
