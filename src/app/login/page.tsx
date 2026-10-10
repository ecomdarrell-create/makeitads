'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { AuthPasswordField } from '@/components/auth/AuthPasswordField';
import { AuthProviderButtons } from '@/components/auth/AuthProviderButtons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) await new Promise((resolve) => setTimeout(resolve, 300));
      window.location.href = '/dashboard';
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

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
              Bienvenue sur <span className="text-[#111827]">MakeIt</span><span className="text-[#6366F1]">Ads</span>
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
              <label htmlFor="email" className="mb-1 block text-[11px] font-medium text-gray-700 sm:text-xs">
                Email
              </label>
              <input
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
              <Link href="/forgot-password" className="text-[11px] text-gray-600 hover:text-[#6366F1] sm:text-xs">
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

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600 sm:text-sm">
              Vous n&apos;avez pas encore de compte ?{' '}
              <Link href="/signup" className="font-medium text-[#6366F1] hover:text-[#5558e6]">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}