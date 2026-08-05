import { NeedType } from "../../types";

export type NextStepAction = "journal" | "exercise" | "support";

export function getPrimaryNextStepAction(need: NeedType): NextStepAction {
  if (need === "Tenangkan diri") return "exercise";
  if (need === "Cari bantuan") return "support";
  return "journal";
}

export function getNextStepActionLabel(action: NextStepAction): string {
  if (action === "exercise") return "Coba latihan 2 menit";
  if (action === "support") return "Lihat pilihan bantuan";
  return "Mulai jurnal terpandu";
}
