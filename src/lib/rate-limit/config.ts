import { getRuntimeEnv } from "../config/env";

export type RateLimitPolicyName =
  | "reflect"
  | "newsletter"
  | "newsletterUnsubscribe"
  | "partnership";

export type RateLimitPolicy = {
  /** Maximum number of requests allowed within the window. */
  max: number;
  /** Fixed-window length in seconds. */
  windowSeconds: number;
};

/**
 * Conservative per-endpoint defaults. The AI reflection endpoint is
 * deliberately the tightest because every request invokes a paid provider.
 * Newsletter and partnership protect persistence writes from list-poisoning
 * spam while remaining generous enough for genuine use.
 */
const DEFAULT_POLICIES: Record<RateLimitPolicyName, RateLimitPolicy> = {
  reflect: { max: 5, windowSeconds: 60 },
  newsletter: { max: 5, windowSeconds: 3600 },
  newsletterUnsubscribe: { max: 10, windowSeconds: 3600 },
  partnership: { max: 3, windowSeconds: 3600 },
};

function parsePolicyValue(
  value: string | undefined,
  fallback: number,
  label: string,
): number {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
}

/**
 * Returns the effective policies, applying environment overrides.
 * Every limit is configurable so production tuning does not require code
 * changes (final production values are owned by the release issue #42).
 */
export function getRateLimitPolicies(
  env: NodeJS.ProcessEnv = process.env,
): Record<RateLimitPolicyName, RateLimitPolicy> {
  const runtimeEnv = getRuntimeEnv(env);
  return {
    reflect: {
      max: parsePolicyValue(
        runtimeEnv.RATE_LIMIT_REFLECT_MAX,
        DEFAULT_POLICIES.reflect.max,
        "RATE_LIMIT_REFLECT_MAX",
      ),
      windowSeconds: parsePolicyValue(
        runtimeEnv.RATE_LIMIT_REFLECT_WINDOW_SECONDS,
        DEFAULT_POLICIES.reflect.windowSeconds,
        "RATE_LIMIT_REFLECT_WINDOW_SECONDS",
      ),
    },
    newsletter: {
      max: parsePolicyValue(
        runtimeEnv.RATE_LIMIT_NEWSLETTER_MAX,
        DEFAULT_POLICIES.newsletter.max,
        "RATE_LIMIT_NEWSLETTER_MAX",
      ),
      windowSeconds: parsePolicyValue(
        runtimeEnv.RATE_LIMIT_NEWSLETTER_WINDOW_SECONDS,
        DEFAULT_POLICIES.newsletter.windowSeconds,
        "RATE_LIMIT_NEWSLETTER_WINDOW_SECONDS",
      ),
    },
    newsletterUnsubscribe: {
      max: parsePolicyValue(
        runtimeEnv.RATE_LIMIT_UNSUBSCRIBE_MAX,
        DEFAULT_POLICIES.newsletterUnsubscribe.max,
        "RATE_LIMIT_UNSUBSCRIBE_MAX",
      ),
      windowSeconds: parsePolicyValue(
        runtimeEnv.RATE_LIMIT_UNSUBSCRIBE_WINDOW_SECONDS,
        DEFAULT_POLICIES.newsletterUnsubscribe.windowSeconds,
        "RATE_LIMIT_UNSUBSCRIBE_WINDOW_SECONDS",
      ),
    },
    partnership: {
      max: parsePolicyValue(
        runtimeEnv.RATE_LIMIT_PARTNERSHIP_MAX,
        DEFAULT_POLICIES.partnership.max,
        "RATE_LIMIT_PARTNERSHIP_MAX",
      ),
      windowSeconds: parsePolicyValue(
        runtimeEnv.RATE_LIMIT_PARTNERSHIP_WINDOW_SECONDS,
        DEFAULT_POLICIES.partnership.windowSeconds,
        "RATE_LIMIT_PARTNERSHIP_WINDOW_SECONDS",
      ),
    },
  };
}

export type UpstashRedisConfig = {
  url: string;
  token: string;
};

/**
 * Returns the production Upstash REST credentials from validated runtime
 * configuration. Upstash is the shared distributed rate-limit store for the
 * Vercel production runtime; local development and tests keep using the
 * in-memory driver and do not need these values.
 */
export function getUpstashRedisConfig(env: NodeJS.ProcessEnv = process.env): UpstashRedisConfig {
  const runtimeEnv = getRuntimeEnv(env);
  const url = runtimeEnv.UPSTASH_REDIS_REST_URL;
  const token = runtimeEnv.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production for distributed rate limiting",
    );
  }

  return { url, token };
}
