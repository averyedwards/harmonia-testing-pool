# Match & Post-Match Backend Spec

## Overview

Covers two flows after a mutual Elo match is confirmed:
1. **Contact Exchange** — blind, double-opt-in submission of contact details
2. **We Met Survey** — voluntary post-meetup feedback

---

## Contact Exchange

### Design Principles
- **Blind submission**: each party submits independently; neither sees the other's choice until both have submitted
- **No one-way reveal**: if only one party submits, no contact is shared
- **Prefer-not-to-share is valid**: selecting this option completes the user's submission; the pair gets no contact
- **Immutable once submitted**: users cannot change their contact choice after submitting

### Contact Types
```typescript
type ContactType = 'phone' | 'instagram' | 'email' | 'prefer_not_to_share'
```

---

### Database Schema

```sql
CREATE TABLE contact_submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id     UUID NOT NULL REFERENCES confirmed_matches(id),
  user_id      UUID NOT NULL REFERENCES users(id),
  contact_type TEXT NOT NULL CHECK (contact_type IN ('phone','instagram','email','prefer_not_to_share')),
  contact_value TEXT,          -- NULL when prefer_not_to_share
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (match_id, user_id)   -- one submission per user per match
);

-- View: resolved contact pairs (used when both parties have submitted)
CREATE VIEW contact_exchanges AS
SELECT
  m.id AS match_id,
  sa.user_id AS user_a_id,
  sa.contact_type AS user_a_type,
  sa.contact_value AS user_a_value,
  sb.user_id AS user_b_id,
  sb.contact_type AS user_b_type,
  sb.contact_value AS user_b_value,
  GREATEST(sa.submitted_at, sb.submitted_at) AS resolved_at
FROM confirmed_matches m
JOIN contact_submissions sa ON sa.match_id = m.id
JOIN contact_submissions sb ON sb.match_id = m.id AND sb.user_id != sa.user_id
WHERE sa.user_id = m.user_a_id;
```

---

### API Endpoints

#### GET /api/v1/matches/:matchId
Returns match details for the authenticated user.

**Response:**
```json
{
  "matchId": "match-001",
  "candidateUserId": "user-008",
  "displayName": "Noah",
  "age": 28,
  "location": "London, UK",
  "confirmedAt": "2025-12-01T10:00:00Z",
  "heartCount": 3,
  "hlaScore": 82,
  "hlaDisplayTier": "strong",
  "perceivedSimilarity": { "tier": "strong_fit", "overlapCount": 6, "headline": "Strong personality match!", "sharedTraits": [...] },
  "contactExchanged": false,
  "mySubmissionStatus": "pending"
}
```

`mySubmissionStatus`: `"pending"` | `"submitted"` | `"resolved"`
- `pending` — user hasn't submitted yet
- `submitted` — user submitted but partner hasn't yet
- `resolved` — both submitted; contact (if any) is now available

---

#### POST /api/v1/matches/:matchId/contact
Submit contact preference. **Idempotent** — submitting twice returns 200 with existing submission.

**Request:**
```json
{
  "contactType": "instagram",
  "contactValue": "@noahsmith"
}
```

`contactValue` is omitted when `contactType = "prefer_not_to_share"`.

**Response:**
```json
{
  "status": "submitted",
  "resolved": false,
  "partnerContactType": null,
  "partnerContactValue": null
}
```

When both parties have submitted (`resolved: true`):
```json
{
  "status": "resolved",
  "resolved": true,
  "partnerContactType": "phone",
  "partnerContactValue": "+44 7911 123456"
}
```

If either party chose `prefer_not_to_share`:
```json
{
  "status": "resolved",
  "resolved": true,
  "partnerContactType": "prefer_not_to_share",
  "partnerContactValue": null
}
```

**Side effects on resolution:**
- Trigger `match_confirmed` notification for each party with their partner's contact
- Write resolution timestamp to `contact_submissions`

---

#### GET /api/v1/matches
Returns all confirmed matches for the authenticated user.

**Response:**
```json
{
  "matches": [
    {
      "matchId": "match-001",
      "displayName": "Noah",
      "age": 28,
      "confirmedAt": "2025-12-01T10:00:00Z",
      "heartCount": 3,
      "contactExchanged": true,
      "surveyComplete": false
    }
  ]
}
```

---

## We Met Survey

### Design Principles
- Anonymous — responses not linked to the individual in downstream analysis
- Voluntary — users can skip indefinitely
- No reverse-engineering — aggregated only; individual responses never shown to partners
- Q3 (orientation) only shown if interest score ≥4

### Survey Questions

| Q | Question | Field | Type |
|---|----------|-------|------|
| 1 | Did you meet up with your match? | `did_meet` | boolean |
| 2 | How interested are you in seeing them again? (1–7) | `interest_score` | int |
| 3 | What kind of connection are you open to? | `orientation` | 'short_term' \| 'long_term' |

Q2 and Q3 are skipped if `did_meet = false`.

---

### Database Schema

```sql
CREATE TABLE we_met_surveys (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id         UUID NOT NULL REFERENCES confirmed_matches(id),
  respondent_id    UUID NOT NULL REFERENCES users(id),
  did_meet         BOOLEAN NOT NULL,
  interest_score   SMALLINT CHECK (interest_score BETWEEN 1 AND 7),
  orientation      TEXT CHECK (orientation IN ('short_term', 'long_term')),
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (match_id, respondent_id)
);
```

---

### API Endpoints

#### POST /api/v1/survey/we-met
Submit survey response. **Idempotent** — second submission returns 200 with existing data.

**Request:**
```json
{
  "matchId": "match-001",
  "didMeet": true,
  "interestScore": 6,
  "orientation": "long_term"
}
```

**Response:** `204 No Content`

**Side effects:**
- Mark survey as complete for this user/match pair
- Trigger `insights_ready` notification if Phase 2 insights not yet sent
- Invalidate `insights:userId:phase2` and `insights:userId:phase3` cache

---

#### GET /api/v1/survey/we-met/:matchId
Check if the current user has completed the survey for a given match.

**Response:**
```json
{
  "completed": true,
  "submittedAt": "2026-03-22T14:00:00Z"
}
```

---

## Research Data Notes

Survey responses are anonymised for research:
- `respondent_id` is pseudonymised via a per-study HMAC (`sha256(respondent_id + STUDY_SALT)`)
- The `match_id` in exports is similarly pseudonymised
- Raw user IDs are never included in research exports
- Aggregated only in publications (n ≥ 5 for any reported subgroup)
