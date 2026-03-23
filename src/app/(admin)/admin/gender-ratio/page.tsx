'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LinearProgress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import adminStats from '@/mock-data/admin-stats.json'
import usersData from '@/mock-data/users.json'
import { PHASE_LABELS } from '@/lib/constants'
import type { User, Phase } from '@/types'

export default function AdminGenderRatioPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()

  if (!isAdmin) return null

  const users = usersData as User[]
  const total = adminStats.totalUsers
  const femalePct = Math.round((adminStats.genderRatio.female / total) * 100)
  const malePct = Math.round((adminStats.genderRatio.male / total) * 100)

  // Breakdown by phase
  const phases: Phase[] = ['phase1', 'between_1_2', 'phase2', 'between_2_3', 'phase3', 'complete']
  const phaseBreakdown = phases.map(p => {
    const inPhase = users.filter(u => u.currentPhase === p)
    const female = inPhase.filter(u => u.gender === 'female').length
    const male = inPhase.filter(u => u.gender === 'male').length
    return { phase: p, total: inPhase.length, female, male }
  })

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1 text-caption text-slate hover:text-gold mb-6 transition-colors"
        >
          ← Admin dashboard
        </button>

        <h1 className="font-heading text-h1 text-navy dark:text-cream mb-8">Gender Ratio</h1>

        {/* Overall */}
        <Card goldAccent className="p-5 mb-6">
          <p className="text-caption text-gold uppercase tracking-wide mb-4">Overall</p>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="text-center">
              <p className="font-heading text-display text-gold">{femalePct}%</p>
              <p className="text-body-sm text-slate">Female</p>
              <p className="text-caption text-slate">{adminStats.genderRatio.female} users</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-display text-gold">{malePct}%</p>
              <p className="text-body-sm text-slate">Male</p>
              <p className="text-caption text-slate">{adminStats.genderRatio.male} users</p>
            </div>
          </div>

          {/* Visual bar */}
          <div className="h-4 rounded-full overflow-hidden flex">
            <div className="bg-[#E84A8A] h-full transition-all" style={{ width: `${femalePct}%` }} />
            <div className="bg-gold h-full flex-1" />
          </div>
          <div className="flex justify-between text-caption text-slate mt-1">
            <span>Female</span>
            <span>Male</span>
          </div>

          {/* Balance indicator */}
          <div className="mt-3 flex items-center gap-2">
            {Math.abs(femalePct - 50) <= 5
              ? <Badge variant="success">Well balanced</Badge>
              : Math.abs(femalePct - 50) <= 10
                ? <Badge variant="warning">Slightly imbalanced</Badge>
                : <Badge variant="error">Imbalanced — recruitment needed</Badge>
            }
            <p className="text-caption text-slate">Target: 50/50 ±5%</p>
          </div>
        </Card>

        {/* By phase */}
        <Card className="p-5 mb-4">
          <p className="text-caption text-gold uppercase tracking-wide mb-3">By phase</p>
          <div className="space-y-3">
            {phaseBreakdown.filter(p => p.total > 0).map(pb => {
              const fPct = pb.total > 0 ? Math.round((pb.female / pb.total) * 100) : 50
              return (
                <div key={pb.phase}>
                  <div className="flex justify-between text-caption text-slate mb-1">
                    <span>{PHASE_LABELS[pb.phase]}</span>
                    <span>
                      <span style={{ color: '#E84A8A' }}>{pb.female}F</span>
                      {' / '}
                      <span className="text-gold">{pb.male}M</span>
                      {' '}({pb.total})
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden flex bg-gray-light dark:bg-dark-border">
                    <div className="bg-[#E84A8A] h-full" style={{ width: `${fPct}%` }} />
                    <div className="bg-gold h-full flex-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* London vs Global */}
        <Card className="p-5">
          <p className="text-caption text-gold uppercase tracking-wide mb-3">London vs Global</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="font-heading text-h2 text-gold">{adminStats.londonUsers}</p>
              <p className="text-caption text-slate">London users</p>
              <p className="text-[10px] text-slate">(DNA kit eligible)</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-h2 text-gold">{adminStats.globalUsers}</p>
              <p className="text-caption text-slate">Global users</p>
              <p className="text-[10px] text-slate">(Phase 1+2 only)</p>
            </div>
          </div>
          <div className="mt-3">
            <LinearProgress
              value={Math.round((adminStats.londonUsers / total) * 100)}
              showLabel
              size="sm"
            />
          </div>
          <p className="text-caption text-slate mt-1 text-center">
            {Math.round((adminStats.londonUsers / total) * 100)}% London
          </p>
        </Card>
      </div>
    </div>
  )
}
