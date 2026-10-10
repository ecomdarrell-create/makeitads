import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroActionCard() {
  return (
    <div
      data-tour="hero-card"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <h2 className="mb-1.5 text-sm font-semibold text-slate-900 sm:mb-2 sm:text-base">
        Construisez votre prochaine stratégie.
      </h2>
      <p className="mb-4 max-w-lg text-xs leading-relaxed text-slate-600 sm:text-sm">
        Définissez votre entreprise, votre audience et votre objectif. MakeItAds
        transforme ces informations en recommandations exploitables.
      </p>

      {/* 2 boutons côte à côte sur une ligne */}
      <div className="flex flex-row items-stretch gap-2 sm:gap-3">
        <Link
          href="/dashboard/generate"
          data-tour="hero-create-btn"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-indigo-700 sm:flex-none sm:px-4 sm:text-sm"
        >
          <span className="truncate">Créer une stratégie</span>
          <ArrowRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
        </Link>

        <Link
          href="/dashboard/resources#how-it-works"
          data-tour="hero-how-btn"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:flex-none sm:px-4 sm:text-sm"
        >
          <span className="truncate">Comment ça marche</span>
        </Link>
      </div>
    </div>
  );
}