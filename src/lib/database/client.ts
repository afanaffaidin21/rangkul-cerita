import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseConfig } from "./config";

let pool: Pool | undefined;

export function getDatabase() {
  if (!pool) {
    const config = getDatabaseConfig();
    pool = new Pool({ connectionString: config.url, max: config.maxConnections });
  }

  return drizzle(pool);
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
