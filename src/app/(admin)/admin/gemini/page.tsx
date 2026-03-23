'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { SIN_COLORS } from '@/lib/constants'
import { FELIX_QUESTIONS } from '@/types'

type ReviewStatus = 'pending' | 'approved' | 'corrected'

interface SinReviewScore {
  sin: string
  score: number
  confidence: number
  evidence: string
}

interface GeminiReview {
  id: string
  userId: string
  userName: string
  questionNumber: number
  questionText: string
  responseText: string
  scores: SinReviewScore[]
  qualityScore: number
  status: ReviewStatus
}

const INITIAL_REVIEWS: GeminiReview[] = [
  {
    id: 'review-001',
    userId: 'user-003',
    userName: 'Priya Shah',
    questionNumber: 2,
    questionText: FELIX_QUESTIONS[1].text,
    responseText:
      "I would listen carefully and try to understand where this feeling comes from. Envy is natural and I think it often reveals what we truly want for ourselves but feel unable to achieve. I would tell my friend that acknowledging it is brave and suggest channeling that energy into their own goals rather than comparing.",
    scores: [
      { sin: 'envy', score: -2.1, confidence: 0.72, evidence: 'normalises envy, suggests channelling constructively' },
      { sin: 'pride', score: 0.8, confidence: 0.55, evidence: 'views listening as brave, slight self-positioning' },
      { sin: 'wrath', score: -3.4, confidence: 0.88, evidence: 'entirely non-confrontational, empathetic response' },
    ],
    qualityScore: 45,
    status: 'pending',
  },
  {
    id: 'review-002',
    userId: 'user-006',
    userName: 'Marcus Chen',
    questionNumber: 4,
    questionText: FELIX_QUESTIONS[3].text,
    responseText:
      "I would confront them directly but privately. Taking credit for someone else's work is unacceptable and I would make it clear that I expect proper attribution going forward. If it continued I would escalate to management without hesitation.",
    scores: [
      { sin: 'wrath', score: 3.2, confidence: 0.85, evidence: 'direct confrontation, escalate without hesitation' },
      { sin: 'pride', score: 2.7, confidence: 0.79, evidence: 'strong ownership, expects attribution' },
      { sin: 'greed', score: 1.1, confidence: 0.51, evidence: 'weak signal, protects what is theirs' },
    ],
    qualityScore: 52,
    status: 'pending',
  },
  {
    id: 'review-003',
    userId: 'user-009',
    userName: 'Emma Bergstrom',
    questionNumber: 1,
    questionText: FELIX_QUESTIONS[0].text,
    responseText: 'just split it evenly its not worth the hassle of figuring out who owes what life is too short',
    scores: [
      { sin: 'greed', score: -3.8, confidence: 0.91, evidence: 'indifference to money fairness' },
      { sin: 'sloth', score: 2.4, confidence: 0.77, evidence: 'avoids effort, path of least resistance' },
    ],
    qualityScore: 38,
    status: 'pending',
  },
]

function qualityBadgeVariant(score: number): 'success' | 'warning' | 'error' {
  if (score >= 60) return 'success'
  if (score >= 40) return 'warning'
  return 'error'
}

function statusBadgeVariant(status: ReviewStatus): 'warning' | 'success' | 'phase' {
  if (status === 'pending') return 'warning'
  if (status === 'approved') return 'success'
  return 'phase'
}

function formatScore(score: number): string {
  return score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1)
}

export default function AdminGeminiPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<GeminiReview[]>(INITIAL_REVIEWS)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  if (!isAdmin) return null

  const pending = reviews.filter(r => r.status === 'pending').length
  const approved = reviews.filter(r => r.status === 'approved').length
  const corrected = reviews.filter(r => r.status === 'corrected').length

  function toggleExpanded(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function updateStatus(id: string, status: ReviewStatus) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
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

        <div className="mb-8">
          <p className="text-caption text-gold uppercase tracking-wide mb-1">Admin Panel</p>
          <h1 className="font-heading text-h1 text-navy dark:text-cream">Gemini Review</h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center">
            <p className="font-heading text-h2 text-amber-500">{pending}</p>
            <p className="text-caption text-slate">Pending</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="font-heading text-h2 text-green-500">{approved}</p>
            <p className="text-caption text-slate">Approved</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="font-heading text-h2 text-gold">{corrected}</p>
            <p className="text-caption text-slate">Corrected</p>
          </Card>
        </div>

        {/* Info card */}
        <Card goldAccent className="p-5 mb-6">
          <p className="text-caption text-gold uppercase tracking-wide mb-2">How this works</p>
          <p className="text-body-sm text-slate">
            Responses with quality scores below 60 are flagged for review. Corrected examples are
            injected as few-shot examples for future Gemini scoring calls, improving accuracy over time.
          </p>
        </Card>

        {/* Review cards */}
        <div className="space-y-4">
          {reviews.filter(r => r.status === 'pending').length === 0 && (
            <p className="text-body text-slate text-center py-8">No responses in the review queue.</p>
          )}

          {reviews.map(r => (
            <Card key={r.id} className="p-5">
              {/* Header row */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Badge variant="phase">Q{r.questionNumber}</Badge>
                <span className="text-caption text-slate">{r.userName}</span>
                <Badge variant={qualityBadgeVariant(r.qualityScore)}>
                  Score: {r.qualityScore}
                </Badge>
                <Badge variant={statusBadgeVariant(r.status)}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </Badge>
              </div>

              {/* Question text */}
              <p className="text-[10px] text-slate uppercase tracking-wide mb-2">{r.questionText}</p>

              {/* Response text */}
              <div className="bg-dark-surface/40 dark:bg-dark-surface rounded-input px-4 py-3 mb-3 border border-dark-border">
                <p className="text-body-sm text-cream/80 italic">"{r.responseText}"</p>
              </div>

              {/* Expandable sin scores */}
              <button
                onClick={() => toggleExpanded(r.id)}
                className="text-caption text-gold hover:text-gold/70 transition-colors mb-2"
              >
                {expanded.has(r.id) ? '▲ Hide' : '▼ Show'} sin scores ({r.scores.length})
              </button>

              {expanded.has(r.id) && (
                <div className="space-y-2 mb-3">
                  {r.scores.map(s => (
                    <div key={s.sin} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: SIN_COLORS[s.sin as keyof typeof SIN_COLORS] ?? '#888' }}
                        />
                        <span className="text-body-sm font-medium text-navy dark:text-cream capitalize">
                          {s.sin}
                        </span>
                        <span className="text-body-sm font-semibold text-gold">
                          {formatScore(s.score)}
                        </span>
                        <span className="text-caption text-slate ml-auto">
                          {Math.round(s.confidence * 100)}% conf
                        </span>
                      </div>
                      <p className="text-caption text-slate pl-4">{s.evidence}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons — pending only */}
              {r.status === 'pending' && (
                <div className="flex gap-2 flex-wrap pt-2 border-t border-dark-border">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateStatus(r.id, 'approved')}
                    className="text-green-500 border-green-500/30 hover:border-green-500"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateStatus(r.id, 'corrected')}
                    className="text-amber-500 border-amber-500/30 hover:border-amber-500"
                  >
                    Correct
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.alert(`Reprocessing ${r.id} — would re-submit to Gemini scoring API`)}
                  >
                    Reprocess
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
