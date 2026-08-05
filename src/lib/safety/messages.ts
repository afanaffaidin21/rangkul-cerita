import { VERIFIED_HELPLINES } from "./contacts";

export const CONTROLLED_HIGH_RESPONSE = {
  title: "Kamu tidak harus menghadapi ini sendirian",
  message: "Yang kamu rasakan terdengar serius. Untuk saat ini, hubungi dukungan manusia yang bisa menemanimu.",
  primaryAction: "Hubungi Healing119",
  trustedPersonAction: "Hubungi orang tepercaya",
  primaryContact: VERIFIED_HELPLINES.find((helpline) => helpline.id === "healing-119")!,
} as const;

export const CONTROLLED_IMMINENT_RESPONSE = {
  title: "Cari bantuan langsung sekarang",
  message: "Jika kamu sedang dalam bahaya atau tindakan berbahaya sedang berlangsung, hubungi bantuan darurat sekarang dan dekati orang yang bisa menemanimu.",
  primaryAction: "Hubungi PSC 119",
  secondaryAction: "Coba 112 jika tersedia di wilayahmu",
  trustedPersonAction: "Hubungi orang tepercaya sekarang",
  primaryContact: VERIFIED_HELPLINES.find((helpline) => helpline.id === "psc-119")!,
  secondaryContact: VERIFIED_HELPLINES.find((helpline) => helpline.id === "emergency-112")!,
  supportContact: VERIFIED_HELPLINES.find((helpline) => helpline.id === "healing-119")!,
} as const;
