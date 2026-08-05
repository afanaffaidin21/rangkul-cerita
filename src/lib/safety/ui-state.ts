import { SafetyRiskLevel, SAFETY_RISK_LEVELS } from "./risk-levels";

export function isControlledHighState(level: SafetyRiskLevel | null | undefined): boolean {
  return level === SAFETY_RISK_LEVELS.HIGH;
}
