# Rangkul Cerita --- Application Architecture

> **Document Type:** Technical Architecture & Engineering Contract\
> **Status:** Development source of truth\
> **Priority:** P2 --- Architecture, constrained by P0/P1\
> **Applies To:** Frontend, backend, API, AI, safety, validation,
> configuration, persistence, observability, testing, and deployment

## 1. Purpose

Dokumen ini mendefinisikan target technical architecture Rangkul Cerita
agar codebase mudah dipahami manusia dan coding agent, aman untuk
sensitive emotional-support flows, maintainable, testable, dan scalable
tanpa premature complexity.

Architecture wajib mengikuti `PRD.md`, `AGENTS.md`, `docs/SAFETY.md`,
dan `docs/DATA_PRIVACY.md`.

``` text
Safety / Privacy
>
Architecture Convenience
```

## 2. Core Architecture Principles

``` text
Server by default
Client only when needed

Safety before AI
Validation at boundaries

Domain logic outside routes
Local-first sensitive data
Server-minimal persistence

Configuration centralized
Provider boundaries explicit

Small modules
Incremental migration
```

Hindari God Components, God API Routes, duplicated business logic,
global mutable state, hardcoded operational config, fake persistence,
premature microservices, dan premature abstraction.

## 3. Technology Baseline

Current application baseline:

``` text
Next.js
React
TypeScript
Node.js runtime
```

Gunakan package manager dan dependency versions project yang sudah ada
kecuali perubahan memang dibutuhkan.

Jangan upgrade framework atau mengganti technology stack sebagai bagian
dari task yang tidak terkait.

## 4. Target System Overview

``` text
                         ┌────────────────────┐
                         │      Browser       │
                         │ UI + Local Data    │
                         └─────────┬──────────┘
                                   │ HTTPS
                                   ▼
                         ┌────────────────────┐
                         │   Next.js Server   │
                         │ Routes / Services  │
                         └──────┬─────┬───────┘
                                │     │
                    ┌───────────┘     └────────────┐
                    ▼                              ▼
          ┌──────────────────┐           ┌──────────────────┐
          │ Safety / AI      │           │ Persistence      │
          │ Services         │           │ Services         │
          └────────┬─────────┘           └────────┬─────────┘
                   │                              │
                   ▼                              ▼
          ┌──────────────────┐           ┌──────────────────┐
          │ AI Provider      │           │ Database /       │
          │                  │           │ External Provider│
          └──────────────────┘           └──────────────────┘
```

Journal dan sensitive emotional data tetap local-first kecuali ada
perubahan requirement yang secara eksplisit disetujui.

## 5. Target Repository Structure

``` text
src/
├── app/
│   ├── api/
│   ├── check-in/
│   ├── journal/
│   ├── resources/
│   ├── articles/
│   ├── help/
│   ├── safety/
│   ├── privacy/
│   ├── about/
│   └── partnership/
│
├── features/
│   ├── checkin/
│   ├── journal/
│   ├── safety/
│   ├── human-support/
│   ├── resources/
│   ├── articles/
│   ├── newsletter/
│   ├── partnership/
│   └── privacy/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── lib/
│   ├── ai/
│   ├── safety/
│   ├── validation/
│   ├── config/
│   ├── database/
│   ├── logging/
│   └── rate-limit/
│
└── types/
```

Ini target architecture, bukan izin untuk melakukan one-shot repository
rewrite. Migrasikan secara incremental ketika domain terkait disentuh.

## 6. Directory Responsibilities

### `app/`

Owns routes, layouts, route-level loading/error boundaries, page
composition, dan API entry points.

`app/` bukan lokasi utama business/domain logic.

Preferred route:

``` text
route.ts
→ validate
→ rate limit/auth if needed
→ call domain/service
→ map validated response
```

### `features/`

Owns domain-specific UI dan logic.

Contoh:

``` text
features/checkin/
├── components/
├── hooks/
├── services/
├── schemas/
├── types/
└── utils/
```

Hanya buat subfolder yang benar-benar diperlukan.

