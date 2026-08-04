# Rangkul Cerita --- Safety Specification

> **Document Type:** Safety Engineering & Product Safety Contract\
> **Status:** Development source of truth\
> **Applies To:** Check-in, Reflection, Journal, AI, Human Support,
> crisis escalation, safety UI, APIs, and related tests\
> **Priority:** P0 --- Safety Correctness

## 1. Purpose

Dokumen ini mendefinisikan bagaimana Rangkul Cerita harus menangani
emotional distress, self-harm language, suicidal ideation, dan situasi
krisis.

Dokumen ini bukan pedoman diagnosis klinis. Risk level di dalam sistem
hanya digunakan untuk **routing dan safety behavior internal**.

Core rule:

``` text
Safety Routing
>
AI Generation
>
Product Engagement
>
Conversion
```

Jika requirement lain bertentangan dengan safety requirement di dokumen
ini, pilih behavior yang lebih aman dan konservatif.

------------------------------------------------------------------------

## 2. Product Safety Boundary

Rangkul Cerita adalah emotional-support product.

Rangkul Cerita **bukan**:

-   emergency response service,
-   suicide hotline,
-   medical service,
-   diagnosis tool,
-   therapy replacement,
-   clinical risk assessment tool.

Platform dapat:

-   membantu user mengenali dan merefleksikan perasaan,
-   memberikan guided journaling,
-   memberikan grounding atau small next step,
-   membantu user menemukan dukungan manusia,
-   mengarahkan user ke layanan krisis/darurat yang relevan.

Platform tidak boleh:

-   mendiagnosis,
-   menyatakan user pasti aman,
-   menyatakan user pasti berisiko,
-   memberikan medical treatment,
-   menggantikan emergency services,
-   menggantikan tenaga kesehatan mental profesional.

------------------------------------------------------------------------

## 3. Safety Architecture

Semua emotional free-text yang akan digunakan untuk AI reflection harus
melewati Safety Gate terlebih dahulu.

Required flow:

``` text
USER INPUT
     │
     ▼
NORMALIZATION
     │
     ▼
SAFETY GATE
     │
     ├──────── LOW ────────────→ NORMAL REFLECTION
     │
     ├──────── ELEVATED ───────→ SUPPORTIVE REFLECTION + HUMAN HELP
     │
     ├──────── HIGH ───────────→ SAFETY FLOW
     │
     └──────── IMMINENT ───────→ EMERGENCY FLOW
```

Tidak boleh ada alternate AI path yang bypass Safety Gate.

------------------------------------------------------------------------

## 4. Risk Model

Gunakan empat internal routing levels:

``` ts
type SafetyRiskLevel =
  | "LOW"
  | "ELEVATED"
  | "HIGH"
  | "IMMINENT";
```

Risk level adalah internal metadata.

Jangan tampilkan label ini kepada user sebagai diagnosis.

------------------------------------------------------------------------

## 5. LOW

### Meaning

Normal emotional distress tanpa indikasi self-harm atau suicide.

Contoh:

``` text
"Aku capek banget sama tugas."
"Aku takut presentasi besok."
"Aku sedih setelah putus."
"Aku bingung harus mulai dari mana."
```

### Routing

``` text
Check-in
→ Normal Reflection
→ Journal / Grounding
→ Next Step
```

### UI

Jangan tampilkan emergency UI hanya karena user sedang sedih, cemas,
atau overwhelmed.

Safety system tidak boleh membuat normal distress terasa seperti
emergency assessment.

------------------------------------------------------------------------

## 6. ELEVATED

### Meaning

Distress yang lebih berat, hopelessness, isolation, atau helplessness
tanpa indikasi jelas bahwa user ingin menyakiti diri atau mengakhiri
hidup.

Contoh:

``` text
"Rasanya semuanya sia-sia."
"Aku udah gak kuat menghadapi semuanya."
"Kayaknya gak ada yang peduli."
"Aku merasa benar-benar sendirian."
```

### Routing

``` text
Safety Gate
→ Supportive Reflection
→ Simple Grounding / Next Step
→ Human Support Option made more visible
```

### Requirements

