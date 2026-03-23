# Notifications Backend Spec

## Overview

In-app notification system. Delivers phase transition alerts, match events, survey reminders, and research updates. Push notifications (PWA) for mobile users.

---

## Notification Types

| Type | Trigger | Action URL |
|------|---------|------------|
| `phase_transition` | Admin advances phase | `/tournament` or `/tournament-phase3` |
| `match_confirmed` | Mutual 3-heart match confirmed | `/match/:matchId` |
| `calibration_reminder` | 7 days since onboarding, calibration incomplete | `/calibration` |
| `insights_ready` | Phase report generated | `/insights/phase1` etc. |
| `we_met_survey` | 5 days after contact exchange | `/survey/:matchId` |
| `community_update` | Milestone reached (e.g., 90% calibrated) | `/dashboard` |
| `kit_status_update` | DNA kit dispatched / received / results ready | `/settings` |

---

## Database Schema

```sql
CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN (
                 'phase_transition','match_confirmed','calibration_reminder',
                 'insights_ready','we_met_survey','community_update','kit_status_update'
               )),
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  action_url   TEXT,
  read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ           -- optional TTL
);

CREATE INDEX idx_notifications_user_unread ON notifications (user_id, read) WHERE NOT read;
CREATE INDEX idx_notifications_user_created ON notifications (user_id, created_at DESC);
```

---

## API Endpoints

### GET /api/v1/notifications
Returns notifications for the authenticated user, newest first.

**Query params:**
- `limit` (default: 30, max: 100)
- `offset` (default: 0)
- `unread_only` (boolean, default: false)

**Response:**
```json
{
  "notifications": [
    {
      "id": "notif-uuid",
      "type": "match_confirmed",
      "title": "You have a new match!",
      "body": "Someone matched with you.",
      "actionUrl": "/match/match-001",
      "read": false,
      "createdAt": "2026-03-16T14:30:00Z"
    }
  ],
  "unreadCount": 3,
  "total": 8
}
```

---

### PATCH /api/v1/notifications/:id/read
Mark a single notification as read.

**Response:** `204 No Content`

---

### POST /api/v1/notifications/mark-all-read
Mark all notifications for the authenticated user as read.

**Response:** `{ "updated": 3 }`

---

### DELETE /api/v1/notifications/:id
Delete a notification. Only the owning user may delete their own notifications.

**Response:** `204 No Content`

---

## Push Notifications (PWA)

### Subscription Flow
1. User visits app on mobile — browser prompts for push permission
2. On grant: client calls `POST /api/v1/push/subscribe` with `PushSubscription` object
3. Server stores subscription in `push_subscriptions` table

```sql
CREATE TABLE push_subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint    TEXT NOT NULL UNIQUE,
  p256dh      TEXT NOT NULL,
  auth        TEXT NOT NULL,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Sending Push Notifications
- Server uses Web Push Protocol (RFC 8030) via `web-push` npm package
- VAPID keys stored as env vars: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`
- Push payloads must be ≤4096 bytes

### Unsubscribe
`DELETE /api/v1/push/subscribe` — removes subscription for current device

---

## Server-Side Notification Creation

Notifications are created by server-side services, not by users. Examples:

```typescript
// When a match is confirmed
await createNotification({
  userId: userAId,
  type: 'match_confirmed',
  title: 'You have a new match!',
  body: `You and ${matchDisplayName} have chosen each other.`,
  actionUrl: `/match/${matchId}`,
})
```

### Automated Triggers (cron jobs)
| Job | Schedule | Action |
|-----|---------|--------|
| Calibration reminder | Daily 09:00 UTC | Notify users with 0 ratings after 7 days |
| We Met survey prompt | Daily 09:00 UTC | Notify users where 5+ days passed since contact exchange |
| Kit dispatched | On kit status change | Triggered by kit pipeline webhook |

---

## Unread Badge
`GET /api/v1/notifications/unread-count` — lightweight endpoint polled every 60s by the Nav bell.

**Response:** `{ "count": 3 }`

Alternatively, embed unread count in the base auth/session response to avoid a separate request.

---

## Rate Limiting
- Max 10 notifications per user per day (system-generated)
- Deduplication: same `type + action_url + user_id` within 24h → skip
