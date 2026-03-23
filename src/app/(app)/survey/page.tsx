'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import matchesData from '@/mock-data/matches.json'

// Candidate display names (matches mock data userBIds)
const CANDIDATE_NAMES: Record<string, string> = {
  'user-008': 'Noah',
  'user-002': 'James',
  'user-003': 'Sophie',
  'user-013': 'Daniel',
  'user-019': 'Elena',
}

const CANDIDATE_AVATARS: Record<string, string> = {
  'user-008': '/placeholders/avatar-m-20s-2.svg',
  'user-002': '/placeholders/avatar-m-30s-1.svg',
  'user-003': '/placeholders/avatar-f-20s-1.svg',
  'user-013': '/placeholders/avatar-m-20s-1.svg',
  'user-019': '/placeholders/avatar-f-30s-1.svg',
}

// ─── Step indicator ────────────────────────────────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            i < current
              ? 'w-6 h-2 bg-gold'
              : i === current
              ? 'w-6 h-2 bg-gold'
              : 'w-2 h-2 bg-gray-light dark:bg-dark-border',
          )}
        />
      ))}
    </div>
  )
}

// ─── Interest scale ────────────────────────────────────────────────────────────
const SCALE_LABELS: Record<number, string> = {
  1: 'No chemistry',
  2: 'Not for me',
  3: 'Lukewarm',
  4: 'Decent',
  5: 'Good',
  6: 'Really liked them',
  7: 'Strongly felt it',
}

