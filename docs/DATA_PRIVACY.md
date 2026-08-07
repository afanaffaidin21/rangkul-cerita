# Rangkul Cerita --- Data & Privacy Specification

> **Document Type:** Data Architecture, Privacy & Security Contract\
> **Status:** Development source of truth\
> **Priority:** P0 --- Data Architecture & Product Truth\
> **Applies To:** Check-in, Reflection, Journal, AI, Safety, Newsletter,
> Partnership, Analytics, APIs, storage, logs, export, deletion, and
> third-party integrations

## 1. Purpose

Dokumen ini mendefinisikan bagaimana Rangkul Cerita mengumpulkan,
menggunakan, memindahkan, menyimpan, menghapus, dan melindungi data.

Tujuan utamanya bukan mengumpulkan data sebanyak mungkin, tetapi
memastikan setiap data memiliki alasan yang jelas untuk diproses.

Core principle:

``` text
Collect Less
Store Less
Share Less
Retain Less
Expose Less
```

Untuk sensitive emotional data:

``` text
Privacy
>
Analytics
>
Personalization
>
Convenience
```

------------------------------------------------------------------------

## 2. Regulatory Baseline

Rangkul Cerita harus dirancang dengan mempertimbangkan **UU Republik
Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU
PDP)** dan regulasi Indonesia lain yang berlaku pada saat deployment.

UU PDP membedakan data pribadi umum dan data pribadi spesifik. Data dan
informasi kesehatan serta data anak termasuk data pribadi yang bersifat
spesifik.

Dokumen ini adalah engineering specification, bukan legal opinion.

Sebelum production launch, Privacy Policy, Terms, consent language,
cross-border processing, child/minor handling, and data-subject
workflows harus mendapat legal/compliance review yang sesuai.

------------------------------------------------------------------------

## 3. Product Data Philosophy

Default behavior:

``` text
Do not collect data
unless the product actually needs it.
```

Setiap field baru harus menjawab:

1.  Apa datanya?
2.  Mengapa dibutuhkan?
3.  Apakah fitur tetap bisa bekerja tanpa data tersebut?
4.  Apakah perlu dikirim ke server?
5.  Apakah perlu disimpan?
6.  Berapa lama?
7.  Siapa yang dapat mengakses?
8.  Apakah third party menerimanya?
9.  Bagaimana user menghapusnya?

Jika jawaban tidak jelas, jangan collect atau persist data tersebut.

------------------------------------------------------------------------

## 4. Privacy Architecture Decision

Untuk MVP, gunakan pendekatan:

``` text
LOCAL-FIRST
+
SERVER-MINIMAL
```

Artinya:

-   sensitive personal content sebisa mungkin tetap lokal,
-   server persistence hanya digunakan jika benar-benar dibutuhkan,
-   server tidak menjadi default storage untuk seluruh aktivitas user,
-   tidak ada requirement account/cloud hanya demi convenience.

Account/cloud architecture tidak boleh diperkenalkan secara diam-diam.

Jika di masa depan account/cloud diperlukan, data model dan consent
harus dievaluasi ulang sebelum implementation.

------------------------------------------------------------------------

## 5. Data Classification

Gunakan klasifikasi berikut.

### D0 --- Public / Non-Personal

Contoh:

-   public article content,
-   public resources,
-   static product content.

### D1 --- Operational

Contoh:

-   request ID,
-   API latency,
-   error category,
-   feature status,
-   non-identifying technical metadata.

### D2 --- Contact / Identifiable

Contoh:

-   email newsletter,
-   partnership contact name,
-   organization,
-   email address,
-   phone number jika dikumpulkan.

### D3 --- Sensitive Emotional

Contoh:

-   mood,
-   emotion,
-   intensity,
-   check-in note,
-   AI reflection context,
-   emotional needs,
-   distress-related input.

### D4 --- Journal

Contoh:

-   private journal entry,
-   guided journal answer,
-   personal reflection.

Treat D4 at least as sensitively as D3.

### D5 --- Safety-Critical

Contoh:

-   crisis-related input,
-   self-harm signal,
-   safety classification,
-   escalation metadata.

Raw D5 content must receive the strictest minimization.

------------------------------------------------------------------------

## 6. Data Categories Are Not Marketing Categories

Do not describe D3/D4/D5 as anonymous merely because the UI does not ask
for a name.

Data may become identifiable through:

