'use client'

import { useState, useCallback, useRef } from 'react'
import { ELO_K, ELO_RD, HEARTS_TO_MATCH, PASS_BOTH_MAX_PER_SESSION } from '@/lib/constants'
import tournamentCandidatesRaw from '@/mock-data/tournament-candidates.json'

// ---- types ----

export interface TournamentCandidateLocal {
  id: string
  userId: string
  displayName: string
  age: number
  location: string
  eloRating: number
  heartCount: number
  nComparisons: number
  matchConfirmed: boolean
  hlaScore: number | null
  hlaDisplayTier: 'strong' | 'good' | 'some' | 'hidden' | null
  perceivedSimilarity: {
    rawScore: number
    adjustedScore: number
    tier: 'strong_fit' | 'good_fit' | 'moderate_fit' | 'low_fit'
    overlapCount: number
    headline: string
    sharedTraits: { sin: string; description: string; contribution: number }[]
  }
}

export interface TournamentPairing {
  pairingId: string
  candidateA: TournamentCandidateLocal
  candidateB: TournamentCandidateLocal
}

export interface TournamentStats {
  totalComparisons: number
  passBothsUsed: number
  passBothsRemaining: number
  newMatchesThisSession: string[]
}

function computeNewElo(
  winnerElo: number,
  loserElo: number,
): [number, number] {
  const expected = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / ELO_RD))
  const newWinner = Math.round(winnerElo + ELO_K * (1 - expected))
  const newLoser = Math.round(loserElo + ELO_K * (0 - (1 - expected)))
  return [newWinner, newLoser]
}

function generatePairingId() {
  return `pairing-${Math.random().toString(36).slice(2, 9)}`
}

function pickPairing(candidates: TournamentCandidateLocal[]): TournamentPairing | null {
  // Filter out confirmed matches and need at least 2
  const eligible = candidates.filter(c => !c.matchConfirmed)
  if (eligible.length < 2) return null

  // Sort by fewest comparisons first to ensure coverage
  const sorted = [...eligible].sort((a, b) => a.nComparisons - b.nComparisons)
  const candidateA = sorted[0]
  const candidateB = sorted.find(c => c.id !== candidateA.id) ?? sorted[1]
  if (!candidateB || candidateA.id === candidateB.id) return null

  return {
    pairingId: generatePairingId(),
    candidateA,
    candidateB,
  }
}

// ---- hook ----

export function useTournament(phase: 'phase2' | 'phase3' = 'phase2') {
  const [candidates, setCandidates] = useState<TournamentCandidateLocal[]>(
    () => tournamentCandidatesRaw as TournamentCandidateLocal[]
  )
  const [currentPairing, setCurrentPairing] = useState<TournamentPairing | null>(
    () => pickPairing(tournamentCandidatesRaw as TournamentCandidateLocal[])
  )
  const [stats, setStats] = useState<TournamentStats>({
    totalComparisons: 0,
    passBothsUsed: 0,
    passBothsRemaining: PASS_BOTH_MAX_PER_SESSION,
    newMatchesThisSession: [],
  })
  const [newMatchCandidate, setNewMatchCandidate] = useState<TournamentCandidateLocal | null>(null)
  const sessionIdRef = useRef(`session-${Date.now()}`)

  const advanceToNextPairing = useCallback((updatedCandidates: TournamentCandidateLocal[]) => {
    const next = pickPairing(updatedCandidates)
    setCurrentPairing(next)
  }, [])

  const selectWinner = useCallback((winnerId: string) => {
    if (!currentPairing) return

    const { candidateA, candidateB } = currentPairing
    const loserId = winnerId === candidateA.id ? candidateB.id : candidateA.id
    const winner = winnerId === candidateA.id ? candidateA : candidateB
    const loser = winnerId === candidateA.id ? candidateB : candidateA

    const [newWinnerElo, newLoserElo] = computeNewElo(winner.eloRating, loser.eloRating)

    setCandidates(prev => {
      const updated = prev.map(c => {
        if (c.id === winnerId) {
          const newHearts = Math.min(c.heartCount + 1, HEARTS_TO_MATCH)
          const isNewMatch = newHearts === HEARTS_TO_MATCH && !c.matchConfirmed
          if (isNewMatch) {
            setNewMatchCandidate({ ...c, heartCount: newHearts, eloRating: newWinnerElo, matchConfirmed: true, nComparisons: c.nComparisons + 1 })
            setStats(s => ({
              ...s,
              totalComparisons: s.totalComparisons + 1,
              newMatchesThisSession: [...s.newMatchesThisSession, c.id],
            }))
          } else {
            setStats(s => ({ ...s, totalComparisons: s.totalComparisons + 1 }))
          }
          return {
            ...c,
            eloRating: newWinnerElo,
            heartCount: newHearts,
            nComparisons: c.nComparisons + 1,
            matchConfirmed: newHearts === HEARTS_TO_MATCH || c.matchConfirmed,
          }
        }
        if (c.id === loserId) {
          return { ...c, eloRating: newLoserElo, nComparisons: c.nComparisons + 1 }
        }
        return c
      })
      advanceToNextPairing(updated)
      return updated
    })
  }, [currentPairing, advanceToNextPairing])

  const passBoth = useCallback(() => {
    if (stats.passBothsRemaining <= 0) return
    setStats(s => ({
      ...s,
      totalComparisons: s.totalComparisons + 1,
      passBothsUsed: s.passBothsUsed + 1,
      passBothsRemaining: s.passBothsRemaining - 1,
    }))
    setCandidates(prev => {
      const updated = prev.map(c => {
        if (c.id === currentPairing?.candidateA.id || c.id === currentPairing?.candidateB.id) {
          return { ...c, nComparisons: c.nComparisons + 1 }
        }
        return c
      })
      advanceToNextPairing(updated)
      return updated
    })
  }, [stats.passBothsRemaining, currentPairing, advanceToNextPairing])

  const dismissMatch = useCallback(() => {
    setNewMatchCandidate(null)
  }, [])

  const poolSufficient = candidates.length >= 6
  const confirmedMatches = candidates.filter(c => c.matchConfirmed)
  const isComplete = candidates.filter(c => !c.matchConfirmed).length < 2

  return {
    candidates,
    currentPairing,
    stats,
    newMatchCandidate,
    poolSufficient,
    confirmedMatches,
    isComplete,
    sessionId: sessionIdRef.current,
    selectWinner,
    passBoth,
    dismissMatch,
    phase,
  }
}
