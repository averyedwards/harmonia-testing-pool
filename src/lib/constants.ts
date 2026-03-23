import { type SinName, type Phase } from '@/types'

// --- PHASE LABELS ---

export const PHASE_LABELS: Record<Phase, string> = {
  onboarding: 'Getting Started',
  phase1: 'Phase 1: Calibration',
  between_1_2: 'Awaiting Phase 2',
  phase2: 'Phase 2: Tournament',
  between_2_3: 'Awaiting Phase 3',
  phase3: 'Phase 3: Genetics',
  complete: 'Complete',
}

export const PHASE_DESCRIPTIONS: Record<Phase, string> = {
  onboarding: 'Set up your profile and teach us your preferences.',
  phase1: 'Rate faces to build your personalised visual model.',
  between_1_2: 'Your calibration is complete. Phase 2 launches soon.',
  phase2: 'Compare matches and discover who you connect with.',
  between_2_3: 'Phase 2 complete. Phase 3 launches for London participants.',
  phase3: 'Genetics added. See how chemistry changes your choices.',
  complete: 'All phases complete. View your full insights report.',
}

// --- ONBOARDING ---

export const ONBOARDING_STEPS = [
  { number: 1, label: 'Verify Email', shortLabel: 'Email', estimatedTime: '1 min' },
  { number: 2, label: 'Basic Profile', shortLabel: 'Profile', estimatedTime: '30 sec' },
  { number: 3, label: 'Preferences', shortLabel: 'Prefs', estimatedTime: '30 sec' },
  { number: 4, label: 'Upload Photo', shortLabel: 'Photo', estimatedTime: '1 min' },
  { number: 5, label: 'Personality', shortLabel: 'Questions', estimatedTime: '5-10 min' },
  { number: 6, label: 'Face Calibration', shortLabel: 'Calibrate', estimatedTime: '2-3 min' },
  { number: 7, label: 'DNA Kit Address', shortLabel: 'Address', estimatedTime: '1 min' },
] as const

export const ONBOARDING_MATCHING_POOL_STEP = 4 // user enters matching pool after this step

// --- QUESTIONNAIRE ---

export const MIN_WORDS = 25
export const MAX_WORDS = 150

// --- CALIBRATION ---

export const CALIBRATION_REAL_USER_COUNT = 5 // first 5 faces are real testing pool users
export const CALIBRATION_MINIMUM_RATINGS = 5
export const GRADUATION_THRESHOLD = 12 // ratings needed before face graduates from testing pool

// --- TOURNAMENT ---

export const HEARTS_TO_MATCH = 3
export const PASS_BOTH_MAX_PER_SESSION = 3
export const MUTUAL_POOL_THRESHOLD = 3.5 // MetaFBP predicted score threshold for mutual pool
export const MUTUAL_POOL_FALLBACK_THRESHOLD = 3.0 // if pool < 6 at 3.5
export const MUTUAL_POOL_MINIMUM_SIZE = 6 // below this, show pool-building UI

// Elo constants (CurmElo: Sankaran et al. 2021)
export const ELO_K = 20
export const ELO_R0 = 1000
export const ELO_RD = 400
export const ELO_CONVERGENCE_TARGET = 30 // comparisons per candidate for stable ranking

// --- PERSONALITY DISPLAY ---

export const SIMILARITY_TIERS = {
  strong_fit: { threshold: 0.60, headline: 'Strong personality match!', maxTraits: 4 },
  good_fit: { threshold: 0.40, headline: 'You have a lot in common', maxTraits: 3 },
  moderate_fit: { threshold: 0.25, headline: 'Some shared traits', maxTraits: 2 },
  low_fit: { threshold: 0, headline: 'Different perspectives, potential spark', maxTraits: 1 },
} as const

export const SIN_WEIGHTS: Record<SinName, number> = {
  wrath: 1.5,
  sloth: 1.3,
  pride: 1.2,
  lust: 1.0,
  greed: 0.9,
  gluttony: 0.8,
  envy: 0.7,
}

export const SIN_COLORS: Record<SinName, string> = {
  wrath: '#E74C3C',
  sloth: '#9B59B6',
  pride: '#D4A853',
  lust: '#E84A8A',
  greed: '#2ECC71',
  gluttony: '#F39C12',
  envy: '#3498DB',
}

export const SIN_LABELS: Record<SinName, { virtue: string; vice: string }> = {
  wrath: { virtue: 'Conflict avoidant', vice: 'Confrontational' },
  sloth: { virtue: 'Proactive', vice: 'Avoidant' },
  pride: { virtue: 'Humble', vice: 'Ego-driven' },
  lust: { virtue: 'Restrained', vice: 'Impulsive' },
  greed: { virtue: 'Generous', vice: 'Materialistic' },
  gluttony: { virtue: 'Moderate', vice: 'Indulgent' },
  envy: { virtue: 'Content', vice: 'Competitive' },
}

// --- HLA DISPLAY ---

export const HLA_DISPLAY_TIERS = {
  strong: { minScore: 75, label: 'Strong chemistry signal', color: '#4CAF50' },
  good: { minScore: 50, label: 'Good chemistry', color: '#FF9800' },
  some: { minScore: 25, label: 'Some chemistry', color: '#9E9E9E' },
  hidden: { minScore: 0, label: '', color: 'transparent' }, // never show negative
} as const

export function getHlaDisplayTier(score: number | null): keyof typeof HLA_DISPLAY_TIERS {
  if (score === null) return 'hidden'
  if (score >= 75) return 'strong'
  if (score >= 50) return 'good'
  if (score >= 25) return 'some'
  return 'hidden'
}

// --- WTM WEIGHTS (V4.1 corrected) ---

export const WTM_WEIGHTS = {
  visual: 0.60,
  personality: 0.30,
  genetics: 0.10,
} as const

export const WTM_WEIGHTS_NO_HLA = {
  visual: 0.67, // 60/90 * 100
  personality: 0.33, // 30/90 * 100
  genetics: 0,
} as const

// --- "WE MET" SURVEY ---

export const WE_MET_TRIGGER_DAYS = 4 // days after contact exchange
export const WE_MET_INTEREST_SCALE_MIN = 1
export const WE_MET_INTEREST_SCALE_MAX = 7

// --- CONTACT TYPES ---

export const CONTACT_TYPE_LABELS = {
  phone: 'Phone Number',
  instagram: 'Instagram',
  email: 'Email Address',
  prefer_not_to_share: 'Prefer not to share yet',
} as const
