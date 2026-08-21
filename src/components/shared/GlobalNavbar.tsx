"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { createClient } from "@/lib/supabase";
import { ChevronDown, Menu, X, LogOut, User, ExternalLink, Settings, HelpCircle, Briefcase, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const TELEGRAM_URL = "https://t.me/MakeItAds_Pro";

export default function GlobalNavbar() {
  const { user, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    window.location.reload();
  };

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      if (pathname !== "/") {
        router.push("/");
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(href);
    }
  };

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Utilisateur";

  return (
    <nav className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
      isDashboard ? 'lg:left-[264px]' : ''
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className={`relative flex items-center justify-between rounded-full border border-[#E7E7EB] bg-[#FFFFFF]/95 backdrop-blur-xl px-2 sm:px-3 py-2 shadow-sm ${
          isDashboard ? 'shadow-md' : 'shadow-[#18181B]/5'
        }`}>
          
          <Link href="/" className="relative flex items-center gap-1.5 flex-shrink-0 pl-3 sm:pl-4 z-10">
            <span className="text-sm sm:text-base font-bold tracking-tight text-[#18181B]">
              MakeIt<span className="text-[#6366F1]">Ads</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 z-10">
            <Link href="/pricing" className="px-3 py-2 text-sm text-[#71717A] hover:text-[#18181B] transition-colors rounded-full hover:bg-[#F7F7F8]">Tarifs</Link>
            <Link href="/dashboard/resources" className="px-3 py-2 text-sm text-[#71717A] hover:text-[#18181B] transition-colors rounded-full hover:bg-[#F7F7F8]">Ressources</Link>
            <button onClick={() => scrollToSection("#success-stories")} className="px-3 py-2 text-sm text-[#71717A] hover:text-[#18181B] transition-colors rounded-full hover:bg-[#F7F7F8]">Témoignages</button>
            <button onClick={() => scrollToSection("#faq")} className="px-3 py-2 text-sm text-[#71717A] hover:text-[#18181B] transition-colors rounded-full hover:bg-[#F7F7F8]">FAQ</button>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#6366F1] hover:text-[#5558e6] transition-colors rounded-full hover:bg-[#F7F7F8]">
              Telegram <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Auth / User Section */}
          <div className="flex items-center gap-2 relative z-10">
            {loading ? (
              <div className="h-8 w-20 rounded-full bg-[#F7F7F8] animate-pulse hidden sm:block" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-[#F7F7F8] border border-[#E7E7EB] px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-[#18181B] hover:bg-[#FFFFFF] hover:border-[#6366F1]/30 transition-colors"
                >
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block truncate max-w-[80px]">{firstName}</span>
                  <ChevronDown className="h-3 w-3 text-[#71717A] hidden sm:block" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl border border-[#E7E7EB] bg-[#FFFFFF] shadow-xl overflow-hidden py-2"
                    >
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#71717A] hover:bg-[#F7F7F8] hover:text-[#18181B] transition-colors">
                        <User className="h-4 w-4" /> Tableau de bord
                      </Link>
                      <Link href="/dashboard/resources" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#71717A] hover:bg-[#F7F7F8] hover:text-[#18181B] transition-colors">
                        <ExternalLink className="h-4 w-4" /> Ressources
                      </Link>
                      <Link href="/community" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#71717A] hover:bg-[#F7F7F8] hover:text-[#18181B] transition-colors">
                        <ExternalLink className="h-4 w-4" /> Communauté
                      </Link>
                      <div className="my-1 border-t border-[#E7E7EB]" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4" /> Se déconnecter
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:flex items-center rounded-full border border-[#E7E7EB] bg-[#FFFFFF] px-4 py-1.5 text-sm font-semibold text-[#18181B] hover:bg-[#F7F7F8] transition-colors">Se connecter</Link>
                <Link href="/signup" className="flex items-center rounded-full bg-[#6366F1] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors shadow-sm shadow-[#6366F1]/25">Commencer</Link>
              </>
            )}
            
            <button 
              className="lg:hidden text-[#71717A] p-1.5 rounded-full hover:bg-[#F7F7F8] transition-colors" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed top-20 left-4 right-4 z-40 mx-auto max-w-md max-h-[calc(100vh-100px)] overflow-y-auto overscroll-contain"
          >
            <div className="rounded-3xl border border-[#E7E7EB] bg-[#FFFFFF] shadow-xl overflow-hidden relative">
              
              <div className="relative z-10 p-4 space-y-1">
                {/* User Info if logged in */}
                {user && (
                  <div className="flex items-center gap-3 p-3 mb-2 rounded-2xl bg-[#F7F7F8] border border-[#E7E7EB]">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-sm font-bold text-white">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#18181B]">{firstName}</p>
                      <p className="text-xs text-[#71717A]">Compte actif</p>
                    </div>
                  </div>
                )}

                {/* Primary Navigation */}
                <div className="space-y-1">
                  {user ? (
                    <>
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#18181B] hover:bg-[#F7F7F8] rounded-xl transition-colors">Accueil</Link>
                      <Link href="/dashboard/strategies" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#18181B] hover:bg-[#F7F7F8] rounded-xl transition-colors">Mes stratégies</Link>
                      <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#6366F1] hover:bg-[#F7F7F8] rounded-xl transition-colors">Tarifs</Link>
                      <Link href="/dashboard/credits" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#18181B] hover:bg-[#F7F7F8] rounded-xl transition-colors">Crédits</Link>
                      <Link href="/dashboard/resources" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#18181B] hover:bg-[#F7F7F8] rounded-xl transition-colors">Ressources</Link>
                    </>
                  ) : (
                    <>
                      <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#6366F1] hover:bg-[#F7F7F8] rounded-xl transition-colors">Tarifs</Link>
                      <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#18181B] hover:bg-[#F7F7F8] rounded-xl transition-colors">Accueil</Link>
                      <button onClick={() => scrollToSection("#success-stories")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#18181B] hover:bg-[#F7F7F8] rounded-xl transition-colors text-left">Témoignages</button>
                      <button onClick={() => scrollToSection("#faq")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#18181B] hover:bg-[#F7F7F8] rounded-xl transition-colors text-left">FAQ</button>
                    </>
                  )}
                </div>

                <div className="my-3 border-t border-[#E7E7EB]" />

                {/* Secondary Links (Footer links) */}
                <div className="space-y-1">
                  <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-[#71717A] hover:bg-[#F7F7F8] hover:text-[#18181B] rounded-xl transition-colors">
                    <Briefcase className="h-4 w-4" /> À propos
                  </Link>
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3 text-sm text-[#71717A] hover:bg-[#F7F7F8] hover:text-[#18181B] rounded-xl transition-colors">
                    <span className="flex items-center gap-3"><User className="h-4 w-4" /> The Boardroom</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <Link href="/careers" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-[#71717A] hover:bg-[#F7F7F8] hover:text-[#18181B] rounded-xl transition-colors">
                    <User className="h-4 w-4" /> Recrutement
                  </Link>
                  <Link href="/dashboard/resources/faq" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-[#71717A] hover:bg-[#F7F7F8] hover:text-[#18181B] rounded-xl transition-colors">
                    <HelpCircle className="h-4 w-4" /> Centre d'aide
                  </Link>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-[#71717A] hover:bg-[#F7F7F8] hover:text-[#18181B] rounded-xl transition-colors">
                    <Mail className="h-4 w-4" /> Contact
                  </Link>
                </div>

                {/* Auth Actions for logged in users */}
                {user && (
                  <>
                    <div className="my-3 border-t border-[#E7E7EB]" />
                    <div className="space-y-1">
                      <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-[#71717A] hover:bg-[#F7F7F8] hover:text-[#18181B] rounded-xl transition-colors">
                        <Settings className="h-4 w-4" /> Paramètres
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left">
                        <LogOut className="h-4 w-4" /> Se déconnecter
                      </button>
                    </div>
                  </>
                )}

                {/* Auth Actions for non-logged in users */}
                {!user && (
                  <div className="space-y-2 pt-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center rounded-xl border border-[#E7E7EB] bg-[#FFFFFF] px-4 py-3 text-sm font-semibold text-[#18181B] hover:bg-[#F7F7F8] transition-colors">Se connecter</Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center rounded-xl bg-[#6366F1] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors">Commencer gratuitement</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}