### `components/ui/`

Hanya domain-agnostic primitives seperti Button, Input, Textarea,
Dialog, Badge, Card primitive, Container, dan Spinner.

### `components/layout/`

Shared structural components seperti Header, Footer, PageShell, Section,
dan Navigation.

### `components/shared/`

Gunakan secara terbatas untuk component yang benar-benar dipakai lintas
domain tetapi bukan primitive. Jangan jadikan dumping ground.

## 7. Server Components by Default

Gunakan Server Components secara default.

Good candidates:

``` text
Hero
Trust content
Static feature sections
Articles
About
Footer
SEO content
Static resources
```

Client Components digunakan untuk state, event handlers, browser APIs,
forms, interactive check-in, journal editor, dialogs, dan hooks yang
membutuhkan browser.

Push `"use client"` serendah mungkin.

Preferred:

``` text
HomePage [Server]
├── Hero [Server]
├── Trust [Server]
├── CheckIn [Client]
├── Features [Server]
└── FAQAccordion [small Client]
```

## 8. Client State

Prioritas state:

``` text
URL / Server State when appropriate
↓
Local Component State
↓
Feature Context
↓
Global State only when justified
```

Jangan menambah global state library untuk simple form flow.

Sensitive journal/check-in content tidak boleh disalin ke global store
tanpa kebutuhan.

## 9. API Architecture

Required flow:

``` text
HTTP Request
     ↓
Runtime Validation
     ↓
Rate Limit / Authorization if required
     ↓
Domain Service
     ↓
Provider / Persistence
     ↓
Validated Result
     ↓
HTTP Response
```

API route harus tipis dan berfungsi sebagai orchestration layer.

## 10. API Response Contract

Gunakan response yang predictable.

``` ts
type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};
```

Jangan expose stack traces, raw prompts, secrets, atau sensitive
internal details ke client.

## 11. Runtime Validation

TypeScript bukan runtime validation.

Validate:

``` text
Browser → API
External Provider → Server
AI Provider → Application
Environment → Application
Database → Domain when needed
```

Prefer satu schema validation library yang sudah tersedia di project.
Jangan install multiple overlapping validation libraries.

Domain schemas sebaiknya dekat dengan domain. Cross-cutting schemas
dapat berada di `lib/validation/`.

## 12. AI Architecture

Target:

``` text
src/lib/ai/
├── provider.ts
├── config.ts
├── prompts.ts
├── schemas.ts
├── errors.ts
└── index.ts
```

Jangan hardcode provider/model configuration atau seluruh prompt logic
di API route.

Gunakan provider abstraction kecil agar business logic tidak tergantung
langsung pada syntax SDK tertentu. Jangan membuat enterprise
multi-provider framework jika belum dibutuhkan.

## 13. AI Request Flow

``` text
Validated User Input
        ↓
Safety Classification
        ↓
Routing Decision
        │
        ├── LOW
        │    └── Normal Reflection
        │
        ├── ELEVATED
        │    └── Restricted Supportive Reflection
        │
        ├── HIGH
        │    └── Controlled Safety Response
        │
        └── IMMINENT
             └── Controlled Emergency Response
```

Safety harus terjadi sebelum unrestricted generative reflection.

## 14. AI Output

Jika application behavior bergantung pada field dari AI, gunakan
structured output.

``` text
Provider Output
→ Parse
→ Schema Validate
→ Domain Validate
→ Render
```

Malformed output:

``` text
→ Safe Error / Fallback
```

Jangan render partial unpredictable output.

## 15. Safety Architecture

Canonical modules:

``` text
src/lib/safety/
├── contacts.ts
├── risk-levels.ts
├── detection.ts
├── messages.ts
├── schemas.ts
└── index.ts
```

Follow `docs/SAFETY.md`.

Jangan duplicate risk definitions, safety messages, atau crisis
contacts.

## 16. Trusted Safety Boundary

Jangan percaya client-supplied risk level untuk mengizinkan server-side
AI generation.

Server-side AI flow harus enforce required safety checks pada trusted
boundary.

