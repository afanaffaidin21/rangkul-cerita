# Rangkul Cerita --- Development PRD

> **Document Type:** Engineering-Focused Product Requirements Document\
> **Purpose:** Source of truth untuk AI-assisted development\
> **Priority Model:** P0 → P1 → P2 → P3\
> **Project:** Rangkul Cerita

## 1. Document Purpose

Dokumen ini adalah acuan utama untuk development dan refactoring Rangkul
Cerita.

PRD ini berfokus pada: - product behavior - safety - data & privacy -
backend - core user flow - frontend architecture - homepage structure -
UI refinement

Dokumen ini **bukan business PRD**. Jangan menambahkan business
strategy, market analysis, monetization strategy, atau fitur baru yang
tidak diperlukan untuk memenuhi requirement di dokumen ini.

## 2. Product Context

Rangkul Cerita adalah digital emotional-support platform yang membantu
pengguna: 1. mengenali kondisi emosionalnya, 2. merefleksikan apa yang
sedang dirasakan, 3. menuliskan pikiran melalui guided journal, 4.
mendapatkan langkah kecil yang dapat dilakukan, 5. menemukan bantuan
manusia ketika diperlukan.

Core product journey:

``` text
Check-in
   ↓
Reflection
   ↓
Journal
   ↓
Next Step
   ↓
Human Support
```

Rangkul Cerita bukan layanan diagnosis, pengganti psikolog/psikiater,
emergency service, atau medical treatment platform.

AI tidak boleh memberikan diagnosis, prescription, rekomendasi obat,
kepastian kondisi psikologis, atau klaim bahwa AI menggantikan tenaga
profesional.

## 3. Product Development Principles

Semua development harus mengikuti urutan:

``` text
Safety
   ↓
Product Truth
   ↓
Data & Privacy
   ↓
Backend Reliability
   ↓
Core Product
   ↓
Architecture
   ↓
Homepage
   ↓
UI Polish
```

Prioritas: `P0 > P1 > P2 > P3`.

Jangan melakukan large UI refactor sebelum P0 selesai. Jangan
menambahkan fitur baru sebelum core product flow P1 stabil.

## 4. P0 --- Safety Correctness

### Objective

Memastikan pengguna yang menunjukkan indikasi krisis tidak diproses
seperti normal emotional check-in.

``` text
Safety > AI Generation > Product Engagement > Conversion
```

### 4.1 Crisis Contact Verification

Semua emergency/crisis contact harus berasal dari sumber resmi, masih
aktif, relevan untuk Indonesia, dan memiliki fungsi yang jelas. Jangan
menggunakan nomor yang belum diverifikasi.

Kategori utama: - Mental Health Crisis - Medical Emergency - General
Emergency

### 4.2 Single Source of Truth

Jangan hardcode emergency contact pada berbagai component.

Recommended structure:

``` text
src/
└── lib/
    └── safety/
        ├── contacts.ts
        ├── risk-levels.ts
        ├── detection.ts
        ├── messages.ts
        └── index.ts
```

Semua SafetyModal, SafetyUtilityBar, HumanSupport, Footer, AI Safety
Response, dan API harus menggunakan source yang sama.

### 4.3 Safety Risk Levels

Internal safety classification:

-   `LOW`
-   `ELEVATED`
-   `HIGH`
-   `IMMINENT`

Level ini hanya untuk routing internal dan tidak boleh menjadi diagnosis
user-facing.

**LOW:** Normal emotional distress → Normal Reflection →
Journal/Grounding → Next Step.

**ELEVATED:** Significant distress/hopelessness tanpa indikasi eksplisit
immediate self-harm → Supportive Reflection → Grounding → Human Support
Option.

**HIGH:** Indikasi jelas self-harm, suicidal ideation, atau death wish →
STOP normal reflection → Safety Response → Crisis Support → Trusted
Person.

**IMMINENT:** Ada indikasi tindakan sedang terjadi atau akan segera
dilakukan → STOP generative flow → Emergency Safety Screen → Emergency
Contact → Trusted Person → Safe Physical Environment.

### 4.4 Crisis Detection

Jangan hanya menggunakan keyword matching. Detection harus
mempertimbangkan explicit self-harm language, indirect language,
euphemism, slang Indonesia, intent, immediacy, context, negation,
quotation, dan third-person statement.

