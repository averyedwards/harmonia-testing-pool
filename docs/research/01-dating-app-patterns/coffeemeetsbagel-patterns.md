# Coffee Meets Bagel — UI Pattern Extraction

*Source: coffeemeetsbagel.com + published interviews + app store listing*

## Card/Profile Layout

- **Default visible information:** Photo, name, age, height, education, job. "Bagel" framing — each match presented as a "Bagel" (their playful brand term for a potential match).
- **Information revealed on tap:** Full profile, additional photos, About section, prompts.
- **Photo treatment:** Square or portrait crop. Warm, natural photo treatment.
- **Text positioning:** Name/age/education below photo in list view.

## Daily Curated Matches — The Scarcity Model

CMB's core mechanic is deliberate daily scarcity:

**The Bagel:**
- Free users: 6 curated matches per day, delivered at noon
- Premium users: up to 21 "Suggested" matches + unlimited browse in "Discover"
- Matches expire in 24 hours — creating daily urgency without a time-of-day lock

**How curation is communicated:**
- "Your Daily Bagels" section header — noun chosen to feel warm and approachable, not clinical
- Explicit count: "Today you have 6 Bagels" shown at the top
- Remaining time indicator: "Expires in 14 hours" on each Bagel card
- Counter resets at noon daily — creates a ritual check-in moment

**Psychological mechanic:**
- Daily delivery creates a ritual (Zeigarnik: unresolved potential pulls you back at noon)
- Small count (6) signals curation: "these are special, worth reviewing carefully"
- 24h expiry: if you don't like or pass, the match disappears — loss aversion drives action

## Conversation Expiry

- Matched conversations expire after 8 days unless both parties engage
- Expiry countdown visible in chat header
- "Extend" option available (premium) — allowing one extension per conversation

## Profile Card Depth

**Upfront (before tapping into full profile):**
- Photo, name, age, height, education, distance
- "Last active" indicator
- Expiry countdown

**After tapping:**
- About paragraph (user written, typically longer than other apps)
- Interests (self-selected)
- Looking for (serious relationship, casual dating, etc.)
- Question answers

## Discover vs Daily Bagels

- **Daily Bagels:** Curated, limited, expire in 24h — the core experience
- **Discover:** Unlimited browse (premium) — explicitly positioned as secondary, lower-quality
- The UI emphasises Bagels as the "real" product; Discover feels like a consolation feature

## Relevant Patterns for Harmonia

**What works well:**
- Daily limited batch creates ritual — Harmonia's tournament has a natural daily cadence
- "X of Y" count upfront (6 Bagels today) gives the user a scarcity frame before they even start browsing
- 24h expiry on unreviewed matches maps to potential "lapsed comparison" logic for Harmonia's between-session state
- "Last active" indicator gives a trust/recency signal without revealing too much
- Conversation expiry (8 days) is a commercial implementation of contact-window urgency — Harmonia's contact exchange follows a similar time-bounded model

**What doesn't apply:**
- Noon delivery ritual is too rigid for Harmonia's self-paced tournament
- "Bagels" branding is CMB-specific — Harmonia uses the tournament metaphor instead
- No personality/compatibility display

**Specific interaction patterns worth adapting:**
- "X comparisons ready for you today" as a dashboard hook — limits the session naturally
- Expiry countdown style (subtle, in-card) for between-session re-engagement copy: "Your next round closes in 48 hours if you don't complete it"
- Premium/free distinction logic: Harmonia has no premium tier, but the idea of "your curated pool vs. the wider pool" is relevant for pool building fallback UI

## Visual Notes

- **Card dimensions:** List-style on mobile (shorter cards showing multiple at once). Expiry badge in corner.
- **Colour usage:** Warm coffee brown (#6F4E37 family) brand palette. Friendly, relationship-oriented.
- **Typography:** Conversational, warm, longer copy than competitors.
- **Animation:** Subtle card entrance. No swipe mechanic — tap to view, button to like/pass.
