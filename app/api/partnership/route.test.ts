import { beforeEach, describe, expect, it, vi } from "vitest";

const { createPartnershipLead } = vi.hoisted(() => ({
  createPartnershipLead: vi.fn().mockResolvedValue({ created: true }),
}));

vi.mock("../../../src/lib/database/partnership", () => ({ createPartnershipLead }));

import { POST } from "./route";

function request(body: unknown) {
  return new Request("http://localhost/api/partnership", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  institutionName: "Komunitas Cerita",
  category: "Komunitas Pemuda / OSIS",
  contactName: "Nama Kontak",
  email: "person@example.com",
  phone: "+62 812 3456",
  message: "Mari berdiskusi.",
};

describe("partnership persistence boundary", () => {
  beforeEach(() => createPartnershipLead.mockClear().mockResolvedValue({ created: true }));

  it("persists a valid lead before returning success", async () => {
    const response = await POST(request(validPayload));
    expect(response.status).toBe(200);
    expect(createPartnershipLead).toHaveBeenCalledWith(validPayload);
    expect(await response.json()).toMatchObject({ success: true });
  });

  it("rejects invalid input before persistence", async () => {
    const response = await POST(request({ ...validPayload, email: "not-an-email" }));
    expect(response.status).toBe(400);
    expect(createPartnershipLead).not.toHaveBeenCalled();
  });

  it("allows repeated submissions without inventing uniqueness rules", async () => {
    const first = await POST(request(validPayload));
    const second = await POST(request(validPayload));
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(createPartnershipLead).toHaveBeenCalledTimes(2);
  });

  it("does not leak persistence errors or report success", async () => {
    createPartnershipLead.mockResolvedValue(null);
    const response = await POST(request(validPayload));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: "PERSISTENCE_ERROR", message: "Formulir kemitraan belum dapat diproses" } });
  });
});