-   account linkage,
-   IP/network metadata,
-   device identifiers,
-   email,
-   analytics identifiers,
-   combined context,
-   third-party provider logs.

Use `anonymous` only when architecture actually prevents reasonable
identification/linkage.

Otherwise prefer:

``` text
not directly identified
```

or similarly accurate wording.

------------------------------------------------------------------------

## 7. Recommended MVP Data Matrix

  -------------------------------------------------------------------------------------------------
  Data          Class       Default Storage   Server          AI Provider         Default Retention
                                              Persistence                         
  ------------- ----------- ----------------- --------------- ------------------- -----------------
  Public        D0          Server/static     Yes             No                  Product lifecycle
  content                                                                         

  Request       D1          Server logs       Minimal         No                  Short
  metadata                                                                        

  Newsletter    D2          Server/provider   Yes             No                  Until unsubscribe
  email                                                                           / policy

  Partnership   D2          Server            Yes             No                  Defined business
  data                                                                            retention

  Mood          D3          Local/session     No by default   Only if needed      Session/local
  selection                                                                       policy

  Check-in free D3          Local/session     No by default   Yes when reflection Transient at app
  text                                                        requested           layer

  AI reflection D3          Local/session     No by default   Generated           Session/local
                                                              externally          policy

  Journal       D4          Local-first       No by default   Only with explicit  User-controlled
                                                              feature need        

  Raw crisis    D5          Transient         No by default   Safety provider     Avoid persistence
  text                                                        only if required    

  Safety risk   D5 metadata Minimal           Only if         Internal/provider   Short/minimized
  level                                       operationally                       
                                              justified                           
  -------------------------------------------------------------------------------------------------

This matrix is the default architecture, not permission to persist
everything listed.

------------------------------------------------------------------------

## 8. Local-First Journal

For MVP, Journal should be treated as local-first unless a future
approved requirement explicitly introduces cloud sync.

Default:

``` text
Journal
→ Browser Storage
→ User Device
```

Not:

``` text
Journal
→ Database
→ Admin Dashboard
```

Do not build server journal storage merely because a database exists.

------------------------------------------------------------------------

## 9. Local Storage Namespace

Never use arbitrary generic keys.

Use application-owned namespace.

Example:

``` text
rangkul.preferences
rangkul.journal.entries
rangkul.checkin.current
rangkul.privacy.version
```

Do not use:

``` ts
localStorage.clear();
```

for application deletion.

Deletion must target Rangkul Cerita-owned keys.

------------------------------------------------------------------------

## 10. Browser Storage Security Boundary

Browser local storage is not equivalent to encrypted private vault
storage.

Do not claim:

``` text
End-to-end encrypted
Only you can read it
Secure vault
Encrypted journal
```

merely because data lives in browser storage.

Local-first reduces server exposure, but does not automatically protect
against:

-   shared devices,
-   compromised browser profiles,
-   malicious extensions,
-   XSS,
-   physical access to unlocked device.

Product copy must reflect this truth.

------------------------------------------------------------------------

## 11. PIN Feature

A UI PIN is not security unless it actually protects stored data.

Do not ship a PIN that only:

-   toggles React state,
-   hides a component,
-   disappears after refresh,
-   can be bypassed by reading local storage.

For MVP:

``` text
REMOVE / DISABLE
```

until a real security design exists.

If implemented later, specify:

-   threat model,
-   key derivation,
-   encrypted storage,
-   recovery behavior,
-   failed-attempt behavior,
-   data-loss consequences.

------------------------------------------------------------------------

## 12. Check-in Data

Structured Check-in data may include:

``` text
emotion
intensity
need
optional free text
```

Default behavior:

-   keep structured state client-side where possible,
-   send only fields required for requested AI/safety operation,
-   do not persist raw free text server-side by default.

Do not add hidden server history.

------------------------------------------------------------------------

## 13. AI Reflection Data Flow

If user requests AI Reflection:

``` text
Browser
   ↓
Application API
   ↓
Safety Processing
   ↓
AI Provider
   ↓
Validated Response
   ↓
Browser
```

Only minimum necessary content should cross each boundary.

Application logs must not contain raw emotional text.

------------------------------------------------------------------------

## 14. AI Provider Boundary

AI provider is a third-party processing boundary.

Before production, document:

-   provider name,
-   API/product used,
-   data sent,
-   provider retention terms,
-   training/data-use settings,
-   processing location where relevant,
-   applicable contractual/privacy terms.