Client classification dapat membantu rendering UI tetapi tidak boleh
bypass server safety.

HIGH dan IMMINENT menggunakan deterministic atau tightly controlled
responses, bukan generic free-form reflection.

## 17. Data Architecture

Follow:

``` text
LOCAL-FIRST
+
SERVER-MINIMAL
```

Jangan introduce server persistence untuk sensitive emotional/journal
data tanpa explicit architecture change dan review terhadap
`DATA_PRIVACY.md`.

## 18. Database Responsibility

Initial server persistence difokuskan pada legitimate persistent
domains:

``` text
Newsletter
Partnership
Operational configuration if required
```

Jangan membuat generic `user_activity` atau equivalent table yang
diam-diam mengumpulkan emotional history.

Centralize database client/config:

``` text
src/lib/database/
├── client.ts
└── ...
```

Database queries tidak boleh tersebar di React components.

## 19. Database Technology

Database technology belum dianggap frozen hanya karena suatu provider
populer.

Saat implementasi persistence dimulai, pilih berdasarkan:

-   deployment environment,
-   existing dependencies,
-   operational simplicity,
-   migration support,
-   privacy requirements,
-   backup/recovery requirements.

Dokumentasikan keputusan setelah dipilih.

## 20. Persistence Semantics

Mutation dianggap sukses hanya setelah required persistence benar-benar
berhasil.

Forbidden:

``` text
Receive form
→ return success
→ nothing persisted
```

Success UI harus mewakili actual success.

## 21. Newsletter Architecture

``` text
Newsletter Form
      ↓
Client Validation
      ↓
API Validation
      ↓
Rate Limit
      ↓
Persistence / Email Provider
      ↓
Confirmed Result
      ↓
Success UI
```

Jangan menggabungkan newsletter profile dengan emotional activity.

## 22. Partnership Architecture

``` text
Partnership Form
      ↓
Client Validation
      ↓
API Validation
      ↓
Rate Limit
      ↓
Database
      ↓
Optional Notification / CRM
      ↓
Confirmed Result
```

Primary requirement: lead tidak hilang.

Jika notification gagal tetapi database persistence berhasil, handle
sebagai explicit partial operational state.

## 23. Rate Limiting

Centralize rate-limit behavior:

``` text
src/lib/rate-limit/
```

Priority:

``` text
AI reflection
Newsletter
Partnership
Public mutation endpoints
```

Rate limits harus configurable dan memiliki graceful user-facing error
state.

## 24. Logging Architecture

Centralize structured logging:

``` text
src/lib/logging/
```

Allowed metadata:

``` text
requestId
timestamp
route
status
latency
errorCode
riskLevel when necessary
providerStatus
```

Never log raw:

``` text
journal
check-in note
crisis text
AI prompt containing user text
```

Follow `DATA_PRIVACY.md`.

## 25. Error Taxonomy

Gunakan stable internal error codes seperti:

``` text
VALIDATION_ERROR
RATE_LIMITED
AI_UNAVAILABLE
AI_INVALID_RESPONSE
SAFETY_CLASSIFIER_UNAVAILABLE
PERSISTENCE_FAILED
PROVIDER_UNAVAILABLE
```

User-facing message harus understandable dan tidak expose raw provider
errors.

## 26. Safety Failure

Safety classifier failure:

``` text
≠ LOW
```

Required:

``` text
Safety Failure
→ block normal unrestricted generation
→ safe fallback
→ retry / Human Support
```

## 27. AI Failure

LOW/ELEVATED AI failure:

``` text
Safe fallback
→ retry where appropriate
→ Human Support remains accessible
```

Jangan fabricate AI response.

## 28. Configuration Architecture

Centralize runtime configuration:

``` text
src/lib/config/
├── env.ts
├── app.ts
└── index.ts
```

Examples:

``` text
AI provider/model
AI timeout
Database URL
Rate-limit settings
External provider config
Feature flags only when justified
```

Validate required environment variables.

Jangan scatter `process.env.X` di seluruh application.

