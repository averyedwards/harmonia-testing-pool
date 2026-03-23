'use client'

import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { usePhase } from '@/hooks/usePhase'
import { cn } from '@/lib/utils'
import { PHASE_LABELS } from '@/lib/constants'
import { MobileMenu } from './MobileMenu'
import { Sun, Moon, Bell, Menu, X, ChevronDown } from 'lucide-react'

export function Nav() {
  const { theme, toggleTheme } = useTheme()
  const { user, isAdmin } = useAuth()
  const { phase } = usePhase()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Tournament', href: '/tournament' },
    { label: 'Insights', href: '/insights' },
    { label: 'Settings', href: '/settings' },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin' }] : []),
  ]

  return (
    <>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-40 px-4 md:px-6 py-3 flex items-center justify-between safe-top">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="/icons/harmonia-logo.svg"
            alt="Harmonia"
            className="h-8 w-auto dark:invert dark:hue-rotate-180 dark:brightness-110"
          />
          <span className="font-heading text-h4 text-navy dark:text-cream hidden sm:block">
            Harmonia
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-body-sm font-medium text-slate hover:text-gold dark:hover:text-gold-dark transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: phase badge + theme toggle + notifications + avatar + mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* Current phase badge — desktop only */}
          <span className="hidden lg:inline-block harmonia-badge text-[0.65rem]">
            {PHASE_LABELS[phase]}
          </span>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="touch-target flex items-center justify-center text-slate hover:text-gold transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notification bell */}
          <button
            className="touch-target flex items-center justify-center text-slate hover:text-gold transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {/* Unread indicator dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
          </button>

          {/* User avatar — desktop */}
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-maroon-light dark:bg-dark-border flex items-center justify-center text-caption font-bold text-maroon dark:text-gold">
                {user.firstName[0]}
              </div>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden touch-target flex items-center justify-center text-slate"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
      />

      {/* Spacer so content doesn't hide behind fixed nav */}
      <div className="h-14 safe-top" />
    </>
  )
}
