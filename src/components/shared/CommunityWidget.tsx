'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertTriangle, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { PhoneInput, isValidPhoneNumber } from '@/components/auth/PhoneInput';

const NEW_USER_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export default function CommunityWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [widgetDelay, setWidgetDelay] = useState(2);
  const [ready, setReady] = useState(false);

  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }, []);

  const hideOnPaths = ['/login', '/signup', '/sign-up', '/auth'];
  const shouldHide = hideOnPaths.some((p) => pathname.startsWith(p));

  const refreshStatus = useCallback(async () => {
    if (shouldHide) return;

    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    // ✅ PAS DE WIDGET POUR LES ANONYMES
    // On a besoin du prénom pour personnaliser → visiteur non connecté = pas de popup
    if (!user) {
      setIsAdmin(false);
      setFirstName(null);
      setShowWidget(false);
      setReady(true);
      return;
    }

    // ✅ Détecter un nouvel inscrit → popup rapide
    const isNewUser = user.created_at
      ? new Date(user.created_at).getTime() > Date.now() - NEW_USER_WINDOW_MS
      : false;
    setWidgetDelay(isNewUser ? 0.3 : 2);

    // Lecture du profil
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_joined_telegram, first_name')
      .eq('id', user.id)
      .maybeSingle();

    // ✅ FIX PRÉNOM : fallback sur user_metadata si le profil est vide
    const metaFirst =
      (user.user_metadata?.first_name as string | undefined) ||
      (user.user_metadata?.firstName as string | undefined) ||
      null;
    const cleanFirst = (profile?.first_name || metaFirst || '').trim();
    setFirstName(cleanFirst || null);

    const admin = user.email === 'ecomdarrell@gmail.com';
    setIsAdmin(admin);

    if (admin) {
      setShowWidget(true);
    } else {
      setShowWidget(profile?.has_joined_telegram !== true);
    }
    setReady(true);
  }, [shouldHide, getSupabase]);

  useEffect(() => {
    refreshStatus();
  }, [pathname, refreshStatus]);

  useEffect(() => {
    if (shouldHide) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshStatus();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshStatus, shouldHide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('Veuillez accepter les conditions.');
      return;
    }
    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Numéro invalide. N'oubliez pas l'indicatif (ex: +237).");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/community-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          firstName: firstName || 'Client',
          consent: true,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");

      const data = await response.json();
      const serverConfirmed = data?.hasJoinedTelegram === true;

      if (!serverConfirmed && !isAdmin) {
        console.error('[CommunityWidget] API OK mais has_joined_telegram non persisté.');
        setError(
          "Ta demande a bien été enregistrée, mais la validation n'a pas pu être confirmée. Réessaie dans un instant."
        );
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        if (!isAdmin) setShowWidget(false);
      }, 3000);
    } catch (err) {
      console.error('🚨 handleSubmit error:', err);
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  if (shouldHide || !ready || !showWidget) return null;

  const benefits = [
    'Conseils publicitaires pour créer des campagnes efficaces.',
    'Ressources exclusives : guides, astuces et contenus.',
    'Stratégies marketing pour attirer plus de clients.',
    "Communauté d'entrepreneurs pour échanger et progresser.",
  ];

  return (
    <>
      {/* BOUTON FLOTTANT — safe-area iPhone PWA + délai adaptatif */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: widgetDelay }}
        onClick={() => setIsOpen(true)}
        className="fixed right-4 z-[90] flex h-[60px] w-[60px] items-center justify-center md:right-8 md:h-[64px] md:w-[64px]"
        style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
        aria-label="Rejoindre la communauté MakeItAds"
      >
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full shadow-[0_8px_30px_rgba(99,102,241,0.25)] ring-1 ring-slate-200/50 bg-white">
          <Image
            src="/logos/community-icon.png"
            alt="MakeItAds"
            fill
            unoptimized
            className="object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md ring-2 ring-white z-10">1</span>
        </span>
      </motion.button>

      {/* POPUP */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[370px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 z-10 text-slate-400 hover:text-slate-600"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-5 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full">
                  <Image src="/logos/community-icon.png" alt="Logo" width={48} height={48} className="object-contain" unoptimized />
                </div>

                {/* ✅ TITRE avec prénom réel (fallback metadata) */}
                <h2 className="mb-2 text-[17px] font-bold text-[#0F172A] leading-tight">
                  {firstName ? `${firstName}, rejoignez le ` : 'Rejoignez le '}
                  <span className="text-black">MakeIt</span>
                  <span className="text-[#7C3AED]">Ads</span> Business Club.
                </h2>

                {/* ✅ Phrase d'accroche en violet fort */}
                <p className="text-[13px] font-bold text-[#7C3AED] mb-2 leading-snug">
                  Ne développez plus votre activité au hasard.
                </p>

                {/* ✅ Mots-clés violet fort */}
                <p className="text-[11px] text-slate-500 mb-4 leading-snug">
                  Rejoignez{' '}
                  <strong className="text-[#7C3AED] font-bold">gratuitement</strong>{' '}
                  notre communauté{' '}
                  <strong className="text-[#7C3AED] font-bold">Telegram</strong>{' '}
                  et accédez à des ressources pour mieux comprendre la publicité,
                  attirer des clients et faire grandir votre business.
                </p>

                {success ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mt-2">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                    <p className="text-sm font-semibold text-emerald-800">Demande envoyée !</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 text-left">
                    <div className="space-y-1.5 mb-2">
                      {benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-[#6366F1] shrink-0 mt-0.5" />
                          <span className="text-[10px] text-slate-600 leading-tight">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-700">
                        Numéro WhatsApp *
                      </label>
                      <PhoneInput
                        id="widget-phone"
                        value={phone}
                        onChange={setPhone}
                        placeholder="237 XXXXXXXXX"
                      />
                    </div>

                    <label className="flex cursor-pointer items-start gap-1.5 text-[10px] text-slate-500 leading-tight">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]"
                      />
                      <span>J'accepte que MakeItAds utilise mon numéro pour me transmettre mon invitation.</span>
                    </label>

                    {error && (
                      <div className="flex items-center gap-1.5 rounded-lg bg-red-50 p-1.5 text-[10px] text-red-600">
                        <AlertTriangle className="h-3 w-3 shrink-0" /> {error}
                      </div>
                    )}

                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6366F1] py-1.5 text-[11.5px] font-semibold text-white hover:bg-[#5558e6] disabled:opacity-50 transition-colors sm:py-2.5 sm:text-[13px]"
                      >
                        {loading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          'Recevoir mon invitation'
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full rounded-full border border-slate-200 bg-white py-1.5 text-[10.5px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors sm:py-2 sm:text-[11.5px]"
                      >
                        Plus tard
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}