## 29. Secrets

Server secrets harus server-only.

Never expose through:

``` text
NEXT_PUBLIC_*
client bundle
browser logs
HTML
API response
```

Repository menggunakan `.env.example`, bukan real credentials.

## 30. External Provider Boundaries

Wrap external services behind explicit boundaries:

``` text
AI provider
Newsletter provider
Email provider
CRM
Analytics
Error monitoring
```

Provider SDK calls tidak boleh tersebar di seluruh codebase.

Handle:

``` text
timeout
invalid response
rate limit
network failure
provider outage
```

## 31. Timeouts and Retries

External network calls harus memiliki bounded timeout jika supported.

Retry hanya ketika aman.

``` text
AI generation
→ limited retry may be acceptable

Partnership insert
→ avoid duplicate submission

Newsletter
→ use duplicate prevention/idempotency when practical
```

Jangan blind retry non-idempotent operations.

## 32. Authentication

Authentication tidak diperlukan hanya karena product memiliki personal
content.

Jangan introduce accounts sampai explicit requirement muncul.

Jika account/cloud diperkenalkan nanti, revisit:

-   cloud storage,
-   authorization,
-   deletion,
-   export,
-   identity linkage,
-   minors,
-   session security.

## 33. Authorization

Future protected resources harus enforce server-side authorization.

``` text
Authentication ≠ Authorization
```

Hidden UI bukan access control.

## 34. Caching

Public static content dapat menggunakan framework caching.

Sensitive/personal responses harus menggunakan conservative cache
behavior.

Review khusus:

``` text
AI reflection
Safety response
Private export
Future account data
```

Jangan publicly cache personal content.

## 35. Sensitive Data in URLs

Never place emotional, journal, safety, email, atau personal content
dalam URL/query/path.

Gunakan request body atau local state.

## 36. Forms

Semua forms:

``` text
Client UX Validation
+
Server Runtime Validation
```

Client validation meningkatkan UX. Server validation adalah trust
boundary.

Submission states minimal:

``` text
idle
submitting
success
validation error
server error
rate limited
```

Prevent accidental duplicate submission while active.

## 37. Homepage Architecture

Target homepage mostly server-rendered dengan isolated interactive
islands.

``` text
HomePage [Server]
├── Hero [Server]
├── TrustProof [Server]
├── CheckInExperience [Client]
├── HowItWorks [Server]
├── CoreFeatures [Server]
├── HumanSupport [Server/Client if needed]
├── SafetyPrivacy [Server]
├── SocialProof [Server]
├── FAQ [small Client if needed]
└── FinalCTA [Server]
```

## 38. Dedicated Routes

Secondary content diarahkan ke:

``` text
/check-in
/journal
/resources
/articles
/help
/safety
/privacy
/about
/partnership
```

Jangan membuat empty routes hanya demi memenuhi documentation. Implement
incrementally.

## 39. SEO

Public informational pages menggunakan Next.js metadata capabilities
ketika relevan.

Hindari client-only rendering untuk SEO-critical static content.

Never expose sensitive user state in metadata.

## 40. Accessibility Architecture

Accessibility harus ditangani di reusable primitives ketika
memungkinkan.

Examples:

``` text
Dialog focus management
Button semantics
Form error association
Input labels
Reduced motion
```

Target critical journeys: WCAG 2.2 AA sesuai `DESIGN_SYSTEM.md`.

## 41. Styling Architecture

Follow `DESIGN_SYSTEM.md`.

Prefer centralized design tokens dan reusable primitives.

Jangan invent arbitrary per-page color, spacing, radius, shadow jika
token sudah tersedia.

## 42. Testing Layers

``` text
Unit
→ Domain logic

Integration
→ API / services / provider boundaries

Component
→ Critical UI behavior

End-to-End
→ Core journey
```

Safety tetap highest testing priority.

## 43. Safety Tests

Architecture harus memungkinkan tests yang membuktikan:

``` text
HIGH
→ normal reflection NOT called

IMMINENT
→ normal reflection NOT called
```

