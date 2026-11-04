'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertTriangle, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function CommunityWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Pages où le widget est masqué
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
          .select('has_joined_telegram')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile || !profile.has_joined_telegram) {
          setShowWidget(true);
        }
      } else {
        setShowWidget(true);
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
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const response = await fetch('/api/community-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          firstName: user?.user_metadata?.first_name || 'Client',
          consent: true,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi');

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setShowWidget(false); // Le widget disparaît définitivement
      }, 2500);

    } catch (err) {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  if (shouldHide || !showWidget) return null;

  return (
    <>
      {/* ✅ BOUTON FLOTTANT AVEC BADGE */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 2 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgba(99,102,241,0.4)] md:bottom-8 md:right-8 md:h-16 md:w-16 animate-pulse-slow"
        aria-label="Rejoindre la communauté"
      >
        {/* Ton image si elle existe, sinon icône par défaut */}
        <Image 
          src="/images/community-icon.png" 
          alt="Communauté" 
          width={40} 
          height={40} 
          className="object-contain p-2"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
          }}
        />
        <MessageCircle className="fallback-icon hidden h-6 w-6 text-[#6366F1]" />
        
        {/* Badge rouge "1" */}
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#EF4444] text-[11px] font-bold text-white shadow-md animate-bounce">
          1
        </span>
      </motion.button>

      {/* ✅ POP-UP AU CLIC */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[400px] overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 z-10 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6366F1]/10">
                  <MessageCircle className="h-8 w-8 text-[#6366F1]" />
                </div>
                
                <h2 className="mb-2 text-xl font-bold text-[#0F172A]">
                  Rejoignez le cercle privé
                </h2>
                <p className="mb-6 text-sm text-slate-500">
                  Laissez votre numéro WhatsApp pour recevoir votre invitation exclusive directement par notre équipe.
                </p>

                {success ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                    <p className="text-sm font-semibold text-emerald-800">Demande envoyée !</p>
                    <p className="text-xs text-emerald-600 mt-1">Nous vous contacterons très vite.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Numéro WhatsApp</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+237 6 00 00 00 00"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
                      />
                    </div>

                    <label className="flex cursor-pointer items-start gap-2 text-[11px] text-slate-500">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#6366F1]"
                      />
                      <span>J'accepte que MakeItAds utilise mon numéro pour me transmettre l'invitation.</span>
                    </label>

                    {error && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2 text-[11px] text-red-600">
                        <AlertTriangle className="h-3 w-3" /> {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6366F1] py-3 text-sm font-semibold text-white hover:bg-[#5558e6] disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Recevoir mon invitation'}
                    </button>
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