'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import type { AppNotification } from '@/providers/NotificationsProvider'

type NotificationType =
  | 'phase_transition'
  | 'match_confirmed'
  | 'calibration_reminder'
  | 'insights_ready'
  | 'we_met_survey'
  | 'community_update'
  | 'kit_status_update'

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

function groupByTime(notifications: AppNotification[]): { label: string; items: AppNotification[] }[] {
  const now = Date.now()
  const today: AppNotification[] = []
  const thisWeek: AppNotification[] = []
  const earlier: AppNotification[] = []

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
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [pushPromptDismissed, setPushPromptDismissed] = useState(true)
  const [pushState, setPushState] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default')

  // Detect push permission + dismissed state after hydration (client only)
  useEffect(() => {
    setPushPromptDismissed(
      localStorage.getItem('harmonia-push-dismissed') === 'true'
    )
    if (!('Notification' in window)) {
      setPushState('unsupported')
    } else {
      setPushState(Notification.permission as 'default' | 'granted' | 'denied')
    }
  }, [])

  const FILTER_TYPES: Record<string, string[] | null> = {
    all: null,
    unread: null,
    matches: ['match_confirmed'],
    phases: ['phase_transition', 'community_update', 'insights_ready', 'kit_status_update'],
    surveys: ['we_met_survey', 'calibration_reminder'],
  }

  const filterCounts: Record<string, number> = {
    all: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    matches: notifications.filter(n => n.type === 'match_confirmed').length,
    phases: notifications.filter(n => ['phase_transition', 'community_update', 'insights_ready', 'kit_status_update'].includes(n.type)).length,
    surveys: notifications.filter(n => ['we_met_survey', 'calibration_reminder'].includes(n.type)).length,
  }

  const filtered = activeFilter === 'all' ? notifications
    : activeFilter === 'unread' ? notifications.filter(n => !n.read)
    : notifications.filter(n => (FILTER_TYPES[activeFilter] ?? []).includes(n.type))

  const groups = groupByTime(filtered)

  function handleNotificationClick(notification: AppNotification) {
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

        {/* Filter tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-4 -mx-1 px-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'matches', label: 'Matches' },
            { key: 'phases', label: 'Phases' },
            { key: 'surveys', label: 'Surveys' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-button text-caption font-medium transition-all shrink-0',
                activeFilter === tab.key
                  ? 'bg-gold/15 text-gold border-b-2 border-gold'
                  : 'text-slate hover:text-navy dark:hover:text-cream hover:bg-blush dark:hover:bg-dark-bg'
              )}
            >
              {tab.label}
              {filterCounts[tab.key] > 0 && (
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                  activeFilter === tab.key
                    ? 'bg-gold/20 text-gold'
                    : 'bg-gray-light dark:bg-dark-border text-slate/60'
                )}>
                  {filterCounts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Push permission prompt */}
        {pushState === 'default' && !pushPromptDismissed && (
          <Card className="p-4 mb-4 border-l-2 border-l-gold">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-lg shrink-0">
                🔔
              </div>
              <div className="flex-1">
                <p className="text-body-sm font-semibold text-navy dark:text-cream mb-1">
                  Never miss a match
                </p>
                <p className="text-caption text-slate mb-3">
                  Get notified when you have a new match, when phases open,
                  and when your insights are ready.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={async () => {
                      const result = await Notification.requestPermission()
                      setPushState(result as 'default' | 'granted' | 'denied')
                      if (result === 'granted') {
                        setPushPromptDismissed(true)
                        localStorage.setItem('harmonia-push-dismissed', 'true')
                      }
                    }}
                  >
                    Enable notifications
                  </Button>
                  <button
                    onClick={() => {
                      setPushPromptDismissed(true)
                      localStorage.setItem('harmonia-push-dismissed', 'true')
                    }}
                    className="text-caption text-slate hover:text-navy dark:hover:text-cream transition-colors"
                  >
                    Not now
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {pushState === 'denied' && !pushPromptDismissed && (
          <Card className="p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">⚠️</span>
              <div>
                <p className="text-body-sm font-medium text-navy dark:text-cream mb-1">
                  Notifications blocked
                </p>
                <p className="text-caption text-slate">
                  Push notifications are blocked in your browser. Click the lock
                  icon in your address bar to allow notifications for this site.
                </p>
              </div>
            </div>
          </Card>
        )}

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
                        {NOTIFICATION_ICONS[notification.type as NotificationType] ?? '•'}
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

        {/* Filtered empty state */}
        {filtered.length === 0 && notifications.length > 0 && (
          <div className="text-center py-12">
            <p className="text-body text-slate mb-2">
              No {activeFilter === 'unread' ? 'unread' : activeFilter} notifications.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="text-caption text-gold hover:text-gold/80 transition-colors"
            >
              View all notifications
            </button>
          </div>
        )}

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
