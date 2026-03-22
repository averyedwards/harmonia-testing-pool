# Boo — UI Pattern Extraction

*Source: boo-inc.com + app store listing + published screenshots and reviews*

## Card/Profile Layout

- **Default visible information:** Profile photo, name, age, MBTI type displayed as a prominent badge (e.g., "INFP" in the type's signature color). Compatibility percentage badge between the viewer and this profile.
- **Information revealed on tap/expand:** Personality description, trait details, "Universe" groups this person belongs to, prompts/answers.
- **Photo treatment:** Standard square/portrait photo. MBTI type overlaid as coloured badge in the corner or below the name.
- **Text positioning:** Name top-left, MBTI badge immediately below or adjacent to name. Compatibility percentage shown as a large circular badge or percentage strip at the top of the profile.

## Personality-First Approach

Boo is the only major dating app where personality type appears on the browse card BEFORE scrolling into a profile. This is the unique pattern:

**Default card shows:**
1. Photo
2. Name + age
3. MBTI type badge (colour-coded: NT types = purple/navy, NF types = green, SJ types = blue, SP types = orange/gold)
4. Compatibility percentage ("85% compatible")

**The compatibility percentage is calculated from:**
- MBTI type-to-type compatibility matrix (pre-calculated, not dynamic)
- Additional personality assessments (Big Five, Enneagram optional)

## Matching/Selection Mechanics

- **How the user indicates interest:** Like/Pass (standard swipe or button), but with the option to filter by MBTI type first.
- **What happens on mutual match:** Standard match notification. Then the "compatibility breakdown" is shown on the match screen.
- **Any multi-step confirmation:** No accumulation mechanic.
- **Scarcity or limit mechanics:** None specifically — standard browse model.

## Compatibility/Personality Display

- **How compatibility is shown:** Large percentage number ("85%") on profile card. Breakdown available on profile: which trait dimensions align vs differ.
- **Where it appears:** On the browse card (default state) AND expanded on profile.
- **The language used:** Percentage + label. "You're highly compatible" for 80%+. Type pairing descriptions: "INFPs and ENFJs make excellent partners because..."
- **Progressive disclosure:** Percentage visible by default. Breakdown requires tapping into profile.

## Universe (Community) Feature

- Topic-based communities within the app (e.g., "Philosophy", "Art", "Gaming")
- Users join Universes and interact with others who share interests
- Profile shows which Universes someone belongs to
- This is the secondary social layer beneath the matching mechanic

## Relevant Patterns for Harmonia

**What works well:**
- Showing compatibility percentage on the BROWSE CARD (not hidden until you tap) normalises personality data as part of the default selection interface — addresses the CHI '22 concern about photo-first defaults
- Colour-coding personality types creates instant visual differentiation — each personality category has a signature colour
- Large percentage as a "headline number" is the most direct personality-on-card pattern in commercial dating
- The compatibility breakdown (shown on match) maps to Harmonia's post-selection personality reveal

**What doesn't apply:**
- MBTI percentage is a pre-calculated matrix, not a measured similarity score — Harmonia's perceived similarity is calculated from actual questionnaire responses
- Percentage framing risks feeling clinical — "85% compatible" is exactly the test-result language Harmonia should avoid
- No forced-choice tournament — Boo is standard swipe

**Specific interaction patterns worth adapting:**
- Personality badge visible by default on card: Harmonia should show a subtle personality hint (colour-coded or abstract indicator) on the default card state
- Compatibility as a warm label rather than a number: "Strong personality match" instead of "74%"
- Colour coding for personality dimensions: Harmonia can use the 7 sin dimensions' colour coding as a visual signature on cards

## Visual Notes

- **Card dimensions:** Standard mobile card, ~320px wide. MBTI badge ~48x24px pill at top of card.
- **Colour usage for types:** Each MBTI group has a signature color. Applied to badge backgrounds and profile page headers.
- **Typography:** Large name, medium MBTI type, smaller compatibility percentage or vice versa.
- **Animation:** Compatibility percentage animates in (count-up from 0) when profile opens.
