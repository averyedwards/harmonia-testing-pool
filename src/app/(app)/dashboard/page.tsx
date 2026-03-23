'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePhase } from '@/hooks/usePhase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { WelcomeBackHeader } from '@/components/dashboard/WelcomeBackHeader'
import { QuickActionsBar } from '@/components/dashboard/QuickActionsBar'
import { PhaseStatusCard } from '@/components/dashboard/PhaseStatusCard'
import { MatchListCard } from '@/components/dashboard/MatchListCard'
import { InsightsPreviewCard } from '@/components/dashboard/InsightsPreviewCard'
import { DnaKitStatusMini } from '@/components/dashboard/DnaKitStatusMini'
import { CommunityProgressCard } from '@/components/dashboard/CommunityProgressCard'
import { NotificationSummaryCard } from '@/components/dashboard/NotificationSummaryCard'
import type { Phase } from '@/types'

// Card visibility matrix per spec
function showMatchList(phase: Phase) {
  return ['phase2', 'between_2_3', 'phase3', 'complete'].includes(phase)
}

function showInsightsPreview(phase: Phase, calibrationComplete: boolean, questionnaireComplete: boolean) {
  if (phase === 'phase1') return calibrationComplete || questionnaireComplete
  return ['between_1_2', 'phase2', 'between_2_3', 'phase3', 'complete'].includes(phase)
}

function showDnaKit(phase: Phase, isLondon: boolean) {
  return isLondon && ['phase2', 'between_2_3', 'phase3'].includes(phase)
}

function showCommunityProgress(phase: Phase) {
  return ['phase1', 'between_1_2', 'between_2_3'].includes(phase)
}

export default function DashboardPage() {
  const { user, isHydrated } = useAuth()
  const { phase } = usePhase()
  const router = useRouter()

  useEffect(() => {
    if (!isHydrated) return
    if (!user) {
      router.replace('/login')
      return
    }
    if (user.onboardingStep < 7) {
      router.replace('/onboarding')
    }
  }, [user, isHydrated, router])

  if (!isHydrated || !user) return null

  return (
    <DashboardLayout header={<WelcomeBackHeader />}>
      <QuickActionsBar />
      <PhaseStatusCard />
      {showMatchList(phase) && <MatchListCard />}
      {showInsightsPreview(phase, user.calibrationComplete, user.questionnaireComplete) && (
        <InsightsPreviewCard />
      )}
      {showDnaKit(phase, user.isLondon) && <DnaKitStatusMini />}
      {showCommunityProgress(phase) && <CommunityProgressCard />}
      <NotificationSummaryCard />
    </DashboardLayout>
  )
}
