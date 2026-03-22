'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={cn(
            'w-11 h-6 rounded-full transition-colors duration-200',
            checked ? 'bg-[var(--gold)]' : 'bg-[var(--gray-light)]'
          )}
        />
        <div
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
            checked && 'translate-x-5'
          )}
        />
      </div>
      {label && <span className="text-body-sm text-[var(--navy)]">{label}</span>}
    </label>
  )
}
