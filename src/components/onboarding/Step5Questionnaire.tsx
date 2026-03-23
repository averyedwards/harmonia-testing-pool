'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { LinearProgress } from '@/components/ui/progress'
import { QuestionCard } from './QuestionCard'
import { FELIX_QUESTIONS } from '@/types'
import { MIN_WORDS, MAX_WORDS } from '@/lib/constants'
import { wordCount, cn } from '@/lib/utils'
import { ArrowLeft, Edit3 } from 'lucide-react'

interface Step5Props {
  onNext: () => void
}

type QuestionnaireState = 'answering' | 'reviewing'

export function Step5Questionnaire({ onNext }: Step5Props) {
  const { updateUser } = useAuth()
  const { showToast } = useToast()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(6).fill(''))
  const [state, setState] = useState<QuestionnaireState>('answering')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const question = FELIX_QUESTIONS[currentQuestion]
  const currentAnswer = answers[currentQuestion]
  const currentWordCount = wordCount(currentAnswer)
  const canProceed = currentWordCount >= MIN_WORDS && currentWordCount <= MAX_WORDS
  const allAnswered = answers.every(a => {
    const wc = wordCount(a)
    return wc >= MIN_WORDS && wc <= MAX_WORDS
  })
  const progressPercent = ((currentQuestion + (canProceed ? 1 : 0)) / 6) * 100

  function updateAnswer(value: string) {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
  }

  function handleNext() {
    if (!canProceed) return
    if (currentQuestion < 5) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setState('reviewing')
    }
  }

  function handlePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  function handleEditFromReview(index: number) {
    setEditingIndex(index)
    setCurrentQuestion(index)
    setState('answering')
  }

  function handleBackToReview() {
    setState('reviewing')
    setEditingIndex(null)
  }

  async function handleSubmitAll() {
    if (!allAnswered) return

    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1200))

    updateUser({ questionnaireComplete: true })
    showToast('Personality questionnaire complete.', 'success')
    setSubmitting(false)
    onNext()
  }

  if (state === 'reviewing') {
    return (
      <div className="animate-fade-in">
        <div className="mb-4">
          <h2 className="font-heading text-h3 text-navy dark:text-cream mb-1">
            Review your answers
          </h2>
          <p className="text-body-sm text-slate">
            Make sure you're happy with each response. You can edit any answer before submitting.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {FELIX_QUESTIONS.map((q, i) => {
            const wc = wordCount(answers[i])
            return (
              <div key={q.number} className="harmonia-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-caption font-medium text-gold dark:text-gold-dark mb-1">
                      Question {q.number}: {q.domain}
                    </p>
                    <p className="text-body-sm text-navy dark:text-cream line-clamp-3">
                      {answers[i]}
                    </p>
                    <p className="text-caption text-slate mt-1">{wc} words</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEditFromReview(i)}
                    className="touch-target flex items-center gap-1 text-body-sm text-gold hover:text-gold-champagne dark:text-gold-dark transition-colors shrink-0"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <Button
          className="w-full"
          onClick={handleSubmitAll}
          disabled={!allAnswered || submitting}
        >
          {submitting ? 'Submitting...' : 'Submit All Answers'}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <LinearProgress value={progressPercent} size="sm" />
      </div>

      <div className="mb-3">
        {editingIndex !== null ? (
          <button
            type="button"
            onClick={handleBackToReview}
            className="flex items-center gap-1.5 text-body-sm text-slate hover:text-gold dark:hover:text-gold-dark transition-colors touch-target"
          >
            <ArrowLeft size={16} />
            Back to review
          </button>
        ) : currentQuestion > 0 ? (
          <button
            type="button"
            onClick={handlePrevious}
            className="flex items-center gap-1.5 text-body-sm text-slate hover:text-gold dark:hover:text-gold-dark transition-colors touch-target"
          >
            <ArrowLeft size={16} />
            Previous question
          </button>
        ) : null}
      </div>

      <QuestionCard
        question={question}
        value={currentAnswer}
        onChange={updateAnswer}
        totalQuestions={6}
      />

      <div className="mt-6">
        {editingIndex !== null ? (
          <Button
            className="w-full"
            onClick={handleBackToReview}
            disabled={!canProceed}
          >
            Save and Return to Review
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleNext}
            disabled={!canProceed}
          >
            {currentQuestion < 5 ? 'Next Question' : 'Review All Answers'}
          </Button>
        )}

        {!canProceed && currentWordCount > 0 && currentWordCount < MIN_WORDS && (
          <p className="text-caption text-amber-600 dark:text-amber-400 text-center mt-2">
            {MIN_WORDS - currentWordCount} more words needed
          </p>
        )}
      </div>
    </div>
  )
}