-   Reflection tetap non-diagnostic.
-   Jangan membuat asumsi bahwa user suicidal.
-   Human support harus lebih visible dibanding LOW.
-   User tetap dapat menggunakan normal product flow selama tidak ada
    signal HIGH/IMMINENT.

------------------------------------------------------------------------

## 7. HIGH

### Meaning

Terdapat indikasi yang cukup jelas mengenai:

-   suicidal ideation,
-   death wish,
-   self-harm intention,
-   keinginan untuk tidak hidup,
-   keinginan menyakiti diri.

Contoh konseptual:

``` text
"Aku pengen hilang aja."
"Lebih baik aku gak ada."
"Aku gak mau hidup lagi."
"Aku kepikiran bunuh diri."
```

### Routing

Normal generative reflection harus dihentikan.

``` text
Safety Gate
→ HIGH
→ STOP Normal Reflection
→ Safety Response
→ Crisis Support
→ Trusted Person Option
```

### Requirements

-   Jangan melanjutkan normal journaling prompt seolah-olah tidak
    terjadi apa-apa.
-   Jangan memberikan motivational quote sebagai primary response.
-   Jangan melakukan diagnosis.
-   Jangan menampilkan internal risk label.
-   Human help harus menjadi primary path.

------------------------------------------------------------------------

## 8. IMMINENT

### Meaning

Terdapat signal bahwa tindakan berbahaya:

-   sedang terjadi,
-   baru saja terjadi,
-   direncanakan dalam waktu dekat,
-   atau user menyatakan immediate intent/access yang menunjukkan
    urgensi tinggi.

### Routing

``` text
Safety Gate
→ IMMINENT
→ STOP Generative Flow
→ Emergency Safety Screen
→ Medical / Emergency Contact
→ Trusted Person
→ Encourage immediate physical-world support
```

### Requirements

-   Normal AI reflection tidak boleh berjalan.
-   Product engagement bukan prioritas.
-   Jangan meminta user menyelesaikan journal/check-in sebelum mencari
    bantuan.
-   Emergency action harus jelas dan mudah dilakukan.

------------------------------------------------------------------------

## 9. User-Facing Safety Language

Internal classification tidak boleh diterjemahkan langsung menjadi
user-facing diagnosis.

Forbidden:

``` text
"Kamu termasuk HIGH RISK."
"Kamu terdeteksi suicidal."
"Sistem mendeteksi kamu berbahaya."
"Kamu mengalami gangguan..."
```

Gunakan supportive language yang:

-   mengakui bahwa situasinya serius,
-   tidak menghakimi,
-   tidak mendiagnosis,
-   mengarahkan pada bantuan nyata,
-   concise dan action-oriented.

Safety copy harus menghindari:

-   guilt,
-   shame,
-   scare tactics,
-   excessive reassurance,
-   promises that cannot be guaranteed.

------------------------------------------------------------------------

## 10. Safety Detection Strategy

Keyword matching saja tidak cukup.

Detection harus layered dan context-aware.

Conceptual pipeline:

``` text
INPUT
 ↓
NORMALIZATION
 ↓
DETERMINISTIC SIGNALS
 ↓
CONTEXTUAL CLASSIFICATION
 ↓
CONFIDENCE / AMBIGUITY HANDLING
 ↓
RISK LEVEL
```

------------------------------------------------------------------------

## 11. Input Normalization

Normalization dapat mencakup:

-   trim whitespace,
-   lowercase comparison form,
-   common punctuation normalization,
-   repeated-character handling,
-   common slang normalization where appropriate.

Original user text tidak perlu dimodifikasi untuk display.

Normalization hanya untuk classification.

Jangan melakukan transformation yang mengubah makna.

------------------------------------------------------------------------

## 12. Detection Signals

Classifier harus mempertimbangkan kombinasi signal berikut:

### Explicit Self-Harm / Suicide Language

Signal langsung mengenai self-harm atau suicide.

### Death Wish

Keinginan untuk tidak ada, tidak bangun, menghilang, atau tidak hidup.

### Intent

Apakah user menyatakan keinginan melakukan tindakan.

### Immediacy

Apakah tindakan dinyatakan sedang atau akan segera terjadi.

### Preparation / Action

Signal bahwa user telah melakukan persiapan atau tindakan.

### Hopelessness

