/**
 * Canonical Safety Risk Model
 * Reference: docs/SAFETY.md
 * 
 * IMPORTANT: These are internal routing metadata only.
 * Do not expose these labels directly to users as diagnosis.
 */

export const SAFETY_RISK_LEVELS = {
  /**
   * Normal emotional distress.
   * Normal generative reflection is allowed.
   */
  LOW: "LOW",

  /**
   * Significant distress or hopelessness without clear current self-harm or suicidal intent.
   * Restricted/supportive reflection may remain possible.
   * Human support should be made more visible.
   */
  ELEVATED: "ELEVATED",

  /**
   * Clear self-harm, suicidal ideation, death wish, or equivalent serious safety signal.
   * Normal generative reflection MUST eventually be blocked.
   * Primary action: Controlled Safety Response + Human Support.
   */
  HIGH: "HIGH",

  /**
   * Immediate/ongoing dangerous action, near-term intent, or equivalent urgent safety signal.
   * Normal generative reflection MUST eventually be blocked.
   * Primary action: Emergency Flow + immediate physical-world support.
   */
  IMMINENT: "IMMINENT",
} as const;

export type SafetyRiskLevel = typeof SAFETY_RISK_LEVELS[keyof typeof SAFETY_RISK_LEVELS];

export type SafetyContext = "SELF" | "THIRD_PERSON" | "QUOTED" | "UNKNOWN";

export interface SafetyClassification {
  level: SafetyRiskLevel;
  confidence: number;
  signals: string[];
  context: SafetyContext;
}
