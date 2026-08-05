export const RANGKUL_STORAGE_KEYS = [
  "rangkul.preferences",
  "rangkul.journal.entries",
  "rangkul.checkin.current",
  "rangkul.privacy.version",
] as const;

export function readOwnedStorage(storage: Storage): Record<string, unknown> {
  return RANGKUL_STORAGE_KEYS.reduce<Record<string, unknown>>((data, key) => {
    const value = storage.getItem(key);
    if (value !== null) {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    }
    return data;
  }, {});
}

export function deleteOwnedStorage(storage: Storage): number {
  let deleted = 0;
  for (const key of RANGKUL_STORAGE_KEYS) {
    if (storage.getItem(key) !== null) {
      storage.removeItem(key);
      deleted += 1;
    }
  }
  return deleted;
}
