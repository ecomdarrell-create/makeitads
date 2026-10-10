export default function GenerateLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-80 animate-pulse rounded bg-slate-100" />
      </div>

      {/* Progress skeleton */}
      <div className="mb-6 h-16 animate-pulse rounded-xl bg-slate-100" />

      {/* Form skeleton */}
      <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}