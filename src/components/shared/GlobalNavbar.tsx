"use client";

import Link from "next/link";
import { Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Comment ça marche", href: "#how-it-works" },
    { name: "Ressources", href: "#resources" },
    { name: "Tarifs", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      {/* Bulle longue principale */}
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-[#E7E7EB] rounded-full px-4 md:px-6 py-3 flex items-center justify-between shadow-sm">
        
        {/* Logo épuré */}
        <Link href="/" className="flex items-center group" onClick={handleLinkClick}>
          <span className="text-lg font-bold text-[#18181B] tracking-tight">
            MakeIt<span className="text-[#6366F1]">Ads</span>
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#71717A] hover:text-[#6366F1] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/parametres"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#18181B] bg-[#F7F7F8] hover:bg-[#E7E7EB] transition-colors border border-[#E7E7EB]"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden lg:inline">Paramètres</span>
          </Link>
        </nav>

        {/* Bouton Menu Mobile */}
        <button
          className="md:hidden p-2 text-[#18181B] hover:bg-[#F7F7F8] rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Ouvrir le menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu Mobile en "Bulle" déroulante */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-20 left-4 right-4 max-w-5xl mx-auto bg-white/95 backdrop-blur-md border border-[#E7E7EB] rounded-2xl p-5 shadow-xl"
          >
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-base font-medium text-[#18181B] hover:text-[#6366F1] transition-colors py-2"
                  onClick={handleLinkClick}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-[#E7E7EB]">
                <Link
                  href="/parametres"
                  className="flex items-center gap-3 text-base font-medium text-[#18181B] hover:text-[#6366F1] transition-colors py-2"
                  onClick={handleLinkClick}
                >
                  <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center border border-[#E7E7EB]">
                    <Settings className="w-4 h-4" />
                  </div>
                  Paramètres
                </Link>
              </div>
              
              <div className="pt-4 border-t border-[#E7E7EB] space-y-3">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Informations</p>
                <Link href="/a-propos" className="block text-sm text-[#71717A] hover:text-[#18181B] transition-colors" onClick={handleLinkClick}>À propos</Link>
                <Link href="/recrutement" className="block text-sm text-[#71717A] hover:text-[#18181B] transition-colors" onClick={handleLinkClick}>Recrutement</Link>
                <Link href="/contact" className="block text-sm text-[#71717A] hover:text-[#18181B] transition-colors" onClick={handleLinkClick}>Contact</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}