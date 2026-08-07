import { NextRequest, NextResponse } from "next/server";

/**
 * Base CSP directives shared by every production response.
 *
 * Built from current runtime truth:
 * - scripts are 'self' plus a per-request nonce (no unsafe-inline);
 * - styles allow inline style attributes (mood-checker color swatches) and
 *   the external Google Fonts stylesheet;
 * - fonts come only from fonts.gstatic.com;
 * - all API calls are same-origin (/api/*).
 */
const BASE_CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "img-src 'self' data:",
  "font-src 'self' https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "connect-src 'self'",
] as const;

const STATIC_SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
};

export function buildCsp(nonce: string): string {
  return [...BASE_CSP_DIRECTIVES, `script-src 'self' 'nonce-${nonce}'`].join("; ");
}

export function middleware(request: NextRequest) {
  const responseHeaders = new Headers();
  for (const [name, value] of Object.entries(STATIC_SECURITY_HEADERS)) {
    responseHeaders.set(name, value);
  }

  const requestHeaders = new Headers(request.headers);

  if (process.env.NODE_ENV === "production") {
    // A fresh nonce per request keeps script-src free of unsafe-inline. The
    // request-header copy is what lets the App Router apply the nonce to its
    // inline bootstrap/flight scripts during server rendering; the
    // response-header copy is what the browser enforces.
    const nonce = crypto.randomUUID();
    const csp = buildCsp(nonce);
    requestHeaders.set("Content-Security-Policy", csp);
    responseHeaders.set("Content-Security-Policy", csp);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
    headers: responseHeaders,
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
