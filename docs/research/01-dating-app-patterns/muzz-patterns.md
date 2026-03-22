# Muzz — UI Pattern Extraction

*Source: muzz.com marketing pages + app store listing + published UX writing on Chat Limits feature*

## Card/Profile Layout

- **Default visible information:** Profile photo, first name, age, location, Islamic practice level indicator (badge). Community/ethnicity. Height. Education.
- **Information revealed on tap/expand:** About section, detailed lifestyle preferences (prayer habits, hijab status, family background), full photo gallery, prompt answers.
- **Photo treatment:** Circular avatar thumbnail in match list. Full rectangular photo in profile view. Optional photo visibility controls (visible only to accepted connections).
- **Text positioning:** Profile info listed vertically below photo. Clean card layout with icon-label pairs.

## Matching/Selection Mechanics

- **How the user indicates interest:** Like or Pass. If mutual like, a "connection" is opened.
- **What happens on mutual match:** Connection request, then messaging enabled.
- **Any multi-step confirmation:** No — but Chat Limits restrict how many active conversations exist simultaneously.
- **Scarcity or limit mechanics:** CHAT LIMITS — the critical feature. Users can maintain a maximum of 5 simultaneous active conversations. When a slot is full, they must end one conversation to start a new one. This is shown as a visual slot counter (e.g., "3/5 chats active").

## Chat Limits — Key Feature for Harmonia

The Chat Limits system directly informs Harmonia's three-heart confirmation mechanic:

**How it's communicated:**
- Onboarding screen explaining the 5-chat maximum with rationale ("This helps you focus and improves your chances")
- Slot indicator in the matches tab: 5 circular slots, filled = active conversation, empty = available slot
- When all 5 slots are filled: "You've reached your connection limit. End a conversation to start a new one."
- When trying to connect beyond limit: modal explaining the limit with option to manage existing connections

**Why it works (as documented by Muzz):**
- Forces intentionality — users must consciously choose each connection
- Reduces ghosting — limited slots means higher response rates
- Users self-report higher quality interactions despite fewer simultaneous chats
- The limit creates perceived value: "only 5 people can talk to me at once"

**Visual design of slots:**
- Horizontal row of 5 circles (or pills) in the messages tab header
- Filled circles: gold or accent color
- Empty circles: grey outline
- Counter label: "3 of 5 slots used"

## Compatibility/Personality Display

- **How compatibility info is shown:** Religious practice level matching (e.g., "Practising" matched with "Practising"). No algorithmic percentage. Profile badges indicate lifestyle preferences.
- **Where it appears:** Profile view, not on browse cards.
- **Language used:** Lifestyle labels, not personality scores.
- **Progressive disclosure:** Browse shows minimal info; personality emerges through conversation rather than pre-match display.

## Relevant Patterns for Harmonia

**What works well:**
- The slot counter UI (5 circles, filled/empty) is the strongest existing visual reference for Harmonia's 3-heart accumulation display. Directly translates to 3 hearts per candidate.
- The "you must choose which conversation to end" friction creates deliberate choice — maps to Harmonia's forced-choice tournament philosophy
- Communicating limits with positive framing ("helps you focus") rather than restriction language — critical for Harmonia's heart mechanic copy
- Limit system creates a collection-based mental model: you're building a shortlist, not swiping infinitely

**What doesn't apply:**
- Religious/cultural focus is not relevant to Harmonia's design
- 5-slot system is for simultaneous conversations; Harmonia's 3-heart is for accumulation across pairings, not active chat slots
- No forced-choice tournament — Muzz is sequential like/pass

**Specific interaction patterns worth adapting:**
- Heart counter should use the exact visual pattern: N circular icons in a row, filled = earned hearts, empty = remaining
- Positive framing when explaining the heart limit: "Three connections means real interest" not "You can only match with 3 people"
- When a third heart fills: should feel like "slot completed" — a purposeful moment, not accidental

## Visual Notes

- **Card dimensions on mobile:** Standard mobile card. Compact list-view for matches, expanded for profile.
- **Colour usage:** Green brand primary (reflects brand values), white cards, grey secondary text.
- **Typography:** Clean sans-serif throughout. Badge system for categorical attributes.
- **Animation:** Slot fill animation when a new connection forms. Slot empty animation when conversation ends.
