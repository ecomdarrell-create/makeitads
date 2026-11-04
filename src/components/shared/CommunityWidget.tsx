'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { PhoneInput } from '@/components/auth/PhoneInput'; // ✅ IMPORT DE TON COMPOSANT

export default function CommunityWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const hideOnPaths = ['/login', '/signup', '/sign-up', '/auth'];
  const shouldHide = hideOnPaths.some((p) => pathname.startsWith(p));

  useEffect(() => {
    const checkStatus = async () => {
      if (shouldHide) return;

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('has_joined_telegram, first_name')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setFirstName(profile.first_name);
          if (!profile.has_joined_telegram) {
            setShowWidget(true);
          }
        } else {
          setShowWidget(true);
        }
      } else {
        setShowWidget(false);
      }
    };

    checkStatus();
  }, [pathname, shouldHide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !consent) {
      setError('Veuillez remplir votre numéro et accepter les conditions.');
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

      if (!response.ok) throw new Error('Erreur lors de l\'envoi');

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setShowWidget(false);
      }, 3000);

    } catch (err) {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  if (shouldHide || !showWidget) return null;

  return (
    <>
      {/* ✅ BOUTON FLOTTANT (Chemin de ton image respecté) */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 2 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-[90] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgba(99,102,241,0.25)] border border-slate-100 md:bottom-8 md:right-8 md:h-[64px] md:w-[64px] animate-pulse-slow overflow-hidden"
        aria-label="Rejoindre la communauté MakeItAds"
      >
        <div className="relative h-full w-full p-2">
          <Image 
            src="/logos/community-icon.png" 
            alt="MakeItAds" 
            fill
            className="object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        {/* Point violet discret (pas de chiffre fictif) */}
        <span className="absolute top-1 right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8B5CF6]"></span>
        </span>
      </motion.button>

      {/* ✅ POPUP PREMIUM */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[420px] overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 z-10 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 sm:p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 overflow-hidden">
                  <Image src="/logos/community-icon.png" alt="Logo" width={32} height={32} className="object-contain" />
                </div>
                
                <span className="inline-block mb-3 rounded-full bg-[#6366F1]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6366F1]">
                  Communauté Privée
                </span>

                <h2 className="mb-2 text-xl font-bold text-[#0F172A]">
                  {firstName ? `${firstName}, rejoignez notre cercle privé.` : 'Rejoignez notre cercle privé.'}
                </h2>
                
                <p className="mb-6 text-sm text-slate-500 leading-relaxed">
                  La plateforme N°1 pour automatiser votre acquisition client en Afrique. Accédez à des conseils exclusifs et des ressources pour structurer votre croissance.
                </p>

                {success ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                    <p className="text-sm font-semibold text-emerald-800">Demande envoyée !</p>
                    <p className="text-xs text-emerald-600 mt-1">Notre équipe vous contactera très vite sur WhatsApp.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Votre numéro WhatsApp</label>
                      {/* ✅ INTÉGRATION DE TON COMPOSANT PhoneInput */}
                      <PhoneInput
                        id="widget-phone"
                        value={phone}
                        onChange={setPhone}
                        placeholder="6XX XX XX XX"
                      />
                    </div>

                    <label className="flex cursor-pointer items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]"
                      />
                      <span>J'accepte que MakeItAds utilise mon numéro pour traiter ma demande et me transmettre mon invitation.</span>
                    </label>

                    {error && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2 text-[11px] text-red-600">
                        <AlertTriangle className="h-3 w-3 shrink-0" /> {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6366F1] py-3 text-sm font-semibold text-white hover:bg-[#5558e6] disabled:opacity-50 transition-colors"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Recevoir mon invitation'}
                    </button>
                    
                    <p className="text-center text-[10px] text-slate-400 mt-2">
                      Vos informations sont utilisées uniquement dans le cadre de votre demande.
                    </p>
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