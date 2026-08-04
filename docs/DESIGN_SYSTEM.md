# Rangkul Cerita --- Design System

> **Document Type:** UI/UX Design System & Frontend Visual Contract\
> **Status:** Development source of truth\
> **Design Direction:** Warm Reflective Editorial\
> **Applies To:** Public website, Check-in, Reflection, Cerita/Journal,
> Summary, Perjalanan, Human Support, Safety UI, forms, responsive
> behavior, and reusable UI components

## 1. Purpose

Dokumen ini mendefinisikan visual language dan interaction rules Rangkul
Cerita berdasarkan desain produk yang sudah ada saat ini.

Tujuannya **bukan redesign**.

Tujuannya adalah:

``` text
Preserve what already works
→ formalize it
→ remove inconsistency
→ make future implementation predictable
```

Coding agent tidak boleh membuat visual language baru untuk setiap
halaman.

Jika implementation saat ini sudah sesuai dengan prinsip di dokumen ini,
pertahankan.

Jika terdapat inconsistency, refactor secara incremental.

------------------------------------------------------------------------

## 2. Design Direction

Official design direction:

``` text
Warm Reflective Editorial
```

Rangkul Cerita harus terasa seperti:

``` text
ruang digital pribadi
untuk memahami perasaan
tanpa terasa seperti aplikasi medis
```

Visual personality:

-   Calm
-   Warm
-   Human
-   Private
-   Reflective
-   Youthful
-   Safe
-   Clear
-   Modern

Bukan:

-   Clinical
-   Corporate
-   Futuristic
-   Robotic
-   Childish
-   Overly cute
-   Moody
-   Luxury
-   Mystical
-   Gamified

------------------------------------------------------------------------

## 3. Existing Design Is the Baseline

Current high-fidelity design sudah memiliki visual direction yang
relatif matang.

Do not redesign merely for novelty.

Preserve:

-   green-based identity,
-   warm neutral backgrounds,
-   generous whitespace,
-   soft surfaces,
-   editorial typography,
-   rounded but restrained components,
-   human/non-clinical emotional language,
-   calm interaction patterns.

Changes should improve hierarchy, consistency, accessibility,
responsiveness, and usability.

------------------------------------------------------------------------

## 4. Brand Identity

Existing logo consists of:

``` text
two green speech bubbles
forming a heart
+
yellow center accent
```

Brand meaning:

``` text
Conversation
Connection
Story
Care
Emotional expression
```

Do not reinterpret the brand into:

-   medical cross imagery,
-   brain icons,
-   therapy couch imagery,
-   AI/robot imagery,
-   mystical wellness symbols.

------------------------------------------------------------------------

## 5. Core Color System

Primary palette:

  Token           Value       Role
  --------------- ----------- ------------------------------------
  Forest Ink      `#173D30`   Primary dark text, strong headings
  Rangkul Green   `#2E6F57`   Primary brand/action
  Leaf Green      `#58A17F`   Secondary accent
  Soft Sage       `#BFDCCD`   Soft supporting surface
  Mist Green      `#EEF7F2`   Subtle section/background
  Warm White      `#FAFBF8`   Main page background

The interface should remain predominantly:

``` text
Warm White
+
Forest Ink
+
Rangkul Green
```

Supporting greens should create hierarchy rather than decoration.

------------------------------------------------------------------------

## 6. Emotional Accent Colors

Emotional states may use restrained secondary accents.

Recommended baseline:

  Meaning               Color
  --------------------- --------------------------------------
  Calm                  `#86BFA8`
  Happy / Positive      `#F2C66D`
  Sad / Reflective      `#8FAFD0`
  Anxious / Uncertain   `#C8A4D8`
  Safety / Danger       use approved accessible danger token

Emotional colors are **supporting signals**, not diagnostic labels.

Never communicate meaning through color alone.

Use:

``` text
Color
+
Text
+
Icon / shape when appropriate
```

------------------------------------------------------------------------

## 7. Safety Color

Safety-critical UI must use an accessible danger treatment distinct from
normal emotional accents.

