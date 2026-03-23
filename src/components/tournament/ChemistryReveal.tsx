'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Dna, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GeneticsIndicator } from './GeneticsIndicator'
import type { TournamentCandidateLocal } from '@/hooks/useTournament'

// Fix A — spec-compliant tier copy
const TIER_COPY = {
  strong: {
    headline: 'Exceptional chemistry',
    body: 'Your chemistry is off the charts. Your genetic profiles complement each other in ways that go beyond the visible.',
    accent: '#4CAF50',
  },
  good: {
    headline: 'Good chemistry',
    body: 'Good chemistry here. Your genetic profiles have meaningful compatibility that could enhance your connection.',
    accent: '#FF9800',
  },
  some: {
    headline: 'Some chemistry',
    body: 'Some chemistry detected. Genetic compatibility is just one piece of the puzzle. Visual attraction and personality often matter more in the early stages of connection.',
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
  const closeRef = useRef<HTMLButtonElement>(null) // Fix C4 — auto-focus ref

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
    closeRef.current?.focus() // Fix C4 — auto-focus X button on mount
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

  // Fix B — raw score as bar percentage (38 → 38% width)
  const barPct = Math.min(100, Math.max(0, hlaScore))

  return (
    <>
      {/* Fix C2 — backdrop removed; close via X button or Escape only */}

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

        {/* Fix C3 — Header row with X close button */}
        <div className="flex items-center gap-2 mb-3">
          <Dna className="w-4 h-4 flex-shrink-0" style={{ color: tierCfg.accent }} />
          <p className="text-body-sm font-semibold text-cream">{tierCfg.headline}</p>
          <button
            ref={closeRef}
            onClick={handleClose}
            className="ml-auto p-1 text-slate hover:text-cream transition-colors"
            aria-label="Close chemistry view"
          >
            <X size={16} />
          </button>
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
        <p className="text-caption text-cream/70">{tierCfg.body}</p>
      </div>
    </>
  )
}
