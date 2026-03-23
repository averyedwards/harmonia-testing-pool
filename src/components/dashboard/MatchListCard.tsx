'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import matchesData from '@/mock-data/matches.json'
import usersData from '@/mock-data/users.json'

const CURRENT_USER_ID = 'user-001'

function timeAgo(isoString: string): string {
  const ms = Date.now() - new Date(isoString).getTime()
  const days = Math.floor(ms / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export function MatchListCard() {
  const router = useRouter()

  // Filter matches for the current user (user-001)
  const myMatches = matchesData
    .filter(m => m.userAId === CURRENT_USER_ID || m.userBId === CURRENT_USER_ID)
    .slice(0, 5)

  if (myMatches.length === 0) {
    return (
      <Card className="p-5">
        <p className="text-caption text-gold uppercase tracking-wide mb-3">Your matches</p>
        <p className="text-body-sm text-slate text-center py-4">
          No matches yet. Keep going in the tournament!
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-caption text-gold uppercase tracking-wide">Your matches</p>
        <span className="text-caption text-slate">{myMatches.length} confirmed</span>
      </div>

      <div className="divide-y divide-gray-light dark:divide-dark-border">
        {myMatches.map(match => {
          const partnerId = match.userAId === CURRENT_USER_ID ? match.userBId : match.userAId
          const partner = (usersData as { id: string; firstName: string; age: number }[])
            .find(u => u.id === partnerId)
          const name = partner?.firstName ?? 'Your match'
          const age = partner?.age
          const initial = name[0].toUpperCase()

          return (
            <div
              key={match.matchId}
              className="flex items-center gap-3 py-3 cursor-pointer group"
              onClick={() => router.push(`/match/${match.matchId}`)}
            >
              {/* Avatar initial */}
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0">
                <span className="font-heading text-sm font-bold text-gold">{initial}</span>
              </div>

              {/* Name + similarity */}
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-semibold text-navy dark:text-cream group-hover:text-gold transition-colors truncate">
                  {name}{age ? `, ${age}` : ''}
                </p>
                <p className="text-caption text-slate truncate">
                  {match.perceivedSimilarity.headline}
                </p>
              </div>

              {/* Right side: contact badge + time + arrow */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {match.contactExchanged ? (
                  <Badge variant="success" className="text-xs">Connected</Badge>
                ) : (
                  <Badge variant="default" className="text-xs">Matched</Badge>
                )}
                <span className="text-caption text-slate hidden sm:block">
                  {timeAgo(match.confirmedAt)}
                </span>
                <span className="text-gold">›</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