Do not use bright red across normal emotional experiences.

Red/danger styling is reserved for:

-   destructive actions,
-   critical errors,
-   emergency/safety escalation where necessary.

HIGH/IMMINENT safety screens should remain calm and readable rather than
visually alarming.

Safety urgency comes primarily from:

``` text
copy hierarchy
+
action hierarchy
+
clear CTA
```

not aggressive visual treatment.

------------------------------------------------------------------------

## 8. Color Usage Rules

### Primary Brand

Use Rangkul Green for:

-   primary buttons,
-   active navigation,
-   meaningful interactive highlights,
-   selected states where appropriate.

### Forest Ink

Use for:

-   main headings,
-   high-emphasis body text,
-   strong navigation labels.

### Warm White

Default page canvas.

### Mist Green

Use for:

-   subtle grouped sections,
-   privacy/trust information,
-   supportive context,
-   calm section separation.

### Soft Sage

Use sparingly for:

-   subtle card surfaces,
-   selected/hover states,
-   decorative support.

Do not turn every section green.

Whitespace remains a core design element.

------------------------------------------------------------------------

## 9. Contrast

Critical text and interactive elements should target WCAG 2.2 AA.

Do not use pale green text on pale green backgrounds for aesthetic
reasons.

Muted text must remain readable.

Interactive states must not depend on subtle color differences that
disappear on low-quality screens.

------------------------------------------------------------------------

## 10. Typography

Current typography direction:

``` text
Plus Jakarta Sans
+
Lora
```

### Plus Jakarta Sans

Primary product/UI typeface.

Use for:

-   navigation,
-   buttons,
-   labels,
-   form fields,
-   body copy,
-   cards,
-   product interface,
-   metadata.

### Lora

Editorial/emotional display typeface.

Use selectively for:

-   major hero statements,
-   reflective headings,
-   editorial emphasis,
-   emotionally meaningful quotes or prompts.

Do not use Lora for dense UI.

------------------------------------------------------------------------

## 11. Typography Principle

Typography should communicate:

``` text
Product clarity
+
Editorial warmth
```

Not:

``` text
Corporate SaaS
```

and not:

``` text
Lifestyle magazine
```

The product must remain functional and easy to scan.

------------------------------------------------------------------------

## 12. Type Hierarchy

Recommended semantic hierarchy:

``` text
Display
→ Rare, emotional/editorial emphasis

H1
→ Page purpose

H2
→ Major section

H3
→ Card / subsection title

Body Large
→ Lead explanation

Body
→ Default content

Body Small
→ Supporting information

Label
→ Form / control

Caption
→ Metadata
```

Do not select heading sizes based only on visual appearance.

Semantic HTML hierarchy must remain correct.

------------------------------------------------------------------------

## 13. Heading Style

Headings should generally be:

-   concise,
-   sentence case,
-   low-to-medium line length,
-   visually confident without oversized SaaS-style typography.

Avoid extremely large hero text that pushes the actual product action
below the fold on mobile.

------------------------------------------------------------------------

## 14. Body Copy

Body copy should prioritize readability.

Recommended behavior:

``` text
comfortable line-height
moderate measure
short paragraphs
clear spacing
```

Long explanatory text should not stretch across wide desktop screens.

Editorial content should use constrained reading width.

------------------------------------------------------------------------

## 15. Copy Tone

UI copy should feel:

``` text
calm
direct
human
non-judgmental
non-clinical
```

Prefer short Indonesian sentences.

Avoid:

``` text
corporate jargon
therapy impersonation
clinical terminology
overly motivational language
dramatic emotional copy
cute/gimmicky language
```

------------------------------------------------------------------------

## 16. Spacing System

Use a consistent spacing scale.

Recommended conceptual scale:

``` text
4
8
12
16
20
24
32
40
48
64
80
96
```

Map to existing Tailwind/design tokens where possible.

Do not introduce arbitrary values unless required by layout.

------------------------------------------------------------------------

## 17. Spacing Philosophy

