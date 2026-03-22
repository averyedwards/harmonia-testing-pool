# Harmonia Tournament Card — Design Proposal

*This document is the authoritative specification for the Phase 2 (and Phase 3) tournament frontend, built in Step 7.*
*All decisions are sourced from research folders 01-04 and referenced below.*

---

## Section 1: Default Card State

### What the user sees when two cards first appear (before any interaction)

**Layout (mobile, 375px viewport):**

The tournament view shows two candidate cards stacked vertically, one above the other, each occupying roughly half the visible viewport height. The user sees both at once without scrolling.

```
┌─────────────────────────────────────┐  ← Top card (Candidate A)
│  [Name, Age]                [❤️❤️🤍]│
│                                     │
│         [PHOTO — portrait]          │
│                                     │
│  [Mini radar 60px] [Trait pill]     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐  ← Bottom card (Candidate B)
│  [Name, Age]                [❤️🤍🤍]│
│                                     │
│         [PHOTO — portrait]          │
│                                     │
│  [Mini radar 60px] [Trait pill]     │
└─────────────────────────────────────┘

        [Pass both ↓]
```

**Desktop (768px+):**
Two cards side by side, equal width (~360px each), with 24px gap between. No divider line. "Pass both" below both cards, centred.

**Information visible by default (per card):**
1. Name + Age — top-left of card, white text on photo with subtle bottom gradient overlay
2. Hearts display — top-right of card: 3 heart icons (filled/empty state for this candidate)
3. Photo — full card background (portrait crop, ~3:2 ratio at this smaller size)
4. Mini radar polygon — bottom-left, 60px diameter, no labels, candidate's signature colour
5. Dominant trait pill — bottom-right: small pill badge e.g. "Conflict-avoidant" in maroon (light) or gold (dark)

**Visual hierarchy (eye path):** Photo (first) → Hearts (second) → Name/Age (third) → Personality hint (fourth)

**Addressing CHI '22 bias concern without killing engagement:**
The personality hint (mini radar + trait pill) is visible by default without being the primary element. The photo remains dominant (engagement) but personality is immediately present (reduces implicit bias from photo-only decisions). This is a middle path — not text-first (which reduces engagement) but not photo-only (which amplifies bias).

Source: CHI '22 (Ma & Gajos, Harvard) — "reversed information sequence reduces implicit bias"; commercial reference: Boo (personality badge on browse card by default)

**How the two cards are balanced visually:**
- Identical card dimensions, identical layout structure
- No left/right positioning advantage (mobile: top/bottom are equivalent)
- Same label format ("Name, Age" on both)
- Same heart row position (top-right)
- The only difference between cards is their content (photo, name, hearts, personality hint)

Source: Chatbot Arena observation — "Assistant A / Assistant B" labels identical in size, position, and visual weight

---

## Section 2: Personality Integration

### The personality hint (default state)

**Mini radar polygon:**
- SVG polygon, 60×60px
- Drawn from the candidate's questionnaire sin scores
- 7 vertices on a circular grid — the polygon's shape is the candidate's personality "fingerprint"
- No axes, no labels, no grid at this size
- Fill: candidate's signature colour at 30% opacity
- Stroke: candidate's signature colour at 60% opacity
- Positioned: bottom-left corner of card, 12px inset from edges

