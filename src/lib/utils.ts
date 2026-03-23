import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a timestamp to relative time ("2 hours ago", "3 days ago") */
export function timeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/** Format a percentage for display (no decimals) */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Calculate Elo expected score (from CurmElo: k=20, R_D=400) */
export function eloExpectedScore(ratingA: number, ratingB: number, scale = 400): number {
  return 1.0 / (1.0 + Math.exp((ratingB - ratingA) / scale))
}

/** Update Elo ratings after a comparison */
export function updateElo(
  winnerRating: number,
  loserRating: number,
  k = 20,
  scale = 400
): { newWinner: number; newLoser: number } {
  const expected = eloExpectedScore(winnerRating, loserRating, scale)
  const delta = k * (1.0 - expected)
  return {
    newWinner: winnerRating + delta,
    newLoser: loserRating - delta,
  }
}

/** Get word count from a string */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Check if word count is within questionnaire bounds (25-150) */
export function isValidWordCount(text: string): { valid: boolean; count: number; tooShort: boolean; tooLong: boolean } {
  const count = wordCount(text)
  return {
    valid: count >= 25 && count <= 150,
    count,
    tooShort: count < 25,
    tooLong: count > 150,
  }
}