Rangkul Cerita relies heavily on breathing room.

Use whitespace to establish hierarchy before adding:

-   borders,
-   backgrounds,
-   cards,
-   shadows.

Section spacing should feel generous but not create excessive scrolling
on mobile.

------------------------------------------------------------------------

## 18. Content Width

Use constrained content containers.

Conceptual:

``` text
Full page shell
→ responsive max width

Editorial reading content
→ narrower measure

Forms / Check-in / Journal
→ focused medium width
```

Desktop must not stretch emotional forms across the entire viewport.

------------------------------------------------------------------------

## 19. Border Radius

Existing interface uses soft rounded geometry.

Use consistent radius tokens rather than arbitrary rounding.

Conceptual hierarchy:

``` text
Small controls
→ medium radius

Inputs / buttons
→ medium radius

Cards
→ medium-large radius

Major interactive surface
→ large radius where appropriate
```

Avoid:

``` text
everything = huge rounded rectangle
```

Rounded corners support warmth; they are not the entire visual identity.

------------------------------------------------------------------------

## 20. Shadows

Use shadows sparingly.

Default hierarchy should come from:

``` text
spacing
background
border
typography
```

before shadow.

Avoid:

-   floating SaaS dashboard cards,
-   heavy drop shadows,
-   glowing components,
-   glassmorphism.

------------------------------------------------------------------------

## 21. Borders

Prefer subtle borders where surface separation is necessary.

Borders should not create a dense boxed interface.

Editorial sections often require no border at all.

------------------------------------------------------------------------

## 22. Surface Hierarchy

Canonical rule:

``` text
Primary interactive surface
→ Card

Supporting content
→ Flat

Editorial content
→ Borderless

Trust / privacy information
→ Subtle surface

Primary CTA
→ High contrast
```

This rule is critical.

Do not place every paragraph, feature, statistic, or icon inside a card.

------------------------------------------------------------------------

## 23. Card Philosophy

Cards are for:

``` text
actions
choices
interactive modules
grouped information requiring boundaries
```

Cards are not default containers for all content.

Existing card personality:

-   soft,
-   clean,
-   calm,
-   low visual noise,
-   restrained border/shadow,
-   clear title,
-   short supporting copy.

------------------------------------------------------------------------

## 24. Action Cards

Typical action card:

``` text
Subtle icon / visual
Title
One-line explanation
CTA affordance
```

Examples:

-   Check-In
-   Cerita
-   Continue Journey
-   Human Support

Avoid metric-dashboard treatment.

------------------------------------------------------------------------

## 25. Buttons

Primary button:

``` text
Rangkul Green
High contrast text
Clear label
Comfortable touch target
```

Secondary button:

``` text
Neutral / outlined / subtle surface
```

Tertiary action:

``` text
Text / ghost treatment
```

Avoid multiple primary-looking CTAs in the same visual group.

------------------------------------------------------------------------

## 26. Button Copy

Use action-oriented labels.

Prefer:

``` text
Mulai check-in
Tulis ceritamu
Lanjutkan
Cari dukungan
Hubungi bantuan
```

Avoid vague:

``` text
Submit
Continue
Click here
Learn more
```

when a more specific action can be stated.

------------------------------------------------------------------------

## 27. Touch Targets

Interactive targets should be comfortable for mobile use.

Target minimum:

``` text
44 × 44 CSS px
```

especially for:

-   navigation,
-   mood choices,
-   safety actions,
-   close buttons,
-   icon-only controls.

------------------------------------------------------------------------

## 28. Forms

Forms should feel conversational rather than bureaucratic.

Use:

-   visible labels,
-   concise helper text,
-   generous input height,
-   clear focus states,
-   inline validation,
-   clear submission state.

Avoid:

-   placeholder-only labels,
-   dense multi-column forms on mobile,
-   long forms without progress/context,
-   aggressive red validation before interaction.

------------------------------------------------------------------------

## 29. Input Focus

Focus state must be clearly visible.

Use brand-aligned outline/ring with sufficient contrast.

