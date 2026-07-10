"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { createClient } from "@/lib/supabase";
import { ChevronDown, Menu, X, LogOut, User, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const TELEGRAM_URL = "https://t.me/makeitads";

export default function GlobalNavbar() {
  const { user, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      router.push(href);
    }
  };

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User";

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="relative flex items-center justify-between rounded-full border border-white/10 bg-[#0a0a14]/90 backdrop-blur-xl px-2 sm:px-3 py-2 shadow-lg shadow-black/30">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 via-white/10 to-white/5 pointer-events-none" />
          
          <Link href="/" className="relative flex items-center gap-1.5 flex-shrink-0 pl-3 sm:pl-4 z-10">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white">
              Make<span className="text-[#6366f1]">ItAds</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 z-10">
            <button 
              onClick={() => scrollToSection("#success-stories")}
              className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              Results
            </button>

            <Link 
              href="/community"
              className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              Community
            </Link>

            <button 
              onClick={() => scrollToSection("#pricing")}
              className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              Pricing
            </button>

            <button 
              onClick={() => scrollToSection("#faq")}
              className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              FAQ
            </button>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#a78bfa] hover:text-[#c4b5fd] transition-colors rounded-full hover:bg-white/5"
            >
              Telegram
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Auth / User Section */}
          <div className="flex items-center gap-2 relative z-10">
            {loading ? (
              <div className="h-8 w-20 rounded-full bg-white/5 animate-pulse hidden sm:block" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block truncate max-w-[80px]">{firstName}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#0f0f1a] shadow-xl overflow-hidden py-2"
                    >
                      <Link 
                        href="/dashboard" 
                        onClick={() => setUserMenuOpen(false)} 
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link
                        href="/community"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" /> Community
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="hidden sm:flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  href="/signup" 
                  className="flex items-center rounded-full bg-[#6366f1] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#4f46e5] transition-colors shadow-lg shadow-[#6366f1]/25"
                >
                  Start Free
                </Link>
              </>
            )}
            
            <button 
              className="lg:hidden text-slate-300 p-1.5 rounded-full hover:bg-white/5 transition-colors" 
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
            className="lg:hidden fixed top-20 left-4 right-4 z-40 mx-auto max-w-md"
          >
            <div className="rounded-3xl border border-white/10 bg-[#0a0a14]/95 backdrop-blur-xl shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10 p-3 space-y-1">
                <button
                  onClick={() => scrollToSection("#success-stories")}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-colors"
                >
                  Results
                </button>

                <Link
                  href="/community"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-colors"
                >
                  Community
                </Link>

                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm text-[#a78bfa] hover:text-[#c4b5fd] hover:bg-white/5 rounded-2xl transition-colors"
                >
                  <span>Join The Boardroom</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <button
                  onClick={() => scrollToSection("#pricing")}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-colors"
                >
                  Pricing
                </button>

                <button
                  onClick={() => scrollToSection("#faq")}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-colors"
                >
                  FAQ
                </button>

                <div className="my-2 border-t border-white/10" />

                {!user && (
                  <div className="space-y-2 p-2">
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link 
                      href="/signup" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center rounded-full bg-[#8b5cf6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7c3aed] transition-colors"
                    >
                      Start Free
                    </Link>
                  </div>
                )}

                {user && (
                  <div className="space-y-2 p-2">
                    <Link 
                      href="/dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center rounded-full bg-[#8b5cf6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7c3aed] transition-colors"
                    >
                      Open Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-center text-xs text-red-400 hover:text-red-300 transition-colors py-2"
                    >
                      Logout
                    </button>
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