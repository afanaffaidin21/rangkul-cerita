# Rangkul Cerita --- Implementation Plan

> **Document Type:** Execution Plan & Development Tracker\
> **Status:** Active\
> **Purpose:** Menentukan urutan implementasi, dependency, acceptance
> criteria, verification, dan progress project\
> **Primary References:** `PRD.md`, `AGENTS.md`, `docs/SAFETY.md`,
> `docs/DATA_PRIVACY.md`, `docs/ARCHITECTURE.md`,
> `docs/DESIGN_SYSTEM.md`

------------------------------------------------------------------------

# 1. Purpose

Dokumen ini adalah **current execution state** Rangkul Cerita.

Berbeda dari PRD dan specification documents:

``` text
PRD / SAFETY / DATA_PRIVACY / ARCHITECTURE / DESIGN_SYSTEM
→ WHAT SHOULD BE TRUE

IMPLEMENTATION_PLAN
→ WHAT WE ARE DOING NOW
```

Dokumen ini harus diperbarui setiap kali pekerjaan development yang
signifikan selesai, berubah scope, atau blocked.

Jangan gunakan dokumen ini untuk mengubah requirement permanen yang
sudah ditetapkan di specification documents.

------------------------------------------------------------------------

# 2. Execution Principle

Development mengikuti prioritas:

``` text
P0 — Safety / Product Truth / Data Architecture
↓
P1 — Backend Reliability / Core Product
↓
P2 — Architecture / Homepage
↓
P3 — UI Polish
```

Rule:

``` text
P0 > P1 > P2 > P3
```

Jangan mengerjakan polishing atau feature expansion ketika requirement
dengan prioritas lebih tinggi masih unresolved, kecuali perubahan kecil
tersebut diperlukan untuk menyelesaikan phase aktif.

------------------------------------------------------------------------

# 3. Current High-Level Status

``` text
P0 — Safety Correctness
░░░░░░░░░░ 0%

P0 — Product Truth
░░░░░░░░░░ 0%

P0 — Data Architecture
░░░░░░░░░░ 0%

P1 — Backend Reliability
░░░░░░░░░░ 0%

P1 — Core Product
░░░░░░░░░░ 0%

P2 — Architecture
░░░░░░░░░░ 0%

P2 — Homepage Simplification
░░░░░░░░░░ 0%

P3 — UI Polish
░░░░░░░░░░ 0%
```

Documentation foundation:

``` text
PRD.md
AGENTS.md
docs/SAFETY.md
docs/DATA_PRIVACY.md
docs/ARCHITECTURE.md
docs/DESIGN_SYSTEM.md
docs/IMPLEMENTATION_PLAN.md
```

Status:

``` text
Specification Foundation
██████████ 100%
```

------------------------------------------------------------------------

# 4. Global Rules Before Implementation

Every task must follow:

``` text
1. Read relevant specification
2. Inspect existing implementation
3. Identify affected files
4. Identify safety/privacy impact
5. Implement smallest safe change
6. Run relevant verification
7. Update this document
```

Never mark a task `Completed` merely because code was generated.

Completed means:

``` text
Implementation exists
+
Acceptance criteria satisfied
+
Relevant verification passed
```

------------------------------------------------------------------------

# 5. Status Definitions

Use only:

``` text
PLANNED
IN PROGRESS
BLOCKED
COMPLETED
DEFERRED
```

### PLANNED

Requirement sudah jelas tetapi implementation belum dimulai.

### IN PROGRESS

Implementation aktif dilakukan.

### BLOCKED

Tidak dapat dilanjutkan tanpa dependency/decision.

### COMPLETED

Acceptance criteria dan relevant verification sudah selesai.

### DEFERRED

Sengaja ditunda karena bukan current priority.

------------------------------------------------------------------------

# 6. PHASE 01 --- P0 Safety Correctness

## Objective

Membuat safety system yang konsisten, centralized, testable, dan tidak
bergantung pada keyword-only routing.

Reference:

``` text
PRD.md
AGENTS.md
docs/SAFETY.md
docs/DATA_PRIVACY.md
```

------------------------------------------------------------------------

## 6.1 Audit Existing Safety Implementation

**Status:** PLANNED

Inspect:

-   all crisis contact constants,
-   SafetyModal,
-   SafetyUtilityBar,
-   Human Support,
-   Footer safety content,
-   AI reflection API,
-   existing keyword matching,
-   fallback responses,
-   journal/check-in safety paths.

Deliverable:

``` text
List of:
- duplicate contacts
- stale contacts
- bypass paths
- duplicated safety logic
- unsafe fallback behavior
```

Acceptance:

-   [ ] Every current safety implementation location identified
-   [ ] All duplicate contact definitions identified
-   [ ] All AI paths receiving emotional text identified
-   [ ] Existing HIGH/IMMINENT bypass risks identified

------------------------------------------------------------------------

## 6.2 Centralize Crisis Contacts

**Status:** PLANNED

Create canonical source:

``` text
src/lib/safety/contacts.ts
```

Initial verified categories:

``` text
Healing119
PSC 119
Emergency 112
```

Rules:

-   no duplicated phone numbers in components,
-   no unverified third-party hotline,
-   UI consumes centralized config.

Acceptance:

-   [ ] Central safety contact config exists
-   [ ] Safety components import centralized contacts
-   [ ] Duplicate hardcoded contacts removed
-   [ ] Contact labels/purpose consistent
-   [ ] Official contact behavior matches `SAFETY.md`

Verification:

``` text
Search repository for old phone constants
Manual CTA verification
```

------------------------------------------------------------------------

## 6.3 Implement Risk Model

**Status:** PLANNED

Canonical internal levels:

``` text
LOW
ELEVATED
HIGH
IMMINENT
```

Target module:

``` text
src/lib/safety/risk-levels.ts
```

Acceptance:

-   [ ] One canonical type exists
-   [ ] No competing risk enums
-   [ ] Risk level remains internal
-   [ ] UI does not render diagnostic classification labels

------------------------------------------------------------------------

## 6.4 Build Safety Detection Layer

**Status:** PLANNED

Target:

``` text
src/lib/safety/detection.ts
src/lib/safety/schemas.ts
```

Detection must consider:

-   explicit self-harm language,
-   indirect death wish,
-   intent,
-   immediacy,
-   context,
-   negation,
-   third-person statement,
-   quotation,
-   historical context,
-   Indonesian slang/variation.

Keyword matching may be retained only as one signal.

Acceptance:

-   [ ] Detection returns structured classification
-   [ ] Context is represented
-   [ ] Classifier failure does not default to LOW
-   [ ] Risk classification can be tested independently

------------------------------------------------------------------------

## 6.5 Implement Trusted Safety Gate

**Status:** PLANNED

Server-side flow:

``` text
Input
→ Validate
→ Safety Gate
→ Route by risk
```

Rules:

``` text
LOW
→ Normal reflection allowed

ELEVATED
→ Restricted supportive reflection

HIGH
→ Normal reflection blocked

IMMINENT
→ Normal reflection blocked
```

Acceptance:

-   [ ] Client cannot bypass safety using supplied riskLevel
-   [ ] HIGH does not call normal reflection
-   [ ] IMMINENT does not call normal reflection
-   [ ] Safety classifier failure fails safely

------------------------------------------------------------------------

## 6.6 Controlled Safety Responses

**Status:** PLANNED

Target:

``` text
src/lib/safety/messages.ts
```

HIGH and IMMINENT responses should be deterministic/tightly controlled.

Acceptance:

-   [ ] HIGH response includes crisis-support path
-   [ ] IMMINENT response prioritizes emergency action
-   [ ] Human support/trusted-person actions available
-   [ ] No diagnostic language
-   [ ] No engagement CTA in emergency flow

------------------------------------------------------------------------

## 6.7 Safety UI Integration

**Status:** PLANNED

Affected surfaces may include:

``` text
Check-in
Reflection
Journal
Human Support
SafetyModal
SafetyUtilityBar
```

Acceptance:

-   [ ] HIGH replaces normal reflection state
-   [ ] IMMINENT replaces normal reflection state
-   [ ] Dismissal does not route same flagged input into normal AI
-   [ ] Primary safety CTA visible on mobile
-   [ ] Keyboard access works
-   [ ] Internal risk labels not visible

------------------------------------------------------------------------

## 6.8 Safety Test Suite

**Status:** PLANNED

Recommended coverage:

``` text
LOW
ELEVATED
HIGH
IMMINENT
negation
third-person
quotation
historical
slang
typo
false positive
classifier failure
routing
```

Critical assertions:

``` text
HIGH
→ normalReflectionCalled = false

IMMINENT
→ normalReflectionCalled = false
```

Acceptance:

-   [ ] Unit tests for classification
-   [ ] Routing tests
-   [ ] Failure tests
-   [ ] Indonesian-language fixtures
-   [ ] No real user crisis content used as fixture

------------------------------------------------------------------------

