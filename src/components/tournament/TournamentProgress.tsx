'use client'

import { cn } from '@/lib/utils'
import { HeartDisplay } from './HeartDisplay'
import { HEARTS_TO_MATCH } from '@/lib/constants'
import type { TournamentCandidateLocal } from '@/hooks/useTournament'

interface TournamentProgressProps {
  candidates: TournamentCandidateLocal[]
  totalComparisons: number
  passBothsRemaining: number
  className?: string
}

export function TournamentProgress({
  candidates,
  totalComparisons,
  passBothsRemaining,
  className,
}: TournamentProgressProps) {
  const confirmed = candidates.filter(c => c.matchConfirmed)
  const active = candidates.filter(c => !c.matchConfirmed && c.heartCount > 0)
  const unseen = candidates.filter(c => !c.matchConfirmed && c.heartCount === 0)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="harmonia-card p-3 text-center">
          <p className="font-heading text-h3 text-gold">{totalComparisons}</p>
          <p className="text-caption text-slate">comparisons</p>
        </div>
        <div className="harmonia-card p-3 text-center">
          <p className="font-heading text-h3 text-gold">{confirmed.length}</p>
          <p className="text-caption text-slate">matches</p>
        </div>
        <div className="harmonia-card p-3 text-center">
          <p className="font-heading text-h3 text-gold">{passBothsRemaining}</p>
          <p className="text-caption text-slate">passes left</p>
        </div>
      </div>

      {/* Confirmed matches */}
      {confirmed.length > 0 && (
        <div>
          <p className="text-caption text-gold uppercase tracking-wide mb-2">Your Matches</p>
          <div className="space-y-2">
            {confirmed.map(c => (
              <div key={c.id} className="harmonia-card p-3 flex items-center justify-between">
                <div>
                  <p className="text-body-sm font-semibold text-navy dark:text-cream">
                    {c.displayName}, {c.age}
                  </p>
                  <p className="text-caption text-slate">{c.perceivedSimilarity.headline}</p>
                </div>
                <HeartDisplay count={HEARTS_TO_MATCH} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active candidates (partial hearts) */}
      {active.length > 0 && (
        <div>
          <p className="text-caption text-slate uppercase tracking-wide mb-2">In the running</p>
          <div className="space-y-2">
            {active.map(c => (
              <div key={c.id} className="harmonia-card p-3 flex items-center justify-between">
                <p className="text-body-sm text-navy dark:text-cream">
                  {c.displayName}, {c.age}
                </p>
                <HeartDisplay count={c.heartCount} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Elo ranking hint */}
      <div className="harmonia-card p-3">
        <p className="text-caption text-gold uppercase tracking-wide mb-2">Rankings</p>
        <div className="space-y-1">
          {[...candidates]
            .sort((a, b) => b.eloRating - a.eloRating)
            .slice(0, 5)
            .map((c, i) => (
              <div key={c.id} className="flex items-center gap-2">
                <span className="text-caption text-slate w-4">{i + 1}.</span>
                <span className="text-caption text-navy dark:text-cream flex-1">
                  {c.displayName}
                </span>
                <span className="text-caption text-gold font-semibold">{c.eloRating}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
