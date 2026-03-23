# Calibration Backend Specification

**Module:** Phase 1 Face Calibration
**For:** Abe (backend implementation)

## Overview

Standalone calibration page at /calibration. Three states: not started, in progress, complete. Extends onboarding spec with progress and preferences endpoints.

## Endpoints

### GET /api/v1/visual/calibration-progress
Returns current calibration state for the authenticated user.

**Response:**
```json
{
  "totalRated": 12,
  "minimumReached": true,
  "calibrationComplete": false,
  "distribution": { "1": 2, "2": 3, "3": 4, "4": 2, "5": 1 },
  "averageRating": 2.9,
  "detectedPreferences": [
    { "trait": "glasses", "correlation": 0.72, "direction": "positive", "description": "You rated people with glasses higher" }
  ]
}
```

### POST /api/v1/visual/calibrate
Submit a face rating (same as onboarding, reused here).

### POST /api/v1/visual/complete-calibration
Mark calibration as complete. Sets calibration_complete = true on user record.

## Rating Distribution Spread Quality

Warn user if spread is poor:
- 4+ score classes filled: "Good spread"
- 2-3 classes: warn about skew
- 1 class: encourage more diversity

## Community Progress

GET /api/v1/stats/community-progress returns:
```json
{ "calibrationCompletionRate": 0.73 }
```