### 4.5 Safety Gate

``` text
USER INPUT
     ↓
SAFETY GATE
     ↓
LOW / ELEVATED / HIGH / IMMINENT
```

HIGH dan IMMINENT tidak boleh melanjutkan normal generative reflection.

### 4.6 Safety Testing

Buat automated test suite minimal untuk normal distress, hopelessness,
explicit/indirect self-harm, immediate intent, slang, typo, negation,
quotation, third-person statement, dan false positive.

### Acceptance Criteria

-   Crisis contacts verified dan centralized.
-   Tidak ada duplicate hardcoded crisis contact.
-   Risk levels tersedia.
-   Safety gate berjalan sebelum normal AI flow.
-   HIGH/IMMINENT menghentikan normal reflection.
-   Safety response tersedia.
-   Safety test suite tersedia.
-   Tidak ada user-facing diagnostic risk label.

## 5. P0 --- Product Truth

### Objective

UI tidak boleh menjanjikan capability yang sebenarnya belum tersedia.

``` text
What UI Claims = What System Actually Does
```

Audit seluruh product copy dan functionality.

### 5.1 Encryption

Jangan menggunakan claim seperti `Encrypted`, `End-to-end encrypted`,
atau `Only you can read this` kecuali architecture benar-benar
mengimplementasikannya.

### 5.2 PIN Security

PIN tidak boleh dianggap security feature jika hanya berupa React state
atau UI simulation. Implement properly atau remove.

### 5.3 Data Export

"Download My Data" harus mengekspor real user data dan tidak menggunakan
dummy data. Jika belum tersedia, remove/disable/label as unavailable.

### 5.4 Testimonials

Jangan menampilkan fictional testimonials seolah-olah real.

### 5.5 Expert Review

Jangan menggunakan `Reviewed by psychologist`, `Clinically reviewed`,
atau `Expert reviewed` jika review tersebut belum benar-benar terjadi.

### 5.6 Institutional Reporting

Jangan claim institusi menerima aggregated reports sebelum reporting
architecture benar-benar tersedia.

### Acceptance Criteria

Tidak ada unsupported claim terkait encryption, PIN, data export,
testimonials, expert review, institutional reporting, AI capability,
atau privacy capability.

## 6. P0 --- Data Architecture

### Objective

Menentukan secara eksplisit di mana data berada, siapa yang dapat
mengaksesnya, berapa lama disimpan, dan bagaimana data dihapus.

### 6.1 Data Classification

Minimal pisahkan: - Anonymous Product Data - Sensitive Emotional Data -
Journal Data - Account Data - Contact Data - Partnership Data -
Analytics Data - Safety Events

### 6.2 Storage Model

Setiap data type harus memiliki keputusan: Local-only, Server,
Account-linked, Anonymous, Temporary, atau Persistent.

Prefer local-first untuk sensitive data jika server persistence tidak
diperlukan.

### 6.3 Data Boundaries

``` text
Browser
   ↓
Application Server
   ↓
Database
   ↓
AI Provider
   ↓
Third Party
```

Untuk setiap boundary tentukan data apa yang melewatinya. Gunakan
prinsip `Minimum Necessary Data`.

### 6.4 Retention

Setiap server-side data harus memiliki retention policy: apa yang
disimpan, berapa lama, mengapa, dan kapan dihapus.

### 6.5 Deletion

Deletion harus targeted. Jangan gunakan `localStorage.clear()`. Gunakan
namespaced application keys seperti `rangkul.*`.

### 6.6 Consent

User harus mengetahui ketika sensitive content dikirim ke server,
dikirim ke AI provider, atau disimpan secara persistent.

### 6.7 Encryption

Jika encryption diimplementasikan, dokumentasikan encryption at rest,
encryption in transit, key ownership, key storage, dan encryption
boundaries.

### Acceptance Criteria

Tersedia dokumentasi jelas mengenai data types, storage location,
retention, deletion, consent, encryption, dan third-party boundaries.
Tidak ada ambiguous sensitive-data flow.

## 7. P1 --- Backend Reliability

### Objective

Mengubah backend dari prototype menjadi reliable application backend.

### 7.1 Database

