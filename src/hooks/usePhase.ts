'use client'

import { usePhaseContext } from '@/providers/PhaseProvider'

export function usePhase() {
  return usePhaseContext()
}
