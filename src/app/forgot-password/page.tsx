'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.includes('@')) {
      setError('Veuillez saisir une adresse email valide.');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError('Impossible d’envoyer le lien de réinitialisation. Vérifiez votre email.');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#eef2ff,_#f8fafc_52%,_#ffffff)] px-4 py-6">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="mb-4 text-center">
          <Link href="/" className="inline-flex items-center">
            <span className="text-base font-semibold tracking-tight sm:text-lg">
              <span className="text-[#111827]">MakeIt</span>
              <span className="text-[#6366F1]">Ads</span>
            </span>
          </Link>
          <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            La plateforme N°1 pour automatiser votre acquisition client en Afrique.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">

          {!success ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#6366F1]/10">
                  <ShieldCheck className="h-5 w-5 text-[#6366F1]" />
                </div>
                <h1 className="mb-1 text-lg font-semibold text-slate-900 sm:text-xl">
                  Mot de passe oublié ?
                </h1>
                <p className="text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                  Pas de panique. Saisissez votre email et nous vous enverrons un lien sécurisé pour en créer un nouveau.
                </p>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-700 sm:text-xs"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="email" className="mb-1 block text-[11px] font-medium text-gray-700 sm:text-xs">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="vous@exemple.com"
                      className="min-h-10 w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                >
                  {loading ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="mb-1 text-lg font-semibold text-slate-900 sm:text-xl">
                Email envoyé
              </h2>
              <p className="mb-4 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                Nous avons envoyé un lien de réinitialisation à{' '}
                <strong className="text-slate-900 break-all">{email}</strong>.
                Vérifiez votre boîte de réception et vos spams.
              </p>
              <p className="mb-5 text-[10px] text-slate-500 sm:text-[11px]">
                Vous ne recevez rien ? Patientez 1 à 2 minutes puis réessayez.
              </p>
            </motion.div>
          )}

          {/* Lien retour */}
          <div className="mt-5 border-t border-slate-100 pt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#6366F1] transition-colors hover:text-[#5558e6] sm:text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à la connexion
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-[10px] text-slate-400 sm:text-[11px]">
          Un souci ? Contactez-nous à{' '}
          <a href="mailto:support@makeitads.pro" className="font-medium text-[#6366F1] hover:underline">
            support@makeitads.pro
          </a>
        </p>
      </div>
    </div>
  );
}