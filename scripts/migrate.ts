import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { getDatabaseConfig } from "@/lib/database/config";

async function main() {
  const config = getDatabaseConfig();
  const pool = new Pool({
    connectionString: config.url,
    max: config.maxConnections,
  });

  try {
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "./drizzle" });
    // Final connectivity/schema verification before declaring success.
    await db.execute(sql`select 1`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  // Concise and sanitized: never print DATABASE_URL or credentials.
  console.error(
    "Database migration failed:",
    error instanceof Error ? error.message : "unknown error",
  );
  process.exitCode = 1;
});
