# Dashboard Backend Spec

## Overview

Single aggregation endpoint that returns all state needed to render the user dashboard. Results are cached in Redis (60s TTL) to reduce database load during high-traffic periods.

---

## Endpoint

```
GET /api/v1/dashboard
Authorization: Bearer <access_token>
```

### Response

```json
{
  "user": {
    "id": "user-001",
    "firstName": "Alex",
    "currentPhase": "phase2",
    "isLondon": true,
    "calibrationComplete": true,
    "questionnaireComplete": true,
    "onboardingStep": 7
  },
  "phase": {
    "current": "phase2",
    "communityCalibrationRate": 0.73,
    "dnaResultsRate": 0.375,
    "totalUsers": 247,
    "londonUsers": 112
  },
  "matches": [
    {
      "matchId": "match-001",
      "partnerId": "user-008",
      "partnerFirstName": "Noah",
      "partnerAge": 28,
      "similarityHeadline": "Strong personality match!",
      "contactExchanged": true,
      "confirmedAt": "2025-12-01T14:22:00Z"
    }
  ],
  "notifications": {
    "unreadCount": 4,
    "top3": [...]
  },
  "kitStatus": {
    "status": "dispatched",
    "expectedDelivery": "2026-03-25"
  },
  "insights": {
    "phase1Available": true,
    "phase2Available": true,
    "phase3Available": false,
    "latestPreviewPhase": "phase2",
    "previewStat": "31%",
    "previewStatLabel": "personality shift",
    "previewText": "..."
  }
}
```

---

## Phase Logic

```python
def determine_system_phase(db) -> str:
    """
    System phase is set by admin action (not computed).
    Stored in settings table.
    """
    return db.query("SELECT value FROM settings WHERE key = 'current_phase'").scalar()

def determine_user_phase(user_id: str, system_phase: str, db) -> str:
    """
    User phase can trail the system phase if they haven't completed prerequisites.
    """
    user = db.query(User).filter(User.id == user_id).first()

    if system_phase == 'phase2':
        if not user.calibration_complete or not user.questionnaire_complete:
            return 'phase1'  # still in calibration

    if system_phase == 'phase3':
        if not user.is_london:
            return 'between_2_3'  # global users wait
        if not user.dna_results_uploaded:
            return 'between_2_3'  # London users wait for results

    return system_phase
```

---

## Community Stats SQL

```sql
-- Calibration completion rate
SELECT
  COUNT(CASE WHEN calibration_complete = true THEN 1 END)::float /
  NULLIF(COUNT(*), 0) AS calibration_rate
FROM users
WHERE onboarding_step >= 6
  AND current_phase != 'onboarding';

-- DNA results progress (London only)
SELECT
  COUNT(CASE WHEN dna_results_uploaded = true THEN 1 END) AS results_uploaded,
  COUNT(*) AS total_london
FROM users
WHERE is_london = true
  AND onboarding_step = 7;

-- Users by phase
SELECT current_phase, COUNT(*) as count
FROM users
GROUP BY current_phase;
```

---

## Redis Caching

```python
CACHE_TTL = 60  # seconds

def get_dashboard(user_id: str, db, redis):
    cache_key = f"dashboard:{user_id}"
    cached = redis.get(cache_key)
    if cached:
        return json.loads(cached)

    data = build_dashboard_response(user_id, db)
    redis.setex(cache_key, CACHE_TTL, json.dumps(data))
    return data

def invalidate_dashboard(user_id: str, redis):
    """Call after any user action that changes dashboard state."""
    redis.delete(f"dashboard:{user_id}")
```

### Invalidation triggers

| Event | Action |
|---|---|
| Match confirmed | Invalidate both users' caches |
| Phase transition (admin) | Invalidate all user caches (`dashboard:*`) |
| Calibration completed | Invalidate requesting user's cache |
| DNA results uploaded | Invalidate London user's cache |
| Notification read | Invalidate requesting user's cache |

---

## Matches Aggregation

Matches are returned for the requesting user only. Partner details (firstName, age) are joined from the users table. Only confirmed matches (`heart_count = 3`) are included.

```sql
SELECT
  m.match_id,
  u.id AS partner_id,
  u.first_name AS partner_first_name,
  u.age AS partner_age,
  m.similarity_headline,
  m.contact_exchanged,
  m.confirmed_at
FROM matches m
JOIN users u ON (
  CASE WHEN m.user_a_id = :user_id THEN m.user_b_id ELSE m.user_a_id END = u.id
)
WHERE (m.user_a_id = :user_id OR m.user_b_id = :user_id)
  AND m.heart_count = 3
ORDER BY m.confirmed_at DESC
LIMIT 5;
```
