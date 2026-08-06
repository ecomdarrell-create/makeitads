"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Sparkles, Users, Calendar, BarChart3, CreditCard,
  Settings, LogOut, Crown, Zap, ChevronRight, HelpCircle, Lock, Mail, Megaphone, X
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Strategies", href: "/dashboard/strategies", icon: Sparkles },
  { label: "Competitor Watch", href: "/dashboard/competitors", icon: Users, requiredFeature: "competitorIntelligence" as const, requiredPlan: "pro" as const },
  { label: "Campaign Planner", href: "/dashboard/calendar", icon: Calendar },
  { label: "Strategy Insights", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

const CEO_EMAIL = "darrellkamga@gmail.com"; 

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isFree, isPro, isPremium, isEnterprise, can, quotaUsed, quotaLimit } = usePermissions();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.first_name || user.email?.split("@")[0] || "User");
        setUserEmail(user.email || "");
      }
    };
    getUser();
  }, []);

  const adminItems = userEmail === CEO_EMAIL ? [
    { label: "Admin Emails", href: "/dashboard/admin/emails", icon: Mail },
    { label: "Newsletters", href: "/dashboard/admin/newsletters", icon: Megaphone },
  ] : [];

  const bottomItems = [...adminItems, { label: "Settings", href: "/dashboard/settings", icon: Settings }];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    if (onClose) onClose(); // Ferme la sidebar sur mobile après navigation
  };

  const getPlanBadge = () => {
    if (isEnterprise) return <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-xs font-bold text-white shadow-sm"><Crown className="h-3.5 w-3.5" /> Enterprise</div>;
    if (isPremium) return <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-2 text-xs font-bold text-white shadow-sm"><Crown className="h-3.5 w-3.5" /> Premium</div>;
    if (isPro) return <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-2 text-xs font-bold text-white shadow-sm"><Zap className="h-3.5 w-3.5" /> Pro</div>;
    return <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-xs font-bold text-[#64748B]"><span className="h-1.5 w-1.5 rounded-full bg-[#9CA3AF]" /> Free</div>;
  };

  return (
    <aside className="flex flex-col h-screen w-[260px] bg-[#FFFFFF] border-r border-[#E5E7EB]">
      
      {/* Bouton fermer (mobile uniquement) */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-1 rounded-lg hover:bg-[#F3F4F6] text-[#64748B]"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="flex h-[64px] flex-col justify-center px-6 border-b border-[#E5E7EB]">
        <Link href="/" onClick={onClose} className="flex items-center gap-0.5 transition-opacity hover:opacity-80">
          <span className="text-[17px] font-bold text-[#111827] tracking-tight">MakeIt</span>
          <span className="text-[17px] font-bold text-[#6366F1] tracking-tight">Ads</span>
        </Link>
        <span className="text-[9px] font-medium text-[#94A3B8] uppercase tracking-wider mt-0.5">Marketing Strategist</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8]">Workspace</p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const isLocked = item.requiredFeature ? !can(item.requiredFeature) : false;
          
          return (
            <button 
              key={item.href} 
              onClick={() => handleNavigation(item.href)}
              className={`w-full group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 text-left ${
                isActive ? "bg-[#6366F1]/10 text-[#6366F1]" : "text-[#64748B] hover:bg-[#F9FAFB] hover:text-[#111827]"
              } ${isLocked ? "opacity-50" : ""}`}
            >
              {isActive && <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#6366F1]" />}
              <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-[#6366F1]" : "text-[#94A3B8] group-hover:text-[#64748B]"}`} strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
              {isLocked && (
                <span className="inline-flex items-center gap-1 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  <Lock className="h-2.5 w-2.5" /> {item.requiredPlan}
                </span>
              )}
            </button>
          );
        })}

        <div className="my-4 border-t border-[#E5E7EB]" />
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8]">Account</p>

        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button 
              key={item.href} 
              onClick={() => handleNavigation(item.href)}
              className={`w-full group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 text-left ${
                isActive ? "bg-[#6366F1]/10 text-[#6366F1]" : "text-[#64748B] hover:bg-[#F9FAFB] hover:text-[#111827]"
              }`}
            >
              {isActive && <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#6366F1]" />}
              <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-[#6366F1]" : "text-[#94A3B8] group-hover:text-[#64748B]"}`} strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#E5E7EB] p-3 space-y-2">
        {isFree && (
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Monthly Quota</span>
              <span className="text-[10px] font-bold text-[#111827]">{quotaUsed}/{quotaLimit}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (quotaUsed / quotaLimit) * 100)}%` }} transition={{ duration: 0.8 }}
                className={`h-full ${quotaUsed >= quotaLimit ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"}`} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
          {getPlanBadge()}
          {isFree && (
            <button onClick={() => handleNavigation("/dashboard/billing")}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-2.5 py-1.5 text-[11px] font-bold text-white transition-all hover:shadow-md active:scale-95">
              Upgrade <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 hover:bg-[#F3F4F6] transition-all group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-[11px] font-bold text-white flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[#111827] truncate">{userName}</p>
            <p className="text-[10px] text-[#64748B] truncate">{userEmail}</p>
          </div>
          <button onClick={handleLogout} className="text-[#94A3B8] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1" title="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <a href="mailto:contact@makeitads.pro" className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-[12px] font-medium text-[#64748B] hover:bg-[#F9FAFB] hover:text-[#111827] transition-all">
          <HelpCircle className="h-4 w-4" />
          <span>Help & Support</span>
        </a>
      </div>
    </aside>
  );
}