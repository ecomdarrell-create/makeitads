import { PremiumLoader } from '@/components/ui/PremiumLoader';

export default function DashboardLoading() {
  return (
    <>
      <div className="px-4 py-5 space-y-5 sm:px-6 sm:py-6 sm:space-y-6 opacity-40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-72 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-8 w-32 animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
          </div>
          <div className="space-y-5 sm:space-y-6">
            <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>

      <PremiumLoader
        fullScreen
        message="Chargement de votre espace MakeItAds…"
      />
    </>
  );
}