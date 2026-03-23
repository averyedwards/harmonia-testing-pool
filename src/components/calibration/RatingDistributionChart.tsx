'use client'

import { cn } from '@/lib/utils'

interface RatingDistributionChartProps {
  distribution: Record<number, number>
  className?: string
}

const RATING_COLORS: Record<number, string> = {
  1: 'bg-maroon dark:bg-maroon',
  2: 'bg-maroon/70 dark:bg-maroon/70',
  3: 'bg-gold dark:bg-gold-dark',
  4: 'bg-green-500/80 dark:bg-green-500/80',
  5: 'bg-green-600 dark:bg-green-500',
}

const RATING_LABELS: Record<number, string> = {
  1: 'Not my type',
  2: 'Below average',
  3: 'Average',
  4: 'Attractive',
  5: 'Very attractive',
}

export function RatingDistributionChart({ distribution, className }: RatingDistributionChartProps) {
  const maxCount = Math.max(...Object.values(distribution), 1)
  const totalRated = Object.values(distribution).reduce((a, b) => a + b, 0)

  if (totalRated === 0) {
    return (
      <div className={cn('text-center py-4', className)}>
        <p className="text-caption text-slate/60">Rate some faces to see your distribution</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-caption font-medium text-slate mb-2">Your rating spread</p>
      {[1, 2, 3, 4, 5].map(score => {
        const count = distribution[score] || 0
        const percent = maxCount > 0 ? (count / maxCount) * 100 : 0

        return (
          <div key={score} className="flex items-center gap-2">
            <div className="w-5 text-right">
              <span className="text-caption font-semibold text-navy dark:text-cream">{score}</span>
            </div>
            <div className="flex-1 h-5 bg-gray-light/50 dark:bg-dark-border/50 rounded-sm overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-sm transition-all duration-500 ease-out',
                  RATING_COLORS[score]
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="w-6 text-right">
              <span className="text-caption text-slate">{count}</span>
            </div>
          </div>
        )
      })}

      <div className="pt-1">
        {(() => {
          const filledClasses = [1, 2, 3, 4, 5].filter(s => (distribution[s] || 0) > 0).length
          if (filledClasses >= 4) {
            return <p className="text-caption text-green-600 dark:text-green-400">Good spread across ratings</p>
          } else if (filledClasses >= 2) {
            return <p className="text-caption text-amber-600 dark:text-amber-400">Try rating some faces lower or higher for better calibration</p>
          } else {
            return <p className="text-caption text-slate/60">Keep rating for better distribution</p>
          }
        })()}
      </div>
    </div>
  )
}