Do not write:

``` text
Your data never leaves your device
```

if user text is sent to an AI provider.

------------------------------------------------------------------------

## 15. AI Data Minimization

Do not send unnecessary metadata alongside emotional text.

Avoid sending unless required:

-   email,
-   full account profile,
-   phone number,
-   exact location,
-   analytics ID,
-   partnership information,
-   unrelated historical journal entries.

Prompt context should contain only what the current reflection requires.

------------------------------------------------------------------------

## 16. Journal → AI Boundary

Journal content must not automatically be sent to AI.

Required behavior:

``` text
Journal stored locally
```

unless the user invokes a feature that explicitly requires AI
processing.

Before sending journal content to AI, UI should make the action
understandable.

Avoid background AI processing of journal entries.

------------------------------------------------------------------------

## 17. Safety Data

Safety content is sensitive.

Raw crisis text should not be persisted merely for:

-   analytics,
-   model improvement,
-   debugging,
-   product dashboards.

Preferred:

``` text
Raw Input
→ Safety Processing
→ Routing Result
→ Raw Input discarded at app persistence layer
```

unless a separately approved retention requirement exists.

------------------------------------------------------------------------

## 18. Safety Metadata

If operational telemetry is required, prefer minimal metadata:

``` text
request_id
timestamp
risk_level
classifier_status
route_taken
provider_status
```

Do not include raw crisis message.

Persistent safety metadata requires explicit purpose and retention
period.

------------------------------------------------------------------------

## 19. Newsletter Data

Newsletter requires real persistence/provider delivery integration.

Allowed data should be minimal, normally:

``` text
email
consent_timestamp
consent_version
status
```

Optional fields must have product justification.

Do not attach emotional/journal activity to newsletter profiles.

------------------------------------------------------------------------

## 20. Newsletter Consent

Newsletter subscription must be explicit.

Do not use:

-   pre-checked consent,
-   hidden consent,
-   bundled mental-health-data consent,
-   forced marketing consent to use core product.

Unsubscribe capability must exist before treating newsletter as
production-ready.

------------------------------------------------------------------------

## 21. Partnership Data

Partnership form may collect:

``` text
name
organization
role
email
phone if necessary
message
```

Do not request sensitive emotional data in partnership forms.

Partnership submissions must be stored only after validation.

Do not return success if persistence fails.

------------------------------------------------------------------------

## 22. Analytics

Analytics must not receive raw:

-   check-in notes,
-   journal entries,
-   AI reflection text,
-   crisis statements.

Allowed analytics should focus on product events.

Example:

``` text
checkin_started
checkin_completed
reflection_requested
journal_opened
human_support_opened
```

Avoid event properties containing user-entered emotional text.

------------------------------------------------------------------------

## 23. Analytics Identity

Prefer privacy-preserving, low-identification analytics.

Do not introduce cross-session identity merely because analytics
supports it.

Do not merge emotional product activity with marketing profiles without
explicit approved requirement and appropriate legal/privacy basis.

------------------------------------------------------------------------

## 24. Advertising

Do not use sensitive emotional, journal, or safety data for:

-   targeted advertising,
-   behavioral advertising,
-   audience enrichment,
-   ad retargeting.

Do not install advertising trackers on sensitive product flows without
explicit privacy/security review.

------------------------------------------------------------------------

## 25. Third-Party Scripts

Every third-party browser script creates a potential data boundary.

Before adding:

``` text
Analytics SDK
Chat widget
Session replay
Error tracker
Marketing pixel
A/B testing SDK
```

determine what it can observe.

Session replay tools must not capture sensitive fields.

Sensitive input fields should be excluded/masked by design.

------------------------------------------------------------------------

## 26. Session Replay

Default:

``` text
DO NOT RECORD
```

sensitive emotional flows with session replay.

If session replay is ever approved:

-   mask all user text,
-   mask journal,
-   mask check-in notes,
-   mask safety UI,
-   verify masking technically,
-   document retention and access.

------------------------------------------------------------------------

## 27. Error Monitoring

Error monitoring must not automatically include request bodies or
sensitive form state.

Sanitize:

-   breadcrumbs,
-   network payloads,
-   component state,
-   console logs,
-   exception context.

Prefer technical metadata.

------------------------------------------------------------------------

## 28. Server Logging

Allowed example:

``` json
{
  "requestId": "req_x",
  "route": "/api/checkin/reflect",
  "status": 200,
  "latencyMs": 842,
  "riskLevel": "LOW"
}
```