Safety routing harus bisa dites tanpa full browser E2E untuk setiap
fixture.

## 44. Core Product Tests

Critical flow:

``` text
Check-in
→ Reflection
→ Journal
→ Next Step
→ Human Support
```

Test happy path dan meaningful failures.

Jangan mengandalkan snapshot-only testing untuk business-critical
behavior.

## 45. API Tests

Cover:

``` text
valid input
invalid input
rate limiting
provider failure
persistence failure
malformed AI output
safety routing
```

## 46. Test Isolation

Automated tests tidak boleh call production external services.

Gunakan controlled mocks/fakes di provider boundary.

Fake untuk testing boleh. Fake functionality yang ditampilkan ke
production user tidak boleh.

Use synthetic fixtures, bukan real user journal/crisis data.

## 47. Observability

Production observability harus bisa menjawab:

``` text
Is the system healthy?
Which route failed?
Which provider failed?
How slow is it?
Which error category occurred?
```

tanpa menjawab:

``` text
What exactly did the user write?
```

## 48. Dependencies

Sebelum install package:

1.  inspect existing dependencies,
2.  prefer framework/platform capability,
3.  verify maintenance,
4.  evaluate bundle/security impact,
5.  confirm actual need.

Avoid overlapping libraries.

## 49. Repository Hygiene

Do not commit:

``` text
node_modules
.next
.env
unnecessary build artifacts
project ZIPs inside public/
```

Keep `.gitignore` correct.

## 50. Build Contract

Significant changes harus memverifikasi scripts yang tersedia.

Target:

``` text
TypeScript passes
Lint passes
Relevant tests pass
Production build passes
```

Jangan claim verification yang tidak dijalankan.

## 51. CI Direction

Minimum useful pipeline:

``` text
Install
→ Typecheck
→ Lint
→ Tests
→ Build
```

Safety tests harus block deployment jika gagal.

## 52. Deployment

Deployment harus menjaga:

-   server-only secrets,
-   HTTPS,
-   validated environment config,
-   database migration discipline,
-   provider configuration,
-   safe logging.

Deployment provider belum ditentukan oleh dokumen ini.

## 53. Database Migrations

Ketika database diperkenalkan:

-   schema changes migration-controlled,
-   no manual ad hoc production schema edits,
-   destructive migrations require review,
-   backup/recovery considered.

Backup retention harus konsisten dengan `DATA_PRIVACY.md`.

## 54. Architecture Decision Records

Jangan buat ADR untuk trivial choices.

ADR hanya untuk keputusan besar seperti:

``` text
Database selection
Authentication introduction
Cloud journal storage
AI provider migration
Encryption architecture
Institutional reporting architecture
```

Jika diperlukan:

``` text
docs/decisions/
```

## 55. Incremental Refactor Strategy

Recommended sequence:

``` text
1. Centralize safety
2. Centralize AI/config
3. Add runtime validation
4. Add real persistence
5. Extract affected domains
6. Reduce client boundaries
7. Simplify homepage
8. Polish UI
```

Jangan pause product development untuk full repository rewrite.

## 56. Refactor Boundary

Jika task menyentuh satu domain, refactor domain itu secukupnya untuk
memenuhi target architecture.

Example:

``` text
Task: Fix Check-in safety
```

Allowed:

``` text
extract checkin/safety logic
centralize affected schemas
clean affected API route
```

Not automatically allowed:

``` text
rewrite Articles
replace styling system
upgrade Next.js
rewrite Newsletter
```

## 57. Code Quality

Prefer:

``` text
explicit
typed
small
predictable
testable
```

Avoid:

``` text
clever
deeply generic
magic
overabstracted
```

Names harus menjelaskan domain meaning.

Prefer:

``` text
classifySafetyRisk()
createReflection()
submitPartnershipLead()
deleteLocalJournal()
```

## 58. Dependency Direction

Preferred:

``` text
UI
↓
Feature / Domain
↓
Cross-cutting Lib
↓
External Provider
```

