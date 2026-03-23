'use client'

import { cn } from '@/lib/utils'
import { HLA_DISPLAY_TIERS } from '@/lib/constants'

interface GeneticsIndicatorProps {
  hlaScore: number | null
  hlaDisplayTier: 'strong' | 'good' | 'some' | 'hidden' | null
  variant?: 'compact' | 'expanded'
  className?: string
}

export function GeneticsIndicator({
  hlaScore,
  hlaDisplayTier,
  variant = 'compact',
  className,
}: GeneticsIndicatorProps) {
  if (!hlaDisplayTier || hlaDisplayTier === 'hidden' || hlaScore === null) return null

  const tierConfig = HLA_DISPLAY_TIERS[hlaDisplayTier]
  if (!tierConfig.label) return null

  const dotCount = hlaDisplayTier === 'strong' ? 3 : hlaDisplayTier === 'good' ? 2 : 1
  const isExpanded = variant === 'expanded'

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-full',
        'bg-dark-surface/80 backdrop-blur-sm',
        className,
      )}
    >
      {/* Chemistry dots */}
      <div className="flex gap-0.5">
        {[1, 2, 3].map(i => (
          <span
            key={i}
            className={cn(
              'rounded-full transition-all',
              isExpanded ? 'w-2 h-2' : 'w-1.5 h-1.5',
            )}
            style={{ backgroundColor: i <= dotCount ? tierConfig.color : 'rgba(255,255,255,0.2)' }}
          />
        ))}
      </div>
      <span
        className={cn('font-medium', isExpanded ? 'text-caption' : 'text-[10px]')}
        style={{ color: tierConfig.color }}
      >
        {isExpanded ? `${hlaScore}% signal` : tierConfig.label}
      </span>
    </div>
  )
}
