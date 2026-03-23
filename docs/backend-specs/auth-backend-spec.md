# Authentication Backend Specification

**Module:** Authentication
**For:** Abe (backend implementation)
**Sources:** Email doc v1.7 Section 2.4.1, V4.1 Master Spec Section 16, this conversation's planning decisions

---

## Overview

JWT-based email + password authentication. Users register, verify their email, and log in to receive access and refresh tokens. All email sending uses Zoho SMTP (smtppro.zoho.com:587, STARTTLS) from testingpool@harmoniaengine.com.

---

## Endpoints

### POST /api/v1/auth/register

Creates a new user account and sends a verification email.

**Request body:**
```json
{
  "firstName": "string (required, non-empty)",
  "lastName": "string (required, non-empty)",
  "email": "string (required, valid email format)",
  "age": "integer (required, >= 18, <= 100)",
  "gender": "string (required, enum: 'male' | 'female')",
  "location": "string (required, non-empty, free text city and country)",
  "phoneNumber": "string (required, non-empty)",
  "password": "string (required, min 8 chars, at least 1 number, at least 1 special char)"
}
```

**Logic:**
1. Validate all fields. Return 422 with field-specific errors if invalid.
2. Check if email already registered. Return 409 if duplicate.
3. Hash password with bcrypt (12 rounds).
4. Create user record with `email_verified = false`, `onboarding_step = 1`.
5. Check gender ratio. If adding this user would exceed the 60/40 imbalance threshold, add to waitlist instead of active pool. Send waitlist email (template: testing_waitlist.html).
6. Generate signed email verification token (JWT, 24h expiry, single-use, includes user_id).
7. Send verification email from testingpool@harmoniaengine.com (template: email_verification.html).
8. Return 201 `{ message: "Verification email sent", userId: "uuid" }`.

**Rate limiting:** 3 registrations per email per hour. 10 registrations per IP per hour.

### POST /api/v1/auth/verify-email/{token}

Verifies a user's email address.

**Logic:**
1. Decode and verify JWT token. Return 400 if expired or invalid.
2. Check token not already used.
3. Set `email_verified = true` on user record.
4. Set `onboarding_step = 2`.
5. Return 200 `{ message: "Email verified", redirectUrl: "/onboarding" }`.

### POST /api/v1/auth/login

**Request body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Logic:**
1. Look up user by email. Return 401 if not found.
2. Check email_verified. Return 403 if not verified.
3. Compare password against bcrypt hash. Return 401 if mismatch.
4. Generate access token (JWT, 15 min expiry).
5. Generate refresh token (JWT, 7 day expiry, httpOnly cookie).
6. Return 200 `{ accessToken, user: { id, email, displayName, role, onboardingStep, currentPhase } }`.

**Rate limiting:** 5 failed attempts per email per 15 minutes, then lock for 15 minutes.

### POST /api/v1/auth/refresh-token

Issues new access token using refresh token from httpOnly cookie.

### POST /api/v1/auth/forgot-password

**Request body:** `{ "email": "string" }`

Always returns 200 regardless of whether email exists. Sends reset email if account found.

**Rate limiting:** 3 requests per email per hour.

### POST /api/v1/auth/reset-password/{token}

**Request body:** `{ "newPassword": "string" }`

Resets password. Invalidates all existing refresh tokens for the user.

### POST /api/v1/auth/resend-verification

**Request body:** `{ "email": "string" }`

Resends verification email. Always returns 200.

---

## Security Requirements

| Requirement | Implementation |
|---|---|
| Password hashing | bcrypt, 12 rounds |
| Access token expiry | 15 minutes |
| Refresh token expiry | 7 days |
| Verification token expiry | 24 hours |
| Reset token expiry | 1 hour |
| Token single-use | Verification and reset tokens are single-use |
| CORS | Allow: harmoniaengine.com, app.harmoniaengine.com, localhost:3000 |
| Rate limiting | Per-endpoint limits described above |
| Secrets | JWT_SECRET, ZOHO_PASSWORD in Railway env vars |

---

## Database Columns

```sql
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL;
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN email_verification_token TEXT;
ALTER TABLE users ADD COLUMN email_verification_sent_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN password_reset_token TEXT;
ALTER TABLE users ADD COLUMN password_reset_sent_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN locked_until TIMESTAMPTZ;
```

---

## Email Templates Used

| Trigger | Template | From Address |
|---|---|---|
| Registration | email_verification.html | testingpool@harmoniaengine.com |
| Gender ratio waitlist | testing_waitlist.html | testingpool@harmoniaengine.com |
| Forgot password | password_reset.html | testingpool@harmoniaengine.com |
| Resend verification | email_verification.html | testingpool@harmoniaengine.com |
