import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { buildCsp, config, middleware } from "./middleware";

function makeRequest(path = "/") {
  return new NextRequest(`http://localhost${path}`);
}

describe("security header middleware", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sets the conservative static header baseline", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = middleware(makeRequest());

    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(response.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(response.headers.get("Permissions-Policy")).toContain("camera=()");
  });

  it("applies a nonce-based CSP without unsafe-inline or wildcards in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = middleware(makeRequest());

    const csp = response.headers.get("Content-Security-Policy") ?? "";
    expect(csp).toContain("script-src 'self' 'nonce-");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain("font-src 'self' https://fonts.gstatic.com");
    expect(csp).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toMatch(/\s\*\s/);
  });

  it("uses a fresh nonce per request", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const first = middleware(makeRequest()).headers.get("Content-Security-Policy");
    const second = middleware(makeRequest()).headers.get("Content-Security-Policy");

    expect(first).not.toBe(second);
    expect(buildCsp("abc-123")).toContain("'nonce-abc-123'");
  });

  it("skips CSP outside production while keeping static headers", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const response = middleware(makeRequest());

    expect(response.headers.get("Content-Security-Policy")).toBeNull();
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("keeps matcher scoped to runtime responses, not static assets", () => {
    expect(config.matcher.join("")).toContain("_next/static");
  });
});
