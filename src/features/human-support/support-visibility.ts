import { SafetyRiskLevel } from "../../lib/safety/risk-levels";

export type SupportVisibility = "available" | "prominent" | "primary" | "emergency";

export function getSupportVisibility(level: SafetyRiskLevel | null | undefined): SupportVisibility {
  if (level === "IMMINENT") return "emergency";
  if (level === "HIGH") return "primary";
  if (level === "ELEVATED") return "prominent";
  return "available";
}
