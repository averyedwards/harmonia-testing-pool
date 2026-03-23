'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { SIMILARITY_TIERS } from '@/lib/constants'
import type { TournamentCandidateLocal } from '@/hooks/useTournament'
import { PersonalityRadarMini, RadarLegend } from './PersonalityRadarMini'
import type { SinScore } from '@/types'

// Mock user sins (in a real app these come from the logged-in user's profile)
const MOCK_USER_SINS: SinScore[] = [
  { sin: 'wrath', score: -2, confidence: 0.8 },
  { sin: 'sloth', score: 1, confidence: 0.75 },
  { sin: 'pride', score: 0, confidence: 0.7 },
  { sin: 'lust', score: 2, confidence: 0.65 },
  { sin: 'greed', score: -1, confidence: 0.9 },
  { sin: 'gluttony', score: 3, confidence: 0.6 },
  { sin: 'envy', score: -3, confidence: 0.85 },
]

// Mock candidate sins
function buildCandidateSins(similarity: TournamentCandidateLocal['perceivedSimilarity']): SinScore[] {
  // Build approximate sins based on shared traits
  return [
    { sin: 'wrath', score: -1, confidence: 0.7 },
    { sin: 'sloth', score: 2, confidence: 0.65 },
    { sin: 'pride', score: 1, confidence: 0.7 },
    { sin: 'lust', score: 1, confidence: 0.6 },
    { sin: 'greed', score: -2, confidence: 0.8 },
    { sin: 'gluttony', score: 2, confidence: 0.55 },
    { sin: 'envy', score: -2, confidence: 0.75 },
  ]
}

interface PersonalityRevealProps {
  candidate: TournamentCandidateLocal
  open: boolean
  onClose: () => void
  onViewStart?: () => void
  className?: string
}

export function PersonalityReveal({
  candidate,
  open,
  onClose,
  onViewStart,
  className,
}: PersonalityRevealProps) {
  const viewStartRef = useRef<number | null>(null)

  useEffect(() => {
    if (open) {
      viewStartRef.current = Date.now()
      onViewStart?.()
    }
  }, [open, onViewStart])

  const { perceivedSimilarity: ps } = candidate
  const tierConfig = SIMILARITY_TIERS[ps.tier]
  const displayTraits = ps.sharedTraits.slice(0, tierConfig.maxTraits)
  const candidateSins = buildCandidateSins(ps)

  const tierBadgeVariant: Record<string, 'success' | 'phase' | 'warning' | 'error'> = {
    strong_fit: 'success',
    good_fit: 'phase',
    moderate_fit: 'warning',
    low_fit: 'error',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-wine-black/60 z-20 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Panel — slides up from bottom of card */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 z-30 bg-dark-surface rounded-b-card p-4',
          'transition-transform duration-350 ease-out',
          open ? 'translate-y-0' : 'translate-y-full',
          className,
        )}
      >
        {/* Handle */}
        <div className="w-8 h-1 bg-dark-border rounded-full mx-auto mb-3" />

        {/* Headline + badge */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-body-sm font-semibold text-cream">{ps.headline}</p>
          <Badge variant={tierBadgeVariant[ps.tier] ?? 'phase'}>
            {ps.overlapCount}/7 traits
          </Badge>
        </div>

        {/* Shared traits */}
        <div className="space-y-1.5 mb-4">
          {displayTraits.map(trait => (
            <div key={trait.sin} className="flex items-start gap-2">
              <span className="text-gold mt-0.5 text-xs">♥</span>
              <p className="text-caption text-cream/80">{trait.description}</p>
            </div>
          ))}
        </div>

        {/* Radar */}
        <div className="flex items-center justify-center flex-col gap-1 mb-2">
          <PersonalityRadarMini
            userSins={MOCK_USER_SINS}
            candidateSins={candidateSins}
            size={160}
          />
          <RadarLegend />
        </div>

        {/* Close hint */}
        <button
          onClick={onClose}
          className="w-full text-caption text-slate text-center pt-1 hover:text-gold transition-colors"
        >
          Tap anywhere to close
        </button>
      </div>
    </>
  )
}
