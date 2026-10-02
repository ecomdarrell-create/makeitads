"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { User, LogOut } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Comment ça marche ?", href: "#how-it-works" },
  { name: "Fonctionnalités", href: "#fonctionnalites" },
  { name: "Résultats", href: "#avis" },
  { name: "Tarifs", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
  { name: "Dashboard", href: "/dashboard", isExternal: true }
];

export default function Navbar({ condensed = false }: { condensed?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadUserName = async () => {
      if (user) {
        const supabase = createClient();
        const { data: profile } = await supabase.from("profiles").select("first_name").eq("id", user.id).single();
        setUserName(profile?.first_name || user.email?.split("@")[0] || "Utilisateur");
      }
    };
    loadUserName();
  }, [user]);

  const handleNavClick = (e: React.MouseEvent, href: string, isExternal?: boolean) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (!user && !isExternal) {
      router.push(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }
    if (isExternal) {
      router.push(href);
    } else {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserName("");
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="fixed top-3 left-3 right-3 z-50 md:top-0 md:left-0 md:right-0 md:rounded-none md:border-b md:bg-white/90 md:backdrop-blur-md transition-all duration-300">
        <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl px-4 h-12 flex items-center justify-between shadow-sm md:bg-transparent md:border-none md:rounded-none md:h-14 md:px-6 md:max-w-7xl md:mx-auto md:shadow-none">
          <a href="/" className="group flex items-center transition-transform hover:scale-105">
            <span className="text-sm md:text-lg font-semibold tracking-tight text-gray-900">
              MakeIt<span className="text-[#6366F1]">Ads</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href, link.isExternal)} className="relative py-1 text-gray-600 hover:text-gray-900 transition-colors">
                {link.name}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#6366F1] transition-all duration-300 hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="max-w-[100px] truncate">{userName}</span>
              </div>
            ) : (
              <>
                <a href="/login" className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">Se connecter</a>
                <a href="/signup" className="rounded-full bg-[#6366F1] px-5 py-1.5 text-sm font-bold text-white shadow-md shadow-[#6366f1]/20 hover:bg-[#5558e6] transition-all">S'inscrire</a>
              </>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden flex flex-col items-center justify-center gap-1 p-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-all" aria-label="Ouvrir le menu">
            <span className="block w-4 h-0.5 bg-gray-800 rounded-full"></span>
            <span className="block w-4 h-0.5 bg-gray-800 rounded-full"></span>
            <span className="block w-4 h-0.5 bg-gray-800 rounded-full"></span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }} className="fixed inset-3 z-[60] md:hidden" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
            <div className="w-full h-full bg-white/95 backdrop-blur-2xl border border-gray-100 rounded-3xl flex flex-col p-6 shadow-2xl">
              
              {/* ✅ TOUT ALIGNÉ À GAUCHE STRICTEMENT */}
              <div className="flex flex-col mb-8 w-full">
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-base font-semibold tracking-tight text-gray-900">MakeIt<span className="text-[#6366F1]">Ads</span></span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all" aria-label="Fermer le menu">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 text-left leading-tight">
                  La plateforme N°1 pour automatiser votre acquisition client en Afrique.
                </p>
              </div>

              <nav className="flex-1 flex flex-col items-start justify-center space-y-4 w-full">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href, link.isExternal)} className="text-base font-medium text-gray-700 hover:text-[#6366F1] transition-colors tracking-tight text-left w-full">
                    {link.name}
                  </a>
                ))}
              </nav>

              <div className="flex items-center justify-start gap-2 mb-6 text-gray-500 text-xs font-medium w-full">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-r from-blue-600 via-white to-red-600"></div>
                </div>
                <span>FR</span>
              </div>

              <a 
                href="https://t.me/makeitadsbusinessclub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-start gap-2 w-full py-2.5 rounded-full bg-[#0088cc]/10 text-[#0088cc] text-xs font-semibold hover:bg-[#0088cc]/20 transition-all mb-3 pl-4"
              >
                <SiTelegram className="w-4 h-4" />
                Rejoindre le Business Club
              </a>

              <div className="grid grid-cols-2 gap-3 w-full">
                <a href="/login" className="flex items-center justify-center py-2.5 rounded-full border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all">Se connecter</a>
                <a href="/signup" className="flex items-center justify-center py-2.5 rounded-full bg-[#6366F1] text-white font-bold text-sm shadow-md shadow-[#6366f1]/20 hover:bg-[#5558e6] transition-all">S'inscrire</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}