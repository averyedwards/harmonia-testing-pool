'use client'

import { useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { PasswordStrength, isPasswordValid } from './PasswordStrength'

/**
 * RegisterForm
 *
 * From email doc v1.7 Section 2.1 — signup captures:
 *   - Full Name (first and last)
 *   - Email Address (becomes login identifier)
 *   - Age (numeric, must be 18+)
 *   - Gender (Male / Female only at signup — orientation collected in onboarding Step 3 for privacy)
 *   - Location (free text, city and country)
 *   - Phone Number (for DNA kit delivery tracking)
 *   - Password (min 8 chars, 1 number, 1 special char)
 *   - Confirm Password
 *
 * On submit: mock registration -> redirect to verify-email page.
 * In production: POST /api/v1/auth/register -> sends verification email from testingpool@harmoniaengine.com
 */
interface RegisterFormProps {
  onSuccess: (email: string) => void // called after mock registration, passes email for verify page
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  age: string
  gender: string
  location: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  age?: string
  gender?: string
  location?: string
  phoneNumber?: string
  password?: string
  confirmPassword?: string
}

const INITIAL_STATE: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  age: '',
  gender: '',
  location: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { login, updateUser } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  function updateField(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    const age = parseInt(form.age, 10)
    if (!form.age.trim()) {
      newErrors.age = 'Age is required'
    } else if (isNaN(age) || age < 18) {
      newErrors.age = 'You must be at least 18'
    } else if (age > 100) {
      newErrors.age = 'Please enter a valid age'
    }

    if (!form.gender) newErrors.gender = 'Please select your gender'
    if (!form.location.trim()) newErrors.location = 'Location is required'
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required for kit delivery'

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (!isPasswordValid(form.password)) {
      newErrors.password = 'Password does not meet requirements'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    login('user')
    updateUser({
      firstName: form.firstName,
      lastName: form.lastName,
      displayName: `${form.firstName} ${form.lastName}`,
      email: form.email,
      age: parseInt(form.age, 10),
      gender: form.gender as 'male' | 'female',
      location: form.location,
      phoneNumber: form.phoneNumber,
      onboardingStep: 1,
      currentPhase: 'onboarding',
      calibrationComplete: false,
      questionnaireComplete: false,
    })

    showToast('Account created. Check your email.', 'success')
    setLoading(false)
    onSuccess(form.email)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="register-first-name"
          type="text"
          label="First Name"
          placeholder="Jane"
          value={form.firstName}
          onChange={e => updateField('firstName', e.target.value)}
          error={errors.firstName}
          autoComplete="given-name"
          autoFocus
        />
        <Input
          id="register-last-name"
          type="text"
          label="Last Name"
          placeholder="Smith"
          value={form.lastName}
          onChange={e => updateField('lastName', e.target.value)}
          error={errors.lastName}
          autoComplete="family-name"
        />
      </div>

      <Input
        id="register-email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={form.email}
        onChange={e => updateField('email', e.target.value)}
        error={errors.email}
        autoComplete="email"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="register-age"
          type="number"
          label="Age"
          placeholder="25"
          value={form.age}
          onChange={e => updateField('age', e.target.value)}
          error={errors.age}
          min={18}
          max={100}
        />
        <Select
          id="register-gender"
          label="Gender"
          placeholder="Select..."
          options={GENDER_OPTIONS}
          value={form.gender}
          onChange={e => updateField('gender', e.target.value)}
          error={errors.gender}
        />
      </div>

      <Input
        id="register-location"
        type="text"
        label="Location"
        placeholder="London, UK"
        value={form.location}
        onChange={e => updateField('location', e.target.value)}
        error={errors.location}
        autoComplete="address-level2"
      />

      <Input
        id="register-phone"
        type="tel"
        label="Phone Number"
        placeholder="+44 7700 900000"
        value={form.phoneNumber}
        onChange={e => updateField('phoneNumber', e.target.value)}
        error={errors.phoneNumber}
        autoComplete="tel"
      />

      <div className="border-t border-gray-light dark:border-dark-border my-2" />

      <div>
        <Input
          id="register-password"
          type="password"
          label="Password"
          placeholder="Create a password"
          value={form.password}
          onChange={e => updateField('password', e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <PasswordStrength password={form.password} />
      </div>

      <Input
        id="register-confirm-password"
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        value={form.confirmPassword}
        onChange={e => updateField('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        className="w-full mt-2"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-body-sm text-slate mt-4">
        Already have an account?{' '}
        <a
          href="/login"
          className="text-gold font-medium hover:text-gold-champagne dark:text-gold-dark transition-colors"
        >
          Sign in
        </a>
      </p>
    </form>
  )
}
