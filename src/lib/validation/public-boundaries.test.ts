import { describe, expect, it, vi } from "vitest";

import { POST as reflect } from "../../../app/api/checkin/reflect/route";
import { POST as classify } from "../../../app/api/safety/classify/route";
import { POST as newsletter } from "../../../app/api/newsletter/route";
import { POST as partnership } from "../../../app/api/partnership/route";

function request(path: string, body: unknown) {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("public boundary runtime validation", () => {
  it.each([
    [reflect, "/api/checkin/reflect", { userNote: "private text", intensity: 9 }],
    [classify, "/api/safety/classify", { text: "" }],
    [newsletter, "/api/newsletter", { email: "not-an-email", consent: true }],
    [partnership, "/api/partnership", { institutionName: "School", category: "Unknown", contactName: "A", email: "bad" }],
  ])("rejects malformed payloads without exposing input", async (handler, path, body) => {
    const response = await handler(request(path, body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ success: false, error: { code: "VALIDATION_ERROR", message: "Permintaan tidak valid" } });
  });

});