## 6.9 Phase 01 Exit Criteria

P0 Safety is complete only when:

-   [ ] Contacts centralized and verified
-   [ ] Risk model canonical
-   [ ] Detection contextual
-   [ ] Safety Gate trusted/server-enforced
-   [ ] HIGH/IMMINENT bypass impossible in tested paths
-   [ ] Safety responses controlled
-   [ ] Safety UI integrated
-   [ ] Automated regression tests pass
-   [ ] Production build passes

------------------------------------------------------------------------

# 7. PHASE 02 --- P0 Product Truth

## Objective

Memastikan semua visible product claims sesuai actual capability.

Reference:

``` text
PRD.md
AGENTS.md
docs/DATA_PRIVACY.md
docs/SAFETY.md
```

------------------------------------------------------------------------

## 7.1 Product Claims Audit

**Status:** PLANNED

Search all UI/copy for claims related to:

``` text
encryption
privacy
anonymity
PIN
data export
data deletion
testimonials
expert review
clinical review
institutional reporting
AI capability
submission success
```

Deliverable:

``` text
Claim
→ Current implementation
→ Supported? Yes/No
→ Required action
```

Acceptance:

-   [ ] All sensitive trust claims cataloged
-   [ ] Unsupported claims identified

------------------------------------------------------------------------

## 7.2 Remove Fake PIN Security

**Status:** PLANNED

Default decision:

``` text
REMOVE / DISABLE
```

until real security architecture exists.

Acceptance:

-   [ ] No cosmetic PIN security claim
-   [ ] No false "PIN active" state
-   [ ] Related copy removed/updated

------------------------------------------------------------------------

## 7.3 Fix Data Export

**Status:** PLANNED

If retained:

``` text
Export
→ actual local user data
→ real JSON
```

Otherwise disable/remove.

Acceptance:

-   [ ] No dummy export
-   [ ] Scope accurately described
-   [ ] Export failure does not create fake file

------------------------------------------------------------------------

## 7.4 Fix Data Deletion Claims

**Status:** PLANNED

Replace broad:

``` ts
localStorage.clear()
```

with targeted deletion.

Acceptance:

-   [ ] Rangkul-owned keys only
-   [ ] UI distinguishes local deletion vs server deletion
-   [ ] Success shown only after actual completion

------------------------------------------------------------------------

## 7.5 Testimonials & Expert Review

**Status:** PLANNED

Rules:

-   fictional testimonials removed or explicitly development-only,
-   expert review claims removed until legitimate,
-   no implied clinical validation.

Acceptance:

-   [ ] No fictional production testimonial
-   [ ] No unsupported reviewed-by claim

------------------------------------------------------------------------

## 7.6 Institutional Reporting Claims

**Status:** PLANNED

Remove unsupported copy related to:

``` text
institution dashboard
aggregated reporting
student emotional reporting
```

until architecture exists.

Acceptance:

-   [ ] No reporting claim beyond real implementation

------------------------------------------------------------------------

## 7.7 Phase 02 Exit Criteria

-   [ ] UI claims match actual capabilities
-   [ ] Fake security removed
-   [ ] Fake export removed/fixed
-   [ ] Deletion truthful
-   [ ] Testimonials truthful
-   [ ] Expert-review language truthful
-   [ ] Institutional reporting claims removed unless real
-   [ ] Relevant copy regression reviewed

------------------------------------------------------------------------

# 8. PHASE 03 --- P0 Data Architecture

## Objective

Implement the approved:

``` text
LOCAL-FIRST
+
SERVER-MINIMAL
```

architecture.

Reference:

``` text
docs/DATA_PRIVACY.md
docs/ARCHITECTURE.md
```

------------------------------------------------------------------------

## 8.1 Inventory Current Data

**Status:** PLANNED

Identify:

-   localStorage keys,
-   session storage,
-   API payloads,
-   AI provider payloads,
-   form submissions,
-   logs,
-   analytics,
-   third-party scripts.

Acceptance:

-   [ ] Current data-flow inventory complete
-   [ ] Sensitive fields identified
-   [ ] Unknown/unused storage identified

------------------------------------------------------------------------

## 8.2 Namespace Browser Storage

**Status:** PLANNED

Target:

``` text
rangkul.*
```

Acceptance:

-   [ ] All persistent app-owned keys namespaced
-   [ ] No generic collisions
-   [ ] Deletion uses explicit key list/prefix

------------------------------------------------------------------------

## 8.3 Journal Local-First

**Status:** PLANNED

Default:

``` text
Journal
→ local browser storage
```