Do not remove browser focus behavior without replacing it with an
accessible alternative.

------------------------------------------------------------------------

## 30. Error State

Errors should be:

``` text
specific
short
actionable
```

Do not use technical messages.

Example:

``` text
Belum bisa mengirim jawabanmu. Coba lagi.
```

not raw server/provider error.

Safety failures follow `SAFETY.md`.

------------------------------------------------------------------------

## 31. Check-In Design

Check-In is the primary product entry point.

It should feel:

``` text
simple
low pressure
emotionally safe
quick to understand
```

Avoid clinical assessment aesthetics.

Do not use:

-   medical gauges,
-   diagnostic scales,
-   psychiatric terminology,
-   dashboard charts.

------------------------------------------------------------------------

## 32. Check-In Interaction

Prefer progressive disclosure.

Conceptual:

``` text
One question
↓
One decision
↓
Next question
```

rather than displaying a long questionnaire.

Progress should be visible when the flow has multiple steps.

------------------------------------------------------------------------

## 33. Emotion Selection

Emotion selection should use:

``` text
clear label
+
subtle visual support
```

Do not rely solely on emoji or color.

Avoid childish oversized emoji treatment.

Neutral emotional-awareness illustrations/icons are preferred.

------------------------------------------------------------------------

## 34. Reflection Design

Reflection screen should reduce visual noise.

Hierarchy:

``` text
Reflection heading
↓
Primary reflective response
↓
Optional grounding / next step
↓
Continue to Cerita / next action
↓
Human Support access
```

Avoid turning AI reflection into a chat interface unless chat is
explicitly part of the product.

Do not use robot/avatar imagery.

------------------------------------------------------------------------

## 35. Cerita / Journal Design

Cerita is writing-first.

The writing surface should feel private and calm.

Prefer:

-   readable writing width,
-   generous textarea height,
-   minimal surrounding chrome,
-   persistent label/context,
-   clear save/local-storage behavior,
-   keyboard-friendly mobile behavior.

Avoid gamification and productivity-app aesthetics.

------------------------------------------------------------------------

## 36. Journal Visual Motifs

Allowed supporting motifs:

``` text
paper
writing
conversation
soft abstract shapes
subtle editorial illustration
```

Avoid:

``` text
medical charts
AI robot
growth graph
achievement trophy
streak flame
```

------------------------------------------------------------------------

## 37. Summary Design

Summary should emphasize content hierarchy rather than data density.

Use:

``` text
What you felt
What you noticed
Possible next step
Support option
```

Do not convert emotional reflection into an analytics dashboard.

------------------------------------------------------------------------

## 38. Perjalanan Design

Perjalanan should visualize emotional history with restraint.

It is not:

``` text
performance tracking
```

or:

``` text
self-optimization dashboard
```

Avoid language such as:

``` text
score
performance
success rate
streak
```

unless a future product decision explicitly introduces it.

Visualizations should remain understandable and non-judgmental.

------------------------------------------------------------------------

## 39. Homepage Design

Homepage must prioritize:

``` text
understand
→ try something
→ understand benefit
→ trust safety
→ continue using product
```

Mood/Check-in remains the primary product entry.

Homepage should not become an analytics dashboard or a collection of
equal-weight feature cards.

------------------------------------------------------------------------

## 40. Homepage Section Hierarchy

Target public landing structure:

``` text
Hero
↓
Value Proposition
↓
How It Works
↓
Product / Check-In Entry
↓
Core Benefits / Features
↓
Product Boundaries
↓
Privacy & Safety
↓
Human Support
↓
FAQ / Trust
↓
Final CTA
```

Exact ordering may follow approved page specification, but primary
narrative must remain focused.

------------------------------------------------------------------------

## 41. Authenticated/Home Experience Direction

If product has a returning-user home experience, hierarchy should
remain:

``` text
Header
↓
Greeting / Orientation
↓
Primary Start Area
↓
Optional Resume
↓
Recent Journey
↓
Help
↓
Bottom Navigation on mobile where appropriate
```

Primary action stays above the fold.

