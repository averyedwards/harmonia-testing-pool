'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { Mail, CheckCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'
  const { updateUser } = useAuth()
  const { showToast } = useToast()
  const [resent, setResent] = useState(false)
  const [verified, setVerified] = useState(false)

  function handleResend() {
    setResent(true)
    showToast('Verification email resent.', 'info')
    setTimeout(() => setResent(false), 30000)
  }

  function handleMockVerify() {
    setVerified(true)
    updateUser({ onboardingStep: 2 })
    showToast('Email verified.', 'success')
    setTimeout(() => {
      router.push('/onboarding')
    }, 1200)
  }

  return (
    <AuthLayout
      title={verified ? 'Email verified' : 'Check your email'}
      subtitle={
        verified
          ? 'Taking you to your profile setup...'
          : `We sent a verification link to ${email}`
      }
    >
      <div className="flex flex-col items-center py-4">
        <div className="w-16 h-16 rounded-full bg-gold-light dark:bg-gold-light flex items-center justify-center mb-6">
          {verified ? (
            <CheckCircle size={32} className="text-green-600 dark:text-green-400 animate-fade-in" />
          ) : (
            <Mail size={32} className="text-gold dark:text-gold-dark" />
          )}
        </div>

        {!verified && (
          <>
            <p className="text-body text-slate text-center mb-6 max-w-[320px]">
              Click the link in the email to verify your account. If you don't see it, check your spam folder.
            </p>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleResend}
              disabled={resent}
              className="mb-3"
            >
              {resent ? 'Email resent' : 'Resend verification email'}
            </Button>

            <div className="border-t border-gray-light dark:border-dark-border w-full mt-4 pt-4">
              <p className="text-caption text-slate/60 text-center mb-3">
                Prototype shortcut (not in production):
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMockVerify}
                className="w-full"
              >
                Skip: I've verified my email
              </Button>
            </div>
          </>
        )}

        {verified && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-fade-in">
            <span className="text-body font-medium">Redirecting to onboarding...</span>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
