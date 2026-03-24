# Harmonia Testing Pool

Frontend prototype for the three-signal compatibility matching experiment. Next.js 14, TypeScript, Tailwind CSS. All pages are functional with mock data. Backend specs define every API endpoint Abe needs to build.

---

## Quick Start

**Requirements:** Node 18+, npm 9+

```bash
git clone https://github.com/averyedwards/harmonia-testing-pool.git
cd harmonia-testing-pool
npm install
cp config/.env.example .env.local   # edit values as needed
npm run dev
```

Dev server runs at `http://localhost:3000`. No backend needed — all data is served from `src/mock-data/*.json`.

Open the dev toolbar with **Ctrl+Shift+D** (bottom-right) to switch phases, user types, and simulate data events.

---

## Project Structure

```
harmonia-testing-pool/
├── src/
│   ├── app/
│   │   ├── (admin)/admin/         # Admin panel (role-gated)
│   │   ├── (app)/                 # Authenticated user routes
│   │   ├── (auth)/                # Login / register / verify
│   │   ├── (onboarding)/          # 7-step onboarding flow
│   │   ├── api/                   # Next.js API stubs (404 — backend not built)
│   │   ├── showcase/              # Design system showcase
│   │   └── page.tsx               # Root redirect
│   ├── components/
│   │   ├── dev/                   # DevToolbar, DevDataActions, DevPhaseButtons, DevUserControls
│   │   ├── layout/                # Nav, MobileMenu, AppShell
│   │   ├── onboarding/            # Step components
│   │   └── ui/                    # badge, button, card, input, modal, progress, select, textarea, toast, toggle
│   ├── hooks/                     # useTournament, usePhase, useAuth
│   ├── lib/                       # api.ts, constants.ts, utils.ts, elo.ts
│   ├── mock-data/                 # JSON fixtures (see Mock Data Reference)
│   ├── providers/                 # ThemeProvider, AuthProvider, PhaseProvider, NotificationsProvider
│   ├── styles/
│   │   └── email-templates/       # 14 HTML email templates
│   └── types/                     # index.ts — all shared TypeScript types
├── docs/
│   ├── backend-specs/             # 11 spec files (one per backend module)
│   ├── pending-fixes/             # Known issues and inconsistencies
│   ├── reference/                 # Internal reference docs
│   ├── research/                  # UX pattern research (5 docs)
│   └── TEMPLATE-GUIDE.md          # Email template variable reference
├── config/
│   ├── .env.example               # All env vars documented
│   ├── Dockerfile                 # Multi-stage, standalone, PORT=8080
│   ├── railway.toml               # Railway deployment config
│   └── cloudbuild.yaml            # GCP Cloud Run build config
└── public/                        # Static assets, manifest.json
```

---

## User Journey

Sequential flow with phase gates:

1. **Signup** (`/register`) → email verification (`/verify-email`)
2. **Onboarding** (`/onboarding`) — 7 steps:
   - Step 1: Email verified confirmation
   - Step 2: Basic profile (name, age, location)
   - Step 3: Orientation (straight/gay/bisexual/other)
   - Step 4: Photo upload (triggers DeepFace indexing)
   - Step 5: Personality questionnaire (6 questions → Gemini scoring)
   - Step 6: Face calibration (rate dataset faces 1-5)
   - Step 7: DNA kit address (London only, non-London skip)
3. **Phase 1: Calibration** (`/calibration`) — rate faces, build visual preference model
4. **Phase 2: Tournament** (`/tournament`) — Elo pairwise comparisons, personality reveal on cards, 3 hearts = confirmed match
5. **Phase 3: Tournament with genetics** (`/tournament-phase3`) — same as Phase 2 plus ChemistryReveal showing HLA compatibility tier on cards. London users with DNA results only.
6. **Contact exchange** (`/match/[matchId]`) — blind double-opt-in (phone/instagram/email/prefer-not-to-share)
7. **"We Met" survey** (`/survey/[matchId]`) — triggered 4 days after contact exchange. 3 questions: did you meet, interest 1-7, orientation (casual/serious/not sure).
8. **Insights** (`/insights/phase1`, `/phase2`, `/phase3`) — personal reports per phase

---

## Route Map

