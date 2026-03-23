# Email Template Guide

All transactional email templates are in `src/styles/email-templates/`. They are standalone HTML files with `{{variable}}` placeholders and render across Gmail, Outlook, Apple Mail, and mobile clients.

---

## Template List

| File | Subject | Trigger | Key variables |
|---|---|---|---|
| `email-verification.html` | Verify your email address | Registration | `firstName`, `verificationUrl` |
| `password-reset.html` | Reset your password | Forgot password | `firstName`, `resetUrl`, `expiryTime` |
| `phase-transition.html` | Phase X is now open | Admin phase change | `firstName`, `phaseName`, `phaseDescription`, `phaseTeaser`, `ctaUrl`, `ctaText` |
| `match-confirmed.html` | You have a new match! | 3-heart mutual match | `firstName`, `matchedFirstName`, `matchUrl` |
| `calibration-reminder.html` | Complete your calibration | 48h cron, once only | `firstName`, `calibrationUrl` |
| `insights-ready.html` | Your Phase X insights are ready | Insights generated | `firstName`, `phaseName`, `insightsUrl` |
| `we-met-survey.html` | How did it go? | 4 days post-exchange | `firstName`, `matchedFirstName`, `surveyUrl` |
| `kit-address-request.html` | Your DNA kit address is confirmed | Address submitted | `firstName`, `settingsUrl` |
| `kit-dispatched.html` | Your DNA kit has been dispatched | Admin dispatches kit | `firstName`, `expectedDelivery`, `processingTime`, `trackingUrl` |
| `kit-results-ready.html` | Your DNA results are in | Results uploaded | `firstName`, `resultsUrl` |
| `testing-waitlist.html` | You're on the list | Pool capacity block | `firstName` |
| `community-update.html` | (custom — set `{{subject}}`) | Admin manual send | `firstName`, `subject`, `preheader`, `category`, `headline`, `bodyText`, `ctaUrl`, `ctaText` |
| `survey-reminder.html` | Quick reminder: How did it go? | 3 days after survey send | `firstName`, `surveyUrl` |

---

## Variable Reference

### Universal (every template)
| Variable | Description |
|---|---|
| `{{firstName}}` | Recipient first name |
| `{{unsubscribeUrl}}` | One-click unsubscribe link |

### Per-template

**email-verification.html**
- `{{verificationUrl}}` — Email verification link (expires 24h)

**password-reset.html**
- `{{resetUrl}}` — Password reset link
- `{{expiryTime}}` — Human-readable expiry, e.g. `24 hours`

**phase-transition.html**
- `{{phaseName}}` — e.g. `Phase 2: Written Profiles`
- `{{phaseDescription}}` — 1–2 sentence description of what this phase involves
- `{{phaseTeaser}}` — Short preheader teaser text
- `{{ctaUrl}}` — Link to the new phase
- `{{ctaText}}` — Button label, e.g. `Begin Phase 2`

**match-confirmed.html**
- `{{matchedFirstName}}` — First name of the matched person
- `{{matchUrl}}` — Link to the match page

**calibration-reminder.html**
- `{{calibrationUrl}}` — Link to resume calibration

**insights-ready.html**
- `{{phaseName}}` — Phase that generated the insights
- `{{insightsUrl}}` — Link to the insights page

**we-met-survey.html**
- `{{matchedFirstName}}` — First name of the matched person
- `{{surveyUrl}}` — Link to the post-meeting survey

**kit-address-request.html**
- `{{settingsUrl}}` — Link to address settings page

**kit-dispatched.html**
- `{{expectedDelivery}}` — Human-readable date, e.g. `Wednesday 25 March`
- `{{processingTime}}` — e.g. `3–5 working days`
- `{{trackingUrl}}` — Courier tracking link

**kit-results-ready.html**
- `{{resultsUrl}}` — Link to DNA results page

**community-update.html** (admin manual send)
- `{{subject}}` — Email subject line (also sets `<title>`)
- `{{preheader}}` — Hidden preview text
- `{{category}}` — Small uppercase label above headline, e.g. `Pool update`
- `{{headline}}` — Main heading
- `{{bodyText}}` — Body paragraph (comes after "Hi {{firstName}}, ")
- `{{ctaUrl}}` — Optional button link (remove entire button table if not needed)
- `{{ctaText}}` — Optional button label

**survey-reminder.html**
- `{{surveyUrl}}` — Link to the post-meeting survey

---

## Design System

| Token | Value | Usage |
|---|---|---|
| Background | `#FAF6F1` | Page/wrapper background |
| Card | `#FFFFFF` | Email content card |
| Gold accent | `#D4A853` | Top border, buttons, labels |
| Heading | `#1E293B` | `<h1>` colour |
| Body text | `#475569` | Paragraph colour |
| Muted text | `#9CA3AF` | Footer, footnotes |
| Button text | `#12090A` | Text on gold buttons |
| Font — headings | Georgia, 'Times New Roman', serif | All `<h1>` |
| Font — body | Arial, Helvetica, sans-serif | All `<p>`, `<a>` |
| Card radius | `12px` | |
| Card top border | `3px solid #D4A853` | |
| Container width | `600px` max | |
| Mobile breakpoint | `max-width: 620px` | |

---

## Sending Configuration

| Type | Address |
|---|---|
| Transactional | `testingpool@harmoniaengine.com` |
| Sales enquiries | `sales@harmoniaengine.com` |

---

## Key Rules

1. **Email-safe only** — Tables for layout. Inline styles. No external CSS, no JS, no CSS classes on interactive elements.
2. **No gender in testing-waitlist.html** — Deliberately vague. Do not mention gender ratio or pool composition.
3. **Names in emails are permitted** — Unlike push notifications, email CAN include the matched person's first name (`{{matchedFirstName}}`).
4. **Last reminder is final** — `survey-reminder.html` says "This is the last reminder. No further follow-ups will be sent."
5. **Calibration reminder is one-time** — `calibration-reminder.html` is sent once only (48h cron). Not repeated.
6. **Every email has unsubscribe** — Footer always links to `{{unsubscribeUrl}}` and notification preferences.
7. **Logo is embedded SVG** — `data:image/svg+xml` URI ensures it renders even when images are blocked.

---

## Replacing the Logo

Templates use a placeholder SVG (gold circle with "H"). To replace with the real logo:

1. Get the Harmonia logo as PNG (200×200px recommended)
2. Base64 encode: `base64 logo.png | tr -d '\n'`
3. Replace the `src="data:image/svg+xml,..."` value in each template, or update `generate-templates.py` and re-run it
4. Test in at least one real email client before deploying

---

## Regenerating Templates

```bash
python3 generate-templates.py
```

Regenerates all 13 content templates from the definitions in that file. Run after:
- Changing the base layout (`_base-layout.html`)
- Updating the logo
- Editing template content in `generate-templates.py`