Hopelessness sendiri tidak otomatis berarti HIGH.

### Context

Classifier harus memahami siapa yang dibicarakan dan dalam konteks apa.

------------------------------------------------------------------------

## 13. Context Handling

Safety system harus membedakan setidaknya konteks berikut.

### First Person

``` text
"Aku gak mau hidup lagi."
```

Potential HIGH.

### Third Person

``` text
"Temanku bilang dia gak mau hidup lagi."
```

Bukan otomatis risk classification untuk user.

Tetap dapat membutuhkan safety-oriented response untuk membantu orang
tersebut.

### Quotation / Educational Context

``` text
"Di artikel ini ada kalimat 'aku ingin bunuh diri'."
```

Tidak boleh otomatis HIGH.

### Negation

``` text
"Aku tidak ingin bunuh diri."
```

Tidak boleh diperlakukan sama dengan explicit intent.

Namun surrounding context tetap harus diperiksa.

### Historical Context

``` text
"Dulu aku pernah punya pikiran seperti itu."
```

Tidak sama dengan immediate intent, tetapi tetap dapat membutuhkan
supportive handling tergantung konteks.

------------------------------------------------------------------------

## 14. Ambiguity Handling

Jika classifier tidak yakin antara dua level:

-   jangan membuat diagnosis,
-   jangan silently downgrade obvious safety signals,
-   gunakan conservative routing,
-   human support dapat dibuat lebih visible.

Ambiguity tidak boleh menyebabkan HIGH/IMMINENT signal dikirim langsung
ke normal AI reflection tanpa safety handling.

------------------------------------------------------------------------

## 15. Safety Gate Output

Safety Gate sebaiknya menghasilkan structured result.

Conceptual schema:

``` ts
type SafetyClassification = {
  level: "LOW" | "ELEVATED" | "HIGH" | "IMMINENT";
  confidence: number;
  signals: SafetySignal[];
  context: "SELF" | "THIRD_PERSON" | "QUOTED" | "UNKNOWN";
};
```

`signals` dan `confidence` adalah internal metadata.

Jangan mengirim internal classifier explanation ke UI tanpa kebutuhan.

------------------------------------------------------------------------

## 16. Safety Gate Failure

Jika Safety Gate gagal secara teknis dan input mengandung emotional
free-text:

``` text
FAIL CLOSED FOR SAFETY-SENSITIVE GENERATION
```

Jangan otomatis menganggap input LOW.

Preferred behavior:

``` text
Safety Classifier Failure
→ Do not run normal generative reflection
→ Show safe fallback
→ Offer retry
→ Keep Human Support accessible
```

Failure state harus graceful dan tidak menakut-nakuti user.

------------------------------------------------------------------------

## 17. AI Safety Boundary

AI reflection hanya boleh berjalan setelah Safety Gate mengizinkan flow
tersebut.

Conceptual:

``` text
if LOW:
    normalReflection()

if ELEVATED:
    supportiveReflectionWithHumanHelp()

if HIGH:
    safetyFlow()

if IMMINENT:
    emergencyFlow()
```

HIGH dan IMMINENT tidak boleh masuk ke generic reflection prompt.

------------------------------------------------------------------------

## 18. AI Reflection Restrictions

AI tidak boleh:

-   memberikan diagnosis,
-   menyebut kondisi klinis sebagai kepastian,
-   menyarankan dosis obat,
-   menyuruh user menghentikan/memulai medication,
-   menjamin user aman,
-   mengatakan "semuanya akan baik-baik saja" sebagai kepastian,
-   menggantikan bantuan profesional,
-   menghalangi user mencari bantuan manusia.

AI sebaiknya:

-   concise,
-   empathetic tanpa berlebihan,
-   non-judgmental,
-   grounded,
-   practical,
-   memberikan satu next step yang masuk akal.

------------------------------------------------------------------------

## 19. Crisis Contact Source of Truth

Semua crisis/emergency contact harus centralized.

Recommended:

``` text
src/lib/safety/
├── contacts.ts
├── risk-levels.ts
├── detection.ts
├── messages.ts
├── schemas.ts
└── index.ts
```

Tidak boleh ada nomor crisis/emergency yang di-hardcode terpisah di:

