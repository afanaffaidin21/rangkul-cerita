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

/**
 * Transitions a subscription to `unsubscribed`. The result is intentionally
 * identical whether the email exists, is already unsubscribed, or is unknown
 * (no enumeration signal). Consent metadata and providerId are preserved.
 */
export async function unsubscribeFromNewsletter(email: string) {
  const db = getDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  await db.update(newsletterSubscriptions)
    .set({ status: "unsubscribed" })
    .where(eq(newsletterSubscriptions.email, normalizedEmail));
  return { ok: true };
}
