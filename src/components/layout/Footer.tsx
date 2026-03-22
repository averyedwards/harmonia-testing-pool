import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer
      className="py-6 safe-bottom"
      style={{
        background: '#5C1A1B',
        paddingLeft: 'max(2rem, env(safe-area-inset-left))',
        paddingRight: 'max(2rem, env(safe-area-inset-right))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

        {/* Logo text */}
        <span className="font-heading text-[1.3rem] text-[#E8C97A]">
          Harmonia
        </span>

        {/* Copyright */}
        <p className="text-[0.8rem] text-white/50">
          Testing Pool Prototype &mdash; Research only
        </p>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {[
            { href: '/settings', label: 'Settings' },
            { href: 'mailto:testingpool@harmoniaengine.com', label: 'Contact' },
            { href: '/admin', label: 'Admin' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[0.85rem] text-[rgba(245,217,138,0.7)] hover:text-[#E8C97A] transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
