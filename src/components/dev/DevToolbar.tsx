'use client'

import { useState, useEffect } from 'react'
import { usePhase } from '@/hooks/usePhase'
import { useTheme } from '@/hooks/useTheme'
import { PHASE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { DevPhaseButtons } from './DevPhaseButtons'
import { DevUserControls } from './DevUserControls'
import { DevDataActions } from './DevDataActions'
import type { Phase } from '@/types'

export function DevToolbar() {
  const { phase, devMode, toggleDevMode, setShowEloOverlay } = usePhase()
  const { theme, toggleTheme } = useTheme()
  const [expanded, setExpanded] = useState(false)

  // Ctrl+Shift+D toggles dev mode
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        toggleDevMode()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleDevMode])

  // Minimised state: gold wrench circle
  if (!devMode.enabled) {
    return (
      <button
        onClick={toggleDevMode}
        className="fixed bottom-4 right-4 z-[9999] w-9 h-9 rounded-full bg-dark-surface/80 border border-gold/40 text-gold text-sm font-bold hover:bg-dark-surface hover:border-gold transition-all"
        title="Enable dev toolbar (Ctrl+Shift+D)"
      >
        🔧
      </button>
    )
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-[9999]',
        'bg-wine-black/95 border border-dark-border rounded-card shadow-card-dark',
        'transition-all duration-300 opacity-80 hover:opacity-100',
        expanded ? 'w-64' : 'w-auto',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gold uppercase tracking-wide">DEV</span>
          <span className="text-[10px] text-slate truncate max-w-[100px]" title={PHASE_LABELS[phase]}>
            {PHASE_LABELS[phase].replace('Phase ', 'P').replace('Awaiting ', '~')}
          </span>
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
            title="Close (Ctrl+Shift+D to reopen)"
          >
            ×
          </button>
        </div>
      </div>

      {/* Expanded sections */}
      {expanded && (
        <div className="p-3 space-y-4 max-h-[60vh] overflow-y-auto">

          {/* Section 1: Phase */}
          <DevPhaseButtons />

          {/* Section 2: User */}
          <DevUserControls />

          {/* Section 3: Visual */}
          <div>
            <p className="text-[9px] text-gold uppercase tracking-widest mb-1.5">Visual</p>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={toggleTheme}
                className="text-[10px] px-2 py-1 rounded transition-all text-left text-slate hover:text-gold hover:bg-dark-surface"
              >
                {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
              </button>
              <button
                onClick={() => setShowEloOverlay(!devMode.showEloOverlay)}
                className={cn(
                  'text-[10px] px-2 py-1 rounded transition-all text-left',
                  devMode.showEloOverlay
                    ? 'bg-gold text-wine-black font-semibold'
                    : 'text-slate hover:text-gold hover:bg-dark-surface',
                )}
              >
                Elo overlay
              </button>
            </div>
          </div>

          {/* Section 4: Data */}
          <DevDataActions />

          {/* Quick nav */}
          <div>
            <p className="text-[9px] text-gold uppercase tracking-widest mb-1.5">Quick nav</p>
            <div className="grid grid-cols-2 gap-1">
              {([
                ['/dashboard', 'Dashboard'],
                ['/tournament', 'Tournament'],
                ['/calibration', 'Calibrate'],
                ['/admin', 'Admin'],
                ['/insights', 'Insights'],
                ['/showcase', 'Showcase'],
              ] as [string, string][]).map(([href, label]) => (
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
