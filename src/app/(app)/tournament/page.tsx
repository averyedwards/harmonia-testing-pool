'use client'

import { useState } from 'react'
import { usePhase } from '@/hooks/usePhase'
import { useTournament } from '@/hooks/useTournament'
import { ComparisonView } from '@/components/tournament/ComparisonView'
import { TournamentProgress } from '@/components/tournament/TournamentProgress'
import { MatchConfirmation } from '@/components/tournament/MatchConfirmation'
import { PoolBuildingView } from '@/components/tournament/PoolBuildingView'
import { EloDebugOverlay } from '@/components/tournament/EloDebugOverlay'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function TournamentPage() {
  const { phase } = usePhase()
  const router = useRouter()
  const [showProgress, setShowProgress] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  const {
    candidates,
    currentPairing,
    stats,
    newMatchCandidate,
    poolSufficient,
    confirmedMatches,
    isComplete,
    sessionId,
    selectWinner,
    passBoth,
    dismissMatch,
  } = useTournament('phase2')

  // Phase gate — only phase2/phase3 can access tournament
  if (phase === 'onboarding' || phase === 'phase1' || phase === 'between_1_2') {
    return (
      <div className="harmonia-container py-16 min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="font-heading text-h2 text-navy dark:text-cream mb-3">
            Phase 2 not yet open
          </h1>
          <p className="text-body text-slate mb-6">
            Complete Phase 1 calibration first. We'll notify you when Phase 2 opens.
          </p>
          <Button onClick={() => router.push('/calibration')}>Go to Calibration</Button>
        </div>
      </div>
    )
  }

  // Pool insufficient
  if (!poolSufficient) {
    return <PoolBuildingView currentPoolSize={candidates.length} />
  }

  // Tournament complete
  if (isComplete) {
    return (
      <div className="harmonia-container py-16 min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center mx-auto mb-6 shadow-gold-glow">
            <span className="text-3xl">✦</span>
          </div>
          <h1 className="font-heading text-h2 text-gold mb-3">Tournament complete!</h1>
          <p className="text-body text-slate mb-6">
            You've worked through your entire match pool.
            {confirmedMatches.length > 0
              ? ` You confirmed ${confirmedMatches.length} match${confirmedMatches.length !== 1 ? 'es' : ''}.`
              : ' No matches this round — new candidates are added regularly.'}
          </p>

          {confirmedMatches.length > 0 && (
            <div className="space-y-3 mb-8">
              {confirmedMatches.map(m => (
                <Card key={m.id} goldAccent className="p-4 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-heading text-h4 text-navy dark:text-cream">
                        {m.displayName}, {m.age}
                      </p>
                      <p className="text-caption text-slate">{m.perceivedSimilarity.headline}</p>
                    </div>
                    <Badge variant="success">Matched</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push('/insights/phase2')}>View Phase 2 Report</Button>
            <Button variant="secondary" onClick={() => router.push('/dashboard')}>Dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="harmonia-container py-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-h2 text-navy dark:text-cream">Your Tournament</h1>
            <p className="text-caption text-slate">
              {stats.totalComparisons} comparisons · {confirmedMatches.length} match
              {confirmedMatches.length !== 1 ? 'es' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => setShowDebug(d => !d)}
                className="text-caption text-slate hover:text-gold transition-colors"
              >
                {showDebug ? 'Hide' : 'Dev'}
              </button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProgress(p => !p)}
              className="text-slate"
            >
              {showProgress ? 'Hide progress' : 'Progress'}
            </Button>
          </div>
        </div>

        {/* Progress panel (collapsible) */}
        {showProgress && (
          <div className="mb-6">
            <TournamentProgress
              candidates={candidates}
              totalComparisons={stats.totalComparisons}
              passBothsRemaining={stats.passBothsRemaining}
            />
          </div>
        )}

        {/* Main comparison */}
        {currentPairing ? (
          <ComparisonView
            pairing={currentPairing}
            passBothsRemaining={stats.passBothsRemaining}
            onSelect={selectWinner}
            onPassBoth={passBoth}
            showGenetics={phase === 'phase3'}
          />
        ) : (
          <div className={cn(
            'harmonia-card p-8 text-center',
          )}>
            <p className="text-body text-slate">Loading next pairing...</p>
          </div>
        )}
      </div>

      {/* Match confirmation overlay */}
      {newMatchCandidate && (
        <MatchConfirmation
          match={newMatchCandidate}
          onViewMatch={() => {
            dismissMatch()
            router.push(`/match/${newMatchCandidate.id}`)
          }}
          onKeepGoing={dismissMatch}
        />
      )}

      {/* Dev overlay */}
      {showDebug && (
        <EloDebugOverlay
          candidates={candidates}
          currentPairingIds={
            currentPairing
              ? [currentPairing.candidateA.id, currentPairing.candidateB.id]
              : null
          }
          sessionId={sessionId}
        />
      )}
    </div>
  )
}
