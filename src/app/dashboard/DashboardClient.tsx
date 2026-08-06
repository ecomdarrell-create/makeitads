"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, TrendingUp, Target, BarChart3, Calendar, Zap, ArrowRight, Lock, Plus, Activity, Award, Globe, FileText, Brain, Rocket, ChevronRight, Eye, Users, CheckCircle2, AlertCircle, Lightbulb, Download, Building2, Bell, Trophy, Star, ArrowUpRight, ArrowDownRight, Minus, Heart, Gauge, Megaphone, Loader2, Crown, PenTool,
} from "lucide-react";
import { usePlan } from "@/hooks/usePlan";
import { useSession } from "@/hooks/useSession";
import { useUsage } from "@/hooks/useUsage";
import { createClient } from "@/lib/supabase";

interface Strategy { id: string; title: string; industry: string; objective: string; created_at: string; data?: { overview?: { marketScore?: number }; campaigns?: Array<{ platform: string }> }; }
interface Competitor { id: string; data: { name: string; overallScore: number; position: string; }; created_at: string; }
interface BusinessProfile { business_name?: string; industry?: string; city?: string; country?: string; business_model?: string; maturity?: string; target_audience?: string; brand_positioning?: string; tone?: string; }
interface ActivityEvent { id: string; type: string; title: string; description?: string; link?: string; metadata?: any; created_at: string; }

function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0; const end = value; const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000; const progress = Math.min(elapsed / duration, 1); const eased = 1 - Math.pow(1 - progress, 3); setDisplay(Math.round(start + (end - start) * eased)); if (progress < 1) requestAnimationFrame(animate);
    }; requestAnimationFrame(animate);
  }, [value, duration]); return <span>{display.toLocaleString()}</span>;
}

