export default function StrategiesLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
      {/* Header */}
      <div className="mb-5 space-y-2">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-72 animate-pulse rounded bg-slate-100" />
      </div>

      {/* Rings skeleton */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-20 w-20 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}