'use client'

import { useState, type FormEvent } from 'react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address')
      return
    }

    setError('')
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    setSent(true)
    setLoading(false)
    showToast('Reset link sent.', 'success')
  }

  return (
    <AuthLayout
      title={sent ? 'Check your email' : 'Reset your password'}
      subtitle={
        sent
          ? `We sent a password reset link to ${email}`
          : 'Enter your email and we will send you a reset link.'
      }
    >
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="forgot-email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            error={error}
            autoComplete="email"
            autoFocus
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <a
            href="/login"
            className="flex items-center justify-center gap-2 text-body-sm text-slate hover:text-gold dark:hover:text-gold-dark transition-colors mt-4"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </a>
        </form>
      ) : (
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 rounded-full bg-gold-light dark:bg-gold-light flex items-center justify-center mb-6">
            <Mail size={32} className="text-gold dark:text-gold-dark" />
          </div>

          <p className="text-body text-slate text-center mb-6 max-w-[320px]">
            If an account exists with that email, you will receive a password reset link shortly. Check your spam folder if you don't see it.
          </p>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setSent(false); setEmail('') }}
            className="mb-3"
          >
            Try a different email
          </Button>

          <a
            href="/login"
            className="flex items-center justify-center gap-2 text-body-sm text-slate hover:text-gold dark:hover:text-gold-dark transition-colors mt-4"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </a>
        </div>
      )}
    </AuthLayout>
  )
}
