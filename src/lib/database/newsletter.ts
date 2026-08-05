import { eq } from "drizzle-orm";
import { getDatabase } from "./client";
import { newsletterSubscriptions } from "./schema";

export const NEWSLETTER_CONSENT_VERSION = "2026-08-05";

export async function subscribeToNewsletter(email: string, now = new Date()) {
  const db = getDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const inserted = await db.insert(newsletterSubscriptions).values({
    email: normalizedEmail,
    consentAt: now,
    consentVersion: NEWSLETTER_CONSENT_VERSION,
    status: "active",
  }).onConflictDoNothing({ target: newsletterSubscriptions.email }).returning({
    id: newsletterSubscriptions.id,
  });

  if (inserted.length > 0) {
    return { created: true };
  }

  const existing = await db.select({
    status: newsletterSubscriptions.status,
  }).from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, normalizedEmail)).limit(1);

  if (existing.length === 0) {
    throw new Error("Newsletter subscription was not found after duplicate insert");
  }

  return { created: false, status: existing[0].status };
}
