"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface StepLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  nextLabel?: string;
  showBack?: boolean;
  nextAction?: () => void; // Pour le bouton "Generate" final
  isGenerating?: boolean;
}

export default function StepLayout({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  canProceed,
  nextLabel = "Continue",
  showBack = true,
  nextAction,
  isGenerating = false,
}: StepLayoutProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="p-6 md:p-10 max-w-4xl mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400">{subtitle}</p>
        </div>
        
        {/* Bouton Suivant (en haut à droite) */}
        <button 
          disabled={!canProceed || isGenerating} 
          onClick={nextAction || onNext} 
          className={`rounded-full px-6 py-3 text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg ${
            canProceed && !isGenerating
              ? "bg-[#6366f1] hover:bg-[#5558e6] shadow-[#6366f1]/25" 
              : "bg-slate-700 opacity-50 cursor-not-allowed"
          }`}
        >
          {isGenerating ? "Processing..." : nextLabel} 
          {!isGenerating && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Contenu de l'étape */}
      <div className="mb-8">
        {children}
      </div>

      {/* Bouton Retour (en bas à gauche) */}
      {showBack && (
        <div className="flex justify-start mt-8">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>
      )}
    </motion.div>
  );
}