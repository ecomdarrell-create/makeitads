"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

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
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] bg-[#FFFFFF] rounded-2xl shadow-[0_12px_40px_-10px_rgba(24,24,27,0.15)] border border-[#E7E7EB] overflow-hidden"
          role="dialog"
          aria-labelledby="founder-message-title"
        >
          {/* Ligne d'accent subtile en haut pour le côté premium */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />

          {/* Bouton fermer */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#71717A] hover:text-[#18181B] hover:bg-[#F7F7F8] transition-colors z-10"
            aria-label="Fermer le message"
          >
            <X className="h-4 w-4" />
          </button>

          {/* En-tête : Icône + Nom + Statut (Pas de photo, pas de logo) */}
          <div className="p-6 pb-2 flex items-start gap-4 relative">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#6366F1]/10 flex items-center justify-center mt-1">
              <MessageCircle className="h-5 w-5 text-[#6366F1]" />
            </div>
            
            <div className="flex-1 min-w-0 pr-6">
              <h3 id="founder-message-title" className="text-base font-bold text-[#18181B] leading-tight">
                {message.name}
              </h3>
              <p className="text-xs text-[#71717A] font-semibold uppercase tracking-wide mt-0.5">
                {message.role}
              </p>
            </div>
          </div>

          {/* Corps du message */}
          <div className="px-6 pb-4">
            <p className="text-[15px] font-medium text-[#18181B] leading-[1.6]">
              {message.text}
            </p>
            
            <p className="mt-4 text-[14px] text-[#71717A] italic">
              — {message.name.split(" ")[0]}
            </p>
          </div>

          {/* Bouton d'action */}
          <div className="px-6 pb-6 pt-2">
            {message.buttonText && message.buttonUrl && (
              <a
                href={message.buttonUrl}
                onClick={handleClose}
                className="block w-full text-center py-3 px-4 rounded-xl bg-[#6366F1] text-white font-semibold text-[14px] shadow-sm shadow-[#6366F1]/20 hover:bg-[#5558e6] hover:shadow-md transition-all duration-200"
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