function InterestScale({
  value,
  onChange,
}: {
  value: number | null
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-1">
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn(
              'flex-1 h-10 rounded-input font-semibold text-sm transition-all duration-200',
              value === n
                ? 'bg-gold text-wine-black shadow-gold-glow'
                : 'bg-blush dark:bg-dark-surface text-slate hover:bg-gold/20 hover:text-gold',
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {value !== null && (
        <p className="text-center text-body-sm text-gold font-semibold animate-fade-in">
          {SCALE_LABELS[value]}
        </p>
      )}
      <div className="flex justify-between text-caption text-slate">
        <span>No chemistry</span>
        <span>Strongly felt it</span>
      </div>
    </div>
  )
}

// ─── Main survey page ─────────────────────────────────────────────────────────
export default function SurveyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  const matchId = searchParams.get('matchId') ?? matchesData[0]?.matchId
  const match = matchesData.find(m => m.matchId === matchId)

  const candidateName = match ? (CANDIDATE_NAMES[match.userBId] ?? 'your match') : 'your match'
  const candidateAvatar = match ? (CANDIDATE_AVATARS[match.userBId] ?? '/placeholders/avatar-m-20s-1.svg') : '/placeholders/avatar-m-20s-1.svg'

  const [step, setStep] = useState(0)
  const [didMeet, setDidMeet] = useState<boolean | null>(null)
  const [interestScore, setInterestScore] = useState<number | null>(null)
  const [orientation, setOrientation] = useState<'short_term' | 'long_term' | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const totalSteps = didMeet === false ? 2 : 3

  async function handleSubmit() {
    setSubmitting(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 900))
    setSubmitting(false)
    showToast('Thank you for your feedback!', 'success')
    router.push('/dashboard')
  }

  // ── Step 0: Did you meet? ──────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="harmonia-container py-10 min-h-screen">
        <div className="max-w-sm mx-auto">
          <StepDots current={0} total={3} />

          <div className="text-center mb-8">
            <img
              src={candidateAvatar}
              alt={candidateName}
              className="w-20 h-24 object-cover rounded-card mx-auto mb-4"
            />
            <h1 className="font-heading text-h2 text-navy dark:text-cream mb-2">
              We Met
            </h1>
            <p className="text-body text-slate">
              Did you meet {candidateName} in person?
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setDidMeet(true); setStep(1) }}
              className="w-full p-4 rounded-card border-2 border-gold/30 hover:border-gold hover:bg-gold/5 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-navy dark:text-cream">Yes, we met</p>
                  <p className="text-caption text-slate">We connected in person</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => { setDidMeet(false); setStep(1) }}
              className="w-full p-4 rounded-card border-2 border-gray-light dark:border-dark-border hover:border-slate/40 hover:bg-blush dark:hover:bg-dark-surface transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">✗</span>
                <div>
                  <p className="font-semibold text-navy dark:text-cream">We didn&apos;t meet</p>
                  <p className="text-caption text-slate">We exchanged contacts but haven&apos;t met yet</p>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={() => router.back()}
            className="mt-8 w-full text-caption text-slate hover:text-gold transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    )
  }

  // ── Step 1 (didn't meet): Confirm & submit ─────────────────────────────────
  if (step === 1 && didMeet === false) {
    return (
      <div className="harmonia-container py-10 min-h-screen">
        <div className="max-w-sm mx-auto">
          <StepDots current={1} total={2} />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h1 className="font-heading text-h2 text-navy dark:text-cream mb-2">
              Still pending
            </h1>
            <p className="text-body text-slate max-w-[280px] mx-auto">
              That&apos;s fine — good things take time. We&apos;ll remind you again once you&apos;ve had a chance to meet.
            </p>
          </div>

          <Card className="p-4 mb-6">
            <p className="text-caption text-gold uppercase tracking-wide mb-1">Tip</p>
            <p className="text-body-sm text-slate">
              Harmonia matches are based on three compatibility signals. Meeting in person is the final step — most people find it&apos;s worth it.
            </p>
          </Card>

          <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Got it — back to dashboard'}
          </Button>

          <button
            onClick={() => setStep(0)}
            className="mt-4 w-full text-caption text-slate hover:text-gold transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  // ── Step 1 (met): How was the chemistry? ──────────────────────────────────
  if (step === 1 && didMeet === true) {
    return (
      <div className="harmonia-container py-10 min-h-screen">
        <div className="max-w-sm mx-auto">
          <StepDots current={1} total={3} />

          <div className="text-center mb-8">
            <h1 className="font-heading text-h2 text-navy dark:text-cream mb-2">
              How was it?
            </h1>
            <p className="text-body text-slate">
              How would you rate your in-person chemistry with {candidateName}?
            </p>
          </div>

          <Card className="p-5 mb-6">
            <InterestScale value={interestScore} onChange={setInterestScore} />
          </Card>

          <Button
            className="w-full"
            disabled={interestScore === null}
            onClick={() => setStep(2)}
          >
            Continue
          </Button>

          <button
            onClick={() => setStep(0)}
            className="mt-4 w-full text-caption text-slate hover:text-gold transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  // ── Step 2: Short-term or long-term? ──────────────────────────────────────
  if (step === 2) {
    return (
      <div className="harmonia-container py-10 min-h-screen">
        <div className="max-w-sm mx-auto">
          <StepDots current={2} total={3} />

          <div className="text-center mb-8">
            <h1 className="font-heading text-h2 text-navy dark:text-cream mb-2">
              What are you looking for?
            </h1>
            <p className="text-body text-slate">
              This is anonymous — it helps us understand how compatibility signals relate to relationship goals.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {[
              {
                value: 'long_term' as const,
                icon: '♾',
                label: 'Something serious',
                sub: 'Open to a long-term relationship',
              },
              {
                value: 'short_term' as const,
                icon: '⚡',
                label: 'Casual connection',
                sub: 'Dating without long-term expectations',
              },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setOrientation(o => o === opt.value ? null : opt.value)}
                className={cn(
                  'w-full p-4 rounded-card border-2 transition-all text-left',
                  orientation === opt.value
                    ? 'border-gold bg-gold/5'
                    : 'border-gray-light dark:border-dark-border hover:border-gold/40',
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <p className="font-semibold text-navy dark:text-cream">{opt.label}</p>
                    <p className="text-caption text-slate">{opt.sub}</p>
                  </div>
                  {orientation === opt.value && (
                    <span className="ml-auto text-gold font-bold">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <Button
            className="w-full mb-3"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit feedback'}
          </Button>

          <button
            onClick={handleSubmit}
            className="w-full text-caption text-slate hover:text-gold transition-colors"
            disabled={submitting}
          >
            Skip this question
          </button>

          <button
            onClick={() => setStep(1)}
            className="mt-3 w-full text-caption text-slate hover:text-gold transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  return null
}