Tambahkan persistence untuk data yang memang membutuhkan server storage.
Jangan otomatis menyimpan journal atau emotional content.

### 7.2 Newsletter

``` text
Client → Validation → API → Database / Newsletter Provider → Success
```

Success hanya boleh ditampilkan setelah persistence berhasil.

### 7.3 Partnership

``` text
Form → Validation → API → Database → Notification / CRM → Success
```

Submission tidak boleh hilang setelah API request selesai.

### 7.4 Rate Limiting

Tambahkan rate limiting terutama untuk AI endpoints, Newsletter,
Partnership, dan public forms.

### 7.5 Validation

Gunakan schema validation pada API request/response, form input, AI
structured output, dan environment config.

### 7.6 Logging

Logging tidak boleh secara default menyimpan journal content, emotional
reflection, crisis text, atau sensitive personal information. Prefer
request ID, timestamp, route, status, latency, error category, dan
safety routing metadata.

### Acceptance Criteria

-   Persistent submissions benar-benar tersimpan.
-   API input tervalidasi.
-   AI output tervalidasi.
-   Rate limiting aktif.
-   Error handling tersedia.
-   Sensitive text tidak masuk normal logs.

## 8. P1 --- Core Product

### Objective

Sempurnakan satu core journey sebelum menambah fitur baru.

``` text
CHECK-IN → REFLECTION → JOURNAL → NEXT STEP → HUMAN SUPPORT
```

### 8.1 Check-in

Sederhana, mobile friendly, low cognitive load, dan tidak terasa seperti
clinical assessment. Prefer progressive disclosure.

### 8.2 Reflection

Supportive, concise, non-diagnostic, context-aware, dan actionable. AI
tidak boleh diagnose, prescribe, claim certainty, atau impersonate
professional therapist.

### 8.3 Journal

Journal harus menjadi continuation dari reflection, bukan disconnected
feature.

### 8.4 Next Step

Setiap completed reflection harus memberikan satu actionable next step.
Kategori dapat berupa Grounding, Rest, Reflection, Small Action, Talk to
Someone, atau Professional Support.

### 8.5 Human Support

Human Support harus selalu accessible. Escalation visibility meningkat
berdasarkan safety level.

### Acceptance Criteria

User dapat menyelesaikan Check-in → Reflection → Journal → Next Step
tanpa dead-end. Human Support dapat diakses dan Safety Gate
terintegrasi.

## 9. P2 --- Application Architecture

### Objective

Membuat codebase scalable dan mudah dipahami manusia maupun coding
agent.

Recommended:

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

### 9.1 AI

Centralize AI provider, model config, prompts, safety rules, output
schemas, dan error handling. API routes menjadi orchestration layer.

### 9.2 Configuration

Environment-specific config harus centralized. Jangan hardcode AI model,
API config, external services, atau environment-dependent values.

### 9.3 Client Components

Kurangi unnecessary `"use client"`. Static/content sections sebaiknya
Server Components jika memungkinkan.

### 9.4 Error Handling

Sediakan predictable states: loading, success, empty, validation error,
network error, AI error, rate limited, safety escalation.

### Acceptance Criteria

Domain boundaries, AI logic, safety logic, config, dan validation
jelas/centralized; client bundle tidak unnecessarily besar; error states
predictable.

## 10. P2 --- Homepage Simplification

### Objective

Mengubah homepage dari content-heavy page menjadi focused product
journey.

Target sekitar 9--10 primary sections:

1.  Hero
2.  Trust / Safety Proof
3.  Interactive Check-in
4.  How Rangkul Cerita Helps
5.  Core Features
6.  Human Support Bridge
7.  Safety & Privacy
8.  Social / Expert Proof
9.  FAQ
10. Final CTA

Secondary content dipindahkan ke dedicated pages seperti `/check-in`,
`/journal`, `/resources`, `/articles`, `/help`, `/safety`, `/privacy`,
`/about`, dan `/partnership`.

Primary homepage berfokus kepada end user. Partnership menjadi secondary
route.

### Acceptance Criteria

-   Homepage sekitar 9--10 primary sections.
-   Core check-in memiliki visual priority tinggi.
-   Secondary content dipindahkan.
-   B2C journey menjadi primary narrative.
-   Partnership tidak mengganggu primary conversion journey.