Forbidden:

``` json
{
  "message": "Aku merasa...",
  "journal": "...",
  "aiPrompt": "..."
}
```

Never use production logs as an emotional-content archive.

------------------------------------------------------------------------

## 29. Development Logging

Development mode does not remove privacy obligations.

Do not normalize:

``` ts
console.log(requestBody);
console.log(prompt);
console.log(journalEntry);
```

because "it's only development."

Developers frequently copy logs into external tools.

Use sanitized fixtures for debugging.

------------------------------------------------------------------------

## 30. Test Data

Never use real user emotional/journal/crisis content as automated test
fixtures.

Use synthetic examples.

Test databases should not be populated from production sensitive content
unless a separately approved anonymization process exists.

------------------------------------------------------------------------

## 31. Database Separation

Where practical, separate operational/business data from sensitive
product data.

For MVP, because sensitive emotional content is not server-persistent by
default, database should primarily contain data such as:

``` text
newsletter
partnership
operational configuration
```

Do not create a generic `user_activity` table that silently accumulates
emotional history.

------------------------------------------------------------------------

## 32. Data Retention

Every persistent server dataset must define retention.

Minimum fields in retention documentation:

``` text
dataset
purpose
retention duration
deletion trigger
owner
```

Do not use:

``` text
retain forever
```

as default.

------------------------------------------------------------------------

## 33. Recommended Retention Direction

Exact legal/business retention periods require final compliance
decision.

Engineering defaults:

### Technical Logs

``` text
Short retention
```

Keep only as long as operationally necessary.

### Newsletter

``` text
Until unsubscribe + limited compliance record as required
```

### Partnership

``` text
Defined business lifecycle + deletion/archive policy
```

### Emotional / Journal Content

``` text
No server persistence by default
```

### Raw Safety Content

``` text
No server persistence by default
```

Do not convert these directions into legal claims without review.

------------------------------------------------------------------------

## 34. Deletion

Deletion must match actual architecture.

If data exists locally:

``` text
Delete Local Data
→ Remove Rangkul-owned keys only
```

If data exists server-side:

``` text
Deletion Request
→ Verify scope
→ Delete / anonymize where applicable
→ Propagate to processors where required
→ Confirm actual completion
```

Do not display success before deletion completes.

------------------------------------------------------------------------

## 35. Delete All Product Data

If product offers "Delete My Data", define exactly what is deleted.

UI should not imply server deletion if only browser storage is removed.

Example truthful distinction:

``` text
Delete data on this device
```

versus:

``` text
Delete account and server data
```

These are different operations.

------------------------------------------------------------------------

## 36. Data Export

Do not provide fake export.

If export exists, it must use real user data.

Recommended format:

``` text
JSON
```

with documented schema.

For local-first MVP, export can operate entirely client-side where
feasible.

Do not include dummy data.

------------------------------------------------------------------------

## 37. Export Scope

Export UI must explain scope.

Example:

``` text
This export contains data stored by Rangkul Cerita on this device.
```

Do not imply cloud/account export if none exists.

------------------------------------------------------------------------

## 38. Consent Model

Consent must be specific enough that user understands what is happening.

Separate conceptually:

``` text
Core processing
AI processing
Newsletter marketing
Optional analytics
Future cloud sync
```

Do not bundle everything into one vague checkbox.

------------------------------------------------------------------------

## 39. AI Processing Disclosure

Before or at the point where user submits emotional free text for AI
processing, product should clearly communicate that the content will be
processed by the system and relevant AI provider.

Avoid legal-wall copy inside the core flow.

Use concise disclosure with access to fuller privacy information.

------------------------------------------------------------------------

## 40. Consent Records

Where explicit consent is required and server-side proof is necessary,
record:

``` text
subject/reference
purpose
timestamp
policy/consent version
status
```

Do not store unnecessary sensitive content alongside consent records.

------------------------------------------------------------------------

## 41. Withdrawal

Where processing depends on consent, withdrawal must be technically
meaningful.

Do not provide a toggle that changes UI but continues the same
background processing.

------------------------------------------------------------------------

## 42. Privacy Policy vs Product UI

Privacy Policy is not a substitute for truthful UI.

Critical data actions should be understandable at the point of use.

Examples:

-   AI processing,
-   cloud save,
-   newsletter subscription,
-   deletion,
-   export.

