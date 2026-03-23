'use client'

import { useState } from 'react'
import { usePhase } from '@/hooks/usePhase'
import { useAuth } from '@/hooks/useAuth'
import { PHASE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Phase } from '@/types'

const PHASES: Phase[] = ['onboarding', 'phase1', 'between_1_2', 'phase2', 'between_2_3', 'phase3', 'complete']

const USER_TYPES = [
  { value: 'london_with_kit' as const, label: 'London + Kit' },
  { value: 'global' as const, label: 'Global' },
  { value: 'admin' as const, label: 'Admin' },
  { value: 'late_arrival' as const, label: 'Late arrival' },
]

export function DevToolbar() {
  const { phase, setPhase, devMode, toggleDevMode, setDevUserType } = usePhase()
  const { login } = useAuth()
  const [expanded, setExpanded] = useState(false)

  if (!devMode.enabled) {
    return (
      <button
        onClick={toggleDevMode}
        className="fixed bottom-4 left-4 z-50 w-8 h-8 rounded-full bg-dark-surface/80 border border-dark-border text-gold text-xs font-bold hover:bg-dark-surface transition-colors"
        title="Enable dev toolbar"
      >
        D
      </button>
    )
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 z-50 bg-wine-black/95 border border-dark-border rounded-card shadow-card-dark',
        'transition-all duration-300',
        expanded ? 'w-64' : 'w-auto',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gold uppercase tracking-wide">DEV</span>
          <span className="text-[10px] text-slate">{PHASE_LABELS[phase]}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-slate hover:text-gold text-xs px-1 transition-colors"
          >
            {expanded ? '−' : '+'}
          </button>
          <button
            onClick={toggleDevMode}
            className="text-slate hover:text-maroon text-xs px-1 transition-colors"
            title="Disable dev toolbar"
          >
            ×
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          {/* Phase switcher */}
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
                  {PHASE_LABELS[p].replace('Phase ', 'P').replace('Awaiting ', '~').replace('Complete', '✓')}
                </button>
              ))}
            </div>
          </div>

          {/* User type */}
          <div>
            <p className="text-[9px] text-gold uppercase tracking-widest mb-1.5">User type</p>
            <div className="grid grid-cols-2 gap-1">
              {USER_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    setDevUserType(value)
                    login(value === 'admin' ? 'admin' : 'user')
                  }}
                  className={cn(
                    'text-[10px] px-2 py-1 rounded transition-all text-left',
                    devMode.userType === value
                      ? 'bg-gold text-wine-black font-semibold'
                      : 'text-slate hover:text-gold hover:bg-dark-surface',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[9px] text-gold uppercase tracking-widest mb-1.5">Quick nav</p>
            <div className="grid grid-cols-2 gap-1">
              {[
                ['/dashboard', 'Dashboard'],
                ['/tournament', 'Tournament'],
                ['/calibration', 'Calibrate'],
                ['/admin', 'Admin'],
                ['/insights', 'Insights'],
                ['/showcase', 'Showcase'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="text-[10px] text-slate hover:text-gold transition-colors px-2 py-1 rounded hover:bg-dark-surface"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
