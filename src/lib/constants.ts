import type { Phase } from '@/types'

/** App-wide route constants */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  CALIBRATION: '/calibration',
  TOURNAMENT: '/tournament',
  TOURNAMENT_PHASE3: '/tournament-phase3',
  MATCH: (matchId: string) => `/match/${matchId}`,
  SURVEY: (matchId: string) => `/survey/${matchId}`,
  INSIGHTS: '/insights',
  INSIGHTS_PHASE1: '/insights/phase1',
  INSIGHTS_PHASE2: '/insights/phase2',
  INSIGHTS_PHASE3: '/insights/phase3',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_PHASES: '/admin/phases',
  ADMIN_KITS: '/admin/kits',
  ADMIN_GENDER_RATIO: '/admin/gender-ratio',
  ADMIN_EXPORT: '/admin/export',
} as const

/** Phase display labels */
export const PHASE_LABELS: Record<Phase, string> = {
  onboarding: 'Onboarding',
  phase1: 'Phase 1: Calibration',
  between_1_2: 'Between Phases',
  phase2: 'Phase 2: Tournament',
  between_2_3: 'Between Phases',
  phase3: 'Phase 3: Genetics',
  complete: 'Complete',
}

/** Seven Deadly Sins display metadata */
export const SIN_LABELS = {
  wrath: 'Wrath',
  sloth: 'Sloth',
  pride: 'Pride',
  lust: 'Lust',
  greed: 'Greed',
  gluttony: 'Gluttony',
  envy: 'Envy',
} as const

export const SIN_VIRTUE_LABELS = {
  wrath: 'Conflict avoidant',
  sloth: 'Proactive',
  pride: 'Humble',
  lust: 'Restrained',
  greed: 'Generous',
  gluttony: 'Moderate',
  envy: 'Content',
} as const

export const SIN_VICE_LABELS = {
  wrath: 'Confrontational',
  sloth: 'Avoidant',
  pride: 'Ego-driven',
  lust: 'Impulsive',
  greed: 'Materialistic',
  gluttony: 'Indulgent',
  envy: 'Competitive',
} as const

export const SIN_COLORS = {
  wrath: '#E74C3C',
  sloth: '#9B59B6',
  pride: '#D4A853',
  lust: '#E84A8A',
  greed: '#2ECC71',
  gluttony: '#F39C12',
  envy: '#3498DB',
} as const

/** Perceived similarity tier config */
export const SIMILARITY_TIERS = {
  strong_fit: {
    min: 0.6,
    headline: 'Strong personality match!',
    traitCount: 4,
  },
  good_fit: {
    min: 0.4,
    headline: 'You have a lot in common',
    traitCount: 3,
  },
  moderate_fit: {
    min: 0.25,
    headline: 'Some shared traits',
    traitCount: 2,
  },
  low_fit: {
    min: 0,
    headline: 'Different perspectives, potential spark',
    traitCount: 1,
  },
} as const

/** HLA chemistry display config */
export const HLA_TIERS = {
  strong: { min: 75, label: 'Strong chemistry signal', emphasis: 'high' },
  good: { min: 50, label: 'Good chemistry', emphasis: 'normal' },
  some: { min: 25, label: 'Some chemistry', emphasis: 'subtle' },
  hidden: { min: 0, label: '', emphasis: 'hidden' },
} as const

/** Tournament constants */
export const TOURNAMENT = {
  HEARTS_TO_MATCH: 3,
  MIN_POOL_SIZE: 6,
  MAX_PASS_BOTHS_PER_SESSION: 3,
  ELO_K: 20,
  ELO_START: 1000,
  ELO_RD: 400,
} as const

/** Questionnaire word limits */
export const QUESTIONNAIRE = {
  MIN_WORDS: 25,
  MAX_WORDS: 150,
  QUESTION_COUNT: 6,
} as const

/** Onboarding steps */
export const ONBOARDING_STEPS = [
  { step: 1, label: 'Email Verified', path: '/verify-email' },
  { step: 2, label: 'Basic Profile', path: '/onboarding?step=2' },
  { step: 3, label: 'Preferences', path: '/onboarding?step=3' },
  { step: 4, label: 'Photo', path: '/onboarding?step=4' },
  { step: 5, label: 'Personality', path: '/onboarding?step=5' },
  { step: 6, label: 'Calibration', path: '/onboarding?step=6' },
  { step: 7, label: 'DNA Kit', path: '/onboarding?step=7' },
] as const

/** DNA kit max allocation */
export const KIT_MAX = 200

/** App metadata */
export const APP_META = {
  NAME: 'Harmonia Testing Pool',
  SHORT_NAME: 'Harmonia',
  DESCRIPTION: 'Three-signal compatibility matching experiment',
  URL: 'https://app.harmoniaengine.com',
  THEME_COLOR: '#D4A853',
  BACKGROUND_COLOR: '#FAF6F1',
} as const
