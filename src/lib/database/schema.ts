import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const newsletterSubscriptionStatus = pgEnum("newsletter_subscription_status", ["active", "unsubscribed"]);

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  consentVersion: text("consent_version").notNull(),
  status: newsletterSubscriptionStatus("status").notNull().default("active"),
  providerId: text("provider_id"),
});

export const databaseSchema = {
  newsletterSubscriptions,
};
