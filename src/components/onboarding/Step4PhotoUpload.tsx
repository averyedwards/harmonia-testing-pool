'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PhotoUploadZone } from './PhotoUploadZone'
import { Sparkles } from 'lucide-react'

interface Step4Props {
  onNext: () => void
}

export function Step4PhotoUpload({ onNext }: Step4Props) {
  const { updateUser } = useAuth()
  const [photoApproved, setPhotoApproved] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  function handlePhotoApproved(previewUrl: string) {
    setPhotoApproved(true)
    updateUser({ photoUrl: previewUrl })

    setTimeout(() => {
      setShowCelebration(true)
    }, 500)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="font-heading text-h3 text-navy dark:text-cream mb-1">
          Upload your photo
        </h2>
        <p className="text-body-sm text-slate">
          One clear photo of your face. This is what other participants will see.
        </p>
      </div>

      <PhotoUploadZone onPhotoApproved={handlePhotoApproved} />

      {showCelebration && (
        <div className="mt-6 animate-slide-up">
          <div className="bg-gold-light dark:bg-gold-light border border-gold/30 dark:border-gold-dark/30 rounded-card p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={20} className="text-gold dark:text-gold-dark" />
              <Badge variant="default">Matching Pool</Badge>
              <Sparkles size={20} className="text-gold dark:text-gold-dark" />
            </div>
            <p className="text-body font-medium text-navy dark:text-cream">
              You're in the matching pool!
            </p>
            <p className="text-body-sm text-slate mt-1">
              Complete the remaining steps for more accurate matches.
            </p>
          </div>
        </div>
      )}

      {photoApproved && (
        <Button
          className="w-full mt-6 animate-fade-in"
          onClick={onNext}
        >
          Continue
        </Button>
      )}
    </div>
  )
}
