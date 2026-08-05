export const CHECKIN_STEPS = ["feeling", "intensity", "need", "note"] as const;

export type CheckinStep = (typeof CHECKIN_STEPS)[number];

export function getNextCheckinStep(step: CheckinStep): CheckinStep | null {
  const index = CHECKIN_STEPS.indexOf(step);
  return CHECKIN_STEPS[index + 1] ?? null;
}

export function getPreviousCheckinStep(step: CheckinStep): CheckinStep | null {
  const index = CHECKIN_STEPS.indexOf(step);
  return CHECKIN_STEPS[index - 1] ?? null;
}
