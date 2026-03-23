'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import usersData from '@/mock-data/users.json'
import { PHASE_LABELS } from '@/lib/constants'
import type { User, Phase } from '@/types'

export default function AdminUsersPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState('')

  if (!isAdmin) return null

  const users = usersData as User[]
  const filtered = users.filter(u =>
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.location.toLowerCase().includes(search.toLowerCase())
  )

  const phaseBadge: Record<Phase, 'success' | 'phase' | 'warning' | 'error'> = {
    onboarding: 'error',
    phase1: 'warning',
    between_1_2: 'warning',
    phase2: 'phase',
    between_2_3: 'phase',
    phase3: 'success',
    complete: 'success',
  }

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1 text-caption text-slate hover:text-gold mb-6 transition-colors"
        >
          ← Admin dashboard
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-h1 text-navy dark:text-cream">Users</h1>
          <span className="text-caption text-slate">{usersData.length} total</span>
        </div>

        <div className="mb-4">
          <Input
            label=""
            placeholder="Search by name, email, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {filtered.map(u => (
            <Card key={u.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-sm font-semibold text-gold flex-shrink-0">
                    {u.firstName[0]}{u.lastName[0]}
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-navy dark:text-cream">{u.displayName}</p>
                    <p className="text-caption text-slate">{u.email}</p>
                    <p className="text-caption text-slate">{u.age} · {u.gender} · {u.location}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge variant={phaseBadge[u.currentPhase]}>{PHASE_LABELS[u.currentPhase]}</Badge>
                  {u.isLondon && <Badge variant="phase">London</Badge>}
                  {u.role === 'admin' && <Badge variant="error">Admin</Badge>}
                </div>
              </div>
              <div className="flex gap-3 mt-2 text-[10px] text-slate">
                <span>Calibration: {u.calibrationComplete ? '✓' : '✗'}</span>
                <span>Questionnaire: {u.questionnaireComplete ? '✓' : '✗'}</span>
                <span>Onboarding step: {u.onboardingStep}</span>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-body text-slate text-center py-8">No users found matching "{search}"</p>
        )}
      </div>
    </div>
  )
}
