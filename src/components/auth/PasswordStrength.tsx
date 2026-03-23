'use client'

import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

/**
 * PasswordStrength
 *
 * From email doc v1.7 Section 2.4.1:
 * Password requirements: minimum 8 characters, at least one number, at least one special character.
 *
 * Shows each requirement with a checkmark (met) or X (unmet).
 * Overall strength bar: weak (1 of 3), medium (2 of 3), strong (3 of 3).
 */
interface PasswordStrengthProps {
  password: string
  className?: string
}

interface Requirement {
  label: string
  met: boolean
}

function getRequirements(password: string): Requirement[] {
  return [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least one number', met: /\d/.test(password) },
    { label: 'At least one special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ]
}

function getStrength(requirements: Requirement[]): { level: 'weak' | 'medium' | 'strong'; met: number } {
  const met = requirements.filter(r => r.met).length
  if (met <= 1) return { level: 'weak', met }
  if (met === 2) return { level: 'medium', met }
  return { level: 'strong', met }
}

const strengthColors = {
  weak: 'bg-red-500',
  medium: 'bg-amber-500',
  strong: 'bg-green-500',
}

const strengthLabels = {
  weak: 'Weak',
  medium: 'Getting there',
  strong: 'Strong',
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  if (!password) return null

  const requirements = getRequirements(password)
  const { level, met } = getStrength(requirements)

  return (
    <div className={cn('mt-2 space-y-2', className)}>
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                i <= met ? strengthColors[level] : 'bg-gray-light dark:bg-dark-border'
              )}
            />
          ))}
        </div>
        <span
          className={cn(
            'text-caption font-medium',
            level === 'weak' && 'text-red-600 dark:text-red-400',
            level === 'medium' && 'text-amber-600 dark:text-amber-400',
            level === 'strong' && 'text-green-600 dark:text-green-400'
          )}
        >
          {strengthLabels[level]}
        </span>
      </div>

      {/* Requirement checklist */}
      <ul className="space-y-1">
        {requirements.map((req, i) => (
          <li key={i} className="flex items-center gap-2">
            {req.met ? (
              <Check size={14} className="text-green-600 dark:text-green-400 shrink-0" />
            ) : (
              <X size={14} className="text-slate/50 shrink-0" />
            )}
            <span
              className={cn(
                'text-caption transition-colors',
                req.met ? 'text-green-700 dark:text-green-400' : 'text-slate/60'
              )}
            >
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Utility: check if password meets all requirements (used by forms) */
export function isPasswordValid(password: string): boolean {
  return getRequirements(password).every(r => r.met)
}
