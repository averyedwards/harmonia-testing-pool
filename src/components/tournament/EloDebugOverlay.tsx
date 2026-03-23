'use client'

import { cn } from '@/lib/utils'
import type { TournamentCandidateLocal } from '@/hooks/useTournament'

interface EloDebugOverlayProps {
  candidates: TournamentCandidateLocal[]
  currentPairingIds: [string, string] | null
  sessionId: string
  className?: string
}

export function EloDebugOverlay({
  candidates,
  currentPairingIds,
  sessionId,
  className,
}: EloDebugOverlayProps) {
  const sorted = [...candidates].sort((a, b) => b.eloRating - a.eloRating)

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 w-64 rounded-card bg-wine-black/95 border border-dark-border p-3',
        'text-[10px] font-mono text-green-400',
        className,
      )}
    >
      <p className="text-gold font-semibold mb-1 text-xs">DEV: Elo Rankings</p>
      <p className="text-slate mb-2">Session: {sessionId.slice(-8)}</p>
      {sorted.map(c => {
        const isCurrent = currentPairingIds?.includes(c.id)
        return (
          <div
            key={c.id}
            className={cn(
              'flex items-center justify-between py-0.5',
              isCurrent && 'text-gold',
              c.matchConfirmed && 'text-green-400',
            )}
          >
            <span className="flex items-center gap-1">
              {c.matchConfirmed ? '✓' : isCurrent ? '►' : ' '}
              {c.displayName}
            </span>
            <span className="flex items-center gap-2">
              <span>{'♥'.repeat(c.heartCount)}</span>
              <span className="font-bold">{c.eloRating}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
