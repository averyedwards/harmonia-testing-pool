/**
 * Harmonia API Client
 *
 * Typed stub functions for every backend endpoint defined in docs/backend-specs/.
 * All functions currently return mock data. To connect a real backend, replace
 * the return values with `fetch` calls to the corresponding API routes.
 *
 * Base URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1'
 *
 * Auth: every request must include a session token (HttpOnly cookie, managed
 * automatically by the browser once the auth endpoints are live).
 */

import type {
  User,
  Phase,
  ContactType,
} from '@/types'

// ---------------------------------------------------------------------------
// Types (mirror the response shapes in the backend specs)
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

// Auth
export interface LoginRequest { email: string; password: string }
export interface LoginResponse { user: User; sessionToken: string }
export interface RegisterRequest { email: string; password: string; displayName: string }
export interface RegisterResponse { userId: string; email: string }

// Calibration
export interface FaceRatingSubmission { faceId: string; score: number; timestamp: string }
export interface CalibrationStateResponse {
  totalRated: number
  minimumReached: boolean
  complete: boolean
  ratings: FaceRatingSubmission[]
}

// Tournament
export interface TournamentPairingResponse {
  pairingId: string
  candidateA: TournamentCandidateResponse
  candidateB: TournamentCandidateResponse
}
export interface TournamentCandidateResponse {
  id: string
  userId: string
  displayName: string
  age: number
  location: string
  eloRating: number
  heartCount: number
  nComparisons: number
  matchConfirmed: boolean
  hlaScore: number | null
  hlaDisplayTier: 'strong' | 'good' | 'some' | 'hidden' | null
  perceivedSimilarity: {
    rawScore: number
    adjustedScore: number
    tier: string
    overlapCount: number
    headline: string
    sharedTraits: { sin: string; description: string }[]
  }
}
export interface TournamentResultRequest {
  pairingId: string
  winnerId: string
  loserId: string
  viewedPersonality: boolean
  timeSpentMs: number
}
export interface TournamentStateResponse {
  candidates: TournamentCandidateResponse[]
  confirmedMatches: ConfirmedMatchSummary[]
  totalComparisons: number
  passBothUsed: number
  poolSufficient: boolean
}
export interface ConfirmedMatchSummary {
  matchId: string
  candidateId: string
  displayName: string
  confirmedAt: string
  heartCount: number
}

// Match
export interface MatchDetailResponse {
  matchId: string
  candidateUserId: string
  displayName: string
  age: number
  location: string
  confirmedAt: string
  heartCount: number
  hlaScore: number | null
  hlaDisplayTier: string | null
  perceivedSimilarity: TournamentCandidateResponse['perceivedSimilarity']
  contactExchanged: boolean
  mySubmissionStatus: 'pending' | 'submitted' | 'resolved'
}
export interface ContactSubmitRequest { contactType: ContactType; contactValue?: string }
export interface ContactSubmitResponse {
  status: 'submitted' | 'resolved'
  resolved: boolean
  partnerContactType: ContactType | null
  partnerContactValue: string | null
}

// Survey
export interface WeMetSurveyRequest {
  matchId: string
  didMeet: boolean
  interestScore?: number
  orientation?: 'short_term' | 'long_term'
}

// Insights
export interface InsightsPhase1Response {
  userId: string
  generatedAt: string
  calibrationStats: { facesRated: number; avgRating: number; qualityScore: number }
  ratingDistribution: Record<string, number>
  ratingSpreadLabel: string
  visualPreferences: {
    summary: string
    traits: { label: string; direction: 'positive' | 'negative'; percentEffect: number; description: string }[]
  }
  personalityProfile: {
    qualityTier: string
    sins: Record<string, number>
    communityAverage: Record<string, number>
  }
  sinPositions: { sin: string; userPercentile: number; label: string; position: string }[]
}
export interface InsightsPhase2Response {
  userId: string
  generatedAt: string
  tournamentStats: {
    totalComparisons: number
    matchRate: number
    avgHeartsBefore: number
    topEloRank: number
  }
  personalityInfluence: { sin: string; effectLabel: string; effectStrength: number; direction: string }[]
  crossPhaseComparison: { calibrationAvgAttraction: number; tournamentAvgAttraction: number; shift: string; interpretation: string }
  eloRankings: { candidateId: string; displayName: string; age: number; eloRating: number; heartCount: number; matched: boolean }[]
  confirmedMatches: ConfirmedMatchSummary[]
}

// Notifications
export interface NotificationResponse {
  id: string
  type: string
  title: string
  body: string
  actionUrl: string
  read: boolean
  createdAt: string
}
export interface NotificationsListResponse {
  notifications: NotificationResponse[]
  unreadCount: number
  total: number
}

// Admin
export interface AdminStatsResponse {
  totalUsers: number
  maleCount: number
  femaleCount: number
  nonBinaryCount: number
  londonCount: number
  globalCount: number
  byPhase: Record<Phase, number>
  completionRates: Record<string, number>
  dnaKits: { ordered: number; dispatched: number; received: number; processed: number; failed: number }
}

// ---------------------------------------------------------------------------
// Base client
// ---------------------------------------------------------------------------

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1'

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const authApi = {
  login: (req: LoginRequest) =>
    request<LoginResponse>('POST', '/auth/login', req),

  register: (req: RegisterRequest) =>
    request<RegisterResponse>('POST', '/auth/register', req),

  logout: () =>
    request<void>('POST', '/auth/logout'),

  resendVerification: (email: string) =>
    request<void>('POST', '/auth/resend-verification', { email }),

  requestPasswordReset: (email: string) =>
    request<void>('POST', '/auth/forgot-password', { email }),

  me: () =>
    request<User>('GET', '/auth/me'),
}

