import { beforeEach, describe, expect, it, vi } from "vitest";

const { subscribeToNewsletter } = vi.hoisted(() => ({ subscribeToNewsletter: vi.fn().mockResolvedValue({ created: true }) }));

vi.mock("../../../src/lib/database/newsletter", () => ({ subscribeToNewsletter }));

import { POST } from "./route";

function request(body: unknown) {
  return new Request("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("newsletter persistence boundary", () => {
  beforeEach(() => subscribeToNewsletter.mockClear().mockResolvedValue({ created: true }));

  it("rejects invalid input before persistence", async () => {
    const response = await POST(request({ email: "invalid", consent: true }));
    expect(response.status).toBe(400);
    expect(subscribeToNewsletter).not.toHaveBeenCalled();
  });

  it("persists a valid subscription and reports success", async () => {
    subscribeToNewsletter.mockResolvedValue({ created: true });
    const response = await POST(request({ email: " Person@Example.COM ", consent: true }));
    expect(response.status).toBe(200);
    expect(subscribeToNewsletter).toHaveBeenCalledWith("Person@Example.COM");
    expect(await response.json()).toMatchObject({ success: true, alreadySubscribed: false });
  });

  it("reports duplicate subscriptions deterministically", async () => {
    subscribeToNewsletter.mockResolvedValue({ created: false, status: "active" });
    const response = await POST(request({ email: "person@example.com", consent: true }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, alreadySubscribed: true });
  });

  it("does not leak database errors or report success", async () => {
    subscribeToNewsletter.mockResolvedValue(null);
    const response = await POST(request({ email: "person@example.com", consent: true }));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ success: false, error: { code: "PERSISTENCE_FAILED", message: "Pendaftaran newsletter belum dapat diproses" } });
  });
});
