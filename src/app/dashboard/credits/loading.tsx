export default function CreditsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-6">
      {/* Header */}
      <div className="mb-5 space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-72 animate-pulse rounded bg-slate-100" />
      </div>

      {/* Solde skeleton */}
      <div className="mb-4 h-48 animate-pulse rounded-xl bg-slate-100" />

      {/* Packs skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}