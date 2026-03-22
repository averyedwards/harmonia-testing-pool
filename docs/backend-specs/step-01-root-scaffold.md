# BACKEND-SPEC: Step 1 — Root Project Scaffold

## Overview

This document describes the API contracts and backend infrastructure the frontend prototype assumes for the root scaffold (authentication state, session management, user profile loading).

---

## Base URL

All API calls use `NEXT_PUBLIC_API_URL` environment variable. Example: `https://api.harmoniaengine.com`

Frontend never hardcodes the base URL.

---

## Authentication

### Session Model

The frontend assumes JWT-based authentication with a short-lived access token (15 min) and a long-lived refresh token (30 days) stored in an httpOnly cookie.

### Endpoints Required

#### `POST /auth/login`
- Body: `{ email: string, password: string }`
- Response: `{ accessToken: string, user: User }`
- Errors: `401` invalid credentials, `403` email not verified

#### `POST /auth/register`
- Body: `{ email: string, password: string, firstName: string, lastName: string }`
- Response: `{ message: "Verification email sent" }`
- Errors: `409` email already registered

#### `POST /auth/verify-email`
- Body: `{ token: string }` (from email link query param)
- Response: `{ user: User, accessToken: string }`

#### `POST /auth/refresh`
- No body (reads httpOnly refresh token cookie)
- Response: `{ accessToken: string }`

#### `POST /auth/logout`
- Clears refresh token cookie
- Response: `{ message: "Logged out" }`

#### `POST /auth/forgot-password`
- Body: `{ email: string }`
- Response: `{ message: "If that email exists, a reset link was sent" }`

#### `POST /auth/reset-password`
- Body: `{ token: string, newPassword: string }`
- Response: `{ message: "Password updated" }`

---

## User Profile

#### `GET /users/me`
- Auth: Bearer token required
- Response: `User` object (see types/index.ts)

#### `PATCH /users/me`
- Auth: Bearer token required
- Body: Partial `User` (only updatable fields: displayName, location, phoneNumber)
- Response: Updated `User`

---

## Environment Variables (Frontend)

```
NEXT_PUBLIC_API_URL=https://api.harmoniaengine.com
NEXT_PUBLIC_APP_ENV=production
```

---

## Notes for Abe

- All endpoints return `{ error: string, code: string }` on failure
- CORS must allow `https://app.harmoniaengine.com`
- Rate limiting: 10 requests/minute per IP on auth endpoints
- Email verification tokens expire after 24 hours
- Password reset tokens expire after 1 hour
- The frontend mock currently uses `MOCK_USER` in `AuthProvider.tsx` — replace with real API calls once the backend is live
