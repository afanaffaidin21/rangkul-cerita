import { NextResponse } from "next/server";
import { getRateLimitPolicies, RateLimitPolicy, RateLimitPolicyName } from "./config";
import { createUpstashRateLimiter } from "./upstash";

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number }
  | { ok: false; infrastructureFailure: true };

/**
 * Driver boundary for rate-limit storage.
 *
 * Production (Vercel) uses the shared Upstash Redis driver so limits are
 * enforced across every serverless function instance. Local development and
 * tests use the in-memory driver, which is correct for a single process only.
 * Routes only depend on this interface via `enforceRateLimit`.
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

/**
 * Returns the process-wide limiter.
 *
 * Selection is deterministic:
 * - production: shared Upstash-backed driver (required for Vercel serverless);
 *   missing Upstash credentials fail loudly instead of silently degrading to
 *   per-instance limits;
 * - development/test: in-memory driver.
 */
export function getRateLimiter(): RateLimiter {
  if (!defaultLimiter) {
    defaultLimiter =
      process.env.NODE_ENV === "production"
        ? createUpstashRateLimiter()
        : new InMemoryRateLimiter();
  }
  return defaultLimiter;
}

/** Clears limiter state. Used by tests so route-level behavior is hermetic. */
export function resetRateLimitStore(): void {
  if (defaultLimiter instanceof InMemoryRateLimiter) defaultLimiter.reset();
}

/** Resets driver selection and state between tests. */
export function resetRateLimiterForTests(): void {
  if (defaultLimiter instanceof InMemoryRateLimiter) defaultLimiter.reset();
  defaultLimiter = undefined;
}

const RATE_LIMIT_RESPONSE_MESSAGE = "Terlalu banyak permintaan. Coba lagi nanti.";

/**
 * Mirrors the existing AI_UNAVAILABLE contract so a rate-limit backend
 * failure on the paid reflection path looks identical to a provider outage.
 */
const RATE_LIMIT_INFRASTRUCTURE_MESSAGE = "Refleksi sedang tidak tersedia. Coba lagi nanti.";

/**
 * Groups requests by client. On Vercel the platform edge sets and overwrites
 * `x-forwarded-for`, so the first value is the real client IP and cannot be
 * spoofed by clients. The identifier is never logged or returned; it is used
 * only as part of the namespaced rate-limit key.
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
 *
 * Infrastructure-failure behavior is endpoint-specific:
 * - reflect (paid AI path): fail closed with a controlled 503 AI_UNAVAILABLE
 *   so a limiter outage never silently turns the paid endpoint into an
 *   unlimited one. HIGH/IMMINENT requests never reach the limiter because the
 *   Safety Gate runs first.
 * - newsletter / unsubscribe / partnership: fail open (request allowed) so
 *   forms keep working during a limiter outage; the driver logs a sanitized
 *   entry for visibility.
 */
export async function enforceRateLimit(
  request: Request,
  policyName: RateLimitPolicyName,
  limiter: RateLimiter = getRateLimiter(),
): Promise<NextResponse | null> {
  const policy = getRateLimitPolicies()[policyName];
  const key = `${policyName}:${getClientKey(request)}`;
  const result = await limiter.check(key, policy);

  // `result.ok === false` (rather than `!result.ok`) because the repository
  // runs with strictNullChecks disabled, where truthiness narrowing on the
  // union discriminant does not apply.
  if (result.ok === false) {
    if ("infrastructureFailure" in result) {
      if (policyName === "reflect") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "AI_UNAVAILABLE",
              message: RATE_LIMIT_INFRASTRUCTURE_MESSAGE,
            },
          },
          { status: 503 },
        );
      }
      return null;
    }

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
