import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Crown,
  KeyRound,
  LifeBuoy,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { normalizePlanId } from '@/config/pricing.config';
import { SettingsProfileForm } from '@/components/dashboard/SettingsProfileForm';
import { ReferralCard } from '@/components/dashboard/ReferralCard';
import { getCurrencySymbol, normalizeCurrency } from '@/lib/currency';

const ADMIN_EMAILS = ['ecomdarrell@gmail.com', 'darrellkamga@gmail.com'];

const planNames: Record<string, string> = {
  free: 'Démo',
  pro: 'Pro',
  premium: 'Premium',
  enterprise: 'Élite',
};

const planColors: Record<string, string> = {
  free: 'bg-slate-100 text-slate-700 ring-slate-200',
  pro: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  premium: 'bg-violet-50 text-violet-700 ring-violet-200',
  enterprise: 'bg-amber-50 text-amber-700 ring-amber-200',
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // ✅ Détection admin
  const isAdmin = user.email
    ? ADMIN_EMAILS.includes(user.email.toLowerCase().trim())
    : false;

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'first_name, last_name, phone, currency, plan, credits_balance, plan_expires_at, referral_code, referral_count, created_at'
    )
    .eq('id', user.id)
    .maybeSingle();

  const plan = normalizePlanId(profile?.plan);
  const currency = normalizeCurrency(profile?.currency);
  const currencySymbol = getCurrencySymbol(currency);
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user.email?.split('@')[0] ||
    'Utilisateur';
  const expiresAt = profile?.plan_expires_at;
  const hasExpiry = Boolean(expiresAt);
  const isDemo = plan === 'free';

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-3 py-5 sm:space-y-6 sm:px-6 sm:py-8">

      {/* ── En-tête ── */}
      <header>
        <p className="mb-0.5 text-[11px] font-medium text-indigo-600 sm:mb-1 sm:text-xs">
          Compte & préférences
        </p>
        <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
          Paramètres
        </h1>
        <p className="mt-1.5 max-w-2xl text-[12px] leading-relaxed text-slate-500 sm:mt-2 sm:text-sm">
          Gérez les informations de votre compte, votre formule et vos préférences MakeItAds.
        </p>
      </header>

      {/* ── Résumé ── */}
      <section
        aria-label="Résumé du compte"
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3"
      >
        <article className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:gap-4 sm:rounded-2xl sm:p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10">
            <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
              Compte
            </p>
            <p className="truncate text-[13px] font-semibold text-slate-900 sm:text-sm">
              {displayName}
            </p>
          </div>
        </article>

        <article className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:gap-4 sm:rounded-2xl sm:p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 sm:h-10 sm:w-10">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
              Solde
            </p>
            <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">
              {profile?.credits_balance ?? 0} crédits
            </p>
          </div>
        </article>

        <article className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:gap-4 sm:rounded-2xl sm:p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 sm:h-10 sm:w-10">
            <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
              Formule
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">
                {planNames[plan]}
              </p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-medium ring-1 ring-inset sm:text-[10px] ${planColors[plan]}`}
              >
                {currencySymbol}
              </span>
            </div>
          </div>
        </article>
      </section>

      {/* ✅ SECTION ADMIN — visible UNIQUEMENT sur mobile ET pour les admins */}
      {isAdmin && (
        <Link
          href="/dashboard/admin"
          className="md:hidden flex items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-3.5 shadow-sm transition-all hover:border-amber-400 active:scale-[0.99]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] text-white shadow-sm">
            <Crown className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-amber-900">
              Espace Admin
            </p>
            <p className="mt-0.5 text-[11px] text-amber-700">
              Statistiques, utilisateurs, revenus
            </p>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-amber-600" />
        </Link>
      )}

      {/* ── Profil ── */}
      <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm sm:rounded-2xl">
        <div className="flex items-start gap-2.5 border-b border-slate-50 px-4 py-3.5 sm:gap-3 sm:px-5 sm:py-4">
          <UserRound className="mt-0.5 h-4 w-4 text-indigo-600 sm:h-5 sm:w-5" />
          <div>
            <h2 className="text-[13px] font-semibold text-slate-900 sm:text-sm">
              Profil professionnel
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
              Ces informations orientent le contexte de vos recommandations.
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <SettingsProfileForm
            firstName={profile?.first_name || ''}
            lastName={profile?.last_name || ''}
            phone={profile?.phone || ''}
            currency={currency}
          />
        </div>
      </section>

      {/* ── Formule & facturation ── */}
      <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm sm:rounded-2xl">
        <div className="flex items-start gap-2.5 border-b border-slate-50 px-4 py-3.5 sm:gap-3 sm:px-5 sm:py-4">
          <CreditCard className="mt-0.5 h-4 w-4 text-indigo-600 sm:h-5 sm:w-5" />
          <div>
            <h2 className="text-[13px] font-semibold text-slate-900 sm:text-sm">
              Formule & facturation
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
              Détails de votre abonnement en cours.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <dl className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[11px] text-slate-500 sm:text-xs">Plan actuel</dt>
              <dd className="text-[12px] font-semibold text-slate-900 sm:text-sm">
                {planNames[plan]}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[11px] text-slate-500 sm:text-xs">Crédits disponibles</dt>
              <dd className="text-[12px] font-semibold text-slate-900 sm:text-sm">
                {profile?.credits_balance ?? 0}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[11px] text-slate-500 sm:text-xs">Devise</dt>
              <dd className="text-[12px] font-semibold text-slate-900 sm:text-sm">
                {currency} ({currencySymbol})
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[11px] text-slate-500 sm:text-xs">Date d&apos;expiration</dt>
              <dd className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-900 sm:text-sm">
                {hasExpiry ? (
                  <>
                    <CalendarClock className="h-3 w-3 text-slate-400 sm:h-3.5 sm:w-3.5" />
                    {formatDate(expiresAt)}
                  </>
                ) : (
                  <span className="text-slate-400">
                    {isDemo ? 'Démo (sans expiration)' : '—'}
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href="/dashboard/pricing"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-indigo-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-indigo-700 sm:text-xs"
            >
              {isDemo ? 'Passer à un plan payant' : 'Gérer ma formule'}
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Link>
            <Link
              href="/dashboard/credits/recharge"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-slate-200 px-4 text-[11px] font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:text-xs"
            >
              Recharger des crédits
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sécurité + Parrainage ── */}
      <section className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 sm:h-10 sm:w-10">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[13px] font-semibold text-slate-900 sm:text-sm">
                Sécurité du compte
              </h2>
              <p className="mt-0.5 break-all text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
                {user.email}
              </p>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-500 sm:mt-3 sm:text-[11px]">
                L&apos;adresse e-mail sert à la connexion. Utilisez le lien sécurisé pour renouveler votre mot de passe.
              </p>
              <Link
                href="/forgot-password"
                className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-[11px] font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:mt-4 sm:min-h-10 sm:gap-2 sm:px-4 sm:text-xs"
              >
                <KeyRound className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Réinitialiser le mot de passe
              </Link>
            </div>
          </div>
        </article>

        <ReferralCard
          code={profile?.referral_code || null}
          count={profile?.referral_count ?? 0}
        />
      </section>

      {/* ── Support ── */}
      <section className="flex flex-col gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-2xl sm:p-5">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm sm:h-10 sm:w-10">
            <LifeBuoy className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div>
            <h2 className="text-[13px] font-semibold text-slate-900 sm:text-sm">
              Besoin d&apos;assistance ?
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-600 sm:mt-1 sm:text-xs">
              Notre équipe peut vous aider sur le compte, les crédits et les paiements.
            </p>
          </div>
        </div>
        <a
          href="https://t.me/MakeitAds_CEO"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-[11px] font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:min-h-10 sm:px-5 sm:text-xs"
        >
          Contacter le support
        </a>
      </section>
    </div>
  );
}