Do not send journal to server/AI automatically.

Acceptance:

-   [ ] Journal not server-persisted by default
-   [ ] AI processing only on explicit user action
-   [ ] UI accurately states storage behavior

------------------------------------------------------------------------

## 8.4 Sanitize Logs

**Status:** PLANNED

Remove raw:

``` text
journal
check-in text
crisis text
AI prompt
reflection content
```

Acceptance:

-   [ ] Standard logs contain metadata only
-   [ ] Error logs sanitized
-   [ ] Development logs also sanitized

------------------------------------------------------------------------

## 8.5 Analytics Boundary

**Status:** PLANNED

Allowed event direction:

``` text
checkin_started
checkin_completed
reflection_requested
journal_opened
human_support_opened
```

Forbidden event properties:

``` text
raw emotional text
journal
crisis input
AI response
```

Acceptance:

-   [ ] No sensitive analytics payloads
-   [ ] Third-party scripts reviewed

------------------------------------------------------------------------

## 8.6 AI Data Boundary

**Status:** PLANNED

Acceptance:

-   [ ] Only minimum required text sent
-   [ ] No unrelated profile/contact data included
-   [ ] UI disclosure reflects AI processing
-   [ ] Provider configuration documented when finalized

------------------------------------------------------------------------

## 8.7 Retention & Processor Inventory

**Status:** PLANNED

Create actual implementation inventory for:

``` text
AI provider
hosting
database
newsletter provider
analytics
error monitoring
```

Acceptance:

-   [ ] Real vendors documented
-   [ ] Purpose/data/retention known
-   [ ] Unknowns explicitly marked
-   [ ] No unsupported privacy statement remains

------------------------------------------------------------------------

## 8.8 Phase 03 Exit Criteria

-   [ ] Sensitive-data map complete
-   [ ] Browser storage namespaced
-   [ ] Journal local-first
-   [ ] Logging sanitized
-   [ ] Analytics sanitized
-   [ ] AI data minimized
-   [ ] Retention documented
-   [ ] Processor inventory documented
-   [ ] Product copy matches implementation

------------------------------------------------------------------------

# 9. PHASE 04 --- P1 Backend Reliability

## Objective

Mengubah placeholder API menjadi real reliable backend behavior.

Reference:

``` text
PRD.md
docs/ARCHITECTURE.md
docs/DATA_PRIVACY.md
```

------------------------------------------------------------------------

## 9.1 Select Persistence Stack

**Status:** PLANNED

Decision factors:

-   deployment environment,
-   operational simplicity,
-   migration support,
-   backup/recovery,
-   privacy,
-   existing dependencies.

Deliverable:

``` text
Database/provider decision
+
short rationale
```

If decision is significant, create ADR.

------------------------------------------------------------------------

## 9.2 Database Foundation

**Status:** PLANNED

Target:

``` text
src/lib/database/
```

Acceptance:

-   [ ] Central client/config
-   [ ] Environment validation
-   [ ] Migration strategy
-   [ ] No sensitive journal tables by default

------------------------------------------------------------------------

## 9.3 Newsletter Persistence

**Status:** PLANNED

Flow:

``` text
Client
→ Validation
→ API
→ Rate Limit
→ Persistence/Provider
→ Confirmed Success
```

Acceptance:

-   [ ] Email truly persisted/subscribed
-   [ ] Duplicate behavior defined
-   [ ] Failure state truthful
-   [ ] Unsubscribe path exists before production

------------------------------------------------------------------------

## 9.4 Partnership Persistence

**Status:** PLANNED

Flow:

``` text
Form
→ Validation
→ Rate Limit
→ Database
→ Optional Notification/CRM
→ Success
```

Acceptance:

-   [ ] Lead survives request lifecycle
-   [ ] Persistence failure returns failure
-   [ ] Duplicate submissions considered
-   [ ] No sensitive emotional data requested

------------------------------------------------------------------------

## 9.5 Runtime Validation

**Status:** PLANNED

Validate:

``` text
forms
API request
API response
AI output
env config
provider response
```

Acceptance:

-   [ ] Runtime schemas exist at external boundaries
-   [ ] Malformed payload rejected safely

------------------------------------------------------------------------

## 9.6 Rate Limiting

**Status:** PLANNED

Priority:

``` text
AI reflection
Newsletter
Partnership
Public mutation APIs
```

Acceptance:

-   [ ] Server-enforced
-   [ ] Graceful UI state
-   [ ] Configurable thresholds

------------------------------------------------------------------------

## 9.7 Structured Logging

