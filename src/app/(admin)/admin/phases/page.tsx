'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinearProgress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/toast'
import { usePhase } from '@/hooks/usePhase'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import adminStats from '@/mock-data/admin-stats.json'
import { PHASE_LABELS } from '@/lib/constants'
import type { Phase } from '@/types'

export default function AdminPhasesPage() {
  const { isAdmin } = useAuth()
  const { phase, setPhase } = usePhase()
  const { showToast } = useToast()
  const router = useRouter()
  const [transitioning, setTransitioning] = useState(false)

  if (!isAdmin) {
    return (
      <div className="harmonia-container py-16 min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <p className="font-heading text-h2 text-maroon">Access denied</p>
        </div>
      </div>
    )
  }

  const handleTransition = async (targetPhase: Phase) => {
    setTransitioning(true)
    await new Promise(r => setTimeout(r, 800))
    setPhase(targetPhase)
    setTransitioning(false)
    showToast(`Transitioned to ${PHASE_LABELS[targetPhase]}`, 'success')
  }

  const readiness = adminStats.phaseReadiness

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1 text-caption text-slate hover:text-gold mb-6 transition-colors"
        >
          ← Admin dashboard
        </button>

        <h1 className="font-heading text-h1 text-navy dark:text-cream mb-8">Phase Controls</h1>

        {/* Current phase */}
        <Card goldAccent className="p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gold uppercase tracking-wide mb-0.5">Active phase</p>
              <p className="font-heading text-h2 text-navy dark:text-cream">{PHASE_LABELS[phase]}</p>
            </div>
            <Badge variant="success">Live</Badge>
          </div>
        </Card>

        {/* Phase 2 readiness */}
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption text-gold uppercase tracking-wide">Phase 2 readiness</p>
            <span className="font-heading text-h3 text-gold">{readiness.phase2.readinessPercent}%</span>
          </div>
          <LinearProgress value={readiness.phase2.readinessPercent} showLabel={false} />
          <div className="mt-3 space-y-1">
            {readiness.phase2.blockers.map(b => (
              <p key={b} className="text-caption text-slate flex items-start gap-1">
                <span className="text-amber-500 mt-0.5">⚠</span> {b}
              </p>
            ))}
          </div>
          <Button
            className="mt-4 w-full"
            disabled={!readiness.phase2.canTransition || phase === 'phase2' || transitioning}
            onClick={() => handleTransition('phase2')}
          >
            {phase === 'phase2' ? 'Already in Phase 2' : 'Transition to Phase 2'}
          </Button>
        </Card>

        {/* Phase 3 readiness */}
        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption text-gold uppercase tracking-wide">Phase 3 readiness</p>
            <span className="font-heading text-h3 text-gold">{readiness.phase3.readinessPercent}%</span>
          </div>
          <LinearProgress value={readiness.phase3.readinessPercent} showLabel={false} />
          <div className="mt-3 space-y-1">
            {readiness.phase3.blockers.map(b => (
              <p key={b} className="text-caption text-slate flex items-start gap-1">
                <span className="text-amber-500 mt-0.5">⚠</span> {b}
              </p>
            ))}
          </div>
          <Button
            className="mt-4 w-full"
            disabled={!readiness.phase3.canTransition || phase === 'phase3' || transitioning}
            onClick={() => handleTransition('phase3')}
          >
            {phase === 'phase3' ? 'Already in Phase 3' : 'Transition to Phase 3'}
          </Button>
        </Card>

        {/* Dev phase switcher */}
        <Card className="p-5">
          <p className="text-caption text-gold uppercase tracking-wide mb-3">Dev: Force phase</p>
          <div className="grid grid-cols-2 gap-2">
            {(['onboarding', 'phase1', 'between_1_2', 'phase2', 'between_2_3', 'phase3', 'complete'] as Phase[]).map(p => (
              <button
                key={p}
                onClick={() => handleTransition(p)}
                disabled={transitioning}
                className={`px-3 py-2 rounded-input text-caption font-medium transition-all ${
                  phase === p
                    ? 'bg-gold text-wine-black'
                    : 'bg-gray-light dark:bg-dark-surface text-slate hover:bg-gold/20'
                }`}
              >
                {PHASE_LABELS[p]}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
