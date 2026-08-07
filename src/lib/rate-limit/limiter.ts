import { NextResponse } from "next/server";
import { getRateLimitPolicies, RateLimitPolicy, RateLimitPolicyName } from "./config";

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

/**
 * Driver boundary for rate-limit storage.
 *
 * The production runtime is not finalized yet (owned by issue #42). The
 * in-memory driver is correct for a single long-lived instance only; it does
 * NOT enforce limits across multiple instances/serverless workers. When a
 * shared store is selected for production, implement this interface behind
 * the same `enforceRateLimit` entry point without rewriting route handlers.
 */
export interface RateLimiter {
  check(key: string, policy: RateLimitPolicy): Promise<RateLimitResult>;
}

type WindowBucket = {
  windowStartMs: number;
  count: number;
};

export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, WindowBucket>();

  async check(key: string, policy: RateLimitPolicy): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = policy.windowSeconds * 1000;
    const bucket = this.buckets.get(key);

    if (!bucket || now - bucket.windowStartMs >= windowMs) {
      this.buckets.set(key, { windowStartMs: now, count: 1 });
      return { ok: true };
    }

    if (bucket.count < policy.max) {
      bucket.count += 1;
      return { ok: true };
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((bucket.windowStartMs + windowMs - now) / 1000),
    );
    return { ok: false, retryAfterSeconds };
  }

  reset(): void {
    this.buckets.clear();
  }
}

let defaultLimiter: RateLimiter | undefined;

export function getRateLimiter(): RateLimiter {
  if (!defaultLimiter) defaultLimiter = new InMemoryRateLimiter();
  return defaultLimiter;
}

/** Clears limiter state. Used by tests so route-level behavior is hermetic. */
export function resetRateLimitStore(): void {
  if (defaultLimiter instanceof InMemoryRateLimiter) defaultLimiter.reset();
}

const RATE_LIMIT_RESPONSE_MESSAGE = "Terlalu banyak permintaan. Coba lagi nanti.";

/**
 * Groups requests by client. Managed Next.js platforms (e.g. Vercel) set
 * `x-forwarded-for` at the platform edge, which clients cannot spoof; the
 * same header must be force-set by any self-hosted reverse proxy. When no
 * header is present all clients share a single bucket, which is safe for
 * abuse protection in development and a documented deployment requirement
 * for production (#42). The identifier is never logged or returned.
 */
function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);
  return "unknown";
}

/**
 * Enforces the policy for `policyName`. Returns a controlled HTTP 429
 * response when the limit is exceeded, or null when the request may proceed.
 */
export async function enforceRateLimit(
  request: Request,
  policyName: RateLimitPolicyName,
): Promise<NextResponse | null> {
  const policy = getRateLimitPolicies()[policyName];
  const key = `${policyName}:${getClientKey(request)}`;
  const result = await getRateLimiter().check(key, policy);

  // `result.ok === false` (rather than `!result.ok`) because the repository
  // runs with strictNullChecks disabled, where truthiness narrowing on the
  // union discriminant does not apply.
  if (result.ok === false) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: RATE_LIMIT_RESPONSE_MESSAGE,
        },
      },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfterSeconds) },
      },
    );
  }

  return null;
}
