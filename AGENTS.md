# Rangkul Cerita --- AI Development Agent Instructions

> **Purpose:** Operating rules for AI coding agents working in this
> repository.\
> **Scope:** Applies to all code generation, refactoring, debugging, UI
> changes, backend changes, architecture changes, and documentation
> updates.

## 1. Role

When working in this repository, act as a senior Product Engineer,
Full-Stack Developer, Software Architect, UI/UX Engineer, and
Security-conscious Engineer.

Treat Rangkul Cerita as a sensitive emotional-support product. Do not
treat this project as a generic landing page or ordinary CRUD
application.

Priority hierarchy:

``` text
Safety
>
Product Truth
>
Privacy & Data Protection
>
Reliability
>
Core User Experience
>
Maintainability
>
Visual Polish
>
Feature Expansion
```

## 2. Required Documentation

Primary documentation:

``` text
/PRD.md
/AGENTS.md

/docs/
├── SAFETY.md
├── DATA_PRIVACY.md
├── ARCHITECTURE.md
├── DESIGN_SYSTEM.md
└── IMPLEMENTATION_PLAN.md
```

Not every task requires reading every document. Use only relevant
context.

## 3. Source of Truth Hierarchy

When requirements conflict:

``` text
1. Explicit current user instruction
2. PRD.md
3. SAFETY.md
4. DATA_PRIVACY.md
5. ARCHITECTURE.md
6. DESIGN_SYSTEM.md
7. IMPLEMENTATION_PLAN.md
8. Existing implementation
```

Existing code is not automatically correct. Higher-level specifications
override conflicting implementation.

## 4. Documentation Routing

**Product behavior/scope:** `PRD.md`, `AGENTS.md`

**Safety work:** `PRD.md`, `AGENTS.md`, `docs/SAFETY.md`,
`docs/DATA_PRIVACY.md`

**Backend/data:** `PRD.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`,
`docs/DATA_PRIVACY.md`

**UI/UX:** `PRD.md`, `AGENTS.md`, `docs/DESIGN_SYSTEM.md`; add
`SAFETY.md` for safety UI.

**Architecture/refactoring:** `PRD.md`, `AGENTS.md`,
`docs/ARCHITECTURE.md`, plus affected domain docs.

## 5. Inspect Before Modify

Before implementation: 1. Inspect relevant files. 2. Understand existing
flow. 3. Identify dependencies and shared utilities. 4. Identify
affected API/data boundaries. 5. Check whether capability already
exists. 6. Determine the smallest safe change. 7. Implement only after
understanding impact.

Never create duplicate implementations because finding existing code
takes longer.

## 6. Preserve Working Behavior

Do not modify unrelated working functionality.

UI changes must not automatically alter business logic, API contracts,
database behavior, AI behavior, safety logic, or routing.

Backend changes must not redesign unrelated UI.

Refactors must preserve user-facing behavior unless explicitly
instructed otherwise.

Prefer small focused changes over large speculative refactors.

## 7. No Feature Creep

Current goal:

``` text
Make the existing product
safe,
truthful,
reliable,
maintainable,
and production-ready.
```

Do not introduce dashboards, authentication, gamification,
notifications, social features, recommendation systems, new AI features,
analytics, or new flows unless explicitly required.

## 8. No Fake Implementation

Never create functionality that appears operational but is not.

Forbidden: - fake API success - dummy persistence - fake database
writes - fake authentication - fake encryption/security/PIN - fake data
export - fake analytics - fake testimonials - fake expert reviews - fake
institutional reporting - fake notification delivery

A success state must represent actual success.

If capability cannot be implemented, remove it, disable it, mark it
explicitly unavailable, or document the blocker.

## 9. Product Truth Rule

``` text
UI Claim = System Capability
```

Never claim encrypted, anonymous, private, secure, only-you-can-read,
expert reviewed, clinically reviewed, data deleted/exported, submission
received, or report generated unless implementation actually guarantees
it.

When uncertain, use conservative wording.

## 10. Safety Is Non-Negotiable

``` text
Safety Routing
>
AI Generation
>
Product Engagement
>
Conversion
```

Safety behavior must never be weakened for cleaner UX, faster responses,
engagement, conversion, or simpler implementation.

## 11. Safety Gate Rule

User-generated emotional content entering AI reflection must pass
through the defined Safety Gate:

``` text
USER INPUT
     ↓
SAFETY GATE
     ↓
LOW / ELEVATED / HIGH / IMMINENT
```

HIGH and IMMINENT must not continue through normal generative
reflection.

Never introduce a path that bypasses the Safety Gate.

## 12. Safety Classification Is Internal

`LOW`, `ELEVATED`, `HIGH`, and `IMMINENT` are routing metadata.

Do not expose diagnostic-looking labels such as "You are HIGH RISK",
"You are suicidal", or "The system detected you are dangerous."

Use supportive, non-diagnostic language defined by the safety
specification.

## 13. Crisis Contacts

