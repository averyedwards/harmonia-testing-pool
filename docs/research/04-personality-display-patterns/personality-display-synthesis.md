# Personality Display Synthesis

*Cross-cutting answers after reviewing 16Personalities, Boo, OkCupid, Spotify Wrapped/Blend, and radar chart patterns*

## 1. Personality Hint on the Tournament Card (Default State)

**Question:** What's the best visual hint that personality data exists without revealing it?

**Decision: Mini unlabelled radar polygon + single dominant trait pill badge.**

**Design:**
- Bottom-right of the candidate photo: a 60×60px SVG polygon (no axes, no labels) showing the candidate's personality profile shape in the candidate's signature colour
- Shape is a visual "fingerprint" — each candidate's polygon looks different, making cards visually distinct
- Directly adjacent to the mini radar: a single pill badge showing the most prominent dimension ("Conflict-avoidant", "Spontaneous", "Methodical") in the candidate's colour
- This satisfies: (1) personality is visible by default without requiring a tap, (2) it's a hint, not the full reveal, (3) it's curious and distinctive, not clinical

**Rationale:**
- Boo: personality badge on card by default → normalises personality as part of default selection
- CHI '22: pure photo-first amplifies implicit bias; a personality hint reduces it without text-first (which reduces engagement)
- 16Personalities: evocative labels ("Mediator") are more engaging than codes or numbers
- Radar chart research: mini polygon at 60px is readable as an abstract shape even without labels

## 2. The Reveal Moment (Tapping to See Full Personality)

**Decision: Slide-up panel from the bottom of the card, overlaying the lower 60% of the photo.**

**Animation:** Card's lower half slides up over the photo (translateY: 100% → 0, 350ms, ease-out). The photo is still visible in the upper 40% — not fully hidden.

**The reveal panel contains (top to bottom):**
1. Similarity tier headline: "Strong personality match!" / "You have a lot in common" / "Some shared traits" / "Different perspectives, potential spark"
2. Shared trait cards: 2-4 short sentences in a horizontal scroll (one per trait). E.g.: "You're both more cautious than spontaneous" | "You both prefer harmony over confrontation"
3. Mini radar chart expanding to 200px: user's shape (gold) + candidate's shape (maroon) overlaid. Centre badge: "Strong match" (not a percentage)
4. Trait pills for candidate's top 3 dimensions: "Conflict-avoidant" | "Methodical" | "Generous"
5. Hearts display: visible throughout (not hidden during reveal)
6. "Close" affordance: upward swipe or X button dismisses the reveal panel (slide down to close)

**Rationale:**
- Slide-up panel: used by Bumble (profile details), native iOS modals — familiar pattern, non-disruptive
- Doesn't fully occlude the photo: user retains visual context of who they're viewing personality data about
- One slide-up covers BOTH tournament card A and card B (showing the tapped card's personality)
- Comparison remains in context: the other card is still visible behind the panel

## 3. Similarity as Gamification (Not a Test Result)

**Decision: Use Spotify Wrapped's Data → Insight → Social Context → Identity Label framework.**

**Harmonia's four similarity tiers mapped to this framework:**

**Strong fit (≥0.60):** "Strong personality match!"
- Identity: You might just get each other
- Don't show a number — the label IS the reward

**Good fit (≥0.40):** "You have a lot in common"
- Warm, colloquial, positive

**Moderate fit (≥0.25):** "Some shared traits"
- Neutral, not disappointing — leads into what IS shared

**Low fit (<0.25):** "Different perspectives, potential spark"
- Reframes difference as possibility — follows Harmonia's positive-only rule
- Shows only 1 shared trait (per spec), emphasises visual chemistry

**Critical: NEVER show the similarity score (0.47, 0.62, etc.) to users.** Only the tier label. The label is the gamification reward. The number would make it feel like a test.

## 4. "You're Both..." Trait Cards

**Decision: Horizontal scroll of short sentence cards, 2-4 cards depending on similarity tier.**

**Card format:**
- Each card: ~240px wide × 72px tall (fits 2 on a 375px screen, hinting there's more to scroll)
- Left side: small icon representing the trait (an emoji or simple SVG — e.g., 🕊️ for conflict-avoidant, ⚡ for spontaneous, 📚 for methodical)
- Right side: 1-2 sentence description: "You're both more cautious than spontaneous — you think before you leap."
- Background: card-bg colour (cream light / dark card dark). Gold left border for visual texture.
- Scrollable: drag to see more cards horizontally
- Displayed sentences are generated from perceived similarity comparison, using the "You're both..." format

**What NOT to use:**
- Bullet point lists (feels clinical)
- Numbered lists (feels like a test)
- Dimension names (Wrath, Sloth — don't expose the framework labels)
- Radar axis labels (too technical for this context)

## 5. Radar Chart on Tournament Card vs Insights Page

**Tournament card (personality reveal):**
- Mini radar (60px) in default state as fingerprint hint — NO labels
- On tap: 200-240px radar in the reveal panel, both overlaid shapes, minimal labels (4 of 7 axes)
- No interactive tooltips in reveal panel (too fiddly at this scale on mobile)

**Insights page:**
- Full radar chart, 300-360px, full labels on all 7 axes
- Side-by-side comparison: User's radar on left, match's radar on right
- OR: Overlaid view (user gold, match maroon) with legend below
- Interactive tooltips on desktop
- Animated draw-in on page load
- Centre badge: "74% similar" — percentage is appropriate on the insights page (not the card)

**Rationale:**
- Radar chart research confirms 160px minimum for readable labels — 60px mini is intentionally label-free
- Spotify Wrapped principle: one key insight per context. Tournament card → trait headlines. Insights page → full data.
- Harmonia's insight pages are designed for deeper reflection post-session; the radar chart belongs there, not mid-decision

## 6. Phase 3 Genetics Integration

**Decision: HLA indicator as a separate small badge beneath the personality reveal section, NOT as an additional radar axis.**

**Visual treatment by tier:**
- **Score ≥ 75 ("Strong chemistry signal"):** Green pill badge with 🧬 icon. Subtle glow. Positioned at the bottom of the personality reveal panel, after the trait cards.
- **Score 50-74 ("Good chemistry"):** Amber pill badge with 🧬 icon. No glow.
- **Score 25-49 ("Some chemistry"):** Muted grey pill badge with 🧬 icon. Smaller, less prominent.
- **Score < 25:** Hidden entirely. No negative messaging per spec.

**Whether genetics is visible by default or on tap:**
- HLA badge is part of the personality reveal panel (shown on tap), NOT visible on the default card state
- Rationale: HLA is Phase 3 addition — keeping it discoverable (on tap) rather than default maintains the photo-first experience while ensuring it informs decisions for those who seek it

**How genetics interacts with personality reveal:**
- Shown sequentially: personality (trait cards, mini radar) → then HLA badge at the bottom
- The genetic signal is the final layer, below personality — it adds to the picture, doesn't replace it
- Label copy: "Biological chemistry signal" or "Chemistry signal" to avoid scientific jargon

**Why NOT as a radar axis:**
- Adding an 8th axis to the 7-sin radar would break the established visual identity
- HLA score is categorically different from personality dimensions (biological vs behavioural)
- Keeping it as a badge maintains the separation between the three signal types
