import { describe, expect, it } from "vitest";
import { AppError, APP_ERRORS } from "./errors";

describe("application error architecture", () => {
  it("maps known categories to safe structured responses", async () => {
    const response = await (await import("./errors")).apiFailure(APP_ERRORS.validation());
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Permintaan tidak valid" },
    });
  });

  it("preserves category and safe message while hiding causes", async () => {
    const response = (await import("./errors")).apiFailure(new AppError({
      code: "PERSISTENCE_FAILED",
      message: "Operasi belum dapat diproses",
      status: 500,
      cause: new Error("postgres password and emotional text"),
    }));
    const body = await response.json();
    expect(body.error.code).toBe("PERSISTENCE_FAILED");
    expect(body.error.message).not.toContain("postgres");
    expect(JSON.stringify(body)).not.toContain("emotional text");
    expect(JSON.stringify(body)).not.toContain("password");
  });

  it("keeps unexpected failures mapped to a safe internal category", () => {
    const error = APP_ERRORS.internal(new Error("raw provider or SQL detail"));
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.message).toBe("Terjadi kendala teknis. Coba lagi nanti.");
  });
});