| Route | Description | Auth | Backend spec |
|-------|-------------|------|--------------|
| `/` | Root redirect (→ /dashboard) | — | — |
| `/login` | Email + password login | No | `auth-backend-spec.md` |
| `/register` | Account creation | No | `auth-backend-spec.md` |
| `/verify-email` | Email verification link handler | No | `auth-backend-spec.md` |
| `/forgot-password` | Password reset request | No | `auth-backend-spec.md` |
| `/onboarding` | 7-step onboarding flow | Yes | `onboarding-backend-spec.md` |
| `/dashboard` | Phase-aware home screen | Yes | `dashboard-backend-spec.md` |
| `/calibration` | Phase 1: rate faces | Yes | `calibration-backend-spec.md` |
| `/tournament` | Phase 2: Elo pairwise comparisons | Yes | `tournament-backend-spec.md` |
| `/tournament-phase3` | Phase 3: tournament + HLA reveal | Yes | `tournament-backend-spec.md`, `genetics-backend-spec.md` |
| `/match/[matchId]` | Contact exchange (blind opt-in) | Yes | `match-backend-spec.md` |
| `/survey/[matchId]` | "We Met" post-match survey | Yes | `match-backend-spec.md` |
| `/insights` | Insights hub (phase selector) | Yes | `insights-backend-spec.md` |
| `/insights/phase1` | Phase 1 calibration report | Yes | `insights-backend-spec.md` |
| `/insights/phase2` | Phase 2 tournament report | Yes | `insights-backend-spec.md` |
| `/insights/phase3` | Phase 3 full report (genetics) | Yes | `insights-backend-spec.md` |
| `/notifications` | Notification list + push prompt | Yes | `notifications-backend-spec.md` |
| `/settings` | Profile, theme, notification prefs | Yes | `step-01-root-scaffold.md` |
| `/admin` | Admin dashboard | Admin | `admin-backend-spec.md` |
| `/admin/phases` | Phase transition controls | Admin | `admin-backend-spec.md` |
| `/admin/users` | User list + phase/status filters | Admin | `admin-backend-spec.md` |
| `/admin/kits` | DNA kit pipeline management | Admin | `admin-backend-spec.md`, `genetics-backend-spec.md` |
| `/admin/gemini` | Review low-quality personality scores (< 60) | Admin | `admin-backend-spec.md` |
| `/admin/gender-ratio` | Gender balance monitor | Admin | `admin-backend-spec.md` |
| `/admin/export` | Dataset export (CSV) | Admin | `admin-backend-spec.md` |
| `/admin/announcements` | Community email composer | Admin | `notifications-backend-spec.md` |
| `/showcase` | Design system component showcase | No | — |

---

## Backend Specs Index

| File | Sections | Key responsibility |
|------|----------|--------------------|
| `step-01-root-scaffold.md` | 11 | Root scaffold: auth state, session management, user profile GET/PATCH, logout |
| `auth-backend-spec.md` | 7 | JWT auth, bcrypt, email verification, token refresh, resend-verification |
| `onboarding-backend-spec.md` | 7 | 7-step profile, photo upload, kit allocation, Gemini + DeepFace triggers |
| `calibration-backend-spec.md` | 3 | Face rating submission, completion gates, rating distribution |
| `dashboard-backend-spec.md` | 2 | Single aggregation endpoint, Redis-cached (60s TTL) |
| `tournament-backend-spec.md` | 9 | Elo pairing, result submission, heart accumulation, match confirmation |
| `match-backend-spec.md` | 13 | Blind double-opt-in contact exchange, "We Met" survey storage |
| `notifications-backend-spec.md` | 8 | In-app notifications, push (VAPID), email delivery, cron jobs |
| `insights-backend-spec.md` | 7 | Per-phase report generation, Redis-cached |
| `genetics-backend-spec.md` | 3 | HLA allele upload, Fernet encryption, compatibility scoring, kit status |
| `admin-backend-spec.md` | 12 | Phase transitions, user management, kit pipeline, dataset export, statistics |

---

## Backend Integration Guide

### Build Order

Build in this order. Each tier depends on the ones above it.

**Tier 1: Auth + Profile (blocks everything)**
- `auth-backend-spec.md` — JWT auth, bcrypt, email verification, token refresh, resend-verification
- `step-01-root-scaffold.md` — logout, GET/PATCH /users/me, session model. NOTE: These two specs overlap on auth endpoints but each has unique ones. auth-backend-spec has resend-verification. step-01 has logout and user profile endpoints. Abe needs both.
- `onboarding-backend-spec.md` — 7-step profile, photo upload, kit allocation

