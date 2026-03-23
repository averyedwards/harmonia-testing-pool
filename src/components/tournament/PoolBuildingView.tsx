'use client'

import { Card } from '@/components/ui/card'
import { LinearProgress } from '@/components/ui/progress'
import { MUTUAL_POOL_MINIMUM_SIZE } from '@/lib/constants'

interface PoolBuildingViewProps {
  currentPoolSize: number
}

export function PoolBuildingView({ currentPoolSize }: PoolBuildingViewProps) {
  const progress = Math.round((currentPoolSize / MUTUAL_POOL_MINIMUM_SIZE) * 100)

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">⌛</span>
      </div>

      <h2 className="font-heading text-h2 text-navy dark:text-cream mb-3">
        Building your match pool
      </h2>
      <p className="text-body text-slate mb-8">
        We need at least <strong className="text-navy dark:text-cream">{MUTUAL_POOL_MINIMUM_SIZE} compatible matches</strong> before
        your tournament can begin. You're {currentPoolSize === 0 ? 'just getting started' : 'almost there'}.
      </p>

      {/* Progress */}
      <Card className="p-5 mb-8 text-left">
        <div className="flex justify-between mb-2">
          <p className="text-body-sm text-slate">Pool size</p>
          <p className="text-body-sm font-semibold text-navy dark:text-cream">
            {currentPoolSize} / {MUTUAL_POOL_MINIMUM_SIZE}
          </p>
        </div>
        <LinearProgress value={progress} showLabel={false} />
      </Card>

      {/* What's happening */}
      <div className="space-y-3 text-left">
        {[
          { icon: '🧠', text: 'Your visual model is being used to score compatibility across the pool' },
          { icon: '⚙️', text: 'MetaFBP is identifying candidates likely to be mutually attractive' },
          { icon: '✦', text: 'Once your pool reaches 6, your tournament unlocks automatically' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-start gap-3">
            <span className="text-xl mt-0.5">{icon}</span>
            <p className="text-body-sm text-slate">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
