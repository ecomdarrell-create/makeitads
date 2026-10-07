'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import {
  DASHBOARD_TOUR_STEPS,
  hasCompletedTour,
  markTourCompleted,
} from '@/config/dashboard-tour.config';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function DashboardTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    markTourCompleted();
  }, []);

  // Vérifier si le tour a déjà été vu
  useEffect(() => {
    if (hasCompletedTour()) return;
    const timer = setTimeout(() => setIsOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Mettre à jour la position de la cible à chaque étape
  useEffect(() => {
    if (!isOpen) return;

    const step = DASHBOARD_TOUR_STEPS[currentStep];
    if (!step) return;

    const updateRect = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        // L'élément n'existe pas, on passe à l'étape suivante
        if (currentStep < DASHBOARD_TOUR_STEPS.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          handleClose();
        }
      }
    };

    updateRect();

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isOpen, currentStep, handleClose]);

  const handleNext = useCallback(() => {
    if (currentStep < DASHBOARD_TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  }, [currentStep, handleClose]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Navigation clavier
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose, handleNext, handlePrev]);

  if (!isOpen || !targetRect) return null;

  const step = DASHBOARD_TOUR_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === DASHBOARD_TOUR_STEPS.length - 1;

  // Calcul position tooltip
  const tooltipWidth = 320;
  const tooltipHeight = 200;
  const padding = 12;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

  let tooltipTop = 0;
  let tooltipLeft = 0;

  switch (step.position) {
    case 'bottom':
      tooltipTop = targetRect.top + targetRect.height + padding;
      tooltipLeft = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      break;
    case 'top':
      tooltipTop = targetRect.top - tooltipHeight - padding;
      tooltipLeft = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      break;
    case 'left':
      tooltipTop = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      tooltipLeft = targetRect.left - tooltipWidth - padding;
      break;
    case 'right':
      tooltipTop = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      tooltipLeft = targetRect.left + targetRect.width + padding;
      break;
  }

  tooltipLeft = Math.max(16, Math.min(tooltipLeft, viewportWidth - tooltipWidth - 16));
  tooltipTop = Math.max(16, Math.min(tooltipTop, viewportHeight - tooltipHeight - 16));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay sombre avec trou pour la cible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-[1px]"
            style={{
              clipPath: `polygon(
                0% 0%, 
                0% 100%, 
                ${targetRect.left - 8}px 100%, 
                ${targetRect.left - 8}px ${targetRect.top - 8}px, 
                ${targetRect.left + targetRect.width + 8}px ${targetRect.top - 8}px, 
                ${targetRect.left + targetRect.width + 8}px ${targetRect.top + targetRect.height + 8}px, 
                ${targetRect.left - 8}px ${targetRect.top + targetRect.height + 8}px, 
                ${targetRect.left - 8}px 100%, 
                100% 100%, 
                100% 0%
              )`,
            }}
            onClick={handleClose}
          />

          {/* Halo indigo autour de la cible */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[201] rounded-xl ring-4 ring-[#6366F1] ring-offset-4 ring-offset-white/50 pointer-events-none"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
          />

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="fixed z-[202] w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            style={{ top: tooltipTop, left: tooltipLeft }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 bg-gradient-to-br from-[#6366F1]/5 to-transparent p-4">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6366F1] text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight text-[#18181B]">
                    {step.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Fermer le tutoriel"
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-4">
              <p className="text-xs leading-relaxed text-slate-600">
                {step.description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-3">
              {/* Indicateur d'étapes */}
              <div className="flex items-center gap-1">
                {DASHBOARD_TOUR_STEPS.map((_, i: number) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentStep
                        ? 'w-4 bg-[#6366F1]'
                        : 'w-1.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* Boutons */}
              <div className="flex items-center gap-2">
                {!isFirst && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Préc.
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1 rounded-full bg-[#6366F1] px-3 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-[#5558e6]"
                >
                  {isLast ? 'Terminer' : 'Suivant'}
                  {!isLast && <ArrowRight className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}