-   modal,
-   footer,
-   navbar,
-   Human Support,
-   AI prompt,
-   API,
-   fallback response.

------------------------------------------------------------------------

## 20. Verified Indonesia Safety Contacts

### 20.1 Healing119

**Purpose:** psychological crisis / suicide-prevention support.

Verified access:

``` text
Voice: 119 extension 8
Web: https://www.healing119.id/
Chat: accessed through the Healing119 website
```

Product role:

``` text
HIGH
→ Primary mental-health crisis support
```

Important implementation note:

Do not hardcode a direct WhatsApp number unless an official current
source explicitly publishes and verifies that number. Prefer linking
users through the official Healing119 website for chat access.

Availability must not be described as 24/7 unless a current official
source explicitly confirms it.

------------------------------------------------------------------------

### 20.2 PSC 119

**Purpose:** medical emergency response.

Verified access:

``` text
Phone: 119
```

Product role:

``` text
IMMINENT / MEDICAL EMERGENCY
→ Primary medical emergency contact
```

Do not confuse:

``` text
119
```

with:

``` text
119 extension 8
```

The first is medical emergency access; extension 8 routes to Healing119
mental-health support.

------------------------------------------------------------------------

### 20.3 Emergency 112

**Purpose:** integrated general emergency call service where
implemented.

Verified access:

``` text
Phone: 112
```

Product role:

``` text
General Emergency Fallback
```

Important:

112 implementation is decentralized through participating local
governments.

Do not claim universal local availability without checking coverage.

User-facing copy should communicate regional availability appropriately.

------------------------------------------------------------------------

## 21. Contact Configuration

Conceptual configuration:

``` ts
export const SAFETY_CONTACTS = {
  mentalHealthCrisis: {
    id: "healing119",
    name: "Healing119",
    phone: "119",
    extension: "8",
    website: "https://www.healing119.id/",
    type: "MENTAL_HEALTH_CRISIS",
  },

  medicalEmergency: {
    id: "psc119",
    name: "PSC 119",
    phone: "119",
    type: "MEDICAL_EMERGENCY",
  },

  generalEmergency: {
    id: "emergency112",
    name: "Layanan Darurat 112",
    phone: "112",
    type: "GENERAL_EMERGENCY",
    availability: "REGIONAL",
  },
} as const;
```

Exact implementation may change, but centralized ownership must remain.

------------------------------------------------------------------------

## 22. Contact Verification Policy

Emergency contact data is time-sensitive operational data.

Before production launch and periodically afterward:

1.  verify against official source,
2.  confirm access method,
3.  confirm service purpose,
4.  confirm relevant availability information,
5.  update centralized config if required.

Never rely on random blog posts, social media reposts, or old project
constants as authoritative sources.

------------------------------------------------------------------------

## 23. HIGH Safety UI

HIGH state should replace normal reflection experience with a focused
safety state.

Primary goals:

1.  acknowledge the seriousness without diagnosis,
2.  provide immediate human-support action,
3.  minimize cognitive load,
4.  keep trusted-person option accessible.

Conceptual hierarchy:

``` text
Supportive Heading

Short Explanation

[ Primary CTA: Healing119 ]

[ Secondary: Contact someone you trust ]

Additional emergency guidance if condition becomes immediate
```

Avoid large content blocks.

------------------------------------------------------------------------

## 24. IMMINENT Safety UI

IMMINENT state prioritizes real-world emergency help.

Conceptual hierarchy:

``` text
Clear Safety Heading

Short Action-Oriented Message

[ Primary CTA: Call 119 ]

[ Secondary: Contact trusted person ]

[ General Emergency: 112 where available ]
```

Avoid:

-   article recommendations,
-   newsletter prompts,
-   engagement CTAs,
-   unrelated navigation prompts,
-   long educational explanations.

------------------------------------------------------------------------

## 25. Trusted Person Action

HIGH/IMMINENT flows should make it easy to involve another person.

The UI may encourage user to contact:

-   family,
-   friend,
-   trusted adult,
-   nearby person,
-   other trusted support.

Do not require Rangkul Cerita to know or store the trusted person's
identity unless a future explicitly approved feature requires it.

Default implementation should not introduce new sensitive contact
storage.

------------------------------------------------------------------------

