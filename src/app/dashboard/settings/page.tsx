import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, CreditCard, KeyRound, LifeBuoy, ShieldCheck, UserRound } from 'lucide-react';
import { normalizePlanId } from '@/config/pricing.config';
import { SettingsProfileForm } from '@/components/dashboard/SettingsProfileForm';
import { getCurrencySymbol, normalizeCurrency } from '@/lib/currency';

const planNames: Record<string, string> = {
  free: 'Démo',
  pro: 'Pro',
  premium: 'Premium',
  enterprise: 'Élite',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, currency, plan, credits_balance, billing_cycle, subscription_status')
    .eq('id', user.id)
    .maybeSingle();

  const plan = normalizePlanId(profile?.plan);
  const currency = normalizeCurrency(profile?.currency);
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-10">

      {/* En-tête */}
      <header>
        <p className="text-[11px] font-medium text-indigo-600 mb-0.5 sm:text-xs sm:mb-1">
          Compte & préférences
        </p>
        <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
          Paramètres
        </h1>
        <p className="mt-1.5 max-w-2xl text-[12px] leading-relaxed text-slate-500 sm:mt-2 sm:text-sm">
          Gérez les informations utilisées pour personnaliser votre espace MakeItAds et suivez votre formule actuelle.
        </p>
      </header>

      {/* Cartes récapitulatives */}
      <section aria-label="Résumé du compte" className="grid gap-2.5 grid-cols-1 sm:gap-4 sm:grid-cols-3">
        <article className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:gap-4 sm:rounded-2xl sm:p-5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10">
            <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500 sm:text-xs">Compte</p>
            <p className="truncate text-[13px] font-semibold text-slate-900 sm:text-sm">
              {profile?.first_name || user.email?.split('@')[0] || 'Utilisateur'}
            </p>
          </div>
        </article>

        <article className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:gap-4 sm:rounded-2xl sm:p-5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 sm:h-10 sm:w-10">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500 sm:text-xs">Solde</p>
            <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">
              {profile?.credits_balance ?? 0} crédits
            </p>
          </div>
        </article>

        <article className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:gap-4 sm:rounded-2xl sm:p-5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 sm:h-10 sm:w-10">
            <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500 sm:text-xs">Formule</p>
            <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">
              {planNames[plan]} {currencySymbol && plan !== 'free' ? `(${currencySymbol})` : ''}
            </p>
          </div>
        </article>
      </section>

      {/* Section Profil */}
      <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm sm:rounded-2xl">
        <div className="flex items-start gap-2.5 border-b border-slate-50 px-4 py-3.5 sm:gap-3 sm:px-5 sm:py-5">
          <UserRound className="mt-0.5 h-4 w-4 text-indigo-600 sm:h-5 sm:w-5" />
          <div>
            <h2 className="text-[13px] font-semibold text-slate-900 sm:text-sm">Profil professionnel</h2>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
              Ces informations orientent le contexte de vos recommandations.
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6">
          <SettingsProfileForm
            firstName={profile?.first_name || ''}
            lastName={profile?.last_name || ''}
            currency={currency}
          />
        </div>
        <p className="px-4 pb-3.5 text-[10px] text-slate-400 italic sm:px-5 sm:pb-5 sm:text-[11px]">
          * Pour modifier votre devise de facturation, veuillez contacter le support.
        </p>
      </section>

      {/* Section Sécurité & Facturation */}
      <section className="grid gap-3 sm:gap-5 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0 sm:h-5 sm:w-5" />
            <div className="min-w-0 flex-1">
              <h2 className="text-[13px] font-semibold text-slate-900 sm:text-sm">Sécurité du compte</h2>
              <p className="mt-0.5 break-all text-[11px] text-slate-600 sm:mt-1 sm:text-xs">{user.email}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500 sm:mt-3 sm:text-xs">
                L’adresse e-mail sert à la connexion. Utilisez le lien sécurisé pour renouveler votre mot de passe.
              </p>
              <Link
                href="/forgot-password"
                className="mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-[11px] font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:mt-4 sm:min-h-10 sm:gap-2 sm:px-4 sm:text-xs"
              >
                <KeyRound className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Réinitialiser le mot de passe
              </Link>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <CreditCard className="mt-0.5 h-4 w-4 text-indigo-600 shrink-0 sm:h-5 sm:w-5" />
            <div className="min-w-0 flex-1">
              <h2 className="text-[13px] font-semibold text-slate-900 sm:text-sm">Formule & facturation</h2>
              <p className="mt-0.5 text-[11px] text-slate-600 sm:mt-1 sm:text-xs">
                Plan {planNames[plan]} · {profile?.billing_cycle === 'yearly' ? 'Annuel' : 'Mensuel'}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500 sm:mt-3 sm:text-xs">
                Statut : {profile?.subscription_status || (plan === 'free' ? 'Démo active' : 'Synchronisation en cours')}
              </p>
              <Link
                href="/dashboard/pricing"
                className="mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 text-[11px] font-semibold text-white transition-colors hover:bg-indigo-700 sm:mt-4 sm:min-h-10 sm:gap-2 sm:px-4 sm:text-xs"
              >
                Gérer ma formule <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* Section Support */}
      <section className="flex flex-col gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-2xl sm:p-5">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <LifeBuoy className="mt-0.5 h-4 w-4 text-indigo-600 shrink-0 sm:h-5 sm:w-5" />
          <div>
            <h2 className="text-[13px] font-semibold text-slate-900 sm:text-sm">Besoin d’assistance ?</h2>
            <p className="mt-0.5 text-[11px] text-slate-600 sm:mt-1 sm:text-xs">
              Notre équipe peut vous aider sur le compte, les crédits et les paiements.
            </p>
          </div>
        </div>
        <a
          href="https://t.me/MakeitAds_CEO"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-[11px] font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:min-h-10 sm:px-5 sm:text-xs"
        >
          Contacter le support
        </a>
      </section>
    </div>
  );
}