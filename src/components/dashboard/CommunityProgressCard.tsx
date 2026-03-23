'use client'

import { usePhase } from '@/hooks/usePhase'
import { Card } from '@/components/ui/card'
import { LinearProgress } from '@/components/ui/progress'
import adminStats from '@/mock-data/admin-stats.json'

export function CommunityProgressCard() {
  const { phase } = usePhase()

  const calibrationRate = Math.round(adminStats.calibrationCompletionRate * 100)
  const dnaRate = Math.round((adminStats.resultsUploaded / adminStats.londonUsers) * 100)

  return (
    <Card className="p-5">
      <p className="text-caption text-gold uppercase tracking-wide mb-4">Community progress</p>

      {/* Between 1→2: calibration rate */}
      {phase === 'between_1_2' && (
        <div className="mb-4">
          <div className="flex justify-between text-caption text-slate mb-1">
            <span>Community calibration</span>
            <span>{calibrationRate}% complete</span>
          </div>
          <LinearProgress value={calibrationRate} size="sm" />
          <p className="text-caption text-slate mt-2">
            Phase 2 launches when the pool is ready.
          </p>
        </div>
      )}

      {/* Between 2→3: DNA results rate */}
      {phase === 'between_2_3' && (
        <div className="mb-4">
          <div className="flex justify-between text-caption text-slate mb-1">
            <span>DNA results processed</span>
            <span>{adminStats.resultsUploaded} / {adminStats.londonUsers} London</span>
          </div>
          <LinearProgress value={dnaRate} size="sm" />
          <p className="text-caption text-slate mt-2">
            Phase 3 launches for London participants once results are ready.
          </p>
        </div>
      )}

      {/* General stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-cream dark:bg-dark-card rounded-card p-3 text-center">
          <p className="font-heading text-h3 text-gold">{adminStats.totalUsers}</p>
          <p className="text-caption text-slate">Total participants</p>
        </div>
        <div className="bg-cream dark:bg-dark-card rounded-card p-3 text-center">
          <p className="font-heading text-h3 text-gold">{adminStats.londonUsers}</p>
          <p className="text-caption text-slate">London</p>
        </div>
      </div>
    </Card>
  )
}