Desktop must not become a metric dashboard.

------------------------------------------------------------------------

## 42. Navigation

Navigation should be simple and predictable.

Avoid overcrowded nav with every secondary page.

Primary navigation should represent actual user tasks.

Mobile navigation must maintain clear labels.

Do not rely on icons without text for important destinations unless
convention is unmistakable and accessible labeling exists.

------------------------------------------------------------------------

## 43. Bottom Navigation

If bottom navigation is used for the product experience:

-   keep item count restrained,
-   provide persistent labels,
-   maintain safe-area spacing,
-   use clear active state,
-   do not let it cover writing/form actions.

------------------------------------------------------------------------

## 44. Trust and Privacy UI

Trust content should use subtle surfaces, not alarming warning boxes.

Hierarchy:

``` text
Short statement
↓
Simple explanation
↓
Optional deeper detail
```

Privacy UI must describe actual behavior defined in `DATA_PRIVACY.md`.

Do not decorate unsupported claims with shield/lock icons.

------------------------------------------------------------------------

## 45. Product Boundary UI

Rangkul Cerita must clearly communicate that it is not a psychologist,
therapy replacement, or emergency service.

This should feel like responsible expectation-setting, not legal fine
print.

Use concise, visible language.

------------------------------------------------------------------------

## 46. Human Support UI

Human Support should feel like a natural extension of the product, not a
failure state.

LOW:

``` text
available
```

ELEVATED:

``` text
more prominent
```

HIGH / IMMINENT:

``` text
primary
```

Follow `SAFETY.md` for escalation UI.

------------------------------------------------------------------------

## 47. Safety UI

Safety screens must prioritize:

``` text
clarity
low cognitive load
real-world action
```

Do not use:

-   dramatic animations,
-   alarming full-red pages,
-   long explanations,
-   unrelated content,
-   newsletter/product engagement CTAs.

Primary action should be immediately visible on mobile.

------------------------------------------------------------------------

## 48. Imagery Direction

Visual assets should feel:

``` text
human
quiet
reflective
real
warm
inclusive
```

Suitable directions:

-   everyday reflective moments,
-   writing/journaling,
-   quiet conversation,
-   calm environments,
-   subtle human presence,
-   editorial illustration.

------------------------------------------------------------------------

## 49. Imagery to Avoid

Avoid:

-   crying-person stock photography,
-   person holding head dramatically,
-   hospital/clinic imagery,
-   therapist cliché imagery,
-   brain/medical illustrations,
-   AI robot imagery,
-   futuristic gradients,
-   corporate wellness stock photography,
-   forced happiness.

The product should not visually exploit emotional distress.

------------------------------------------------------------------------

## 50. Illustration Style

Illustration should be:

-   simple,
-   editorial,
-   warm,
-   low-detail,
-   soft geometry,
-   compatible with existing green identity.

Avoid overly cute mascot systems.

Avoid complex 3D illustration unless an existing approved asset already
uses it.

------------------------------------------------------------------------

## 51. Iconography

Icons should be:

``` text
simple
consistent stroke
recognizable
non-decorative
```

Do not mix multiple unrelated icon styles.

Icons support labels; they should not replace important copy.

------------------------------------------------------------------------

## 52. Motion Philosophy

Motion is subtle and non-celebratory.

Use for:

``` text
state transition
feedback
progress
navigation orientation
gentle hierarchy
```

Avoid:

-   confetti,
-   streak celebrations,
-   bouncing emotional icons,
-   dramatic parallax,
-   continuous decorative animation.

Rangkul Cerita is not a gamified wellness app.

------------------------------------------------------------------------

## 53. Motion Duration

Prefer short, calm transitions.

Conceptual:

``` text
Fast feedback
~150–200ms

Standard transition
~200–300ms

Large gentle transition
~300–400ms
```

Do not make the UI feel sluggish.

Exact tokens should map to the existing implementation where possible.

------------------------------------------------------------------------

## 54. Reduced Motion

Respect:

``` css
prefers-reduced-motion
```

