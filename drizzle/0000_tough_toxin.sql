CREATE TYPE "public"."newsletter_subscription_status" AS ENUM('active', 'unsubscribed');--> statement-breakpoint
CREATE TABLE "newsletter_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"consent_version" text NOT NULL,
	"status" "newsletter_subscription_status" DEFAULT 'active' NOT NULL,
	"provider_id" text,
	CONSTRAINT "newsletter_subscriptions_email_unique" UNIQUE("email")
);
