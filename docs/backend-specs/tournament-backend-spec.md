# Tournament Backend Spec — Phase 2 & 3

## Overview

The tournament is a forced-choice comparison system using an adapted Elo algorithm (CurmElo: Sankaran et al. 2021). Users see pairs of candidates and choose who they'd rather meet. A candidate becomes a confirmed match after receiving 3 hearts (chosen 3 times).

## Algorithm

### MetaFBP — Mutual Pool Construction

Before the tournament begins, MetaFBP builds a pool of mutually compatible candidates:

1. Run user's visual model against all opposite-orientation, compatible-preference users
2. Predict mutual attraction score using calibration data
3. Include candidates with predicted score ≥ 3.5 (fallback: ≥ 3.0 if pool < 6)
4. Minimum pool size: 6 candidates

### CurmElo Rating System

Constants:
- K = 20 (rating adjustment per comparison)
- R0 = 1000 (starting rating)
- RD = 400 (rating difference scale)

Formula:
- expected = 1 / (1 + 10^((loser_elo - winner_elo) / RD))
- new_winner_elo = winner_elo + K * (1 - expected)
- new_loser_elo = loser_elo + K * (0 - (1 - expected))

Heart accumulation:
- Each time a candidate is chosen as winner: heartCount += 1
- heartCount reaches 3 → matchConfirmed = true
- Pass both: heartCount unchanged, nComparisons += 1 for both

---

## Endpoints

### GET /api/v1/tournament/pool
Returns the user's mutual match pool.

**Response:**
```json
{
  "poolSufficient": true,
  "candidates": [
    {
      "id": "cand-001",
      "userId": "user-002",
      "displayName": "James",
      "age": 30,
      "location": "London, UK",
      "photoUrl": "...",
      "eloRating": 1000,
      "heartCount": 0,
      "nComparisons": 0,
      "matchConfirmed": false,
      "hlaScore": null,
      "hlaDisplayTier": null,
      "perceivedSimilarity": { ... }
    }
  ]
}
```

**Phase 3 difference:** `hlaScore` and `hlaDisplayTier` are populated when DNA results are available.

---

### GET /api/v1/tournament/pairing
Returns the next pairing for the user. Server-side pairing selects candidates with fewest comparisons to ensure coverage.

**Response:**
```json
{
  "pairingId": "pair-abc123",
  "candidateA": { ... },
  "candidateB": { ... },
  "sessionId": "session-xyz"
}
```

---

### POST /api/v1/tournament/result
Submit the result of a comparison.

**Request:**
```json
{
  "pairingId": "pair-abc123",
  "winnerId": "cand-001",
  "timeToDecisionMs": 4200,
  "personalityViewedBeforeChoice": true,
  "personalityViewDurationMs": 8300,
  "personalityViewedFor": "a",
  "passBothExplanation": null,
  "sessionId": "session-xyz",
  "encounterNumber": 2
}
```

**For pass-both:** `winnerId: null`, `passBothExplanation: "string"`

**Response:**
```json
{
  "candidateANewElo": 1013,
  "candidateBNewElo": 987,
  "winnerNewHeartCount": 2,
  "matchConfirmed": false,
  "newMatch": null
}
```

When `matchConfirmed: true`:
```json
{
  "matchConfirmed": true,
  "newMatch": {
    "matchId": "match-001",
    "candidateId": "cand-001",
    "displayName": "James",
    "perceivedSimilarity": { ... }
  }
}
```

---

### GET /api/v1/tournament/state
Returns current tournament state (Elo rankings, heart counts, matches).

**Response:**
```json
{
  "sessionId": "session-xyz",
  "phase": "phase2",
  "totalComparisons": 12,
  "passBothsUsed": 1,
  "passBothsRemaining": 2,
  "candidates": [ ... ],
  "confirmedMatches": [ ... ],
  "isComplete": false
}
```

---

## Database Schema

### tournament_candidates
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| candidate_id | UUID | FK → users |
| elo_rating | INT | Default 1000 |
| heart_count | INT | 0-3, default 0 |
| n_comparisons | INT | Default 0 |
| match_confirmed | BOOLEAN | Default false |
| hla_score | FLOAT | Null for Phase 2 |
| hla_display_tier | ENUM | strong/good/some/hidden |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### tournament_comparisons
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| session_id | UUID | FK → sessions |
| user_id | UUID | FK → users |
| candidate_a_id | UUID | |
| candidate_b_id | UUID | |
| winner_id | UUID | Null for pass-both |
| time_to_decision_ms | INT | |
| personality_viewed_before_choice | BOOLEAN | |
| personality_view_duration_ms | INT | Null if not viewed |
| personality_viewed_for | ENUM | a/b/both/neither |
| pass_both_explanation | TEXT | Null if not pass |
| encounter_number | INT | nth time seeing winner |
| timestamp | TIMESTAMP | |

### confirmed_matches
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| match_id | UUID | Shared between both users |
| user_a_id | UUID | FK → users |
| user_b_id | UUID | FK → users |
| elo_at_confirmation | INT | Winner's Elo when confirmed |
| total_comparisons_a | INT | How many times A chose B |
| perceived_similarity_score | FLOAT | |
| hla_score | FLOAT | Null for Phase 2 |
| confirmed_at | TIMESTAMP | |
| contact_exchanged | BOOLEAN | Default false |

---

## Pass-Both Rules

- Maximum 3 pass-both per session
- Both candidates' nComparisons increment
- Elo ratings unchanged
- Explanation text stored for research analysis
- After 3 passes used: UI disables the pass-both button; user must choose

---

## Phase 3 Additions

When a user has DNA results uploaded:
- `hlaScore` (0-100) added to each candidate pairing
- `hlaDisplayTier` ('strong'|'good'|'some'|'hidden') computed server-side
- HLA display tier thresholds: strong ≥75, good ≥50, some ≥25, hidden <25

---

## Research Data Collection

All comparison events are stored with:
- Decision time (reaction time analysis)
- Personality panel view events (did visual info change selection?)
- Encounter number (does familiarity increase or decrease preference?)
- Session metadata (time of day, device type)

This data feeds the Phase 2 Insights Report via `/api/v1/insights/phase2`.
