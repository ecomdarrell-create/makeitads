"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Target,
  CreditCard,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { usePlan } from "@/hooks/usePlan";
import GlobalFooter from "@/components/shared/GlobalFooter";
import FounderMessage from "@/components/shared/FounderMessage"; // ✅ AJOUT DU COMPOSANT

const navItems = [
  { id: "overview", label: "Accueil", icon: LayoutDashboard, href: "/dashboard" },
  { id: "strategies", label: "Stratégies", icon: Target, href: "/dashboard/strategies" },
  { id: "credits", label: "Crédits", icon: CreditCard, href: "/dashboard/credits" },
  { id: "resources", label: "Ressources", icon: BookOpen, href: "/dashboard/resources" },
  { id: "settings", label: "Paramètres", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSession();
  const { quotaRemaining, isFree, isPro, isPremium, isEnterprise } = usePlan();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Utilisateur";

  // ✅ Calcul dynamique de quotaTotal pour éviter l'erreur TypeScript
  const getQuotaTotal = () => {
    if (isEnterprise) return 75; // Ou 999 pour illimité
    if (isPremium) return 30;
    if (isPro) return 10;
    return 1;
  };
  const quotaTotal = getQuotaTotal();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    const { createClient } = await import("@/lib/supabase");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Accueil";
    if (pathname.startsWith("/dashboard/strategies/new")) return "Nouvelle stratégie";
    if (pathname.startsWith("/dashboard/strategies")) return "Stratégies";
    if (pathname.startsWith("/dashboard/credits")) return "Crédits";
    if (pathname.startsWith("/dashboard/resources")) return "Ressources";
    if (pathname.startsWith("/dashboard/settings")) return "Paramètres";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#18181B] flex flex-col">
      {/* ══════════════════════════════════════════════════════
          SIDEBAR DESKTOP
      ═══════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-56 bg-white border-r border-[#E7E7EB] flex-col">
        <div className="h-14 flex items-center px-5 border-b border-[#E7E7EB]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">
              MakeIt<span className="text-[#6366F1]">Ads</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-[#6366F1]/5 text-[#6366F1]"
                    : "text-[#71717A] hover:text-[#18181B] hover:bg-[#F7F7F8]"
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-[#6366F1]" : ""}`} />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#E7E7EB]">
          <Link
            href="/dashboard/credits"
            className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#F7F7F8] border border-[#E7E7EB] hover:border-[#6366F1]/30 transition-all"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5 text-[#6366F1]" />
              <span className="text-xs font-medium text-[#18181B]">{quotaRemaining} crédits</span>
            </div>
            <span className="text-[10px] text-[#71717A]">/ {quotaTotal}</span>
          </Link>
        </div>

        <div className="p-3 border-t border-[#E7E7EB]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-[#71717A] hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════
          SIDEBAR MOBILE (Drawer)
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white border-r border-[#E7E7EB] flex flex-col"
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-[#E7E7EB]">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-lg font-bold">
                    MakeIt<span className="text-[#6366F1]">Ads</span>
                  </span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-[#71717A] hover:bg-[#F7F7F8]">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link key={item.id} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`group flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-all ${active ? "bg-[#6366F1]/5 text-[#6366F1]" : "text-[#71717A] hover:text-[#18181B] hover:bg-[#F7F7F8]"}`}>
                      <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-[#6366F1]" : ""}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              
              <div className="p-3 border-t border-[#E7E7EB] space-y-2">
                <Link href="/dashboard/credits" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#F7F7F8] border border-[#E7E7EB]">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#6366F1]" />
                    <span className="text-sm font-medium text-[#18181B]">{quotaRemaining} crédits</span>
                  </div>
                  <span className="text-xs text-[#71717A]">/ {quotaTotal}</span>
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#71717A] hover:text-red-600 hover:bg-red-50 transition-all">
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          CONTENU PRINCIPAL + FOOTER + NOTIFICATION FONDATEUR
      ═══════════════════════════════════════════════════════ */}
      <div className="lg:ml-56 min-h-screen flex flex-col flex-1">
        <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-md border-b border-[#E7E7EB] flex items-center px-4">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-1.5 -ml-1.5 mr-2 rounded-lg text-[#71717A] hover:bg-[#F7F7F8]">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-[#71717A] flex-1 min-w-0">
            <span className="truncate">MakeItAds</span>
            <span className="text-[#E7E7EB] flex-shrink-0">/</span>
            <span className="text-[#18181B] font-medium truncate">{getPageTitle()}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-[10px] font-bold text-white">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
            {children}
          </div>
          
          {/* ✅ FOOTER GLOBAL */}
          <GlobalFooter />
        </main>

        {/* ✅ NOTIFICATION DU FONDATEUR (Flottante, en dehors du flux principal pour ne pas être coupée) */}
        <FounderMessage />
      </div>
    </div>
  );
}