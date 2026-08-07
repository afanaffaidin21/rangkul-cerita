import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "../../../app/api/checkin/reflect/route";
import { getPrimaryNextStepAction, getNextStepActionLabel } from "./next-step";
import { deleteJournalEntry, JOURNAL_STORAGE_KEY, readJournalEntries, saveJournalEntry } from "../privacy/journal-storage";
import { getSupportVisibility } from "../safety/support-visibility";
import { resetRateLimitStore } from "../rate-limit/limiter";

const { generateReflection } = vi.hoisted(() => ({ generateReflection: vi.fn() }));

vi.mock("../ai/provider", () => ({
  generateReflection,
}));

function request(body: Record<string, unknown>) {
  return new Request("http://localhost/api/checkin/reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

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

const checkin = {
  emotions: ["Cemas"],
  intensity: 3,
  need: "Cerita sebentar",
  userNote: "Catatan sintetis untuk alur pengujian.",
};

const validReflection = {
  reflection: "Respons reflektif sintetis.",
  suggestedQuestion: "Apa hal kecil yang ingin kamu pahami?",
  summary: {
    mainTopic: "Tugas",
    emotions: ["Cemas"],
    possibleTriggers: "Jadwal dekat",
    userNeed: "Cerita sebentar",
    nextStep: "Tulis satu kalimat di jurnal.",
  },
  recommendedSteps: ["Tarik napas", "Pilih satu hal", "Cari dukungan"],
};

describe("core journey E2E boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "synthetic-test-key";
    generateReflection.mockResolvedValue({ ok: true, text: JSON.stringify(validReflection) });
    resetRateLimitStore();
  });

  it("completes the LOW check-in, validates reflection, selects Next Step, saves Journal locally, and exposes Human Support", async () => {
    const response = await POST(request(checkin));
    const data = await response.json();
    const storage = createStorage({ unrelated: "preserve" });

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.safety).toEqual({ level: "LOW", status: "ALLOWED" });
    expect(data.reflection).toBe(validReflection.reflection);
    expect(data.summary.nextStep).toBeTruthy();
    expect(getPrimaryNextStepAction(checkin.need)).toBe("journal");
    expect(getNextStepActionLabel("journal")).toBe("Mulai jurnal terpandu");

    expect(readJournalEntries(storage)).toEqual([]);
    const saved = saveJournalEntry(storage, "Catatan jurnal sintetis.");
    expect(saved.ok).toBe(true);
    expect(readJournalEntries(storage)).toHaveLength(1);
    expect(storage.getItem("unrelated")).toBe("preserve");
    expect(getSupportVisibility(data.safety.level)).toBe("available");
    expect(storage.getItem(JOURNAL_STORAGE_KEY)).toContain("Catatan jurnal sintetis.");
  });

  it("keeps validation failures outside the provider and offers recovery", async () => {
    const response = await POST(request({ ...checkin, emotions: [], intensity: 9 }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe("VALIDATION_ERROR");
    expect(generateReflection).not.toHaveBeenCalled();
  });

  it("keeps HIGH in the controlled support flow without normal reflection or journal bypass", async () => {
    const response = await POST(request({ ...checkin, userNote: "Synthetic HIGH routing fixture: aku kepikiran bunuh diri." }));
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.safety.level).toBe("HIGH");
    expect(data.reflection).toBeNull();
    expect(data.controlledResponse).toBeTruthy();
    expect(generateReflection).not.toHaveBeenCalled();
    expect(getSupportVisibility(data.safety.level)).toBe("primary");
  });

  it("keeps IMMINENT in the emergency controlled flow without normal reflection or journal bypass", async () => {
    const response = await POST(request({ ...checkin, userNote: "Synthetic IMMINENT routing fixture: aku sedang mau menyakiti diriku sekarang." }));
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.safety.level).toBe("IMMINENT");
    expect(data.reflection).toBeNull();
    expect(data.controlledResponse).toBeTruthy();
    expect(generateReflection).not.toHaveBeenCalled();
    expect(getSupportVisibility(data.safety.level)).toBe("emergency");
  });

  it("supports explicit local journal deletion without touching unrelated storage", () => {
    const storage = createStorage({ unrelated: "preserve" });
    const saved = saveJournalEntry(storage, "Catatan jurnal sintetis.");
    expect(saved.ok).toBe(true);
    if (!saved.ok) return;

    expect(deleteJournalEntry(storage, saved.entry.id)).toBe(true);
    expect(readJournalEntries(storage)).toEqual([]);
    expect(storage.getItem(JOURNAL_STORAGE_KEY)).toBeNull();
    expect(storage.getItem("unrelated")).toBe("preserve");
  });
});
