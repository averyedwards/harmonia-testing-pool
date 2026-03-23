'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { HeartDisplay } from './HeartDisplay'
import { PersonalityReveal } from './PersonalityReveal'
import { GeneticsIndicator } from './GeneticsIndicator'
import { ChemistryReveal } from './ChemistryReveal'
import type { TournamentCandidateLocal } from '@/hooks/useTournament'

type CardState = 'default' | 'selected' | 'not_selected'

interface TournamentCardProps {
  candidate: TournamentCandidateLocal
  state: CardState
  onSelect: () => void
  showGenetics?: boolean
  isPhase3?: boolean
  className?: string
}

// Placeholder avatar mapping
const AVATARS = [
  '/placeholders/avatar-m-20s-1.svg',
  '/placeholders/avatar-m-20s-2.svg',
  '/placeholders/avatar-m-30s-1.svg',
  '/placeholders/avatar-f-20s-1.svg',
  '/placeholders/avatar-f-20s-2.svg',
  '/placeholders/avatar-f-30s-1.svg',
]

function getAvatar(id: string) {
  const idx = parseInt(id.replace(/\D/g, ''), 10) % AVATARS.length
  return AVATARS[idx] ?? AVATARS[0]
}

export function TournamentCard({
  candidate,
  state,
  onSelect,
  showGenetics = false,
  isPhase3 = false,
  className,
}: TournamentCardProps) {
  const [revealOpen, setRevealOpen] = useState(false)
  const [chemistryOpen, setChemistryOpen] = useState(false)

  const isSelected = state === 'selected'
  const isNotSelected = state === 'not_selected'

  const canShowChemistry =
    isPhase3 &&
    showGenetics &&
    candidate.hlaDisplayTier &&
    candidate.hlaDisplayTier !== 'hidden' &&
    candidate.hlaScore !== null

  return (
    <div
      className={cn(
        'relative rounded-card overflow-hidden cursor-pointer select-none',
        'transition-all duration-300',
        'w-full',
        isSelected && 'ring-2 ring-gold shadow-gold-glow scale-[1.02]',
        isNotSelected && 'opacity-50 scale-[0.98]',
        !isSelected && !isNotSelected && 'hover:shadow-card-hover hover:-translate-y-0.5',
        className,
      )}
      onClick={() => {
        if (revealOpen || chemistryOpen) return
        onSelect()
      }}
    >
      {/* Photo area */}
      <div className="relative" style={{ aspectRatio: '4/5' }}>
        <img
          src={getAvatar(candidate.id)}
          alt={candidate.displayName}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-wine-black/80 via-wine-black/20 to-transparent" />

        {/* Genetics indicator — top right */}
        {showGenetics && candidate.hlaDisplayTier && candidate.hlaDisplayTier !== 'hidden' && (
          <div className="absolute top-3 right-3">
            {canShowChemistry ? (
              <button
                aria-label="View chemistry details"
                onClick={e => {
                  e.stopPropagation()
                  setChemistryOpen(true)
                }}
              >
                <GeneticsIndicator
                  hlaScore={candidate.hlaScore}
                  hlaDisplayTier={candidate.hlaDisplayTier}
                />
              </button>
            ) : (
              <GeneticsIndicator
                hlaScore={candidate.hlaScore}
                hlaDisplayTier={candidate.hlaDisplayTier}
              />
            )}
          </div>
        )}

        {/* Selected tick */}
        {isSelected && (
          <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-gold flex items-center justify-center shadow-gold-glow">
            <span className="text-wine-black text-sm font-bold">✓</span>
          </div>
        )}

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-heading text-h4 text-cream leading-tight">
                {candidate.displayName}, {candidate.age}
              </p>
              <p className="text-caption text-cream/60">{candidate.location}</p>
            </div>
            <HeartDisplay count={candidate.heartCount} size="sm" />
          </div>

          {/* Personality hint button */}
          <button
            className="mt-2 w-full text-caption text-gold/80 hover:text-gold transition-colors text-left flex items-center gap-1"
            onClick={e => {
              e.stopPropagation()
              setRevealOpen(true)
            }}
          >
            <span className="text-[10px]">✦</span>
            {candidate.perceivedSimilarity.headline} · tap to see
          </button>
        </div>

        {/* Personality reveal overlay */}
        <PersonalityReveal
          candidate={candidate}
          open={revealOpen}
          onClose={() => setRevealOpen(false)}
        />

        {/* Chemistry reveal overlay — conditionally mounted, Phase 3 only */}
        {chemistryOpen && canShowChemistry && (
          <ChemistryReveal
            candidate={candidate}
            onClose={() => setChemistryOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