**Status:** PLANNED

Acceptance:

-   [ ] Request IDs available where useful
-   [ ] Error taxonomy used
-   [ ] Sensitive raw text absent
-   [ ] Provider errors sanitized

------------------------------------------------------------------------

## 9.8 Phase 04 Exit Criteria

-   [ ] Real database/persistence exists
-   [ ] Newsletter real
-   [ ] Partnership real
-   [ ] Runtime validation complete for current public APIs
-   [ ] Rate limiting active
-   [ ] Safe structured logging active
-   [ ] Error states tested
-   [ ] Production build passes

------------------------------------------------------------------------

# 10. PHASE 05 --- P1 Core Product

## Objective

Perfect one reliable end-to-end journey before adding features.

``` text
Check-in
→ Reflection
→ Journal
→ Next Step
→ Human Support
```

------------------------------------------------------------------------

## 10.1 Check-In

**Status:** PLANNED

Improve:

-   progressive disclosure,
-   mobile ergonomics,
-   cognitive load,
-   validation,
-   safety integration.

Acceptance:

-   [ ] Clear start
-   [ ] No dead end
-   [ ] Safety Gate connected
-   [ ] Works at 320/375/390 widths

------------------------------------------------------------------------

## 10.2 Reflection

**Status:** PLANNED

Acceptance:

-   [ ] Non-diagnostic output
-   [ ] AI schema validated
-   [ ] Safety routing enforced
-   [ ] Failure fallback available
-   [ ] One clear next step

------------------------------------------------------------------------

## 10.3 Journal / Cerita

**Status:** PLANNED

Acceptance:

-   [ ] Continues naturally from reflection
-   [ ] Local-first behavior
-   [ ] Storage truth visible
-   [ ] No accidental AI/server sync
-   [ ] Keyboard/mobile behavior usable

------------------------------------------------------------------------

## 10.4 Next Step

**Status:** PLANNED

Possible categories:

``` text
Grounding
Rest
Reflection
Small Action
Talk to Someone
Professional Support
```

Acceptance:

-   [ ] One primary next step
-   [ ] No overwhelming recommendation list
-   [ ] Contextually linked to reflection

------------------------------------------------------------------------

## 10.5 Human Support

**Status:** PLANNED

Acceptance:

-   [ ] Always discoverable
-   [ ] More prominent for ELEVATED
-   [ ] Primary for HIGH/IMMINENT
-   [ ] Uses centralized contacts

------------------------------------------------------------------------

## 10.6 Core Journey E2E

**Status:** PLANNED

Test:

``` text
Check-in
→ Reflection
→ Journal
→ Next Step
→ Human Support
```

Include:

-   happy path,
-   AI failure,
-   validation failure,
-   safety escalation,
-   local persistence behavior.

------------------------------------------------------------------------

## 10.7 Phase 05 Exit Criteria

-   [ ] Core journey works end-to-end
-   [ ] No dead ends
-   [ ] Safety integrated
-   [ ] Local-first behavior correct
-   [ ] Failure states handled
-   [ ] Mobile critical flow verified
-   [ ] E2E tests pass

------------------------------------------------------------------------

# 11. PHASE 06 --- P2 Architecture Refactor

## Objective

Migrate prototype structure toward target architecture without rewriting
everything.

------------------------------------------------------------------------

## 11.1 Centralize AI

**Status:** PLANNED

Target:

``` text
src/lib/ai/
```

Acceptance:

-   [ ] Provider config centralized
-   [ ] Prompt ownership clear
-   [ ] Output schemas centralized appropriately
-   [ ] API route simplified

------------------------------------------------------------------------

## 11.2 Centralize Config

**Status:** PLANNED

Target:

``` text
src/lib/config/
```

Acceptance:

-   [ ] Environment validation centralized
-   [ ] No scattered provider model constants
-   [ ] Secrets remain server-only

------------------------------------------------------------------------

## 11.3 Extract Feature Domains

**Status:** PLANNED

Migrate incrementally:

``` text
checkin
journal
safety
human-support
newsletter
partnership
```

Acceptance:

-   [ ] Domain ownership clearer
-   [ ] No giant generic component folder growth
-   [ ] No unnecessary rewrite of unrelated features

------------------------------------------------------------------------

## 11.4 Reduce Client Components

**Status:** PLANNED

Audit:

``` text
"use client"
```

Acceptance:

-   [ ] Static homepage content server-rendered where practical
-   [ ] Client boundaries pushed down
-   [ ] No functionality regression

------------------------------------------------------------------------

