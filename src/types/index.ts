// ============================================================
// HARMONIA TESTING POOL — TypeScript Types
// Covers every data structure discussed in planning conversations
// ============================================================

// --- USERS ---

export type Gender = 'male' | 'female'
export type Orientation = 'straight' | 'gay' | 'bisexual' | 'other'
export type UserType = 'london' | 'global'
export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  email: string
  displayName: string
  firstName: string
  lastName: string
  age: number
  gender: Gender
  orientation: Orientation | null // set during onboarding step 3, not signup
  location: string // free text city and country
  isLondon: boolean // computed from location
  phoneNumber: string
  photoUrl: string | null
  onboardingStep: number // 1-7
  calibrationComplete: boolean
  questionnaireComplete: boolean
  currentPhase: Phase
  role: UserRole
  createdAt: string
}

// --- PHASES ---

export type Phase = 'onboarding' | 'phase1' | 'between_1_2' | 'phase2' | 'between_2_3' | 'phase3' | 'complete'

export interface PhaseState {
  currentPhase: Phase
  phase2Unlocked: boolean
  phase3Unlocked: boolean // London users with DNA results only
  totalUsers: number
  usersCompletedCalibration: number
  usersRated12Plus: number // how many users have been rated 12+ times
  communityProgressPercent: number
}

// --- ONBOARDING ---

export interface OnboardingProgress {
  currentStep: number // 1-7
  stepsCompleted: boolean[]
  emailVerified: boolean
  basicProfileComplete: boolean
  orientationSet: boolean
  photoUploaded: boolean
  questionnaireComplete: boolean
  calibrationComplete: boolean
  addressSubmitted: boolean // London users only
}

// --- PERSONALITY ---

export type SinName = 'greed' | 'pride' | 'lust' | 'wrath' | 'gluttony' | 'envy' | 'sloth'

export interface SinScore {
  sin: SinName
  score: number // -5 to +5
  confidence: number // 0 to 1
}

export interface PersonalityProfile {
  userId: string
  sins: SinScore[]
  qualityScore: number // 0-100
  qualityTier: 'high' | 'moderate' | 'low' | 'rejected'
  createdAt: string
}

export interface PerceivedSimilarity {
  rawScore: number // 0 to 1
  adjustedScore: number // after quality multiplier
  tier: 'strong_fit' | 'good_fit' | 'moderate_fit' | 'low_fit'
  overlapCount: number // how many of 7 traits are shared direction
  sharedTraits: SharedTrait[]
  headline: string // "Strong personality match!" etc.
}

export interface SharedTrait {
  sin: SinName
  description: string // "You're both spontaneous and up for adventure"
  contribution: number
}

// --- SIN DISPLAY METADATA ---

export interface SinMetadata {
  name: SinName
  label: string
  virtueLabel: string // -5 end
  viceLabel: string // +5 end
  weight: number
  color: string // for radar chart segments
}

// Constant — used throughout the app
export const SIN_METADATA: SinMetadata[] = [
  { name: 'wrath', label: 'Wrath', virtueLabel: 'Conflict avoidant', viceLabel: 'Confrontational', weight: 1.5, color: '#E74C3C' },
  { name: 'sloth', label: 'Sloth', virtueLabel: 'Proactive', viceLabel: 'Avoidant', weight: 1.3, color: '#9B59B6' },
  { name: 'pride', label: 'Pride', virtueLabel: 'Humble', viceLabel: 'Ego-driven', weight: 1.2, color: '#D4A853' },
  { name: 'lust', label: 'Lust', virtueLabel: 'Restrained', viceLabel: 'Impulsive', weight: 1.0, color: '#E84A8A' },
  { name: 'greed', label: 'Greed', virtueLabel: 'Generous', viceLabel: 'Materialistic', weight: 0.9, color: '#2ECC71' },
  { name: 'gluttony', label: 'Gluttony', virtueLabel: 'Moderate', viceLabel: 'Indulgent', weight: 0.8, color: '#F39C12' },
  { name: 'envy', label: 'Envy', virtueLabel: 'Content', viceLabel: 'Competitive', weight: 0.7, color: '#3498DB' },
]

// --- QUESTIONNAIRE ---

