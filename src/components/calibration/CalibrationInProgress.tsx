'use client'

import { useState, useMemo } from 'react'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { LinearProgress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { FaceRatingCard } from '@/components/onboarding/FaceRatingCard'
import { RatingDistributionChart } from './RatingDistributionChart'
import { PreferencePreview } from './PreferencePreview'
import { CALIBRATION_REAL_USER_COUNT, CALIBRATION_MINIMUM_RATINGS } from '@/lib/constants'
import { useIsMobile } from '@/hooks/useMediaQuery'
import datasetFaces from '@/mock-data/dataset-faces.json'
import insightsPhase1 from '@/mock-data/insights-phase1.json'
import type { CalibrationFace, FaceRating } from '@/types'

interface CalibrationInProgressProps {
  initialRatings?: FaceRating[]
  onComplete: (ratings: FaceRating[]) => void
  onContinueLater: (ratings: FaceRating[]) => void
}

export function CalibrationInProgress({
  initialRatings = [],
  onComplete,
  onContinueLater,
}: CalibrationInProgressProps) {
  const { showToast } = useToast()
  const isMobile = useIsMobile()

  const faces = useMemo(() => datasetFaces as CalibrationFace[], [])
  const [currentIndex, setCurrentIndex] = useState(initialRatings.length)
  const [ratings, setRatings] = useState<FaceRating[]>(initialRatings)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showProgressPanel, setShowProgressPanel] = useState(!isMobile)

  const currentFace = faces[currentIndex]
  const totalRated = ratings.length
  const minimumReached = totalRated >= CALIBRATION_MINIMUM_RATINGS
  const isInRealUserPhase = currentIndex < CALIBRATION_REAL_USER_COUNT
  const hasMoreFaces = currentIndex < faces.length - 1
  const targetRatings = 15
  const progressPercent = Math.min(100, (totalRated / targetRatings) * 100)

  const distribution = useMemo(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratings.forEach(r => {
      dist[r.score] = (dist[r.score] || 0) + 1
    })
    return dist
  }, [ratings])

  const preferenceCorrelations = insightsPhase1.visualPreferences.topTraitCorrelations

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
    showToast('Calibration complete. Your visual model is being built.', 'success')
    onComplete(ratings)
  }

  function handleContinueLater() {
    showToast('Progress saved. You can come back anytime.', 'info')
    onContinueLater(ratings)
  }

  if (!currentFace) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <p className="text-body text-slate mb-4">
          You have rated all available faces. Excellent coverage!
        </p>
        <Button onClick={handleComplete}>Complete Calibration</Button>
      </div>
    )
  }

  const progressPanel = (
    <div className="space-y-4">
      <div className="harmonia-card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-caption font-medium text-navy dark:text-cream">Progress</p>
          <Badge variant={minimumReached ? 'success' : 'default'}>
            {totalRated} rated
          </Badge>
        </div>
        <LinearProgress value={progressPercent} size="sm" />
        <p className="text-caption text-slate mt-1.5">
          {totalRated < CALIBRATION_MINIMUM_RATINGS
            ? `${CALIBRATION_MINIMUM_RATINGS - totalRated} more to unlock matching`
            : totalRated < targetRatings
              ? `${targetRatings - totalRated} more for best results`
              : 'Excellent coverage!'
          }
        </p>
      </div>

      <div className="harmonia-card p-4">
        <RatingDistributionChart distribution={distribution} />
      </div>

      <PreferencePreview
        correlations={preferenceCorrelations as any}
        totalRated={totalRated}
      />
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h1 className="font-heading text-h2 text-navy dark:text-cream mb-1">
          {isInRealUserPhase ? 'Rate these people' : 'Rate these faces'}
        </h1>
        <p className="text-body-sm text-slate">
          {isInRealUserPhase
            ? 'How attractive do you find each person? Be honest. Your ratings are private.'
            : 'Rate these faces to help us learn your preferences.'
          }
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col items-center">
          <FaceRatingCard
            face={currentFace}
            onRate={handleRate}
            isAnimatingOut={isAnimating}
          />
          <p className="text-caption text-slate/50 mt-3">
            {faces.length - currentIndex - 1} faces remaining
          </p>
        </div>

        {isMobile ? (
          <div>
            <button
              type="button"
              onClick={() => setShowProgressPanel(!showProgressPanel)}
              className="w-full text-left text-body-sm font-medium text-gold dark:text-gold-dark mb-2"
            >
              {showProgressPanel ? 'Hide progress' : 'Show progress'} ({totalRated} rated)
            </button>
            {showProgressPanel && progressPanel}
          </div>
        ) : (
          <div className="w-72 shrink-0">
            {progressPanel}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-2">
        {minimumReached && (
          <Button className="w-full" onClick={handleComplete}>
            Complete Calibration
            <span className="text-body-sm ml-2 opacity-70">({totalRated} faces rated)</span>
          </Button>
        )}
        <button
          type="button"
          onClick={handleContinueLater}
          className="w-full text-center text-body-sm text-slate hover:text-gold dark:hover:text-gold-dark transition-colors py-2"
        >
          Continue later
        </button>
      </div>
    </div>
  )
}
