import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseConfig } from "./config";

let pool: Pool | undefined;

export function getDatabase() {
  if (!pool) {
    const config = getDatabaseConfig();
    pool = new Pool({
      connectionString: config.url,
      max: config.maxConnections,
      connectionTimeoutMillis: config.connectionTimeoutMillis,
    });
    // An error on an idle pooled client must never crash the request process.
    // Log only a sanitized category; never the connection string or values.
    pool.on("error", (error) => {
      console.error(`[database] connection pool error (${error?.name ?? "unknown"})`);
    });
  }

  return drizzle(pool);
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
