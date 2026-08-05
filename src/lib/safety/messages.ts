import { VERIFIED_HELPLINES } from "./contacts";

export const CONTROLLED_HIGH_RESPONSE = {
  title: "Kamu tidak harus menghadapi ini sendirian",
  message: "Yang kamu rasakan terdengar serius. Untuk saat ini, hubungi dukungan manusia yang bisa menemanimu.",
  primaryAction: "Hubungi Healing119",
  trustedPersonAction: "Hubungi orang tepercaya",
  primaryContact: VERIFIED_HELPLINES.find((helpline) => helpline.id === "healing-119")!,
} as const;
