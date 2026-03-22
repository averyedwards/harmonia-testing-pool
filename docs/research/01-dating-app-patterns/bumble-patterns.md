# Bumble — UI Pattern Extraction

*Source: bumble.com marketing pages + app store listing + published feature documentation*

## Card/Profile Layout

- **Default visible information:** Full-bleed photo, name, age, distance, verification badge (ID verified), "About" snippet (first ~80 characters). Audio/video prompts if added.
- **Information revealed on tap/expand:** Full About section, interests (badge-style), lifestyle answers (pets, exercise, politics, religion, etc.), prompts, photo gallery.
- **Photo treatment:** Full-bleed portrait (~9:16 on mobile). Swipe left/right to browse photos within a profile before swiping on the profile itself.
- **Text positioning:** Name/age bottom-left overlay with white text + subtle drop shadow. Badges and prompts appear below the photo section on scroll.

## Matching/Selection Mechanics

- **How the user indicates interest:** Right swipe (Like) or left swipe (Pass). Bumble Boost: "SuperSwipe" (premium signal).
- **What happens on mutual match:** Match notification. Women MUST send the first message within 24 hours or the match expires. Men cannot initiate.
- **Any multi-step confirmation:** No accumulation. Single mutual-swipe match.
- **Scarcity/limit mechanics:** 24-hour messaging window for women (expiry creates urgency). BFF and Bizz modes create separate matching pools.

## Safety Features

**Share Date:** User can share meetup details (time, location) with a trusted contact from within the app. This trusted contact receives a link showing the meetup details. If user doesn't check in after the date, the contact is alerted.

**ID Verification:** Photo selfie matched to government ID. Badge appears on profile. Significantly increases trust signal.

**Profile Card:** Shows "ID Verified" as a blue badge alongside other trust signals. Users with verification visible prominently in browse feed.

## Profile Card Information Hierarchy

1. Photo (primary) — full bleed, ~70% of viewport height
2. Name + age (overlaid on photo, bottom-left)
3. Verified badge (top-left corner of photo)
4. First prompt or About snippet (below photo)
5. Interests (badge pills: "Hiking", "Coffee", "Travel")
6. Lifestyle answers (icons + labels: "Has a dog", "Drinks socially", "Wants children: yes")

## Compatibility/Personality Display

- **No compatibility score.** Personality is expressed through:
  - User-written About text
  - Prompts/answers (150 character limit)
  - Interest badges (self-selected from a taxonomy)
  - Lifestyle answer badges (structured choices)
- **Where it appears:** Below the photo in vertical scroll
- **Language:** User-written, not algorithmic
- **Progressive disclosure:** Browse card shows photo + name. All personality requires tapping/scrolling into profile.

## Mobile Card Dimensions and Interaction

- Full-width card (100vw)
- Photo: ~65-70% of viewport height
- Swipe mechanics: horizontal swipe on card = like/pass. Vertical scroll within profile = browse content.
- Touch targets: entire card area is swipeable. No small tap targets for core actions.

## Relevant Patterns for Harmonia

**What works well:**
- Verification badge as trust signal — directly relevant for Phase 3 DNA kit participants
- Interests as badge pills (self-selected taxonomy) could inform Harmonia's trait display: "Spontaneous", "Values harmony" as pills rather than radar axes
- Lifestyle answers as icon+label pairs: clean way to surface structured personality data without clinical feel
- Full-bleed photo as primary with ALL personality secondary: strong engagement hook, but Harmonia needs to balance with CHI '22 finding

**What doesn't apply:**
- Women-first messaging is not relevant to Harmonia's contact exchange model
- Swipe mechanic is the opposite of Harmonia's forced-choice — swiping enables avoidance behaviour
- Unlimited browse pool — Harmonia's pool is pre-filtered and finite

**Specific interaction patterns worth adapting:**
- Interest/trait badge pills for personality display ("You're both spontaneous" as a green pill badge rather than a radar point)
- Vertical scroll within a profile card for progressive personality disclosure — maps to Harmonia's "tap to expand personality" mechanic
- Trust/verification badge treatment for DNA kit status on Phase 3 cards

## Visual Notes

- **Card dimensions:** Full-screen mobile, photo fills most of viewport. Rounded corners on web version (~16px radius).
- **Colour usage:** Yellow (#FFD400) brand primary. White text on photos. Clean light backgrounds for non-photo content. Soft grey backgrounds for info sections.
- **Typography:** Large (28px+) bold name, medium (16px) grey descriptors. Interest badges in small 13px pills.
- **Animation:** Smooth card swipe with elastic return if not swiped far enough. Match screen: confetti-style particle burst.
