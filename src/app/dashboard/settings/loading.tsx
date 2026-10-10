export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-6">
      {/* Header */}
      <div className="mb-5 space-y-2">
        <div className="h-5 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-80 animate-pulse rounded bg-slate-100" />
      </div>

      {/* Profile card skeleton */}
      <div className="mb-4 h-40 animate-pulse rounded-xl bg-slate-100" />
      <div className="mb-4 h-64 animate-pulse rounded-xl bg-slate-100" />
      <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}