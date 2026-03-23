'use client'

import { use } from 'react'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeartDisplay } from '@/components/tournament/HeartDisplay'
import { GeneticsIndicator } from '@/components/tournament/GeneticsIndicator'
import { ContactExchange } from '@/components/match/ContactExchange'
import { getHlaDisplayTier } from '@/lib/constants'
import { HEARTS_TO_MATCH } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import matchesData from '@/mock-data/matches.json'
import type { ContactType } from '@/types'

// Mock candidate display data (in real app, fetched from API with matchId)
const CANDIDATE_DISPLAY: Record<string, { displayName: string; age: number; location: string; avatar: string }> = {
  'user-008': { displayName: 'Noah', age: 28, location: 'London, UK', avatar: '/placeholders/avatar-m-20s-2.svg' },
  'user-002': { displayName: 'James', age: 30, location: 'London, UK', avatar: '/placeholders/avatar-m-30s-1.svg' },
  'user-003': { displayName: 'Sophie', age: 27, location: 'London, UK', avatar: '/placeholders/avatar-f-20s-1.svg' },
  'user-013': { displayName: 'Daniel', age: 31, location: 'Paris, France', avatar: '/placeholders/avatar-m-20s-1.svg' },
  'user-019': { displayName: 'Elena', age: 29, location: 'Madrid, Spain', avatar: '/placeholders/avatar-f-30s-1.svg' },
}

const tierBadgeVariant: Record<string, 'success' | 'phase' | 'warning' | 'error'> = {
  strong_fit: 'success',
  good_fit: 'phase',
  moderate_fit: 'warning',
  low_fit: 'error',
}

export default function MatchPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params)
  const router = useRouter()
  const [contactExchanged, setContactExchanged] = useState(false)

  // Find match from mock data (use matchId as candidate id fallback)
  const match = matchesData.find(m => m.matchId === matchId) ?? matchesData[0]
  const candidateUserId = match.userBId
  const candidate = CANDIDATE_DISPLAY[candidateUserId] ?? {
    displayName: 'Your Match',
    age: 29,
    location: 'London, UK',
    avatar: '/placeholders/avatar-m-20s-1.svg',
  }

  const hlaDisplayTier = match.hlaScore ? getHlaDisplayTier(match.hlaScore) : 'hidden'
  const confirmedDate = new Date(match.confirmedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const ps = match.perceivedSimilarity

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-md mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-caption text-slate hover:text-gold mb-6 transition-colors"
        >
          ← Back
        </button>

        {/* Match header */}
        <div className="text-center mb-6 animate-fade-in">
          {/* Photo */}
          <div className="relative inline-block mb-3">
            <img
              src={candidate.avatar}
              alt={candidate.displayName}
              className="w-28 h-36 object-cover rounded-card shadow-card mx-auto"
            />
            {/* Match badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <div className="bg-gold text-wine-black text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                ✦ CONFIRMED MATCH
              </div>
            </div>
          </div>

          <h1 className="font-heading text-h2 text-navy dark:text-cream mt-4 mb-0.5">
            {candidate.displayName}, {candidate.age}
          </h1>
          <p className="text-caption text-slate">{candidate.location}</p>
          <p className="text-caption text-slate mt-1">Matched {confirmedDate}</p>

          <div className="flex items-center justify-center gap-3 mt-3">
            <HeartDisplay count={HEARTS_TO_MATCH} size="md" />
            {hlaDisplayTier !== 'hidden' && match.hlaScore && (
              <GeneticsIndicator
                hlaScore={match.hlaScore}
                hlaDisplayTier={hlaDisplayTier}
              />
            )}
          </div>
        </div>

        {/* Personality compatibility */}
        <Card goldAccent className="p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-caption text-gold uppercase tracking-wide">Personality compatibility</p>
            <Badge variant={tierBadgeVariant[ps.tier] ?? 'phase'}>
              {ps.overlapCount}/7 traits
            </Badge>
          </div>
          <p className="text-body-sm font-semibold text-navy dark:text-cream mb-3">
            {ps.headline}
          </p>
          <div className="space-y-2">
            {ps.sharedTraits.map((trait) => (
              <div key={trait.sin} className="flex items-start gap-2">
                <span className="text-gold mt-0.5 text-xs">♥</span>
                <p className="text-caption text-slate">{trait.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* HLA summary (Phase 3 only) */}
        {match.hlaScore && hlaDisplayTier !== 'hidden' && (
          <Card className="p-5 mb-4">
            <p className="text-caption text-gold uppercase tracking-wide mb-2">🧬 Chemistry signal</p>
            <p className="text-body-sm text-navy dark:text-cream font-semibold mb-1">
              {hlaDisplayTier === 'strong' ? 'Strong' : hlaDisplayTier === 'good' ? 'Good' : 'Some'} HLA compatibility
              <span className="text-caption text-slate font-normal ml-2">({match.hlaScore}/100)</span>
            </p>
            <p className="text-caption text-slate">
              Research suggests higher immune gene dissimilarity may contribute to unconscious attraction.
              This is one signal among many — not a prediction.
            </p>
          </Card>
        )}

        {/* Contact exchange */}
        <Card className="p-5 mb-4">
          {match.contactExchanged ? (
            <div>
              <p className="text-caption text-gold uppercase tracking-wide mb-2">Contact exchange</p>
              <div className="flex items-center gap-2">
                <span className="text-chemistry-strong text-lg">✓</span>
                <p className="text-body-sm text-navy dark:text-cream">
                  Contact details have been exchanged
                </p>
              </div>
              <p className="text-caption text-slate mt-2">
                Check your notifications for {candidate.displayName}'s contact method.
              </p>
            </div>
          ) : (
            <ContactExchange
              matchDisplayName={candidate.displayName}
              onSubmit={(type: ContactType, value: string) => {
                setContactExchanged(true)
              }}
            />
          )}
        </Card>

        {/* Survey prompt */}
        <Card className="p-5 mb-6">
          <p className="text-caption text-gold uppercase tracking-wide mb-2">Did you meet?</p>
          <p className="text-body-sm text-slate mb-3">
            After meeting {candidate.displayName}, let us know how it went. Your feedback
            helps improve compatibility matching for everyone.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/survey/${matchId}`)}
            className="w-full"
          >
            Complete the "We Met" survey
          </Button>
        </Card>

        {/* Actions */}
        <Button
          variant="ghost"
          onClick={() => router.push('/tournament')}
          className="w-full text-slate"
        >
          Back to tournament
        </Button>
      </div>
    </div>
  )
}
