import { z } from "zod";

const runtimeEnvSchema = z.object({
  DATABASE_URL: z.string().trim().optional(),
  DATABASE_MAX_CONNECTIONS: z.string().trim().optional(),
  DATABASE_CONNECTION_TIMEOUT_MS: z.string().trim().optional(),
  GEMINI_API_KEY: z.string().trim().optional(),
  AI_PROVIDER_TIMEOUT_MS: z.string().trim().optional(),
  RATE_LIMIT_REFLECT_MAX: z.string().trim().optional(),
  RATE_LIMIT_REFLECT_WINDOW_SECONDS: z.string().trim().optional(),
  RATE_LIMIT_NEWSLETTER_MAX: z.string().trim().optional(),
  RATE_LIMIT_NEWSLETTER_WINDOW_SECONDS: z.string().trim().optional(),
  RATE_LIMIT_PARTNERSHIP_MAX: z.string().trim().optional(),
  RATE_LIMIT_PARTNERSHIP_WINDOW_SECONDS: z.string().trim().optional(),
}).strict();

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;

export function getRuntimeEnv(env: NodeJS.ProcessEnv = process.env): RuntimeEnv {
  const parsed = runtimeEnvSchema.safeParse({
    DATABASE_URL: env.DATABASE_URL,
    DATABASE_MAX_CONNECTIONS: env.DATABASE_MAX_CONNECTIONS,
    DATABASE_CONNECTION_TIMEOUT_MS: env.DATABASE_CONNECTION_TIMEOUT_MS,
    GEMINI_API_KEY: env.GEMINI_API_KEY,
    AI_PROVIDER_TIMEOUT_MS: env.AI_PROVIDER_TIMEOUT_MS,
    RATE_LIMIT_REFLECT_MAX: env.RATE_LIMIT_REFLECT_MAX,
    RATE_LIMIT_REFLECT_WINDOW_SECONDS: env.RATE_LIMIT_REFLECT_WINDOW_SECONDS,
    RATE_LIMIT_NEWSLETTER_MAX: env.RATE_LIMIT_NEWSLETTER_MAX,
    RATE_LIMIT_NEWSLETTER_WINDOW_SECONDS: env.RATE_LIMIT_NEWSLETTER_WINDOW_SECONDS,
    RATE_LIMIT_PARTNERSHIP_MAX: env.RATE_LIMIT_PARTNERSHIP_MAX,
    RATE_LIMIT_PARTNERSHIP_WINDOW_SECONDS: env.RATE_LIMIT_PARTNERSHIP_WINDOW_SECONDS,
  });

  if (!parsed.success) {
    throw new Error("Runtime environment configuration is invalid");
  }

  return parsed.data;
}