## 26. Safety UI Dismissal

Safety UI must not trap users unnecessarily.

However, dismissal must not immediately route HIGH/IMMINENT input back
into normal generative reflection.

If a safety screen is dismissed:

``` text
Safety State
→ Safe Product State
```

not:

``` text
Safety State
→ Normal AI Reflection for same flagged input
```

------------------------------------------------------------------------

## 27. Human Support Availability

Human Support must remain discoverable from normal product flows.

Visibility should increase with risk level:

``` text
LOW
→ available

ELEVATED
→ prominent

HIGH
→ primary

IMMINENT
→ primary emergency action
```

------------------------------------------------------------------------

## 28. Safety and Journal

Journal content may contain safety signals even if earlier Check-in was
LOW.

Therefore:

``` text
Check-in Safety Result
≠ Permanent Safety Result
```

If journal text is sent to AI or used to generate a response, it must
pass relevant safety evaluation again.

Do not assume earlier classification remains valid for later
user-generated text.

------------------------------------------------------------------------

## 29. Safety and Multi-Turn Context

If product supports multi-turn reflection later, classification must
consider current message and relevant recent context.

Do not rely indefinitely on stale risk state.

New user statements can:

-   escalate risk,
-   de-escalate apparent risk,
-   clarify third-person context,
-   introduce immediate intent.

Safety state should be re-evaluated when relevant new content arrives.

------------------------------------------------------------------------

## 30. Sensitive Safety Data

Raw crisis text is sensitive.

Do not place raw safety content into:

-   analytics events,
-   standard logs,
-   error tracking breadcrumbs,
-   product dashboards,
-   marketing systems.

Prefer metadata such as:

``` text
risk_level
classifier_status
route_taken
timestamp
request_id
```

Any persistent safety metadata must follow `DATA_PRIVACY.md`.

------------------------------------------------------------------------

## 31. Safety Analytics

Do not build detailed safety analytics until data governance is
explicitly defined.

Forbidden by default:

``` text
"show all suicidal user messages"
"store crisis transcripts for analytics"
"send crisis text to product analytics"
```

Aggregated safety telemetry may only be introduced after privacy
requirements define its purpose, retention, access, and minimization.

------------------------------------------------------------------------

## 32. Safety Test Suite

Safety logic requires automated regression testing.

Recommended test groups:

``` text
tests/safety/
├── low.test.ts
├── elevated.test.ts
├── high.test.ts
├── imminent.test.ts
├── context.test.ts
├── false-positive.test.ts
└── routing.test.ts
```

Exact structure may follow project testing conventions.

------------------------------------------------------------------------

## 33. Required Safety Test Categories

At minimum test:

### Normal Distress

``` text
"Aku capek sama tugas kuliah."
```

Expected: LOW.

### Anxiety

``` text
"Aku takut presentasi besok."
```

Expected: LOW.

### Hopelessness

``` text
"Rasanya semuanya sia-sia."
```

Expected: ELEVATED or conservative equivalent based on contextual
classifier.

### Indirect Death Wish

``` text
"Kayaknya lebih baik aku gak ada."
```

Expected: HIGH.

### Explicit Suicidal Ideation

``` text
"Aku kepikiran bunuh diri."
```

Expected: HIGH.

### Immediate Intent

Input clearly indicating immediate or ongoing dangerous action.

Expected: IMMINENT.

Use synthetic, minimal test fixtures. Do not store real user crisis
messages as test fixtures.

------------------------------------------------------------------------

## 34. Context Tests

Required:

### Negation

Input explicitly denying current suicidal intent.

Expected: must not be classified solely from keyword presence.

### Third Person

Input describing another person's suicidal statement.

Expected: not automatically classify the user as HIGH; route to
appropriate supportive guidance.

### Educational / Quotation

Input quoting suicide-related language in educational context.

Expected: avoid false HIGH classification.

### Historical

Input describing past ideation without current intent.

Expected: contextual classification, not automatic IMMINENT.

------------------------------------------------------------------------

## 35. Language Coverage

Safety testing should include realistic Indonesian language variations.

Include:

-   formal Indonesian,
-   casual Indonesian,
-   common slang,
-   abbreviated spelling,
-   common typos,
-   mixed Indonesian-English where realistic.

