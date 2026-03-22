# Hinge — UI Pattern Extraction

*Source: hinge.co marketing pages + app store listing + published UX case studies (site blocked during live session)*

## Card/Profile Layout

- **Default visible information:** Full-bleed photo (portrait crop, ~3:4 ratio) as primary. Name and age overlaid at bottom-left in white text. First prompt-answer card visible below the photo by scrolling. Distance shown as small badge. Verified badge (blue tick) if applicable.
- **Information revealed on tap/expand:** Additional photos, remaining prompt answers (2 more after the first), voice note prompt, dealbreakers, basic info (height, education, job, religion, children, drinking/smoking).
- **Photo treatment:** Full-bleed portrait. Single photo per card in the feed. Stacked vertically on profile scroll. No filter overlays. Slight bottom gradient for text legibility.
- **Text positioning relative to photos:** Prompt answers appear as separate full-width cards interspersed between photos. Dark background card with question in small caps and answer in larger body text. Like button on the prompt card itself.

## Matching/Selection Mechanics

- **How the user indicates interest:** Two tiers: (1) Like — tap heart icon on any element (photo, prompt, voice note). (2) Rose — premium scarce signal (1 free per week), skips the queue and appears in the Standouts feed.
- **What happens on mutual match:** "It's a Match!" screen with both profile photos and a "Send a Message" prompt. Match only happens when both users have liked.
- **Any multi-step confirmation:** No — Like is a single tap. No 3-heart accumulation.
- **Scarcity or limit mechanics:** Likes are unlimited on free tier but "Roses" are limited (1/week free). Standouts feed shows ~20 "most active and compatible" profiles daily — curated scarcity.

## Compatibility/Personality Display

- **How compatibility info is shown:** Dealbreakers displayed as badges (e.g., "Wants children: Yes"). No percentage or score. Personality expressed through prompt answers only.
- **Where it appears:** Below photos in the profile scroll, not on the browse card.
- **Language used:** User-written prose answers to prompts. No algorithmic compatibility language.
- **Progressive disclosure:** Default card shows only photo, name, age, distance. Full personality only visible by scrolling/tapping into profile.

## Relevant Patterns for Harmonia

**What works well:**
- Prompt-answer format as personality expression is warmer than test scores — "I get along best with people who..." is more engaging than "Agreeableness: 74%"
- The Standouts feed (curated daily selection) is closest to Harmonia's tournament pool concept — quality over quantity
- Prompt like mechanic (react to specific personality element) maps to Harmonia's "tap card to see personality" reveal
- "We Met" survey (4-day post-contact trigger) is directly adopted by Harmonia's spec

**What doesn't apply:**
- Asymmetric matching (one person likes, then other decides) — Harmonia uses mutual pre-filter before tournament
- No forced-choice mechanics — Hinge is sequential browse, not pairwise comparison
- Unlimited scroll format — Harmonia is curated tournament with finite pool

**Specific interaction patterns worth adapting:**
- Bottom-gradient photo overlay for name/age readability on dark photos
- Prompt card interspersed with photos: translates to Harmonia's personality reveal panel between photo and action buttons
- "It's a Match!" celebratory screen with both photos: direct reference for Harmonia's 3-heart confirmation screen

## Visual Notes

- **Card dimensions on mobile:** Full-screen width, ~70% viewport height for photo portion. Very tall cards requiring vertical scroll.
- **Colour usage:** Clean white background, black text, red brand accent for hearts. Standouts uses gold/rose tones.
- **Typography hierarchy:** Large bold name (24px+), small grey age, smaller grey location. Prompt question in small-caps grey, answer in 16px regular body.
- **Animation/transition notes:** Hearts fill with red on tap (bounce animation). Profile scroll is continuous vertical scroll. Match screen uses fade-in with confetti.
