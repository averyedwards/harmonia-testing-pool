'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePhase } from '@/hooks/usePhase'
import { cn } from '@/lib/utils'

export function DevUserControls() {
  const { user, login, setUserOverrides } = useAuth()
  const { devMode, setDevUserType } = usePhase()

  const isAdmin = user?.role === 'admin'
  const isLondon = user?.isLondon ?? false
  const calibrationComplete = user?.calibrationComplete ?? false
  const questionnaireComplete = user?.questionnaireComplete ?? false

  const toggle = (key: 'isLondon' | 'calibrationComplete' | 'questionnaireComplete', val: boolean) => {
    setUserOverrides({ [key]: val })
  }

  const CONTROLS: {
    label: string
    value: boolean
    onToggle: (val: boolean) => void
  }[] = [
    {
      label: 'Admin',
      value: isAdmin,
      onToggle: (val) => {
        login(val ? 'admin' : 'user')
        setDevUserType(val ? 'admin' : 'london_with_kit')
      },
    },
    {
      label: 'London',
      value: isLondon,
      onToggle: (val) => {
        toggle('isLondon', val)
        setDevUserType(val ? 'london_with_kit' : 'global')
      },
    },
    {
      label: 'Calibrated',
      value: calibrationComplete,
      onToggle: (val) => toggle('calibrationComplete', val),
    },
    {
      label: 'Questionnaire',
      value: questionnaireComplete,
      onToggle: (val) => toggle('questionnaireComplete', val),
    },
  ]

  return (
    <div>
      <p className="text-[9px] text-gold uppercase tracking-widest mb-1.5">User</p>
      <div className="grid grid-cols-2 gap-1">
        {CONTROLS.map(({ label, value, onToggle }) => (
          <button
            key={label}
            onClick={() => onToggle(!value)}
            className={cn(
              'text-[10px] px-2 py-1 rounded transition-all text-left',
              value
                ? 'bg-gold text-wine-black font-semibold'
                : 'text-slate hover:text-gold hover:bg-dark-surface',
            )}
          >
            {label}: {value ? 'on' : 'off'}
          </button>
        ))}
      </div>
    </div>
  )
}
