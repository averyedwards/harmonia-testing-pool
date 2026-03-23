'use client'

import { usePhase } from '@/hooks/usePhase'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import type { Phase } from '@/types'

interface QuickAction {
  icon: string
  label: string
  href: string
  phases: Phase[]
  londonOnly?: boolean
}

const ACTIONS: QuickAction[] = [
  { icon: '🎯', label: 'Calibrate',  href: '/calibration',       phases: ['phase1', 'between_1_2', 'phase2', 'between_2_3', 'phase3', 'complete'] },
  { icon: '⚔️', label: 'Tournament', href: '/tournament',         phases: ['phase2', 'between_2_3', 'phase3', 'complete'] },
  { icon: '🧬', label: 'Phase 3',    href: '/tournament-phase3',  phases: ['phase3', 'complete'], londonOnly: true },
  { icon: '📊', label: 'Insights',   href: '/insights',           phases: ['between_1_2', 'phase2', 'between_2_3', 'phase3', 'complete'] },
  { icon: '♥',  label: 'Matches',    href: '/tournament',         phases: ['phase2', 'between_2_3', 'phase3', 'complete'] },
  { icon: '📦', label: 'DNA Status', href: '/settings',           phases: ['between_2_3', 'phase3', 'complete'], londonOnly: true },
]

export function QuickActionsBar() {
  const { phase } = usePhase()
  const { user } = useAuth()
  const router = useRouter()

  const visible = ACTIONS.filter(a =>
    a.phases.includes(phase) &&
    (!a.londonOnly || user?.isLondon)
  )

  if (visible.length === 0) return null

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
      {visible.map(action => (
        <button
          key={action.label}
          onClick={() => router.push(action.href)}
          className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-card
                     bg-white dark:bg-dark-card border border-gray-light dark:border-dark-border
                     hover:border-gold hover:bg-gold/5 transition-all flex-shrink-0 min-w-[72px]"
        >
          <span className="text-xl">{action.icon}</span>
          <span className="text-caption text-slate whitespace-nowrap">{action.label}</span>
        </button>
      ))}
    </div>
  )
}
