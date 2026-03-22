# 16Personalities — Personality/Compatibility Display Extraction

*Observed live at 16personalities.com, March 2026*

## Personality Data Visualisation

- **How traits are shown:** 5 dimensional spectrums displayed as horizontal percentage bars with colour gradients. Each bar shows a person's position on a bipolar scale (e.g., Introverted ←→ Extraverted). The bar fills from one end, with the percentage shown numerically alongside.
- **Colour coding system:** 4 groups, each with a signature colour:
  - Analysts (NT types): Purple/violet
  - Diplomats (NF types): Green (teal-green)
  - Sentinels (SJ types): Blue
  - Explorers (SP types): Yellow/amber
  These colours apply to: character avatar background, section headers, badge pills, bar fill colours.
- **Test question format:** 7-point circular radio scale. Left side: green circles (increasing size = stronger agree). Right side: grey/purple circles (increasing size = stronger disagree). Labels: "Agree" / "Disagree" only — no intermediate labels. Clean, minimal, not overwhelming.
- **Mobile vs desktop:** Percentage bars show on both. On mobile: bars are full-width. Character avatars scale down but remain visible.

## Personality Type Display Architecture

**Hero section (on type page):**
1. 3D low-poly character avatar (distinctive for each type) — full-width illustration
2. Pill badges in the type's signature colour: "INTROVERTED", "INTUITIVE", "FEELING", "PROSPECTING"
3. Large evocative name: "Mediator" (32px+ serif)
4. Code below name: "INFP Personality" (smaller, grey)
5. Short relatable tagline: "Mediators are poetic, kind, and altruistic people, always eager to help a good cause."

**Key observation:** The evocative name ("Mediator", "Architect", "Campaigner") precedes the code ("INFP", "INTJ"). The character avatar is the dominant visual — warm, human, not clinical.

## How Results Feel Exciting Rather Than Clinical

**Language choices observed:**
- "Mediators are poetic, kind, and altruistic..." (not "INFP individuals score high on...")
- "Few things make INFP personalities more uneasy than pretending to be someone they aren't" (personal, second-person-adjacent)
- Block quotes for memorable insight: "INFPs have a talent for self-expression. They may reveal their innermost thoughts and secrets through metaphors and fictional characters."
- No statistics or academic language on the public-facing type page
- The character avatar is the most powerful anti-clinical device — transforms personality data into an identity/persona

## Compatibility Between Types

- Compatibility described as narrative, not a number: "As partners: INFPs and ENFJs..." in paragraph form
- No compatibility percentage between two types on this page
- Character-level descriptions: "These two types bring out each other's best qualities..."
- Framing: relationship categories (friendship, romance, work) each get their own section

## Relevant Patterns for Harmonia

**Best approach for tournament card personality integration:**
- Use evocative trait labels, not dimension scores: "The Peacemaker" or "The Sparks-Seeker" rather than "Wrath: -3.2"
- Show the most prominent dimension as a colour-coded badge (e.g., a gold pill saying "Conflict-avoidant")
- The hint of personality on the default card should feel like an identity badge, not a measurement

**Best approach for perceived similarity display ("You're both..."):**
- Model on 16P's relatable narrative prose style: "You're both poetic and creative — you prefer depth over small talk"
- NOT: "Shared traits: Sloth(-3), Wrath(-2)"
- Show as 2-4 short sentence cards, each focused on one shared trait behaviour

**Best approach for radar chart:**
- Radar chart suits the insights/profile page — too complex for the tournament card
- On the card: use pill badges or a single dominant-colour indicator
- On the insights page: full radar chart with two overlapping shapes (user + match), with 16P's colour-coded border for each shape

**What to avoid:**
- Any numerical scores visible to users ("Wrath: -3.2", "Similarity: 0.74") — clinical feel
- Bar charts for individual dimensions — feels like a test result
- MBTI codes — Harmonia's system is proprietary, should have Harmonia-specific labels

## Visual Notes

- **Typography for personality labels:** Bold sans-serif for dimension names. Large serif for the evocative type name (matches Harmonia's Cormorant Garamond heading style).
- **Colour gradients:** Green → grey → purple across the spectrum bar. Colour represents the "direction" not the "amount".
- **Badge/pill design:** Dark background pill, white text, no border radius overdone. ~24px height, 8px horizontal padding.
- **Character avatar dimensions:** Full-width illustration (~400px on mobile). Character takes ~60% of the space, background colour fills the rest.