**Tier 2: Phase 1 + scoring pipelines (blocks calibration)**
- `calibration-backend-spec.md` — face rating submission, completion, rating distribution spread
- Background: DeepFace indexing (triggered by photo upload, onboarding Step 4)
- Background: Gemini personality scoring (triggered by questionnaire submission, onboarding Step 5. 42 API calls: 6 questions × 7 sins.)
- Background: MetaFBP-R adaptation (triggered when support set spans 5 score classes, per `onboarding-backend-spec.md` POST /api/v1/visual/calibrate)

**Tier 3: Phase 2 core (blocks the experiment)**
- `tournament-backend-spec.md` — Elo pairing, result submission, heart accumulation, match confirmation
- `notifications-backend-spec.md` — in-app notifications, push (VAPID via web-push npm package), email sending
- `dashboard-backend-spec.md` — single aggregation endpoint, Redis cached (60s TTL)

**Tier 4: Post-match (blocks contact exchange)**
- `match-backend-spec.md` — blind double-opt-in contact exchange, "We Met" survey storage

**Tier 5: Phase 3 (blocks genetics experiment)**
- `genetics-backend-spec.md` — HLA allele upload, Fernet encryption, compatibility scoring, kit status

**Tier 6: Analysis + admin (can be built in parallel with Tiers 3-5)**
- `insights-backend-spec.md` — per-phase report generation, Redis cached
- `admin-backend-spec.md` — phase transitions, user management, kit pipeline, dataset export

### API Client as Contract

`src/lib/api.ts` (387 lines) is the typed API client. It defines every endpoint the frontend calls. The TypeScript types ARE the contract. When Abe builds an endpoint, the response must match the type in `api.ts`.

The client uses: `process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1'`

**Discrepancy to resolve:**
- `src/lib/api.ts` uses `NEXT_PUBLIC_API_BASE_URL` (this is the one that runs)
- `src/app/api/README.md` mentions `NEXT_PUBLIC_API_URL` (wrong name)
- `config/.env.example` has `NEXT_PUBLIC_APP_URL` (different purpose — app URL, not API URL)

Action: Add `NEXT_PUBLIC_API_BASE_URL` to `.env.example`. Update `src/app/api/README.md` to reference the correct variable name.

### Provider Replacement Guide

The frontend has 4 providers/hooks with mock state. When Abe's backend is live, replace each one:

**AuthProvider** (`src/providers/AuthProvider.tsx`):
- Currently: `useState(MOCK_USER)` auto-logs in as Alex Morgan
- Replace: On mount, call `GET /auth/me`. If 401, set user to null (triggers redirect to /login). If 200, set user to response data.
- Keep: `isHydrated` pattern, `sessionStorage` admin role persistence for dev.

**PhaseProvider** (`src/providers/PhaseProvider.tsx`):
- Currently: `useState('phase2')` hardcoded
- Replace: Read `currentPhase` from `GET /api/v1/dashboard` response. Phase is server-authoritative, not client state.
- Keep: `setPhase` for dev toolbar override, `devMode` state.

**NotificationsProvider** (`src/providers/NotificationsProvider.tsx`):
- Currently: imports from `mock-data/notifications.json`
- Replace: Poll `GET /api/v1/notifications` on interval. `notifications-backend-spec` defines `GET /api/v1/notifications/unread-count` polled every 60s by the Nav bell.
- Keep: Same context shape (`notifications`, `unreadCount`, `markRead`, `markAllRead`).

**useTournament** (`src/hooks/useTournament.ts`):
- Currently: client-side Elo computation via `computeNewElo()` and `pickPairing()`, all state in React
- Replace: Thin wrapper around `GET /api/v1/tournament/pairing` (next pair) and `POST /api/v1/tournament/result` (submit choice). Server owns Elo state. Client renders what server sends.
- Remove: `computeNewElo`, `pickPairing` (server handles these).
- Keep: `selectWinner`, `passBoth`, `dismissMatch` as API call wrappers. Local state for `newMatchCandidate` (match animation before server confirmation).

### Background Services (no frontend UI)

These run server-side. The frontend never calls them directly.

