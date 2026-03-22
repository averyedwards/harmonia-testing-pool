# OkCupid — UI Pattern Extraction

*Source: okcupid.com + published UX documentation + app store listing + academic references*

## Card/Profile Layout

- **Default visible information (DoubleTake card):** Photo (portrait, near full-width), name, age, location, match percentage prominently displayed as a badge (e.g., "92% Match"). One prompt answer teaser. Mutual "wants" matching (e.g., both want kids: ✓).
- **Information revealed on tap/expand:** Full profile — all photos, complete About, all question answers, deal-breakers, interests, lifestyle choices, sexual orientation/identity.
- **Photo treatment:** Standard portrait, near full-width. Grid of 6 photos visible on full profile.
- **Text positioning:** Name/age at top of card. Match percentage badge in top-right corner of the card (large, prominent). Prompt answer below the photo.

## Match Percentage — The Core Differentiator

OkCupid's match percentage is the most mature compatibility number in the commercial dating industry:

**How it's calculated:** Based on how both users answered personality and lifestyle questions (thousands of questions in the database). The percentage reflects overlap in what both users answered AND what they care about (weighted questions).

**How it's displayed:**
- Large coloured badge: Green for high (80%+), yellow for medium (60-79%), grey for low (<60%)
- Positioned prominently in the top corner of every browse card — impossible to miss
- Text: "92% Match" — always phrased as "Match", never "Compatibility" or "Score"
- On profile: breakdown available — "You both want: kids, dogs, living in the city" (positive-only framing)

**Important:** OkCupid deliberately hides low-compatibility breakdowns. You see what you agree on, not where you conflict. This maps directly to Harmonia's "positive-only framing" principle for perceived similarity.

## DoubleTake Interface

OkCupid's DoubleTake is their primary discovery interface — a stack of cards rather than a swipe pile:

- Card appears centred, not stacked
- User can "Like" (heart icon) or "Pass" (X icon) — standard binary
- Unlike Tinder/Bumble, DoubleTake shows MORE information per card before you decide
- The match percentage is visible BEFORE swiping — pre-decision personality signal
- "Boost" feature temporarily makes your profile more visible

## Compatibility/Personality Display

- **Where compatibility appears:** On the browse card (match % badge) AND expanded on profile
- **Profile breakdown format:** Bullet list of agreements. e.g.:
  - ✓ You both want to travel
  - ✓ You're both non-smokers
  - ✓ You both value intelligence in a partner
- **Language:** "Match" (not "compatibility"), percentages, and positive agreement lists
- **Progressive disclosure:** Percentage visible on card. Agreement breakdown requires profile tap.
- **Question answer display:** User's answer + "They want their match to answer ___ or ___" structure. Shows both what someone believes AND what they want in a partner.

## Relevant Patterns for Harmonia

**What works well:**
- Match percentage on the BROWSE CARD (not hidden) is the closest commercial precedent to Harmonia's personality-on-card design goal
- Positive-only framing in agreement breakdown directly matches Harmonia's "You're both..." trait display spec
- Green/yellow/grey colour coding for compatibility level: Harmonia can adapt with gold/amber/subtle for its tiers
- "Match" label instead of "compatibility" or "score" — warmer, less clinical
- Question-answer format reveals intent, not just traits

**What doesn't apply:**
- Single-swipe model — not forced choice
- OkCupid's percentage is quantity-based (more questions = more accurate); Harmonia uses 6 scenario questions with Gemini scoring
- Percentage number itself risks clinical feeling for Harmonia

**Specific interaction patterns worth adapting:**
- Match badge position: top-right corner of card (not overlaid on photo, not buried at bottom)
- Colour coding by tier: gold = strong match (Harmonia's tier 1), amber = good match (tier 2), subtle grey = moderate (tier 3)
- Agreement list format ("You're both...") for the personality reveal panel
- Positive-only: never show what they disagree on

## Visual Notes

- **Card dimensions:** Large portrait card, ~85% viewport width. Match % badge ~56px diameter circle.
- **Colour usage:** Blue brand primary, green (#00CC00 approx) for high match, yellow for medium, grey for low.
- **Typography:** Match percentage in large bold (~24px) inside the badge. Card text in clean sans-serif.
- **Animation:** Card flip-style reveal is used in some views. Badge percentage animates (count-up) when profile opens.
