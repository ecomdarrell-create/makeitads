'use client';

import { Suspense, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthPasswordField } from '@/components/auth/AuthPasswordField';
import { AuthProviderButtons } from '@/components/auth/AuthProviderButtons';
import { PhoneInput } from '@/components/auth/PhoneInput';

function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    currency: 'XOF',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checking, setChecking] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const referralCode = searchParams.get('ref') || null;

  // ✅ Rediriger si déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(redirectTo);
        return;
      }
      setChecking(false);
    };
    checkSession();
  }, [router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }
    if (formData.password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    const cleanPhone = formData.phone.trim()
      ? '+' + formData.phone.replace(/\D/g, '')
      : null;

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: cleanPhone,
            currency: formData.currency,
            plan_type: 'free',
            credits_balance: 10,
          },
        },
      });

      if (error) {
        setError('Impossible de créer votre compte. Vérifiez vos informations et réessayez.');
        setLoading(false);
        return;
      }

      // ✅ Détection : email déjà utilisé (Supabase renvoie identities vide)
      if (
        data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        setError(
          'Cet email est déjà utilisé. Connectez-vous plutôt via la page de connexion.'
        );
        setLoading(false);
        return;
      }

      // Traitement parrainage
      if (referralCode && data.user?.id) {
        try {
          await fetch('/api/referral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referral_code: referralCode, referee_id: data.user.id }),
          });
        } catch (refError) {
          console.warn('Erreur parrainage:', refError);
        }
      }

      // Enregistrer téléphone dans profile
      if (cleanPhone && data.user?.id) {
        try {
          await supabase.from('profiles').update({ phone: cleanPhone }).eq('id', data.user.id);
        } catch (phoneError) {
          console.warn('Erreur enregistrement téléphone:', phoneError);
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) await new Promise((resolve) => setTimeout(resolve, 300));
      window.location.href = redirectTo;
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#eef2ff,_#f8fafc_52%,_#ffffff)] px-4 py-6">
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-5 w-3/4 rounded bg-slate-100" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
              <div className="h-10 rounded-xl bg-slate-100" />
              <div className="h-10 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#eef2ff,_#f8fafc_52%,_#ffffff)] px-4 py-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-4 text-center">
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">
            <span className="text-[#111827]">MakeIt</span>
            <span className="text-[#6366F1]">Ads</span>
          </h1>
          <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            La plateforme N°1 pour automatiser votre acquisition client en Afrique.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="mb-4">
            <h2 className="mb-0.5 text-lg font-semibold text-slate-900 sm:text-xl">
              Créer votre compte
            </h2>
            <p className="text-[11px] text-slate-600 sm:text-xs">
              Commencez à construire de meilleures stratégies publicitaires.
            </p>
          </div>

          {referralCode && (
            <div className="mb-3 rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/5 p-2.5">
              <p className="text-[10px] font-medium text-[#6366F1] sm:text-[11px]">
                🎁 Tu as été invité par un membre MakeItAds
              </p>
              <p className="mt-0.5 text-[9px] text-slate-600 sm:text-[10px]">
                Ton parrain recevra un bonus dès ton inscription.
              </p>
            </div>
          )}

          <AuthProviderButtons />

          <div className="my-3.5 flex items-center gap-3 text-[9px] text-slate-400 sm:text-[10px]">
            <span className="h-px flex-1 bg-slate-100" />
            OU AVEC VOTRE EMAIL
            <span className="h-px flex-1 bg-slate-100" />
          </div>

          {error && (
            <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-[11px] text-red-700 sm:text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-[11px] font-medium text-gray-700 sm:text-xs">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-[11px] font-medium text-gray-700 sm:text-xs">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-[11px] font-medium text-gray-700 sm:text-xs">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
                placeholder="vous@exemple.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-[11px] font-medium text-gray-700 sm:text-xs">
                Téléphone
              </label>
              <PhoneInput
                id="phone"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
              />
              <p className="mt-1 text-[9px] leading-relaxed text-slate-500 sm:text-[10px]">
                Uniquement pour les informations importantes. Jamais de spam.
              </p>
            </div>

            <div>
              <AuthPasswordField
                id="password"
                label="Mot de passe"
                value={formData.password}
                onChange={(password) => setFormData({ ...formData, password })}
                autoComplete="new-password"
              />
            </div>

            <div>
              <AuthPasswordField
                id="confirmPassword"
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="currency" className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-700 sm:text-xs">
                Votre devise
              </label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
              >
                <option value="XOF">Franc CFA (XAF / XOF)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar US (USD)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              {loading ? 'Création de votre compte...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600 sm:text-sm">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="font-medium text-[#6366F1] hover:text-[#5558e6]">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#eef2ff,_#f8fafc_52%,_#ffffff)] px-4 py-6">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-5 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupSkeleton />}>
      <SignupForm />
    </Suspense>
  );
}