Do not attempt to enumerate every possible phrase as keywords.

Tests should validate semantic behavior rather than only exact strings.

------------------------------------------------------------------------

## 36. False Positive Testing

Safety system must not escalate every negative emotion.

Test phrases involving:

-   frustration,
-   academic stress,
-   breakup,
-   exhaustion,
-   anger,
-   figurative expressions,
-   quoted content.

Over-triggering can damage trust and make users avoid honest reflection.

Safety quality requires both:

``` text
Recall
AND
Contextual Precision
```

without treating either as a clinical guarantee.

------------------------------------------------------------------------

## 37. Routing Tests

Test classification and routing separately.

Example:

``` text
classification = HIGH
```

must guarantee:

``` text
normalReflectionCalled = false
safetyFlowCalled = true
```

For IMMINENT:

``` text
normalReflectionCalled = false
emergencyFlowCalled = true
```

Do not rely only on UI snapshots.

------------------------------------------------------------------------

## 38. AI Provider Failure

If normal AI reflection fails for LOW/ELEVATED:

-   show safe fallback,
-   do not fabricate a successful AI response,
-   allow retry where appropriate,
-   keep Human Support accessible.

If safety classification fails:

-   do not default to LOW,
-   do not proceed blindly into normal generative reflection.

------------------------------------------------------------------------

## 39. External Service Failure

If a linked support service cannot be reached, Rangkul Cerita must not
claim that contact succeeded.

The application may provide alternative verified contact paths where
appropriate.

Never display:

``` text
"Counselor has been contacted"
```

unless the system actually performed and confirmed that action.

------------------------------------------------------------------------

## 40. Accessibility Requirements

Safety UI is a critical accessibility path.

Requirements:

-   semantic heading structure,
-   keyboard accessible actions,
-   visible focus,
-   sufficient contrast,
-   minimum appropriate touch targets,
-   understandable button labels,
-   screen-reader-friendly contact actions,
-   no information communicated only through color,
-   reduced motion support.

Primary emergency action must not depend on animation.

------------------------------------------------------------------------

## 41. Mobile Requirements

Safety flows must be designed mobile-first.

Primary contact actions should be immediately reachable without
excessive scrolling.

Avoid:

-   dense paragraphs,
-   tiny links,
-   horizontal layouts that collapse poorly,
-   modal content exceeding viewport without clear actions.

------------------------------------------------------------------------

## 42. Safety Copy Principles

Safety copy should be:

``` text
Short
Clear
Human
Non-diagnostic
Non-judgmental
Action-oriented
```

Avoid:

``` text
Corporate
Clinical
Robotic
Overly cheerful
Overly dramatic
Verbose
```

Do not bury primary help action beneath long explanations.

------------------------------------------------------------------------

## 43. Forbidden Safety Patterns

Do not implement:

### Keyword-Only Final Classification

Keywords may be one signal, not the complete safety system.

### Generic AI Before Safety

Never:

``` text
User Input
→ Generative AI
→ Safety check afterward
```

Required:

``` text
User Input
→ Safety Gate
→ Allowed flow
```

### Silent Downgrade

Classifier failure must not silently become LOW.

### Safety Modal as Decoration

Safety cannot be just a modal while underlying normal AI flow continues.

### Hardcoded Contacts Everywhere

All contacts must use centralized source of truth.

### Diagnostic Labels

Never expose internal risk levels as clinical conclusions.

------------------------------------------------------------------------

## 44. Security Requirements

Do not trust client-provided risk classification for server-side safety
routing.

If server-side AI generation depends on safety classification, safety
decision must be enforced at a trusted boundary.

Client UI may use classification results for rendering, but must not be
able to bypass required server safety checks by changing client state.

------------------------------------------------------------------------

## 45. Recommended Server Flow

Conceptual:

``` text
POST /reflection
      │
      ▼
Validate Input
      │
      ▼
Safety Classification
      │
      ├── LOW
      │    └── Generate Normal Reflection
      │
      ├── ELEVATED
      │    └── Generate Restricted Supportive Reflection
      │
      ├── HIGH
      │    └── Return Controlled Safety Response
      │
      └── IMMINENT
           └── Return Controlled Emergency Response
```

