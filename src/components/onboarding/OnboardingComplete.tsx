'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Sparkles, Dna, Brain, Eye } from 'lucide-react'

export function OnboardingComplete() {
  const { user } = useAuth()
  const isLondon = user?.isLondon

  return (
    <div className="flex flex-col items-center py-8 animate-fade-in">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gold-light flex items-center justify-center">
          <CheckCircle size={40} className="text-gold dark:text-gold-dark" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles size={20} className="text-gold-champagne animate-heart-pulse" />
        </div>
      </div>

      <Badge variant="default" className="mb-3">All Steps Complete</Badge>

      <h2 className="font-heading text-h2 text-navy dark:text-cream mb-2 text-center">
        You're all set!
      </h2>
      <p className="text-body text-slate text-center mb-8 max-w-[360px]">
        Your profile is complete. Here's what happens next.
      </p>

      <div className="w-full space-y-3 mb-8">
        <div className="harmonia-card p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-light flex items-center justify-center shrink-0">
            <Eye size={18} className="text-gold dark:text-gold-dark" />
          </div>
          <div>
            <p className="text-body font-medium text-navy dark:text-cream">
              Visual model building
            </p>
            <p className="text-body-sm text-slate">
              Your personalised attraction model is being trained from your ratings.
            </p>
          </div>
        </div>

        <div className="harmonia-card p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-maroon-light dark:bg-dark-border flex items-center justify-center shrink-0">
            <Brain size={18} className="text-maroon dark:text-gold-dark" />
          </div>
          <div>
            <p className="text-body font-medium text-navy dark:text-cream">
              Personality profile ready
            </p>
            <p className="text-body-sm text-slate">
              Your seven-dimension personality profile is available in your dashboard.
            </p>
          </div>
        </div>

        {isLondon && (
          <div className="harmonia-card p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <Dna size={18} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-body font-medium text-navy dark:text-cream">
                DNA kit on its way
              </p>
              <p className="text-body-sm text-slate">
                Your genetic analysis kit will arrive in 5-10 business days. We will email you when it ships.
              </p>
            </div>
          </div>
        )}

        <div className="harmonia-card p-4 flex items-start gap-3 gold-accent-top">
          <div>
            <p className="text-body font-medium text-navy dark:text-cream">
              Phase 2 coming soon
            </p>
            <p className="text-body-sm text-slate">
              You will receive an email when the tournament opens. In the meantime, explore your personality profile on the dashboard.
            </p>
          </div>
        </div>
      </div>

      <Button
        className="w-full max-w-[300px]"
        onClick={() => window.location.href = '/dashboard'}
      >
        Go to Dashboard
      </Button>
    </div>
  )
}
