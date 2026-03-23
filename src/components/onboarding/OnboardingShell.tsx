'use client'

import { type ReactNode } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { StepProgress } from '@/components/ui/progress'
import { ONBOARDING_STEPS, ONBOARDING_MATCHING_POOL_STEP } from '@/lib/constants'
import { Sun, Moon, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingShellProps {
  children: ReactNode
  currentStep: number
  onBack?: () => void
  showBack?: boolean
}

export function OnboardingShell({ children, currentStep, onBack, showBack }: OnboardingShellProps) {
  const { theme, toggleTheme } = useTheme()
  const stepInfo = ONBOARDING_STEPS[currentStep - 1]
  const pastMatchingPool = currentStep > ONBOARDING_MATCHING_POOL_STEP

  const stepLabels = ONBOARDING_STEPS.map(s => s.shortLabel)

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-wine-black transition-colors duration-400 safe-top safe-bottom">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 touch-target flex items-center justify-center text-slate hover:text-gold transition-colors z-10"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Header */}
      <div className="pt-6 pb-4 px-4">
        <div className="flex justify-center mb-4">
          <img
            src="/icons/harmonia-logo.svg"
            alt="Harmonia"
            className="h-8 w-auto dark:invert dark:hue-rotate-180 dark:brightness-110"
          />
        </div>

        <div className="max-w-[500px] mx-auto mb-3">
          <StepProgress
            currentStep={currentStep}
            totalSteps={7}
            labels={stepLabels}
          />
        </div>

        <div className="text-center">
          <p className="text-body font-medium text-navy dark:text-cream">
            {stepInfo?.label}
          </p>
          <p className="text-caption text-slate mt-0.5">
            {stepInfo?.estimatedTime && `About ${stepInfo.estimatedTime}`}
          </p>
        </div>
      </div>

      {/* Back button */}
      {showBack && currentStep >= 3 && onBack && (
        <div className="px-4 max-w-[500px] mx-auto w-full">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-body-sm text-slate hover:text-gold dark:hover:text-gold-dark transition-colors touch-target"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 px-4 py-4 max-w-[500px] mx-auto w-full">
        {children}
      </main>

      {/* Matching pool milestone */}
      {pastMatchingPool && (
        <div className="px-4 pb-4 max-w-[500px] mx-auto w-full">
          <div className="flex items-center gap-2 text-caption text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-button">
            <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
            You're in the matching pool. Complete the remaining steps for better matches.
          </div>
        </div>
      )}

      <div className="py-4 text-center">
        <p className="text-caption text-slate/50">
          Step {currentStep} of 7
        </p>
      </div>
    </div>
  )
}
