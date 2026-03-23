'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinearProgress } from '@/components/ui/progress'
import adminStats from '@/mock-data/admin-stats.json'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { PHASE_LABELS } from '@/lib/constants'
import type { Phase } from '@/types'

export default function AdminDashboardPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()

  if (!isAdmin) {
    return (
      <div className="harmonia-container py-16 min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <p className="font-heading text-h2 text-maroon mb-3">Access denied</p>
          <p className="text-body text-slate mb-4">Admin access required.</p>
          <Button onClick={() => router.push('/dashboard')}>Back to dashboard</Button>
        </div>
      </div>
    )
  }

  const phases: Phase[] = ['onboarding', 'phase1', 'between_1_2', 'phase2', 'between_2_3', 'phase3', 'complete']

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-caption text-gold uppercase tracking-wide mb-1">Admin Panel</p>
          <h1 className="font-heading text-h1 text-navy dark:text-cream mb-2">Dashboard</h1>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          {[
            { label: 'Total users', value: adminStats.totalUsers },
            { label: 'London', value: adminStats.londonUsers },
            { label: 'Global', value: adminStats.globalUsers },
            { label: 'Kits dispatched', value: adminStats.kitsDispatched },
          ].map(({ label, value }) => (
            <Card key={label} className="p-4 text-center">
              <p className="font-heading text-h2 text-gold">{value}</p>
              <p className="text-caption text-slate">{label}</p>
            </Card>
          ))}
        </div>

        {/* Gender ratio */}
        <Card className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-3">Gender ratio</p>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-caption text-slate w-16">Female</span>
            <div className="flex-1">
              <LinearProgress
                value={(adminStats.genderRatio.female / adminStats.totalUsers) * 100}
                showLabel
                size="sm"
              />
            </div>
            <span className="text-caption text-slate w-8 text-right">{adminStats.genderRatio.female}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-caption text-slate w-16">Male</span>
            <div className="flex-1">
              <LinearProgress
                value={(adminStats.genderRatio.male / adminStats.totalUsers) * 100}
                showLabel
                size="sm"
              />
            </div>
            <span className="text-caption text-slate w-8 text-right">{adminStats.genderRatio.male}</span>
          </div>
        </Card>

        {/* Users by phase */}
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption text-gold uppercase tracking-wide">Users by phase</p>
            <Button size="sm" variant="secondary" onClick={() => router.push('/admin/phases')}>
              Manage phases
            </Button>
          </div>
          <div className="space-y-2">
            {phases.map(p => {
              const count = adminStats.usersByPhase[p as keyof typeof adminStats.usersByPhase] ?? 0
              const pct = Math.round((count / adminStats.totalUsers) * 100)
              return (
                <div key={p} className="flex items-center gap-3">
                  <span className="text-caption text-slate w-36 truncate">{PHASE_LABELS[p]}</span>
                  <div className="flex-1">
                    <LinearProgress value={pct} size="sm" />
                  </div>
                  <span className="text-caption text-gold font-semibold w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Completion rates */}
        <Card className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-3">Completion rates</p>
          {[
            { label: 'Calibration complete', value: adminStats.calibrationCompletionRate },
            { label: 'Questionnaire complete', value: adminStats.questionnaireCompletionRate },
          ].map(({ label, value }) => (
            <div key={label} className="mb-3">
              <div className="flex justify-between text-caption text-slate mb-1">
                <span>{label}</span>
                <span className="font-semibold text-navy dark:text-cream">{Math.round(value * 100)}%</span>
              </div>
              <LinearProgress value={value * 100} size="sm" />
            </div>
          ))}
        </Card>

        {/* DNA kit pipeline */}
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption text-gold uppercase tracking-wide">DNA kit pipeline</p>
            <Button size="sm" variant="secondary" onClick={() => router.push('/admin/kits')}>
              View kits
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Allocated', value: adminStats.kitsAllocated },
              { label: 'Dispatched', value: adminStats.kitsDispatched },
              { label: 'Received', value: adminStats.kitsReceived },
              { label: 'Results uploaded', value: adminStats.resultsUploaded },
            ].map(({ label, value }) => (
              <div key={label} className="harmonia-card p-2">
                <p className="font-heading text-h4 text-gold">{value}</p>
                <p className="text-[10px] text-slate">{label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-3">Recent activity (7 days)</p>
          <div className="space-y-2">
            {adminStats.recentActivity.map(a => (
              <div key={a.event} className="flex items-center justify-between">
                <p className="text-body-sm text-slate">{a.event}</p>
                <Badge variant="phase">{a.count}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Admin nav */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Users', href: '/admin/users', icon: '👤' },
            { label: 'Phases', href: '/admin/phases', icon: '🔓' },
            { label: 'Kits', href: '/admin/kits', icon: '🧬' },
            { label: 'Export', href: '/admin/export', icon: '📊' },
            { label: 'Gemini Review', href: '/admin/gemini', icon: '🤖' },
          ].map(({ label, href, icon }) => (
            <Button
              key={label}
              variant="secondary"
              onClick={() => router.push(href)}
              className="flex items-center gap-2 justify-center"
            >
              <span>{icon}</span> {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
