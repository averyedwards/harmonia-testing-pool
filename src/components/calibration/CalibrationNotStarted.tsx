'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Eye, Sparkles, Clock, Target } from 'lucide-react'

interface CalibrationNotStartedProps {
  onStart: () => void
}

export function CalibrationNotStarted({ onStart }: CalibrationNotStartedProps) {
  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gold-light flex items-center justify-center mx-auto mb-4">
          <Eye size={28} className="text-gold dark:text-gold-dark" />
        </div>
        <h1 className="font-heading text-h2 text-navy dark:text-cream mb-2">
          Teach us your type
        </h1>
        <p className="text-body text-slate max-w-md mx-auto">
          Rate faces so we can find people you will actually find attractive.
          Without this, your matches are based on general popularity instead of your personal taste.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        <Card className="flex items-start gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-gold-light flex items-center justify-center shrink-0">
            <Target size={18} className="text-gold dark:text-gold-dark" />
          </div>
          <div>
            <p className="text-body font-medium text-navy dark:text-cream">Personalised matching</p>
            <p className="text-body-sm text-slate">
              Your ratings train a visual preference model unique to you.
              No two users get the same matches.
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-gold-light flex items-center justify-center shrink-0">
            <Clock size={18} className="text-gold dark:text-gold-dark" />
          </div>
          <div>
            <p className="text-body font-medium text-navy dark:text-cream">Takes 2-3 minutes</p>
            <p className="text-body-sm text-slate">
              Rate at least 5 faces to get started. Rate 15-20 for the best results.
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-gold-light flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-gold dark:text-gold-dark" />
          </div>
          <div>
            <p className="text-body font-medium text-navy dark:text-cream">Your ratings help others too</p>
            <p className="text-body-sm text-slate">
              The first 5 people you rate are real participants.
              Your ratings help build their profiles, and theirs help build yours.
            </p>
          </div>
        </Card>
      </div>

      <div className="bg-blush dark:bg-dark-surface/50 rounded-button px-4 py-3 mb-6">
        <p className="text-caption text-slate">
          Your ratings are completely private. No one can see how you rated them.
        </p>
      </div>

      <Button className="w-full" onClick={onStart}>
        Start Rating
      </Button>
    </div>
  )
}
