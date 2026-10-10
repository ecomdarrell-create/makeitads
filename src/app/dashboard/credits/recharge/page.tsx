import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Coins, ShieldCheck } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { RECHARGE_PACKS } from '@/config/pricing.config';

export default async function RechargePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance, currency')
    .eq('id', user.id)
    .maybeSingle();

  const balance = profile?.credits_balance ?? 0;

  // ✅ Construit l'URL Chariow avec userId + email pour le webhook
  const buildUrl = (base: string) => {
    try {
      const url = new URL(base);
      url.searchParams.set('userId', user.id);
      if (user.email) url.searchParams.set('email', user.email);
      return url.toString();
    } catch {
      return base;
    }
  };

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      <BackButton href="/dashboard/credits" label="Retour aux crédits" />

      {/* En-tête */}
      <div className="mb-5">
        <h1 className="text-base sm:text-xl font-semibold text-[#111827] mb-1">
          Recharger mes crédits
        </h1>
        <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
          Achetez un pack de crédits sans engagement. Vos crédits sont ajoutés instantanément après le paiement.
        </p>
      </div>

      {/* Solde actuel */}
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-3.5 sm:p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#6366F1] shadow-sm flex-shrink-0">
          <Coins className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-indigo-600 sm:text-[11px]">
            Solde actuel
          </p>
          <p className="text-lg font-bold text-[#111827] sm:text-xl">
            {balance} crédit{balance > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Packs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 mb-5">
        {RECHARGE_PACKS.map((pack) => (
          <a
            key={pack.id}
            href={buildUrl(pack.chariowUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex flex-col rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
              pack.popular
                ? 'border-[#6366F1] shadow-[0_8px_30px_-12px_rgba(99,102,241,0.25)]'
                : 'border-gray-200 hover:border-[#6366F1]/50'
            }`}
          >
            {pack.popular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#6366F1] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm whitespace-nowrap">
                Populaire
              </span>
            )}

            <div className="mb-3">
              <p className="text-xl font-bold text-[#111827] sm:text-2xl">
                {pack.label}
              </p>
              <p className="mt-0.5 text-[10px] text-gray-500 sm:text-[11px]">
                {pack.description}
              </p>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-3">
              <p className="text-base font-bold text-[#6366F1] sm:text-lg">
                {pack.price.toLocaleString('fr-FR')} FCFA
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#6366F1] sm:text-xs">
                Recharger
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Info sécurité */}
      <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 sm:h-5 sm:w-5" />
        <div>
          <p className="text-[11px] font-medium text-slate-700 sm:text-xs">
            Paiement 100 % sécurisé
          </p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
            Mobile Money (Orange, Wave, MTN, Moov) et cartes bancaires acceptées. Les crédits sont automatiquement ajoutés à votre compte dès la validation du paiement.
          </p>
        </div>
      </div>

      {/* Lien vers pricing abonnement */}
      <p className="mt-5 text-center text-[10px] text-slate-500 sm:text-[11px]">
        Besoin de crédits renouvelés chaque mois ?{' '}
        <Link href="/dashboard/pricing" className="font-semibold text-[#6366F1] hover:underline">
          Voir les abonnements
        </Link>
      </p>
    </div>
  );
}