'use client'

import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MIN_WORDS, MAX_WORDS } from '@/lib/constants'
import type { QuestionnaireQuestion } from '@/types'

interface QuestionCardProps {
  question: QuestionnaireQuestion
  value: string
  onChange: (value: string) => void
  totalQuestions: number
}

export function QuestionCard({ question, value, onChange, totalQuestions }: QuestionCardProps) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="phase">
          Question {question.number} of {totalQuestions}
        </Badge>
        <span className="text-caption text-slate">{question.domain}</span>
      </div>

      <div className="harmonia-card p-5 mb-4">
        <p className="font-heading text-h4 text-navy dark:text-cream leading-relaxed">
          {question.text}
        </p>
      </div>

      <Textarea
        id={`question-${question.number}`}
        label="Your response"
        placeholder="Write your answer here... Be yourself. There are no right or wrong answers."
        value={value}
        onChange={e => onChange(e.target.value)}
        showWordCount
        minWords={MIN_WORDS}
        maxWords={MAX_WORDS}
        className="min-h-[160px]"
      />

      <p className="text-caption text-slate/60 mt-2">
        Write naturally. We're looking for how you think, not what you think is the "right" answer.
      </p>
    </div>
  )
}
