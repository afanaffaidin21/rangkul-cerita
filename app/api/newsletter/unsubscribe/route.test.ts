import { beforeEach, describe, expect, it, vi } from "vitest";

const { unsubscribeFromNewsletter } = vi.hoisted(() => ({
  unsubscribeFromNewsletter: vi.fn().mockResolvedValue({ ok: true }),
}));

vi.mock("../../../../src/lib/database/newsletter", () => ({ unsubscribeFromNewsletter }));

import { POST } from "./route";
import { resetRateLimitStore } from "../../../../src/lib/rate-limit/limiter";

function request(body: unknown) {
  return new Request("http://localhost/api/newsletter/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("newsletter unsubscribe boundary", () => {
  beforeEach(() => {
    unsubscribeFromNewsletter.mockClear().mockResolvedValue({ ok: true });
    resetRateLimitStore();
  });

  it("rejects invalid input before persistence", async () => {
    const response = await POST(request({ email: "not-an-email" }));
    expect(response.status).toBe(400);
    expect(unsubscribeFromNewsletter).not.toHaveBeenCalled();
  });

  it("unsubscribes a valid email with a generic response", async () => {
    const response = await POST(request({ email: "Person@Example.COM" }));
    expect(response.status).toBe(200);
    expect(unsubscribeFromNewsletter).toHaveBeenCalledWith("Person@Example.COM");
    expect(await response.json()).toEqual({
      success: true,
      message: "Permintaan berhenti berlangganan telah diproses.",
    });
  });

  it("handles repeated unsubscribe requests idempotently", async () => {
    const first = await POST(request({ email: "person@example.com" }));
    const second = await POST(request({ email: "person@example.com" }));
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
  });

  it("never reveals whether an email is subscribed or exists", async () => {
    const unknown = await POST(request({ email: "nobody@example.com" }));
    const known = await POST(request({ email: "person@example.com" }));
    expect(unknown.status).toBe(200);
    expect(await unknown.json()).toEqual(await known.json());
  });

  it("does not echo the email in the response", async () => {
    const response = await POST(request({ email: "person@example.com" }));
    const body = JSON.stringify(await response.json());
    expect(body).not.toContain("person@example.com");
  });

  it("maps persistence failures to a controlled error", async () => {
    unsubscribeFromNewsletter.mockRejectedValue(new Error("synthetic db detail"));
    const response = await POST(request({ email: "person@example.com" }));
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(JSON.stringify(data)).not.toContain("synthetic db detail");
    expect(data).toEqual({
      success: false,
      error: {
        code: "PERSISTENCE_FAILED",
        message: "Permintaan berhenti berlangganan belum dapat diproses",
      },
    });
  });

  it("returns a controlled 429 after the unsubscribe limit is exceeded", async () => {
    for (let i = 0; i < 10; i++) {
      expect((await POST(request({ email: "person@example.com" }))).status).toBe(200);
    }

    const limited = await POST(request({ email: "person@example.com" }));
    expect(limited.status).toBe(429);
    expect(unsubscribeFromNewsletter).toHaveBeenCalledTimes(10);
    expect(await limited.json()).toMatchObject({
      success: false,
      error: { code: "RATE_LIMITED" },
    });
  });
});
