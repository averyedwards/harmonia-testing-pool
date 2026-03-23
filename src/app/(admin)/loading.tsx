export default function AdminLoading() {
  return (
    <div className="harmonia-container py-8 min-h-screen animate-pulse">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-9 w-32 bg-gray-light dark:bg-dark-border rounded-card" />

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="harmonia-card p-4">
              <div className="h-8 w-16 bg-gray-light dark:bg-dark-border rounded mb-2" />
              <div className="h-3 w-24 bg-gray-light dark:bg-dark-border rounded" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="harmonia-card p-5 space-y-3">
          <div className="h-4 w-32 bg-gray-light dark:bg-dark-border rounded" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-3 w-48 bg-gray-light dark:bg-dark-border rounded" />
              <div className="h-5 w-16 bg-gray-light dark:bg-dark-border rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
