'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full max-w-md bg-[var(--card-bg)] rounded-card shadow-card-hover p-6 animate-slide-up',
          className
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--slate)] hover:text-[var(--navy)] touch-target flex items-center justify-center"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {title && (
          <h2
            id="modal-title"
            className="font-heading text-h3 text-[var(--navy)] mb-1 pr-8"
          >
            {title}
          </h2>
        )}
        {description && (
          <p className="text-body-sm text-[var(--slate)] mb-4">{description}</p>
        )}

        {children}
      </div>
    </div>
  )
}
