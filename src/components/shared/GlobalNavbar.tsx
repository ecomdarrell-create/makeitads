"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { createClient } from "@/lib/supabase/client";
import { User, LogOut, Search, X, Mail } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { NotificationToaster } from "@/components/notifications/NotificationToaster";

const SUPPORT_EMAIL = "support@makeitads.pro";

const navLinks = [
  { name: "Comment ça marche ?", href: "#how-it-works" },
  { name: "Fonctionnalités", href: "#fonctionnalites" },
  { name: "Résultats", href: "#avis" },
  { name: "Tarifs", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
  { name: "Dashboard", href: "/dashboard", isExternal: true },
];

const searchIndex = [
  { label: "Dashboard", href: "/dashboard", keywords: "accueil tableau de bord home" },
  { label: "Créer une stratégie", href: "/dashboard/generate", keywords: "nouvelle stratégie créer lancer" },
  { label: "Mes stratégies", href: "/dashboard/strategies", keywords: "liste historique stratégies" },
  { label: "Analytics", href: "/dashboard/analytics", keywords: "statistiques données activité" },
  { label: "Paramètres", href: "/dashboard/settings", keywords: "settings profil compte" },
  { label: "Tarifs & facturation", href: "/dashboard/pricing", keywords: "prix plan upgrade" },
  { label: "Recharger des crédits", href: "/dashboard/credits/recharge", keywords: "crédits recharge" },
  { label: "Mes crédits", href: "/dashboard/credits", keywords: "crédits solde historique" },
  { label: "Ressources", href: "/dashboard/resources", keywords: "aide tutoriel guide" },
  { label: "Parrainage", href: "/dashboard/referral", keywords: "parrainage filleuls" },
  { label: "Support", href: "mailto:support@makeitads.pro", keywords: "aide contact support" },
];

// ✅ Icône custom : 3 points épais
function DotsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="3.1" />
      <circle cx="12" cy="12" r="3.1" />
      <circle cx="19" cy="12" r="3.1" />
    </svg>
  );
}

