export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`bg-border animate-pulse rounded-sm ${className}`}
    />
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div role="status" aria-label="Loading table" className="w-full">
      <div className="grid gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-8" />
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">Loading data...</span>
    </div>
  );
}
