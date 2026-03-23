'use client'

import { useContext } from 'react'
import { PhaseContext } from '@/providers/PhaseProvider'

export function usePhase() {
  const context = useContext(PhaseContext)
  if (!context) throw new Error('usePhase must be used within PhaseProvider')
  return context
}
