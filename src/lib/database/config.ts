import { getRuntimeEnv } from "../config/env";

export type DatabaseConfig = {
  url: string;
  maxConnections: number;
};

function parseMaxConnections(value: string | undefined) {
  if (value === undefined || value === "") {
    return 5;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
    throw new Error("DATABASE_MAX_CONNECTIONS must be an integer between 1 and 100");
  }

  return parsed;
}

export function getDatabaseConfig(env: NodeJS.ProcessEnv = process.env): DatabaseConfig {
  const runtimeEnv = getRuntimeEnv(env);
  const url = runtimeEnv.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required for database operations");
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "postgres:" && parsedUrl.protocol !== "postgresql:") {
      throw new Error("unsupported protocol");
    }
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL");
  }

  return {
    url,
    maxConnections: parseMaxConnections(runtimeEnv.DATABASE_MAX_CONNECTIONS),
  };
}