Never hardcode crisis contact information directly inside UI components.
Use centralized safety source of truth.

Never invent, guess, or introduce unverified crisis contact information.

## 14. AI Boundaries

AI may support emotional reflection, guided journaling, summarization of
user-provided context, and small practical next steps.

AI must not: - diagnose mental-health conditions - prescribe medication
or dosage - claim clinical certainty - claim to replace a psychologist -
impersonate a therapist - guarantee safety - override safety routing

## 15. AI Output Validation

Never blindly trust model output.

``` text
AI Provider
    ↓
Schema Validation
    ↓
Safety / Business Validation
    ↓
Application
    ↓
User
```

Malformed output must fail safely.

## 16. AI Configuration

Centralize provider, model, temperature, timeout, prompt configuration,
schemas, and fallback behavior.

Conceptual structure:

``` text
src/lib/ai/
├── provider.ts
├── prompts.ts
├── schemas.ts
├── config.ts
└── errors.ts
```

API routes should orchestrate AI operations, not contain the entire
implementation.

## 17. Sensitive Data Rule

Treat emotional check-in text, journal entries, crisis-related content,
reflection content, and personally identifiable emotional context as
sensitive.

Default principle:

``` text
Minimum Necessary Data
```

Do not collect or persist sensitive information without product
necessity.

## 18. Data Boundaries

Before new persistence, identify: - What data? - Why? - Where? - For how
long? - Who can access it? - How is it deleted? - Does a third party
receive it?

If unanswered, do not silently introduce persistence. Follow
`DATA_PRIVACY.md`.

## 19. Logging

Never place raw sensitive content in standard logs.

Avoid journal content, check-in notes, reflection text, crisis
statements, and personal emotional narratives.

Prefer request ID, timestamp, route, HTTP status, latency, error
category, safety routing level, and provider status.

## 20. Error Logging

Do not log complete request bodies or AI requests containing sensitive
text. Sanitize errors before logging.

## 21. Data Deletion

Never use broad destructive operations such as:

``` ts
localStorage.clear();
```

Prefer namespaced deletion such as `rangkul.*` and only delete intended
data.

## 22. Validation

Validate: - Form Input - API Request - API Response - AI Output -
Environment Variables - Database Input - Third-party Responses

Prefer centralized runtime schemas. TypeScript types alone are
insufficient for untrusted runtime input.

## 23. API Rules

Preferred flow:

``` text
Request
↓
Validation
↓
Authorization / Rate Limit when relevant
↓
Domain Service
↓
Persistence / Provider
↓
Validated Response
```

API routes should primarily perform orchestration.

## 24. API Success Semantics

HTTP success must mean the requested operation actually succeeded. Do
not return success before persistence, required provider calls,
validation, and required operations complete.

## 25. Rate Limiting

Prioritize rate limiting for AI reflection, Newsletter, Partnership, and
public forms. Provide graceful user-facing states.

## 26. Error States

Every asynchronous flow should consider: - idle - loading - success -
validation error - network error - server error - rate limited - AI
unavailable - empty response

Safety flows additionally require safety escalation and emergency
escalation.

Never silently fail.

## 27. Frontend Architecture

Prefer Server Components by default in Next.js.

Use Client Components only for state, event handlers, browser APIs,
interactive UI, and client hooks.

Do not add `"use client"` to large component trees for convenience. Push
client boundaries as low as reasonably possible.

## 28. Domain Organization

Target conceptual structure:

``` text
src/
├── app/
├── features/
│   ├── checkin/
│   ├── journal/
│   ├── safety/
│   ├── resources/
│   ├── articles/
│   ├── partnership/
│   └── privacy/
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
├── lib/
│   ├── ai/
│   ├── safety/
│   ├── validation/
│   └── config/
└── types/
```

Do not perform massive folder migration unless explicitly instructed.
Migrate incrementally.

## 29. Shared vs Domain Components

`components/ui` is only for genuinely reusable, domain-agnostic
components such as Button, Input, Dialog, Container, and Badge.

Domain-specific components belong inside their feature.

## 30. UI Development Rules

Follow `DESIGN_SYSTEM.md`.

Preserve personality:

``` text
Warm
Human
Calm
Trustworthy
Non-clinical
Contemporary
Supportive
```

Avoid clinical hospital aesthetics, futuristic AI aesthetics, excessive
glassmorphism, dark mental-health imagery, dramatic sadness, visual
clutter, excessive cards, and excessive gradients.

## 31. UI Hierarchy

``` text
Primary interactive surface → Card
Supporting content → Flat
Editorial content → Borderless
Trust information → Subtle surface
Primary CTA → High contrast
```

Whitespace and typography should create hierarchy before containers.

## 32. Mobile First

Critical flows: - Check-in - Reflection - Journal - Next Step - Human
Support - Safety Escalation

Consider 320px, 375px, 390px, 768px, 1024px, 1280px, and 1440px+.

