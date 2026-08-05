import { describe, expect, it } from "vitest";
import { getRuntimeEnv } from "./env";

describe("runtime environment configuration", () => {
  it("normalizes the currently used environment values", () => {
    expect(getRuntimeEnv({
      DATABASE_URL: "  postgresql://localhost/app  ",
      DATABASE_MAX_CONNECTIONS: " 10 ",
      GEMINI_API_KEY: " synthetic-key ",
    })).toEqual({
      DATABASE_URL: "postgresql://localhost/app",
      DATABASE_MAX_CONNECTIONS: "10",
      GEMINI_API_KEY: "synthetic-key",
    });
  });

  it("allows optional provider configuration to be absent", () => {
    expect(getRuntimeEnv({ DATABASE_URL: "postgresql://localhost/app" })).toEqual({
      DATABASE_URL: "postgresql://localhost/app",
    });
  });

  it("ignores unrelated environment values", () => {
    expect(getRuntimeEnv({
      DATABASE_URL: "postgresql://localhost/app",
      UNUSED_SERVICE_KEY: "not-used",
    })).toEqual({
      DATABASE_URL: "postgresql://localhost/app",
    });
  });
});
