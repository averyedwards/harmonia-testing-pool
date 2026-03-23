'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import notificationsData from '@/mock-data/notifications.json'
import type { Notification } from '@/types'

const TYPE_ICONS: Record<string, string> = {
  phase_transition: '🔓',
  match_confirmed: '♥',
  calibration_reminder: '⏰',
  insights_ready: '📊',
  we_met_survey: '👋',
  community_update: '🌐',
  kit_status_update: '🧬',
}

function timeAgo(isoString: string): string {
  const ms = Date.now() - new Date(isoString).getTime()
  const days = Math.floor(ms / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1d ago'
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function NotificationSummaryCard() {
  const router = useRouter()
  const all = notificationsData as Notification[]
  const unread = all.filter(n => !n.read)
  const top3 = all.slice(0, 3)

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-caption text-gold uppercase tracking-wide">Notifications</p>
        {unread.length > 0 && (
          <Badge variant="error">{unread.length} unread</Badge>
        )}
      </div>

      <div className="divide-y divide-gray-light dark:divide-dark-border">
        {top3.map(n => (
          <div
            key={n.id}
            className="flex items-start gap-3 py-3 cursor-pointer group"
            onClick={() => n.actionUrl && router.push(n.actionUrl)}
          >
            {/* Unread dot */}
            <div className="relative flex-shrink-0 mt-1">
              <span className="text-lg">{TYPE_ICONS[n.type] ?? '•'}</span>
              {!n.read && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold text-navy dark:text-cream group-hover:text-gold transition-colors truncate">
                {n.title}
              </p>
              <p className="text-caption text-slate line-clamp-2">{n.body}</p>
            </div>

            <span className="text-caption text-slate flex-shrink-0">{timeAgo(n.createdAt)}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/notifications')}
        className="mt-3 w-full text-center text-caption text-gold hover:underline"
      >
        View all notifications →
      </button>
    </Card>
  )
}
