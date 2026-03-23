'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePhase } from '@/hooks/usePhase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinearProgress } from '@/components/ui/progress'
import { HeartDisplay } from '@/components/tournament/HeartDisplay'
import { PHASE_LABELS, PHASE_DESCRIPTIONS } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import matchesData from '@/mock-data/matches.json'
import notificationsData from '@/mock-data/notifications.json'
import type { Notification } from '@/types'

function PhaseStatusCard() {
  const { phase } = usePhase()
  const router = useRouter()

  const phaseActions: Record<string, { label: string; href: string } | null> = {
    onboarding: { label: 'Continue onboarding', href: '/onboarding' },
    phase1: { label: 'Go to calibration', href: '/calibration' },
    between_1_2: null,
    phase2: { label: 'Go to tournament', href: '/tournament' },
    between_2_3: null,
    phase3: { label: 'Go to Phase 3 tournament', href: '/tournament-phase3' },
    complete: { label: 'View full report', href: '/insights/phase3' },
  }

  const action = phaseActions[phase]

  const phasePct: Record<string, number> = {
    onboarding: 10, phase1: 30, between_1_2: 45,
    phase2: 60, between_2_3: 75, phase3: 85, complete: 100,
  }

  return (
    <Card goldAccent className="p-5 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-caption text-gold uppercase tracking-wide mb-0.5">Current phase</p>
          <h2 className="font-heading text-h3 text-navy dark:text-cream">{PHASE_LABELS[phase]}</h2>
        </div>
        <Badge variant={phase === 'complete' ? 'success' : 'phase'}>
          {phase === 'complete' ? 'Complete' : 'Active'}
        </Badge>
      </div>
      <p className="text-body-sm text-slate mb-3">{PHASE_DESCRIPTIONS[phase]}</p>
      <LinearProgress value={phasePct[phase] ?? 0} showLabel size="sm" />
      {action && (
        <Button
          className="mt-4 w-full"
          onClick={() => router.push(action.href)}
        >
          {action.label}
        </Button>
      )}
    </Card>
  )
}

function MatchSummaryCard() {
  const router = useRouter()
  const confirmed = matchesData.slice(0, 2) // show first 2 for user-001

  if (confirmed.length === 0) return null

  const CANDIDATE_NAMES: Record<string, string> = {
    'user-008': 'Noah', 'user-002': 'James', 'user-003': 'Sophie',
    'user-013': 'Daniel', 'user-019': 'Elena',
  }

  return (
    <Card className="p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-caption text-gold uppercase tracking-wide">Your matches</p>
        <span className="text-caption text-slate">{confirmed.length} confirmed</span>
      </div>
      <div className="space-y-3">
        {confirmed.map(m => (
          <div
            key={m.matchId}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push(`/match/${m.matchId}`)}
          >
            <img
              src="/placeholders/avatar-m-20s-2.svg"
              alt=""
              className="w-10 h-12 object-cover rounded-card"
            />
            <div className="flex-1">
              <p className="text-body-sm font-semibold text-navy dark:text-cream group-hover:text-gold transition-colors">
                {CANDIDATE_NAMES[m.userBId] ?? 'Your match'}
              </p>
              <p className="text-caption text-slate">{m.perceivedSimilarity.headline}</p>
            </div>
            <HeartDisplay count={3} size="sm" />
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/tournament')}
        className="mt-3 w-full text-slate"
      >
        Back to tournament
      </Button>
    </Card>
  )
}

function NotificationsCard() {
  const notifications = (notificationsData as Notification[]).filter(n => !n.read).slice(0, 3)

  if (notifications.length === 0) return null

  const typeIcons: Record<string, string> = {
    phase_transition: '🔓',
    match_confirmed: '♥',
    calibration_reminder: '⏰',
    insights_ready: '📊',
    we_met_survey: '👋',
    community_update: '🌐',
    kit_status_update: '🧬',
  }

  return (
    <Card className="p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-caption text-gold uppercase tracking-wide">Notifications</p>
        <Badge variant="error">{notifications.length}</Badge>
      </div>
      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className="flex items-start gap-2">
            <span className="text-lg mt-0.5">{typeIcons[n.type] ?? '•'}</span>
            <div>
              <p className="text-body-sm font-semibold text-navy dark:text-cream">{n.title}</p>
              <p className="text-caption text-slate">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function InsightsCard() {
  const { phase } = usePhase()
  const router = useRouter()

  const insightLinks: { phase: string; label: string; href: string; available: boolean }[] = [
    { phase: 'Phase 1', label: 'Calibration insights', href: '/insights/phase1', available: true },
    { phase: 'Phase 2', label: 'Tournament insights', href: '/insights/phase2', available: phase !== 'onboarding' && phase !== 'phase1' },
    { phase: 'Phase 3', label: 'Full report', href: '/insights/phase3', available: phase === 'phase3' || phase === 'complete' },
  ]

  return (
    <Card className="p-5 mb-4">
      <p className="text-caption text-gold uppercase tracking-wide mb-3">Insights reports</p>
      <div className="space-y-2">
        {insightLinks.map(link => (
          <button
            key={link.href}
            onClick={() => link.available && router.push(link.href)}
            disabled={!link.available}
            className={`w-full flex items-center justify-between p-2.5 rounded-input border text-left transition-all ${
              link.available
                ? 'border-gold/30 hover:border-gold hover:bg-gold/5 cursor-pointer'
                : 'border-gray-light dark:border-dark-border opacity-40 cursor-not-allowed'
            }`}
          >
            <div>
              <p className="text-caption text-gold">{link.phase}</p>
              <p className="text-body-sm text-navy dark:text-cream">{link.label}</p>
            </div>
            {link.available ? (
              <span className="text-gold">→</span>
            ) : (
              <span className="text-slate text-caption">Locked</span>
            )}
          </button>
        ))}
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-lg mx-auto">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-heading text-h1 text-navy dark:text-cream mb-1">
            Hello, {user?.firstName ?? 'there'} ✦
          </h1>
          <p className="text-body text-slate">
            Welcome to your Harmonia dashboard.
          </p>
        </div>

        <PhaseStatusCard />
        <MatchSummaryCard />
        <NotificationsCard />
        <InsightsCard />
      </div>
    </div>
  )
}
