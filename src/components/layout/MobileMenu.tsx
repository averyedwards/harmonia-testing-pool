'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  links: { label: string; href: string }[]
}

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const { user, logout } = useAuth()

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Menu panel — slides in from right, matching index.html mobile nav */}
      <div
        className={cn(
          'fixed top-14 right-0 bottom-0 z-35 w-72 bg-cream dark:bg-dark-bg border-l border-gray-light dark:border-dark-border',
          'transform transition-transform duration-300 ease-out md:hidden',
          'safe-top safe-bottom overflow-y-auto',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* User info */}
        {user && (
          <div className="px-6 py-5 border-b border-gray-light dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-maroon-light dark:bg-dark-border flex items-center justify-center text-body font-bold text-maroon dark:text-gold">
                {user.firstName[0]}
              </div>
              <div>
                <p className="text-body font-semibold text-navy dark:text-cream">{user.displayName}</p>
                <p className="text-caption text-slate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Links with staggered animation (from index.html .nav-links.mobile-open li pattern) */}
        <ul className="px-6 py-4 space-y-1">
          {links.map((link, i) => (
            <li
              key={link.href}
              className={cn(
                'opacity-0',
                open && 'animate-slide-in-right'
              )}
              style={{
                animationDelay: open ? `${(i + 1) * 50}ms` : '0ms',
                animationFillMode: 'forwards',
              }}
            >
              <a
                href={link.href}
                onClick={onClose}
                className="block py-3 px-3 text-body font-medium text-navy dark:text-cream hover:text-gold dark:hover:text-gold-dark hover:bg-blush dark:hover:bg-dark-surface rounded-button transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div className="px-6 py-4 border-t border-gray-light dark:border-dark-border mt-auto">
          <button
            onClick={() => { logout(); onClose() }}
            className="w-full text-left py-3 px-3 text-body-sm text-slate hover:text-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  )
}
