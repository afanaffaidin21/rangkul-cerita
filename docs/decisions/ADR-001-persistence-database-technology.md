# ADR-001: Persistence Database Technology

- Status: Accepted
- Scope: MVP operational persistence only

## Decision

Use PostgreSQL as the database technology for legitimate server-persisted domains: newsletter, partnership leads, and limited operational data. Keep Journal, check-in notes, reflection context, and other sensitive emotional data local-first and out of server database schemas by default.

Defer the hosting/provider selection until deployment region, applicable Indonesian privacy/compliance requirements, budget, and the actual hosting topology are confirmed. The selected provider must offer migration-controlled schema changes, automated backups with documented retention, tested recovery, encrypted transport and storage, serverless-safe connection handling, and a documented data-processing/location posture.

## Candidates evaluated

- Neon: PostgreSQL-compatible, strong serverless/Next.js ergonomics and branching; provider-specific backup, region, retention, and connection limits require confirmation.
- Supabase: PostgreSQL with mature TypeScript tooling and backups; its broader platform is unnecessary for this MVP and increases service coupling unless its region and operational features are required.
- Render Postgres: straightforward managed PostgreSQL and simple operations; fewer edge/serverless-specific database features and plan/region recovery details require confirmation.
- Self-managed PostgreSQL: maximum deployment and location control; rejected for MVP due to backup, patching, monitoring, and recovery overhead.

## Consequences

The application should use a small database boundary and migration tooling when implementation begins. No generic user activity or emotional-history table is permitted. Provider choice remains an explicit deployment decision rather than an assumption based on popularity.
