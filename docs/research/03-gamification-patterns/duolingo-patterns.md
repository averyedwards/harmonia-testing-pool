# Duolingo — Gamification Pattern Extraction

*Observed live at duolingo.com, March 2026. Additional data from published Duolingo UX research.*

## Progress Mechanics

- **How progress is visualised:** Multiple simultaneous systems — XP bar (progress to next level), streak counter (days in a row), weekly XP goal (circular ring), leaderboard rank (within a league). Unit completion shown as a skill tree (path of circular nodes, connected by dotted line).
- **Progress granularity:** Per-lesson (individual exercise), per-unit (cluster of lessons), per-streak-day, per-league-week.
- **"Almost done" treatment:** When 1 lesson remains in a unit, the path node glows/pulses. The "Almost there!" copy appears. Progress bar fills to nearly full (visible gap deliberately left).
- **Completion celebration:** After each lesson: animated XP gain, stars fly from the exercise into the XP bar. After a unit: larger celebration screen with animated character, badge unlock, XP summary. "You earned 47 XP!" in large display text.

## Streak and Return Mechanics

- **How streaks are tracked:** Fire icon (🔥) with the streak number. Visible in the top bar on every screen — always visible, always salient. Current streak is the single most prominent gamification metric in the app.
- **What happens when a streak breaks:** "Oh no! Your streak ended" screen with sad Duo owl. Streak Shield (purchasable) can protect one missed day. "Streak Freeze" shown as an insurance mechanism. Breaking feels emotionally weighted — Duo is sad.
- **Re-engagement hooks:** Daily reminder notification at a user-set time. If user doesn't open the app: escalating message urgency (Duo starts friendly, gets passive-aggressive by night). Specific, not generic: "Your 14-day streak is in danger! 🔥" not "Come back to Duolingo".
- **Notification patterns:** Time-specific ("It's 7pm — your streak is in danger"), personalized (first name), progress-anchored ("You're 15 XP away from your goal").

## Achievement and Reward

- **Badge/trophy designs:** League badges (Bronze → Silver → Gold → Sapphire → Ruby → Emerald → Amethyst → Pearl → Obsidian → Diamond leagues). Each has an icon (shield with gem) and distinctive colour.
- **Milestone celebrations:** "You've reached Diamond League!" — full-screen animation, character celebration, shareable moment. Achievement badges also unlocked for specific behaviours (5-day streak, 100 lessons, etc.).
- **Collection/gallery view:** Achievement shelf in profile showing all earned badges.

## The Hearts System (Lives Mechanic)

- Users have 5 hearts (lives) per session on the free tier
- Wrong answers cost 1 heart
- 0 hearts = session ends, must wait or purchase a refill
- Hearts displayed as ❤️ icons in the top bar during a lesson — persistent visibility
- At 1 heart remaining: warning animation, hearts icon turns red, tension mounts
- This is the most directly relevant pattern for Harmonia's 3-heart accumulation:
  - Same metaphor (hearts = limited resource with emotional weight)
  - Same persistent top-bar visibility
  - Same animated transition on change
  - Opposite direction: Duolingo hearts DECREASE (lives), Harmonia hearts INCREASE (progress toward match)

## Relevant Patterns for Harmonia

**Heart accumulation display:**
- 3 hearts in a row (🤍🤍🤍 → 🖤🖤🖤 in gold) with animation on fill
- Show all 3 hearts on the card with empty/filled state — visible at a glance
- Animate the heart fill when a candidate earns a new heart (bounce + colour fill)
- Position hearts in top or bottom of the candidate's card — persistent visibility

**Tournament progress visualisation:**
- Duolingo's skill tree path (sequential nodes, some locked, some complete, one current) is worth considering for Harmonia's tournament navigation — shows overall journey without spoiling who's coming next
- XP-style counter for comparisons completed ("12 comparisons in this session") as optional sidebar metric in dev mode

**Between-session re-engagement:**
- Push notification anchored to specific progress: "You're 1 heart away from matching with someone" (without naming the person)
- Session-completion summary: "Today: 8 comparisons, 2 candidates at 2 hearts" — gives the user a sense of progress

**Phase completion celebration:**
- Duolingo's unit completion screen (character, badge, XP summary, share button) is the right scale for Harmonia's round-completion — bigger than a single comparison result, smaller than a match confirmation

## Visual Notes

- **Colour for progress:** Green (#58CC02) = positive, active, streak. Red/orange for danger states (streak at risk, last heart).
- **Animation timing:** XP gain animation ~600ms. Streak flame animation loops gently (idle state). Heart loss is fast (<300ms) with a brief red flash.
- **Iconography style:** Flat, round, friendly. Hearts are literal ❤️ emoji-style icons with solid fill.
- **Typography:** Bold display type for numbers (streak count, XP). High contrast on coloured backgrounds.
