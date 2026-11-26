'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// MODIFICATION : Suppression de Lock, ajout de Crown
import { ArrowRight, Crown } from 'lucide-react';

interface HeroActionCardProps {
  plan?: string;
}

export function HeroActionCard({ plan = 'free' }: HeroActionCardProps) {
  const router = useRouter();

  const isFree = plan === 'free';
  const generateHref = isFree ? '/dashboard/pricing' : '/dashboard/generate?type=complete';
  const ctaLabel = isFree ? 'Choisir un plan' : 'Créer une stratégie';

  useEffect(() => {
    router.prefetch(generateHref);
    router.prefetch('/dashboard/resources');
  }, [router, generateHref]);

  const handlePrimaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(generateHref);
  };

  return (
    <div data-tour="hero-card" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-1.5 text-sm font-semibold text-slate-900 sm:mb-2 sm:text-base">
        Construisez votre prochaine stratégie.
      </h2>
      <p className="mb-4 max-w-lg text-xs leading-relaxed text-slate-600 sm:text-sm">
        Définissez votre entreprise, votre audience et votre objectif. MakeItAds
        transforme ces informations en recommandations exploitables.
      </p>

      <div className="flex flex-row items-stretch gap-2 sm:gap-3">
        <Link
          href={generateHref}
          onClick={handlePrimaryClick}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold text-white transition-colors sm:flex-none sm:px-4 sm:text-sm ${
            isFree ? 'bg-[#111827] hover:bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {/* MODIFICATION : Remplacement de Lock par Crown */}
          {isFree && <Crown className="h-3 w-3 shrink-0" />}
          <span className="truncate">{ctaLabel}</span>
          <ArrowRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
        </Link>

        {/* MODIFICATION : Suppression totale du bouton "Comment ça marche" */}
      </div>
    </div>
  );
}