## 11.5 Error Architecture

**Status:** PLANNED

Acceptance:

-   [ ] Stable error codes
-   [ ] Route/page error boundaries
-   [ ] Local feature fallback states
-   [ ] No raw provider error exposure

------------------------------------------------------------------------

## 11.6 Phase 06 Exit Criteria

-   [ ] Safety centralized
-   [ ] AI centralized
-   [ ] Config centralized
-   [ ] Domain boundaries understandable
-   [ ] API routes thin
-   [ ] Server/client boundaries intentional
-   [ ] Error behavior predictable
-   [ ] Tests/build pass

------------------------------------------------------------------------

# 12. PHASE 07 --- P2 Homepage Simplification

## Objective

Reduce homepage from content-heavy presentation into focused user
journey.

Target approximately:

``` text
9–10 primary sections
```

------------------------------------------------------------------------

## 12.1 Final Homepage Structure

**Status:** PLANNED

Recommended:

``` text
01 Hero
02 Trust / Safety Proof
03 Interactive Check-in
04 How Rangkul Cerita Helps
05 Core Features
06 Human Support Bridge
07 Safety & Privacy
08 Social / Expert Proof
09 FAQ
10 Final CTA
```

Product truth applies to Social/Expert Proof.

------------------------------------------------------------------------

## 12.2 Move Secondary Content

**Status:** PLANNED

Target routes:

``` text
/resources
/articles
/help
/safety
/privacy
/about
/partnership
```

Only implement routes needed by actual content.

------------------------------------------------------------------------

## 12.3 B2C / Partnership Separation

**Status:** PLANNED

Homepage:

``` text
Primary = end user
Secondary = partnership CTA
```

Partnership receives dedicated route.

Acceptance:

-   [ ] B2B content does not interrupt primary emotional-support journey
-   [ ] Partnership remains easy to discover

------------------------------------------------------------------------

## 12.4 Homepage Server/Client Optimization

**Status:** PLANNED

Acceptance:

-   [ ] Mostly server-rendered static sections
-   [ ] Check-In remains isolated client experience
-   [ ] FAQ only client-side if interaction requires it
-   [ ] JS bundle not inflated by page-wide client state

------------------------------------------------------------------------

## 12.5 Phase 07 Exit Criteria

-   [ ] Around 9--10 primary sections
-   [ ] Primary narrative clear
-   [ ] Check-In visually prominent
-   [ ] Secondary content moved
-   [ ] Partnership separated
-   [ ] Existing visual identity preserved
-   [ ] Responsive verified
-   [ ] Build passes

------------------------------------------------------------------------

# 13. PHASE 08 --- P3 UI Polish

## Objective

Polish only after functional and architectural correctness is stable.

Reference:

``` text
docs/DESIGN_SYSTEM.md
```

------------------------------------------------------------------------

## 13.1 Visual Hierarchy

**Status:** DEFERRED

Focus:

-   reduce unnecessary cards,
-   improve section hierarchy,
-   consistent spacing,
-   consistent type scale,
-   restrained surfaces.

------------------------------------------------------------------------

## 13.2 Responsive Refinement

**Status:** DEFERRED

Verify:

``` text
320
375
390
768
1024
1280
1440+
```

------------------------------------------------------------------------

## 13.3 Illustration / Photography System

**Status:** DEFERRED

Direction:

``` text
Warm
Human
Reflective
Non-clinical
Editorial
```

Avoid dramatic mental-health stock photography.

------------------------------------------------------------------------

## 13.4 Motion

**Status:** DEFERRED

Use only for:

``` text
feedback
progress
state transition
navigation
hierarchy
```

No decorative gamification.

------------------------------------------------------------------------

## 13.5 Accessibility Audit

**Status:** DEFERRED

Target critical journeys:

``` text
WCAG 2.2 AA
```

Audit:

-   keyboard,
-   focus,
-   labels,
-   contrast,
-   screen reader,
-   error announcement,
-   reduced motion,
-   touch targets.

------------------------------------------------------------------------

## 13.6 Phase 08 Exit Criteria

-   [ ] Visual hierarchy consistent
-   [ ] Responsive verified
-   [ ] Asset system coherent
-   [ ] Motion restrained
-   [ ] Accessibility critical paths audited
-   [ ] Design system reflected in implementation

------------------------------------------------------------------------

# 14. Do Not Implement Yet

Until explicitly prioritized, do not add:

