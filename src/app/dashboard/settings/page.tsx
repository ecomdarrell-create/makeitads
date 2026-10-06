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

  // ✅ Récupération de 'currency' au lieu de 'country'
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, currency, plan, credits_balance, billing_cycle, subscription_status')
    .eq('id', user.id)
    .maybeSingle();

  const plan = normalizePlanId(profile?.plan);
  const currency = normalizeCurrency(profile?.currency);
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 sm:py-10">
      
      {/* En-tête adouci et plus lisible sur mobile */}
      <header>
        <p className="text-xs font-medium text-indigo-600 mb-1">Compte & préférences</p>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Paramètres</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Gérez les informations utilisées pour personnaliser votre espace MakeItAds et suivez votre formule actuelle.
        </p>
      </header>

      {/* Cartes récapitulatives : 1 colonne sur mobile, 3 sur desktop pour éviter l'écrasement */}
      <section aria-label="Résumé du compte" className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <UserRound className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Compte</p>
            <p className="truncate text-sm font-semibold text-slate-900">
              {profile?.first_name || user.email?.split('@')[0] || 'Utilisateur'}
            </p>
          </div>
        </article>

        <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CreditCard className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Solde</p>
            <p className="text-sm font-semibold text-slate-900">
              {profile?.credits_balance ?? 0} crédits
            </p>
          </div>
        </article>

        <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <BadgeCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Formule</p>
            <p className="text-sm font-semibold text-slate-900">
              {planNames[plan]} {currencySymbol && plan !== 'free' ? `(${currencySymbol})` : ''}
            </p>
          </div>
        </article>
      </section>

      {/* Section Profil */}
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-start gap-3 border-b border-slate-50 px-5 py-5">
          <UserRound className="mt-0.5 h-5 w-5 text-indigo-600" />
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Profil professionnel</h2>
            <p className="mt-1 text-xs text-slate-500">Ces informations orientent le contexte de vos recommandations.</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          {/* ✅ Passage de 'currency' au lieu de 'country' */}
          <SettingsProfileForm 
            firstName={profile?.first_name || ''} 
            lastName={profile?.last_name || ''} 
            currency={currency} 
          />
        </div>
        <p className="px-5 pb-5 text-[11px] text-slate-400 italic">
          * Pour modifier votre devise de facturation, veuillez contacter le support.
        </p>
      </section>

      {/* Section Sécurité & Facturation */}
      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-slate-900">Sécurité du compte</h2>
              <p className="mt-1 break-all text-xs text-slate-600">{user.email}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                L’adresse e-mail sert à la connexion. Utilisez le lien sécurisé pour renouveler votre mot de passe.
              </p>
              <Link 
                href="/forgot-password" 
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-xs font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <KeyRound className="h-3.5 w-3.5" /> Réinitialiser le mot de passe
              </Link>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 h-5 w-5 text-indigo-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-slate-900">Formule & facturation</h2>
              <p className="mt-1 text-xs text-slate-600">
                Plan {planNames[plan]} · {profile?.billing_cycle === 'yearly' ? 'Annuel' : 'Mensuel'}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Statut : {profile?.subscription_status || (plan === 'free' ? 'Démo active' : 'Synchronisation en cours')}
              </p>
              <Link 
                href="/dashboard/pricing" 
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-indigo-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Gérer ma formule <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* Section Support */}
      <section className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <LifeBuoy className="mt-0.5 h-5 w-5 text-indigo-600 shrink-0" />
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Besoin d’assistance ?</h2>
            <p className="mt-1 text-xs text-slate-600">Notre équipe peut vous aider sur le compte, les crédits et les paiements.</p>
          </div>
        </div>
        <a 
          href="https://t.me/MakeitAds_CEO" 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-xs font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          Contacter le support
        </a>
      </section>
    </div>
  );
}