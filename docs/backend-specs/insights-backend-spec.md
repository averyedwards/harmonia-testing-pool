# Insights Backend Spec

## Overview

Read-only personalised reports generated per user per phase. Reports are computed server-side once sufficient data exists and cached. Covers three reports: Phase 1 (Calibration), Phase 2 (Tournament), Phase 3 (Full).

---

## Report Availability Rules

| Report | Unlocks When |
|--------|-------------|
| Phase 1 | `calibration_complete = true` AND ≥15 face ratings |
| Phase 2 | At least one confirmed match AND ≥10 tournament comparisons |
| Phase 3 | Phase 3 is active for the user (`phase IN ('phase3', 'complete')`) |

---

## API Endpoints

### GET /api/v1/insights/phase1
Returns the Phase 1 calibration insights report for the authenticated user.

**Response:**
```json
{
  "userId": "user-001",
  "generatedAt": "2026-03-14T08:00:00Z",
  "calibrationStats": {
    "facesRated": 47,
    "avgRating": 3.2,
    "qualityScore": 87
  },
  "ratingDistribution": {
    "1": 4, "2": 9, "3": 18, "4": 12, "5": 4
  },
  "ratingSpreadLabel": "Good spread across ratings",
  "visualPreferences": {
    "summary": "You tend to prefer faces that convey warmth...",
    "traits": [
      {
        "label": "Open Expression",
        "direction": "positive",
        "percentEffect": 72,
        "description": "You rated people with open, warm expressions higher on average"
      }
    ]
  },
  "personalityProfile": {
    "qualityTier": "HIGH",
    "sins": {
      "wrath": 0.15, "sloth": 0.35, "pride": 0.12,
      "lust": 0.4, "greed": 0.18, "gluttony": 0.28, "envy": 0.22
    },
    "communityAverage": {
      "wrath": 0.25, "sloth": 0.30, "pride": 0.20,
      "lust": 0.35, "greed": 0.25, "gluttony": 0.30, "envy": 0.28
    }
  },
  "sinPositions": [
    {
      "sin": "wrath",
      "userPercentile": 23,
      "label": "You are less confrontational than most participants",
      "position": "low"
    }
  ]
}
```

---

### GET /api/v1/insights/phase2
Returns Phase 2 tournament insights.

**Response:**
```json
{
  "userId": "user-001",
  "generatedAt": "2026-03-19T08:00:00Z",
  "tournamentStats": {
    "totalComparisons": 47,
    "matchRate": 0.22,
    "avgHeartsBefore": 2.1,
    "topEloRank": 3
  },
  "personalityInfluence": [
    {
      "sin": "wrath",
      "effectLabel": "Conflict avoidance predicted attraction",
      "effectStrength": 0.71,
      "direction": "positive"
    }
  ],
  "crossPhaseComparison": {
    "calibrationAvgAttraction": 3.2,
    "tournamentAvgAttraction": 3.8,
    "shift": "+0.6",
    "interpretation": "Personality context raised your average attraction rating"
  },
  "eloRankings": [
    {
      "candidateId": "cand-001",
      "displayName": "Noah",
      "age": 28,
      "eloRating": 1240,
      "heartCount": 3,
      "matched": true
    }
  ],
  "confirmedMatches": [
    {
      "matchId": "match-001",
      "candidateId": "user-008",
      "displayName": "Noah",
      "confirmedAt": "2025-12-01T10:00:00Z",
      "heartCount": 3,
      "perceivedSimilarityTier": "strong_fit"
    }
  ]
}
```

---

### GET /api/v1/insights/phase3
Extends Phase 2 insights with genetics signal and post-meetup outcomes.

**Additional fields beyond Phase 2:**
```json
{
  "geneticsInfluence": {
    "avgHlaScore": 68,
    "hlaEloCorrelation": 0.43,
    "interpretation": "Higher immune gene dissimilarity correlated with stronger Elo preference"
  },
  "preferenceJourney": [
    { "phase": "calibration", "avgAttraction": 3.2 },
    { "phase": "tournament", "avgAttraction": 3.8 },
    { "phase": "genetics", "avgAttraction": 4.1 }
  ],
  "wemetOutcomes": [
    {
      "matchId": "match-001",
      "didMeet": true,
      "interestScore": 6,
      "orientation": "long_term"
    }
  ]
}
```

---

## Computation Logic

### Visual Preference Traits (Phase 1)

Visual preferences are computed by a linear regression on the face attribute annotations × user ratings:

```
effect_size = mean(ratings | trait_present) - mean(ratings | trait_absent)
percent_effect = round(effect_size / overall_mean * 100)
```

Traits with |percent_effect| ≥ 10% are surfaced. Positive = higher ratings when present, negative = lower ratings.

### Sin Position Percentiles (Phase 1)

Each user's sin score is compared against the population distribution:

```
percentile = cdf(user_score, population_scores) * 100
```

Labels:
- ≥75th percentile → "high" (e.g., "You are more confrontational than most")
- ≤25th percentile → "low" (e.g., "You are less confrontational than most")
- 26-74 → "mid" → not surfaced

### Personality Influence on Elo (Phase 2)

For each sin, compute Spearman's rank correlation between the user's sin score overlap with each candidate and their final Elo rating. Surface correlations where |ρ| ≥ 0.35.

### HLA–Elo Correlation (Phase 3)

Compute Pearson's r between `hla_score` and `elo_rating` across the user's tournament candidate pool. Threshold |r| ≥ 0.30 to surface the finding.

---

## Caching Strategy

| Report | Cache TTL | Invalidated By |
|--------|-----------|---------------|
| Phase 1 | 24 hours | New calibration ratings |
| Phase 2 | 1 hour | New tournament comparison or match |
| Phase 3 | 1 hour | New we-met survey response |

Cache key: `insights:{userId}:phase{1|2|3}`

Use Redis with `SET … EX`. On invalidation: `DEL insights:{userId}:phase{n}`.

Reports are regenerated lazily on next GET request after cache miss.

---

## Privacy

- Reports are user-scoped; no cross-user data is returned
- Candidates are shown by display name only (no email, no full profile)
- HLA data is only included in Phase 3 reports when the user's kit has been processed