## 11. P3 --- UI Polish

P3 hanya dimulai setelah core P0--P2 stabil.

### 11.1 Visual Hierarchy

``` text
Primary interactive surface → Card
Supporting content → Flat
Editorial content → Borderless
Trust content → Subtle surface
CTA → High contrast
```

### 11.2 Responsive Refinement

Audit minimal 320px, 375px, 390px, 768px, 1024px, 1280px, dan 1440px+.
Prioritas Mobile → Tablet → Desktop.

### 11.3 Micro-interactions

Gunakan motion hanya untuk feedback, navigation, progress, hierarchy,
atau state transition.

### 11.4 Illustration & Photography

Visual harus Warm, Human, Calm, Inclusive, Non-clinical, Contemporary.
Hindari depressed stock photography, hospital imagery, dramatic sadness,
dan generic corporate wellness imagery.

### 11.5 Accessibility

Audit keyboard navigation, focus state, semantic HTML, form labels,
contrast, screen reader semantics, reduced motion, touch targets,
heading hierarchy, dan error announcements. Target WCAG 2.2 AA untuk
critical journeys.

## 12. AI Development Rules

1.  **Inspect Before Modify:** inspect existing implementation,
    dependencies, dan affected components sebelum mengubah code.
2.  **Preserve Working Logic:** UI task tidak boleh mengubah unrelated
    business logic; backend task tidak boleh redesign unrelated UI.
3.  **No Fake Implementation:** dilarang fake API success, dummy
    persistence, fake
    encryption/security/authentication/testimonials/analytics/expert
    review.
4.  **No Silent Assumptions:** untuk Safety, Privacy, Security,
    Sensitive Data, dan Medical Claims, jangan mengarang behavior.
5.  **No Feature Creep:** fokus membuat existing product trustworthy dan
    reliable.
6.  **Safety Cannot Regress:** perubahan AI, Check-in, Journal, API,
    Safety, dan Human Support tidak boleh bypass Safety Gate.

## 13. Implementation Order

``` text
PHASE 01
Safety Contact Verification
→ Safety Source of Truth
→ Risk Model
→ Safety Detection
→ Safety Routing
→ Safety Tests

PHASE 02
Product Claims Audit
→ Remove Fake Functionality
→ Privacy/Data Decisions
→ Data Boundary Documentation

PHASE 03
Database
→ Newsletter Persistence
→ Partnership Persistence
→ Validation
→ Rate Limiting
→ Safe Logging

PHASE 04
Check-in
→ Reflection
→ Journal
→ Next Step
→ Human Support

PHASE 05
Domain Refactor
→ AI Centralization
→ Safety Centralization
→ Config Centralization
→ Server/Client Optimization

PHASE 06
Homepage Simplification
→ Dedicated Pages

PHASE 07
Responsive Refinement
→ Visual Polish
→ Motion
→ Accessibility
```

Do not skip directly to later phases unless explicitly instructed.

## 14. Global Definition of Done

-   [ ] Safety contacts verified
-   [ ] Safety routing tested
-   [ ] No fake security/privacy claims
-   [ ] Data architecture documented
-   [ ] Sensitive data boundaries understood
-   [ ] Real backend persistence works
-   [ ] Input/output validation works
-   [ ] Rate limiting exists
-   [ ] Sensitive text excluded from standard logs
-   [ ] Core journey works end-to-end
-   [ ] AI safety guardrails work
-   [ ] Error states handled
-   [ ] Homepage focused
-   [ ] Responsive behavior verified
-   [ ] Accessibility critical paths audited
-   [ ] Production build succeeds

## 15. Final Engineering Principle

Setiap development decision harus menjawab:

1.  Apakah ini aman?
2.  Apakah UI mengatakan yang sebenarnya?
3.  Apakah sensitive data diperlakukan dengan benar?
4.  Apakah core journey menjadi lebih baik?
5.  Apakah implementation maintainable?
6.  Apakah fitur ini benar-benar diperlukan sekarang?

Jika jawabannya tidak jelas, jangan menambah complexity.

Prioritas Rangkul Cerita saat ini adalah mengubah **Impressive
Prototype** menjadi **Safe, Trustworthy, Reliable, Maintainable,
Production-Ready Product**.
