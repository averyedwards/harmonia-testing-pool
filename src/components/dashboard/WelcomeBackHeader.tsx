'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePhase } from '@/hooks/usePhase'
import { PHASE_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function WelcomeBackHeader() {
  const { user } = useAuth()
  const { phase } = usePhase()
  const initial = user?.firstName?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <p className="text-caption text-slate mb-0.5">
          {getGreeting()},
        </p>
        <h1 className="font-heading text-h1 text-navy dark:text-cream mb-2">
          {user?.firstName ?? 'there'} ✦
        </h1>
        <Badge variant="phase">
          {PHASE_LABELS[phase]}
        </Badge>
      </div>

      {/* Avatar initial circle */}
      <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center flex-shrink-0 mt-1">
        <span className="font-heading text-sm font-bold text-deep-black">{initial}</span>
      </div>
    </div>
  )
}
