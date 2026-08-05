import { describe, expect, it } from "vitest";
import { deleteOwnedStorage, readOwnedStorage, RANGKUL_STORAGE_KEYS } from "./storage";

function createStorage(initial: Record<string, string>): Storage {
  const values = new Map(Object.entries(initial));
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

describe("Rangkul-owned browser storage", () => {
  it("exports only namespaced application data", () => {
    const storage = createStorage({
      "rangkul.journal.entries": JSON.stringify([{ text: "local" }]),
      unrelated: "do not export",
    });

    expect(readOwnedStorage(storage)).toEqual({
      "rangkul.journal.entries": [{ text: "local" }],
    });
  });

  it("deletes only namespaced application data", () => {
    const storage = createStorage({
      [RANGKUL_STORAGE_KEYS[0]]: "owned",
      unrelated: "preserve",
    });

    expect(deleteOwnedStorage(storage)).toBe(1);
    expect(storage.getItem(RANGKUL_STORAGE_KEYS[0])).toBeNull();
    expect(storage.getItem("unrelated")).toBe("preserve");
  });
});
