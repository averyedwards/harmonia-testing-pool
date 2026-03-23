# Genetics Backend Spec

## Overview

HLA (Human Leukocyte Antigen) compatibility is the third signal added in Phase 3, alongside visual and personality.

- **London only** — 200 DNA kits distributed to London participants (MyHeritage cheek swab)
- **Informational only** — HLA score never blocks a match or overrides Elo ranking
- **Scores below 25 are never shown** — `hidden` tier is suppressed in all frontend rendering
- **Encrypted at rest** — Harmonia stores Fernet-encrypted HLA alleles only; raw genetic data stays with MyHeritage
- **Fernet key** — stored in `FERNET_KEY` env var (Railway → GCP Secret Manager after migration)

---

## Display Tiers

Sourced from `HLA_DISPLAY_TIERS` in `src/lib/constants.ts`.

| Score range | `displayTier` | `displayLabel` | Colour |
|-------------|---------------|----------------|--------|
| ≥ 75 | `strong` | Strong chemistry signal | `#4CAF50` (green) |
| 50 – 74 | `good` | Good chemistry | `#FF9800` (amber) |
| 25 – 49 | `some` | Some chemistry | `#9E9E9E` (neutral) |
| < 25 | `hidden` | _(never displayed)_ | — |

The frontend reads `hlaScore` and `hlaDisplayTier` from the tournament candidate object. It renders nothing when `hlaDisplayTier === 'hidden'` or when either field is `null`.

---

## Scoring Formula

```
S_bio = (N_unique / N_total) × 100

N_unique = number of unique alleles across both users' combined allele pool
N_total  = 3 loci × 2 alleles × 2 users = 12
```

**Worked example:**

| Locus | User A | User B |
|-------|--------|--------|
| HLA-A | A\*01:01, A\*02:01 | A\*02:01, A\*03:01 |
| HLA-B | B\*08:01, B\*07:02 | B\*15:01, B\*07:02 |
| HLA-DRB1 | DRB1\*15:01, DRB1\*03:01 | DRB1\*04:01, DRB1\*03:01 |

Combined pool (12 alleles): A\*01:01, A\*02:01, A\*02:01, A\*03:01, B\*08:01, B\*07:02, B\*15:01, B\*07:02, DRB1\*15:01, DRB1\*03:01, DRB1\*04:01, DRB1\*03:01

Unique alleles: A\*01:01, A\*02:01, A\*03:01, B\*08:01, B\*07:02, B\*15:01, DRB1\*15:01, DRB1\*03:01, DRB1\*04:01 → **9 unique**

```
S_bio = (9 / 12) × 100 = 75  →  displayTier: "strong"
```

---

## WtM Weight Redistribution

Sourced from `WTM_WEIGHTS` and `WTM_WEIGHTS_NO_HLA` in `src/lib/constants.ts`.

| Condition | Visual | Personality | Genetics |
|-----------|--------|-------------|----------|
| Both users have HLA data | 60% | 30% | 10% |
| Either user lacks HLA data | 67% | 33% | 0% |

The tournament backend must check whether both candidates have `hlaScore !== null` before applying the genetics weight. If either is null, fall back to `WTM_WEIGHTS_NO_HLA`.

---

## Database Schema

```sql
CREATE TABLE hla_data (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) UNIQUE,
  encrypted_data        BYTEA NOT NULL,          -- Fernet-encrypted allele JSON
  source                VARCHAR(50) NOT NULL,     -- e.g. 'myheritage'
  imputation_confidence FLOAT,                    -- 0-1, null if direct genotyping
  snp_count             INTEGER,                  -- number of SNPs used
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
```

Kit status tracking (`waitlisted` → `confirmed` → `dispatched` → `received` → `results_uploaded`) uses the `kit_allocations` table defined in `onboarding-backend-spec.md`. The `KitStatus` type is defined in `src/types/index.ts`.

---

## API Endpoints

### GET /api/v1/hla/status/{user_id}

Returns kit and results status for a user. Called by the dashboard and Phase 3 gate.

**Response:**
```json
{
  "userId": "user-014",
  "isLondon": true,
  "kitStatus": "results_uploaded",
  "confirmedAt": "2026-03-08T10:00:00Z",
  "dispatchedAt": "2026-03-10T16:00:00Z",
  "receivedAt": "2026-03-18T09:00:00Z",
  "resultsUploadedAt": "2026-03-20T14:30:00Z",
  "phase3Eligible": true
}
```

`phase3Eligible` is `true` when `kitStatus === "results_uploaded"` AND the system phase is `phase3`.

Non-London users receive:
```json
{
  "userId": "user-099",
  "isLondon": false,
  "kitStatus": null,
  "phase3Eligible": false
}
```

---

### GET /api/v1/hla/compatibility/{user_a_id}/{user_b_id}

Returns the HLA compatibility score between two users. Called by the tournament backend during Phase 3 pairing to attach `hlaScore` and `hlaDisplayTier` to each `TournamentCandidate`.

**Response (both users have data):**
```json
{
  "score": 82,
  "displayTier": "strong",
  "displayLabel": "Strong chemistry signal",
  "available": true
}
```

**Response (either user lacks data):**
```json
{
  "available": false
}
```

**Notes:**
- Response is symmetric — `(user_a, user_b)` and `(user_b, user_a)` return the same score
- Cache result in Redis under `hla:compat:{min_id}:{max_id}` with TTL matching the tournament session
- Scores are pre-computed when results are uploaded; this endpoint reads from cache, not compute-on-demand

---

### POST /api/v1/hla/admin/upload-results

Admin uploads processed HLA alleles for a user after MyHeritage returns results. Requires `role: admin`.

**Request:**
```json
{
  "userId": "user-014",
  "hlaAlleles": {
    "HLA-A": ["A*01:01", "A*02:01"],
    "HLA-B": ["B*08:01", "B*07:02"],
    "HLA-DRB1": ["DRB1*15:01", "DRB1*03:01"]
  },
  "source": "myheritage"
}
```

**Response:** `200 OK`

**Side effects:**
- Fernet-encrypt allele JSON before writing to `hla_data`
- Update `kit_allocations.status` to `'results_uploaded'`
- Pre-compute compatibility scores against all existing London users with data; write to Redis
- Send `kit_status_update` notification to user
- If system phase is already `phase3`, set `phase3Eligible = true` and send `phase_transition` notification

---

## Phase 3 Unlock Logic

The frontend gates `/tournament-phase3` on two conditions (see `src/app/(app)/tournament-phase3/page.tsx`):

1. System phase is `'phase3'` (admin-triggered via phase transition)
2. User's `kitStatus === 'results_uploaded'`

The backend must enforce the same check on all Phase 3 tournament pairing endpoints. A user with `phase3 = true` at the system level but `kitStatus !== 'results_uploaded'` must not receive Phase 3 pairings.

---

## Privacy

- Harmonia stores Fernet-encrypted HLA alleles only; the encryption key is never logged
- Raw genetic data (full SNP profile) stays with MyHeritage and is never transferred to Harmonia
- `FERNET_KEY` is stored in Railway env vars; rotated to GCP Secret Manager after Phase 3 launch
- HLA alleles are excluded from all research exports and pseudonymisation pipelines
- Compatibility scores derived from alleles may appear in anonymised research data after Phase 3 completes
