'use client'

import { cn } from '@/lib/utils'
import { Eye, TrendingUp, TrendingDown } from 'lucide-react'
import type { TraitCorrelation } from '@/types'

interface PreferencePreviewProps {
  correlations: TraitCorrelation[]
  totalRated: number
  className?: string
}

const MIN_RATINGS_FOR_PREVIEW = 8

export function PreferencePreview({ correlations, totalRated, className }: PreferencePreviewProps) {
  if (totalRated < MIN_RATINGS_FOR_PREVIEW) {
    return (
      <div className={cn('harmonia-card p-4', className)}>
        <div className="flex items-center gap-2 mb-2">
          <Eye size={16} className="text-slate/50" />
          <p className="text-caption font-medium text-slate/60">Preference detection</p>
        </div>
        <p className="text-caption text-slate/50">
          Rate {MIN_RATINGS_FOR_PREVIEW - totalRated} more faces to see detected preferences
        </p>
      </div>
    )
  }

  const topCorrelations = correlations.slice(0, 5)

  return (
    <div className={cn('harmonia-card p-4', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Eye size={16} className="text-gold dark:text-gold-dark" />
        <p className="text-caption font-medium text-navy dark:text-cream">Detected preferences</p>
      </div>

      <div className="space-y-2.5">
        {topCorrelations.map((corr, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
              corr.direction === 'positive'
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-maroon-light dark:bg-dark-border'
            )}>
              {corr.direction === 'positive' ? (
                <TrendingUp size={12} className="text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown size={12} className="text-maroon dark:text-red-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-body-sm text-navy dark:text-cream">
                {corr.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-gray-light dark:bg-dark-border rounded-full overflow-hidden max-w-[100px]">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      corr.direction === 'positive' ? 'bg-green-500' : 'bg-maroon'
                    )}
                    style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                  />
                </div>
                <span className="text-caption text-slate/60">
                  {Math.round(Math.abs(corr.correlation) * 100)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-light dark:border-dark-border">
        <p className="text-caption text-slate/50">
          Preliminary patterns. These may change as you rate more faces.
        </p>
      </div>
    </div>
  )
}