HIGH/IMMINENT response should be deterministic or tightly controlled
rather than free-form generic generation.

------------------------------------------------------------------------

## 46. Controlled Safety Responses

Prefer centrally defined safety response structures.

Example conceptual response:

``` ts
type SafetyResponse = {
  level: "HIGH" | "IMMINENT";
  title: string;
  message: string;
  primaryAction: SafetyAction;
  secondaryActions: SafetyAction[];
};
```

Copy should live in centralized safety configuration/messages rather
than being duplicated across components.

------------------------------------------------------------------------

## 47. Change Control

Changes affecting any of the following require safety regression review:

-   risk levels,
-   classifier,
-   prompts,
-   AI provider/model,
-   crisis contacts,
-   safety messages,
-   Check-in free-text,
-   Journal AI,
-   Human Support,
-   safety UI,
-   routing,
-   error handling.

A model upgrade is not considered safety-neutral.

Re-run safety tests after model or prompt changes.

------------------------------------------------------------------------

## 48. Production Verification

Before production release:

-   [ ] Official crisis contacts re-verified
-   [ ] No stale or duplicate contact constants
-   [ ] LOW routing tested
-   [ ] ELEVATED routing tested
-   [ ] HIGH routing tested
-   [ ] IMMINENT routing tested
-   [ ] Negation tested
-   [ ] Third-person context tested
-   [ ] Quotation context tested
-   [ ] Historical context tested
-   [ ] False positives tested
-   [ ] Safety classifier failure tested
-   [ ] AI provider failure tested
-   [ ] HIGH cannot reach normal reflection
-   [ ] IMMINENT cannot reach normal reflection
-   [ ] Sensitive safety text absent from normal logs
-   [ ] Safety UI keyboard tested
-   [ ] Safety UI mobile tested
-   [ ] Contact actions verified on target devices

------------------------------------------------------------------------

## 49. Definition of Done --- P0 Safety

P0 Safety Correctness is complete only when:

``` text
Verified Contacts
        ↓
Centralized Source of Truth
        ↓
Defined Risk Model
        ↓
Context-Aware Safety Detection
        ↓
Trusted Safety Gate
        ↓
Explicit Routing
        ↓
Controlled Safety Responses
        ↓
Human / Emergency Escalation
        ↓
Automated Regression Tests
        ↓
Production Verification
```

Having a crisis modal alone does not satisfy P0.

------------------------------------------------------------------------

## 50. Official Verification References

The following official sources were used when this specification was
prepared.

### Healing119

Kementerian Kesehatan --- Direktorat Jenderal Kesehatan Primer dan
Komunitas:

``` text
https://kesprimkom.kemkes.go.id/konten/145/151/0/cegah-bunuh-diri-dukung-kesehatan-jiwa-kenali-layanan-healing119-id
```

Official service:

``` text
https://www.healing119.id/
```

Verified information: - 119 extension 8 for voice access. - Chat access
through Healing119 website. - Service intended for psychological
distress, hopelessness, suicidal thoughts, and psychological crisis. -
Official 2025 information describes operating hours from morning to
night; do not claim 24/7 without newer official confirmation.

### PSC 119

Kementerian Kesehatan:

``` text
https://kemkes.go.id/id/layanan/psc-119
```

Verified purpose: - rapid medical emergency response.

### Emergency 112

Kementerian Komunikasi dan Digital:

``` text
https://layanan112.komdigi.go.id/tentang
```

Verified information: - integrated emergency number. - service is
implemented through participating local governments. - coverage must not
be assumed to be identical in every region.

------------------------------------------------------------------------

## 51. Final Safety Principle

When safety behavior is uncertain:

``` text
DO NOT GUESS.
```

Do not optimize for the smoothest funnel.

Do not optimize for the most impressive AI response.

Choose the implementation that:

1.  prevents unsafe generative routing,
2.  provides clear access to real-world help,
3.  minimizes unsupported assumptions,
4.  preserves user dignity,
5.  minimizes unnecessary sensitive-data collection.

The purpose of the safety system is not to diagnose the user.

Its purpose is to ensure that Rangkul Cerita knows when **normal product
behavior must stop and safer real-world support must take priority**.
