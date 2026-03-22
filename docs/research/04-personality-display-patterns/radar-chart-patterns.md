# Radar Chart Patterns — Personality/Compatibility Display Extraction

*Source: Observed in Harmonia's own index.html reference + Dribbble/CodePen research + published chart library documentation*

## What Was Observed in Harmonia's index.html

The existing Harmonia website (index.html reference) already uses an SVG radar chart on team profile cards:
- 7-axis radar chart (the Seven Deadly Sins dimensions)
- Two overlapping filled shapes: one per person being compared
- Shape 1: maroon fill (#722F37, 30% opacity)
- Shape 2: dark navy fill (#12090A, 30% opacity)
- Both shapes drawn with a solid stroke (maroon, navy respectively)
- Axis lines from centre to perimeter in light grey
- Concentric circles for grid reference (3-4 circles)
- Labels at each axis point (positioned outside the chart area)
- "74% match" circular badge overlaid at the centre of the chart
- Chart embedded inside a card with cream background

This is the canonical Harmonia radar chart — the landing page prototype already implements it as SVG.

## Radar Chart Design Principles (from Dribbble/design research)

### Colour Schemes for Light and Dark Mode

**Light mode:**
- Grid lines: rgba(0,0,0,0.08) — very subtle
- Axis lines: rgba(0,0,0,0.12) — slightly more visible
- Shape fills: semi-transparent (25-35% opacity) with solid strokes (50-70% opacity)
- User's own shape: gold/amber family (Harmonia: #D4A853, 30% fill, 60% stroke)
- Match's shape: maroon family (Harmonia: #722F37, 25% fill, 55% stroke)

**Dark mode (Wine Black base):**
- Grid lines: rgba(255,255,255,0.08)
- Axis lines: rgba(255,255,255,0.12)
- User's shape: bright gold (#F0C86E, 35% fill, 70% stroke)
- Match's shape: wine-red (#8B3A3A, 30% fill, 60% stroke)

### Animated Draw-in Effects

**Best pattern (from CodePen observations):**
1. Chart axes appear first (fade in, 200ms stagger per axis)
2. Grid circles appear (200ms, after axes)
3. Match shape draws in from centre outward (stroke-dashoffset animation, 600ms, ease-out)
4. User's shape draws in overlapping (600ms, staggered 200ms after match shape)
5. Centre match badge fades in last (300ms fade, after shapes complete)

Total animation duration: ~1.5 seconds. Feels alive without being distracting.

### Label Placement

**Best practice for 7-axis charts (odd number of axes):**
- Top axis: label above, centred
- Upper-left/right: label at 45° offset, outside perimeter
- Lower-left/right: label below-left/right
- Bottom: label directly below, centred
- Labels should be ~12px to avoid crowding at 7 axes
- For small chart sizes (<200px diameter): consider hiding labels and using a legend instead

### Overlay Pattern for Two Profiles

**Side-by-side comparison (two separate charts):**
- Each person gets their own chart
- Shown side by side, same scale
- User's chart on left, match's chart on right
- Caption: "You" / "Them" in small text below each chart
- Best for detailed analysis (insights page)
- Requires ~200px × 200px minimum per chart on mobile

**Overlaid comparison (two shapes on one chart):**
- Both profiles on the same chart
- Visual overlap area shows similarity
- Best for quick at-a-glance comparison
- The Harmonia index.html uses this pattern
- Works well at smaller sizes (150px × 150px) since less text needed
- Suitable for tournament card personality reveal

### Minimum Readable Radar Chart Size

- **On mobile, minimum diameter: 160px** for an overlaid two-profile radar
- Below 160px: axes become indistinct, labels unreadable even at 10px
- At 160px: label text must be hidden (use legend or tooltip instead)
- For tournament card personality reveal: 200-240px diameter is comfortable on a 375px viewport
- For insights page: 300-360px diameter allows full label + legend display

## Tooltip/Hover Interaction on Radar Points

- On desktop: hover on each axis point shows a tooltip ("Wrath: You are conflict-avoidant")
- On mobile: tap on axis label to show tooltip/callout
- Keep tooltips simple: dimension name + brief descriptor, not raw score
- Tooltip copy should use virtue/vice language: "Highly cautious with money" not "Greed: -4.2"

## Tournament Card Radar Chart Decision

**Should the radar chart appear on the tournament card?**

Arguments FOR: Most direct personality visualisation, Harmonia's visual signature, immediately distinctive
Arguments AGAINST: At card size (~160px), labels are too small; overwhelming alongside photo and hearts; requires explanation for new users

**Recommendation: On the tournament card, use a MINI radar chart (without labels) as the personality "hint" visible in default state.**

- Mini radar (60px × 60px): Shows the shape of someone's personality profile as an abstract polygon
- No labels at this size — it's a visual signature, not a data display
- Shown in the bottom-right corner of the card as a subtle "personality fingerprint"
- When user taps to reveal personality: mini radar expands to full 200px chart with labels and match overlay
- This satisfies both the "personality hint visible by default" and "full reveal on tap" requirements

## Relevant Patterns for Harmonia

**Radar chart on profile/insights pages:**
- Full labelled radar, 300px+, two overlapping shapes (gold for user, maroon for match)
- Animated draw-in on page load
- Interactive tooltips on desktop, tap-to-reveal on mobile

**Radar chart as tournament card personality hint:**
- Mini unlabelled polygon, 60px, shown in card corner
- Each candidate has a distinct shape — visually differentiates them from each other
- Does NOT show the user's own overlay at this size — just the candidate's signature shape

**Radar chart in personality reveal (on-tap):**
- Expanded to 200-240px, both shapes overlaid
- "You" shape in gold, "Them" shape in maroon (or vice versa on dark mode)
- Centre badge: similarity tier label, not percentage ("Strong match" not "74%")
- Labels on 4 primary axes only at this size (skip the 3 lowest-weight axes if space is tight)

## Visual Notes

- **Grid circles:** 3 concentric circles (25%, 50%, 75% of max value radius). Not 5 — too many lines at small sizes.
- **Axis count:** 7 for Harmonia's Seven Deadly Sins. Odd numbers create a slight asymmetry that is visually interesting vs. even-axis charts which look too regular.
- **Stroke weights:** Axis lines 1px, shape strokes 1.5px, grid circles 0.5px.
- **Chart container:** Subtle background card. Light mode: #FAF6F1 (cream). Dark mode: #2D1A1C (card-bg).
