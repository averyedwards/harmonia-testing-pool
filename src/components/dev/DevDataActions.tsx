'use client'

export function DevDataActions() {
  const handleReset = () => {
    if (!window.confirm('Reset all dev state? This will clear localStorage and sessionStorage and reload.')) return
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  const handleAddMatch = () => {
    // Inject a mock match notification into sessionStorage so the
    // notifications page picks it up on next render.
    const stored = JSON.parse(sessionStorage.getItem('dev_extra_notifications') ?? '[]')
    stored.push({
      id: `dev-notif-${Date.now()}`,
      type: 'match_confirmed',
      title: 'Dev: New mock match!',
      body: 'A simulated match was added via the dev toolbar.',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: '/tournament',
    })
    sessionStorage.setItem('dev_extra_notifications', JSON.stringify(stored))
    window.alert('Mock match notification added. Refresh the notifications page to see it.')
  }

  const handleAddNotification = () => {
    const stored = JSON.parse(sessionStorage.getItem('dev_extra_notifications') ?? '[]')
    stored.push({
      id: `dev-notif-${Date.now()}`,
      type: 'community_update',
      title: 'Dev: Test notification',
      body: 'This notification was added via the dev toolbar.',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: '/notifications',
    })
    sessionStorage.setItem('dev_extra_notifications', JSON.stringify(stored))
    window.alert('Test notification added. Refresh the notifications page to see it.')
  }

  const handleSimulateDna = () => {
    window.alert('DNA simulation: kit status would advance to "results_uploaded". In production this is an admin action.')
  }

  const ACTIONS = [
    { label: 'Reset all', action: handleReset, danger: true },
    { label: 'Add match', action: handleAddMatch, danger: false },
    { label: 'Add notif', action: handleAddNotification, danger: false },
    { label: 'Sim DNA', action: handleSimulateDna, danger: false },
  ]

  return (
    <div>
      <p className="text-[9px] text-gold uppercase tracking-widest mb-1.5">Data</p>
      <div className="grid grid-cols-2 gap-1">
        {ACTIONS.map(({ label, action, danger }) => (
          <button
            key={label}
            onClick={action}
            className={`text-[10px] px-2 py-1 rounded transition-all text-left ${
              danger
                ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300'
                : 'text-slate hover:text-gold hover:bg-dark-surface'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