``` text
Authentication
Cloud Journal Sync
Gamification
Streaks
Social Feed
Peer Messaging
Push Notifications
Institution Dashboard
Individual Emotional Reporting
Advanced Personalization
Recommendation Engine
New AI Chatbot
Payment
Subscription
```

These are separate product decisions and may materially alter
privacy/safety architecture.

------------------------------------------------------------------------

# 15. Known Decisions Already Frozen

Current approved directions:

``` text
Safety Gate before AI
LOW / ELEVATED / HIGH / IMMINENT
HIGH/IMMINENT block normal reflection

Local-first sensitive data
Server-minimal persistence
Journal local-first

No fake PIN
No fake export
No fake security claims
No fake testimonials/reviews

Server Components by default
Client Components only where needed

Warm Reflective Editorial
Existing visual identity preserved

Core product:
Check-in
→ Reflection
→ Journal
→ Next Step
→ Human Support
```

Do not reopen these decisions during unrelated implementation tasks.

------------------------------------------------------------------------

# 16. Decisions Still To Be Finalized

These should be resolved when their implementation phase begins:

``` text
Database technology/provider
Newsletter provider
Hosting/deployment provider
AI provider production configuration
Rate-limit implementation/provider
Analytics provider or whether analytics is needed
Error-monitoring provider
Exact server-side retention periods
Minor/age handling before production
Final legal/compliance review
```

Do not silently choose permanent architecture for these during unrelated
tasks.

------------------------------------------------------------------------

# 17. Suggested Task Granularity for Coding Agents

Good task:

``` text
Implement centralized safety contacts and replace all duplicated contact constants.
```

Good task:

``` text
Add server-enforced Safety Gate to /api/checkin/reflect without changing unrelated UI.
```

Good task:

``` text
Replace fake newsletter success with real persistence using the selected database.
```

Bad task:

``` text
Make Rangkul Cerita production ready.
```

Bad task:

``` text
Refactor everything based on the docs.
```

Tasks should be narrow enough to verify.

------------------------------------------------------------------------

# 18. Per-Task Completion Template

After each implementation task, update this file using:

``` text
Task:
Status:
Files Changed:
Acceptance Criteria:
Verification Run:
Known Limitations:
Next Recommended Task:
```

Example:

``` text
Task:
Centralize crisis contacts

Status:
COMPLETED

Files Changed:
- src/lib/safety/contacts.ts
- src/components/SafetyModal.tsx
- src/components/SafetyUtilityBar.tsx

Acceptance Criteria:
- [x] One source of truth
- [x] Duplicate contacts removed
- [x] UI uses canonical contact data

Verification Run:
- npm test -- safety
- npm run build

Known Limitations:
- None

Next Recommended Task:
Implement canonical risk model
```

------------------------------------------------------------------------

# 19. Phase Completion Rule

Do not move to the next phase merely because most tasks are complete.

A phase completes only when its **exit criteria** pass.

If one critical acceptance item remains, keep the phase active.

Especially:

``` text
P0 Safety
cannot be considered complete
if HIGH/IMMINENT can still reach normal AI.
```

------------------------------------------------------------------------

# 20. Release Gates

Before any production release:

## Safety Gate

-   [ ] Safety tests pass
-   [ ] Crisis contacts re-verified
-   [ ] HIGH/IMMINENT routing verified

## Product Truth Gate

-   [ ] No unsupported security/privacy claims
-   [ ] No fake success states
-   [ ] No fictional proof presented as real

## Privacy Gate

-   [ ] Sensitive logs sanitized
-   [ ] Processor inventory current
-   [ ] Data flows documented
-   [ ] Consent/copy matches actual behavior

## Engineering Gate

-   [ ] TypeScript passes
-   [ ] Lint passes
-   [ ] Relevant tests pass
-   [ ] Production build passes
-   [ ] Required environment variables validated

## UX Gate

-   [ ] Core journey works
-   [ ] Mobile critical path tested
-   [ ] Safety UI accessible
-   [ ] Major errors have user-facing states

------------------------------------------------------------------------

# 21. Current Recommended Next Task

Start with:

``` text
PHASE 01
→ 6.1 Audit Existing Safety Implementation
```

Then:

``` text
6.2 Centralize Crisis Contacts
↓
6.3 Implement Risk Model
↓
6.4 Build Safety Detection Layer
↓
6.5 Implement Trusted Safety Gate
↓
6.6 Controlled Safety Responses
↓
6.7 Safety UI Integration
↓
6.8 Safety Test Suite
```

Do not begin homepage polish before this chain is complete.

------------------------------------------------------------------------

# 22. Final Execution Principle

The implementation plan should move Rangkul Cerita from:

