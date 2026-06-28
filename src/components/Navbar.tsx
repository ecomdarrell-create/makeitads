"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { navLinks } from "./landing-page-data";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar({ condensed }: { condensed: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((link) => link.toLowerCase());
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login?redirect=/dashboard");
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
        condensed
          ? "backdrop-blur-2xl bg-[#080810]/90 py-3 shadow-[0_10px_45px_rgba(0,0,0,0.3)] border-b border-white/10"
          : "bg-[#080810]/60 py-5 border-b border-white/5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <a href="/" className="group flex items-center transition-transform hover:scale-105">
          <span className="text-2xl font-bold text-white tracking-tight">Make</span>
          <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-2xl font-bold text-transparent tracking-tight">
            ItAds
          </span>
        </a>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.toLowerCase();
            const isDashboard = link === "Dashboard";

            if (isDashboard) {
              return (
                <a
                  key={link}
                  href="/dashboard"
                  onClick={handleDashboardClick}
                  className={`relative py-1 transition-colors ${
                    isActive ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              );
            }

            return (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className={`relative py-1 transition-colors ${
                  isActive ? "text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                {link}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Boutons CTA desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/login"
            className="rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-slate-200 transition-all hover:border-[#6366f1]/50 hover:text-white hover:bg-white/5"
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 transition-all hover:shadow-xl hover:shadow-[#8b5cf6]/40 hover:scale-105"
          >
            <span className="relative z-10">Start free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#38bdf8] opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </div>

        {/* Bouton menu mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition-all hover:bg-white/5 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className={`h-5 w-5 transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out md:hidden ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-6 mt-4 space-y-1 rounded-2xl border border-white/10 bg-[#0a0a15]/95 p-4 backdrop-blur-xl">
          {navLinks.map((link) => {
            const isDashboard = link === "Dashboard";
            if (isDashboard) {
              return (
                <a
                  key={link}
                  href="/dashboard"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleDashboardClick(e);
                  }}
                  className="block rounded-lg px-4 py-3 text-sm text-slate-300 transition-all hover:bg-white/5 hover:text-white"
                >
                  {link}
                </a>
              );
            }
            return (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm text-slate-300 transition-all hover:bg-white/5 hover:text-white"
              >
                {link}
              </a>
            );
          })}
          <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
            <a
              href="/login"
              className="block rounded-lg border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-200 transition-all hover:bg-white/5"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="block rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-3 text-center text-sm font-bold text-white shadow-lg"
            >
              Start free
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}