------------------------------------------------------------------------

## 43. Children and Minors

UU PDP classifies children's data as specific personal data.

If Rangkul Cerita targets or knowingly serves minors, do not assume
adult consent patterns are sufficient.

Before production support for minors, define:

-   intended minimum age,
-   age handling,
-   consent/legal basis,
-   guardian requirements where applicable,
-   child-appropriate privacy notice,
-   safety escalation considerations.

Until this is resolved, do not make unsupported claims about compliant
processing of children's data.

------------------------------------------------------------------------

## 44. Health-Related Data

Because emotional/safety content may reveal health-related information,
treat it conservatively as highly sensitive even when Rangkul Cerita is
not a diagnostic medical service.

Do not use semantic arguments such as:

``` text
"We are not a hospital, therefore this isn't sensitive."
```

Product sensitivity is determined by the data and context, not only
company category.

------------------------------------------------------------------------

## 45. Data Subject Rights

Architecture should be able to support applicable rights under
Indonesian data-protection requirements.

At minimum, product architecture should not make it impossible to
handle:

-   access,
-   correction where relevant,
-   deletion,
-   withdrawal of consent where applicable,
-   information about processing.

Exact legal workflow must be reviewed before production.

------------------------------------------------------------------------

## 46. Encryption in Transit

All production network traffic carrying personal/sensitive data must use
HTTPS/TLS.

Do not send emotional or personal data through plaintext HTTP.

------------------------------------------------------------------------

## 47. Encryption at Rest

If server-side sensitive persistence is introduced later, encryption at
rest must be explicitly designed and verified.

Do not treat provider-managed disk encryption as equivalent to:

``` text
Only the user can decrypt the data.
```

Those are different guarantees.

------------------------------------------------------------------------

## 48. End-to-End Encryption

Do not claim E2EE unless:

-   encryption occurs before server access,
-   server cannot decrypt content,
-   key ownership and recovery are defined,
-   third-party processing implications are understood.

If AI provider must read plaintext journal content, that processing path
is not end-to-end encrypted from user to private journal storage in the
ordinary sense.

------------------------------------------------------------------------

## 49. Secrets

Never expose:

-   database credentials,
-   AI API keys,
-   encryption keys,
-   provider secrets

to browser code.

Do not use `NEXT_PUBLIC_*` for server secrets.

Use `.env.example` without real credentials.

------------------------------------------------------------------------

## 50. Access Control

If admin/back-office systems are introduced:

``` text
Least Privilege
```

must be default.

Do not give marketing/support personnel access to emotional or safety
content simply because they have admin access.

Sensitive-data access must be separately justified.

------------------------------------------------------------------------

## 51. Production Admin Tools

Do not create a "view all user journals" dashboard.

If future operational workflows genuinely require sensitive-data access,
define:

-   purpose,
-   role,
-   access control,
-   auditability,
-   retention,
-   user expectation,
-   legal basis.

Default architecture should avoid needing such access.

------------------------------------------------------------------------

## 52. Cross-Border Processing

AI, analytics, email, hosting, and monitoring providers may process data
outside Indonesia.

Before production, identify processor locations and assess applicable
cross-border data-transfer requirements.

Do not assume SaaS provider use is legally/privacy neutral.

------------------------------------------------------------------------

## 53. Processor Inventory

Maintain an internal inventory:

  -----------------------------------------------------------------------------------------
  Processor    Purpose       Data          Sensitive     Retention   Location   Contract
                                           Data?                                Reviewed?
  ------------ ------------- ------------- ------------- ----------- ---------- -----------
  Google       AI            Minimum       Yes           TBD         TBD        TBD
  Gemini       Reflection    emotional
                             text

  Supabase     Postgres      Newsletter    Email         TBD         TBD        TBD
  Postgres     persistence   email +
                             partnership
                             lead data

  Upstash      Distributed   Rate-limit    IP-derived    TBD         TBD        TBD
  Redis        rate          counter       client key
               limiting      keys only     (no content)

  Vercel       Hosting       Operational   Possible      TBD         TBD        TBD
                             logs

  Error        Errors        Sanitized     Must avoid    TBD         TBD        TBD
  Monitoring                 metadata      raw sensitive

  Analytics    Product       Event         Must avoid    TBD         TBD        TBD
               metrics       metadata      raw sensitive
  -----------------------------------------------------------------------------------------