1. **Gemini personality scoring** — Trigger: questionnaire submission (onboarding Step 5). 42 Gemini API calls per user (6 questions × 7 sins). Store as PersonalityProfile. Quality score < 60 gets flagged for Gemini Review (`/admin/gemini` page). NOTE: The < 60 threshold is defined only in the frontend (`src/app/(admin)/admin/gemini/page.tsx`), not in any backend spec. Add a quality_threshold constant server-side.
2. **DeepFace indexing** — Trigger: photo upload (onboarding Step 4). Runs `DeepFace.analyze()` once. Extracts face embeddings for candidate filtering. Sets `in_matching_pool = true`.
3. **MetaFBP-R visual scoring** — Trigger: face rating spans 5 score classes (`onboarding-backend-spec` POST /api/v1/visual/calibrate). `tournament-backend-spec` describes mutual pool construction using these scores.
4. **Email delivery** — Triggered by events (match confirmed, phase transition, etc.). Uses 14 HTML templates in `src/styles/email-templates/` with `{{variable}}` replacement. See `docs/TEMPLATE-GUIDE.md` for variable reference and trigger conditions.
5. **Push delivery** — Web Push Protocol (RFC 8030) via `web-push` npm package. VAPID keys in env vars. Push subscriptions stored in `push_subscriptions` table. Payloads under 4096 bytes.

### Cron Jobs

Timing discrepancies exist between specs. Resolve before implementing:

**Calibration reminder:**
- `onboarding-backend-spec`: 48 hours (`CALIBRATION_REMINDER_HOURS = 48`)
- `notifications-backend-spec`: 7 days, daily 09:00 UTC
- `TEMPLATE-GUIDE`: one-time only, never repeated
- **RESOLVE:** pick 48h or 7d. Both specs need to agree.

**"We Met" survey trigger:**
- `constants.ts`: `WE_MET_TRIGGER_DAYS = 4`
- `notifications-backend-spec`: 5+ days after contact exchange
- **RESOLVE:** pick 4 or 5 days. `constants.ts` and the spec need to agree.

**Survey reminder:**
- `TEMPLATE-GUIDE`: 3 days after survey email. Last reminder, not repeated.
- `notifications-backend-spec`: not in the cron table (mentioned only in overview text)
- **RESOLVE:** add to `notifications-backend-spec` cron table.

### Database Tables by Spec

**Explicit CREATE TABLE in specs:**

| Spec | Tables |
|------|--------|
| `onboarding-backend-spec.md` | `kit_allocations` |
| `match-backend-spec.md` | `contact_submissions`, `we_met_surveys` + `contact_exchanges` VIEW |
| `notifications-backend-spec.md` | `notifications`, `push_subscriptions` |
| `genetics-backend-spec.md` | `hla_data` |
| `admin-backend-spec.md` | `admin_audit_log` |

**Implied but without CREATE TABLE (Abe designs schema):**

| Domain | Tables needed |
|--------|---------------|
| auth / step-01 | `users`, `sessions` / `refresh_tokens` |
| calibration | `face_ratings` |
| onboarding | `personality_profiles` (from Gemini scoring) |
| tournament | `comparisons`, `confirmed_matches`, `elo_state` |

All tables share a single PostgreSQL database. Foreign keys reference `users(id)` as the primary entity.

### Internal Inconsistencies to Resolve

Before building, resolve these contradictions within the repo:

1. **Email provider:** `auth-backend-spec` says Zoho SMTP (`smtppro.zoho.com:587`, `ZOHO_PASSWORD`). `config/.env.example` says Resend (`RESEND_API_KEY`). Pick one, update both files.
2. **Push notification names:** `notifications-backend-spec` includes `matchDisplayName` in a push payload example. `TEMPLATE-GUIDE` says "Unlike push notifications, email CAN include the matched person's first name" — implying push should NOT have names. Resolve which rule applies.
3. **Cron timing discrepancies** (documented above under Cron Jobs).
4. **API URL env var naming** (documented above under API Client as Contract).
5. **Quality threshold:** frontend uses < 60 for Gemini review flagging, but no backend spec defines this threshold.

### Deployment Gotchas

1. **`FERNET_KEY` missing from `.env.example`** — required by `genetics-backend-spec` for HLA allele encryption. Must be added before Phase 3.
2. **`NEXT_PUBLIC_API_BASE_URL` missing from `.env.example`** — `api.ts` reads this. Without it, falls back to `/api/v1` which hits the Next.js app itself (no backend there).
3. **next-pwa + manual `public/sw.js` conflict** — `public/sw.js` (127 lines) was written manually. `next-pwa` in `next.config.mjs` generates its own `sw.js` into `public/` at build time. In production, next-pwa will overwrite the manual file. Either delete `public/sw.js` and let next-pwa generate it, or configure next-pwa with a custom `sw` filename.
4. **PhaseProvider dead code** — `src/providers/PhaseProvider.tsx` has an empty `if (typeof window !== 'undefined')` block with a comment about keyboard shortcuts. The actual handler is in `DevToolbar.tsx`. Can be safely removed.

