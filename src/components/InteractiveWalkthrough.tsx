"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles, TrendingUp, Eye, BarChart3, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Business Profile",
    description: "The more information you provide, the more accurate your marketing strategy becomes.",
    icon: Sparkles,
    image: "/images/business-profile-desktop.png",
    mobileImage: "/images/business-profile-mobile.png",
  },
  {
    id: 2,
    title: "Market Intelligence",
    description: "Track your competitors in real-time and discover opportunities they're missing.",
    icon: TrendingUp,
    image: "/images/analytics-desktop.png",
    mobileImage: "/images/analytics-mobile.png",
  },
  {
    id: 3,
    title: "Competitor Watch",
    description: "Get a complete SWOT analysis and AI-powered insights on your competitive landscape.",
    icon: Eye,
    image: "/images/competitor-watch-desktop.png",
    mobileImage: "/images/competitor-watch-mobile.png",
  },
  {
    id: 4,
    title: "Strategy Engine",
    description: "Receive a data-backed strategy with budget allocation and growth roadmap.",
    icon: BarChart3,
    image: "/images/strategy-engine-desktop.png",
    mobileImage: "/images/strategy-engine-mobile.png",
  },
  {
    id: 5,
    title: "Executive Dashboard",
    description: "Your complete marketing command center with all insights in one place.",
    icon: LayoutDashboard,
    image: "/images/executive-dashboard-desktop.png",
    mobileImage: "/images/executive-dashboard-mobile.png",
  },
];

export default function InteractiveWalkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(nextStep, 7000);
    return () => clearInterval(timer);
  }, [mounted]);

  if (!mounted) return null;

  const currentStep = steps[activeStep];
  const Icon = currentStep.icon;

  return (
    <section id="walkthrough" className="relative w-full min-h-screen overflow-hidden">
      
      {/* IMAGE DE FOND */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={isMobile ? currentStep.mobileImage : currentStep.image}
              alt={currentStep.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[#080810]/70" />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        {/* Timeline */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`flex items-center gap-2 transition-all ${
                  index === activeStep ? "scale-110" : "opacity-50 hover:opacity-80"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  index === activeStep
                    ? "border-[#6366f1] bg-[#6366f1]/20"
                    : index < activeStep
                    ? "border-emerald-500 bg-emerald-500/20"
                    : "border-white/20 bg-white/5"
                }`}>
                  {index < activeStep ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Icon className={`h-4 w-4 ${index === activeStep ? "text-[#8b5cf6]" : "text-slate-400"}`} />
                  )}
                </div>
                <span className={`text-xs font-bold hidden md:block ${
                  index === activeStep ? "text-white" : "text-slate-500"
                }`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
          
          <div className="max-w-4xl mx-auto mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
              animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Texte central */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mb-10"
          >
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#6366f1] mb-4">
              Step {currentStep.id} of {steps.length}
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              {currentStep.title}
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
              {currentStep.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={prevStep}
            className="h-12 w-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeStep ? "bg-[#6366f1] w-8" : "bg-white/30 w-2 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="h-12 w-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* CTA final */}
        {activeStep === steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 text-center"
          >
            <p className="text-lg text-slate-300 mb-4">Ready to build your own strategy?</p>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105"
            >
              Start Building
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080810] to-transparent z-10" />
    </section>
  );
}