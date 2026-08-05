import { describe, expect, it } from "vitest";
import { getNextStepActionLabel, getPrimaryNextStepAction } from "./next-step";

describe("next step action mapping", () => {
  it.each([
    ["Tenangkan diri", "exercise"],
    ["Cari bantuan", "support"],
    ["Cerita sebentar", "journal"],
    ["Pahami penyebabnya", "journal"],
    ["Aku belum tahu", "journal"],
  ] as const)("maps %s to one primary action", (need, action) => {
    expect(getPrimaryNextStepAction(need)).toBe(action);
  });

  it("keeps action labels clear", () => {
    expect(getNextStepActionLabel("journal")).toBe("Mulai jurnal terpandu");
    expect(getNextStepActionLabel("exercise")).toBe("Coba latihan 2 menit");
    expect(getNextStepActionLabel("support")).toBe("Lihat pilihan bantuan");
  });
});
