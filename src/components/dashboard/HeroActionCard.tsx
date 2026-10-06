import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroActionCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-1.5 text-sm font-semibold text-slate-900 sm:mb-2 sm:text-base">
        Construisez votre prochaine stratégie.
      </h2>
      <p className="mb-4 max-w-lg text-xs leading-relaxed text-slate-600 sm:text-sm">
        Définissez votre entreprise, votre audience et votre objectif. MakeItAds transforme ces informations en recommandations exploitables.
      </p>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Link
          href="/dashboard/generate"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 sm:text-sm"
        >
          Créer une stratégie
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </Link>
        <Link
          href="/dashboard/resources#how-it-works"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:text-sm"
        >
          Comment ça fonctionne
        </Link>
      </div>
    </div>
  );
}