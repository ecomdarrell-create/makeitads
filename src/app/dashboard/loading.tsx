export default function DashboardLoading() {
  return (
    <div role="status" aria-label="Chargement du dashboard" className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <span className="sr-only">Chargement…</span>
      <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white" />
          <div className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />
          <div className="h-52 animate-pulse rounded-xl border border-slate-200 bg-white" />
        </div>
        <div className="space-y-4">
          <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
          <div className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white" />
        </div>
      </div>
    </div>
  );
}