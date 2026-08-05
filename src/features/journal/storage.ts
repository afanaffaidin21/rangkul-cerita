import { z } from "zod";

export const JOURNAL_STORAGE_KEY = "rangkul.journal.entries";

const journalEntrySchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().min(1).max(10000),
  createdAt: z.string().datetime(),
}).strict();

export type JournalEntry = z.infer<typeof journalEntrySchema>;

export function readJournalEntries(storage: Storage): JournalEntry[] {
  try {
    const raw = storage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const result = z.array(journalEntrySchema).safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export function saveJournalEntry(storage: Storage, text: string): { ok: true; entry: JournalEntry } | { ok: false; reason: "EMPTY" | "STORAGE_ERROR" } {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, reason: "EMPTY" };

  const entry: JournalEntry = { id: crypto.randomUUID(), text: trimmed, createdAt: new Date().toISOString() };
  try {
    storage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify([...readJournalEntries(storage), entry]));
    return { ok: true, entry };
  } catch {
    return { ok: false, reason: "STORAGE_ERROR" };
  }
}

export function deleteJournalEntry(storage: Storage, id: string): boolean {
  try {
    const entries = readJournalEntries(storage);
    const next = entries.filter((entry) => entry.id !== id);
    if (next.length === entries.length) return false;
    if (next.length === 0) storage.removeItem(JOURNAL_STORAGE_KEY);
    else storage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}
