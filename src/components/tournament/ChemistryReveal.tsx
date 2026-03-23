'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Dna } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GeneticsIndicator } from './GeneticsIndicator'
import type { TournamentCandidateLocal } from '@/hooks/useTournament'

// Warm, accessible copy — no genetics jargon
const TIER_COPY = {
  strong: {
    headline: 'Strong biological chemistry',
    body: 'Your immune system profiles are highly complementary — a strong indicator of natural attraction and long-term compatibility.',
    accent: '#4CAF50',
  },
  good: {
    headline: 'Good chemistry signal',
    body: 'A meaningful overlap in immune genetics — the kind of subtle pull you might not be able to put your finger on, but your body notices.',
    accent: '#FF9800',
  },
  some: {
    headline: 'Some chemistry detected',
    body: 'A degree of biological compatibility. Every connection is multifaceted, and genetics is just one layer of many.',
    accent: '#9E9E9E',
  },
} as const

interface ChemistryRevealProps {
  candidate: TournamentCandidateLocal
  onClose: () => void
  onViewDuration?: (ms: number) => void
  className?: string
}

export function ChemistryReveal({
  candidate,
  onClose,
  onViewDuration,
  className,
}: ChemistryRevealProps) {
  const openTimeRef = useRef<number>(Date.now())
  const reportedRef = useRef<boolean>(false)

  const handleClose = useCallback(() => {
    if (!reportedRef.current) {
      reportedRef.current = true
      onViewDuration?.(Date.now() - openTimeRef.current)
    }
    onClose()
  }, [onClose, onViewDuration])

  // Track open time; report duration on unmount if close button wasn't used
  useEffect(() => {
    openTimeRef.current = Date.now()
    return () => {
      if (!reportedRef.current) {
        reportedRef.current = true
        onViewDuration?.(Date.now() - openTimeRef.current)
      }
    }
  }, [onViewDuration])

  // Escape key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  // Hard rule: never render for hidden tier or missing data
  const { hlaDisplayTier, hlaScore } = candidate
  if (!hlaDisplayTier || hlaDisplayTier === 'hidden' || hlaScore === null) return null
  if (!(hlaDisplayTier in TIER_COPY)) return null

  const tierCfg = TIER_COPY[hlaDisplayTier as keyof typeof TIER_COPY]

  // Bar fills proportionally within the visible range (25–100)
  const barPct = Math.min(100, Math.max(0, ((hlaScore - 25) / 75) * 100))

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-wine-black/60 z-20"
        onClick={handleClose}
      />

      {/* Panel — slides up on mount via animate-slide-up */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 z-30 bg-dark-surface rounded-b-card p-4',
          'animate-slide-up',
          className,
        )}
      >
        {/* Handle */}
        <div className="w-8 h-1 bg-dark-border rounded-full mx-auto mb-3" />

        {/* Header row */}
        <div className="flex items-center gap-2 mb-3">
          <Dna className="w-4 h-4 flex-shrink-0" style={{ color: tierCfg.accent }} />
          <p className="text-body-sm font-semibold text-cream">{tierCfg.headline}</p>
        </div>

        {/* Chemistry bar */}
        <div className="mb-3">
          <div className="h-1.5 rounded-full bg-dark-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${barPct}%`, backgroundColor: tierCfg.accent }}
            />
          </div>
          <p className="text-[10px] text-slate mt-1 text-right">{hlaScore}% signal</p>
        </div>

        {/* Expanded indicator badge */}
        <div className="mb-4">
          <GeneticsIndicator
            hlaScore={hlaScore}
            hlaDisplayTier={hlaDisplayTier}
            variant="expanded"
          />
        </div>

        {/* Copy */}
        <p className="text-caption text-cream/70 mb-4">{tierCfg.body}</p>

        {/* Close hint */}
        <button
          onClick={handleClose}
          className="w-full text-caption text-slate text-center pt-1 hover:text-gold transition-colors"
        >
          Tap anywhere to close
        </button>
      </div>
    </>
  )
}
