'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { CalibrationFace } from '@/types'

interface FaceRatingCardProps {
  face: CalibrationFace
  onRate: (faceId: string, score: number) => void
  isAnimatingOut?: boolean
}

const RATING_LABELS = ['Not my type', 'Below average', 'Average', 'Attractive', 'Very attractive']

export function FaceRatingCard({ face, onRate, isAnimatingOut }: FaceRatingCardProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [hoveredScore, setHoveredScore] = useState<number | null>(null)

  function handleRate(score: number) {
    setSelectedScore(score)
    setTimeout(() => {
      onRate(face.id, score)
    }, 300)
  }

  const displayLabel = hoveredScore !== null
    ? RATING_LABELS[hoveredScore - 1]
    : selectedScore !== null
      ? RATING_LABELS[selectedScore - 1]
      : 'Tap to rate'

  return (
    <div
      className={cn(
        'flex flex-col items-center transition-all duration-300',
        isAnimatingOut && 'opacity-0 translate-x-[-20px]',
        !isAnimatingOut && 'animate-fade-in'
      )}
    >
      <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-card overflow-hidden bg-card-bg dark:bg-dark-surface mb-4 shadow-card">
        <img
          src={face.imageUrl}
          alt="Face to rate"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      <p className={cn(
        'text-body-sm font-medium mb-3 h-5 transition-colors',
        selectedScore !== null ? 'text-gold dark:text-gold-dark' : 'text-slate/60'
      )}>
        {displayLabel}
      </p>

      <div className="flex items-center gap-3">
        {[1, 2, 3, 4, 5].map(score => (
          <button
            key={score}
            type="button"
            onClick={() => handleRate(score)}
            onMouseEnter={() => setHoveredScore(score)}
            onMouseLeave={() => setHoveredScore(null)}
            disabled={selectedScore !== null}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-body font-semibold transition-all duration-200 touch-target',
              'border-2',
              selectedScore === score
                ? 'bg-gold text-wine-black border-gold scale-110 shadow-gold-glow dark:bg-gold-dark dark:border-gold-dark'
                : selectedScore !== null
                  ? 'bg-gray-light/50 dark:bg-dark-border/50 border-transparent text-slate/40 cursor-not-allowed'
                  : 'bg-card-bg dark:bg-dark-surface border-gray-light dark:border-dark-border text-navy dark:text-cream hover:border-gold/50 dark:hover:border-gold-dark/50 hover:scale-105',
              hoveredScore === score && selectedScore === null && 'border-gold dark:border-gold-dark scale-105'
            )}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  )
}
