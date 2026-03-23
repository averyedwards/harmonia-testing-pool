import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode base surfaces
        cream: '#FAF6F1',
        blush: '#F5EDE6',
        rose: '#EFE5DC',
        'card-bg': '#F0E8DF',

        // Primary accents
        gold: {
          DEFAULT: '#D4A853',
          light: 'rgba(212, 168, 83, 0.15)',
          champagne: '#E8C97A',
          rose: '#D4A574',
          dark: '#F0C86E', // dark mode variant (brighter)
        },
        maroon: {
          DEFAULT: '#722F37',
          deep: '#5C1A1B',
          light: 'rgba(114, 47, 55, 0.12)',
        },
        wine: {
          DEFAULT: '#8B3A3A',
          light: 'rgba(139, 58, 58, 0.15)',
          black: '#12090A', // dark mode page background
        },

        // Dark mode surfaces
        dark: {
          bg: '#12090A',
          surface: '#2D1A1C',
          border: '#3D2426',
          blush: '#1A0F10',
        },

        // Text
        navy: {
          DEFAULT: '#1E293B',
          med: '#2C3E50',
        },
        slate: '#475569',
        'gray-light': '#E8E0D8',

        // Semantic colours for the testing pool
        chemistry: {
          strong: '#4CAF50',
          good: '#FF9800',
          some: '#9E9E9E',
        },
        heart: {
          empty: 'rgba(212, 168, 83, 0.2)',
          filled: '#D4A853',
          glow: 'rgba(212, 168, 83, 0.4)',
        },
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        // Extracted from index.html usage patterns
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['2rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '8px',
        'badge': '20px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'card-dark': '0 2px 12px rgba(0, 0, 0, 0.3)',
        'nav': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'nav-dark': '0 4px 20px rgba(240, 200, 110, 0.08)',
        'gold-glow': '0 0 20px rgba(212, 168, 83, 0.3)',
        'heart-glow': '0 0 12px rgba(212, 168, 83, 0.5)',
      },
      backdropBlur: {
        'nav': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'heart-fill': 'heartFill 0.5s ease-out',
        'heart-pulse': 'heartPulse 0.3s ease-in-out',
        'card-select': 'cardSelect 0.3s ease-out',
        'match-celebrate': 'matchCelebrate 0.8s ease-out',
        'progress-fill': 'progressFill 1s ease-out',
        'radar-draw': 'radarDraw 1.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        heartFill: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        heartPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        cardSelect: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 20px rgba(212, 168, 83, 0.3)' },
          '100%': { transform: 'scale(1)' },
        },
        matchCelebrate: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        radarDraw: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}

export default config
