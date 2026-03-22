# Gamification Patterns Synthesis

*Cross-cutting answers after reviewing Duolingo, Wordle, Strava, Forest App, Nike Run Club, and CMB*

## 1. Heart Accumulation Visual

**Best pattern: 3 solid icon slots in a horizontal row, positioned at the bottom-centre of each candidate card.**

Rationale from observed patterns:
- Duolingo hearts: horizontal row, filled = solid red, empty = outline grey. Persistent visibility in top bar.
- Muzz chat slots: horizontal row of circles, filled = accent colour, empty = grey outline.
- The pattern is well-established: N circles/hearts in a row = immediately readable at a glance.

**Specification for Harmonia:**
- 3 heart icons per candidate card (❤️ style, or custom SVG heart)
- Empty heart: outline only, gold stroke (#D4A853 light / #F0C86E dark), transparent fill
- Filled heart: solid gold fill (#D4A853 light / #F0C86E dark) with soft glow (box-shadow: 0 0 8px rgba(212,168,83,0.5))
- Animation on fill: scale up 1.0 → 1.3 → 1.0 (bounce, 300ms), colour transition from outline to filled
- Position: bottom-centre of card, 3 hearts in a row with 8px gap between each. Visible on both photo-state and personality-state of the card.
- Size: each heart ~20px × 18px. Tap target not required (hearts are display-only, not interactive).

## 2. Near-Match Tension (2 of 3 hearts)

**The 2-heart state is where the most design tension exists. How to create anticipation without biasing the choice?**

Key insight from Duolingo: the "almost done" treatment uses visual cues but NOT instructional text. The progress bar fills visually without saying "YOU'RE ALMOST THERE — PICK THIS ONE."

**Specification for Harmonia 2-heart state:**
- 2 filled gold hearts, 1 empty outline heart — the visual gap is self-explanatory
- The empty heart can pulse gently (opacity: 0.4 → 1.0 → 0.4, 2s loop) to draw attention without pressure
- NO copy change on the card when in 2-heart state — the hearts communicate it
- In the comparison view, when a candidate at 2 hearts is shown, the card itself does NOT get any special border or glow — to avoid biasing toward them
- The 2-heart state DOES appear in the dashboard "between session" view: "Someone is close to a match with you" — without naming who

## 3. Between-Session Hooks

**What the dashboard should show to pull users back:**

From CMB (daily bagels), Thursday (weekly ritual), Duolingo (streak/XP reminders):

- **Comparison count:** "8 comparisons waiting" — specific number creates a task with clear resolution
- **Heart progress teaser:** "Someone is getting closer to a match with you" (no name) — Zeigarnik Effect, unfinished potential
- **Session streak:** If user has done comparisons on consecutive days, show a streak counter (fire icon, N days) — directly from Duolingo
- **Phase progress ring:** Circular progress indicator showing overall tournament completion (e.g., "32% of comparisons done")
- **Gentle reminder copy:** "Your comparisons are ready" at noon each day — specific time anchor creates ritual (CMB's noon delivery)

**What NOT to show:**
- Specific candidate names in notifications (privacy spec from CLAUDE.md)
- Countdown timers with specific dates (Harmonia avoids time pressure commitment)
- "You haven't visited in X days" shaming copy (Harmonia's tone is warm, not guilt-based)

## 4. Phase Completion Celebration

**When all comparisons in a round are done:**

Scale: Bigger than a single comparison result. Smaller than a confirmed match.
Reference: Duolingo unit completion (character + badge + XP summary) rather than Duolingo lesson completion (just XP gain).

**Specification:**
- Full-screen moment (not just a toast notification)
- Animated: Harmonia's radar chart animates in (draws from centre outward, 600ms)
- Shows: "Phase 2 comparisons complete" + headline stat ("You made 47 comparisons") + match count ("3 confirmed matches")
- CTA: "View your insights" → Insights page
- Share button: Optional shareable graphic (Phase 2 complete, persona initials, colour block — no personal data)
- Duration: User-dismissable, auto-dismissed after 5 seconds if no interaction

## 5. Tournament Progress Visualisation

**Should Harmonia show a bracket tree, simple bar, or something else?**

Options evaluated:
- **Bracket tree (Easypromos style):** Shows future matchups — biases decisions and is complex. REJECTED.
- **Simple progress bar (X of N comparisons):** Clean, readable, low cognitive load. But misses the "who's performing well" layer.
- **Circular ring + counter (Duolingo-style):** Best balance — shows overall % without revealing upcoming pairs.
- **Candidate leaderboard (top 3 hearts):** Too much information — reveals ranking before tournament ends.

**Recommendation: Circular ring + comparison counter.**
- Top of the tournament screen: small circular progress ring (20px diameter) showing % of pool comparisons completed
- Below ring: "12 of 36 comparisons" in small text
- Per-candidate heart display on each card is the real-time progress signal
- No bracket tree, no candidate leaderboard visible to users (Elo leaderboard is dev-mode only per spec)

## Cross-App Animation Patterns

| Effect | App | Timing | Easing |
|--------|-----|---------|--------|
| Heart fill | Duolingo | 300ms | Ease-out with bounce |
| Match celebration | Hinge, Bumble | 600ms | Spring physics |
| XP count-up | Duolingo | 500ms | Ease-out |
| Badge unlock | Strava | 400ms | Scale spring |
| Card transition | Arena | 200ms | Ease-in-out |
| Confetti burst | Bumble, Hinge | 1200ms | Gravity physics |

Harmonia should use the mid-range: 300-500ms for micro-interactions, 600-800ms for celebration moments. Easing: ease-out for most UI transitions (feels responsive), spring/bounce only for celebratory moments.
