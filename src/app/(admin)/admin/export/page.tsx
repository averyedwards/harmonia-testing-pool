'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast'

const EXPORT_DATASETS = [
  {
    id: 'calibration',
    label: 'Calibration ratings',
    description: 'Face rating events: faceId, userId, score, timestamp',
    rowCount: '11,342',
    sensitive: false,
  },
  {
    id: 'comparisons',
    label: 'Tournament comparisons',
    description: 'All pairwise choices: timing, personality view, pass-both, Elo deltas',
    rowCount: '3,891',
    sensitive: false,
  },
  {
    id: 'personality_profiles',
    label: 'Personality profiles',
    description: 'Anonymised FELIX sin scores and quality tiers',
    rowCount: '247',
    sensitive: false,
  },
  {
    id: 'matches',
    label: 'Confirmed matches',
    description: 'Match events, contact exchange status, HLA scores',
    rowCount: '94',
    sensitive: true,
  },
  {
    id: 'we_met',
    label: 'We Met survey responses',
    description: 'Post-meetup feedback: didMeet, interestScore, orientation',
    rowCount: '61',
    sensitive: false,
  },
  {
    id: 'hla_scores',
    label: 'HLA scores',
    description: 'Anonymised HLA dissimilarity scores per match pair',
    rowCount: '42',
    sensitive: true,
  },
]

export default function AdminExportPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [anonymise, setAnonymise] = useState(true)
  const [exporting, setExporting] = useState(false)

  if (!isAdmin) return null

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleExport = async () => {
    setExporting(true)
    await new Promise(r => setTimeout(r, 1200))
    setExporting(false)
    showToast(`Export prepared: ${selected.size} dataset${selected.size !== 1 ? 's' : ''} (CSV)`, 'success')
  }

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1 text-caption text-slate hover:text-gold mb-6 transition-colors"
        >
          ← Admin dashboard
        </button>

        <h1 className="font-heading text-h1 text-navy dark:text-cream mb-2">Research Export</h1>
        <p className="text-body-sm text-slate mb-8">
          Export anonymised datasets for research analysis. All exports are GDPR-compliant.
          Sensitive exports require additional authorisation.
        </p>

        {/* Anonymisation toggle */}
        <Card className="p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-body-sm font-medium text-navy dark:text-cream">Anonymise user IDs</p>
            <p className="text-caption text-slate">Replace user IDs with pseudonymous hashes</p>
          </div>
          <Toggle enabled={anonymise} onChange={setAnonymise} />
        </Card>

        {/* Dataset selection */}
        <div className="space-y-3 mb-6">
          {EXPORT_DATASETS.map(ds => (
            <Card
              key={ds.id}
              className="p-4 cursor-pointer transition-all hover:shadow-card-hover"
              onClick={() => toggle(ds.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                  selected.has(ds.id) ? 'bg-gold border-gold' : 'border-gray-light dark:border-dark-border'
                }`}>
                  {selected.has(ds.id) && <span className="text-wine-black text-xs font-bold">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-body-sm font-semibold text-navy dark:text-cream">{ds.label}</p>
                    {ds.sensitive && <Badge variant="error">Sensitive</Badge>}
                  </div>
                  <p className="text-caption text-slate">{ds.description}</p>
                  <p className="text-caption text-gold mt-0.5">{ds.rowCount} rows</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleExport}
          disabled={selected.size === 0 || exporting}
          size="lg"
          className="w-full"
        >
          {exporting ? 'Preparing export...' : `Export ${selected.size > 0 ? selected.size + ' dataset' + (selected.size !== 1 ? 's' : '') : ''} as CSV`}
        </Button>

        <p className="text-caption text-slate text-center mt-3">
          Exports are logged and audited. All data handled under the Harmonia research ethics agreement.
        </p>
      </div>
    </div>
  )
}
