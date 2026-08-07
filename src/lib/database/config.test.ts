import { describe, expect, it } from "vitest";
import { getDatabaseConfig } from "./config";

describe("database configuration", () => {
  it("requires a PostgreSQL DATABASE_URL", () => {
    expect(() => getDatabaseConfig({})).toThrow("DATABASE_URL is required");
    expect(() => getDatabaseConfig({ DATABASE_URL: "https://example.com" })).toThrow(
      "valid PostgreSQL connection URL",
    );
  });

  it("parses a PostgreSQL URL and connection limit", () => {
    expect(
      getDatabaseConfig({
        DATABASE_URL: "postgresql://user:password@example.com/app",
        DATABASE_MAX_CONNECTIONS: "10",
      }),
    ).toEqual({
      url: "postgresql://user:password@example.com/app",
      maxConnections: 10,
      connectionTimeoutMillis: 10_000,
    });
  });

  it("uses a conservative default connection limit", () => {
    expect(getDatabaseConfig({ DATABASE_URL: "postgres://localhost/app" }).maxConnections).toBe(5);
  });

  it("honors a custom connection timeout", () => {
    expect(
      getDatabaseConfig({
        DATABASE_URL: "postgresql://user:password@example.com/app",
        DATABASE_CONNECTION_TIMEOUT_MS: "15000",
      }).connectionTimeoutMillis,
    ).toBe(15_000);
  });

  it("rejects invalid connection timeout configuration", () => {
    expect(() =>
      getDatabaseConfig({
        DATABASE_URL: "postgres://localhost/app",
        DATABASE_CONNECTION_TIMEOUT_MS: "0",
      }),
    ).toThrow("DATABASE_CONNECTION_TIMEOUT_MS");
  });
});
