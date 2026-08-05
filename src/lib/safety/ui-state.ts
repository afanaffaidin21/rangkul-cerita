import { SafetyRiskLevel, SAFETY_RISK_LEVELS } from "./risk-levels";

export function isControlledHighState(level: SafetyRiskLevel | null | undefined): boolean {
  return level === SAFETY_RISK_LEVELS.HIGH;
}

export function isControlledImminentState(level: SafetyRiskLevel | null | undefined): boolean {
  return level === SAFETY_RISK_LEVELS.IMMINENT;
}
