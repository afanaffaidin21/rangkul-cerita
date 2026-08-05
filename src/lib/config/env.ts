import { z } from "zod";

const runtimeEnvSchema = z.object({
  DATABASE_URL: z.string().trim().optional(),
  DATABASE_MAX_CONNECTIONS: z.string().trim().optional(),
  GEMINI_API_KEY: z.string().trim().optional(),
}).strict();

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;

export function getRuntimeEnv(env: NodeJS.ProcessEnv = process.env): RuntimeEnv {
  const parsed = runtimeEnvSchema.safeParse({
    DATABASE_URL: env.DATABASE_URL,
    DATABASE_MAX_CONNECTIONS: env.DATABASE_MAX_CONNECTIONS,
    GEMINI_API_KEY: env.GEMINI_API_KEY,
  });

  if (!parsed.success) {
    throw new Error("Runtime environment configuration is invalid");
  }

  return parsed.data;
}
