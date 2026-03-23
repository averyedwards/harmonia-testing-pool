'use client'

import { useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: ReactNode
  className?: string
  closable?: boolean // can be dismissed by clicking backdrop or pressing Escape
}

export function Modal({ open, onClose, children, title, className, closable = true }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closable) onClose()
    },
    [onClose, closable]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closable ? onClose : undefined}
      />
      {/* Content */}
      <div
        className={cn(
          'relative z-10 w-full max-w-md bg-cream dark:bg-dark-surface rounded-card shadow-xl animate-slide-up',
          'p-6',
          className
        )}
      >
        {title && (
          <h2 className="font-heading text-h3 text-navy dark:text-cream mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}

export function ModalTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('font-heading text-h3 text-navy dark:text-cream mb-2', className)}>
      {children}
    </h2>
  )
}

export function ModalDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-body text-slate mb-4', className)}>
      {children}
    </p>
  )
}

export function ModalActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex gap-3 justify-end mt-4', className)}>
      {children}
    </div>
  )
}
