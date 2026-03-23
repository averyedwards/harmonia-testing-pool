'use client'

import { useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import { Step1EmailVerified } from '@/components/onboarding/Step1EmailVerified'
import { Step2BasicProfile } from '@/components/onboarding/Step2BasicProfile'
import { Step3Orientation } from '@/components/onboarding/Step3Orientation'
import { Step4PhotoUpload } from '@/components/onboarding/Step4PhotoUpload'
import { Step5Questionnaire } from '@/components/onboarding/Step5Questionnaire'
import { Step6Calibration } from '@/components/onboarding/Step6Calibration'
import { Step7AddressForm } from '@/components/onboarding/Step7AddressForm'
import { OnboardingComplete } from '@/components/onboarding/OnboardingComplete'

export default function OnboardingPage() {
  const { user, updateUser } = useAuth()

  const currentStep = user?.onboardingStep || 1
  const isLondon = user?.isLondon || false

  const advanceStep = useCallback((toStep?: number) => {
    const nextStep = toStep || currentStep + 1

    if (nextStep === 7 && !isLondon) {
      updateUser({ onboardingStep: 8 })
      return
    }

    updateUser({ onboardingStep: nextStep })
  }, [currentStep, isLondon, updateUser])

  const goBack = useCallback(() => {
    if (currentStep > 2) {
      updateUser({ onboardingStep: currentStep - 1 })
    }
  }, [currentStep, updateUser])

  if (currentStep >= 8) {
    return (
      <OnboardingShell currentStep={7} showBack={false}>
        <OnboardingComplete />
      </OnboardingShell>
    )
  }

  return (
    <OnboardingShell
      currentStep={currentStep}
      onBack={goBack}
      showBack={currentStep >= 3}
    >
      {currentStep === 1 && (
        <Step1EmailVerified onNext={() => advanceStep(2)} />
      )}
      {currentStep === 2 && (
        <Step2BasicProfile onNext={() => advanceStep(3)} />
      )}
      {currentStep === 3 && (
        <Step3Orientation onNext={() => advanceStep(4)} />
      )}
      {currentStep === 4 && (
        <Step4PhotoUpload onNext={() => advanceStep(5)} />
      )}
      {currentStep === 5 && (
        <Step5Questionnaire onNext={() => advanceStep(6)} />
      )}
      {currentStep === 6 && (
        <Step6Calibration onNext={() => advanceStep(7)} />
      )}
      {currentStep === 7 && (
        <Step7AddressForm onNext={() => advanceStep(8)} />
      )}
    </OnboardingShell>
  )
}
