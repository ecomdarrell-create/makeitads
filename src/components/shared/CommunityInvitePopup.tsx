'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Users,
  BookOpen,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';

interface CommunityInvitePopupProps {
  firstName?: string;
  onSuccess: () => void;
  onClose: () => void;
}

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Visibilité business',
    description: 'Présentez votre activité à la communauté',
  },
  {
    icon: MessageCircle,
    title: 'Contact direct fondateur',
    description: 'Échangez directement avec Darrell',
  },
  {
    icon: Users,
    title: 'Collaborations premium',
    description: 'Rencontrez d\'autres entrepreneurs',
  },
  {
    icon: BookOpen,
    title: 'Ressources exclusives',
    description: 'Accédez aux conseils et playbooks',
  },
];

export function CommunityInvitePopup({
  firstName,
  onSuccess,
  onClose,
}: CommunityInvitePopupProps) {
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const displayName = firstName?.trim() || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError('Entrez votre numéro WhatsApp.');
      return;
    }
    if (!consent) {
      setError('Vous devez accepter les conditions.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/community-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          firstName: firstName || null,
          consent: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
        >
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <div className="px-6 pt-10 pb-6 sm:px-8">
            {/* Ligne gradient */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
              className="mx-auto mb-5 h-[3px] w-16 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"
            />

            {/* Badge */}
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-sm">
                <Sparkles className="h-3 w-3" />
                Invitation privée
              </span>
            </div>

            {/* Titre avec prénom */}
            <h1 className="mb-3 text-center text-[24px] font-bold leading-tight tracking-tight text-[#0F172A] sm:text-[26px]">
              {displayName ? (
                <>
                  <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                    {displayName}
                  </span>
                  , votre accès au cercle privé est prêt.
                </>
              ) : (
                <>
                  Votre accès au{' '}
                  <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                    cercle privé
                  </span>{' '}
                  est prêt.
                </>
              )}
            </h1>

            <p className="mb-6 text-center text-[13px] leading-relaxed text-slate-500">
              Rejoignez gratuitement la communauté MakeItAds et développez votre
              réseau d&apos;entrepreneurs.
            </p>

            {/* Cartes bénéfices */}
            <div className="mb-6 space-y-2">
              {BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10">
                      <Icon className="h-4 w-4 text-[#6366F1]" strokeWidth={2.4} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-[#0F172A]">
                        {benefit.title}
                      </p>
                      <p className="text-[11px] leading-tight text-slate-500">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-6 w-6 text-emerald-600" strokeWidth={3} />
                </div>
                <p className="text-[14px] font-semibold text-emerald-900">
                  Demande envoyée !
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-emerald-700">
                  Notre équipe vous contactera très vite sur WhatsApp.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="block text-[12px] font-semibold text-[#0F172A]">
                  Où vous envoyer votre invitation ?
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+237 6 00 00 00 00"
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[14px] font-medium text-[#0F172A] outline-none transition-all placeholder:text-slate-300 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10"
                />

                <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-relaxed text-slate-500">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
                  />
                  <span>
                    J&apos;accepte que MakeItAds utilise mon numéro pour me
                    transmettre l&apos;invitation demandée.
                  </span>
                </label>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-6 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-[#6366F1]/25 transition-all hover:shadow-xl hover:shadow-[#6366F1]/30 disabled:opacity-60"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Recevoir mon invitation
                      </>
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-center text-[12px] font-medium text-slate-400 transition-colors hover:text-slate-600"
                >
                  Non merci, continuer ma visite
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}