Cross-cutting infrastructure tidak boleh bergantung pada feature UI.

Avoid circular dependencies.

## 59. Server/Client Import Safety

Server-only modules yang berisi secrets/provider clients tidak boleh
di-import oleh Client Components.

Keep server-only responsibilities explicitly separated.

## 60. Privacy-Aware Architecture Review

Setiap perubahan berikut harus direview terhadap `DATA_PRIVACY.md`:

``` text
new database table
new analytics event property
new third-party SDK
new persistent browser key
new server log field
new AI context field
new admin view
new account identity link
```

## 61. Safety-Aware Architecture Review

Setiap perubahan berikut harus direview terhadap `SAFETY.md`:

``` text
new emotional free-text input
new AI prompt
new AI model/provider
new reflection flow
new journal AI behavior
new human-support flow
new safety contact
new safety UI dismissal behavior
```

Model upgrade bukan safety-neutral change.

## 62. Definition of Done --- Architecture

P2 Architecture selesai ketika:

-   [ ] Domain boundaries understandable
-   [ ] Safety logic centralized
-   [ ] AI logic centralized
-   [ ] Runtime config centralized
-   [ ] Runtime validation exists at external boundaries
-   [ ] API routes are thin orchestration layers
-   [ ] Sensitive persistence follows local-first policy
-   [ ] Database access centralized appropriately
-   [ ] Logging excludes raw sensitive text
-   [ ] Rate limiting exists for relevant endpoints
-   [ ] Server/Client boundaries intentional
-   [ ] Homepage not unnecessarily client-rendered
-   [ ] Error states predictable
-   [ ] External provider failures handled
-   [ ] Safety logic independently testable
-   [ ] Core journey has meaningful tests
-   [ ] Production build succeeds
-   [ ] Documentation reflects actual implementation

## 63. Architecture Review Questions

Before significant implementation:

``` text
Which domain owns this?

Does this need to run in the browser?

Does this data need to leave the browser?

Does this data need persistence?

Does this path pass through Safety Gate?

Where is runtime validation?

What happens if the provider fails?

Could this expose sensitive content?

Does an existing abstraction already solve it?

Can this change be smaller?

Can it be tested?
```

## 64. Final Architecture Principle

Target kita bukan architecture paling sophisticated.

Target:

``` text
Simple enough to understand.
Strict enough to protect safety boundaries.
Minimal enough to protect sensitive data.
Modular enough to change safely.
Testable enough to trust.
```

Architecture Rangkul Cerita harus melindungi:

``` text
Product Behavior
User Safety
Privacy
Maintainability
```

dan tidak boleh menjadi alasan untuk menambah complexity yang belum
diperlukan.

## 65. Security Headers Baseline

Production responses carry a centralized security-header baseline set by
`middleware.ts` (single source; do not scatter header logic across routes).

Static headers on every runtime response:

``` text
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

Production-only Content-Security-Policy, built per request with a fresh
script nonce:

``` text
default-src 'self'
base-uri 'self'
form-action 'self'
frame-ancestors 'none'
frame-src 'none'
object-src 'none'
img-src 'self' data:
font-src 'self' https://fonts.gstatic.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
connect-src 'self'
script-src 'self' 'nonce-<per-request>'
```

Allowances reflect current runtime truth:

-   `style-src 'unsafe-inline'` covers inline style attributes used by the
    mood-checker color swatches and is safe because style cannot execute
    script; external Google Fonts CSS is allowlisted separately.
-   `font-src https://fonts.gstatic.com` covers Google Fonts font files.
-   `connect-src 'self'` covers all client calls (`/api/*`); the Gemini
    provider call is server-side and not subject to browser CSP.

The App Router applies the request-header CSP nonce to its inline
bootstrap/flight scripts during rendering. Pages therefore render
dynamically (`dynamic = "force-dynamic"` in the root layout); prebuilt
static HTML cannot carry a per-request nonce. CSP is skipped in
development so Next.js dev tooling keeps working.

HSTS is intentionally deferred to issue #42 because it depends on the
production hosting decision.
