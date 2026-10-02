'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
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
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold tracking-tight">
            <span className="text-[#111827]">MakeIt</span>
            <span className="text-[#6366F1]">Ads</span>
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-[#111827] mb-1">Bienvenue sur MakeItAds</h2>
            <p className="text-sm text-gray-600">Connectez-vous à votre espace marketing.</p>
          </div>

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
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                placeholder="vous@exemple.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
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
              className="w-full py-2.5 px-4 bg-[#6366F1] text-white text-sm font-medium rounded hover:bg-[#5558e6] focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas encore de compte ?{' '}
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