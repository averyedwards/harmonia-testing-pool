'use client'

import { useMemo } from 'react'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LinearProgress } from '@/components/ui/progress'
import { RatingDistributionChart } from './RatingDistributionChart'
import { CheckCircle, Eye, Users, ArrowRight } from 'lucide-react'
import insightsPhase1 from '@/mock-data/insights-phase1.json'
import type { FaceRating } from '@/types'

interface CalibrationCompleteProps {
  ratings: FaceRating[]
}

export function CalibrationComplete({ ratings }: CalibrationCompleteProps) {
  const totalRated = ratings.length
  const avgRating = totalRated > 0
    ? (ratings.reduce((sum, r) => sum + r.score, 0) / totalRated).toFixed(1)
    : '0'

  const distribution = useMemo(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratings.forEach(r => {
      dist[r.score] = (dist[r.score] || 0) + 1
    })
    return dist
  }, [ratings])

  const preferences = insightsPhase1.visualPreferences
  const communityPercent = 73

  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h1 className="font-heading text-h2 text-navy dark:text-cream mb-1">
          Calibration complete
        </h1>
        <p className="text-body text-slate">
          Your personalised visual model has been built.
        </p>
      </div>

      <Card className="mb-4 p-5">
        <CardTitle className="text-h4 mb-3">Your ratings</CardTitle>
        <div className="flex items-center gap-6 mb-4">
          <div className="text-center">
            <p className="font-heading text-h2 text-gold dark:text-gold-dark">{totalRated}</p>
            <p className="text-caption text-slate">faces rated</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-h2 text-navy dark:text-cream">{avgRating}</p>
            <p className="text-caption text-slate">average score</p>
          </div>
        </div>
        <RatingDistributionChart distribution={distribution} />
      </Card>

      <Card className="mb-4 p-5 gold-accent-top">
        <div className="flex items-center gap-2 mb-3">
          <Eye size={18} className="text-gold dark:text-gold-dark" />
          <CardTitle className="text-h4">Your visual preferences</CardTitle>
        </div>
        <CardContent>
          <p className="text-body mb-3">
            {preferences.summary}
          </p>
          <div className="space-y-2">
            {preferences.topTraitCorrelations.slice(0, 4).map((trait, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={
                  trait.direction === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-maroon dark:text-red-400'
                }>
                  {trait.direction === 'positive' ? '↑' : '↓'}
                </span>
                <span className="text-body-sm text-navy dark:text-cream">
                  {trait.description}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
        <a
          href="/insights/phase1"
          className="inline-flex items-center gap-1 text-body-sm font-medium text-gold hover:text-gold-champagne dark:text-gold-dark transition-colors mt-3"
        >
          View full Phase 1 insights
          <ArrowRight size={14} />
        </a>
      </Card>

      <Card className="mb-6 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-slate" />
          <CardTitle className="text-h4">Community progress</CardTitle>
        </div>
        <CardContent>
          <div className="mb-2">
            <LinearProgress value={communityPercent} showLabel />
          </div>
          <p className="text-body-sm text-slate">
            {communityPercent}% of participants have completed calibration.
            Phase 2 launches when enough users are ready.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Button
          className="w-full"
          onClick={() => window.location.href = '/dashboard'}
        >
          Go to Dashboard
        </Button>
        <a
          href="/insights/phase1"
          className="block text-center text-body-sm text-gold hover:text-gold-champagne dark:text-gold-dark transition-colors py-2"
        >
          View your personality profile
        </a>
      </div>
    </div>
  )
}
