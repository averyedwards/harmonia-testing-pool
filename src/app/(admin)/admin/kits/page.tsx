'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinearProgress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import adminStats from '@/mock-data/admin-stats.json'
import type { KitStatus } from '@/types'

const KIT_PIPELINE: { status: KitStatus; label: string; count: number; color: string }[] = [
  { status: 'waitlisted', label: 'Waitlisted', count: adminStats.waitlistSize, color: '#9B59B6' },
  { status: 'confirmed', label: 'Confirmed', count: adminStats.kitsAllocated - adminStats.waitlistSize, color: '#3498DB' },
  { status: 'dispatched', label: 'Dispatched', count: adminStats.kitsDispatched, color: '#F39C12' },
  { status: 'received', label: 'Received', count: adminStats.kitsReceived, color: '#2ECC71' },
  { status: 'results_uploaded', label: 'Results uploaded', count: adminStats.resultsUploaded, color: '#D4A853' },
]

const STATUS_VARIANT: Record<KitStatus, 'success' | 'phase' | 'warning' | 'error'> = {
  waitlisted: 'error',
  confirmed: 'phase',
  dispatched: 'warning',
  received: 'success',
  results_uploaded: 'success',
}

// Mock kit allocation data
const MOCK_KITS = [
  { userId: 'user-001', name: 'Alex Morgan', status: 'results_uploaded' as KitStatus, postcode: 'SE1 7PB' },
  { userId: 'user-003', name: 'Sophie Clarke', status: 'received' as KitStatus, postcode: 'N1 9GU' },
  { userId: 'user-005', name: 'Elena Martinez', status: 'dispatched' as KitStatus, postcode: 'SW3 4RJ' },
  { userId: 'user-007', name: 'Hannah Wilson', status: 'confirmed' as KitStatus, postcode: 'E2 8AB' },
  { userId: 'user-009', name: 'Priya Patel', status: 'waitlisted' as KitStatus, postcode: 'W2 3PL' },
]

export default function AdminKitsPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState<KitStatus | 'all'>('all')

  if (!isAdmin) return null

  const filtered = filterStatus === 'all' ? MOCK_KITS : MOCK_KITS.filter(k => k.status === filterStatus)

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1 text-caption text-slate hover:text-gold mb-6 transition-colors"
        >
          ← Admin dashboard
        </button>

        <h1 className="font-heading text-h1 text-navy dark:text-cream mb-8">DNA Kit Tracking</h1>

        {/* Pipeline */}
        <Card className="p-5 mb-6">
          <p className="text-caption text-gold uppercase tracking-wide mb-4">Kit pipeline</p>
          <div className="space-y-3">
            {KIT_PIPELINE.map(({ status, label, count, color }) => (
              <div key={status}>
                <div className="flex justify-between text-caption text-slate mb-1">
                  <span>{label}</span>
                  <span className="font-semibold" style={{ color }}>{count}</span>
                </div>
                <div className="h-2 bg-gray-light dark:bg-dark-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round((count / adminStats.kitsAllocated) * 100)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-badge text-caption font-medium transition-all ${
              filterStatus === 'all' ? 'bg-gold text-wine-black' : 'bg-gray-light dark:bg-dark-surface text-slate hover:bg-gold/20'
            }`}
          >
            All ({MOCK_KITS.length})
          </button>
          {KIT_PIPELINE.map(({ status, label }) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-badge text-caption font-medium transition-all ${
                filterStatus === status ? 'bg-gold text-wine-black' : 'bg-gray-light dark:bg-dark-surface text-slate hover:bg-gold/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Kit list */}
        <div className="space-y-2">
          {filtered.map(kit => (
            <Card key={kit.userId} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-body-sm font-semibold text-navy dark:text-cream">{kit.name}</p>
                <p className="text-caption text-slate">{kit.postcode} · {kit.userId}</p>
              </div>
              <Badge variant={STATUS_VARIANT[kit.status]}>
                {kit.status.replace(/_/g, ' ')}
              </Badge>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-body text-slate text-center py-8">No kits found for this filter.</p>
        )}
      </div>
    </div>
  )
}
