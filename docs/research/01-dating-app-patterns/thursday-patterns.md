# Thursday — UI Pattern Extraction

*Source: thursday.com marketing pages + press coverage + app store listing*

## Card/Profile Layout

- **Default visible information:** Photo, name, age, job, one prompt answer visible. All matches and activity visible ONLY on Thursdays (7am–midnight).
- **Information revealed on tap:** Full profile, more photos, additional prompts.
- **Photo treatment:** Standard portrait card. Full bleed.
- **Text positioning:** Name/age overlay at bottom of photo.

## Urgency/Scarcity Mechanics — Key Pattern

Thursday's entire UX is built around a single time constraint: the app only works on Thursdays.

**Urgency UI elements:**
- Countdown timer: prominent display showing "Opens in X days, X hours" on non-Thursday days
- On Thursday: active "TODAY IS THURSDAY" banner in brand orange
- Match expiry: all conversations expire at midnight Thursday (no carry-over to next week)
- Profile expires: you must re-engage each Thursday

**How time constraint is communicated:**
- App is literally locked/greyed out 6 days per week — the lock IS the communication
- Push notifications on Thursday morning: "Thursday is here. Don't miss your matches."
- No countdown within the matching session itself — the day is the constraint, not a per-match timer

**Relevant psychological mechanic:**
- Scarcity of time (one day per week) creates the Zeigarnik Effect before even opening the app: the unresolved possibility of matches pulls users back weekly
- "Loss aversion" framing: if you don't act today, you lose those matches
- Creates a ritual: Thursday = dating activity, other days = recovery and anticipation

## Matching/Selection Mechanics

- **How the user indicates interest:** Like/Pass. Mutual like = match, messaging available until midnight.
- **What happens on mutual match:** Immediate notification, chat opens.
- **Any multi-step confirmation:** No.
- **Scarcity mechanics:** Time-based (weekly day window) + match expiry at midnight.

## Compatibility/Personality Display

- None — Thursday is purely photo + brief prompt. No compatibility scoring.

## Relevant Patterns for Harmonia

**What works well:**
- The locked-app-showing-countdown creates anticipation for tournament sessions — Harmonia's dashboard "between session" state should show a similar hook
- "This is your window" urgency framing without countdown timers on individual actions
- Weekly ritual framing — "your next round of comparisons is ready" as a recurring event
- Explicit expiry creates urgency to complete comparisons (Harmonia doesn't use expiry, but the concept of a "session window" is worth considering for the dashboard between-phase state)

**What doesn't apply:**
- Harmonia has no artificial time lock — tournament is always available
- Thursday's model is too restrictive for Harmonia's research protocol
- No personality data — purely visual

**Specific interaction patterns worth adapting:**
- Dashboard "your next batch is ready" notification style mimics Thursday's "Thursday is here" banner — use it for new comparison rounds
- For the dashboard between-phase waiting state: a warm "Phase 2 is coming" countdown card (no specific date, just anticipation building)

## Visual Notes

- **Brand colour:** Bold orange (#FF6600)
- **Typography:** Bold sans-serif headlines. Very text-forward.
- **Animation:** App unlocks/greys based on day — dramatic reveal on Thursday
- **Counter:** Clean large countdown numbers in brand orange
