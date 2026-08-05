import { getDatabase } from "./client";
import { partnershipLeads } from "./schema";

export type PartnershipLeadInput = {
  institutionName: string;
  category: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
};

export async function createPartnershipLead(input: PartnershipLeadInput) {
  const db = getDatabase();
  const inserted = await db.insert(partnershipLeads).values({
    institutionName: input.institutionName,
    category: input.category,
    contactName: input.contactName,
    email: input.email,
    phone: input.phone,
    message: input.message,
    status: "new",
  }).returning({ id: partnershipLeads.id });

  if (inserted.length === 0) {
    throw new Error("Partnership lead was not persisted");
  }

  return { created: true };
}
