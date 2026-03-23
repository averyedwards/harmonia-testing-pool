'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CONTACT_TYPE_LABELS } from '@/lib/constants'
import type { ContactType } from '@/types'
import { cn } from '@/lib/utils'

interface ContactExchangeProps {
  matchDisplayName: string
  onSubmit: (type: ContactType, value: string) => void
}

const CONTACT_OPTIONS: { type: ContactType; icon: string; placeholder: string }[] = [
  { type: 'phone', icon: '📱', placeholder: 'Your phone number' },
  { type: 'instagram', icon: '📸', placeholder: '@yourhandle' },
  { type: 'email', icon: '✉️', placeholder: 'your@email.com' },
  { type: 'prefer_not_to_share', icon: '🔒', placeholder: '' },
]

export function ContactExchange({ matchDisplayName, onSubmit }: ContactExchangeProps) {
  const [selectedType, setSelectedType] = useState<ContactType | null>(null)
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selectedType) return
    setSubmitted(true)
    onSubmit(selectedType, value)
  }

  const needsValue = selectedType && selectedType !== 'prefer_not_to_share'
  const canSubmit = selectedType && (!needsValue || value.trim().length > 0)

  if (submitted) {
    return (
      <div className="text-center py-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-chemistry-strong/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-body font-semibold text-navy dark:text-cream mb-1">
          {selectedType === 'prefer_not_to_share'
            ? "That's okay — you can share later"
            : 'Contact shared!'}
        </p>
        <p className="text-body-sm text-slate">
          {selectedType !== null && selectedType !== 'prefer_not_to_share'
            ? `We'll let ${matchDisplayName} know you've shared your ${CONTACT_TYPE_LABELS[selectedType].toLowerCase()}.`
            : `You can always come back and share your contact details when you're ready.`}
        </p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-heading text-h4 text-navy dark:text-cream mb-1">
        Share your contact details
      </h3>
      <p className="text-body-sm text-slate mb-4">
        Both parties share independently. You won't see what {matchDisplayName} chose
        until after you've both submitted.
      </p>

      <div className="space-y-2 mb-4">
        {CONTACT_OPTIONS.map(({ type, icon, placeholder }) => (
          <button
            key={type}
            onClick={() => {
              setSelectedType(type)
              setValue('')
            }}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-input border transition-all text-left',
              selectedType === type
                ? 'border-gold bg-gold/5 dark:bg-gold/10'
                : 'border-gray-light dark:border-dark-border hover:border-gold/50',
            )}
          >
            <span className="text-xl">{icon}</span>
            <span className={cn(
              'text-body-sm font-medium',
              selectedType === type ? 'text-navy dark:text-cream' : 'text-slate',
            )}>
              {CONTACT_TYPE_LABELS[type]}
            </span>
            {selectedType === type && (
              <span className="ml-auto text-gold font-bold">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Value input */}
      {needsValue && (
        <div className="mb-4 animate-fade-in">
          <Input
            label={`Your ${CONTACT_TYPE_LABELS[selectedType!].toLowerCase()}`}
            placeholder={CONTACT_OPTIONS.find(o => o.type === selectedType)?.placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            type={selectedType === 'email' ? 'email' : selectedType === 'phone' ? 'tel' : 'text'}
          />
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full"
      >
        {selectedType === 'prefer_not_to_share' ? 'Not now' : 'Share contact'}
      </Button>
    </div>
  )
}
