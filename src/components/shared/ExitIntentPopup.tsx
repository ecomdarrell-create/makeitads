'use client';

import { useEffect, useState } from 'react';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà rejoint
    if (typeof window !== 'undefined' && localStorage.getItem('makeitads_telegram_joined')) {
      setHasJoined(true);
      return;
    }

    // Détection Desktop (souris qui sort par le haut)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) setIsVisible(true);
    };

    // Détection Mobile & Desktop (changement d'onglet ou minimisation)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') setIsVisible(true);
    };

    // Détection Mobile (fermeture de l'onglet ou changement d'app)
    const handlePageHide = () => {
      setIsVisible(true);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  const handleJoin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('makeitads_telegram_joined', 'true');
    }
    setHasJoined(true);
    setIsVisible(false);
  };

  if (hasJoined || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 duration-300">
      <div className="relative w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl">
        
        {/* Croix de fermeture */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="text-center pt-2">
          {/* LOGO DE LA MARQUE */}
          <div className="mb-4 flex justify-center">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#111827]">MakeIt</span>
              <span className="text-[#6366F1]">Ads</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#18181B]">
            Attendez ! Ne partez pas les mains vides.
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#71717A] leading-relaxed">
            Rejoignez le <strong>MakeItAds Business Club</strong> sur Telegram et débloquez gratuitement :
          </p>

          <ul className="mt-4 space-y-2.5 text-left px-2">
            {[
              "Templates de campagnes prêts à l'emploi",
              "Études de cas d'entrepreneurs africains",
              "Alertes exclusives sur les tendances publicitaires"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
                {item}
              </li>
            ))}
          </ul>

          {/* BOUTON PRINCIPAL (Sans icône, juste texte, couleur marque) */}
          <a
            href="https://t.me/makeitadsbusinessclub"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleJoin}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#6366F1] py-3 text-sm font-bold text-white shadow-lg shadow-[#6366F1]/20 transition-all hover:bg-[#5558e6] active:scale-[0.98]"
          >
            Rejoindre le Club Telegram Gratuitement
          </a>

          {/* BOUTON DE FERMETURE SECONDAIRE (Sans icône) */}
          <button
            onClick={() => setIsVisible(false)}
            className="mt-3 w-full py-2 text-xs font-medium text-slate-400 underline decoration-slate-300 underline-offset-4 hover:text-slate-600 transition-colors"
          >
            Non merci, je préfère me débrouiller seul
          </button>
        </div>
      </div>
    </div>
  );
}