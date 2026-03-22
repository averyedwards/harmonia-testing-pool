'use client'

import React, { createContext, useContext, useState } from 'react'
import type { Phase, DevModeState } from '@/types'

interface PhaseContextValue {
  currentPhase: Phase
  setPhase: (phase: Phase) => void
  devMode: DevModeState
  setDevMode: (updates: Partial<DevModeState>) => void
  toggleDevMode: () => void
}

const DEFAULT_DEV_MODE: DevModeState = {
  enabled: false,
  currentPhase: 'phase2',
  userType: 'london_with_kit',
  showEloOverlay: false,
  simulatedHeartCounts: {},
  simulatedEloScores: {},
}

const PhaseContext = createContext<PhaseContextValue | undefined>(undefined)

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [currentPhase, setCurrentPhase] = useState<Phase>('phase2')
  const [devMode, setDevModeState] = useState<DevModeState>(DEFAULT_DEV_MODE)

  function setPhase(phase: Phase) {
    setCurrentPhase(phase)
    if (devMode.enabled) {
      setDevModeState((prev) => ({ ...prev, currentPhase: phase }))
    }
  }

  function setDevMode(updates: Partial<DevModeState>) {
    setDevModeState((prev) => {
      const next = { ...prev, ...updates }
      // Sync current phase with dev mode phase
      if (updates.currentPhase) {
        setCurrentPhase(updates.currentPhase)
      }
      return next
    })
  }

  function toggleDevMode() {
    setDevModeState((prev) => ({ ...prev, enabled: !prev.enabled }))
  }

  return (
    <PhaseContext.Provider value={{ currentPhase, setPhase, devMode, setDevMode, toggleDevMode }}>
      {children}
    </PhaseContext.Provider>
  )
}

export function usePhaseContext(): PhaseContextValue {
  const ctx = useContext(PhaseContext)
  if (!ctx) throw new Error('usePhaseContext must be used inside PhaseProvider')
  return ctx
}
