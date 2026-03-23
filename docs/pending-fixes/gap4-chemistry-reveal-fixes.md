# ChemistryReveal — Pending Fixes
These are deviations from the original specification that need correcting.
Do not close this file until all five items are resolved and committed.

## Fix 1: Tier copy does not match specification
**File:** `src/components/tournament/ChemistryReveal.tsx`
**Problem:** The user-facing copy was improvised during implementation.
The exact wording matters because Felix's research team will see this
language during user testing.
**Required copy per tier:**

strong (score >= 75):
  heading: "Exceptional chemistry"
  description: "Your chemistry is off the charts. Your genetic profiles
    complement each other in ways that go beyond the visible."
  detail: "Strong genetic compatibility is linked to greater immune system
    diversity, which research suggests plays a role in natural attraction."

good (score 50-74):
  heading: "Good chemistry"
  description: "Good chemistry here. Your genetic profiles have meaningful
    compatibility that could enhance your connection."
  detail: "Genetic compatibility adds a layer of natural attraction that
    goes beyond what you can see or sense consciously."

some (score 25-49):
  heading: "Some chemistry"
  description: "Some chemistry detected. Genetic compatibility is just
    one piece of the puzzle."
  detail: "Chemistry is one of three signals. Visual attraction and
    personality often matter more in the early stages of connection."

**Action:** Open ChemistryReveal.tsx, compare each tier's heading,
description, and detail text against the above. Replace any that differ.

---

## Fix 2: Close mechanism — "tap anywhere" should be X button + Escape
**File:** `src/components/tournament/ChemistryReveal.tsx`
**Problem:** The current implementation uses "tap anywhere to close" which
can accidentally dismiss the panel while users are reading. The spec calls
for an explicit X close button (top-right corner) plus Escape key to close.
**Required behaviour:**
- X button (lucide-react X icon) positioned top-right of the panel
- closeButtonRef auto-focused on mount via useEffect
- Escape key listener (useEffect with keydown → handleClose)
- "Tap anywhere to close" footer text should be REMOVED
- The backdrop/overlay outside the panel should NOT close it
  (users need to explicitly tap X or press Escape)

**Action:** Check if X button and Escape handler exist. If "tap anywhere"
is the only close mechanism, replace it with the X button + Escape pattern
from PersonalityReveal.

---

## Fix 3: GeneticsIndicator expanded variant label
**File:** `src/components/tournament/GeneticsIndicator.tsx`
**Problem:** The expanded variant currently shows "{score}% signal" as its
label. The spec says expanded should show the score alongside the tier
label from HLA_DISPLAY_TIERS in constants (e.g., "Strong chemistry signal"
not "78% signal").

**Action:** Check what the expanded variant renders. It should show the
tier's displayLabel from HLA_DISPLAY_TIERS (defined in src/lib/constants.ts)
rather than a raw percentage with "signal" suffix.

---

## Fix 4: Chemistry bar width calculation
**File:** `src/components/tournament/ChemistryReveal.tsx`
**Problem:** The implementation normalises the score from the 25-100 range
down to 0-100 (so score 25 maps to 0% width, score 100 maps to 100%).
The spec says width should equal the raw score percentage. A score of 38
should show as 38% bar width, not ~17%.

**Action:** Find the bar width calculation. If it does something like
`(score - 25) / 75 * 100`, replace it with `Math.min(100, Math.max(0, score))`.
The bar should simply be `style={{ width: '${score}%' }}`.

---

## Fix 5: PersonalityReveal still missing reportedRef guard
**File:** `src/components/tournament/PersonalityReveal.tsx`
**Problem:** ChemistryReveal correctly implements the reportedRef pattern
to prevent double-reporting of view duration. PersonalityReveal does NOT
have this guard, which means it fires onViewDuration twice (once on
explicit close, once on unmount cleanup). This corrupts analytics data.

**Action:** Add the same reportedRef pattern from ChemistryReveal:
- Add `const reportedRef = useRef(false)`
- In handleClose: check `if (reportedRef.current) return`, then set true
- In unmount cleanup: check `if (reportedRef.current) return`, then set true
- Both paths calculate duration from openTimeRef and call onViewDuration

---

## After all fixes
```
git add -A
git commit -m "fix: ChemistryReveal spec compliance — copy, close UX, bar calc, PersonalityReveal guard"
git push origin main
```