// ---------------------------------------------------------------------------
// Calibration
// ---------------------------------------------------------------------------

export const calibrationApi = {
  getState: () =>
    request<CalibrationStateResponse>('GET', '/calibration/state'),

  submitRating: (rating: FaceRatingSubmission) =>
    request<void>('POST', '/calibration/rate', rating),

  complete: () =>
    request<void>('POST', '/calibration/complete'),
}

// ---------------------------------------------------------------------------
// Tournament
// ---------------------------------------------------------------------------

export const tournamentApi = {
  getState: (phase: 'phase2' | 'phase3' = 'phase2') =>
    request<TournamentStateResponse>('GET', `/tournament/state?phase=${phase}`),

  getNextPairing: (phase: 'phase2' | 'phase3' = 'phase2') =>
    request<TournamentPairingResponse>('GET', `/tournament/pairing?phase=${phase}`),

  submitResult: (result: TournamentResultRequest) =>
    request<{ newMatchCandidate?: TournamentCandidateResponse }>('POST', '/tournament/result', result),

  passBoth: (pairingId: string, explanation?: string) =>
    request<void>('POST', '/tournament/pass-both', { pairingId, explanation }),
}

// ---------------------------------------------------------------------------
// Matches
// ---------------------------------------------------------------------------

export const matchApi = {
  list: () =>
    request<{ matches: MatchDetailResponse[] }>('GET', '/matches'),

  get: (matchId: string) =>
    request<MatchDetailResponse>('GET', `/matches/${matchId}`),

  submitContact: (matchId: string, req: ContactSubmitRequest) =>
    request<ContactSubmitResponse>('POST', `/matches/${matchId}/contact`, req),
}

// ---------------------------------------------------------------------------
// We Met Survey
// ---------------------------------------------------------------------------

export const surveyApi = {
  submit: (req: WeMetSurveyRequest) =>
    request<void>('POST', '/survey/we-met', req),

  getStatus: (matchId: string) =>
    request<{ completed: boolean; submittedAt?: string }>('GET', `/survey/we-met/${matchId}`),
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

export const insightsApi = {
  phase1: () =>
    request<InsightsPhase1Response>('GET', '/insights/phase1'),

  phase2: () =>
    request<InsightsPhase2Response>('GET', '/insights/phase2'),

  phase3: () =>
    request<InsightsPhase2Response & { geneticsInfluence: unknown; wemetOutcomes: unknown[] }>('GET', '/insights/phase3'),
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const notificationsApi = {
  list: (params?: { limit?: number; offset?: number; unreadOnly?: boolean }) => {
    const q = new URLSearchParams()
    if (params?.limit) q.set('limit', String(params.limit))
    if (params?.offset) q.set('offset', String(params.offset))
    if (params?.unreadOnly) q.set('unread_only', 'true')
    return request<NotificationsListResponse>('GET', `/notifications?${q}`)
  },

  markRead: (id: string) =>
    request<void>('PATCH', `/notifications/${id}/read`),

  markAllRead: () =>
    request<{ updated: number }>('POST', '/notifications/mark-all-read'),

  unreadCount: () =>
    request<{ count: number }>('GET', '/notifications/unread-count'),
}

// ---------------------------------------------------------------------------
// Admin (requires role = 'admin')
// ---------------------------------------------------------------------------

export const adminApi = {
  stats: () =>
    request<AdminStatsResponse>('GET', '/admin/stats'),

  phaseReadiness: () =>
    request<unknown>('GET', '/admin/phase/readiness'),

  transitionPhase: (targetPhase: Phase, cohort: 'all' | 'london' | 'global' = 'all') =>
    request<{ usersAdvanced: number; notificationsQueued: number; transitionId: string }>(
      'POST', '/admin/phase/transition', { targetPhase, cohort }
    ),

  forceUserPhase: (userId: string, phase: Phase) =>
    request<void>('POST', '/admin/phase/force-user', { userId, phase }),

  users: (params?: { phase?: Phase; isLondon?: boolean; q?: string; limit?: number; offset?: number }) => {
    const q = new URLSearchParams()
    if (params?.phase) q.set('phase', params.phase)
    if (params?.isLondon !== undefined) q.set('isLondon', String(params.isLondon))
    if (params?.q) q.set('q', params.q)
    if (params?.limit) q.set('limit', String(params.limit))
    if (params?.offset) q.set('offset', String(params.offset))
    return request<PaginatedResponse<User>>('GET', `/admin/users?${q}`)
  },

  updateUser: (userId: string, updates: Partial<User>) =>
    request<User>('PATCH', `/admin/users/${userId}`, updates),

  kits: (status?: string) => {
    const q = status ? `?status=${status}` : ''
    return request<unknown>('GET', `/admin/kits${q}`)
  },

  updateKit: (kitId: string, updates: { status: string; trackingCode?: string }) =>
    request<void>('PATCH', `/admin/kits/${kitId}`, updates),

  genderRatio: () =>
    request<unknown>('GET', '/admin/gender-ratio'),

  exportDataset: (datasets: string[], anonymise = true, format: 'csv' | 'json' = 'csv') =>
    request<{ exportId: string; status: string; estimatedReadyAt: string }>(
      'POST', '/admin/export', { datasets, anonymise, format }
    ),
}
