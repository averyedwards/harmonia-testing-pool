# Admin Backend Spec

## Overview

Admin-only API surface for managing the testing pool. Covers: phase transitions, user management, DNA kit pipeline, dataset export, and aggregate statistics. All endpoints require `role = 'admin'`.

---

## Authentication & Guard

Every admin endpoint must verify `user.role === 'admin'` server-side. A 403 response is returned for non-admins regardless of client state.

```typescript
// Middleware applied to all /api/v1/admin/* routes
async function requireAdmin(req: Request) {
  const session = await getSession(req)
  if (!session || session.user.role !== 'admin') {
    throw new Response('Forbidden', { status: 403 })
  }
}
```

---

## Dashboard Stats

### GET /api/v1/admin/stats

**Response:**
```json
{
  "totalUsers": 147,
  "maleCount": 71,
  "femaleCount": 72,
  "nonBinaryCount": 4,
  "londonCount": 89,
  "globalCount": 58,
  "byPhase": {
    "onboarding": 8,
    "phase1": 24,
    "between_1_2": 18,
    "phase2": 61,
    "between_2_3": 14,
    "phase3": 19,
    "complete": 3
  },
  "completionRates": {
    "onboarding": 0.95,
    "questionnaire": 0.88,
    "calibration": 0.82,
    "tournament": 0.71,
    "weMet": 0.43
  },
  "dnaKits": {
    "ordered": 89,
    "dispatched": 71,
    "received": 58,
    "processed": 44,
    "failed": 3
  },
  "genderRatio": {
    "balanced": true,
    "malePercent": 48.3,
    "femalePercent": 48.9,
    "otherPercent": 2.7
  }
}
```

---

## Phase Management

### GET /api/v1/admin/phase/readiness

Returns readiness checks for Phase 2 and Phase 3 transitions.

**Response:**
```json
{
  "phase2": {
    "ready": false,
    "usersReady": 89,
    "usersTotal": 147,
    "blockers": [
      "58 users have not completed calibration",
      "Minimum pool size (50) not yet reached for global cohort"
    ]
  },
  "phase3": {
    "ready": true,
    "kitsProcessed": 44,
    "kitsTotal": 89,
    "londonUsersReady": 38,
    "blockers": []
  }
}
```

---

### POST /api/v1/admin/phase/transition

Advance all users (or a cohort) to the next phase.

**Request:**
```json
{
  "targetPhase": "phase2",
  "cohort": "all"
}
```

`cohort`: `"all"` | `"london"` | `"global"`

**Behaviour:**
1. Validate readiness checks (fail if critical blockers exist, unless `force: true`)
2. Update `users.current_phase` in a transaction
3. Enqueue `phase_transition` notifications for all affected users
4. Log the transition event to `admin_audit_log`

**Response:**
```json
{
  "usersAdvanced": 89,
  "notificationsQueued": 89,
  "transitionId": "trans-uuid"
}
```

---

### POST /api/v1/admin/phase/force-user

Force a single user to a specific phase (for testing/QA).

**Request:**
```json
{
  "userId": "user-001",
  "phase": "phase3"
}
```

**Response:** `204 No Content`

---

## User Management

### GET /api/v1/admin/users

Paginated user list with filter support.

**Query params:**
- `phase` — filter by current phase
- `isLondon` — `true` / `false`
- `role` — `"user"` / `"admin"`
- `q` — full-text search on name/email
- `limit` (default 50)
- `offset` (default 0)

**Response:**
```json
{
  "users": [
    {
      "id": "user-001",
      "displayName": "Alex Morgan",
      "email": "alex.morgan@gmail.com",
      "gender": "female",
      "age": 26,
      "isLondon": true,
      "currentPhase": "phase2",
      "calibrationComplete": true,
      "questionnaireComplete": true,
      "role": "user",
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ],
  "total": 147,
  "limit": 50,
  "offset": 0
}
```

---

### GET /api/v1/admin/users/:userId