export interface QuestionnaireQuestion {
  number: number // 1-6
  text: string
  domain: string
  primarySins: SinName[]
}

export const FELIX_QUESTIONS: QuestionnaireQuestion[] = [
  { number: 1, text: 'The bill arrives at a group dinner. Everyone contributed differently to the total. What\'s your approach?', domain: 'Resource sharing, fairness', primarySins: ['greed', 'wrath', 'pride', 'sloth'] },
  { number: 2, text: 'Your car needs a $1,200 repair you didn\'t budget for. Walk me through your thought process.', domain: 'Stress response, financial reasoning', primarySins: ['wrath', 'sloth', 'gluttony', 'pride'] },
  { number: 3, text: 'You have a completely free weekend with no obligations. How do you spend it?', domain: 'Leisure priorities', primarySins: ['lust', 'sloth', 'gluttony', 'envy'] },
  { number: 4, text: 'You\'re working on a group project where one person is contributing significantly less than everyone else. How do you handle this?', domain: 'Conflict handling, fairness', primarySins: ['wrath', 'pride', 'sloth', 'envy'] },
  { number: 5, text: 'Your best friend calls with an emergency the same night as a planned date you\'ve been looking forward to. What\'s your thinking process?', domain: 'Loyalty trade-offs', primarySins: ['lust', 'pride', 'sloth', 'wrath'] },
  { number: 6, text: 'Someone you respect gives you critical feedback about a blind spot they\'ve noticed in your behavior. How do you process and respond to this?', domain: 'Ego resilience, growth', primarySins: ['pride', 'wrath', 'sloth', 'envy'] },
]

// --- CALIBRATION (Phase 1) ---

export interface CalibrationFace {
  id: string
  imageUrl: string // placeholder avatar in prototype
  isRealUser: boolean // first 5 = true, rest = false
  source: 'testing_pool' | 'mebeauty' | 'us10k'
}

export interface FaceRating {
  faceId: string
  userId: string
  score: number // 1-5
  timestamp: string
}

export interface CalibrationProgress {
  totalRated: number
  realUsersRated: number // out of 5
  datasetFacesRated: number
  calibrationComplete: boolean
  minimumReached: boolean // >= 5 total
}

// --- TOURNAMENT (Phase 2 and 3) ---

export interface TournamentCandidate {
  id: string
  user: User
  personalityProfile: PersonalityProfile
  eloRating: number // starts at 1000
  heartCount: number // 0, 1, 2, or 3
  nComparisons: number // how many times shown in pairings
  matchConfirmed: boolean // true when heartCount reaches 3
  // Phase 3 only
  hlaScore: number | null // 0-100, null if no genetics data
  hlaDisplayTier: 'strong' | 'good' | 'some' | 'hidden' | null
}

export interface TournamentComparison {
  id: string
  candidateA: TournamentCandidate
  candidateB: TournamentCandidate
  perceivedSimilarityA: PerceivedSimilarity // between current user and candidate A
  perceivedSimilarityB: PerceivedSimilarity // between current user and candidate B
}

export interface ComparisonResult {
  comparisonId: string
  winnerId: string | null // null = pass both
  timeToDecisionMs: number
  personalityViewedBeforeChoice: boolean
  personalityViewDurationMs: number | null
  personalityViewedFor: 'a' | 'b' | 'both' | 'neither'
  encounterNumber: number // 1st, 2nd, 3rd+ time seeing this candidate
  passBothExplanation: string | null // text if pass both was selected
  sessionId: string
  timestamp: string
}

export interface TournamentState {
  userId: string
  phase: 'phase2' | 'phase3'
  candidates: TournamentCandidate[]
  completedComparisons: number
  totalPossibleComparisons: number
  passBothsUsed: number // max 3 per session
  passBothsRemaining: number
  sessionId: string
  poolSufficient: boolean // true if mutual pool >= 6
}

// Elo system constants (from CurmElo: Sankaran et al. 2021)
export const ELO_K = 20
export const ELO_R0 = 1000
export const ELO_RD = 400

// --- MATCHES AND CONTACT EXCHANGE ---

export type ContactType = 'phone' | 'instagram' | 'email' | 'prefer_not_to_share'

