import { describe, expect, it } from "vitest";
import { deleteJournalEntry, JOURNAL_STORAGE_KEY, readJournalEntries, saveJournalEntry } from "./journal-storage";

function createStorage(initial: Record<string, string> = {}): Storage {
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

describe("local-first journal storage", () => {
  it("saves and reads only explicit non-empty entries", () => {
    const storage = createStorage({ unrelated: "preserve" });
    expect(saveJournalEntry(storage, "  cerita lokal  ").ok).toBe(true);
    expect(saveJournalEntry(storage, "   ").reason).toBe("EMPTY");
    expect(readJournalEntries(storage)).toHaveLength(1);
    expect(storage.getItem("unrelated")).toBe("preserve");
  });

  it("handles malformed data safely", () => {
    const storage = createStorage({ [JOURNAL_STORAGE_KEY]: "not-json" });
    expect(readJournalEntries(storage)).toEqual([]);
  });

  it("deletes one entry without broad storage deletion", () => {
    const storage = createStorage();
    const saved = saveJournalEntry(storage, "hapus ini");
    const entry = saved.ok ? saved.entry : null;
    expect(entry && deleteJournalEntry(storage, entry.id)).toBe(true);
    expect(readJournalEntries(storage)).toEqual([]);
  });
});
