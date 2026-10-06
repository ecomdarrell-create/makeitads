'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthPasswordField } from '@/components/auth/AuthPasswordField';
import { AuthProviderButtons } from '@/components/auth/AuthProviderButtons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('Email ou mot de passe incorrect. Veuillez réessayer.');
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#eef2ff,_#f8fafc_52%,_#ffffff)] px-4 py-7">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-5 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            <span className="text-[#111827]">MakeIt</span>
            <span className="text-[#6366F1]">Ads</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-500">La plateforme N°1 pour automatiser votre acquisition client en Afrique.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-7">
          <div className="mb-5">
            <h2 className="mb-1 text-xl font-semibold text-slate-900">Bienvenue sur MakeItAds</h2>
            <p className="text-xs text-slate-600">Connectez-vous à votre espace marketing.</p>
          </div>

          <AuthProviderButtons />
          <div className="my-4 flex items-center gap-3 text-[10px] text-slate-400"><span className="h-px flex-1 bg-slate-100" />OU AVEC VOTRE EMAIL<span className="h-px flex-1 bg-slate-100" /></div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              <Link href="/forgot-password" className="text-xs text-gray-600 hover:text-[#6366F1]">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Vous n&apos;avez pas encore de compte ?{' '}
              <Link href="/signup" className="text-[#6366F1] hover:text-[#5558e6] font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}