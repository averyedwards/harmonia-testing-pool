'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LinearProgress } from '@/components/ui/progress'
import { HeartDisplay } from '@/components/tournament/HeartDisplay'
import insightsData from '@/mock-data/insights-phase2.json'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

function formatMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

export default function Phase2InsightsPage() {
  const router = useRouter()
  const { tournamentStats, personalityInfluence, crossPhaseComparison, matchOutcomes, eloRankings } = insightsData

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-caption text-gold uppercase tracking-wide mb-1">Phase 2 · Tournament</p>
          <h1 className="font-heading text-h1 text-navy dark:text-cream mb-2">Your Insights Report</h1>
          <p className="text-body text-slate">
            Based on {tournamentStats.totalComparisons} comparisons made during Phase 2.
          </p>
        </div>

        {/* Tournament stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          {[
            { label: 'Comparisons', value: tournamentStats.totalComparisons },
            { label: 'Avg decision', value: formatMs(tournamentStats.averageDecisionTimeMs) },
            { label: 'Personality views', value: `${Math.round(tournamentStats.personalityClickRate * 100)}%` },
            { label: 'Pass-bothes', value: tournamentStats.passBothCount },
          ].map(({ label, value }) => (
            <Card key={label} className="p-4 text-center">
              <p className="font-heading text-h3 text-gold">{value}</p>
              <p className="text-caption text-slate">{label}</p>
            </Card>
          ))}
        </div>

        {/* Personality influence */}
        <Card goldAccent className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-2">Personality influence</p>
          <p className="text-body-sm text-slate mb-3">{personalityInfluence.summary}</p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-caption text-slate mb-1">
                <span>Choices with personality viewed</span>
                <span className="font-semibold text-navy dark:text-cream">{personalityInfluence.choicesWithPersonalityViewed}</span>
              </div>
              <LinearProgress
                value={(personalityInfluence.choicesWithPersonalityViewed / tournamentStats.totalComparisons) * 100}
                size="sm"
              />
            </div>
            <div>
              <div className="flex justify-between text-caption text-slate mb-1">
                <span>Personality changed your choice</span>
                <span className="font-semibold text-gold">{Math.round(personalityInfluence.selectionShiftPercent * 100)}% of views</span>
              </div>
              <LinearProgress
                value={personalityInfluence.selectionShiftPercent * 100}
                size="sm"
              />
            </div>
          </div>
        </Card>

        {/* Cross-phase comparison */}
        <Card className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-3">How your preferences evolved</p>
          <div className="space-y-3 mb-3">
            <div>
              <p className="text-caption text-slate mb-1">Phase 1 — Visual</p>
              <div className="flex flex-wrap gap-1.5">
                {crossPhaseComparison.phase1TopTraits.map(t => (
                  <Badge key={t} variant="phase">{t.replace(/_/g, ' ')}</Badge>
                ))}
              </div>
            </div>
            <div className="text-center text-slate text-caption">↓</div>
            <div>
              <p className="text-caption text-slate mb-1">Phase 2 — Personality-informed</p>
              <div className="flex flex-wrap gap-1.5">
                {crossPhaseComparison.phase2TopTraits.map(t => (
                  <Badge key={t} variant="success">{t.replace(/_/g, ' ')}</Badge>
                ))}
              </div>
            </div>
          </div>
          <p className="text-caption text-slate">{crossPhaseComparison.shiftDescription}</p>
        </Card>

        {/* Elo rankings */}
        <Card className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-3">Final Elo rankings</p>
          <div className="space-y-2">
            {eloRankings.map((entry, i) => (
              <div key={entry.candidateId} className="flex items-center gap-3">
                <span className="text-caption text-slate w-5 text-right">{i + 1}.</span>
                <span className="text-body-sm text-navy dark:text-cream flex-1">{entry.displayName}</span>
                <HeartDisplay count={entry.heartCount} size="sm" />
                <span className="text-caption text-gold font-semibold w-12 text-right">{entry.eloRating}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Match outcomes */}
        {matchOutcomes.length > 0 && (
          <Card className="p-5 mb-6">
            <p className="text-caption text-gold uppercase tracking-wide mb-3">Your confirmed matches</p>
            <div className="space-y-3">
              {matchOutcomes.map(m => (
                <div key={m.matchId} className="flex items-center justify-between">
                  <div>
                    <p className="text-body-sm font-semibold text-navy dark:text-cream">
                      {m.candidateDisplayName}
                    </p>
                    <p className="text-caption text-slate">
                      {m.contactExchanged ? 'Contact exchanged ✓' : 'Contact not yet exchanged'}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => router.push(`/match/${m.matchId}`)}
                  >
                    View match
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
