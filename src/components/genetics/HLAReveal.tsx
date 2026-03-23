'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { HLA_DISPLAY_TIERS } from '@/lib/constants'

interface HLARevealProps {
  onContinue: () => void
}

const TIER_EXAMPLES = [
  { tier: 'strong' as const, label: 'Strong chemistry signal', description: 'Significant HLA dissimilarity — research suggests higher unconscious attraction' },
  { tier: 'good' as const, label: 'Good chemistry', description: 'Moderate HLA dissimilarity — a meaningful compatibility signal' },
  { tier: 'some' as const, label: 'Some chemistry', description: 'Some HLA dissimilarity — a positive but weaker signal' },
]

export function HLAReveal({ onContinue }: HLARevealProps) {
  const [page, setPage] = useState<'unlock' | 'explainer' | 'ready'>('unlock')

  if (page === 'unlock') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center animate-fade-in">
        {/* DNA helix icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center shadow-gold-glow">
            <span className="text-4xl">🧬</span>
          </div>
        </div>

        <h1 className="font-heading text-h1 text-gold mb-3">Your genetics results are in</h1>
        <p className="text-body text-slate mb-8">
          Your DNA analysis is complete. Phase 3 adds a new layer to your matches —
          biological chemistry signals based on immune gene compatibility.
        </p>

        <Card goldAccent className="p-5 mb-8 text-left">
          <p className="text-caption text-gold uppercase tracking-wide mb-2">What this means</p>
          <p className="text-body-sm text-slate">
            Research on major histocompatibility complex (MHC / HLA) genes shows that people
            tend to be more attracted to partners with different immune gene profiles —
            sometimes experienced as a distinctive "chemistry" or "natural scent" connection.
          </p>
        </Card>

        <Button size="lg" onClick={() => setPage('explainer')} className="w-full mb-3">
          See how it works
        </Button>
        <Button variant="ghost" onClick={() => setPage('ready')} className="w-full text-slate">
          Skip to tournament
        </Button>
      </div>
    )
  }

  if (page === 'explainer') {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-slide-up">
        <h2 className="font-heading text-h2 text-navy dark:text-cream mb-2">Chemistry indicators</h2>
        <p className="text-body-sm text-slate mb-6">
          Each candidate card now shows a chemistry signal based on your HLA overlap score.
          Higher dissimilarity = stronger signal.
        </p>

        <div className="space-y-4 mb-8">
          {TIER_EXAMPLES.map(({ tier, label, description }) => {
            const config = HLA_DISPLAY_TIERS[tier]
            const dotCount = tier === 'strong' ? 3 : tier === 'good' ? 2 : 1
            return (
              <Card key={tier} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  {/* Preview indicator */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-dark-surface">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(i => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: i <= dotCount ? config.color : 'rgba(255,255,255,0.2)' }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: config.color }}>
                      {label}
                    </span>
                  </div>
                </div>
                <p className="text-caption text-slate">{description}</p>
              </Card>
            )
          })}
        </div>

        <div className="harmonia-card p-4 mb-6 border-l-2 border-gold/30">
          <p className="text-caption text-slate">
            <strong className="text-navy dark:text-cream">Important:</strong> Chemistry is one signal among many.
            Personality compatibility remains the strongest predictor of relationship success.
            Use HLA as additional context, not the primary filter.
          </p>
        </div>

        <Button size="lg" onClick={() => setPage('ready')} className="w-full">
          Start Phase 3 tournament
        </Button>
      </div>
    )
  }

  // Ready screen
  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center mx-auto mb-6 shadow-gold-glow">
        <span className="text-3xl">✦</span>
      </div>
      <h2 className="font-heading text-h2 text-gold mb-3">You're ready for Phase 3</h2>
      <p className="text-body text-slate mb-8">
        The same tournament format — but now with chemistry signals on every card.
        Your earlier match history carries over.
      </p>
      <Button size="lg" onClick={onContinue} className="w-full">
        Begin tournament
      </Button>
    </div>
  )
}
