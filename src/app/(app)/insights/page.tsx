'use client'

import { usePhase } from '@/hooks/usePhase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const INSIGHT_PHASES = [
  {
    phase: 'Phase 1',
    title: 'Calibration Insights',
    description: 'Visual preference profile, personality radar, and rating distribution.',
    href: '/insights/phase1',
    icon: '👁',
    unlocked: true,
    badge: 'success' as const,
  },
  {
    phase: 'Phase 2',
    title: 'Tournament Insights',
    description: 'Personality influence analysis, Elo rankings, and cross-phase comparison.',
    href: '/insights/phase2',
    icon: '⚔️',
    unlocked: true,
    badge: 'phase' as const,
  },
  {
    phase: 'Phase 3',
    title: 'Full Report',
    description: 'Complete three-signal analysis with genetics influence and meetup outcomes.',
    href: '/insights/phase3',
    icon: '🧬',
    unlocked: false, // Phase 3 only
    badge: 'warning' as const,
  },
]

export default function InsightsHubPage() {
  const { phase } = usePhase()
  const router = useRouter()

  const isPhase3Unlocked = phase === 'phase3' || phase === 'complete'

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-h1 text-navy dark:text-cream mb-2">Your Insights</h1>
          <p className="text-body text-slate">
            Personal reports generated from your participation across all three phases.
          </p>
        </div>

        <div className="space-y-4">
          {INSIGHT_PHASES.map(({ phase: phaseLabel, title, description, href, icon, unlocked, badge }) => {
            const isAvailable = phaseLabel === 'Phase 3' ? isPhase3Unlocked : unlocked
            return (
              <Card
                key={href}
                className={`p-5 transition-all ${isAvailable ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5' : 'opacity-60'}`}
                onClick={() => isAvailable && router.push(href)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-card bg-gold/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-caption text-gold uppercase tracking-wide">{phaseLabel}</p>
                      <Badge variant={isAvailable ? badge : 'error'}>
                        {isAvailable ? 'Available' : 'Locked'}
                      </Badge>
                    </div>
                    <h2 className="font-heading text-h4 text-navy dark:text-cream mb-1">{title}</h2>
                    <p className="text-caption text-slate">{description}</p>
                    {isAvailable && (
                      <p className="text-caption text-gold mt-2">View report →</p>
                    )}
                    {!isAvailable && (
                      <p className="text-caption text-slate mt-2">
                        Unlocks when {phaseLabel.toLowerCase()} begins
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="text-slate"
          >
            ← Back to dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
