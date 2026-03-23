# Onboarding Backend Specification

**Module:** Onboarding (7-step flow)
**For:** Abe (backend implementation)

## Overview

7-step progressive onboarding. Steps ordered shortest to longest for retention. User enters matching pool after Step 4. Step 5 (questionnaire) is mandatory. Step 6 (calibration) is optional with 48-hour reminders. Step 7 (address) is London users only.

## Endpoints

### GET /api/v1/onboarding/progress
Returns current onboarding state for the authenticated user.

### POST /api/v1/onboarding/step2
Update basic profile. Detects London from location text or UK postcode. Sets onboarding_step = 3.

### POST /api/v1/onboarding/step3
Set orientation and matching preferences. Sets onboarding_step = 4.

### POST /api/v1/users/{user_id}/photos
Upload profile photo (multipart). Runs DeepFace.analyze() once. Sets in_matching_pool = true. Sets onboarding_step = 5.

### POST /api/v1/questionnaire/submit-all
Submit all 6 responses. Triggers Gemini scoring pipeline (42 calls: 6 questions × 7 sins). Sets onboarding_step = 6.

### POST /api/v1/visual/calibrate
Submit a face rating. Triggers MetaFBP adaptation when support set spans 5 score classes.

### POST /api/v1/onboarding/step7
Submit DNA kit address (London users only). Sets onboarding_step = 8.

## Key Constants

| Constant | Value |
|---|---|
| CALIBRATION_REAL_USER_COUNT | 5 |
| CALIBRATION_MINIMUM_RATINGS | 5 |
| GRADUATION_THRESHOLD | 12 |
| MIN_WORDS | 25 |
| MAX_WORDS | 150 |
| INNER_LOOP_STEPS (k) | 10 |
| DNA_KIT_TOTAL | 200 |
| CALIBRATION_REMINDER_HOURS | 48 |

## Database

```sql
ALTER TABLE users ADD COLUMN onboarding_step INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN orientation VARCHAR(20);
ALTER TABLE users ADD COLUMN match_preference VARCHAR(20);
ALTER TABLE users ADD COLUMN in_matching_pool BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN calibration_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN questionnaire_complete BOOLEAN DEFAULT FALSE;

CREATE TABLE kit_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'waitlisted',
  full_name VARCHAR(255),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  postcode VARCHAR(20),
  phone_number VARCHAR(50),
  confirmed_at TIMESTAMPTZ,
  dispatched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
