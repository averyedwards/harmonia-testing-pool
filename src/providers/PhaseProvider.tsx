'use client'

import { createContext, useState, useCallback, type ReactNode } from 'react'
import type { Phase, DevModeState } from '@/types'

interface PhaseContextValue {
  phase: Phase
  setPhase: (phase: Phase) => void
  devMode: DevModeState
  toggleDevMode: () => void
  setDevUserType: (type: DevModeState['userType']) => void
  setShowEloOverlay: (show: boolean) => void
}

const DEFAULT_DEV_STATE: DevModeState = {
  enabled: false,
  currentPhase: 'phase2',
  userType: 'london_with_kit',
  showEloOverlay: false,
  simulatedHeartCounts: {},
  simulatedEloScores: {},
}

export const PhaseContext = createContext<PhaseContextValue>({
  phase: 'phase2',
  setPhase: () => {},
  devMode: DEFAULT_DEV_STATE,
  toggleDevMode: () => {},
  setDevUserType: () => {},
  setShowEloOverlay: () => {},
})

export function PhaseProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('phase2') // default to Phase 2 for dev
  const [devMode, setDevMode] = useState<DevModeState>(DEFAULT_DEV_STATE)

  const toggleDevMode = useCallback(() => {
    setDevMode(prev => ({ ...prev, enabled: !prev.enabled }))
  }, [])

  const setDevUserType = useCallback((type: DevModeState['userType']) => {
    setDevMode(prev => ({ ...prev, userType: type }))
  }, [])

  const setShowEloOverlay = useCallback((show: boolean) => {
    setDevMode(prev => ({ ...prev, showEloOverlay: show }))
  }, [])

  // Keyboard shortcut: Ctrl+Shift+D toggles dev mode
  if (typeof window !== 'undefined') {
    // Registered once via useEffect in the consuming component
  }

  return (
    <PhaseContext.Provider
      value={{
        phase,
        setPhase,
        devMode,
        toggleDevMode,
        setDevUserType,
        setShowEloOverlay,
      }}
    >
      {children}
    </PhaseContext.Provider>
  )
}