Non-essential animations should be reduced or removed.

Safety actions must never depend on animation.

------------------------------------------------------------------------

## 55. Mobile-First

Mobile is the primary layout context.

Design order:

``` text
Mobile
→ Tablet
→ Desktop
```

Critical target widths:

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

## 56. Mobile Layout Rules

On mobile:

-   primary actions visible early,
-   forms use full available content width,
-   readable horizontal padding,
-   no cramped multi-column layouts,
-   cards stack naturally,
-   text remains readable,
-   sticky elements do not obstruct content,
-   keyboard does not hide important form controls.

Do not treat mobile as a compressed desktop.

------------------------------------------------------------------------

## 57. Desktop Rules

Desktop should gain:

``` text
space
composition
better content grouping
```

not:

``` text
more dashboards
more cards
more metrics
more simultaneous information
```

Maintain focused content width.

------------------------------------------------------------------------

## 58. Responsive Typography

Typography may scale responsively, but hierarchy must remain stable.

Avoid hero typography that becomes excessively large on desktop merely
to fill space.

Editorial warmth comes from typography choice and composition, not giant
font size.

------------------------------------------------------------------------

## 59. Accessibility

Critical journeys target:

``` text
WCAG 2.2 AA
```

Required considerations:

-   semantic HTML,
-   keyboard navigation,
-   visible focus,
-   form labels,
-   accessible names,
-   sufficient contrast,
-   heading hierarchy,
-   screen-reader semantics,
-   error announcements,
-   touch target size,
-   reduced motion.

------------------------------------------------------------------------

## 60. Color Accessibility

Never use color as the only indicator for:

-   selected emotion,
-   validation state,
-   active navigation,
-   safety level,
-   progress,
-   errors.

Always add text, iconography, shape, or semantic markup.

------------------------------------------------------------------------

## 61. Keyboard Accessibility

All interactive UI must be reachable and operable by keyboard.

Especially:

``` text
Check-In
Dialog
Journal
Navigation
FAQ
Human Support
Safety actions
```

Focus order must follow visual/logical order.

------------------------------------------------------------------------

## 62. Screen Reader Behavior

Interactive elements need accessible names.

Form errors should be associated with affected fields.

Dynamic critical errors and safety states should use appropriate
announcements without overwhelming the user.

------------------------------------------------------------------------

## 63. Empty States

Empty states should explain what the user can do next.

Avoid guilt-inducing copy.

Example direction:

``` text
Belum ada cerita yang tersimpan di perangkat ini.
```

not:

``` text
Kamu belum konsisten menulis.
```

------------------------------------------------------------------------

## 64. Loading States

Loading should communicate progress without fake certainty.

Use:

-   subtle spinner,
-   skeleton where appropriate,
-   concise status copy.

For AI reflection, do not simulate human typing purely to make AI feel
like a therapist.

------------------------------------------------------------------------

## 65. Success States

Success feedback should be calm.

Avoid celebratory patterns for emotionally sensitive actions.

Do not use:

``` text
confetti
achievement badge
streak reward
```

for completing Check-In or Journal.

------------------------------------------------------------------------

## 66. Design Tokens

Implementation should centralize tokens for:

``` text
colors
typography
spacing
radius
shadow
motion
breakpoints where applicable
```

Prefer mapping to Tailwind/theme variables already used by the project.

Do not duplicate raw hex values throughout components.

------------------------------------------------------------------------

## 67. Suggested Semantic Color Tokens

Map existing palette into semantic roles.

Conceptual:

``` text
--background
--foreground
--primary
--primary-foreground
--secondary
--muted
--muted-foreground
--border
--surface-soft
--accent-calm
--accent-positive
--accent-reflective
--accent-anxious
--danger
--danger-foreground
```

Exact naming should follow existing project conventions when possible.

------------------------------------------------------------------------

## 68. Component Variants

Do not create one-off styling for every page.

Reusable primitives should support limited meaningful variants.

Example:

``` text
Button
→ primary
→ secondary
→ ghost
→ destructive

Card
→ interactive
→ subtle
```