function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) return <span className="flex items-center gap-0.5 text-[10px] text-[#64748B] font-bold"><Minus className="h-3 w-3" /> Stable</span>;
  const change = previous === 0 ? 100 : ((current - previous) / previous) * 100;
  const isPositive = change > 0;
  return (
    <span className={`flex items-center gap-0.5 text-[10px] font-bold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {isPositive ? "+" : ""}{change.toFixed(0)}%
    </span>
  );
}

export default function DashboardClient() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const { isPro, isPremium, isEnterprise, loading: planLoading } = usePlan();
  const { usage: usageData, loading: usageLoading } = useUsage();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;
      const supabase = createClient();
      try {
        const { data: stratData } = await supabase.from("strategies").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        const { data: compData } = await supabase.from("competitors").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        const { data: profileData } = await supabase.from("business_profiles").select("*").eq("user_id", user.id).maybeSingle();
        const { data: eventsData } = await supabase.from("activity_events").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
        setStrategies(stratData || []); setCompetitors(compData || []); setBusinessProfile(profileData); setActivityEvents(eventsData || []);
      } catch (error) { console.error("Error fetching data:", error); }
      finally { setLoading(false); }
    };
    if (user) fetchAllData();
  }, [user]);

  const totalStrategies = strategies.length;
  const totalCompetitors = competitors.length;
  const totalCampaigns = strategies.reduce((sum, s) => sum + (s.data?.campaigns?.length || 0), 0);
  const avgMarketScore = strategies.length > 0 ? Math.round(strategies.reduce((sum, s) => sum + (s.data?.overview?.marketScore || 0), 0) / strategies.length) : 0;

  const profileCompletion = useMemo(() => {
    if (!businessProfile) return 0;
    const fields = [businessProfile.business_name, businessProfile.industry, businessProfile.city, businessProfile.country, businessProfile.business_model, businessProfile.maturity, businessProfile.target_audience, businessProfile.brand_positioning, businessProfile.tone];
    return Math.round((fields.filter((f) => f && f.trim().length > 0).length / fields.length) * 100);
  }, [businessProfile]);

  const businessHealthScore = useMemo(() => Math.round([profileCompletion, Math.min(100, (totalCompetitors / 10) * 100), Math.min(100, avgMarketScore), Math.round([profileCompletion, totalStrategies > 0 ? 100 : 0, Math.min(100, (totalCompetitors / 10) * 100)].reduce((a, b) => a + b, 0) / 3)].reduce((a, b) => a + b, 0) / 4), [profileCompletion, totalCompetitors, avgMarketScore, totalStrategies]);

  if (sessionLoading || planLoading || loading || usageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FAFAFC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6366F1] mx-auto mb-3" />
          <p className="text-sm text-[#64748B]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "there";
  const isCEO = user?.email === "darrellkamga@gmail.com";

  return (
    <div id="dashboard-export-content" className="space-y-6 sm:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Welcome back, {firstName}</h1>
            {isEnterprise && <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-white flex items-center gap-1"><Star className="h-3 w-3" /> ENTERPRISE</span>}
            {isPremium && <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-xs font-bold text-white">PREMIUM</span>}
            {isPro && <span className="px-2 py-0.5 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold border border-[#6366F1]/20">PRO</span>}
          </motion.div>
          <p className="text-sm text-[#64748B]">Here's your marketing command center.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {!usageLoading && usageData.strategiesLimit !== -1 && (
            <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 w-full sm:w-auto shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-3.5 w-3.5 text-[#6366F1] flex-shrink-0" />
                <span className="text-xs font-medium text-[#64748B]">Strategies this month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 sm:w-32 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${usageData.strategiesUsed >= usageData.strategiesLimit ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"}`} style={{ width: `${Math.min(100, (usageData.strategiesUsed / usageData.strategiesLimit) * 100)}%` }} />
                </div>
                <span className="text-sm font-bold text-[#111827] flex-shrink-0">{usageData.strategiesUsed}/{usageData.strategiesLimit}</span>
              </div>
            </div>
          )}
          <button onClick={() => {}} disabled={isExporting}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all disabled:opacity-50 shadow-sm">
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span className="hidden sm:inline">{isExporting ? "Generating..." : "Export PDF"}</span>
          </button>
        </div>
      </div>

      {/* 🎯 AI COMMAND CENTER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} 
        className="rounded-2xl border border-[#6366F1]/20 bg-[#EEF2FF] p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366F1]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#111827]">Intelligent Command Center</h2>
              <p className="text-xs text-[#64748B]">Your automated marketing assistant</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3"><Activity className="h-4 w-4 text-[#38BDF8]" /><h3 className="text-sm font-bold text-[#111827]">What happened?</h3></div>
              <p className="text-xs text-[#475569] leading-relaxed">You generated {totalStrategies} strateg{totalStrategies === 1 ? "y" : "ies"} with an average score of {avgMarketScore}/100.</p>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3"><Rocket className="h-4 w-4 text-emerald-600" /><h3 className="text-sm font-bold text-[#111827]">What's next?</h3></div>
              <p className="text-xs text-[#475569] leading-relaxed">{totalCompetitors === 0 ? "Run a Competitor Scan to discover who you're up against." : "Track more competitors to get a complete market view."}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-emerald-600" /><h3 className="text-sm font-bold text-emerald-800">Expected impact</h3></div>
              <p className="text-xs text-emerald-700 leading-relaxed">Implementing these recommendations could increase your market visibility by 25-40% within 90 days.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* BUSINESS HEALTH CARD */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} 
        className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#111827]">Business Health</h2>
              <p className="text-xs text-[#64748B]">Your overall readiness score</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-bold text-[#111827]"><AnimatedNumber value={businessHealthScore} /><span className="text-xl sm:text-2xl text-[#94A3B8]">/100</span></div>
            <p className="text-xs text-[#64748B] mt-1">{businessHealthScore >= 80 ? "Excellent" : businessHealthScore >= 60 ? "Good" : "Needs work"}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Marketing Readiness", value: profileCompletion, icon: Megaphone, color: "from-[#6366F1] to-[#8B5CF6]" },
            { label: "Competitor Coverage", value: Math.min(100, (totalCompetitors / 10) * 100), icon: Eye, color: "from-emerald-500 to-teal-500" },
            { label: "Strategy Maturity", value: Math.min(100, avgMarketScore), icon: Target, color: "from-amber-500 to-orange-500" },
            { label: "AI Readiness", value: Math.round((profileCompletion + (totalStrategies > 0 ? 100 : 0)) / 2), icon: Brain, color: "from-pink-500 to-rose-500" },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="h-4 w-4 text-[#64748B]" />
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{item.label}</p>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={`h-full bg-gradient-to-r ${item.color}`} />
                </div>
                <span className="text-xs font-bold text-[#111827] min-w-[32px] text-right">{item.value}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* PRIMARY KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, color: "text-[#6366F1]", bg: "bg-[#6366F1]/10", label: "Strategies Generated", value: totalStrategies },
          { icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50", label: "Avg. Market Score", value: avgMarketScore || "—" },
          { icon: Eye, color: "text-blue-600", bg: "bg-blue-50", label: "Competitors Tracked", value: totalCompetitors },
          { icon: Calendar, color: "text-pink-600", bg: "bg-pink-50", label: "Campaigns Planned", value: totalCampaigns },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} 
            className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#111827]">{typeof kpi.value === "number" ? <AnimatedNumber value={kpi.value} /> : kpi.value}</p>
            <p className="text-xs text-[#64748B] mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 🎯 CEO INSIGHTS MANAGEMENT (Visible uniquement pour le CEO) */}
      {isCEO && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-[#6366F1]/30 bg-[#EEF2FF] p-5 sm:p-6 hover:shadow-md transition-all cursor-pointer group"
          onClick={() => router.push("/admin/insights")}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-[#6366F1] flex items-center justify-center shadow-sm">
              <PenTool className="h-5 w-5 text-white" />
            </div>
            <span className="px-2 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-bold uppercase tracking-wider">CEO Only</span>
          </div>
          <h3 className="text-lg font-bold text-[#111827] mb-1 group-hover:text-[#6366F1] transition-colors">Manage Insights</h3>
          <p className="text-sm text-[#64748B]">Rédige, modifie et publie les articles du blog MakeItAds.</p>
        </motion.div>
      )}

      {/* QUICK ACTIONS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} 
        className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-[#6366F1]" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { title: "New Strategy", desc: "Generate with AI", icon: Sparkles, color: "text-[#6366F1]", onClick: () => router.push("/dashboard/strategies/new") },
            { title: "Scan Competitors", desc: "Discover market", icon: Eye, color: "text-emerald-600", onClick: () => router.push("/dashboard/competitors") },
            { title: "Campaign Planner", desc: "Schedule campaigns", icon: Calendar, color: "text-pink-600", onClick: () => router.push("/dashboard/calendar") },
            { title: "View Analytics", desc: "Deep insights", icon: BarChart3, color: "text-amber-600", onClick: () => router.push("/dashboard/analytics") },
          ].map((action, i) => (
            <motion.button key={action.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} 
              onClick={action.onClick} 
              className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFC] p-4 text-left hover:border-[#6366F1]/30 hover:bg-[#6366F1]/5 transition-all group">
              <action.icon className={`h-5 w-5 mb-2 ${action.color}`} />
              <p className="text-sm font-bold text-[#111827] group-hover:text-[#6366F1] transition-colors">{action.title}</p>
              <p className="text-[11px] text-[#64748B] mt-1">{action.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}