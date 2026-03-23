'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HeartDisplay } from '@/components/tournament/HeartDisplay'
import insightsData from '@/mock-data/insights-phase3.json'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LinearProgress } from '@/components/ui/progress'

export default function Phase3InsightsPage() {
  const router = useRouter()
  const {
    tournamentStats,
    personalityInfluence,
    crossPhaseComparison,
    geneticsInfluence,
    postMeetupFeedback,
    fullCrossPhaseComparison,
    matchOutcomes,
    eloRankings,
  } = insightsData

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-caption text-gold uppercase tracking-wide mb-1">Phase 3 · Full Report</p>
          <h1 className="font-heading text-h1 text-navy dark:text-cream mb-2">Your Complete Insights</h1>
          <p className="text-body text-slate">
            Across all three phases — visual, personality, and genetics.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          {[
            { label: 'Comparisons', value: tournamentStats.totalComparisons },
            { label: 'Matches', value: matchOutcomes.length },
            { label: 'Personality views', value: `${Math.round(tournamentStats.personalityClickRate * 100)}%` },
            { label: 'Pass-bothes', value: tournamentStats.passBothCount },
          ].map(({ label, value }) => (
            <Card key={label} className="p-4 text-center">
              <p className="font-heading text-h3 text-gold">{value}</p>
              <p className="text-caption text-slate">{label}</p>
            </Card>
          ))}
        </div>

        {/* Genetics influence */}
        <Card goldAccent className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-2">🧬 Genetics influence</p>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="text-center">
              <p className="font-heading text-h2 text-chemistry-strong">{geneticsInfluence.matchesWithHighHLA}</p>
              <p className="text-caption text-slate">Matches with strong HLA</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-h2 text-slate">{geneticsInfluence.matchesWithLowHLA}</p>
              <p className="text-caption text-slate">Matches with weak HLA</p>
            </div>
          </div>
          <p className="text-body-sm text-slate">{geneticsInfluence.hlaInfluenceDescription}</p>
        </Card>

        {/* Full cross-phase comparison */}
        <Card className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-3">Your preference journey</p>
          <div className="space-y-3 mb-3">
            {[
              { phase: 'Phase 1 — Visual', traits: fullCrossPhaseComparison.phase1, variant: 'phase' as const },
              { phase: 'Phase 2 — + Personality', traits: fullCrossPhaseComparison.phase2, variant: 'success' as const },
              { phase: 'Phase 3 — + Genetics', traits: fullCrossPhaseComparison.phase3, variant: 'warning' as const },
            ].map(({ phase, traits, variant }) => (
              <div key={phase}>
                <p className="text-caption text-slate mb-1">{phase}</p>
                <div className="flex flex-wrap gap-1.5">
                  {traits.map(t => (
                    <Badge key={t} variant={variant}>{t.replace(/_/g, ' ')}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-caption text-slate">{fullCrossPhaseComparison.overallShiftDescription}</p>
        </Card>

        {/* Personality influence */}
        <Card className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-2">Personality influence</p>
          <p className="text-body-sm text-slate mb-3">{personalityInfluence.summary}</p>
          <div>
            <div className="flex justify-between text-caption text-slate mb-1">
              <span>Selection shift from personality</span>
              <span className="font-semibold text-gold">{Math.round(personalityInfluence.selectionShiftPercent * 100)}%</span>
            </div>
            <LinearProgress value={personalityInfluence.selectionShiftPercent * 100} size="sm" />
          </div>
        </Card>

        {/* Post-meetup feedback */}
        {postMeetupFeedback.length > 0 && (
          <Card className="p-5 mb-4">
            <p className="text-caption text-gold uppercase tracking-wide mb-3">Post-meetup feedback</p>
            {postMeetupFeedback.map(fb => (
              <div key={fb.matchId} className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm font-semibold text-navy dark:text-cream">
                    Match {fb.matchId}
                  </p>
                  <p className="text-caption text-slate">
                    {fb.didMeet ? 'Met up' : "Didn't meet"} ·{' '}
                    {fb.interestScore ? `Interest: ${fb.interestScore}/7` : ''}{' '}
                    {fb.orientation ? `· ${fb.orientation === 'long_term' ? 'Looking for something serious' : 'Open to casual'}` : ''}
                  </p>
                </div>
                <Badge variant={fb.didMeet ? 'success' : 'warning'}>
                  {fb.didMeet ? 'Met' : 'Not yet'}
                </Badge>
              </div>
            ))}
          </Card>
        )}

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

        {/* Matches */}
        {matchOutcomes.length > 0 && (
          <Card className="p-5 mb-6">
            <p className="text-caption text-gold uppercase tracking-wide mb-3">Your matches</p>
            <div className="space-y-3">
              {matchOutcomes.map(m => (
                <div key={m.matchId} className="flex items-center justify-between">
                  <div>
                    <p className="text-body-sm font-semibold text-navy dark:text-cream">
                      {m.candidateDisplayName}
                    </p>
                    <p className="text-caption text-slate">
                      {m.contactExchanged ? 'Contact exchanged ✓' : 'Contact pending'}
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
