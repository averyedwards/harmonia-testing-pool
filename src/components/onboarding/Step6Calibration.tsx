'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { LinearProgress } from '@/components/ui/progress'
import { FaceRatingCard } from './FaceRatingCard'
import { CALIBRATION_REAL_USER_COUNT, CALIBRATION_MINIMUM_RATINGS } from '@/lib/constants'
import datasetFaces from '@/mock-data/dataset-faces.json'
import type { CalibrationFace, FaceRating } from '@/types'

interface Step6Props {
  onNext: () => void
}

export function Step6Calibration({ onNext }: Step6Props) {
  const { updateUser } = useAuth()
  const { showToast } = useToast()

  const faces = useMemo(() => datasetFaces as CalibrationFace[], [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ratings, setRatings] = useState<FaceRating[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const currentFace = faces[currentIndex]
  const totalRated = ratings.length
  const minimumReached = totalRated >= CALIBRATION_MINIMUM_RATINGS
  const isInRealUserPhase = currentIndex < CALIBRATION_REAL_USER_COUNT
  const hasMoreFaces = currentIndex < faces.length - 1

  const targetRatings = 15
  const progressPercent = Math.min(100, (totalRated / targetRatings) * 100)

  function handleRate(faceId: string, score: number) {
    const newRating: FaceRating = {
      faceId,
      userId: 'user-001',
      score,
      timestamp: new Date().toISOString(),
    }
    setRatings(prev => [...prev, newRating])

    if (hasMoreFaces) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setIsAnimating(false)
      }, 350)
    }
  }

  function handleComplete() {
    updateUser({ calibrationComplete: true })
    showToast('Calibration complete. Your visual model is being built.', 'success')
    onNext()
  }

  function handleSkip() {
    showToast('You can come back to this later. We will remind you.', 'info')
    onNext()
  }

  if (!currentFace || (!hasMoreFaces && totalRated > 0)) {
    return (
      <div className="flex flex-col items-center py-8 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-gold-light flex items-center justify-center mb-4">
          <span className="text-h2">✨</span>
        </div>
        <h2 className="font-heading text-h3 text-navy dark:text-cream mb-2 text-center">
          Great work!
        </h2>
        <p className="text-body text-slate text-center mb-6">
          You rated {totalRated} faces. Your personalised visual model is being built.
        </p>
        <Button className="w-full max-w-[300px]" onClick={handleComplete}>
          Continue
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="font-heading text-h3 text-navy dark:text-cream mb-1">
          {isInRealUserPhase
            ? 'Rate these people'
            : 'Rate these faces to help us learn your preferences'
          }
        </h2>
        <p className="text-body-sm text-slate">
          {isInRealUserPhase
            ? 'How attractive do you find each person? Be honest.'
            : 'Keep rating for more accurate matches. Your ratings are private.'
          }
        </p>
      </div>

      <div className="mb-4">
        <LinearProgress value={progressPercent} size="sm" showLabel />
        <div className="flex justify-between mt-1">
          <span className="text-caption text-slate">{totalRated} rated</span>
          <span className="text-caption text-slate">
            {totalRated < CALIBRATION_MINIMUM_RATINGS
              ? `${CALIBRATION_MINIMUM_RATINGS - totalRated} more to continue`
              : totalRated < targetRatings
                ? `${targetRatings - totalRated} more for best results`
                : 'Excellent coverage!'
            }
          </span>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <FaceRatingCard
          face={currentFace}
          onRate={handleRate}
          isAnimatingOut={isAnimating}
        />
      </div>

      {minimumReached && (
        <div className="mt-4 space-y-2 animate-fade-in">
          <Button className="w-full" onClick={handleComplete}>
            Continue
            <span className="text-body-sm ml-2 opacity-70">({totalRated} faces rated)</span>
          </Button>
          {hasMoreFaces && (
            <p className="text-caption text-slate text-center">
              Or keep rating for better matches. {faces.length - currentIndex - 1} faces remaining.
            </p>
          )}
        </div>
      )}

      {!minimumReached && totalRated > 0 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleSkip}
            className="text-body-sm text-slate/60 hover:text-slate transition-colors"
          >
            Skip for now (we will remind you later)
          </button>
        </div>
      )}
    </div>
  )
}
