"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#080810]">
      {/* ══════════════════════════════════════════════════════════
          FOND PREMIUM AVEC HALOS
          ═══════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grille technique discrète */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        
        {/* Halos lumineux subtils */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6366f1]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#8b5cf6]/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#38bdf8]/5 rounded-full blur-[150px]" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          BOUTON RETOUR
          ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          CONTENU CENTRÉ
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 sm:py-24">
        <div className="w-full max-w-md">
          {/* ═══════════════════════════════════════════════════════
              LOGO
              ═══════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <Link href="/" className="group">
              <div className="flex items-center gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:opacity-80 transition-opacity">
                  Make
                </span>
                <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-2xl sm:text-3xl font-bold text-transparent tracking-tight group-hover:opacity-80 transition-opacity">
                  ItAds
                </span>
              </div>
            </Link>
          </motion.div>

          {/* ══════════════════════════════════════════════════════
              TITRE + SOUS-TITRE
              ═══════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════
              CARTE FORMULAIRE GLASSMORPHISM
              ═══════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/50 p-6 sm:p-8"
          >
            {children}
          </motion.div>

          {/* ═══════════════════════════════════════════════════════
              FOOTER DISCRET
              ═══════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <Link href="/terms" className="hover:text-slate-300 transition-colors">
                Terms
              </Link>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <Link href="/contact" className="hover:text-slate-300 transition-colors">
                Contact
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}