Avoid variant explosion.

------------------------------------------------------------------------

## 69. Design Consistency Rule

Before creating a new component style:

1.  inspect existing equivalent,
2.  inspect design tokens,
3.  reuse existing primitive,
4.  add a variant only if a real recurring need exists.

Do not solve inconsistency by adding another style.

------------------------------------------------------------------------

## 70. Existing UI Preservation Rule

When modifying current UI:

``` text
Preserve visual personality
Preserve established component language
Preserve user flow
```

unless the task explicitly requires redesign.

A coding agent should not replace the existing design with:

-   generic shadcn defaults,
-   generic SaaS landing page,
-   dark mode aesthetic,
-   glassmorphism,
-   AI startup visual language.

------------------------------------------------------------------------

## 71. UI Refactoring Priority

When polishing existing UI, priority is:

``` text
1. Accessibility problems
2. Broken responsive behavior
3. Incorrect hierarchy
4. Inconsistent spacing/type
5. Component inconsistency
6. Imagery consistency
7. Micro-interaction polish
```

Do not start with animation.

------------------------------------------------------------------------

## 72. Homepage Simplification

When reducing the existing content-heavy homepage, do not destroy the
established visual language.

Simplification means:

``` text
fewer competing sections
stronger hierarchy
more whitespace
clearer primary action
```

not a visual redesign.

Secondary content should move to dedicated pages.

------------------------------------------------------------------------

## 73. Performance-Aware Design

Avoid visual choices that significantly harm performance without
meaningful benefit.

Prefer:

-   optimized images,
-   lightweight icons,
-   CSS transitions,
-   server-rendered static content.

Avoid unnecessary:

-   autoplay video,
-   giant hero media,
-   large animation libraries,
-   excessive client-side effects.

------------------------------------------------------------------------

## 74. Dark Mode

Do not introduce dark mode as a product requirement unless explicitly
requested.

Current Warm Reflective Editorial identity is based on warm light
surfaces.

If dark mode is ever introduced, it requires dedicated accessibility and
emotional-tone review rather than automatic color inversion.

------------------------------------------------------------------------

## 75. Design Review Checklist

Before considering a UI task complete:

-   [ ] Matches Warm Reflective Editorial direction
-   [ ] Existing visual language preserved
-   [ ] Primary action visually clear
-   [ ] No unnecessary cards
-   [ ] Typography hierarchy clear
-   [ ] Spacing consistent
-   [ ] Colors use approved palette/tokens
-   [ ] Contrast acceptable
-   [ ] Mobile layout verified
-   [ ] Desktop remains focused
-   [ ] Keyboard behavior works
-   [ ] Focus state visible
-   [ ] Form labels accessible
-   [ ] Error/loading/success states handled
-   [ ] Reduced motion considered
-   [ ] No unsupported privacy/safety claim
-   [ ] No clinical or AI-robot visual language
-   [ ] Safety UI follows `SAFETY.md`
-   [ ] Product data claims follow `DATA_PRIVACY.md`

------------------------------------------------------------------------

## 76. Definition of Done --- Design System

The design system is working when:

``` text
Different pages
feel like one product

Different developers
produce compatible UI

New features
reuse existing visual rules

Accessibility
is built into primitives

Safety UI
remains clear and calm

Product personality
survives implementation changes
```

The goal is not pixel-level uniformity.

The goal is coherent product behavior and visual identity.

------------------------------------------------------------------------

## 77. Final Design Principle

When choosing between:

``` text
More decoration
vs
More clarity
```

choose clarity.

When choosing between:

``` text
More cards
vs
Better hierarchy
```

choose hierarchy.

When choosing between:

``` text
More animation
vs
Calmer interaction
```

choose calmer interaction.

When choosing between:

``` text
Generic mental-health visuals
vs
Human reflective storytelling
```

choose human reflective storytelling.

Rangkul Cerita should feel like:

``` text
a quiet, warm, trustworthy space
where users can understand what they feel
and know what they can do next.
```
