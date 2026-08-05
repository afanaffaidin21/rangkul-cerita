import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { getDatabaseConfig } from "@/lib/database/config";

const config = getDatabaseConfig();
const pool = new Pool({ connectionString: config.url, max: config.maxConnections });
const db = drizzle(pool);

await migrate(db, { migrationsFolder: "./drizzle" });
await db.execute(sql`select 1`);
await pool.end();
