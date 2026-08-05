import {
  SAFETY_RISK_LEVELS,
  SafetyClassification,
  SafetyContext,
  SafetyRiskLevel,
} from "./risk-levels";

const SELF_REFERENCES = /\b(aku|saya|gue|gua|gw|ku|diriku)\b/i;
const ACTIVE_SELF_REFERENCE = /\b(aku|saya|gue|gua|gw|diriku)\b/i;
const THIRD_PERSON_REFERENCES = /\b(teman(?:ku)?|sahabat(?:ku)?|dia|ia|mereka|orang lain|adik(?:ku)?|kakak(?:ku)?|ibu(?:ku)?|ayah(?:ku)?)\b/i;
const QUOTED_CONTEXT = /["'“”‘’].*["'“”‘’]|\b(di artikel|dalam artikel|contoh(?:nya)?|kutipan|mengutip|membaca kalimat|berita tentang)\b/i;
const NEGATION = /\b(?:tidak|tak|gak|nggak|ga|enggak|bukan|belum)\s+(?:ingin|mau|berniat|akan|melakukan|menyakiti|bunuh diri|mengakhiri|mengakhiri hidup)/i;
const HISTORICAL = /\b(dulu|pernah|waktu itu|sebelumnya|masa lalu)\b/i;

const IMMINENT_PATTERNS = [
  /sedang (?:mau|akan|melakukan|menyakiti)/i,
  /(?:malam ini|sebentar lagi|dalam waktu dekat)/i,
  /(?:mau|akan|sedang|melakukan|menyakiti).{0,30}(?:diriku|diri sendiri|pada diriku|ke diriku).{0,30}(?:sekarang|sebentar lagi|malam ini|dalam waktu dekat)/i,
  /sekarang.{0,30}(?:sedang|mau|akan|melakukan|menyakiti).{0,30}(?:diriku|diri sendiri|pada diriku|ke diriku)/i,
  /sudah (?:menyiapkan|minum|minum obat|melukai|menyayat)/i,
  /sudah (?:punya|memegang) (?:obat|pisau|tali|racun)/i,
];

const HIGH_PATTERNS = [
  /(?:ingin|pengen|kepikiran|berpikir|mau|mau banget).{0,30}(?:bunuh diri|mati|akhiri hidup|gak ada|tidak hidup)/i,
  /(?:bunuh diri|akhiri hidup|menyakiti diri|melukai diri|potong urat|gantung diri|overdosis)/i,
  /(?:lebih baik|kayaknya lebih baik).{0,20}(?:aku|saya)?\s*(?:gak|tidak)?\s*ada/i,
  /(?:aku|saya)\s+(?:gak|nggak|tidak) mau hidup lagi/i,
  /(?:gak|nggak|tidak) mau hidup lagi/i,
];

const ELEVATED_PATTERNS = [
  /semuanya sia[- ]sia/i,
  /gak kuat menghadapi semuanya/i,
  /(?:tidak ada|gak ada|nggak ada) yang peduli/i,
  /merasa (?:benar-benar )?sendirian/i,
  /(?:putus asa|tidak berdaya|tanpa harapan)/i,
];

function normalizeSafetyText(text: string): string {
  return text
    .normalize("NFKC")
    .toLocaleLowerCase("id-ID")
    .replace(/[“”‘’]/g, '"')
    .replace(/(.)\1{3,}/g, "$1$1")
    .replace(/\s+/g, " ")
    .trim();
}

function removeQuotedContent(text: string): string {
  return text.replace(/["'][^"']*["']/g, " ");
}

function detectContext(text: string): SafetyContext {
  const activeText = removeQuotedContent(text).replace(/\baku membaca kalimat\b/gi, " ");
  const hasQuotedContext = QUOTED_CONTEXT.test(text);
  const hasSelfReference = ACTIVE_SELF_REFERENCE.test(activeText);
  const hasSelfDirectedSignal = /\b(?:aku|saya|gue|gua|gw|diriku)\b.{0,40}(?:bunuh diri|mati|akhiri hidup|menyakiti diri|melukai diri|gak mau hidup lagi|melakukan sesuatu ke diriku|melakukan sesuatu pada diriku|diri sendiri)/i.test(activeText)
    || /\baku sendiri merasa begitu\b/i.test(activeText)
    || IMMINENT_PATTERNS.some((pattern) => pattern.test(activeText) && /\b(?:aku|saya|gue|gua|gw|diriku)\b/i.test(activeText));
  const hasThirdPersonReference = THIRD_PERSON_REFERENCES.test(activeText);

  if (hasSelfReference && hasSelfDirectedSignal) return "SELF";
  if (hasThirdPersonReference) return "THIRD_PERSON";
  if (hasQuotedContext) return "QUOTED";
  if (hasSelfReference) return "SELF";
  return "UNKNOWN";
}

function addSignal(signals: string[], signal: string): void {
  if (!signals.includes(signal)) signals.push(signal);
}

function isNegated(text: string): boolean {
  return (NEGATION.test(text)
    && !/(?:gak|tidak|nggak)\s+kuat/i.test(text)
    && !/(?:gak|nggak|tidak)\s+mau hidup lagi/i.test(text)
    || /bukan karena ingin mati/i.test(text));
}

function classifyLevel(
  context: SafetyContext,
  signals: string[],
  normalized: string,
): SafetyRiskLevel {
  const contextualSelf = context === "SELF";
  const negated = isNegated(normalized);
  const historical = HISTORICAL.test(normalized);
  const imminent = IMMINENT_PATTERNS.some((pattern) => pattern.test(normalized));
  const high = HIGH_PATTERNS.some((pattern) => pattern.test(normalized));

  if (contextualSelf && !negated && imminent) return SAFETY_RISK_LEVELS.IMMINENT;
  if (contextualSelf && !negated && high && !historical) return SAFETY_RISK_LEVELS.HIGH;
  if (ELEVATED_PATTERNS.some((pattern) => pattern.test(normalized))) return SAFETY_RISK_LEVELS.ELEVATED;
  if (historical && high) return SAFETY_RISK_LEVELS.ELEVATED;
  if (context !== "UNKNOWN" && (high || imminent)) return SAFETY_RISK_LEVELS.ELEVATED;
  if (context === "UNKNOWN" && (high || imminent)) return SAFETY_RISK_LEVELS.ELEVATED;
  if (negated && high) return SAFETY_RISK_LEVELS.LOW;
  return SAFETY_RISK_LEVELS.LOW;
}

export function classifySafetyRisk(text: string): SafetyClassification {
  if (typeof text !== "string") throw new TypeError("Safety input must be text");

  const normalized = normalizeSafetyText(text);
  const context = detectContext(normalized);
  const signals: string[] = [];

  if (HIGH_PATTERNS.some((pattern) => pattern.test(normalized))) addSignal(signals, "EXPLICIT_OR_DEATH_WISH");
  if (ELEVATED_PATTERNS.some((pattern) => pattern.test(normalized))) addSignal(signals, "HOPELESSNESS");
  if (IMMINENT_PATTERNS.some((pattern) => pattern.test(normalized))) addSignal(signals, "IMMEDIACY_OR_PREPARATION");
  if (isNegated(normalized)) addSignal(signals, "NEGATION");
  if (HISTORICAL.test(normalized)) addSignal(signals, "HISTORICAL");
  if (context === "THIRD_PERSON") addSignal(signals, "THIRD_PERSON");
  if (context === "QUOTED") addSignal(signals, "QUOTED");

  const level = classifyLevel(context, signals, normalized);
  const confidence = level === SAFETY_RISK_LEVELS.LOW && signals.length === 0 ? 0.95 : 0.8;

  return { level, confidence, signals, context };
}

export function tryClassifySafetyRisk(text: unknown): SafetyClassification | null {
  try {
    return typeof text === "string" ? classifySafetyRisk(text) : null;
  } catch {
    return null;
  }
}
