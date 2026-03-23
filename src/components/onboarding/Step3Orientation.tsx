'use client'

import { useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Orientation } from '@/types'

interface Step3Props {
  onNext: () => void
}

type MatchPreference = 'men' | 'women' | 'everyone'

const ORIENTATIONS: { value: Orientation; label: string }[] = [
  { value: 'straight', label: 'Straight' },
  { value: 'gay', label: 'Gay' },
  { value: 'bisexual', label: 'Bisexual' },
  { value: 'other', label: 'Other' },
]

const MATCH_PREFERENCES: { value: MatchPreference; label: string }[] = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'everyone', label: 'Everyone' },
]

export function Step3Orientation({ onNext }: Step3Props) {
  const { user, updateUser } = useAuth()
  const [orientation, setOrientation] = useState<Orientation | null>(user?.orientation || null)
  const [matchPref, setMatchPref] = useState<MatchPreference | null>(null)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!orientation) {
      setError('Please select your orientation')
      return
    }
    if (!matchPref) {
      setError('Please select who you would like to be matched with')
      return
    }

    updateUser({ orientation })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" noValidate>
      <div className="mb-2">
        <h2 className="font-heading text-h3 text-navy dark:text-cream mb-1">
          Your preferences
        </h2>
        <p className="text-body-sm text-slate">
          Help us find the right matches for you.
        </p>
      </div>

      <div>
        <p className="text-body font-medium text-navy dark:text-cream mb-3">
          I identify as...
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ORIENTATIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setOrientation(opt.value); setError('') }}
              className={cn(
                'py-3 px-4 rounded-button text-body font-medium transition-all duration-200 border',
                orientation === opt.value
                  ? 'bg-gold-light border-gold text-gold dark:bg-gold-light dark:border-gold-dark dark:text-gold-dark'
                  : 'bg-card-bg dark:bg-dark-surface border-gray-light dark:border-dark-border text-navy dark:text-slate hover:border-gold/50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-body font-medium text-navy dark:text-cream mb-3">
          I would like to be matched with...
        </p>
        <div className="grid grid-cols-3 gap-2">
          {MATCH_PREFERENCES.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setMatchPref(opt.value); setError('') }}
              className={cn(
                'py-3 px-4 rounded-button text-body font-medium transition-all duration-200 border',
                matchPref === opt.value
                  ? 'bg-gold-light border-gold text-gold dark:bg-gold-light dark:border-gold-dark dark:text-gold-dark'
                  : 'bg-card-bg dark:bg-dark-surface border-gray-light dark:border-dark-border text-navy dark:text-slate hover:border-gold/50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-body-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="bg-blush dark:bg-dark-surface/50 rounded-button px-4 py-3">
        <p className="text-caption text-slate">
          This information is used for matching only and never shared with other users.
        </p>
      </div>

      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  )
}