``` text
Impressive Prototype
```

to:

``` text
Safe
Truthful
Reliable
Maintainable
Production-Ready
```

in that order.

When deciding what to build next, ask:

``` text
What is the highest-priority unresolved risk?
```

not:

``` text
What would make the demo look more complete?
```

------------------------------------------------------------------------

# 23. P4 --- Production Hardening & Release Tracker

## 23.1 Issue #41 --- Harden Production Security & Remove Dead Runtime Surface

**Status:** COMPLETED

**Scope:**

-   production security-header baseline and nonce-based CSP (centralized in `middleware.ts`),
-   removal of confirmed-dead `/api/safety/classify` and `/download-zip` public surface,
-   AI reflect-route test hermeticity (verified already resolved by #43; no change required).

**Files Changed:**

-   `middleware.ts` (new: security headers + per-request nonce CSP)
-   `app/layout.tsx` (force-dynamic so the App Router can apply the CSP nonce)
-   `next.config.mjs` (`poweredByHeader: false`)
-   `app/api/safety/classify/` (removed route + route test)
-   `app/download-zip/` (removed route)
-   `src/lib/validation/public-boundaries.ts` (removed classify-only schema)
-   `src/lib/validation/public-boundaries.test.ts` (removed classify case)
-   `middleware.test.ts` (new: header/CSP invariant tests)
-   `app/runtime-surface.test.ts` (new: dead-surface removal guard)
-   `docs/ARCHITECTURE.md` (Security Headers Baseline)

**Acceptance Criteria:**

-   [x] Security headers present on production responses
-   [x] CSP built from current runtime resources; no broad wildcards
-   [x] No `unsafe-inline` in `script-src`; nonce per request
-   [x] `/api/safety/classify` removed; canonical Safety Gate intact
-   [x] `/download-zip` removed
-   [x] Reflect-route tests hermetic (no real Gemini call required)

**Verification Run:**

-   `npm test` (all tests pass)
-   `npm run build` (build passes; removed routes absent from route table)
-   `git diff --check`
-   local `next start` probe confirmed headers and per-request nonce on HTML

**Known Limitations:**

-   HSTS and deployed-header verification deferred to #42 (production hosting decision required).
-   Pages render dynamically to support per-request CSP nonces.

**Next Recommended Task:**

-   Issue #42 --- production hosting (#41 is its only dependency).

## 23.2 Issue #42 Phase B1 --- Production Infrastructure Adaptation

**Status:** IN PROGRESS (code adaptation complete; deployment not yet performed)

**Locked production architecture:**

-   Hosting: Vercel
-   Database: Supabase Postgres (managed Postgres only; pg + Drizzle server-side)
-   Distributed rate limiting: Upstash Redis (REST)
-   AI: Google Gemini (existing integration)
-   Observability: Vercel runtime/function logs

**Phase B1 scope (completed):**

-   `UpstashRateLimiter` added behind the existing `RateLimiter` interface
-   Deterministic driver selection: production uses Upstash; development/tests
    use `InMemoryRateLimiter`
-   Missing Upstash credentials in production fail loudly (no silent
    per-instance fallback)
-   Endpoint-specific limiter failure policy: reflection fails closed (503
    `AI_UNAVAILABLE`); newsletter/unsubscribe/partnership fail open
    (lower abuse/cost impact and availability-preferred failure policy)
-   Fixed-window Lua script stores only namespaced counter state; no request
    content ever stored
-   `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` added to validated
    runtime config and `.env.example`
-   Supabase compatibility documented (transaction-mode pooler for Vercel
    runtime; direct/session connection for controlled migrations)
-   Migrations remain Drizzle-authoritative and are NOT run on app boot

**Deferred to Phase B2 (not done in B1):**

-   provisioning Vercel/Supabase/Upstash resources,
-   environment variable provisioning,
-   production migration execution,
-   deployed CSP/nonce/header verification,
-   HSTS after HTTPS/domain confirmation,
-   deployed force-dynamic performance/caching measurement,
-   deployed rate-limit behavior behind Vercel proxy (client IP trust),
-   privacy carry-forward: "Upstash stores TTL-bounded rate-limit keys
    derived from client IP; include Upstash in the processor/data inventory
    and verify retention/privacy posture."

**Known limitations:**

-   Rate-limit keys use the client IP-derived identifier from
    `x-forwarded-for` (first value), consistent with the pre-existing #43
    behavior; a privacy-safer hashed identifier would require a new
    keyed-hash secret decision and is not introduced in B1.
