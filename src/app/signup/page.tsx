'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: 'CM',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            country: formData.country,
            plan_type: 'free',
            credits_balance: 10,
          },
        },
      });

      if (error) {
        setError('Impossible de créer votre compte. Vérifiez vos informations et réessayez.');
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-1">Créer votre compte</h2>
            <p className="text-sm text-gray-600">Commencez à construire de meilleures stratégies publicitaires.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">
                Pays
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="CM">Cameroun</option>
                <option value="CI">Côte d'Ivoire</option>
                <option value="SN">Sénégal</option>
                <option value="FR">France</option>
                <option value="US">États-Unis</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#6366F1] text-white text-sm font-medium rounded hover:bg-[#5558e6] focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création de votre compte...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="text-[#6366F1] hover:text-[#5558e6] font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}