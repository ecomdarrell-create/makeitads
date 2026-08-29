"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// ✅ Clé localStorage pour mémoriser la fermeture
const STORAGE_KEY = "founder_message_dismissed";
// ✅ Durée avant de réafficher (en ms) - 7 jours par défaut
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000;

export default function FounderMessage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // ✅ Message hardcoded pour garantir un affichage immédiat, persuasif et pro
  const message = {
    name: "Darrell Kamga",
    role: "Fondateur & PDG",
    text: "Bienvenue. Ici, on ne devine pas, on exécute. Chaque stratégie que vous créez est conçue pour vous donner une avance concrète et mesurable sur votre marché.",
    buttonText: "Créer ma première stratégie",
    buttonUrl: "/dashboard/strategies/new"
  };

  useEffect(() => {
    // ✅ Vérifier si le message a déjà été fermé par l'utilisateur
    const checkDismissed = () => {
      try {
        const dismissedData = localStorage.getItem(STORAGE_KEY);
        if (!dismissedData) {
          setShouldShow(true);
          return;
        }

        const { timestamp } = JSON.parse(dismissedData);
        const now = Date.now();

        // Si plus de 7 jours se sont écoulés, on réaffiche
        if (now - timestamp > DISMISS_DURATION) {
          setShouldShow(true);
        }
      } catch (error) {
        console.error("Error checking dismissed state:", error);
        setShouldShow(true);
      }
    };

    checkDismissed();
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    // Petit délai (1.5s) pour que l'apparition soit fluide après le chargement de la page
    const timer = setTimeout(() => setIsVisible(true), 1500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [shouldShow, isVisible]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      
      // ✅ Sauvegarder la fermeture dans localStorage pour ne plus embêter l'utilisateur
      try {
        const dismissData = {
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissData));
      } catch (error) {
        console.error("Error saving dismissed state:", error);
      }
    }, 300);
  };

  if (!shouldShow || (!isVisible && !isExiting)) return null;

  return (
    <AnimatePresence>
      {(isVisible || isExiting) && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          // ✅ TAILLE RÉDUITE : w-[340px] au lieu de 420px, rounded-xl au lieu de 2xl
          className="fixed bottom-4 right-4 z-50 w-[calc(100vw-24px)] sm:w-[340px] bg-[#FFFFFF] rounded-xl shadow-[0_8px_30px_-10px_rgba(24,24,27,0.15)] border border-[#E7E7EB] overflow-hidden"
          role="dialog"
          aria-labelledby="founder-message-title"
        >
          {/* ✅ BANDE VIOLETTE SUPPRIMÉE ICI */}

          {/* Bouton fermer (taille réduite) */}
          <button
            onClick={handleClose}
            className="absolute top-2.5 right-2.5 p-1 rounded-md text-[#71717A] hover:text-[#18181B] hover:bg-[#F7F7F8] transition-colors z-10"
            aria-label="Fermer le message"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* En-tête : Nom + Statut uniquement (Icône supprimée) */}
          <div className="p-4 pb-2 relative">
            <h3 id="founder-message-title" className="text-sm font-bold text-[#18181B] leading-tight">
              {message.name}
            </h3>
            <p className="text-[10px] text-[#71717A] font-semibold uppercase tracking-wide mt-0.5">
              {message.role}
            </p>
          </div>

          {/* Corps du message (police réduite) */}
          <div className="px-4 pb-3">
            <p className="text-[13px] font-medium text-[#18181B] leading-[1.5]">
              {message.text}
            </p>
            
            {/* ✅ SIGNATURE ET TIRET SUPPRIMÉS ICI */}
          </div>

          {/* Bouton d'action (taille réduite) */}
          <div className="px-4 pb-4 pt-1">
            {message.buttonText && message.buttonUrl && (
              <a
                href={message.buttonUrl}
                onClick={handleClose}
                className="block w-full text-center py-2.5 px-3 rounded-lg bg-[#6366F1] text-white font-semibold text-[13px] shadow-sm shadow-[#6366F1]/20 hover:bg-[#5558e6] hover:shadow-md transition-all duration-200"
              >
                {message.buttonText}
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}