### What NOT to Build

Not part of the testing pool:
- Ecosystem partner integration (GenoPalate, LifeDNA, SkinGenie)
- Tripartite data flow to partners
- Commercial B2B licensing API
- Public harmoniaengine.com (separate site, already exists)
- Scale infrastructure beyond ~250 users
- Whitepaper CMS

---

## Phase System

The app has 7 phases. Admin triggers transitions via `/admin/phases`.

| Phase key | Display label | Notes |
|-----------|---------------|-------|
| `onboarding` | Getting Started | Default for new users |
| `phase1` | Phase 1: Calibration | Rate faces to build visual model |
| `between_1_2` | Awaiting Phase 2 | Calibration complete, waiting for admin to open Phase 2 |
| `phase2` | Phase 2: Tournament | Elo pairwise comparisons |
| `between_2_3` | Awaiting Phase 3 | Tournament complete, waiting for admin to open Phase 3 |
| `phase3` | Phase 3: Genetics | Requires admin trigger AND `kit_status = results_uploaded` (backend enforced, per `genetics-backend-spec`) |
| `complete` | Complete | All phases done |

Phase is server-authoritative. `PhaseProvider` reads it from `GET /api/v1/dashboard`. Admin transitions are irreversible — no rollback endpoint is defined in the specs.

---

## Mock Data Reference

| File | Records | Notes |
|------|---------|-------|
| `users.json` | 20 | 10 London, mixed phases (10 phase2, 3 phase3, 2 phase1, 2 between_1_2, 2 onboarding, 1 complete) |
| `tournament-candidates.json` | 12 | HLA tiers: 3 strong, 3 good, 2 some, 2 hidden, 2 null. 9 London, 3 other |
| `dataset-faces.json` | 20 | Calibration face pool (first 5 are real testing pool users) |
| `personality-profiles.json` | 12 | One per tournament candidate; 7-sin scores with quality rating |
| `perceived-similarities.json` | 10 | Pre-computed similarity tiers for tournament card reveals |
| `matches.json` | 5 | Confirmed matches (3 hearts reached); various contact exchange states |
| `notifications.json` | 8 | Mixed types: match, phase, survey, community |
| `elo-state.json` | 1 | Singleton: current Elo ratings and comparison history |
| `admin-stats.json` | 1 | Singleton: aggregate stats for admin dashboard |
| `insights-phase1.json` | 1 | Singleton: Phase 1 report for mock user Alex Morgan |
| `insights-phase2.json` | 1 | Singleton: Phase 2 report for mock user Alex Morgan |
| `insights-phase3.json` | 1 | Singleton: Phase 3 report for mock user Alex Morgan |

---

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#FAF6F1` | Page background (light mode) |
| `blush` | `#F5EDE6` | Card backgrounds, subtle fills |
| `gold` | `#D4A853` | Primary accent, CTAs, highlights |
| `maroon` | `#722F37` | Danger states, destructive actions |
| `wine` | `#8B3A3A` | Secondary danger, hover states |
| `slate` | `#475569` | Body text |
| `dark-bg` | `#1E293B` | Page background (dark mode) |

Dark mode is class-based (`darkMode: 'class'` in `tailwind.config.ts`). Toggle stored in `localStorage`.

### Fonts

| Role | Font | Variable |
|------|------|----------|
| Heading | Cormorant Garamond | `--font-cormorant` |
| Body | DM Sans | `--font-dm-sans` |

### UI Components (`src/components/ui/`)

`badge` · `button` · `card` · `input` · `modal` · `progress` · `select` · `textarea` · `toast` · `toggle`

All components accept `className` for extension. See `/showcase` for live demos.

---

## Email Templates

13 send templates + 1 base layout = **14 files** in `src/styles/email-templates/`.

**From address:** `testingpool@harmoniaengine.com`
**Variable format:** `{{variableName}}` — simple string replacement, no templating engine
**Full reference:** `docs/TEMPLATE-GUIDE.md`

