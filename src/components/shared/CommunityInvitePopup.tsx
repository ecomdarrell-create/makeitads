'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { PhoneInput, isValidPhoneNumber, detectCountry } from '@/components/auth/PhoneInput';

interface CommunityInvitePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  userId?: string | null;
  email?: string | null;
}

export default function CommunityInvitePopup({ isOpen, onClose, onAccept, userId, email }: CommunityInvitePopupProps) {
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isValidPhoneNumber(phone)) {
      setErrorMessage('Veuillez saisir un numéro de téléphone valide avec son indicatif.');
      return;
    }
    if (!consent) {
      setErrorMessage('Vous devez accepter les conditions pour recevoir l\'invitation.');
      return;
    }

    setStatus('loading');

    try {
      const country = detectCountry(phone);
      const cleanPhone = '+' + phone.replace(/\D/g, '');

      const response = await fetch('/api/community-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_e164: cleanPhone,
          country_code: country?.dial || 'unknown',
          consent: true,
          user_id: userId || null,
          anonymous_id: userId ? null : (typeof window !== 'undefined' ? (localStorage.getItem('mia_anonymous_id') || crypto.randomUUID()) : crypto.randomUUID()),
          email: email || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onAccept();
        }, 2500);
      } else {
        setErrorMessage(data.error || 'Une erreur est survenue. Veuillez réessayer.');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('Erreur de connexion au serveur. Vérifiez votre connexion.');
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[360px] sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-10"
              aria-label="Fermer la fenêtre"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-5 sm:p-6">
              {status === 'success' ? (
                <div className="text-center py-6">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2 break-words">Demande enregistrée !</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed break-words">
                    Notre équipe vous transmettra votre invitation sur WhatsApp dès que possible.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex justify-center">
                    <span className="text-xl font-bold tracking-tight">
                      <span className="text-[#111827]">MakeIt</span>
                      <span className="text-[#6366F1]">Ads</span>
                    </span>
                  </div>

                  <div className="text-center mb-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-[9px] font-bold uppercase tracking-wider mb-2 break-words">
                      Invitation exclusive
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2 leading-tight break-words">
                      Avant de continuer, découvrez un privilège réservé.
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed break-words">
                      Rejoignez gratuitement le cercle communautaire MakeItAds et accédez à des opportunités exclusives.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2">
                    {[
                      "Visibilité pour votre activité",
                      "Contact direct avec le fondateur",
                      "Opportunités de collaboration",
                      "Conseils et ressources exclusives"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#0F172A]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#6366F1] shrink-0 mt-0.5" />
                        <span className="leading-relaxed break-words">{item}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1 break-words">
                        Où vous envoyer votre invitation ?
                      </label>
                      <PhoneInput 
                        value={phone} 
                        onChange={setPhone} 
                        placeholder="Votre numéro WhatsApp"
                      />
                      <p className="mt-1 text-[10px] text-[#64748B] leading-relaxed break-words">
                        Notre équipe vous transmettra directement le lien d'accès.
                      </p>
                    </div>

                    <label className="flex items-start gap-2 cursor-pointer group">
                      <div className="relative flex items-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="peer h-4 w-4 rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1] cursor-pointer"
                        />
                      </div>
                      <span className="text-[10px] leading-relaxed text-[#64748B] group-hover:text-[#0F172A] transition-colors break-words">
                        J'accepte que MakeItAds utilise mon numéro pour me transmettre l'invitation. 
                        <a href="/privacy" className="text-[#6366F1] hover:underline ml-1">Politique</a>.
                      </span>
                    </label>

                    {errorMessage && (
                      <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span className="break-words">{errorMessage}</span>
                      </div>
                    )}

                    <div className="pt-1 space-y-2">
                      <button
                        type="submit"
                        disabled={status === 'loading' || !consent}
                        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#6366F1] py-2.5 text-xs font-bold text-white shadow-lg shadow-[#6366F1]/20 transition-all hover:bg-[#5558e6] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4" />
                            Recevoir mon invitation
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2 text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors break-words"
                      >
                        Non merci, continuer ma visite
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}