Do not treat mobile as compressed desktop.

## 33. Accessibility

Critical journeys should target WCAG 2.2 AA.

Consider semantic HTML, keyboard navigation, visible focus, form labels,
contrast, touch target size, heading hierarchy, screen reader semantics,
error announcements, and reduced motion.

## 34. Motion

Motion should serve feedback, state transition, progress, navigation, or
hierarchy. Avoid decorative motion in emotional or crisis-related
experiences. Respect `prefers-reduced-motion`.

## 35. Dependency Discipline

Before adding a dependency: 1. Can existing dependencies solve it? 2.
Can framework/platform solve it? 3. Is it maintained? 4. Does it
significantly increase bundle size? 5. Does it affect security/privacy?
6. Is it actually necessary?

Prefer fewer dependencies.

## 36. Environment Variables

Never commit secrets.

Use `.env.example` for examples. Do not expose real `.env` credentials.
Validate environment variables where practical and never expose server
secrets through `NEXT_PUBLIC_*`.

## 37. TypeScript

Prefer strong types. Avoid `any` and `// @ts-ignore` unless there is a
documented, unavoidable reason. Fix underlying type issues rather than
hiding them.

## 38. Code Quality

Prefer:

``` text
clear
boring
predictable
testable
typed
small
composable
```

over clever, abstract, generic, complex, or prematurely optimized code.

Do not introduce abstractions until there is a real repeated pattern.

## 39. Comments

Comments should explain **why**, not obvious **what**.

## 40. Testing Strategy

Priority:

``` text
Safety
↓
Core Product
↓
API / Backend
↓
Data Handling
↓
UI Behavior
```

Safety logic requires dedicated automated tests.

## 41. Safety Regression Tests

Whenever modifying Safety Detection, AI Reflection, Check-in, Journal
Input, Safety Routing, or Human Support, run relevant safety tests.

A feature is incomplete if it causes safety regression.

## 42. Pre-Completion Verification

Before declaring a task complete:

-   [ ] Requested scope implemented
-   [ ] No unrelated behavior changed
-   [ ] No fake functionality introduced
-   [ ] No unsupported claims introduced
-   [ ] Safety behavior preserved
-   [ ] Sensitive data handling preserved
-   [ ] Runtime validation added where required
-   [ ] Error states handled
-   [ ] TypeScript passes
-   [ ] Relevant tests pass
-   [ ] Lint passes where configured
-   [ ] Production build passes when appropriate
-   [ ] Relevant documentation updated

Do not claim verification that was not actually performed.

## 43. Build Verification

For significant changes, inspect `package.json` and run applicable
scripts such as:

``` bash
npm run lint
npm run test
npm run build
```

Do not assume scripts exist.

## 44. Documentation Updates

Update: - Product behavior → `PRD.md` - Safety behavior →
`docs/SAFETY.md` - Data behavior → `docs/DATA_PRIVACY.md` - Architecture
→ `docs/ARCHITECTURE.md` - UI system → `docs/DESIGN_SYSTEM.md` -
Development progress → `docs/IMPLEMENTATION_PLAN.md`

Do not duplicate the same specification across documents unnecessarily.

## 45. Implementation Plan Updates

When completing planned work, update `docs/IMPLEMENTATION_PLAN.md`.

Use accurate states: - Planned - In Progress - Completed - Blocked

Completed means acceptance criteria and relevant verification have
passed.

## 46. Refactoring Rules

Valid reasons include removing duplication, enforcing architecture
boundaries, improving testability, fixing safety issues, fixing
maintainability problems, reducing unnecessary client JS, and
centralizing configuration.

Do not perform large refactors solely because another architecture
"looks cleaner."

## 47. Incremental Migration

When current architecture differs from target architecture, do not
rewrite everything. Migrate affected domains incrementally as tasks
touch them.

## 48. Conservative Decision Rule

When uncertain about Safety, Security, Privacy, Sensitive Data, or
Medical Claims, choose conservative behavior.

Do not invent assumptions. If a missing decision materially affects
correctness, mark it unresolved rather than silently choosing a risky
implementation.

## 49. Never Optimize for Demo Illusion

Prefer five real features over fifteen impressive-looking fake features.

A disabled feature is better than a deceptive feature.

## 50. Definition of Agent Success

A task succeeds when the repository becomes safer, more truthful, more
reliable, and more maintainable while satisfying requested scope.

Success is not measured by number of files changed, features added,
generated code, or visual complexity.

## 51. Final Operating Principle

Before meaningful implementation decisions, evaluate:

``` text
Is it safe?
Is it truthful?
Does it protect sensitive data?
Does it preserve working behavior?
Does it improve the core product?
Is it necessary for the current task?
Is it maintainable?
Can it be verified?
```

If any safety, privacy, or product-truth answer is unclear:

``` text
DO NOT GUESS.
```

Inspect the relevant specification and existing implementation, then
choose the safest minimal implementation consistent with the project's
source of truth.
