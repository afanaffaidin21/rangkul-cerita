import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const newsletterSubscriptionStatus = pgEnum("newsletter_subscription_status", ["active", "unsubscribed"]);
export const partnershipLeadStatus = pgEnum("partnership_lead_status", ["new", "contacted", "closed"]);

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  consentVersion: text("consent_version").notNull(),
  status: newsletterSubscriptionStatus("status").notNull().default("active"),
  providerId: text("provider_id"),
});

export const partnershipLeads = pgTable("partnership_leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  institutionName: text("institution_name").notNull(),
  category: text("category").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  status: partnershipLeadStatus("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const databaseSchema = {
  newsletterSubscriptions,
  partnershipLeads,
};
