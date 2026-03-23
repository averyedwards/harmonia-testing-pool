'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { CalibrationNotStarted } from './CalibrationNotStarted'
import { CalibrationInProgress } from './CalibrationInProgress'
import { CalibrationComplete } from './CalibrationComplete'
import type { FaceRating } from '@/types'

type CalibrationState = 'not_started' | 'in_progress' | 'complete'

export function CalibrationPage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()

  const initialState: CalibrationState = user?.calibrationComplete
    ? 'complete'
    : 'not_started'

  const [state, setState] = useState<CalibrationState>(initialState)
  const [completedRatings, setCompletedRatings] = useState<FaceRating[]>([])

  function handleStart() {
    setState('in_progress')
  }

  function handleComplete(ratings: FaceRating[]) {
    setCompletedRatings(ratings)
    updateUser({ calibrationComplete: true })
    setState('complete')
  }

  function handleContinueLater(ratings: FaceRating[]) {
    setCompletedRatings(ratings)
    router.push('/dashboard')
  }

  switch (state) {
    case 'not_started':
      return <CalibrationNotStarted onStart={handleStart} />

    case 'in_progress':
      return (
        <CalibrationInProgress
          initialRatings={completedRatings}
          onComplete={handleComplete}
          onContinueLater={handleContinueLater}
        />
      )

    case 'complete':
      return <CalibrationComplete ratings={completedRatings} />
  }
}