Locked production processors (Issue #42): Google Gemini (AI), Supabase
Postgres (managed Postgres only), Upstash Redis (distributed rate limiting),
Vercel (hosting). Location, retention, and contract-review cells remain TBD
until provisioning and owner review are completed in Phase B2.


------------------------------------------------------------------------

## 54. Data Flow Diagram

Target MVP:

``` text
                         ┌──────────────────┐
                         │   Public Pages   │
                         └────────┬─────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────┐
│                    USER BROWSER                       │
│                                                       │
│ Check-in State                                        │
│ Journal                                               │
│ Local Preferences                                     │
└───────────┬─────────────────────────────┬─────────────┘
            │                             │
     Reflection Request            Business Forms
            │                             │
            ▼                             ▼
┌──────────────────────┐       ┌───────────────────────┐
│ Application API      │       │ Application API       │
│ Safety + Validation  │       │ Validation            │
└───────────┬──────────┘       └───────────┬───────────┘
            │                              │
            ▼                              ▼
┌──────────────────────┐       ┌───────────────────────┐
│ AI Provider          │       │ Database / Provider   │
│ Minimum input only   │       │ Newsletter/Partner    │
└──────────────────────┘       └───────────────────────┘
```

Journal does not flow to server by default.

------------------------------------------------------------------------

## 55. Data Boundary Review

Any new arrow added to the data-flow diagram requires privacy review.

Examples:

``` text
Journal → Server
Journal → Analytics
Check-in → CRM
Safety Text → Dashboard
```

must never appear as incidental implementation details.

They are product/privacy architecture changes.

------------------------------------------------------------------------

## 56. Product Truth Requirements

Remove or correct unsupported UI claims about:

-   encryption,
-   anonymity,
-   PIN security,
-   export,
-   deletion,
-   who can read data,
-   institutional reporting,
-   AI data handling.

Copy must describe current implementation, not future intention.

------------------------------------------------------------------------

## 57. Institutional Reporting

Do not implement or claim institutional reporting until a separate
approved architecture exists.

Especially forbidden:

``` text
School can see student emotional data
University receives individual risk reports
Partner dashboard shows journal/check-in content
```

If future aggregate reporting is proposed, it requires separate privacy
threat modeling and anti-reidentification review.

------------------------------------------------------------------------

## 58. Aggregation Is Not Automatically Anonymous

Small cohorts can make aggregated mental-health information
re-identifiable.

Do not claim:

``` text
aggregated = anonymous
```

without technical analysis.

Future reporting must consider:

-   minimum cohort size,
-   suppression,
-   segmentation risk,
-   temporal correlation,
-   repeated reports,
-   indirect identification.

------------------------------------------------------------------------

## 59. Data Breach Readiness

Before production persistence of personal data, establish at least:

-   incident owner,
-   credential rotation process,
-   processor contact path,
-   log preservation procedure,
-   impact assessment process,
-   notification/legal escalation process.

Exact breach-notification obligations must follow applicable law and
legal review.

------------------------------------------------------------------------

## 60. Privacy Failure Behavior

Privacy-sensitive operations must fail truthfully.

Examples:

### Export Failure

``` text
Do not generate dummy file.
Show export failed.
```

### Deletion Failure

``` text
Do not show "data deleted".
Show failure and retry/support path.
```

### Newsletter Failure

``` text
Do not show subscribed.
```

### Partnership Failure

``` text
Do not claim team will contact user.
```

------------------------------------------------------------------------

## 61. Security Headers and Web Baseline

Production application should adopt appropriate web security controls,
including where compatible:

-   HTTPS,
-   Content Security Policy,
-   secure cookie configuration,
-   `HttpOnly` for server session cookies,
-   `SameSite` policy,
-   CSRF protection for relevant authenticated mutations,
-   XSS prevention,
-   dependency hygiene.

Exact configuration belongs in `ARCHITECTURE.md`.

Privacy depends on security; client-side local storage is not safe if
XSS is uncontrolled.

------------------------------------------------------------------------

## 62. No Sensitive Data in URLs

Never place emotional, journal, safety, email, or personal data in:

-   query parameters,
-   URL paths,
-   fragment identifiers intended for navigation,
-   referrer-visible URLs.

URLs are frequently logged by browsers, servers, analytics, and proxies.

------------------------------------------------------------------------

## 63. Caching

Sensitive API responses should not be publicly cached.

Review cache headers for:

-   AI reflections,
-   safety responses,
-   personal export,
-   authenticated/private data.

Do not rely on framework defaults without checking.

------------------------------------------------------------------------

## 64. Clipboard and Download

If user explicitly copies or downloads their data, the action is
user-initiated.

Do not automatically copy journal or safety content to clipboard.

Downloaded files containing sensitive content should use clear filenames
and avoid misleading encryption claims.

------------------------------------------------------------------------

## 65. Privacy UX

Privacy controls should use plain language.

Avoid:

``` text
"Your information is processed pursuant to..."
```

as the only explanation inside core flows.

Prefer concise product truth:

``` text
"Catatan ini disimpan di perangkat ini."
```

or:

``` text
"Teks ini akan dikirim untuk membuat refleksi AI."
```

when technically accurate.

------------------------------------------------------------------------

## 66. Privacy Settings

Do not create settings toggles without real behavior.

Every toggle must map to actual system state.

Bad:

``` text
[✓] Private Mode
```

with no technical effect.

A smaller truthful privacy interface is better.

------------------------------------------------------------------------

## 67. Development Checklist for New Data

Before merging a feature that introduces a new data field:

-   [ ] Data class assigned
-   [ ] Purpose documented
-   [ ] Storage location defined
-   [ ] Server persistence justified
-   [ ] Retention defined
-   [ ] Deletion behavior defined
-   [ ] Third-party sharing identified
-   [ ] Logging checked
-   [ ] Analytics checked
-   [ ] Consent/disclosure checked
-   [ ] Security impact checked
-   [ ] Documentation updated

------------------------------------------------------------------------

## 68. Production Privacy Checklist

Before production:

-   [ ] Actual processor inventory completed
-   [ ] AI provider privacy/data-use settings verified
-   [ ] Hosting location documented
-   [ ] Newsletter provider documented
-   [ ] Analytics behavior documented
-   [ ] Error-monitoring sanitization tested
-   [ ] No sensitive session replay
-   [ ] No raw emotional text in logs
-   [ ] No raw journal text in analytics
-   [ ] Local-storage namespace implemented
-   [ ] Targeted local deletion implemented
-   [ ] Export uses real data
-   [ ] Privacy claims match implementation
-   [ ] Consent language matches actual processing
-   [ ] Privacy Policy matches architecture
-   [ ] Minor/child handling decision resolved
-   [ ] Cross-border processing reviewed
-   [ ] Data-subject request workflow reviewed
-   [ ] Security controls verified
-   [ ] Legal/compliance review completed where required

------------------------------------------------------------------------

## 69. Definition of Done --- P0 Data Architecture

P0 Data Architecture is complete when the project has explicit answers
for:

``` text
WHAT DATA EXISTS
        ↓
WHY IT EXISTS
        ↓
WHERE IT LIVES
        ↓
WHERE IT TRAVELS
        ↓
WHO CAN ACCESS IT
        ↓
HOW LONG IT EXISTS
        ↓
HOW IT IS DELETED
        ↓
WHAT THIRD PARTIES RECEIVE
        ↓
WHAT THE USER IS TOLD
```

No sensitive-data flow should exist only because it was convenient to
implement.

------------------------------------------------------------------------

## 70. Official Legal Reference

Primary legal baseline used for this engineering specification:

``` text
Undang-Undang Republik Indonesia
Nomor 27 Tahun 2022
tentang Pelindungan Data Pribadi
```

Official reference:

``` text
https://jdih.komdigi.go.id/produk_hukum/view/id/832/t/undangundang%2Bnomor%2B27%2Btahun%2B2022
```

Important engineering implications include:

-   personal data includes information that identifies or can identify
    an individual,
-   health information is classified as specific personal data,
-   children's data is classified as specific personal data,
-   processing personal data creates responsibilities for the party
    controlling that processing.

Do not treat this document as a replacement for legal advice or final
compliance review.

------------------------------------------------------------------------

## 71. Final Principle

For Rangkul Cerita, emotional data should not become a business asset by
default.

The architecture should make the safest behavior the easiest behavior:

``` text
Local when possible.
Transient when possible.
Minimal when transferred.
Purpose-bound when stored.
Short-lived when retained.
Targeted when deleted.
Truthful when explained.
```

When a developer or AI agent is unsure whether new sensitive data should
be collected, persisted, logged, analyzed, or shared:

``` text
DEFAULT TO NOT DOING IT
```

until the requirement and privacy implications are explicitly resolved.
