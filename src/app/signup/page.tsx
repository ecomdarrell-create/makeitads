'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthPasswordField } from '@/components/auth/AuthPasswordField';
import { AuthProviderButtons } from '@/components/auth/AuthProviderButtons';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    currency: 'XOF',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer la destination après inscription (passée par le middleware)
  const redirectTo = searchParams.get('redirect') || '/dashboard';

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

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            currency: formData.currency,
            plan_type: 'free',
            credits_balance: 10,
          },
        },
      });

      if (error) {
        setError('Impossible de créer votre compte. Vérifiez vos informations et réessayez.');
        setLoading(false);
      } else {
        // ✅ Redirection vers la destination initiale (ou dashboard par défaut)
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#eef2ff,_#f8fafc_52%,_#ffffff)] px-4 py-7">
      <div className="w-full max-w-[440px]">
        
        {/* Logo et Slogan */}
        <div className="mb-5 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            <span className="text-[#111827]">MakeIt</span>
            <span className="text-[#6366F1]">Ads</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
            La plateforme N°1 pour automatiser votre acquisition client en Afrique.
          </p>
        </div>

        {/* Carte du formulaire */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-7">
          <div className="mb-5">
            <h2 className="mb-1 text-xl font-semibold text-slate-900">Créer votre compte</h2>
            <p className="text-xs text-slate-600">Commencez à construire de meilleures stratégies publicitaires.</p>
          </div>

          <AuthProviderButtons />
          
          <div className="my-4 flex items-center gap-3 text-[10px] text-slate-400">
            <span className="h-px flex-1 bg-slate-100" />
            OU AVEC VOTRE EMAIL
            <span className="h-px flex-1 bg-slate-100" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
                <input 
                  id="firstName" 
                  type="text" 
                  required 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                  className="min-h-11 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
                  placeholder="Jean" 
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                <input 
                  id="lastName" 
                  type="text" 
                  required 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                  className="min-h-11 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
                  placeholder="Dupont" 
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input 
                id="email" 
                type="email" 
                required 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="min-h-11 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
                placeholder="vous@exemple.com" 
              />
            </div>

            {/* Mot de passe */}
            <div>
              <AuthPasswordField 
                id="password" 
                label="Mot de passe" 
                value={formData.password} 
                onChange={(password) => setFormData({ ...formData, password })} 
                autoComplete="new-password" 
              />
            </div>

            {/* Confirmation Mot de passe */}
            <div>
              <AuthPasswordField 
                id="confirmPassword" 
                label="Confirmer le mot de passe" 
                value={confirmPassword} 
                onChange={setConfirmPassword} 
                autoComplete="new-password" 
              />
            </div>

            {/* Devise */}
            <div>
              <label htmlFor="currency" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                VOTRE DEVISE
              </label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="XOF">Franc CFA (XAF / XOF)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar US (USD)</option>
              </select>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Création de votre compte...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Lien vers la connexion */}
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