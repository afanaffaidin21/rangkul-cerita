import { MoodCheckinResult } from "../../types";
import { SafetyRiskLevel, SAFETY_RISK_LEVELS } from "./risk-levels";

export type CheckinViewState =
  | "IDLE"
  | "SUBMITTING"
  | "LOW_RESULT"
  | "ELEVATED_RESULT"
  | "HIGH_CONTROLLED"
  | "IMMINENT_CONTROLLED"
  | "ERROR";

export function getCheckinViewState(result: MoodCheckinResult | null): CheckinViewState {
  if (!result) return "IDLE";

  switch (result.safety?.level) {
    case SAFETY_RISK_LEVELS.HIGH:
      return "HIGH_CONTROLLED";
    case SAFETY_RISK_LEVELS.IMMINENT:
      return "IMMINENT_CONTROLLED";
    case SAFETY_RISK_LEVELS.ELEVATED:
      return "ELEVATED_RESULT";
    case SAFETY_RISK_LEVELS.LOW:
      return "LOW_RESULT";
    default:
      return "ERROR";
  }
}

export function getSafetyLevel(result: MoodCheckinResult | null): SafetyRiskLevel | null {
  return result?.safety?.level ?? null;
}

export function replaceCheckinResult(
  current: MoodCheckinResult | null,
  next: MoodCheckinResult,
): MoodCheckinResult {
  return next;
}