Single user detail with full profile.

---

### PATCH /api/v1/admin/users/:userId

Admin-only user edits (phase override, role change, etc.)

**Request:**
```json
{
  "currentPhase": "phase2",
  "role": "admin"
}
```

**Response:** Updated user object

---

### DELETE /api/v1/admin/users/:userId

Soft-delete (sets `deleted_at`). All personal data is anonymised per GDPR.

**Response:** `204 No Content`

---

## DNA Kit Pipeline

### GET /api/v1/admin/kits

Returns all DNA kit records.

**Query params:** `status` filter (`ordered|dispatched|received|processed|failed`)

**Response:**
```json
{
  "kits": [
    {
      "kitId": "kit-001",
      "userId": "user-001",
      "displayName": "Alex Morgan",
      "status": "processed",
      "orderedAt": "2026-03-02T10:00:00Z",
      "dispatchedAt": "2026-03-05T14:00:00Z",
      "receivedAt": "2026-03-12T09:00:00Z",
      "processedAt": "2026-03-19T11:00:00Z",
      "trackingCode": "RM123456789GB"
    }
  ],
  "total": 89
}
```

---

### PATCH /api/v1/admin/kits/:kitId

Update kit status. Triggers user notification on status change.

**Request:**
```json
{
  "status": "dispatched",
  "trackingCode": "RM123456789GB"
}
```

**Side effects:**
- `dispatched` → send `kit_status_update` notification to user
- `processed` → compute HLA scores; make Phase 3 tournament data available for user

---

## Dataset Export

### POST /api/v1/admin/export

Generate anonymised research dataset export.

**Request:**
```json
{
  "datasets": ["calibration_ratings", "tournament_comparisons", "we_met_surveys"],
  "anonymise": true,
  "format": "csv"
}
```

**Available datasets:**
| Dataset | Contains |
|---------|---------|
| `user_profiles` | Age, gender, orientation, personality scores (no PII) |
| `calibration_ratings` | Face ratings with pseudonymised user IDs |
| `tournament_comparisons` | Elo comparison records |
| `confirmed_matches` | Match pairs with compatibility scores |
| `we_met_surveys` | Post-meetup outcomes |
| `hla_scores` | HLA compatibility scores per match pair |

**Anonymisation:**
- User IDs replaced with stable pseudonyms: `sha256(userId + EXPORT_SALT)`
- Names, emails, phone numbers, photos are excluded
- All timestamps rounded to nearest day

**Response:**
```json
{
  "exportId": "export-uuid",
  "status": "queued",
  "estimatedReadyAt": "2026-03-23T10:05:00Z"
}
```

Export is generated asynchronously. Poll `GET /api/v1/admin/export/:exportId` for status, then download via presigned S3 URL.

---

## Audit Log

All admin actions are written to `admin_audit_log`:

```sql
CREATE TABLE admin_audit_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     UUID NOT NULL REFERENCES users(id),
  action       TEXT NOT NULL,
  target_type  TEXT,           -- 'user', 'kit', 'phase', etc.
  target_id    TEXT,
  payload      JSONB,
  ip_address   INET,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Retained for 2 years. Never deleted, only appended.

---

## Gender Ratio

### GET /api/v1/admin/gender-ratio

**Response:**
```json
{
  "overall": {
    "male": 71, "female": 72, "nonBinary": 4, "total": 147,
    "malePercent": 48.3, "femalePercent": 49.0, "otherPercent": 2.7,
    "balanced": true
  },
  "london": {
    "male": 43, "female": 44, "nonBinary": 2, "total": 89,
    "malePercent": 48.3, "femalePercent": 49.4, "balanced": true
  },
  "global": {
    "male": 28, "female": 28, "nonBinary": 2, "total": 58,
    "malePercent": 48.3, "femalePercent": 48.3, "balanced": true
  }
}
```

Balance threshold: ±5 percentage points from 50/50 is considered balanced.
