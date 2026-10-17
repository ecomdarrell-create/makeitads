'use client';

import { Suspense, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Headset } from 'lucide-react'; // ✅ Headset ajouté
import { AuthPasswordField } from '@/components/auth/AuthPasswordField';
import { PhoneInput, isValidPhoneNumber } from '@/components/auth/PhoneInput';

function InfoBadge({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="Plus d'informations"
        className="ml-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-[9px] font-bold text-slate-500 transition-colors hover:border-[#6366F1] hover:bg-[#6366F1]/10 hover:text-[#6366F1]"
      >
        !
      </button>
      {open && (
        <span className="absolute left-6 top-1/2 z-20 w-[240px] -translate-y-1/2 rounded-lg border border-slate-200 bg-white p-2.5 text-[10px] leading-relaxed text-slate-600 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    currency: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checking, setChecking] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const referralCode = searchParams.get('ref') || null;

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
    if (!formData.phone.trim() || !isValidPhoneNumber(formData.phone)) {
      setError("Numéro de téléphone invalide. N'oubliez pas l'indicatif du pays (ex : 237, 225, 33…).");
      setLoading(false);
      return;
    }
    if (!formData.currency) {
      setError('Merci de sélectionner la devise de votre pays.');
      setLoading(false);
      return;
    }

    const cleanPhone = formData.phone.trim() ? '+' + formData.phone.replace(/\D/g, '') : null;

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
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
        const msg = error.message.toLowerCase();
        if (msg.includes('already registered') || msg.includes('already been registered')) {
          setError('Cet email est déjà utilisé. Connectez-vous à la place.');
        } else if (msg.includes('rate limit')) {
          setError('Trop de tentatives. Patientez quelques minutes et réessayez.');
        } else if (msg.includes('password')) {
          setError('Mot de passe trop faible. Utilisez au moins 6 caractères.');
        } else if (msg.includes('email')) {
          setError('Adresse email invalide. Vérifiez et réessayez.');
        } else {
          setError('Impossible de créer votre compte. Vérifiez vos informations et réessayez.');
        }
        setLoading(false);
        return;
      }

      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setError('Cet email est déjà utilisé. Connectez-vous plutôt via la page de connexion.');
        setLoading(false);
        return;
      }

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

      if (cleanPhone && data.user?.id) {
        try {
          await supabase.from('profiles').update({ phone: cleanPhone }).eq('id', data.user.id);
        } catch (phoneError) {
          console.warn('Erreur enregistrement téléphone:', phoneError);
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = redirectTo;
        return;
      }

      setEmailSent(true);
      setLoading(false);
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

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#eef2ff,_#f8fafc_52%,_#ffffff)] px-4 py-6">
        <div className="w-full max-w-[420px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-7"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <Mail className="h-7 w-7 text-emerald-600" />
            </div>
            <h1 className="mb-2 text-lg font-semibold text-slate-900 sm:text-xl">Vérifiez votre email</h1>
            <p className="mb-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
              Un lien de confirmation a été envoyé à <strong className="break-all text-slate-900">{formData.email}</strong>.<br />
              Cliquez sur le lien pour activer votre compte.
            </p>
            <p className="mb-5 text-[10px] text-slate-500 sm:text-[11px]">
              Vous ne recevez rien ? Vérifiez vos spams ou réessayez dans 2 minutes.
            </p>
            <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-[#6366F1] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#6366f1]/20 transition-all hover:bg-[#5558e6] sm:text-sm">
              Aller à la connexion
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#eef2ff,_#f8fafc_52%,_#ffffff)] px-4 py-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-4 text-center">
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">
            <span className="text-[#111827]">MakeIt</span><span className="text-[#6366F1]">Ads</span>
          </h1>
          <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            La plateforme N°1 pour automatiser votre acquisition client en Afrique.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="mb-4">
            <h2 className="mb-0.5 text-lg font-semibold text-slate-900 sm:text-xl">Créer votre compte</h2>
            <p className="text-[11px] text-slate-600 sm:text-xs">Commencez à construire de meilleures stratégies publicitaires.</p>
          </div>

          {referralCode && (
            <div className="mb-3 rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/5 p-2.5">
              <p className="text-[10px] font-medium text-[#6366F1] sm:text-[11px]">Vous avez été invité par un membre MakeItAds</p>
              <p className="mt-0.5 text-[9px] text-slate-600 sm:text-[10px]">Votre parrain recevra un bonus dès votre premier paiement.</p>
            </div>
          )}

          {error && (
            <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-[11px] text-red-700 sm:text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-[11px] font-medium text-gray-700 sm:text-xs">Prénom</label>
                <input id="firstName" type="text" required value={formData.firstName} onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))} className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm" placeholder="Jean" />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-[11px] font-medium text-gray-700 sm:text-xs">Nom</label>
                <input id="lastName" type="text" required value={formData.lastName} onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))} className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm" placeholder="Dupont" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-[11px] font-medium text-gray-700 sm:text-xs">Email</label>
              <input id="email" type="email" required value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm" placeholder="vous@exemple.com" />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 flex items-center text-[11px] font-medium text-gray-700 sm:text-xs">
                Téléphone
                <InfoBadge text="Nous utilisons votre numéro pour sécuriser votre compte et vous prévenir en cas d'activité inhabituelle. N'oubliez pas de mettre l'indicatif de votre pays (ex : 237, 225, 33…)." />
              </label>
              <PhoneInput id="phone" value={formData.phone} onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))} />
              <p className="mt-1 text-[9px] leading-relaxed text-slate-500 sm:text-[10px]">Indispensable : indicatif du pays + numéro complet.</p>
            </div>

            <div>
              <AuthPasswordField id="password" label="Mot de passe" value={formData.password} onChange={(password) => setFormData((prev) => ({ ...prev, password }))} autoComplete="new-password" />
            </div>

            <div>
              <AuthPasswordField id="confirmPassword" label="Confirmer le mot de passe" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
            </div>

            <div>
              <label htmlFor="currency" className="mb-1 flex items-center text-[11px] font-medium text-gray-700 sm:text-xs">
                Quelle est la devise de votre pays ?
                <InfoBadge text="La devise nous permet d'afficher tous les prix de la plateforme (crédits, plans, packs) dans votre monnaie locale. Vous pourrez la modifier plus tard dans vos paramètres." />
              </label>
              <select id="currency" required value={formData.currency} onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))} className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm">
                <option value="" disabled>Sélectionnez votre devise…</option>
                <option value="XAF">Franc CFA CEMAC (XAF) — Cameroun, Gabon, Congo…</option>
                <option value="XOF">Franc CFA UEMOA (XOF) — Sénégal, Côte d'Ivoire, Mali…</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar US (USD)</option>
              </select>
            </div>

            {/* ✅ BOUTON PRINCIPAL */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              {loading ? 'Création de votre compte...' : 'Créer mon compte'}
            </button>

            {/* ✅ NOUVEAU BOUTON SUPPORT (Design Premium) */}
            <Link
              href="mailto:support@makeitads.pro"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:border-[#6366F1] hover:bg-[#6366F1]/5 hover:text-[#6366F1] sm:text-sm"
            >
              <Headset className="h-4 w-4" />
              Contacter le support
            </Link>
          </form>

          <div className="mt-5 text-center">
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