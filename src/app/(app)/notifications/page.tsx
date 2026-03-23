'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import notificationsData from '@/mock-data/notifications.json'

type NotificationType =
  | 'phase_transition'
  | 'match_confirmed'
  | 'calibration_reminder'
  | 'insights_ready'
  | 'we_met_survey'
  | 'community_update'
  | 'kit_status_update'

interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  createdAt: string
  actionUrl: string
}

const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  phase_transition: '🚀',
  match_confirmed: '💛',
  calibration_reminder: '👁',
  insights_ready: '📊',
  we_met_survey: '🙏',
  community_update: '📣',
  kit_status_update: '🧬',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  if (days >= 7) return `${Math.floor(days / 7)}w ago`
  if (days >= 1) return `${days}d ago`
  if (hours >= 1) return `${hours}h ago`
  return 'Just now'
}

function groupByTime(notifications: Notification[]): { label: string; items: Notification[] }[] {
  const now = Date.now()
  const today: Notification[] = []
  const thisWeek: Notification[] = []
  const earlier: Notification[] = []

  for (const n of notifications) {
    const diff = now - new Date(n.createdAt).getTime()
    const days = diff / 86400000
    if (days < 1) today.push(n)
    else if (days < 7) thisWeek.push(n)
    else earlier.push(n)
  }

  const groups = []
  if (today.length) groups.push({ label: 'Today', items: today })
  if (thisWeek.length) groups.push({ label: 'This week', items: thisWeek })
  if (earlier.length) groups.push({ label: 'Earlier', items: earlier })
  return groups
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(
    [...notificationsData as Notification[]].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  )

  const unreadCount = notifications.filter(n => !n.read).length
  const groups = groupByTime(notifications)

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function handleNotificationClick(notification: Notification) {
    markRead(notification.id)
    router.push(notification.actionUrl)
  }

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-h1 text-navy dark:text-cream">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-caption text-slate mt-0.5">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-slate">
              Mark all read
            </Button>
          )}
        </div>

        {/* Empty state */}
        {notifications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔔</span>
            </div>
            <p className="text-body text-slate">You're all caught up.</p>
          </div>
        )}

        {/* Grouped notifications */}
        <div className="space-y-6">
          {groups.map(({ label, items }) => (
            <div key={label}>
              <p className="text-caption text-slate uppercase tracking-widest mb-2 px-1">{label}</p>
              <div className="space-y-2">
                {items.map(notification => (
                  <Card
                    key={notification.id}
                    className={`p-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${
                      !notification.read ? 'border-l-2 border-l-gold' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                        {NOTIFICATION_ICONS[notification.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-body-sm ${!notification.read ? 'font-semibold text-navy dark:text-cream' : 'text-slate'}`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />
                            )}
                            <span className="text-caption text-slate whitespace-nowrap">
                              {timeAgo(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className="text-caption text-slate mt-0.5 line-clamp-2">
                          {notification.body}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-slate">
            ← Back to dashboard
          </Button>
        </div>

      </div>
    </div>
  )
}
