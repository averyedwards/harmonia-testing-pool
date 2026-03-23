'use client'

import { usePhase } from '@/hooks/usePhase'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinearProgress } from '@/components/ui/progress'
import adminStats from '@/mock-data/admin-stats.json'

const CALIBRATION_PROGRESS = 14 // mock: user has rated 14 faces

export function PhaseStatusCard() {
  const { phase } = usePhase()
  const { user } = useAuth()
  const router = useRouter()

  const communityCalibrationRate = Math.round(adminStats.calibrationCompletionRate * 100)

  return (
    <Card goldAccent className="p-5">
      {phase === 'phase1' && (
        <>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-caption text-gold uppercase tracking-wide mb-0.5">Current phase</p>
              <h2 className="font-heading text-h3 text-navy dark:text-cream">Phase 1: Calibration</h2>
            </div>
            <Badge variant="phase">Active</Badge>
          </div>
          <p className="text-body-sm text-slate mb-3">
            Rate faces to build your personalised visual model. You have rated {CALIBRATION_PROGRESS} so far.
          </p>
          <div className="mb-1 flex justify-between text-caption text-slate">
            <span>Your progress</span>
            <span>{CALIBRATION_PROGRESS} rated</span>
          </div>
          <LinearProgress value={Math.min((CALIBRATION_PROGRESS / 50) * 100, 100)} size="sm" className="mb-4" />
          <Button className="w-full" onClick={() => router.push('/calibration')}>
            Go to calibration
          </Button>
        </>
      )}

      {phase === 'between_1_2' && (
        <>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-caption text-gold uppercase tracking-wide mb-0.5">Waiting</p>
              <h2 className="font-heading text-h3 text-navy dark:text-cream">Phase 2 launches soon.</h2>
            </div>
            <Badge variant="warning">Awaiting</Badge>
          </div>
          <p className="text-body-sm text-slate mb-3">
            Your calibration is complete. We are waiting for the community to be ready before launching Phase 2.
          </p>
          <div className="mb-1 flex justify-between text-caption text-slate">
            <span>Community calibration</span>
            <span>{communityCalibrationRate}% complete</span>
          </div>
          <LinearProgress value={communityCalibrationRate} size="sm" className="mb-4" />
          <Button variant="ghost" size="sm" className="w-full" onClick={() => router.push('/insights/phase1')}>
            View Phase 1 insights →
          </Button>
        </>
      )}

      {phase === 'phase2' && (
        <>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-caption text-gold uppercase tracking-wide mb-0.5">Current phase</p>
              <h2 className="font-heading text-h3 text-navy dark:text-cream">Phase 2: Tournament</h2>
            </div>
            <Badge variant="phase">Active</Badge>
          </div>
          <p className="text-body-sm text-slate mb-3">
            Compare matches and discover who you connect with. Personality data is now visible.
          </p>
          <div className="flex gap-4 mb-4 text-center">
            <div className="flex-1 bg-cream dark:bg-dark-card rounded-card p-3">
              <p className="font-heading text-h3 text-gold">47</p>
              <p className="text-caption text-slate">Comparisons</p>
            </div>
            <div className="flex-1 bg-cream dark:bg-dark-card rounded-card p-3">
              <p className="font-heading text-h3 text-gold">2</p>
              <p className="text-caption text-slate">Matches</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => router.push('/tournament')}>
            Continue tournament
          </Button>
        </>
      )}

      {phase === 'between_2_3' && (
        <>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-caption text-gold uppercase tracking-wide mb-0.5">Waiting</p>
              <h2 className="font-heading text-h3 text-navy dark:text-cream">Phase 3 launches soon.</h2>
            </div>
            <Badge variant="warning">Awaiting</Badge>
          </div>
          <p className="text-body-sm text-slate mb-3">
            Phase 2 is complete. We are processing DNA results for London participants before launching Phase 3.
          </p>
          {user?.isLondon && (
            <p className="text-body-sm text-slate mb-4">
              Your DNA sample is being processed. We will notify you when your results are ready.
            </p>
          )}
          <Button variant="ghost" size="sm" className="w-full" onClick={() => router.push('/insights/phase2')}>
            View Phase 2 insights →
          </Button>
        </>
      )}

      {phase === 'phase3' && (
        <>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-caption text-gold uppercase tracking-wide mb-0.5">Current phase</p>
              <h2 className="font-heading text-h3 text-navy dark:text-cream">Phase 3: Genetics</h2>
            </div>
            <Badge variant="phase">Active</Badge>
          </div>
          <p className="text-body-sm text-slate mb-3">
            Genetics added. See how chemistry changes your choices — HLA compatibility is now visible on each match.
          </p>
          <div className="flex gap-4 mb-4 text-center">
            <div className="flex-1 bg-cream dark:bg-dark-card rounded-card p-3">
              <p className="font-heading text-h3 text-gold">47</p>
              <p className="text-caption text-slate">Comparisons</p>
            </div>
            <div className="flex-1 bg-cream dark:bg-dark-card rounded-card p-3">
              <p className="font-heading text-h3 text-gold">2</p>
              <p className="text-caption text-slate">Matches</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => router.push('/tournament-phase3')}>
            Continue Phase 3
          </Button>
        </>
      )}

      {phase === 'complete' && (
        <>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-caption text-gold uppercase tracking-wide mb-0.5">Finished</p>
              <h2 className="font-heading text-h3 text-navy dark:text-cream">All phases complete.</h2>
            </div>
            <Badge variant="success">Complete</Badge>
          </div>
          <p className="text-body-sm text-slate mb-4">
            You have completed all three phases. Your full insights report is ready.
          </p>
          <Button className="w-full" onClick={() => router.push('/insights/phase3')}>
            View full report
          </Button>
        </>
      )}

      {phase === 'onboarding' && (
        <>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-caption text-gold uppercase tracking-wide mb-0.5">Getting started</p>
              <h2 className="font-heading text-h3 text-navy dark:text-cream">Complete your profile.</h2>
            </div>
            <Badge variant="warning">Setup</Badge>
          </div>
          <p className="text-body-sm text-slate mb-4">
            Set up your profile and teach us your preferences before matching begins.
          </p>
          <Button className="w-full" onClick={() => router.push('/onboarding')}>
            Continue onboarding
          </Button>
        </>
      )}
    </Card>
  )
}
