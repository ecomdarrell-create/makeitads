"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Calendar,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Crown,
  Zap,
  ChevronRight,
  HelpCircle,
  Lock,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Strategies", href: "/dashboard/strategies", icon: Sparkles },
  { 
    label: "Competitor Watch", 
    href: "/dashboard/competitors", 
    icon: Users, 
    requiredFeature: "competitorIntelligence" as const,
    requiredPlan: "pro" as const,
  },
  { label: "Campaign Planner", href: "/dashboard/calendar", icon: Calendar },
  { label: "Strategy Insights", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

const bottomItems = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    userPlan, 
    isFree, 
    isPro, 
    isPremium, 
    isEnterprise,
    can,
    quotaUsed,
    quotaLimit,
  } = usePermissions();
  
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("❌ Sidebar auth error:", error);
          return;
        }
        
        if (user) {
          setUserName(user.user_metadata?.first_name || user.email?.split("@")[0] || "User");
          setUserEmail(user.email || "");
        }
      } catch (err) {
        console.error("❌ Sidebar getUser error:", err);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  const getPlanBadge = () => {
    if (isEnterprise) {
      return (
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/30">
          <Crown className="h-3.5 w-3.5" />
          <span>Enterprise</span>
        </div>
      );
    }
    if (isPremium) {
      return (
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] px-3 py-2 text-xs font-bold text-white shadow-lg shadow-[#6366f1]/30">
          <Crown className="h-3.5 w-3.5" />
          <span>Premium</span>
        </div>
      );
    }
    if (isPro) {
      return (
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] px-3 py-2 text-xs font-bold text-white">
          <Zap className="h-3.5 w-3.5" />
          <span>Pro</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-300">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        <span>Free</span>
      </div>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-white/10 bg-[#0a0a14] shadow-lg">
      <div className="flex h-16 flex-col justify-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-0.5 transition-transform hover:scale-105">
          <span className="text-[17px] font-bold text-white tracking-tight">Make</span>
          <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-[17px] font-bold text-transparent tracking-tight">
            ItAds
          </span>
        </Link>
        <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
          Marketing Strategist
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const isLocked = item.requiredFeature ? !can(item.requiredFeature) : false;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              } ${isLocked ? "opacity-50" : ""}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]"
                />
              )}
              <item.icon className={`h-[15px] w-[15px] ${isActive ? "text-[#8b5cf6]" : ""}`} strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
              {isLocked && (
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  <Lock className="h-2.5 w-2.5" />
                  {item.requiredPlan}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-4 border-t border-white/10" />

        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Account
        </p>

        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]"
                />
              )}
              <item.icon className={`h-[15px] w-[15px] ${isActive ? "text-[#8b5cf6]" : ""}`} strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3 space-y-2">
        {isFree && (
          <div className="rounded-lg bg-white/[0.02] border border-white/10 p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Monthly Quota
              </span>
              <span className="text-[10px] font-bold text-white">
                {quotaUsed}/{quotaLimit}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (quotaUsed / quotaLimit) * 100)}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full ${
                  quotaUsed >= quotaLimit
                    ? "bg-gradient-to-r from-red-500 to-red-400"
                    : "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                }`}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/10 p-2.5">
          {getPlanBadge()}
          {isFree && (
            <button 
              onClick={() => router.push("/dashboard/billing")}
              className="flex items-center gap-1 rounded-md bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-2.5 py-1 text-[11px] font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#6366f1]/30"
            >
              Upgrade
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/10 px-3 py-2.5 hover:bg-white/[0.05] transition-all group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-[11px] font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate">{userName}</p>
            <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>

        <a 
          href="mailto:contact@makeitads.com?subject=Help%20%26%20Support%20Request"
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-medium text-slate-400 hover:bg-white/[0.05] hover:text-white transition-all"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Help & Support</span>
        </a>
      </div>
    </aside>
  );
}