// ✅ Icône custom : tête de bonhomme avec casque (style call center)
function SupportAgentIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Arceau du casque */}
      <path d="M5 11a7 7 0 0 1 14 0" />
      {/* Écouteur gauche */}
      <rect x="3.5" y="11" width="2.5" height="4.5" rx="1.2" fill="currentColor" stroke="none" />
      {/* Écouteur droit */}
      <rect x="18" y="11" width="2.5" height="4.5" rx="1.2" fill="currentColor" stroke="none" />
      {/* Tête */}
      <circle cx="12" cy="12.5" r="3.8" />
      {/* Micro (tige + embout) */}
      <path d="M20.5 14v1.5a2.5 2.5 0 0 1-2.5 2.5h-2.5" />
      <circle cx="15" cy="18" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const {
    notifications,
    unreadCount,
    loading: notifLoading,
    toasts,
    dismissToast,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadUserName = async () => {
      if (user) {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .single();
        setUserName(profile?.first_name || user.email?.split("@")[0] || "Utilisateur");
      }
    };
    loadUserName();
  }, [user]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!notifOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-notif-panel]") && !target.closest("[data-notif-bell]")) {
        setNotifOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [notifOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isTyping) return;

      if (e.key === "/" || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [searchOpen]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return searchIndex.slice(0, 8);
    const q = searchQuery.toLowerCase();
    return searchIndex.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleNavClick = (e: React.MouseEvent, href: string, isExternal?: boolean) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (isExternal) {
      router.push(href);
    } else if (href.startsWith("#")) {
      if (pathname !== "/") {
        router.push(`/${href}`);
      } else {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
        else router.push(`/${href}`);
      }
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserName("");
    setIsMobileMenuOpen(false);
    setNotifOpen(false);
    router.push("/");
    router.refresh();
  };

  const handleSearchResultClick = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    if (href.startsWith("http") || href.startsWith("mailto")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <header className="fixed top-3 left-3 right-3 z-50 md:top-0 md:left-0 md:right-0 transition-all duration-300">
        <div className="bg-white border border-slate-200/70 rounded-2xl px-4 h-12 flex items-center justify-between shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:border-b md:border-x-0 md:border-t-0 md:rounded-none md:h-14 md:px-8 md:shadow-none">
          <Link href="/" className="group flex items-center transition-transform hover:scale-105 shrink-0">
            <span className="text-sm md:text-lg font-semibold tracking-tight text-gray-900">
              MakeIt<span className="text-[#6366F1]">Ads</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.isExternal)}
                className="relative py-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#6366F1] transition-all duration-300 hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            {/* 🎧 Support — cercle violet brillant calibré sur les autres icônes */}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              aria-label="Contacter le support par email"
              title="Contacter le support"
              className="group relative flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 m-auto h-[26px] w-[26px] md:h-[28px] md:w-[28px] rounded-full bg-gradient-to-br from-[#7C7FF5] via-[#6366F1] to-[#8B5CF6] shadow-[0_3px_10px_rgba(99,102,241,0.4),inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_2px_rgba(79,70,229,0.4)] transition-all duration-200 group-hover:scale-110 group-hover:shadow-[0_5px_16px_rgba(99,102,241,0.6),inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-1px_2px_rgba(79,70,229,0.5)] group-active:scale-95"
              />
              {/* Reflet brillant en haut */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 m-auto h-[8px] w-[18px] md:h-[9px] md:w-[20px] -translate-y-[5px] md:-translate-y-[6px] rounded-full bg-white/45 blur-[3px]"
              />
              {/* Petit point lumineux */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-[4px] top-[4px] md:right-[5px] md:top-[5px] h-1 w-1 rounded-full bg-white/70 blur-[1px]"
              />
              <SupportAgentIcon className="relative h-[15px] w-[15px] md:h-[16px] md:w-[16px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]" />
            </a>

            {/* 🔍 Loupe */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
              className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center text-slate-900 transition-colors hover:text-[#6366F1]"
            >
              <Search className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]" strokeWidth={2.6} />
            </button>

            {/* 🔔 Cloche — seulement si connecté */}
            {user && (
              <div data-notif-bell className="relative">
                <NotificationBell
                  unreadCount={unreadCount}
                  isOpen={notifOpen}
                  onClick={() => setNotifOpen((v) => !v)}
                />
                <AnimatePresence>
                  {notifOpen && (
                    <div data-notif-panel>
                      <NotificationPanel
                        notifications={notifications}
                        unreadCount={unreadCount}
                        loading={notifLoading}
                        onClose={() => setNotifOpen(false)}
                        onMarkAsRead={markAsRead}
                        onMarkAllAsRead={markAllAsRead}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="hidden md:flex items-center gap-3 ml-1">
              {user ? (
                <>
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-900">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="max-w-[100px] truncate">{userName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Déconnexion
                  </button>
                </>
              ) : authLoading ? null : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-[#6366F1] px-5 py-1.5 text-sm font-bold text-white shadow-md shadow-[#6366f1]/20 hover:bg-[#5558e6] transition-all"
                  >
                    S&apos;inscrire
                  </Link>
                </>
              )}
            </div>

            {/* ✅ Burger mobile */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-900 transition-all hover:bg-slate-900 hover:text-white active:scale-95"
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center"
                  >
                    <X className="h-3 w-3" strokeWidth={3.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="dots"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center"
                  >
                    <DotsIcon className="h-[10px] w-[10px]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Menu mobile ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[55] bg-slate-900/30 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed right-3 top-[68px] z-[60] max-h-[calc(100dvh-82px)] w-[min(340px,calc(100vw-24px))] overflow-y-auto md:hidden"
              style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
            >
              <div className="flex w-full flex-col rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-xl backdrop-blur-2xl">
                <div className="mb-4 flex w-full flex-col">
                  <div className="mb-1 flex w-full items-center justify-between">
                    <span className="text-sm font-semibold tracking-tight text-gray-900">
                      MakeIt<span className="text-[#6366F1]">Ads</span>
                    </span>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      aria-label="Fermer le menu"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[10px] leading-relaxed text-gray-500">
                    La plateforme N°1 pour automatiser votre acquisition client en Afrique.
                  </p>
                </div>

                <nav className="flex w-full flex-col items-start space-y-1 border-t border-gray-100 py-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href, link.isExternal)}
                      className="w-full rounded-lg px-2 py-2 text-sm font-medium tracking-tight text-gray-700 transition-colors hover:bg-indigo-50 hover:text-[#6366F1]"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>

                <a
                  href="mailto:support@makeitads.pro"
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-full bg-indigo-50 px-3 py-2.5 text-center text-xs font-semibold text-[#6366F1] transition-colors hover:bg-indigo-100"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  Nous contacter
                </a>

                <a
                  href="https://t.me/makeitadsbusinessclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#0088cc]/10 px-3 py-2.5 text-center text-xs font-semibold text-[#0088cc] transition-colors hover:bg-[#0088cc]/20"
                >
                  <SiTelegram className="w-4 h-4 shrink-0" />
                  Rejoindre le Business Club
                </a>

                {user ? (
                  <div className="border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Se déconnecter
                    </button>
                  </div>
                ) : authLoading ? (
                  <p role="status" className="py-2 text-center text-[11px] text-slate-400">
                    Vérification de la session…
                  </p>
                ) : (
                  <div className="grid w-full grid-cols-2 gap-3 border-t border-gray-100 pt-3">
                    <Link
                      href="/login"
                      className="flex items-center justify-center rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center rounded-full bg-[#6366F1] py-2.5 text-sm font-bold text-white shadow-md shadow-[#6366f1]/20 transition-all hover:bg-[#5558e6]"
                    >
                      S&apos;inscrire
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Recherche ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-20 md:pt-32 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une page, une fonctionnalité…"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                  Échap
                </kbd>
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="sm:hidden rounded-full p-1 text-slate-400 hover:bg-slate-100"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredResults.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-slate-400">
                    Aucun résultat pour « {searchQuery} »
                  </p>
                ) : (
                  <ul className="space-y-0.5">
                    {filteredResults.map((item) => (
                      <li key={item.href}>
                        <button
                          onClick={() => handleSearchResultClick(item.href)}
                          className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                        >
                          <span className="text-sm font-medium text-slate-900">
                            {item.label}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {item.href}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-[10px] text-slate-400">
                <span>Navigation rapide</span>
                <span className="hidden sm:inline">
                  Astuce : tape <kbd className="rounded border border-slate-200 bg-white px-1">/</kbd> partout
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔔 Toasts en bas de l'écran */}
      {user && (
        <NotificationToaster
          toasts={toasts}
          onDismiss={dismissToast}
          onRead={markAsRead}
        />
      )}
    </>
  );
}