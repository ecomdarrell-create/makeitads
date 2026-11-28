'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowRight, Crown, Plus } from 'lucide-react';

interface HeroActionCardProps {
  plan?: string;
}

export function HeroActionCard({ plan = 'free' }: HeroActionCardProps) {
  const router = useRouter();

  const isFree = plan === 'free';
  const generateHref = isFree ? '/dashboard/pricing' : '/dashboard/generate?type=complete';
  const ctaLabel = isFree ? 'Choisir un plan' : 'Créer une stratégie';
  const rechargeHref = '/dashboard/credits/recharge';

  useEffect(() => {
    router.prefetch(generateHref);
    router.prefetch(rechargeHref);
  }, [router, generateHref, rechargeHref]);

  return (
    <div data-tour="hero-card" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-1.5 text-sm font-semibold text-slate-900 sm:mb-2 sm:text-base">
        Construisez votre prochaine stratégie.
      </h2>
      <p className="mb-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
        Définissez votre entreprise, votre audience et votre objectif. MakeItAds transforme ces informations en recommandations exploitables.
      </p>

      <div className="flex flex-col gap-2.5">
        <Link
          href={generateHref}
          prefetch={true}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold text-white transition-colors sm:text-sm ${
            isFree ? 'bg-[#111827] hover:bg-slate-800' : 'bg-[#6366F1] hover:bg-[#5558e6]'
          }`}
        >
          {isFree && <Crown className="h-3.5 w-3.5 shrink-0" />}
          <span className="truncate">{ctaLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </Link>

        {/* ✅ NOUVEAU BOUTON : Recharge de crédits */}
        <Link
          href={rechargeHref}
          prefetch={true}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:text-sm"
        >
          <Plus className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Ou acheter des crédits à l'unité</span>
        </Link>
      </div>
    </div>
  );
}