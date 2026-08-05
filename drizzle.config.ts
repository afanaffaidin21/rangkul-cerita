import type { Config } from "drizzle-kit";
import { getDatabaseConfig } from "./src/lib/database/config";

const database = getDatabaseConfig();

export default {
  schema: "./src/lib/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: database.url,
  },
} satisfies Config;
