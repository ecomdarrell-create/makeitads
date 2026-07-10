"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Lock, 
  Loader2,
  FileText,
  Target,
  DollarSign,
  Users,
  Zap,
  Filter,
  List,
  LayoutGrid,
  X
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useSession } from "@/hooks/useSession";
import { createClient } from "@/lib/supabase";
import PageTransition from "@/components/ui/PageTransition";

interface Campaign {
  id: string;
  strategyId: string;
  strategyName: string;
  platform: string;
  headline: string;
  text: string;
  cta?: string;
  hook?: string;
  objective: string;
  budget: string;
  reach: string;
  targetPersona?: string;
  duration?: string;
  scheduledDay?: number;
  scheduledMonth?: number;
  scheduledYear?: number;
}

export default function CalendarClient() {
  const router = useRouter();
  const { user } = useSession();
  const { 
    isPro, 
    isPremium, 
    isEnterprise,
    canExportPDF,
    loading: permsLoading 
  } = usePermissions();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  // ✅ Par défaut "list" sur mobile, "calendar" sur desktop
  const [view, setView] = useState<"calendar" | "list">("list");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Auto-détection mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setView("list");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const loadCampaigns = async () => {
      if (!user) return;

      const supabase = createClient();
      setLoading(true);
      try {
        const { data: strategies, error } = await supabase
          .from("strategies")
          .select("id, title, created_at, data")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading campaigns:", error);
          return;
        }

        const allCampaigns: Campaign[] = [];
        
        strategies?.forEach((strategy: any) => {
          const strategyCampaigns = strategy.data?.campaigns || [];
          const strategyDate = new Date(strategy.created_at);
          
          strategyCampaigns.forEach((camp: any, index: number) => {
            const baseDate = new Date(strategyDate);
            const dayOffset = index % 30;
            const scheduledDate = new Date(baseDate);
            scheduledDate.setDate(scheduledDate.getDate() + dayOffset);
            
            allCampaigns.push({
              id: `${strategy.id}-${index}`,
              strategyId: strategy.id,
              strategyName: strategy.title,
              platform: camp.platform || "Other",
              headline: camp.headline || "Untitled Campaign",
              text: camp.text || "",
              cta: camp.cta,
              hook: camp.hook,
              objective: camp.objective || "Awareness",
              budget: camp.budget || "$0",
              reach: camp.reach || "0",
              targetPersona: camp.targetPersona,
              duration: camp.duration,
              scheduledDay: scheduledDate.getDate(),
              scheduledMonth: scheduledDate.getMonth(),
              scheduledYear: scheduledDate.getFullYear(),
            });
          });
        });

        setCampaigns(allCampaigns);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadCampaigns();
  }, [user]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    for (let i = 0; i < startDay; i++) days.push({ day: null, campaigns: [] });
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dayCampaigns = campaigns.filter(c => 
        c.scheduledDay === i && 
        c.scheduledMonth === month && 
        c.scheduledYear === year &&
        (selectedPlatform === "all" || c.platform.toLowerCase() === selectedPlatform.toLowerCase())
      );
      days.push({ day: i, campaigns: dayCampaigns });
    }
    return days;
  }, [year, month, campaigns, selectedPlatform]);

  const stats = useMemo(() => {
    const totalBudget = campaigns.reduce((sum, c) => {
      const budget = parseInt(c.budget.replace(/[^0-9]/g, "")) || 0;
      return sum + budget;
    }, 0);

    const byPlatform: Record<string, number> = {};
    campaigns.forEach(c => {
      byPlatform[c.platform] = (byPlatform[c.platform] || 0) + 1;
    });

    return {
      total: campaigns.length,
      totalBudget,
      byPlatform,
      strategies: [...new Set(campaigns.map(c => c.strategyId))].length,
    };
  }, [campaigns]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const changeMonth = (offset: number) => setCurrentDate(new Date(year, month + offset, 1));

  const getPlatformColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("meta") || p.includes("facebook") || p.includes("instagram")) return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    if (p.includes("tiktok")) return "bg-pink-500/20 text-pink-300 border-pink-500/30";
    if (p.includes("google")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (p.includes("linkedin")) return "bg-blue-700/20 text-blue-300 border-blue-700/30";
    if (p.includes("youtube")) return "bg-red-500/20 text-red-300 border-red-500/30";
    return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  };

  const getPlatformDotColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("meta") || p.includes("facebook") || p.includes("instagram")) return "bg-blue-500";
    if (p.includes("tiktok")) return "bg-pink-500";
    if (p.includes("google")) return "bg-emerald-500";
    if (p.includes("linkedin")) return "bg-blue-700";
    if (p.includes("youtube")) return "bg-red-500";
    return "bg-slate-500";
  };

  const handleExportICS = () => {
    if (!canExportPDF) {
      router.push("/dashboard/billing");
      return;
    }

    if (campaigns.length === 0) {
      alert("No campaigns to export.");
      return;
    }
    
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MakeItAds//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";
    
    campaigns.forEach((campaign) => {
      if (campaign.scheduledDay && campaign.scheduledMonth !== undefined && campaign.scheduledYear) {
        const date = new Date(campaign.scheduledYear, campaign.scheduledMonth, campaign.scheduledDay);
        const dateStr = date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${campaign.id}@makeitads.com\n`;
        icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z\n`;
        icsContent += `DTSTART:${dateStr}\n`;
        icsContent += `SUMMARY:${campaign.headline} (${campaign.platform})\n`;
        icsContent += `DESCRIPTION:${campaign.text.replace(/\n/g, "\\n")}\n`;
        icsContent += `LOCATION:${campaign.platform}\n`;
        icsContent += "END:VEVENT\n";
      }
    });
    
    icsContent += "END:VCALENDAR";
    
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `makeitads-campaigns-${year}-${month + 1}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!canExportPDF) {
      router.push("/dashboard/billing");
      return;
    }

    if (campaigns.length === 0) {
      alert("No campaigns to export.");
      return;
    }

    const headers = [
      "Strategy", "Platform", "Headline", "Text", "Objective",
      "Budget", "Reach", "Scheduled Date", "Duration", "CTA",
      "Hook", "Target Persona"
    ];

    const rows = campaigns.map(c => [
      `"${c.strategyName.replace(/"/g, '""')}"`,
      `"${c.platform.replace(/"/g, '""')}"`,
      `"${c.headline.replace(/"/g, '""')}"`,
      `"${c.text.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${c.objective.replace(/"/g, '""')}"`,
      `"${c.budget.replace(/"/g, '""')}"`,
      `"${c.reach.replace(/"/g, '""')}"`,
      c.scheduledDay && c.scheduledMonth !== undefined && c.scheduledYear
        ? `${c.scheduledYear}-${String(c.scheduledMonth + 1).padStart(2, '0')}-${String(c.scheduledDay).padStart(2, '0')}`
        : "",
      `"${(c.duration || "").replace(/"/g, '""')}"`,
      `"${(c.cta || "").replace(/"/g, '""')}"`,
      `"${(c.hook || "").replace(/"/g, '""')}"`,
      `"${(c.targetPersona || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `makeitads-campaigns-${year}-${month + 1}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading || permsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6366f1] mx-auto mb-4" />
          <p className="text-xs sm:text-sm text-slate-400">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-5 sm:space-y-6 lg:space-y-8">
        
        {/* ═══════════════════════════════════════════════════════════
            HEADER RESPONSIVE
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white no-hyphens">
                Campaign Planner
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Visualize and export your AI-generated campaigns
              </p>
            </div>
          </div>
          
          {/* Export buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleExportICS}
              disabled={!canExportPDF}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-95 ${
                canExportPDF 
                  ? "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.05] hover:text-white" 
                  : "border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed"
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export .ics</span>
              <span className="sm:hidden">ICS</span>
              {!canExportPDF && <Lock className="h-3 w-3 ml-1" />}
            </button>

            <button
              onClick={handleExportCSV}
              disabled={!canExportPDF}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-95 ${
                canExportPDF 
                  ? "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.05] hover:text-white" 
                  : "border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
              {!canExportPDF && <Lock className="h-3 w-3 ml-1" />}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            STATS CARDS - 2 colonnes mobile, 4 desktop
            ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-3 sm:p-5"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-[#8b5cf6]" />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-white no-hyphens">{stats.total}</p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 label-nowrap">Campaigns</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-3 sm:p-5"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-white no-hyphens">
              ${stats.totalBudget.toLocaleString()}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 label-nowrap">Budget</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-3 sm:p-5"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-[#38bdf8]/10 flex items-center justify-center">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-[#38bdf8]" />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-white no-hyphens">
              {Object.keys(stats.byPlatform).length}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 label-nowrap">Platforms</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-3 sm:p-5"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-white no-hyphens">{stats.strategies}</p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 label-nowrap">Strategies</p>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            PLATFORM DISTRIBUTION
            ═══════════════════════════════════════════════════════════ */}
        {Object.keys(stats.byPlatform).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
          >
            <h3 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4 no-hyphens">
              Campaign Distribution
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(stats.byPlatform).map(([platform, count]) => {
                const percentage = Math.round((count / stats.total) * 100);
                return (
                  <div key={platform}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full flex-shrink-0 ${getPlatformDotColor(platform)}`} />
                        <span className="text-xs sm:text-sm font-medium text-white capitalize truncate">{platform}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <span className="text-[10px] sm:text-xs text-slate-400">{count}</span>
                        <span className="text-[10px] sm:text-xs font-bold text-white">{percentage}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full ${
                          platform.toLowerCase().includes("meta") ? "bg-blue-500" :
                          platform.toLowerCase().includes("tiktok") ? "bg-pink-500" :
                          platform.toLowerCase().includes("google") ? "bg-emerald-500" :
                          platform.toLowerCase().includes("linkedin") ? "bg-blue-700" :
                          "bg-slate-500"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            EMPTY STATE
            ═══════════════════════════════════════════════════════════ */}
        {campaigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 sm:p-16 text-center"
          >
            <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4">
              <CalendarIcon className="h-7 w-7 sm:h-8 sm:w-8 text-amber-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 no-hyphens">No campaigns yet</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-5 sm:mb-6 max-w-md mx-auto">
              Generate your first strategy to see AI-powered campaigns.
            </p>
            <button
              onClick={() => router.push("/dashboard/strategies/new")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-105 transition-all active:scale-95"
            >
              <Zap className="h-4 w-4" />
              Create first strategy
            </button>
          </motion.div>
        ) : (
          <>
            {/* ═══════════════════════════════════════════════════════
                CONTROLS - Filters + View Toggle
                ═══════════════════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Platform filters - scrollables sur mobile */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <button
                  onClick={() => setSelectedPlatform("all")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedPlatform === "all"
                      ? "bg-[#6366f1] text-white"
                      : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.05]"
                  }`}
                >
                  All ({stats.total})
                </button>
                {Object.entries(stats.byPlatform).map(([platform, count]) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                      selectedPlatform.toLowerCase() === platform.toLowerCase()
                        ? "bg-[#6366f1] text-white"
                        : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${getPlatformDotColor(platform)}`} />
                    <span className="capitalize">{platform}</span>
                    <span className="opacity-60">({count})</span>
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 self-start sm:self-auto">
                <button
                  onClick={() => setView("calendar")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all ${
                    view === "calendar"
                      ? "bg-[#6366f1] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="h-3 w-3" />
                  <span className="hidden sm:inline">Calendar</span>
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all ${
                    view === "list"
                      ? "bg-[#6366f1] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <List className="h-3 w-3" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                CALENDAR VIEW - Desktop only
                ═══════════════════════════════════════════════════════ */}
            {view === "calendar" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden md:block rounded-2xl border border-white/10 bg-[#0f0f1a] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {monthNames[month]} {year}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeMonth(-1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setCurrentDate(new Date())} 
                      className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      Today
                    </button>
                    <button onClick={() => changeMonth(1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-px mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
                  {calendarDays.map((dayObj, index) => {
                    const isToday = dayObj.day === new Date().getDate() && 
                                   month === new Date().getMonth() && 
                                   year === new Date().getFullYear();
                    
                    return (
                      <div 
                        key={index} 
                        className={`min-h-[120px] bg-[#0f0f1a] p-2 transition-colors hover:bg-white/[0.02] ${
                          isToday ? "bg-[#6366f1]/5" : ""
                        }`}
                      >
                        {dayObj.day && (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-medium ${isToday ? "text-[#8b5cf6] font-bold" : "text-slate-400"}`}>
                                {dayObj.day}
                              </span>
                              {dayObj.campaigns.length > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#6366f1]/20 text-[#a5b4fc] font-bold">
                                  {dayObj.campaigns.length}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 space-y-1">
                              {dayObj.campaigns.slice(0, 3).map((campaign) => (
                                <div 
                                  key={campaign.id} 
                                  onClick={() => setSelectedCampaign(campaign)}
                                  className={`rounded-md border px-1.5 py-1 text-[10px] font-medium truncate flex items-center gap-1.5 cursor-pointer hover:brightness-125 transition-all ${getPlatformColor(campaign.platform)}`}
                                >
                                  <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${getPlatformDotColor(campaign.platform)}`} />
                                  <span className="truncate">{campaign.headline}</span>
                                </div>
                              ))}
                              {dayObj.campaigns.length > 3 && (
                                <div className="text-[10px] text-slate-500 text-center">
                                  +{dayObj.campaigns.length - 3} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════
                LIST VIEW - Mobile & Desktop
                ═══════════════════════════════════════════════════════ */}
            {view === "list" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-xl font-bold text-white no-hyphens">
                    {view === "list" ? "All Campaigns" : `${monthNames[month]} ${year}`}
                  </h2>
                  {view === "list" && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeMonth(-1)} className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <span className="text-xs sm:text-sm font-medium text-white">
                        {monthNames[month].slice(0, 3)} {year}
                      </span>
                      <button onClick={() => changeMonth(1)} className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors">
                        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  {campaigns
                    .filter(c => selectedPlatform === "all" || c.platform.toLowerCase() === selectedPlatform.toLowerCase())
                    .map((campaign, index) => (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => setSelectedCampaign(campaign)}
                        className="rounded-lg sm:rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4 hover:border-[#6366f1]/30 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className={`px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold flex-shrink-0 ${getPlatformColor(campaign.platform)}`}>
                              {campaign.platform}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-400 truncate">{campaign.objective}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400 flex-shrink-0">
                            {campaign.scheduledDay && (
                              <span>Day {campaign.scheduledDay}</span>
                            )}
                            <span className="text-emerald-400 font-bold">{campaign.budget}</span>
                          </div>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white mb-1 break-words">
                          {campaign.headline}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-2">{campaign.text}</p>
                        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/5 text-[10px] sm:text-xs flex-wrap">
                          <span className="text-slate-500 truncate">From: {campaign.strategyName}</span>
                          {campaign.reach && (
                            <span className="text-[#8b5cf6] flex-shrink-0">👥 {campaign.reach}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════
                SELECTED CAMPAIGN DETAIL - Modal bottom sheet sur mobile
                ═══════════════════════════════════════════════════════ */}
            {selectedCampaign && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
                onClick={() => setSelectedCampaign(null)}
              >
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-[#6366f1]/30 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-5 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold flex-shrink-0 ${getPlatformColor(selectedCampaign.platform)}`}>
                          {selectedCampaign.platform}
                        </span>
                        {selectedCampaign.scheduledDay && (
                          <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-[#6366f1]/20 text-[#a5b4fc]">
                            Day {selectedCampaign.scheduledDay}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg sm:text-2xl font-bold text-white break-words">
                        {selectedCampaign.headline}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate">
                        From: {selectedCampaign.strategyName}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedCampaign(null)}
                      className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 sm:mb-6 break-words">
                    {selectedCampaign.text}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] text-slate-500 mb-0.5 sm:mb-1">Objective</p>
                      <p className="text-xs sm:text-sm font-bold text-white break-words">{selectedCampaign.objective}</p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] text-slate-500 mb-0.5 sm:mb-1">Budget</p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-400">{selectedCampaign.budget}</p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] text-slate-500 mb-0.5 sm:mb-1">Reach</p>
                      <p className="text-xs sm:text-sm font-bold text-[#8b5cf6]">{selectedCampaign.reach}</p>
                    </div>
                    {selectedCampaign.duration && (
                      <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 sm:p-3">
                        <p className="text-[9px] sm:text-[10px] text-slate-500 mb-0.5 sm:mb-1">Duration</p>
                        <p className="text-xs sm:text-sm font-bold text-white">{selectedCampaign.duration}</p>
                      </div>
                    )}
                  </div>

                  {selectedCampaign.hook && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hook</p>
                      <span className="inline-block px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-[10px] sm:text-xs break-words">
                        {selectedCampaign.hook}
                      </span>
                    </div>
                  )}

                  {selectedCampaign.cta && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Call to Action</p>
                      <span className="inline-block px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs break-words">
                        {selectedCampaign.cta}
                      </span>
                    </div>
                  )}

                  {selectedCampaign.targetPersona && (
                    <div className="mb-4 sm:mb-6">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Persona</p>
                      <p className="text-[10px] sm:text-xs text-slate-300 break-words">{selectedCampaign.targetPersona}</p>
                    </div>
                  )}

                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
                    <button
                      onClick={() => router.push(`/dashboard/strategies/${selectedCampaign.strategyId}`)}
                      className="text-xs sm:text-sm text-[#8b5cf6] hover:text-white transition-colors"
                    >
                      View full strategy →
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}