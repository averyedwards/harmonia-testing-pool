# Chatbot Arena (arena.ai) — Tournament/Bracket UI Extraction

*Observed live at arena.ai, March 2026*

## Comparison Layout

- **Side-by-side panel design:** Two equal-width panels separated by a ~20px gap. Each panel is a dark card (~640px wide on a 1440px desktop). The panels extend vertically as content grows — they are not fixed height.
- **Visual balance:** Perfectly balanced — identical card dimensions, identical "Assistant A" / "Assistant B" labels in small monospace caps at the top-left of each card. Neither side has any visual advantage.
- **Divider/separator treatment:** No explicit divider line. The gap between cards is the separator. Background is very dark (#1a1a1a) making the card boundaries clear.
- **Mobile layout:** On narrow viewports, stacks vertically — "Assistant A" above, "Assistant B" below. User scrolls between them. No swipe mechanic.

## Choice Mechanic

- **How the user indicates their choice:** Four dedicated voting buttons centered below both panels — NOT by tapping the card itself. Buttons are: "← A is better" | "⇌ Both are good" | "⊘ Both are bad" | "B is better →"
- **Tap target area:** Dedicated buttons only (not the full card surface). Buttons are approximately 160px wide × 44px tall with rounded borders.
- **Minimum viewing time before choice is available:** None — buttons are available immediately once responses are generated.
- **Skip or tie option:** Yes — "Both are good" (positive tie) and "Both are bad" (negative tie). Two distinct tie states.

## Post-Choice Feedback

- **Animation on selection:** Subtle — the chosen side's card gets a green border highlight (approximately 2px solid #22c55e). No dramatic animation.
- **Reveal mechanic:** After voting, anonymous "Assistant A" / "Assistant B" labels are replaced with actual model names. The winner is displayed with the green border. The losing card label changes to the model name with no special treatment.
- **Transition to next comparison:** Manual — no auto-load. The user must start a new chat. The interface shifts to a "follow-up" conversation mode rather than serving the next pair automatically.
- **Running score or progress display:** None during the session. Progress visible only on the Leaderboard page.

## Progress and Session

- **Progress indicator:** None during a comparison session. Leaderboard shows cumulative Elo scores and vote counts per model.
- **Leaderboard format:** Table with columns: Rank / Model name (with provider icon) / Score (Elo, integers ~1400-1550) / Votes (cumulative). Filterable by category (Text, Code, Vision, etc.).
- **Session persistence:** Previous battles saved in sidebar history list. Can return to past comparisons.
- **End-of-session summary:** None — each battle is atomic.

## Relevant Patterns for Harmonia Tournament

**What works well:**
- Equal-width panel balance ensures no left/right bias — critical for Harmonia's fairness goals
- Anonymous labelling before vote (CHI '22 bias prevention) implemented perfectly: "Assistant A/B" maps directly to Harmonia's need to not bias by profile order
- The post-vote reveal (identities appear after voting) is the cleanest implementation of blind forced-choice available
- Four-option voting covers all decision states: clear winner left, clear winner right, both good (tie), neither good (pass) — maps to Harmonia's "Pick one / Pass both" mechanic
- Green border highlight on winner is understated but clear

**What doesn't apply:**
- No timer — Harmonia should track time-to-decision as research data but not display it to users
- Manual next-pair loading — Harmonia should auto-load next pair for better tournament flow
- Text-only content — Harmonia's cards are photo + personality, not text responses
- No hearts/accumulation mechanic — purely single-vote model
- "Both are bad" option is negative framing — Harmonia's "Pass both" should be neutral, not negative

**Specific interaction patterns worth adapting:**
- The 4-button row below both panels (not on cards) is the correct placement for Harmonia's "Choose Left / Choose Right / Pass Both" buttons
- Green border on selected winner: adapt to gold glow (#D4A853 / #F0C86E) for Harmonia's palette
- Blind labelling before reveal: adapt to show "Person A / Person B" by default, reveal name on tap after selection

## Visual Notes

- **Dimensions:** Cards ~640px wide × variable height on 1440px desktop. Button row is centered, ~700px total width across 4 buttons.
- **Colour usage:** Very dark background (#111), dark card surfaces (#1e1e1e), green (#22c55e) for winner highlight, white text, grey secondary text (#888).
- **Typography:** Monospace for labels ("Assistant A"), sans-serif for content text. Labels are small (~12px caps).
- **Animation/transition timing:** Winner highlight appears almost instantly (< 200ms). No entrance animation on card content.
