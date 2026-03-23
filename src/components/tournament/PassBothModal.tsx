'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PASS_BOTH_MAX_PER_SESSION } from '@/lib/constants'

interface PassBothModalProps {
  open: boolean
  passBothsRemaining: number
  onConfirm: (explanation: string) => void
  onCancel: () => void
}

export function PassBothModal({
  open,
  passBothsRemaining,
  onConfirm,
  onCancel,
}: PassBothModalProps) {
  const [explanation, setExplanation] = useState('')

  const handleConfirm = () => {
    onConfirm(explanation.trim())
    setExplanation('')
  }

  const handleCancel = () => {
    setExplanation('')
    onCancel()
  }

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title="Pass on both?"
    >
      <div className="space-y-4">
        <p className="text-body-sm text-slate">
          You can pass on both candidates up to <strong className="text-navy dark:text-cream">{PASS_BOTH_MAX_PER_SESSION}</strong> times
          per session. You have <strong className="text-gold">{passBothsRemaining}</strong> remaining.
        </p>

        <div>
          <Textarea
            label="What made it hard to choose? (optional)"
            placeholder="e.g. Neither felt right today, or I couldn't tell them apart..."
            value={explanation}
            onChange={e => setExplanation(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleConfirm}
            disabled={passBothsRemaining <= 0}
            className="flex-1"
          >
            Pass on both
          </Button>
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="flex-1"
          >
            Go back
          </Button>
        </div>

        {passBothsRemaining <= 0 && (
          <p className="text-caption text-maroon text-center">
            You've used all your passes for this session. Please choose one.
          </p>
        )}
      </div>
    </Modal>
  )
}
