'use client'

import { usePhase } from '@/hooks/usePhase'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import phase1Data from '@/mock-data/insights-phase1.json'
import phase2Data from '@/mock-data/insights-phase2.json'
import phase3Data from '@/mock-data/insights-phase3.json'

type PhaseInsightConfig = {
  label: string
  href: string
  previewText: string
  stat: string
  statLabel: string
}

export function InsightsPreviewCard() {
  const { phase } = usePhase()
  const { user } = useAuth()
  const router = useRouter()

  // Determine which insights to show based on phase
  let config: PhaseInsightConfig | null = null

  if (phase === 'phase1' && user?.calibrationComplete) {
    const topTrait = phase1Data.visualPreferences.topTraitCorrelations[0]
    config = {
      label: 'Phase 1 insights',
      href: '/insights/phase1',
      previewText: topTrait?.description ?? 'Your visual preferences have been mapped.',
      stat: `${Math.round((phase1Data.calibrationStats.totalFacesRated / 50) * 100)}%`,
      statLabel: 'calibration complete',
    }
  } else if (phase === 'between_1_2' || phase === 'phase2') {
    const topTrait = phase1Data.visualPreferences.topTraitCorrelations[0]
    config = {
      label: 'Phase 1 insights',
      href: '/insights/phase1',
      previewText: topTrait?.description ?? 'Your visual preferences have been mapped.',
      stat: `${Math.round(phase2Data.personalityInfluence.selectionShiftPercent * 100)}%`,
      statLabel: 'personality shift',
    }
  } else if (phase === 'between_2_3' || phase === 'phase3' || phase === 'complete') {
    config = {
      label: 'Phase 2 insights',
      href: '/insights/phase2',
      previewText: phase2Data.crossPhaseComparison.shiftDescription,
      stat: `${Math.round(phase2Data.personalityInfluence.selectionShiftPercent * 100)}%`,
      statLabel: 'personality shift',
    }
  }

  // Phase 3 insights override if complete
  if (phase === 'complete') {
    config = {
      label: 'Full insights report',
      href: '/insights/phase3',
      previewText: phase3Data.fullCrossPhaseComparison?.overallShiftDescription ?? 'All three phases complete.',
      stat: `${phase3Data.geneticsInfluence?.matchesWithHighHLA ?? 0}`,
      statLabel: 'high HLA matches',
    }
  }

  if (!config) return null

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-caption text-gold uppercase tracking-wide">{config.label}</p>
        <button
          onClick={() => router.push(config!.href)}
          className="text-caption text-gold hover:underline"
        >
          View full insights →
        </button>
      </div>

      {/* Mini stat */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-heading text-h2 text-gold">{config.stat}</span>
        <span className="text-caption text-slate">{config.statLabel}</span>
      </div>

      <p className="text-body-sm text-slate leading-relaxed line-clamp-2">
        {config.previewText}
      </p>
    </Card>
  )
}
