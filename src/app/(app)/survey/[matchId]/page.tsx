'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { WE_MET_INTEREST_SCALE_MIN, WE_MET_INTEREST_SCALE_MAX } from '@/lib/constants'

const INTEREST_LABELS: Record<number, string> = {
  1: 'Not at all',
  2: 'Unlikely',
  3: 'Probably not',
  4: 'Neutral',
  5: 'Possibly',
  6: 'Likely',
  7: 'Definitely',
}

export default function SurveyPage({ params }: { params: { matchId: string } }) {
  const { matchId } = params
  const router = useRouter()

  const [didMeet, setDidMeet] = useState<boolean | null>(null)
  const [interestScore, setInterestScore] = useState<number | null>(null)
  const [orientation, setOrientation] = useState<'short_term' | 'long_term' | 'not_sure' | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = didMeet !== null && orientation !== null && (didMeet === false || interestScore !== null)

  const handleSubmit = () => {
    setSubmitted(true)
    // In production: POST /api/v1/survey/we-met
  }

  if (submitted) {
    return (
      <div className="harmonia-container py-16 min-h-screen">
        <div className="max-w-md mx-auto text-center animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🙏</span>
          </div>
          <h1 className="font-heading text-h2 text-gold mb-3">Thank you!</h1>
          <p className="text-body text-slate mb-6">
            Your feedback helps us understand what makes connections work.
            It feeds directly into improving Harmonia for everyone.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push('/insights/phase2')}>
              View my Phase 2 insights
            </Button>
            <Button variant="secondary" onClick={() => router.push('/dashboard')}>
              Back to dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-caption text-slate hover:text-gold mb-6 transition-colors"
        >
          ← Back
        </button>

        <h1 className="font-heading text-h2 text-navy dark:text-cream mb-1">We Met survey</h1>
        <p className="text-body-sm text-slate mb-6">
          Anonymous, voluntary, and used only for research. Takes under 2 minutes.
        </p>

        {/* Q1: Did you meet? */}
        <Card className="p-5 mb-4">
          <p className="text-body-sm font-semibold text-navy dark:text-cream mb-3">
            Did you meet up with your match?
          </p>
          <div className="flex gap-3">
            {[{ label: 'Yes, we met', value: true }, { label: "We haven't yet", value: false }].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => setDidMeet(opt.value)}
                className={cn(
                  'flex-1 py-2.5 px-3 rounded-input border text-body-sm font-medium transition-all',
                  didMeet === opt.value
                    ? 'border-gold bg-gold/10 text-navy dark:text-cream'
                    : 'border-gray-light dark:border-dark-border text-slate hover:border-gold/50',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Q2: Interest score (if met) */}
        {didMeet === true && (
          <Card className="p-5 mb-4 animate-fade-in">
            <p className="text-body-sm font-semibold text-navy dark:text-cream mb-1">
              How interested are you in seeing them again?
            </p>
            <p className="text-caption text-slate mb-4">1 = not at all, 7 = definitely</p>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: WE_MET_INTEREST_SCALE_MAX }, (_, i) => i + WE_MET_INTEREST_SCALE_MIN).map(n => (
                <button
                  key={n}
                  onClick={() => setInterestScore(n)}
                  className={cn(
                    'w-10 h-10 rounded-button border text-body-sm font-semibold transition-all',
                    interestScore === n
                      ? 'border-gold bg-gold text-wine-black'
                      : 'border-gray-light dark:border-dark-border text-slate hover:border-gold/50',
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            {interestScore && (
              <p className="text-caption text-gold mt-2 animate-fade-in">
                {INTEREST_LABELS[interestScore]}
              </p>
            )}
          </Card>
        )}

        {/* Q3: Orientation (always shown once Q1 answered; Q2 must be answered first if they met) */}
        {didMeet !== null && (didMeet === false || interestScore !== null) && (
          <Card className="p-5 mb-4 animate-fade-in">
            <p className="text-body-sm font-semibold text-navy dark:text-cream mb-3">
              What kind of connection are you open to?
            </p>
            <div className="flex gap-3">
              {[
                { value: 'short_term' as const, label: 'Something casual', icon: '🌿' },
                { value: 'long_term' as const, label: 'Something serious', icon: '🌳' },
                { value: 'not_sure' as const, label: 'Not sure yet', icon: '🌱' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setOrientation(opt.value)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-input border text-body-sm font-medium transition-all',
                    orientation === opt.value
                      ? 'border-gold bg-gold/10 text-navy dark:text-cream'
                      : 'border-gray-light dark:border-dark-border text-slate hover:border-gold/50',
                  )}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Privacy note */}
        <p className="text-caption text-slate text-center mb-6">
          Your responses are anonymised and used only for research. Neither your match nor
          any third party will see your individual answers.
        </p>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full"
          size="lg"
        >
          Submit survey
        </Button>
      </div>
    </div>
  )
}
