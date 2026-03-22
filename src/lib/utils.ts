import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number as a percentage string */
export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/** Format a date string to a human-readable form */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Format milliseconds to a readable duration */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Calculate Elo change after a match (k=20, RD=400) */
export function calculateEloChange(
  winnerElo: number,
  loserElo: number,
  k = 20,
  rd = 400
): { winnerNew: number; loserNew: number } {
  const expected = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / rd))
  const change = Math.round(k * (1 - expected))
  return {
    winnerNew: winnerElo + change,
    loserNew: loserElo - change,
  }
}

/** Get initials from a display name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Truncate text to a maximum length */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/** Count words in a string */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
