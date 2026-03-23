'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TournamentCard } from './TournamentCard'
import { PassBothModal } from './PassBothModal'
import { cn } from '@/lib/utils'
import type { TournamentPairing } from '@/hooks/useTournament'

interface ComparisonViewProps {
  pairing: TournamentPairing
  passBothsRemaining: number
  onSelect: (winnerId: string) => void
  onPassBoth: (explanation: string) => void
  showGenetics?: boolean
}

export function ComparisonView({
  pairing,
  passBothsRemaining,
  onSelect,
  onPassBoth,
  showGenetics = false,
}: ComparisonViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [passModalOpen, setPassModalOpen] = useState(false)

  // Reset selection when pairing changes
  useEffect(() => {
    setSelectedId(null)
  }, [pairing.pairingId])

  const handleCardClick = (id: string) => {
    setSelectedId(id)
    // After brief highlight, confirm
    setTimeout(() => onSelect(id), 600)
  }

  const getCardState = (id: string) => {
    if (selectedId === null) return 'default'
    if (selectedId === id) return 'selected'
    return 'not_selected'
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {/* Header */}
        <div className="text-center">
          <p className="text-caption text-slate uppercase tracking-wide">
            Who would you rather meet?
          </p>
        </div>

        {/* Cards — desktop: side-by-side, mobile: stacked */}
        <div className={cn(
          'grid gap-4',
          'grid-cols-1 sm:grid-cols-2',
        )}>
          <TournamentCard
            candidate={pairing.candidateA}
            state={getCardState(pairing.candidateA.id)}
            onSelect={() => handleCardClick(pairing.candidateA.id)}
            showGenetics={showGenetics}
          />
          <TournamentCard
            candidate={pairing.candidateB}
            state={getCardState(pairing.candidateB.id)}
            onSelect={() => handleCardClick(pairing.candidateB.id)}
            showGenetics={showGenetics}
          />
        </div>

        {/* Pass both */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPassModalOpen(true)}
            disabled={passBothsRemaining <= 0}
            className="text-slate hover:text-gold"
          >
            Can't decide · {passBothsRemaining} pass{passBothsRemaining !== 1 ? 'es' : ''} left
          </Button>
        </div>
      </div>

      <PassBothModal
        open={passModalOpen}
        passBothsRemaining={passBothsRemaining}
        onConfirm={explanation => {
          setPassModalOpen(false)
          onPassBoth(explanation)
        }}
        onCancel={() => setPassModalOpen(false)}
      />
    </>
  )
}
