'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LinearProgress } from '@/components/ui/progress'
import { RatingDistributionChart } from '@/components/calibration/RatingDistributionChart'
import { PersonalityRadarMini } from '@/components/tournament/PersonalityRadarMini'
import insightsData from '@/mock-data/insights-phase1.json'
import { SIN_METADATA } from '@/types'
import type { SinScore } from '@/types'

// Mock "community average" for radar comparison
const COMMUNITY_SINS: SinScore[] = SIN_METADATA.map(m => ({ sin: m.name, score: 0, confidence: 0.5 }))

export default function Phase1InsightsPage() {
  const { visualPreferences, personalityProfile, calibrationStats } = insightsData

  const qualityBadge: Record<string, 'success' | 'phase' | 'warning' | 'error'> = {
    high: 'success', moderate: 'phase', low: 'warning', rejected: 'error',
  }

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-caption text-gold uppercase tracking-wide mb-1">Phase 1 · Calibration</p>
          <h1 className="font-heading text-h1 text-navy dark:text-cream mb-2">Your Insights Report</h1>
          <p className="text-body text-slate">
            Based on {calibrationStats.totalFacesRated} faces rated during calibration.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center">
            <p className="font-heading text-h3 text-gold">{calibrationStats.totalFacesRated}</p>
            <p className="text-caption text-slate">Faces rated</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="font-heading text-h3 text-gold">{calibrationStats.averageRating.toFixed(1)}</p>
            <p className="text-caption text-slate">Avg rating</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="font-heading text-h3 text-gold">{personalityProfile.qualityScore}</p>
            <p className="text-caption text-slate">Quality score</p>
          </Card>
        </div>

        {/* Rating distribution */}
        <Card className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-3">Rating distribution</p>
          <RatingDistributionChart
            distribution={calibrationStats.ratingDistribution as Record<string, number>}
          />
        </Card>

        {/* Visual preferences */}
        <Card goldAccent className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-2">Visual preferences</p>
          <p className="text-body-sm text-slate mb-4">{visualPreferences.summary}</p>
          <div className="space-y-3">
            {visualPreferences.topTraitCorrelations.map(tc => (
              <div key={tc.trait}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-caption text-navy dark:text-cream capitalize">
                    {tc.trait.replace(/_/g, ' ')}
                  </p>
                  <Badge variant={tc.direction === 'positive' ? 'success' : 'error'}>
                    {tc.direction === 'positive' ? '+' : ''}{(tc.correlation * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-caption text-slate mb-1">{tc.description}</p>
                <LinearProgress value={Math.abs(tc.correlation * 100)} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        {/* Personality profile */}
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption text-gold uppercase tracking-wide">Your personality profile</p>
            <Badge variant={qualityBadge[personalityProfile.qualityTier] ?? 'phase'}>
              {personalityProfile.qualityTier} quality
            </Badge>
          </div>
          <p className="text-caption text-slate mb-4">
            Derived from your questionnaire responses using the FELIX framework.
          </p>

          {/* Radar — user vs community average */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <PersonalityRadarMini
              userSins={personalityProfile.sins as SinScore[]}
              candidateSins={COMMUNITY_SINS}
              size={220}
            />
            <div className="flex items-center gap-4 text-caption text-slate">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-gold inline-block rounded" />You
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#E84A8A] inline-block rounded" />Community avg
              </span>
            </div>
          </div>

          {/* Per-sin bars */}
          <div className="space-y-3">
            {SIN_METADATA.map(meta => {
              const sinData = personalityProfile.sins.find(s => s.sin === meta.name)
              if (!sinData) return null
              const pct = ((sinData.score + 5) / 10) * 100
              return (
                <div key={meta.name}>
                  <div className="flex justify-between text-[10px] text-slate mb-0.5">
                    <span>{meta.virtueLabel}</span>
                    <span className="font-semibold text-navy dark:text-cream">{meta.label}</span>
                    <span>{meta.viceLabel}</span>
                  </div>
                  <div className="relative h-1.5 bg-gray-light dark:bg-dark-border rounded-full">
                    <div
                      className="absolute -top-0.5 w-2.5 h-2.5 rounded-full -translate-x-1/2 border-2 border-cream dark:border-dark-surface"
                      style={{ left: `${pct}%`, backgroundColor: meta.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
