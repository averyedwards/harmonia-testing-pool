'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { X, Heart, LayoutDashboard, Activity, Swords, BarChart2, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calibration', label: 'Phase 1: Calibration', icon: Activity },
  { href: '/tournament', label: 'Phase 2: Tournament', icon: Swords },
  { href: '/insights', label: 'Insights', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuth()

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <aside
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 w-72 bg-[var(--card-bg)] shadow-card-hover flex flex-col transition-transform duration-300 ease-out md:hidden safe-top',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--gray-light)] dark:border-[var(--dark-border)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--gold)] flex items-center justify-center">
              <Heart size={14} className="text-[var(--dark-bg)] fill-[var(--dark-bg)]" />
            </div>
            <span className="font-heading text-h4 text-[var(--navy)] font-semibold">Harmonia</span>
          </div>
          <button
            onClick={onClose}
            className="touch-target flex items-center justify-center text-[var(--slate)] hover:text-[var(--navy)]"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {isAuthenticated ? (
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }, i) => (
                <li
                  key={href}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="animate-slide-in-right"
                >
                  <Link
                    href={href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-button text-[var(--navy)] hover:bg-[var(--blush)] dark:hover:bg-[var(--dark-surface)] transition-colors font-medium"
                  >
                    <Icon size={18} className="text-[var(--gold)]" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-3 px-2 pt-2">
              <Link
                href="/login"
                onClick={onClose}
                className="btn-harmonia-secondary text-center py-3 rounded-button"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="btn-harmonia-primary text-center py-3 rounded-button"
              >
                Join the pool
              </Link>
            </div>
          )}
        </nav>

        {/* User footer */}
        {isAuthenticated && user && (
          <div className="border-t border-[var(--gray-light)] dark:border-[var(--dark-border)] px-5 py-4 safe-bottom">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center text-caption font-bold text-[var(--dark-bg)]">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <p className="text-body-sm font-semibold text-[var(--navy)]">{user.displayName}</p>
                <p className="text-caption text-[var(--slate)]">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); onClose() }}
              className="flex items-center gap-2 text-body-sm text-[var(--slate)] hover:text-[var(--navy)] transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
