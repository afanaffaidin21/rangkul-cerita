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

  it("normalizes hardening and rate-limit configuration values", () => {
    expect(getRuntimeEnv({
      DATABASE_CONNECTION_TIMEOUT_MS: " 10000 ",
      AI_PROVIDER_TIMEOUT_MS: " 30000 ",
      RATE_LIMIT_REFLECT_MAX: " 5 ",
      RATE_LIMIT_REFLECT_WINDOW_SECONDS: " 60 ",
      RATE_LIMIT_NEWSLETTER_MAX: " 5 ",
      RATE_LIMIT_NEWSLETTER_WINDOW_SECONDS: " 3600 ",
      RATE_LIMIT_PARTNERSHIP_MAX: " 3 ",
      RATE_LIMIT_PARTNERSHIP_WINDOW_SECONDS: " 3600 ",
    })).toEqual({
      DATABASE_CONNECTION_TIMEOUT_MS: "10000",
      AI_PROVIDER_TIMEOUT_MS: "30000",
      RATE_LIMIT_REFLECT_MAX: "5",
      RATE_LIMIT_REFLECT_WINDOW_SECONDS: "60",
      RATE_LIMIT_NEWSLETTER_MAX: "5",
      RATE_LIMIT_NEWSLETTER_WINDOW_SECONDS: "3600",
      RATE_LIMIT_PARTNERSHIP_MAX: "3",
      RATE_LIMIT_PARTNERSHIP_WINDOW_SECONDS: "3600",
    });
  });
});
