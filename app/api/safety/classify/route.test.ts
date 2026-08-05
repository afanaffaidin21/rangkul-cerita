import { describe, expect, it } from "vitest";
import { POST } from "./route";

function request(body: unknown) {
  return new Request("http://localhost/api/safety/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("safety classification error boundary", () => {
  it("returns a structured validation error", async () => {
    const response = await POST(request({ text: "" }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Permintaan tidak valid" },
    });
  });

  it("keeps HIGH routing controlled and fail-closed", async () => {
    const response = await POST(request({ text: "Aku kepikiran bunuh diri." }));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.safety.status).toBe("HIGH");
    expect(data.isCrisis).toBe(true);
  });
});
