import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { RECHARGE_PACKS } from '@/config/pricing.config';

// ✅ Style par index de pack (couleurs identiques au pricing)
const PACK_STYLES = [
  {
    border: 'border-emerald-200 hover:border-emerald-400',
    badge: 'bg-emerald-500',
    price: 'text-emerald-600',
    cta: 'text-emerald-600',
    ring: '#10B981',
  },
  {
    border: 'border-[#6366F1] hover:border-[#6366F1] shadow-[0_8px_30px_-12px_rgba(99,102,241,0.25)]',
    badge: 'bg-[#6366F1]',
    price: 'text-[#6366F1]',
    cta: 'text-[#6366F1]',
    ring: '#6366F1',
  },
  {
    border: 'border-amber-200 hover:border-amber-400',
    badge: 'bg-amber-500',
    price: 'text-amber-600',
    cta: 'text-amber-600',
    ring: '#F59E0B',
  },
];

function BalanceRing({ value }: { value: number }) {
  // Anneau de progression relatif (max visuel = 100)
  const max = Math.max(value, 100);
  const pct = Math.min(value / max, 1);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;
  const gap = circumference - dash;

  return (
    <div className="relative h-[60px] w-[60px] sm:h-[68px] sm:w-[68px] flex-shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#6366F1"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[15px] sm:text-lg font-bold text-[#111827] leading-none">
          {value}
        </span>
        <span className="mt-0.5 text-[8px] sm:text-[9px] uppercase tracking-wide text-gray-500 font-medium">
          crédits
        </span>
      </div>
    </div>
  );
}

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

      {/* Header compact */}
      <div className="mb-4 sm:mb-5">
        <h1 className="text-[15px] sm:text-xl font-semibold text-[#111827] mb-0.5 sm:mb-1">
          Recharger mes crédits
        </h1>
        <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
          Achetez un pack. Crédits ajoutés instantanément après paiement.
        </p>
      </div>

      {/* Solde en anneau — compact */}
      <div className="mb-4 sm:mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
        <BalanceRing value={balance} />
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-indigo-600">
            Solde actuel
          </p>
          <p className="text-[15px] sm:text-base font-semibold text-[#111827] mt-0.5">
            {balance} crédit{balance > 1 ? 's' : ''} disponible{balance > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Packs — compacts sur mobile */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3 mb-4 sm:mb-5">
        {RECHARGE_PACKS.map((pack, i) => {
          const style = PACK_STYLES[i % PACK_STYLES.length];
          return (
            <a
              key={pack.id}
              href={buildUrl(pack.chariowUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col rounded-xl border bg-white p-3 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${style.border}`}
            >
              {pack.popular && (
                <span className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm whitespace-nowrap ${style.badge}`}>
                  Populaire
                </span>
              )}

              <div className="mb-2.5 sm:mb-3">
                <p className="text-base sm:text-lg font-bold text-[#111827] leading-tight">
                  {pack.label}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-500 leading-snug">
                  {pack.description}
                </p>
              </div>

              <div className="mt-auto border-t border-slate-100 pt-2.5">
                <p className={`text-[13px] sm:text-sm font-bold ${style.price}`}>
                  {pack.price.toLocaleString('fr-FR')} FCFA
                </p>
                <span className={`mt-1.5 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold ${style.cta}`}>
                  Recharger
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Info sécurité — compact */}
      <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:p-3">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500 sm:h-4 sm:w-4" />
        <div>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-700">
            Paiement 100 % sécurisé
          </p>
          <p className="mt-0.5 text-[9px] sm:text-[10px] leading-relaxed text-slate-500">
            Mobile Money (Orange, Wave, MTN, Moov) et cartes bancaires. Crédits ajoutés dès validation.
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] text-slate-500">
        Besoin de crédits renouvelés chaque mois ?{' '}
        <Link href="/dashboard/pricing" className="font-semibold text-[#6366F1] hover:underline">
          Voir les abonnements
        </Link>
      </p>
    </div>
  );
}