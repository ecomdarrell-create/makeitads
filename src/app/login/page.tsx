'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Headset } from 'lucide-react';
import { AuthPasswordField } from '@/components/auth/AuthPasswordField';
import { AuthProviderButtons } from '@/components/auth/AuthProviderButtons';
import { PasskeyLoginButton } from '@/components/auth/PasskeyLoginButton';
import { PasskeySetupPrompt } from '@/components/auth/PasskeySetupPrompt';
import {
  isPlatformAuthenticatorAvailable,
  getPasskeyLabel,
  type PasskeyLabel,
} from '@/lib/passkey/detect';
import { registerPasskey, listPasskeys, isPasskeyApiAvailable } from '@/lib/passkey/client';
import { getPasskeyErrorMessage } from '@/lib/passkey/errors';

const PASSKEY_PROMPT_DISMISSED_KEY = 'makeitads_passkey_prompt_dismissed_until';
const PROMPT_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [redirectTo, setRedirectTo] = useState('/dashboard');
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);

  // Prompt Passkey post-login classique
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState('');
  const [passkeyLabel, setPasskeyLabel] = useState<PasskeyLabel>({
    label: 'la biométrie',
    icon: 'fingerprint',
  });
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  // ✅ Lit le param `redirect`
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('redirect');
      if (r && r.startsWith('/') && !r.startsWith('//')) {
        setRedirectTo(r);
      }
    }
  }, []);

  // ✅ Vérifie la session au mount
  useEffect(() => {
    let cancelled = false;
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        router.replace(redirectTo);
        return;
      }
      setChecking(false);
    };
    checkSession();
    return () => {
      cancelled = true;
    };
  }, [router, redirectTo]);

  /** Redirige vers la destination (avec refresh serveur préalable). */
  const goToDestination = (destination: string) => {
    router.refresh();
    window.location.href = destination;
  };

  /** Vérifie si l'on doit proposer l'enregistrement d'une passkey après login. */
  const shouldPromptPasskeySetup = async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') return false;
      const dismissedUntil = Number(localStorage.getItem(PASSKEY_PROMPT_DISMISSED_KEY) || 0);
      if (dismissedUntil > Date.now()) return false;

      const biometricOk = await isPlatformAuthenticatorAvailable();
      if (!biometricOk) return false;

      const supabase = createClient();
      if (!isPasskeyApiAvailable(supabase)) return false;
      const existing = await listPasskeys(supabase);
      if (existing.length > 0) return false;

      setPasskeyLabel(getPasskeyLabel());
      return true;
    } catch {
      // En cas d'erreur de lecture, on ne dérange pas l'utilisateur
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError('Email ou mot de passe incorrect. Veuillez réessayer.');
        setLoading(false);
        return;
      }

      // ✅ Proposer la passkey après login classique réussi
      const prompt = await shouldPromptPasskeySetup();
      if (prompt) {
        setPendingRedirect(redirectTo);
        setSetupOpen(true);
        setLoading(false);
        return;
      }

      goToDestination(redirectTo);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleSetupAccept = async () => {
    setSetupLoading(true);
    setSetupError('');
    try {
      const supabase = createClient();
      await registerPasskey(supabase);
      setSetupOpen(false);
      goToDestination(pendingRedirect || redirectTo);
    } catch (err) {
      setSetupError(getPasskeyErrorMessage(err));
      setSetupLoading(false);
    }
  };

  const handleSetupDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        PASSKEY_PROMPT_DISMISSED_KEY,
        String(Date.now() + PROMPT_COOLDOWN_MS)
      );
    }
    setSetupOpen(false);
    goToDestination(pendingRedirect || redirectTo);
  };

  const handlePasskeySuccess = () => {
    goToDestination(redirectTo);
  };

  const handleUsePassword = () => {
    // Focus sur le champ email pour reprendre la connexion classique
    setTimeout(() => emailRef.current?.focus(), 50);
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#eef2ff,_#f8fafc_52%,_#ffffff)] px-4 py-6">
        <div className="w-full max-w-[400px]">
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
      <div className="w-full max-w-[400px]">
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
              Bienvenue sur <span className="text-[#111827]">MakeIt</span>
              <span className="text-[#6366F1]">Ads</span>
            </h2>
            <p className="text-[11px] text-slate-600 sm:text-xs">
              Connectez-vous à votre espace marketing.
            </p>
          </div>

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
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-[11px] font-medium text-gray-700 sm:text-xs"
              >
                Email
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
                placeholder="vous@exemple.com"
              />
            </div>

            <div>
              <AuthPasswordField
                id="password"
                label="Mot de passe"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-[11px] text-gray-600 hover:text-[#6366F1] sm:text-xs"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* ✅ Connexion biométrique (affichée uniquement si supportée) */}
          <PasskeyLoginButton
            onSuccess={handlePasskeySuccess}
            onUsePassword={handleUsePassword}
          />

          <Link
            href="mailto:support@makeitads.pro"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:border-[#6366F1] hover:bg-[#6366F1]/5 hover:text-[#6366F1] sm:text-sm"
          >
            <Headset className="h-4 w-4" />
            Contacter le support
          </Link>

          <div className="mt-5 text-center">
            <p className="text-xs text-gray-600 sm:text-sm">
              Vous n&apos;avez pas encore de compte ?{' '}
              <Link href="/signup" className="font-medium text-[#6366F1] hover:text-[#5558e6]">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>

      <PasskeySetupPrompt
        open={setupOpen}
        label={passkeyLabel}
        loading={setupLoading}
        error={setupError}
        onAccept={handleSetupAccept}
        onDismiss={handleSetupDismiss}
      />
    </div>
  );
}