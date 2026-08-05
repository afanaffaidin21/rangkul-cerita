import { classifySafetyRisk } from "./detector";
import { SafetyClassification, SafetyRiskLevel, SAFETY_RISK_LEVELS } from "./risk-levels";

export type SafetyGateResult =
  | {
      allowed: true;
      classification: SafetyClassification;
    }
  | {
      allowed: false;
      classification: SafetyClassification | null;
      reason: "HIGH" | "IMMINENT" | "CLASSIFIER_FAILURE";
    };

export type SafetyClassifier = (text: string) => SafetyClassification;

export function runSafetyGate(
  text: string,
  classifier: SafetyClassifier = classifySafetyRisk,
): SafetyGateResult {
  try {
    const classification = classifier(text);
    const blockedLevels: SafetyRiskLevel[] = [
      SAFETY_RISK_LEVELS.HIGH,
      SAFETY_RISK_LEVELS.IMMINENT,
    ];

    if (blockedLevels.includes(classification.level)) {
      return {
        allowed: false,
        classification,
        reason: classification.level === SAFETY_RISK_LEVELS.IMMINENT
          ? SAFETY_RISK_LEVELS.IMMINENT
          : SAFETY_RISK_LEVELS.HIGH,
      };
    }

    return { allowed: true, classification };
  } catch {
    return {
      allowed: false,
      classification: null,
      reason: "CLASSIFIER_FAILURE",
    };
  }
}

export function isCrisisLevel(level: SafetyRiskLevel): boolean {
  return level === SAFETY_RISK_LEVELS.HIGH || level === SAFETY_RISK_LEVELS.IMMINENT;
}
