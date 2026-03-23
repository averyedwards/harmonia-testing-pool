import { type ReactNode } from 'react'

interface DashboardLayoutProps {
  header: ReactNode
  children: ReactNode
}

export function DashboardLayout({ header, children }: DashboardLayoutProps) {
  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {header}
        <div className="flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  )
}
