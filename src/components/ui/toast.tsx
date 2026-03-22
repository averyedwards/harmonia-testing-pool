'use client'

import * as React from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  function addToast(message: string, variant: ToastVariant = 'info') {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const icons: Record<ToastVariant, React.ReactNode> = {
    success: <CheckCircle size={18} className="text-green-600 shrink-0" />,
    error: <AlertCircle size={18} className="text-red-600 shrink-0" />,
    info: <Info size={18} className="text-[var(--gold)] shrink-0" />,
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-safe-bottom right-4 z-50 flex flex-col gap-2 mb-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 px-4 py-3 rounded-card shadow-card-hover bg-[var(--card-bg)] border border-[var(--gray-light)] dark:border-[var(--dark-border)] animate-slide-up min-w-[260px] max-w-[340px]'
            )}
            role="alert"
          >
            {icons[t.variant]}
            <p className="text-body-sm text-[var(--navy)] flex-1">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-[var(--slate)] hover:text-[var(--navy)] shrink-0"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
