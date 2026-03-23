export default function AppLoading() {
  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-lg mx-auto space-y-4 animate-pulse">
        {/* Title skeleton */}
        <div className="h-9 w-48 bg-gray-light dark:bg-dark-border rounded-card" />
        <div className="h-4 w-72 bg-gray-light dark:bg-dark-border rounded-card" />

        {/* Card skeletons */}
        {[1, 2, 3].map(i => (
          <div key={i} className="harmonia-card p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-card bg-gray-light dark:bg-dark-border flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-gray-light dark:bg-dark-border rounded" />
                <div className="h-5 w-40 bg-gray-light dark:bg-dark-border rounded" />
                <div className="h-3 w-64 bg-gray-light dark:bg-dark-border rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
