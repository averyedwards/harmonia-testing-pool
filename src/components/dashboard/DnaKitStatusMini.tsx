'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { KitStatus } from '@/types'

// Mock kit state for user-001 (London user)
const MOCK_KIT_STATUS: KitStatus = 'dispatched'

const STATUS_CONFIG: Record<KitStatus, {
  icon: string
  label: string
  detail: string
  badge: 'phase' | 'success' | 'warning' | 'error' | 'default'
}> = {
  waitlisted: {
    icon: '⏳',
    label: 'On waitlist',
    detail: 'You are on the DNA kit waitlist. We will notify you when your kit is ready.',
    badge: 'warning',
  },
  confirmed: {
    icon: '✓',
    label: 'Address confirmed',
    detail: 'Your address has been confirmed. Your kit will be dispatched shortly.',
    badge: 'phase',
  },
  dispatched: {
    icon: '📦',
    label: 'Kit dispatched',
    detail: 'Your DNA kit is on its way. Follow the enclosed instructions when it arrives.',
    badge: 'phase',
  },
  received: {
    icon: '🧬',
    label: 'Kit received',
    detail: 'We have received your sample. Results are being processed.',
    badge: 'phase',
  },
  results_uploaded: {
    icon: '🔓',
    label: 'Results ready',
    detail: 'Your DNA results are in. Phase 3 is now unlocked.',
    badge: 'success',
  },
}

export function DnaKitStatusMini() {
  const router = useRouter()
  const config = STATUS_CONFIG[MOCK_KIT_STATUS]

  return (
    <Card className="p-5">
      <p className="text-caption text-gold uppercase tracking-wide mb-3">DNA kit</p>

      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl flex-shrink-0 mt-0.5">{config.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-body-sm font-semibold text-navy dark:text-cream">{config.label}</p>
            <Badge variant={config.badge}>{config.label}</Badge>
          </div>
          <p className="text-caption text-slate leading-relaxed">{config.detail}</p>
        </div>
      </div>

      {MOCK_KIT_STATUS === 'results_uploaded' ? (
        <Button className="w-full" onClick={() => router.push('/tournament-phase3')}>
          Enter Phase 3
        </Button>
      ) : (
        <button
          onClick={() => router.push('/settings')}
          className="text-caption text-gold hover:underline"
        >
          View full status →
        </button>
      )}
    </Card>
  )
}
