export default function AnalyticsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
      <div className="mb-5 space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-72 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}