| Template file | Trigger |
|---------------|---------|
| `email-verification.html` | Registration |
| `password-reset.html` | Forgot password |
| `phase-transition.html` | Admin phase change |
| `match-confirmed.html` | 3-heart mutual match |
| `calibration-reminder.html` | 48h cron (once only) |
| `insights-ready.html` | Insights generated |
| `we-met-survey.html` | 4 days after contact exchange |
| `kit-address-request.html` | Address submitted (onboarding Step 7) |
| `kit-dispatched.html` | Admin dispatches kit |
| `kit-results-ready.html` | DNA results uploaded |
| `testing-waitlist.html` | Pool capacity block |
| `community-update.html` | Admin manual send (`/admin/announcements`) |
| `survey-reminder.html` | 3 days after survey email |
| `_base-layout.html` | Reference layout (not sent directly) |

---

## Admin Panel

All admin pages require `user.role === 'admin'`. Defence-in-depth: `src/app/(admin)/layout.tsx` redirects non-admin users, and each page also checks role independently.

To access admin as the mock user: open the dev toolbar (Ctrl+Shift+D) → User Controls → toggle "Admin mode".

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with stats overview and nav links to all admin tools |
| `/admin/phases` | Phase transition controls with confirmation modal |
| `/admin/users` | User list with phase/location/status filters |
| `/admin/kits` | DNA kit pipeline: address confirmed → dispatched → results uploaded |
| `/admin/gemini` | Review personality profiles with quality score < 60; approve or flag |
| `/admin/gender-ratio` | Gender balance monitor by phase |
| `/admin/export` | Dataset export (CSV download) |
| `/admin/announcements` | Community email composer with audience targeting and preview |

---

## Dev Toolbar

Toggle with **Ctrl+Shift+D**. Renders bottom-right, `z-50`, only in development.

**Phase Switcher** (`DevPhaseButtons.tsx`) — switch between all 7 phases instantly. Updates PhaseProvider context; does not persist across full reloads.

**User Controls** (`DevUserControls.tsx`) — toggle London user, toggle admin role (persisted in `sessionStorage`).

**Data Actions** (`DevDataActions.tsx`) — four buttons:

| Label | Effect |
|-------|--------|
| Reset all | Clears all mock state to defaults |
| Add match | Injects a new confirmed match |
| Add notif | Injects a new notification |
| Sim DNA | Simulates DNA results arriving (enables Phase 3) |

The **Settings page** (`/settings`) also has a Dev Mode section with a phase simulator dropdown — useful for testing phase-specific UI without the toolbar.

---

## Deployment

**Primary target:** Railway (`config/railway.toml`). Deploy by connecting the GitHub repo in Railway — it auto-detects the config.

**Secondary target:** GCP Cloud Run (`config/cloudbuild.yaml`). Trigger via Cloud Build on push to `main`.

**Container:** `config/Dockerfile` — multi-stage Node build, `output: 'standalone'` (Next.js), listens on `PORT=8080`.

**Domain:** `app.harmoniaengine.com`

**Env vars:** copy `config/.env.example` to `.env.local`. Required before backend goes live:
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string
- `JWT_SECRET` — min 32 chars
- `REFRESH_TOKEN_SECRET` — min 32 chars
- `NEXT_PUBLIC_API_BASE_URL` — e.g. `https://api.harmoniaengine.com/api/v1` *(missing from `.env.example` — add it)*
- `RESEND_API_KEY` — or Zoho SMTP creds (resolve email provider inconsistency first)
- `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` — for push notifications
- `FERNET_KEY` — for HLA encryption (Phase 3) *(missing from `.env.example` — add it)*

---

## Known Limitations

- Auth is mocked. `MOCK_USER` auto-logs in as Alex Morgan. No real JWT or session management.
- No real backend. `lib/api.ts` calls hit `/api/v1` which returns 404. All data comes from JSON files in `src/mock-data/`.
- Photos are placeholder SVG avatars, not real user photos.
- DeepFace and MetaFBP-R do not run. Visual scores in mock data are hardcoded.
- Gemini does not score personality responses. Scores in mock data are fabricated.
- HLA alleles are fabricated. No real genetic data is processed.
- Push permission prompt exists but no real VAPID keys are configured.
- PWA service worker is disabled in development (`next-pwa` config).
- `config/.env.example` uses Resend for email but `auth-backend-spec` references Zoho SMTP. Resolve before building auth.
