'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { MobileMenu } from './MobileMenu'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative w-[52px] h-7 rounded-full border-none cursor-pointer transition-colors duration-300 outline-none flex-shrink-0',
        isDark ? 'bg-[var(--gold)]' : 'bg-[#e8e0d5]'
      )}
    >
      {/* Sliding pill */}
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300',
          isDark && 'translate-x-6'
        )}
      />
      {/* Icons */}
      <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        {/* Sun */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={isDark ? 'text-white' : 'text-[var(--gold)]'}>
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        {/* Moon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={isDark ? 'text-[var(--maroon)]' : 'text-white'}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>
    </button>
  )
}

export function Nav() {
  const { user, isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const authedLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/calibration', label: 'Phase 1' },
    { href: '/tournament', label: 'Phase 2' },
    { href: '/insights', label: 'Insights' },
  ]

  const publicLinks = [
    { href: '#how-it-works', label: 'How it works' },
    { href: '#signals', label: 'The signals' },
    { href: '#insights', label: 'Insights' },
    { href: '/login', label: 'Sign in' },
  ]

  const links = isAuthenticated ? authedLinks : publicLinks

  return (
    <>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-40 safe-top">
        <div className="harmonia-container">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="drop-shadow-[0_0_6px_rgba(160,90,90,0.25)] dark:drop-shadow-[0_0_6px_rgba(240,200,110,0.3)]">
                <rect width="36" height="36" rx="10" fill="var(--gold)"/>
                <path d="M18 27C18 27 9 21 9 14.5C9 11 11.5 9 14.5 9C16.2 9 18 10.8 18 10.8C18 10.8 19.8 9 21.5 9C24.5 9 27 11 27 14.5C27 21 18 27 18 27Z" fill="#12090A"/>
              </svg>
              <span className="font-heading text-[1.15rem] font-semibold text-[var(--navy)] tracking-wide">
                Harmonia
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-7 list-none">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[0.9rem] font-medium text-[var(--slate)] hover:text-[var(--maroon)] dark:hover:text-[var(--gold)] transition-colors duration-200 hover:[text-shadow:0_0_20px_rgba(114,47,55,0.3)] dark:hover:[text-shadow:0_0_20px_rgba(240,200,110,0.4)] whitespace-nowrap"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right controls */}
            <div className="flex items-center gap-4">
              <ThemeToggle />

              {isAuthenticated && user ? (
                <Link
                  href="/settings"
                  className="hidden md:flex w-9 h-9 rounded-full bg-[var(--gold)] items-center justify-center text-[0.7rem] font-bold text-[#12090A] hover:bg-[var(--gold-champagne)] transition-colors"
                  aria-label="Account settings"
                >
                  {user.firstName[0]}{user.lastName[0]}
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="hidden md:inline-flex btn-harmonia-primary text-[0.9rem] px-5 py-2 rounded-[4px]"
                >
                  Apply now
                </Link>
              )}

              {/* Hamburger */}
              <button
                className="md:hidden flex flex-col justify-around w-7 h-[22px] bg-transparent border-none cursor-pointer p-0 z-[1005]"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <span className="block w-full h-0.5 bg-[var(--maroon)] dark:bg-[var(--gold)] rounded transition-all duration-300" />
                <span className="block w-full h-0.5 bg-[var(--maroon)] dark:bg-[var(--gold)] rounded transition-all duration-300" />
                <span className="block w-full h-0.5 bg-[var(--maroon)] dark:bg-[var(--gold)] rounded transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