**Dominant trait pill:**
- Single pill badge: 24px height, rounded-full, 8px horizontal padding
- Background: maroon-light (rgba(114,47,55,0.12)) light / dark-border (rgba(61,36,38,0.4)) dark
- Text: maroon (#722F37) light / gold-champagne (#F5D98A) dark
- Font: DM Sans 12px, 500 weight
- Content: The single strongest trait from the candidate's top-weighted sin dimension
  - Wrath low → "Conflict-avoidant"
  - Sloth low → "Proactive"
  - Pride low → "Deeply humble"
  - Lust high → "Spontaneous"
  - Greed low → "Generous"
  - Gluttony low → "Disciplined"
  - Envy low → "Contented"
- Positioned: bottom-right corner of card, 12px inset

### What happens when the user taps the card to reveal full personality

**Trigger:** Tap anywhere on the photo area of a card (NOT on the hearts — hearts are display-only). A long-press or double-tap is NOT required — single tap opens the reveal.

**Reveal animation:** A panel slides up from the bottom of the tapped card. The panel covers the lower 65% of the card. The photo is still visible in the upper 35% (showing name + eyes at minimum) — the user retains visual context.

Animation spec: `transform: translateY(100%) → translateY(0)`, duration 350ms, easing `cubic-bezier(0.32, 0, 0.67, 0)` (ease-out)

**The reveal panel contains (top to bottom):**

1. **Similarity tier headline** (Cormorant Garamond, 20px, bold)
   - "Strong personality match!" (≥0.60)
   - "You have a lot in common" (≥0.40)
   - "Some shared traits" (≥0.25)
   - "Different perspectives, potential spark" (<0.25)

2. **Shared trait cards** (horizontal scroll)
   - 2-4 cards (depending on similarity tier)
   - Each card: 240px wide × 72px, gold left border (4px), cream background
   - Icon left: single emoji/SVG for trait category
   - Text right: "You're both..." sentence in DM Sans 14px
   - Horizontal scroll with peek of next card (cards end at 240px, viewport is 375px — next card peeks by 120px)

3. **Mini radar expanding to full display** (200×200px, centred)
   - User's shape: gold (#D4A853 light / #F0C86E dark), 30% fill, 60% stroke
   - Candidate's shape: maroon (#722F37 light / #8B3A3A dark), 25% fill, 55% stroke
   - Grid: 3 concentric circles at 25/50/75% radius, rgba(0,0,0,0.06)
   - Labels on 4 highest-weight axes only (Wrath, Sloth, Pride, Lust) — small, 11px DM Sans
   - Centre badge: tier label ("Strong match" — NOT a percentage)
   - Animation: polygon shapes draw in from centre (stroke-dashoffset, 600ms each, staggered 200ms)

4. **Candidate's top 3 trait pills** (horizontal row)
   - Three pills in a row showing top 3 dimension labels
   - Same pill style as default card hint

5. **Hearts display** (persistent throughout reveal, top-right of card) — not moved by the reveal panel

**Dismiss:** Swipe down on the panel (iOS-style bottom sheet gesture) OR tap the "×" button at the top-right of the panel. Animation: reverse of reveal (slide down, 300ms).

Source: 16Personalities (evocative labels, relatable language), Boo (personality on card), Spotify Blend ("You both love..." overlap framing), gamification-synthesis.md (one key idea per screen), radar-chart-patterns.md (minimum 160px for labels, mini polygon as fingerprint)

---

## Section 3: Heart Accumulation Display

### The three-heart mechanic visualisation

**Heart icon design:**
- SVG heart shape (not emoji — custom SVG for consistent rendering)
- Size: 20px × 18px
- 8px gap between hearts
- Total row width: 76px (3 × 20px + 2 × 8px)
- Position: top-right corner of each candidate card, 12px inset from right, 12px inset from top
- Always visible — not hidden by the photo reveal panel

**Empty heart (0 hearts, or unfilled slots):**
- Stroke: #D4A853 (light) / #F0C86E (dark) at 60% opacity
- Fill: transparent
- No glow

**Filled heart (earned hearts):**
- Fill: #D4A853 (light) / #F0C86E (dark), solid
- Stroke: same colour, 100% opacity
- Box shadow: 0 0 6px rgba(212,168,83,0.5) — subtle gold glow
- This is the reward state — warm and celebratory, not clinical

**Animation on heart fill:**
- Scale: 1.0 → 1.4 → 1.0 (bounce), duration 300ms, easing `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring)
- Colour transition from outline to solid: simultaneous with scale animation
- Glow pulse: box-shadow 0 → 6px → 3px over 400ms after the bounce
- Sound: no sound (PWA, user may be in quiet environments)

**The visual progression:**
- 0 hearts (🤍🤍🤍): Three empty outlines — "not yet selected"
- 1 heart (❤️🤍🤍): One gold solid, two empty — "selected once, early interest"
- 2 hearts (❤️❤️🤍): Two gold solid, one empty pulse — "near match, anticipation builds"
- 3 hearts (❤️❤️❤️): All three solid gold, full glow — triggers match confirmation (not shown on card — replaced by match confirmation screen)

**2-heart state (near-match anticipation without bias):**
- The 3rd empty heart pulses gently (opacity: 0.4 → 1.0 → 0.4, loop 2 seconds)
- NO copy change on the card for 2-heart state
- NO special border or card glow for 2-heart candidates — to avoid biasing the comparison
- The hearts are the only signal — they communicate without instructing

Source: duolingo-patterns.md (hearts row, filled/empty animation), muzz-patterns.md (slot counter as inspiration), gamification-synthesis.md (near-match tension specification)

---

## Section 4: Selection Interaction

### What happens when the user taps to choose one card

**Tap target:** The entire card surface is the tap target for selection. The exception: tapping the mini radar / trait pill area opens the personality reveal instead of selecting.

To disambiguate:
- Tap on photo area (above the bottom-row personality hint): opens personality reveal
- Tap and hold on photo area (500ms): selects this card as the winner
- OR: dedicated "Choose" button below each card (secondary affordance) — explicit, no ambiguity

**Recommended implementation:** Show a "Choose" button (40px height, full card width, maroon/gold gradient background) at the bottom of each card, below the card boundary. This avoids tap ambiguity with the personality reveal and provides explicit selection confirmation.

**Visual feedback on selection (chosen card):**
1. Card border: animated gold border highlight (border: 2px solid #D4A853 / #F0C86E, appearing over 200ms)
2. Scale pulse: 1.0 → 1.02 → 1.0 over 300ms (subtle "selected" feel)
3. "Choose" button: fills with solid gold, text changes to "✓ Selected"

**What happens to the unchosen card:**
- Opacity reduces to 0.4 over 300ms (dims significantly)
- Scale reduces to 0.98 (very subtle shrink — not disappear)
- "Choose" button disappears from unchosen card

**Heart fill animation on chosen candidate:**
- If this selection earns a new heart (opponent changes Elo, winner increments): heart fill animation plays immediately (see Section 3)
- 600ms after selection feedback completes

**Transition to the next pair:**
- Auto-load: next pair begins loading immediately after selection
- After 800ms (allowing user to see the heart fill and the chosen/unchosen state): both cards slide out upward (translateY: 0 → -100%, 400ms)
- New pair slides in from below (translateY: 100% → 0, 400ms, overlapping with previous slide-out)
- Total visible delay before new pair: ~800ms — long enough to register, short enough to maintain flow

**The "Pass Both" button:**
- Position: below both cards, centred — between cards and bottom nav
- Style: text button, no fill. "Can't decide" in DM Sans 14px, slate colour (#475569). Underlined.
- NOT a prominent button — it's available but not solicited
- Tap limit: 3 per session. After 3rd use: button disappears for this session.
- On tap: modal opens (see Pass Both modal in wireframe descriptions)

Source: chatbot-arena-patterns.md (4-button row below panels, green border winner), gamification-synthesis.md (transition timing table), duolingo-patterns.md (heart fill animation timing)

---

## Section 5: Match Confirmation

### What happens when the third heart fills (3/3 = confirmed match)

**Trigger:** The moment a "Choose" tap earns the third heart for a candidate — this is detected mid-transition.

**The celebration animation (full-screen overlay, not modal):**

1. The chosen card expands from card size to full-screen (scale + position animation, 500ms ease-out)
2. The unchosen card slides out of view
3. As the chosen card reaches full-screen: background transitions to a deep maroon gradient (dark: wine-black to maroon radial gradient)
4. Animated particles: gold dots rise from bottom of screen (20-30 particles, random trajectories, 1.5s duration — similar to confetti but warm, not celebratory-garish)
5. The candidate's photo fills the screen with a soft vignette
6. Text overlay appears (fade in, 400ms, after card expansion):

```
        ♥ ♥ ♥
   It's a match.

   [Candidate Name]
   [Candidate Age]

"[Similarity tier headline]"
e.g., "Strong personality match!"

        [View match →]
     [Continue comparing]
```

**Typography:**
- "It's a match." — Cormorant Garamond, 36px, italic, white
- Candidate name — Cormorant Garamond, 24px, semi-bold, white
- Similarity headline — DM Sans, 16px, regular, white/80% opacity
- "View match →" — primary button (gold gradient background)
- "Continue comparing" — text button, white/60%

**Emotional tone:** Warm, momentous but not garish. Deep maroon background reads as "significant" — not the neon-green party of Hinge/Bumble. The gold particles are subtle. The serif italic "It's a match." is romantic, not triumphant.

**After this screen:**
- "View match →" goes to the match detail page (contact exchange)
- "Continue comparing" dismisses the overlay and resumes tournament with remaining candidates (this candidate is removed from active pool)

Source: hinge-patterns.md (match screen with both photos + CTA), bumble-patterns.md (confetti/particle celebration), Harmonia design system (maroon deep for significant moments), CLAUDE.md (contact exchange flow)

---

## Section 6: Tournament Progress Display

### How the user knows where they are in the tournament

**Circular ring + comparison counter (recommended, based on gamification synthesis):**

**Position:** Top of the tournament screen, between the navigation bar and the first card. 40px height total.

**Design:**
```
  [○ ring 28px]  "12 of 36 comparisons"      [❤️×3] 1 match
```

- Left: circular progress ring, 28px diameter, 3px stroke, gold fill (arc shows % complete), cream background
- Centre: "12 of 36 comparisons" — DM Sans 13px, slate colour
- Right: "❤️×3 [N] match(es)" — small gold hearts icon, count of confirmed matches so far

**Between-session state (user returns to tournament):**
- The ring and counter reflect current cumulative progress
- The two cards below are ready immediately
- A subtle banner (dismissable, top of cards): "Welcome back — [N] comparisons completed" in gold/cream — fades after 3 seconds
- If user was mid-session (app was backgrounded): same pair is shown again

**Round completion (all comparisons for current pool done):**
- Progress ring fills to 100% with gold glow animation
- "Round complete" overlay appears (see Section 5-scale, but smaller — not full screen)
- Shows: comparisons count, matches confirmed, "View your insights" CTA

Source: gamification-synthesis.md (circular ring + counter recommendation), duolingo-patterns.md (between-session re-engagement), cmb-patterns (ritual re-engagement on return)

---

## Section 7: Phase 3 Genetics Variant

### How the card changes when HLA genetics data is added in Phase 3

**HLA indicator location:** Part of the personality reveal panel (shown on tap), NOT on the default card state.

The default card is IDENTICAL to Phase 2. No visual change to the card before tap.

**In the reveal panel (below the trait cards, above dismiss affordance):**

A genetics section with label:

```
  ─────────── Chemistry signal ───────────
  [🧬 icon] [label text]  [coloured indicator]
```

**Visual treatment by tier:**
- **Score ≥ 75 (Strong chemistry signal):**
  - Icon: 🧬 (or custom DNA double-helix SVG)
  - Label: "Strong chemistry signal" in DM Sans 14px, semi-bold
  - Indicator: pill badge, background: rgba(34, 197, 94, 0.15), text: #16a34a (green)
  - Subtle green glow on the pill: box-shadow 0 0 8px rgba(34,197,94,0.3)

- **Score 50-74 (Good chemistry):**
  - Label: "Good chemistry"
  - Indicator: amber pill: rgba(245,158,11,0.15) background, #d97706 text
  - No glow

- **Score 25-49 (Some chemistry):**
  - Label: "Some chemistry"
  - Indicator: muted grey pill: rgba(148,163,184,0.15) background, #64748b text
  - Smallest version of the badge (smaller font, less padding)

- **Score < 25:** Section entirely hidden — no negative messaging

**Whether genetics is visible by default:**
No. The default card is unchanged from Phase 2. The genetics badge only appears in the tap-to-reveal panel. This preserves the card's visual simplicity and prevents genetics from dominating the selection decision.

**How genetics interacts with personality reveal:**
Sequential, below personality: Personality (tier headline → trait cards → mini radar) → then genetics section. The user sees personality first, genetics second. This mirrors the research question: does genetics CHANGE selection after personality is known?

**Label copy (no scientific jargon):**
- "Strong chemistry signal" (not "HLA score: 82")
- "Chemistry signal" as the section label (not "Genetic compatibility")
- "Biological compatibility signal" as an explanatory tooltip if the user taps the 🧬 icon

Source: CLAUDE.md HLA display rules, personality-display-synthesis.md (Phase 3 integration section), radar-chart-patterns.md (separate badge, not axis addition)

---

## Section 8: Pool Building Fallback UI

### When a user's mutual pool has fewer than 6 candidates

**Header/framing text:** "Help us find your matches" — NOT "Rate more people"

**Layout:** Single card centred on screen (not two cards). Same photo dimensions as tournament card but presented alone. No heart display (hearts are for tournament, not pool building). No personality reveal (pool building is visual calibration).

**Interaction:** Tap one of three buttons below the card:
- "Yes, interested" (gold filled button)
- "Maybe" (outlined button)
- "Pass" (text button)

This is the Phase 1 calibration mechanic repeated for real users.

**Progress toward tournament eligibility:**
Below the card: a small horizontal progress bar showing pool size: "3 of 6 mutual matches needed"
- Bar fills from left, gold colour, cream background
- Labels: "0" left, "6" right (the minimum for tournament)
- Animated fill when a new mutual match is added

**The transition when pool reaches 6:**
- Final card rated → pool bar reaches 100% → celebration animation (smaller than match confirmation)
- "Your pool is ready!" overlay with a tournament icon
- CTA: "Start your comparisons →"
- Transition: auto-navigates to tournament view after 2 seconds or immediate on CTA tap

Source: CLAUDE.md (pool building fallback spec), gamification-synthesis.md (progress bar patterns), hinge-patterns.md (Standouts → tournament concept)

---

## Section 9: Wireframe Descriptions

### 1. Tournament Default State (two cards, no interaction)

Two vertically stacked cards (mobile) or side-by-side (desktop). Each card:
- Gold-bordered photo (subtle 1px gold border, #D4A853 at 30% opacity — just visible)
- Name + age overlay (bottom-left, white, 16px bold name, 14px regular age)
- 3 hearts (top-right, empty/filled per current state)
- Mini radar polygon (bottom-left, 60px, candidate's signature colour)
- Dominant trait pill (bottom-right, maroon/gold)
- "Choose" button (below card, full width, outlined gold, 40px height)

Progress ring and comparison counter above the cards.
"Can't decide" text link below both cards.

### 2. Personality Revealed on One Card

Upper card unchanged. Lower card (tapped): reveal panel has slid up from bottom, covering lower 65% of photo. Upper 35% of photo still visible (name, eyes).

Reveal panel: cream background (light) / dark card (dark). Contains similarity headline, 2-4 trait cards (horizontal scroll), 200px radar (two overlapping shapes), 3 trait pills.

The "Choose" button for the revealed card is now inside the reveal panel (at the bottom), so the user can select without dismissing the personality first.

### 3. Card Selected (Mid-Animation)

Chosen card: gold border glow (2px solid gold), slight scale pulse, "Choose" button shows "✓ Selected" in gold.
Unchosen card: opacity 0.4, slightly scaled down, "Choose" button hidden.
Hearts on chosen card: one heart is mid-animation (scale 1.3, transitioning to filled gold).

### 4. 2-Heart Near-Match State

Chosen card (the one with 2 hearts): Two hearts solid gold, 3rd heart shows with pulsing opacity animation (breathe effect). NO border glow on the card. NO copy change. The only signal is the pulsing 3rd heart.
Card layout otherwise identical to standard state.

### 5. 3-Heart Match Confirmation

Full-screen takeover. Dark maroon radial gradient background. Candidate photo fills screen, soft vignette.
"It's a match." in large Cormorant Garamond italic, white, top-centre.
Three gold heart icons below the text.
Candidate name below hearts.
Similarity headline below name.
"View match →" primary button (gold gradient).
"Continue comparing" text button below primary.
Gold particle animation rising from bottom (20 dots, varied opacity).

### 6. "Pass Both" Modal Open

Bottom sheet modal (not full screen). Slides up from bottom, 50% viewport height.
Background: backdrop blur + cream (light) / dark card (dark).
Handle bar at top (grey, 36×4px pill).
Heading: "What would help you decide?"
Subtext: "Your feedback helps us find better matches for you. (X passes remaining this session)"
Textarea: 4-line free text input, cream background, gold focus border.
Buttons: "Submit" (gold primary, full width) and "Skip" (text link below).
After submit: modal dismisses, both cards slide out, new pair loads.

### 7. Tournament Progress (Mid-Session)

Top bar: progress ring 32% filled (gold arc), "12 of 36 comparisons" label, "❤️×3 1 match" right side.
Two cards below (standard state). "Can't decide" link. Both cards have their respective heart states visible.

### 8. Pool Building Fallback

Large single card (centred, 320px wide on mobile). Photo fills card. Name + age overlay.
Below card: "Help us find your matches" heading (not "Rate people").
Progress bar: "3 of 6 mutual matches needed" with partial gold fill.
Three buttons: "Yes, interested" (gold) | "Maybe" (outlined) | "Pass" (text link).

### 9. Phase 3 Card with Genetics Indicator

Default card: identical to Phase 2 — NO visible genetics indicator.
On tap (personality reveal): reveal panel shows in full. After the trait cards and mini radar, a section separator appears: "─── Chemistry signal ───". Below the separator: 🧬 icon + "Strong chemistry signal" + green pill badge.
Reveal panel is slightly taller in Phase 3 to accommodate the genetics section.

---

## Section 10: Rationale

```
Decision: Two vertically stacked cards on mobile (not side-by-side)
Rationale: Chatbot Arena — side-by-side works on desktop (1280px+) but mobile 375px gives ~160px per card side-by-side, too narrow for photos + personality + hearts. Vertical stacking preserves card readability.
Source: 02-tournament-ui-patterns/chatbot-arena-patterns.md

Decision: Personality hint (mini radar + trait pill) visible on default card state
Rationale: CHI '22 (Ma & Gajos, Harvard) — photo-only default amplifies implicit racial and attractiveness bias. Harmonia's research validity depends on personality influencing decisions. Boo demonstrates commercial viability of personality-on-card.
Source: 01-dating-app-patterns/boo-patterns.md, 04-personality-display-patterns/personality-display-synthesis.md

Decision: "Choose" button below cards (not tap-card-to-select)
Rationale: Tap disambiguation — tapping the card opens personality reveal. Explicit "Choose" button prevents accidental selection. CurmElo (Yale) showed that forced-choice quality depends on intentional selection, not accidental touch.
Source: 02-tournament-ui-patterns/chatbot-arena-patterns.md (dedicated voting buttons, not card tap)

Decision: 4-option voting: Choose A / Choose B / Can't decide (limited to 3/session)
Rationale: Chatbot Arena has 4 options (A better, B better, both good, both bad). Harmonia simplifies to 3: choose A, choose B, pass both. "Both good" is irrelevant in a dating context (you'd just choose the one you prefer more). "Both bad" is excluded per Harmonia's positive-only framing. 3 passes/session limit prevents excessive avoidance (per Muzz Chat Limits research on quality through constraint).
Source: 02-tournament-ui-patterns/chatbot-arena-patterns.md, 01-dating-app-patterns/muzz-patterns.md

Decision: Blind labelling before selection (names visible, no identifying context beyond card)
Rationale: Chatbot Arena's blind voting prevents anchoring bias. However, Harmonia is NOT fully blind — names and photos are shown. The "blind" aspect is the Elo score (hidden) and the ordering (random, no bias toward left/right first).
Source: 02-tournament-ui-patterns/chatbot-arena-patterns.md, CLAUDE.md

Decision: 3-heart accumulation model (hearts per candidate, 3 = match)
Rationale: Muzz Chat Limits demonstrates that restricting match volume increases quality and engagement depth. 3 is the threshold that requires multiple encounters (not a single impulsive choice). CurmElo (Yale) found ~40 comparisons needed for stable ranking — 3 hearts minimum means 3 separate encounter events.
Source: 01-dating-app-patterns/muzz-patterns.md, docs/reference/elo-implementation.md

Decision: Gold (not red) hearts
Rationale: Red hearts connote Tinder's swipe-right culture — the opposite of Harmonia's deliberate, research-grounded approach. Gold aligns with Harmonia's design system (#D4A853) and carries connotations of value and quality rather than casual attraction.
Source: Harmonia design system (CLAUDE.md), index.html reference

Decision: Slide-up panel reveal for personality (not card flip)
Rationale: Card flip is common (OkCupid DoubleTake) but creates a binary state where you either see photo or personality. The slide-up panel preserves photo visibility in the upper 35% — maintaining the visual connection to the person while reading their personality data. Bumble uses this pattern for extended profile content.
Source: 01-dating-app-patterns/bumble-patterns.md, 04-personality-display-patterns/personality-display-synthesis.md

Decision: "You're both..." trait cards in horizontal scroll
Rationale: Spotify Blend's overlap framing ("You both love...") is the most engaging commercial reference. Horizontal scroll with peek is the standard mobile pattern for showing "there's more" without forcing full reveal. One trait per card maintains the "one key idea per screen" principle from Spotify Wrapped.
Source: 04-personality-display-patterns/spotify-wrapped-patterns.md

Decision: Similarity displayed as tier label, never as percentage or score
Rationale: OkCupid percentage is clinical (though effective for OkCupid's brand). 16Personalities and Spotify Wrapped both demonstrate that identity labels ("Mediator", "Indie Pop fan") are more emotionally resonant than numbers. Harmonia's tone spec (CLAUDE.md): "no clinical or test-result language".
Source: 04-personality-display-patterns/16personalities-patterns.md, 01-dating-app-patterns/okcupid-patterns.md, CLAUDE.md

Decision: HLA genetics hidden by default, shown in reveal panel only
Rationale: Phase 3's research question is whether HLA changes selection behaviour above personality. Hiding it by default (discovered on tap) ensures it is the LAST signal, not the first — mimicking the research condition where personality context precedes genetic data.
Source: CLAUDE.md (HLA display rules), 04-personality-display-patterns/personality-display-synthesis.md

Decision: No bracket tree visualisation
Rationale: Bracket trees reveal upcoming matchups, which could bias selections (users might save their vote for a preferred candidate they see is "coming up"). Easypromos bracket is engaging for sports/entertainment but inappropriate for dating research.
Source: 03-gamification-patterns/gamification-synthesis.md, 02-tournament-ui-patterns/chatbot-arena-patterns.md (no progress tree)

Decision: Circular ring + comparison counter for progress
Rationale: Duolingo's circular XP ring is the most compact, glanceable progress format. Counter ("12 of 36") provides a sense of boundedness — users can see the tournament will end, preventing fatigue from infinite-scroll anxiety.
Source: 03-gamification-patterns/duolingo-patterns.md, 03-gamification-patterns/gamification-synthesis.md

Decision: Match confirmation as full-screen takeover with maroon gradient background
Rationale: Hinge and Bumble use light/celebratory match screens. Harmonia's confirmation should feel more significant and warm — the maroon gradient is "serious romance" not "casual fun". This reflects Harmonia's brand position (research-backed, meaningful matches).
Source: 01-dating-app-patterns/hinge-patterns.md (match screen reference), Harmonia design system

Decision: Pool building uses three buttons (Yes/Maybe/Pass), not forced binary
Rationale: Pool building is calibration (Phase 1 mechanic), not forced choice. The "Maybe" option allows lower-confidence ratings that still contribute to Elo calibration. This follows the CurmElo finding that reducing decision pressure improves rating quality in early-stage evaluation.
Source: docs/reference/elo-implementation.md, CLAUDE.md (pool building fallback spec)
```

---

## Critical Constraints Checklist

- [x] Works in both light mode (cream base #FAF6F1) and dark mode (Wine Black #12090A)
- [x] Works on 320px minimum viewport width (stacked cards, each 100vw - 32px padding)
- [x] Touch targets minimum 44×44px (Choose button: 44px height, full width)
- [x] Harmonia colour palette throughout (gold hearts, maroon personality hints, cream backgrounds)
- [x] Cormorant Garamond for headings (match confirmation, similarity headline), DM Sans for body
- [x] No em dashes in any user-facing text
- [x] No clinical language (no raw scores, no percentages on cards, no dimension codes)
- [x] Hearts in gold (#D4A853 light, #F0C86E dark)
- [x] HLA never shown with negative framing (score < 25: section hidden entirely)
- [x] Elo scores hidden from users (dev overlay only, per spec)
