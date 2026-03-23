'use client'

import { useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

/**
 * LoginForm
 *
 * Simple email + password form. On submit, calls mock login via AuthProvider.
 * In production, this would POST to /api/v1/auth/login and receive JWT tokens.
 *
 * Links to: /register ("Don't have an account?") and /forgot-password
 */
interface LoginFormProps {
  onSuccess: () => void // called after successful mock login (parent handles redirect)
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const newErrors: typeof errors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock login — in production this would be a POST /api/v1/auth/login
    // that returns { accessToken, refreshToken, user }
    login('user')
    showToast('Welcome back.', 'success')
    setLoading(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="login-email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })) }}
        error={errors.email}
        autoComplete="email"
        autoFocus
      />

      <Input
        id="login-password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })) }}
        error={errors.password}
        autoComplete="current-password"
      />

      <div className="flex justify-end">
        <a
          href="/forgot-password"
          className="text-body-sm text-gold hover:text-gold-champagne dark:text-gold-dark dark:hover:text-gold-champagne transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <p className="text-center text-body-sm text-slate mt-4">
        Don't have an account?{' '}
        <a
          href="/register"
          className="text-gold font-medium hover:text-gold-champagne dark:text-gold-dark transition-colors"
        >
          Sign up
        </a>
      </p>
    </form>
  )
}