export interface ConfirmedMatch {
  matchId: string
  userA: User
  userB: User
  perceivedSimilarity: PerceivedSimilarity
  hlaScore: number | null // Phase 3 only
  confirmedAt: string
  contactExchanged: boolean
  contactTypeA: ContactType | null // what user A shared
  contactTypeB: ContactType | null // what user B shared
}

export interface WeMelSurveyResponse {
  matchId: string
  userId: string
  didMeet: boolean
  interestScore: number // 1-7 Likert
  orientation: 'short_term' | 'long_term' | 'not_sure' | null
  submittedAt: string
}

// --- INSIGHTS REPORTS ---

export interface Phase1Insights {
  userId: string
  visualPreferences: VisualPreferenceProfile
  personalityProfile: PersonalityProfile
  calibrationStats: {
    totalFacesRated: number
    averageRating: number
    ratingDistribution: Record<number, number> // score -> count
  }
}

export interface VisualPreferenceProfile {
  topTraitCorrelations: TraitCorrelation[]
  summary: string // "You tend to prefer..."
}

export interface TraitCorrelation {
  trait: string // e.g. "glasses", "dark_hair"
  correlation: number // -1 to +1
  direction: 'positive' | 'negative'
  description: string // "You rated people with glasses higher"
}

export interface Phase2Insights {
  userId: string
  tournamentStats: {
    totalComparisons: number
    averageDecisionTimeMs: number
    personalityClickRate: number // % of comparisons where personality was viewed
    passBothCount: number
  }
  personalityInfluence: {
    choicesWithPersonalityViewed: number
    choicesWithoutPersonalityViewed: number
    selectionShiftPercent: number // how much personality changed selections
    summary: string
  }
  crossPhaseComparison: {
    phase1TopTraits: string[]
    phase2TopTraits: string[]
    shiftDescription: string // "Your preferences shifted toward..."
  }
  matchOutcomes: ConfirmedMatch[]
  eloRankings: { candidateId: string; eloRating: number; heartCount: number }[]
}

export interface Phase3Insights extends Phase2Insights {
  geneticsInfluence: {
    matchesWithHighHLA: number
    matchesWithLowHLA: number
    hlaInfluenceDescription: string
  }
  postMeetupFeedback: WeMelSurveyResponse[]
  fullCrossPhaseComparison: {
    phase1: string[]
    phase2: string[]
    phase3: string[]
    overallShiftDescription: string
  }
}

// --- DNA KIT TRACKING ---

export type KitStatus = 'waitlisted' | 'confirmed' | 'dispatched' | 'received' | 'results_uploaded'

export interface KitAllocation {
  userId: string
  status: KitStatus
  genderQueuePosition: number | null
  confirmedAt: string | null
  address: KitAddress | null
  kitReceivedAt: string | null
  resultsUploadedAt: string | null
  phase3Unlocked: boolean
}

export interface KitAddress {
  fullName: string
  addressLine1: string
  addressLine2: string | null
  city: string
  postcode: string
  phoneNumber: string
}

// --- ADMIN ---

export interface AdminDashboard {
  totalUsers: number
  usersByPhase: Record<Phase, number>
  londonUsers: number
  globalUsers: number
  genderRatio: { male: number; female: number }
  kitsAllocated: number
  kitsDispatched: number
  kitsReceived: number
  resultsUploaded: number
  waitlistSize: number
  calibrationCompletionRate: number
  questionnaireCompletionRate: number
}

export interface PhaseReadiness {
  phase: 'phase2' | 'phase3'
  usersReady: number
  usersNotReady: number
  readinessPercent: number
  blockers: string[] // e.g. "23 users have not completed calibration"
  canTransition: boolean
}

// --- NOTIFICATIONS ---

export type NotificationType =
  | 'phase_transition'
  | 'match_confirmed'
  | 'calibration_reminder'
  | 'insights_ready'
  | 'we_met_survey'
  | 'community_update'
  | 'kit_status_update'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  createdAt: string
  actionUrl: string | null
}

// --- DEV MODE ---

export interface DevModeState {
  enabled: boolean
  currentPhase: Phase
  userType: 'london_with_kit' | 'global' | 'admin' | 'late_arrival'
  showEloOverlay: boolean
  simulatedHeartCounts: Record<string, number>
  simulatedEloScores: Record<string, number>
}
