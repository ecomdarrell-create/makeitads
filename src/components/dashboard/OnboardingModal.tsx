"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Target, 
  Calendar, 
  Crown, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2 
} from "lucide-react";

const steps = [
  {
    title: "Welcome to MakeItAds!",
    description: "Let's generate your first AI-powered strategy in under 30 seconds. No credit card required.",
    icon: Sparkles,
    color: "from-[#6366f1] to-[#8b5cf6]"
  },
  {
    title: "Refine Your Targeting",
    description: "Use the Audience Lab to build custom segments, exclude irrelevant users, and find lookalike audiences.",
    icon: Target,
    color: "from-emerald-500 to-green-500"
  },
  {
    title: "Plan Your Campaigns",
    description: "Visualize your publication schedule in the Calendar. Export to .ics and get seasonal AI recalibrations.",
    icon: Calendar,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Unlock Full Potential",
    description: "You're on the Free plan. Upgrade to Pro or Premium anytime to unlock unlimited strategies and advanced analytics.",
    icon: Crown,
    color: "from-amber-500 to-orange-500"
  }
];

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Vérifie si l'utilisateur a déjà vu l'onboarding
    const hasSeenOnboarding = localStorage.getItem("makeitads_onboarding_seen");
    if (!hasSeenOnboarding) {
      // Petit délai pour laisser le dashboard se charger
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("makeitads_onboarding_seen", "true");
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#080810]/80 backdrop-blur-md" 
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#0f0f1a] shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${steps[currentStep].color} opacity-20 blur-3xl transition-all duration-500`} />
            <div className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-br ${steps[currentStep].color} opacity-10 blur-3xl transition-all duration-500`} />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 p-8">
              {/* Progress Bar */}
              <div className="flex items-center gap-2 mb-8">
                {steps.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      index <= currentStep 
                        ? `bg-gradient-to-r ${steps[currentStep].color}` 
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${steps[currentStep].color} shadow-xl mb-6`}>
                    <CurrentIcon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-slate-400 leading-relaxed max-w-sm mx-auto">
                    {steps[currentStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    currentStep === 0 
                      ? "text-slate-600 cursor-not-allowed" 
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-white">{currentStep + 1}</span>
                  <span>/</span>
                  <span>{steps.length}</span>
                </div>

                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 rounded-lg bg-gradient-to-r ${steps[currentStep].color} px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl`}
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Get Started
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}