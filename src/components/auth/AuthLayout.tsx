'use client'

import { type ReactNode } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

/**
 * AuthLayout
 *
 * Centred single-column layout for login, register, verify-email, forgot-password.
 * No navigation bar (AppShell renders with hideNav=true for auth routes).
 * Harmonia logo at top. Theme toggle in corner.
 * Visual reference: index.html contact form section (warm card-on-cream).
 * Max width ~450px for the card content.
 */
interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream dark:bg-wine-black transition-colors duration-400 px-4 py-8 safe-top safe-bottom">
      {/* Theme toggle — top right corner */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 touch-target flex items-center justify-center text-slate hover:text-gold transition-colors z-10"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <img
          src="/icons/harmonia-logo.svg"
          alt="Harmonia"
          className="h-12 w-auto mb-3 dark:invert dark:hue-rotate-180 dark:brightness-110"
        />
        <span className="font-heading text-h2 text-navy dark:text-cream">
          Harmonia
        </span>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-[450px]">
        <div className="harmonia-card p-6 sm:p-8">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="font-heading text-h2 text-navy dark:text-cream mb-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-body text-slate">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form content */}
          {children}
        </div>
      </div>

      {/* Footer tagline */}
      <p className="mt-8 text-caption text-slate text-center">
        Three signals. One connection.
      </p>
    </div>
  )
}
