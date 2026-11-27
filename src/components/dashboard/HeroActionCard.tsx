'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
      <p className="mb-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
        Définissez votre entreprise, votre audience et votre objectif. MakeItAds transforme ces informations en recommandations exploitables.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={generateHref}
          onClick={handlePrimaryClick}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold text-white transition-colors sm:w-auto sm:px-5 sm:text-sm ${
            isFree ? 'bg-[#111827] hover:bg-slate-800' : 'bg-[#6366F1] hover:bg-[#5558e6]'
          }`}
        >
          {isFree && <Crown className="h-3.5 w-3.5 shrink-0" />}
          <span className="truncate">{ctaLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
}