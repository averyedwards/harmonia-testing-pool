'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { HeartFillAnimation } from './HeartDisplay'
import { cn } from '@/lib/utils'
import type { TournamentCandidateLocal } from '@/hooks/useTournament'

interface MatchConfirmationProps {
  match: TournamentCandidateLocal
  onViewMatch: () => void
  onKeepGoing: () => void
}

export function MatchConfirmation({ match, onViewMatch, onKeepGoing }: MatchConfirmationProps) {
  const [stage, setStage] = useState<'enter' | 'hearts' | 'text' | 'buttons'>('enter')

  useEffect(() => {
    // Staggered entrance animation
    const timers = [
      setTimeout(() => setStage('hearts'), 300),
      setTimeout(() => setStage('text'), 1000),
      setTimeout(() => setStage('buttons'), 1500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-wine-black/90 backdrop-blur-sm animate-fade-in">
      <div
        className={cn(
          'relative max-w-sm w-full mx-4 text-center',
          'animate-slide-up',
        )}
      >
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full bg-gold/10 blur-3xl scale-150 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Match icon */}
          <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-6 shadow-gold-glow">
            <span className="text-4xl">✦</span>
          </div>

          <h2 className="font-heading text-h1 text-gold mb-2">It's a match!</h2>
          <p className="text-body text-cream/80 mb-6">
            You chose <strong className="text-cream">{match.displayName}</strong> three times.
            That's a confirmed match.
          </p>

          {/* Hearts */}
          <div
            className={cn(
              'flex justify-center mb-6 transition-opacity duration-500',
              stage === 'enter' ? 'opacity-0' : 'opacity-100',
            )}
          >
            <HeartFillAnimation onComplete={() => {}} />
          </div>

          {/* Personality headline */}
          <div
            className={cn(
              'harmonia-card p-4 mb-6 text-left transition-all duration-500',
              stage === 'text' || stage === 'buttons' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
            )}
          >
            <p className="text-caption text-gold uppercase tracking-wide mb-1">Personality match</p>
            <p className="text-body-sm text-slate">{match.perceivedSimilarity.headline}</p>
            {match.perceivedSimilarity.sharedTraits[0] && (
              <p className="text-caption text-slate mt-1">
                ♥ {match.perceivedSimilarity.sharedTraits[0].description}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div
            className={cn(
              'flex flex-col gap-3 transition-all duration-500',
              stage === 'buttons' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
            )}
          >
            <Button size="lg" onClick={onViewMatch} className="w-full">
              View your match
            </Button>
            <Button variant="ghost" onClick={onKeepGoing} className="w-full text-cream/70">
              Keep going
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
