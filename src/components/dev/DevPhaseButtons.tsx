'use client'

import { usePhase } from '@/hooks/usePhase'
import { PHASE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Phase } from '@/types'

const PHASES: Phase[] = [
  'onboarding', 'phase1', 'between_1_2',
  'phase2', 'between_2_3', 'phase3', 'complete',
]

function shortLabel(phase: Phase): string {
  return PHASE_LABELS[phase]
    .replace('Phase ', 'P')
    .replace('Awaiting ', '~')
    .replace('Getting Started', 'Setup')
    .replace('Complete', '✓')
}

export function DevPhaseButtons() {
  const { phase, setPhase } = usePhase()

  return (
    <div>
      <p className="text-[9px] text-gold uppercase tracking-widest mb-1.5">Phase</p>
      <div className="grid grid-cols-2 gap-1">
        {PHASES.map(p => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={cn(
              'text-[10px] px-2 py-1 rounded transition-all text-left truncate',
              phase === p
                ? 'bg-gold text-wine-black font-semibold'
                : 'text-slate hover:text-gold hover:bg-dark-surface',
            )}
            title={PHASE_LABELS[p]}
          >
            {shortLabel(p)}
          </button>
        ))}
      </div>
    </div>
  )
}
