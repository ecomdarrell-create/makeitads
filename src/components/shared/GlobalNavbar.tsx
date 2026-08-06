"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { createClient } from "@/lib/supabase";
import { ChevronDown, Menu, X, LogOut, User, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const TELEGRAM_URL = "https://t.me/theboardroom_group";

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

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User";

  return (
    <nav className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
      isDashboard ? 'lg:left-[264px]' : ''
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className={`relative flex items-center justify-between rounded-full border border-[#E5E7EB] bg-white/90 backdrop-blur-xl px-2 sm:px-3 py-2 shadow-lg ${
          isDashboard ? 'shadow-md' : 'shadow-black/10'
        }`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6366F1]/5 via-[#8B5CF6]/5 to-[#6366F1]/5 pointer-events-none" />
          
          <Link href="/" className="relative flex items-center gap-1.5 flex-shrink-0 pl-3 sm:pl-4 z-10">
            <span className="text-sm sm:text-base font-bold tracking-tight text-[#111827]">
              MakeIt<span className="text-[#6366f1]">Ads</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 z-10">
            <Link href="/insights" className="px-3 py-2 text-sm text-[#64748B] hover:text-[#111827] transition-colors rounded-full hover:bg-[#F3F4F6]">Insights</Link>
            <button onClick={() => scrollToSection("#success-stories")} className="px-3 py-2 text-sm text-[#64748B] hover:text-[#111827] transition-colors rounded-full hover:bg-[#F3F4F6]">Results</button>
            <Link href="/community" className="px-3 py-2 text-sm text-[#64748B] hover:text-[#111827] transition-colors rounded-full hover:bg-[#F3F4F6]">Community</Link>
            <button onClick={() => scrollToSection("#pricing")} className="px-3 py-2 text-sm text-[#64748B] hover:text-[#111827] transition-colors rounded-full hover:bg-[#F3F4F6]">Pricing</button>
            <button onClick={() => scrollToSection("#faq")} className="px-3 py-2 text-sm text-[#64748B] hover:text-[#111827] transition-colors rounded-full hover:bg-[#F3F4F6]">FAQ</button>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#6366F1] hover:text-[#4F46E5] transition-colors rounded-full hover:bg-[#F3F4F6]">
              Telegram <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Auth / User Section */}
          <div className="flex items-center gap-2 relative z-10">
            {loading ? (
              <div className="h-8 w-20 rounded-full bg-[#F3F4F6] animate-pulse hidden sm:block" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                >
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block truncate max-w-[80px]">{firstName}</span>
                  <ChevronDown className="h-3 w-3 text-[#9CA3AF] hidden sm:block" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden py-2"
                    >
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors">
                        <User className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href="/insights" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors">
                        <ExternalLink className="h-4 w-4" /> Insights
                      </Link>
                      <Link href="/community" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors">
                        <ExternalLink className="h-4 w-4" /> Community
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-[#F9FAFB] hover:text-red-700 transition-colors">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:flex items-center rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors">Sign in</Link>
                <Link href="/signup" className="flex items-center rounded-full bg-[#6366f1] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#4f46e5] transition-colors shadow-lg shadow-[#6366f1]/25">Start Free</Link>
              </>
            )}
            
            <button 
              className="lg:hidden text-[#64748B] p-1.5 rounded-full hover:bg-[#F3F4F6] transition-colors" 
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
            <div className="rounded-3xl border border-[#E5E7EB] bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#6366F1]/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10 p-3 space-y-1">
                <Link href="/insights" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-4 py-3 text-sm text-[#475569] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-2xl transition-colors">Insights</Link>
                <button onClick={() => scrollToSection("#success-stories")} className="w-full text-left px-4 py-3 text-sm text-[#475569] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-2xl transition-colors">Results</button>
                <Link href="/community" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left px-4 py-3 text-sm text-[#475569] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-2xl transition-colors">Community</Link>
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3 text-sm text-[#6366F1] hover:text-[#4F46E5] hover:bg-[#F9FAFB] rounded-2xl transition-colors">
                  <span>Join The Boardroom</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button onClick={() => scrollToSection("#pricing")} className="w-full text-left px-4 py-3 text-sm text-[#475569] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-2xl transition-colors">Pricing</button>
                <button onClick={() => scrollToSection("#faq")} className="w-full text-left px-4 py-3 text-sm text-[#475569] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-2xl transition-colors">FAQ</button>

                <div className="my-2 border-t border-[#E5E7EB]" />

                {!user && (
                  <div className="space-y-2 p-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors">Sign in</Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center rounded-full bg-[#6366f1] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4f46e5] transition-colors">Start Free</Link>
                  </div>
                )}

                {user && (
                  <div className="space-y-2 p-2">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center rounded-full bg-[#6366f1] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4f46e5] transition-colors">Open Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-center text-xs text-red-600 hover:text-red-700 transition-colors py-2">Logout</button>
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