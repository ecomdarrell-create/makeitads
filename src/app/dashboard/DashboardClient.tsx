"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, TrendingUp, Target, BarChart3, Calendar, Zap, ArrowRight, Lock, Plus, Activity, Award, Globe, FileText, Brain, Rocket, ChevronRight, Eye, Users, CheckCircle2, AlertCircle, Lightbulb, Download, Building2, Bell, Trophy, Star, Flame, ArrowUpRight, ArrowDownRight, Minus, Shield, Heart, Compass, Gauge, Database, Sparkle, RefreshCw, Megaphone, LineChart, Loader2, Crown,
} from "lucide-react";
import { usePlan } from "@/hooks/usePlan";
import { useSession } from "@/hooks/useSession";
import { useUsage } from "@/hooks/useUsage";
import { createClient } from "@/lib/supabase";
import { exportDashboardToPDF } from "@/utils/exportDashboard";

interface Strategy {
  id: string;
  title: string;
  industry: string;
  objective: string;
  created_at: string;
  data?: {
    overview?: { marketScore?: number; competition?: string; growthPotential?: string; estimatedROI?: string; };
    aiRecommendation?: { opportunity: string; confidence: string; priority: string; };
    campaigns?: Array<{ platform: string }>;
    recommendations?: Array<{ title: string; priority: string }>;
  };
}

interface Competitor {
  id: string;
  data: { name: string; overallScore: number; position: string; industry: string; city: string; traffic: number; marketShare: number; growth: number; };
  created_at: string;
}

interface BusinessProfile {
  business_name?: string; industry?: string; city?: string; country?: string; business_model?: string; maturity?: string; products?: string; services?: string; target_audience?: string; competitors?: string; brand_positioning?: string; tone?: string;
}

interface ActivityEvent {
  id: string; type: string; title: string; description?: string; link?: string; metadata?: any; created_at: string;
}

type TrendPeriod = "7d" | "30d";
type ActivityFilter = "all" | "strategy" | "competitor" | "campaign" | "profile" | "export";

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
  if (previous === 0 && current === 0) return <span className="flex items-center gap-0.5 text-[10px] text-slate-500 font-bold"><Minus className="h-3 w-3" /> Stable</span>;
  const change = previous === 0 ? 100 : ((current - previous) / previous) * 100;
  const isPositive = change > 0;
  return (
    <span className={`flex items-center gap-0.5 text-[10px] font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
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
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>("7d");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;
      const supabase = createClient();
      try {
        const { data: stratData } = await supabase.from("strategies").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        const { data: compData } = await supabase.from("competitors").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        const { data: profileData } = await supabase.from("business_profiles").select("*").eq("user_id", user.id).maybeSingle();
        const { data: eventsData } = await supabase.from("activity_events").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
        setStrategies(stratData || []);
        setCompetitors(compData || []);
        setBusinessProfile(profileData);
        setActivityEvents(eventsData || []);
      } catch (error) { console.error("Error fetching data:", error); }
      finally { setLoading(false); }
    };
    if (user) fetchAllData();
  }, [user]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    const supabase = createClient();
    try {
      await exportDashboardToPDF("dashboard-export-content");
      if (user) {
        await supabase.from("notifications").insert({
          user_id: user.id,
          type: "info",
          title: "📄 Report exported",
          message: "Your dashboard report has been downloaded successfully.",
          link: "/dashboard",
          is_read: false,
        });
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const totalStrategies = strategies.length;
  const totalCompetitors = competitors.length;
  const totalCampaigns = strategies.reduce((sum, s) => sum + (s.data?.campaigns?.length || 0), 0);
  const avgMarketScore = strategies.length > 0 ? Math.round(strategies.reduce((sum, s) => sum + (s.data?.overview?.marketScore || 0), 0) / strategies.length) : 0;

  const profileCompletion = useMemo(() => {
    if (!businessProfile) return 0;
    const fields = [businessProfile.business_name, businessProfile.industry, businessProfile.city, businessProfile.country, businessProfile.business_model, businessProfile.maturity, businessProfile.target_audience, businessProfile.brand_positioning, businessProfile.tone];
    return Math.round((fields.filter((f) => f && f.trim().length > 0).length / fields.length) * 100);
  }, [businessProfile]);

  const competitorCoverage = useMemo(() => Math.min(100, Math.round((totalCompetitors / 10) * 100)), [totalCompetitors]);
  const campaignPlanning = useMemo(() => Math.min(100, Math.round((totalCampaigns / 5) * 100)), [totalCampaigns]);
  const marketCoverage = useMemo(() => {
    const industries = [...new Set(strategies.map((s) => s.industry).filter(Boolean))];
    return Math.min(100, Math.round((industries.length / 3) * 100));
  }, [strategies]);
  const aiReadiness = useMemo(() => {
    return Math.round([profileCompletion, totalStrategies > 0 ? 100 : 0, competitorCoverage, marketCoverage].reduce((a, b) => a + b, 0) / 4);
  }, [profileCompletion, totalStrategies, competitorCoverage, marketCoverage]);

  const businessHealthScore = useMemo(() => {
    const scores = [profileCompletion, competitorCoverage, Math.min(100, avgMarketScore), aiReadiness, Math.round((profileCompletion + (totalStrategies > 0 ? 100 : 0) + competitorCoverage) / 3)];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [profileCompletion, competitorCoverage, avgMarketScore, aiReadiness, totalStrategies]);

  const trendData = useMemo(() => {
    const now = new Date();
    const currentPeriodStart = new Date();
    const previousPeriodStart = new Date();
    if (trendPeriod === "7d") { currentPeriodStart.setDate(now.getDate() - 7); previousPeriodStart.setDate(now.getDate() - 14); }
    else { currentPeriodStart.setDate(now.getDate() - 30); previousPeriodStart.setDate(now.getDate() - 60); }
    return {
      strategies: { current: strategies.filter((s) => new Date(s.created_at) >= currentPeriodStart).length, previous: strategies.filter((s) => { const d = new Date(s.created_at); return d >= previousPeriodStart && d < currentPeriodStart; }).length },
      competitors: { current: competitors.filter((c) => new Date(c.created_at) >= currentPeriodStart).length, previous: competitors.filter((c) => { const d = new Date(c.created_at); return d >= previousPeriodStart && d < currentPeriodStart; }).length }
    };
  }, [strategies, competitors, trendPeriod]);

  const enrichedActivityFeed = useMemo(() => {
    const feed: ActivityEvent[] = [];
    strategies.slice(0, 10).forEach((s) => feed.push({ id: `strat-${s.id}`, type: "strategy", title: "New strategy generated", description: `${s.title} (${s.industry})`, link: `/dashboard/strategies/${s.id}`, metadata: { score: s.data?.overview?.marketScore }, created_at: s.created_at }));
    competitors.slice(0, 10).forEach((c) => feed.push({ id: `comp-${c.id}`, type: "competitor", title: "Competitor added", description: `${c.data.name} - ${c.data.position}`, link: `/dashboard/competitors/${c.id}`, metadata: { score: c.data.overallScore }, created_at: c.created_at }));
    activityEvents.forEach((e) => feed.push(e));
    return feed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20);
  }, [strategies, competitors, activityEvents]);

  const filteredActivityFeed = useMemo(() => activityFilter === "all" ? enrichedActivityFeed : enrichedActivityFeed.filter((e) => e.type === activityFilter), [enrichedActivityFeed, activityFilter]);

  const welcomeSteps = useMemo(() => [
    { id: "profile", title: "Complete your Business Profile", description: "Set up your business information for accurate strategies", completed: profileCompletion >= 80, link: "/dashboard/strategies/new", icon: Building2 },
    { id: "strategy", title: "Generate your first strategy", description: "Let AI create a tailored marketing strategy for you", completed: totalStrategies >= 1, link: "/dashboard/strategies/new", icon: Sparkles },
    { id: "competitors", title: "Launch your first Competitor Scan", description: "Discover who your competitors are and how to beat them", completed: totalCompetitors >= 1, link: "/dashboard/competitors", icon: Eye },
    { id: "campaigns", title: "Plan your first campaigns", description: "Turn your strategy into actionable campaigns", completed: totalCampaigns >= 1, link: "/dashboard/calendar", icon: Calendar },
  ], [profileCompletion, totalStrategies, totalCompetitors, totalCampaigns]);

  const welcomeCompleted = welcomeSteps.every((s) => s.completed);

  const milestones = useMemo(() => [
    { id: "first-strategy", title: "First Strategy", description: "Generated your first AI strategy", unlocked: totalStrategies >= 1, icon: Sparkles, color: "from-[#6366f1] to-[#8b5cf6]" },
    { id: "five-strategies", title: "Strategy Master", description: "Generated 5 strategies", unlocked: totalStrategies >= 5, icon: Star, color: "from-amber-500 to-orange-500" },
    { id: "first-competitor", title: "Market Watcher", description: "Tracked your first competitor", unlocked: totalCompetitors >= 1, icon: Eye, color: "from-emerald-500 to-green-500" },
    { id: "ten-competitors", title: "Competitive Intelligence", description: "Tracked 10+ competitors", unlocked: totalCompetitors >= 10, icon: Users, color: "from-blue-500 to-cyan-500" },
    { id: "high-score", title: "Market Leader", description: "Achieved 80+ average market score", unlocked: avgMarketScore >= 80, icon: Trophy, color: "from-amber-500 to-yellow-500" },
    { id: "complete-profile", title: "Profile Complete", description: "Completed your business profile", unlocked: profileCompletion >= 100, icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
  ], [totalStrategies, totalCompetitors, avgMarketScore, profileCompletion]);

  const unlockedMilestones = milestones.filter((m) => m.unlocked).length;

  const aiCommandCenter = useMemo(() => {
    const whatHappened: string[] = [];
    const whatNext: string[] = [];
    let expectedImpact = "";
    if (totalStrategies > 0) whatHappened.push(`You generated ${totalStrategies} strateg${totalStrategies === 1 ? "y" : "ies"}${totalStrategies > 1 ? " with an average score of " + avgMarketScore + "/100" : ""}.`);
    if (totalCompetitors > 0) whatHappened.push(`${totalCompetitors} competitor${totalCompetitors === 1 ? "" : "s"} ${totalCompetitors === 1 ? "is" : "are"} being tracked.`);
    if (totalCampaigns > 0) whatHappened.push(`${totalCampaigns} campaign${totalCampaigns === 1 ? "" : "s"} planned across your strategies.`);
    if (whatHappened.length === 0) whatHappened.push("Welcome to MakeItAds! Your marketing assistant is ready to help you grow.");
    if (profileCompletion < 80) whatNext.push("Complete your Business Profile to unlock more accurate recommendations.");
    if (totalStrategies === 0) whatNext.push("Generate your first strategy to get started.");
    else if (totalStrategies < 3) whatNext.push("Create at least 3 strategies to unlock trend analysis and deeper insights.");
    if (totalCompetitors === 0) whatNext.push("Run a Competitor Scan to discover who you're up against.");
    else if (totalCompetitors < 5) whatNext.push("Track more competitors to get a complete market view.");
    if (totalCampaigns === 0 && totalStrategies > 0) whatNext.push("Review your campaigns in the Campaign Planner to start executing.");
    if (totalStrategies >= 3 && totalCompetitors >= 5) expectedImpact = "Based on your activity, implementing the recommendations could increase your market visibility by 25-40% within 90 days.";
    else if (totalStrategies > 0) expectedImpact = "Complete your setup to unlock the full potential of marketing insights.";
    else expectedImpact = "Getting started typically helps businesses identify 3-5 high-impact opportunities within the first week.";
    return { whatHappened, whatNext, expectedImpact };
  }, [totalStrategies, totalCompetitors, totalCampaigns, avgMarketScore, profileCompletion]);

  const recentAIInsights = useMemo(() => {
    const insights: Array<{ title: string; description: string; type: "opportunity" | "warning" | "success"; link: string }> = [];
    const strongCompetitors = competitors.filter((c) => (c.data.overallScore || 0) >= 80);
    if (strongCompetitors.length > 0) insights.push({ title: `${strongCompetitors.length} strong competitor${strongCompetitors.length === 1 ? "" : "s"} detected`, description: `${strongCompetitors[0].data.name} has a score of ${strongCompetitors[0].data.overallScore}/100. Analyze their strategy to learn from the best.`, type: "warning", link: `/dashboard/competitors/${strongCompetitors[0].id}` });
    if (avgMarketScore >= 70) insights.push({ title: "Excellent market positioning", description: `Your strategies average ${avgMarketScore}/100. You're outperforming most businesses in your sector.`, type: "success", link: "/dashboard/analytics" });
    else if (avgMarketScore > 0 && avgMarketScore < 60) insights.push({ title: "Room for improvement", description: `Your average score is ${avgMarketScore}/100. Adding more details could boost this.`, type: "warning", link: "/dashboard/strategies/new" });
    const industries = [...new Set(strategies.map((s) => s.industry).filter(Boolean))];
    if (industries.length >= 2) insights.push({ title: "Multi-industry expertise", description: `You're analyzing ${industries.length} different industries. This gives you a unique cross-market perspective.`, type: "success", link: "/dashboard/analytics" });
    if (totalCampaigns > 0 && totalCampaigns < 3) insights.push({ title: "Expand your campaign portfolio", description: `You have ${totalCampaigns} campaign${totalCampaigns === 1 ? "" : "s"} planned. Diversifying across platforms increases reach.`, type: "opportunity", link: "/dashboard/calendar" });
    return insights.slice(0, 3);
  }, [competitors, avgMarketScore, strategies, totalCampaigns]);

  const quickActions = useMemo(() => {
    const actions = [];
    if (totalStrategies === 0) actions.push({ title: "Generate New Strategy", description: "Start with AI", icon: Sparkles, color: "text-[#8b5cf6]", onClick: () => router.push("/dashboard/strategies/new"), priority: 1 });
    else actions.push({ title: "Generate New Strategy", description: `${totalStrategies} created`, icon: Sparkles, color: "text-[#8b5cf6]", onClick: () => router.push("/dashboard/strategies/new"), priority: 3 });
    if (totalCompetitors === 0) actions.push({ title: "Scan Competitors", description: "Discover your market", icon: Eye, color: "text-emerald-400", onClick: () => router.push("/dashboard/competitors"), priority: 1 });
    else actions.push({ title: "Scan Competitors", description: `${totalCompetitors} tracked`, icon: Eye, color: "text-emerald-400", onClick: () => router.push("/dashboard/competitors"), priority: 3 });
    actions.push({ title: "Export Report", description: "PDF summary", icon: Download, color: "text-[#38bdf8]", onClick: handleExportPDF, priority: 2 });
    actions.push({ title: "View Analytics", description: "Deep insights", icon: BarChart3, color: "text-amber-400", onClick: () => router.push("/dashboard/analytics"), priority: 2 });
    if (totalCampaigns > 0) actions.push({ title: "Campaign Planner", description: `${totalCampaigns} campaigns`, icon: Calendar, color: "text-pink-400", onClick: () => router.push("/dashboard/calendar"), priority: 2 });
    return actions.sort((a, b) => a.priority - b.priority).slice(0, 6);
  }, [totalStrategies, totalCompetitors, totalCampaigns]);

  if (sessionLoading || planLoading || loading || usageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#080810]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1] mx-auto mb-4" />
          <p className="text-slate-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "there";

  return (
    <div id="dashboard-export-content" className="space-y-8">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold text-white">Welcome back, {firstName}</h1>
            {isEnterprise && <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-white flex items-center gap-1"><Star className="h-3 w-3" /> ENTERPRISE</span>}
            {isPremium && <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-xs font-bold text-white">PREMIUM</span>}
            {isPro && <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] text-xs font-bold">PRO</span>}
          </motion.div>
          <p className="text-slate-400">Here's your marketing command center.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {!usageLoading && usageData.strategiesLimit !== -1 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-3.5 w-3.5 text-[#8b5cf6]" />
                <span className="text-xs font-medium text-slate-400">Strategies this month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      usageData.strategiesUsed >= usageData.strategiesLimit 
                        ? "bg-gradient-to-r from-red-500 to-orange-500" 
                        : "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                    }`}
                    style={{ width: `${Math.min(100, (usageData.strategiesUsed / usageData.strategiesLimit) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white">
                  {usageData.strategiesUsed}/{usageData.strategiesLimit}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isExporting ? "Generating..." : "Export PDF"}
          </button>

          {!usageLoading && usageData.strategiesLimit !== -1 && usageData.strategiesUsed >= usageData.strategiesLimit && (
            <button
              onClick={() => router.push("/dashboard/billing")}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2.5 text-sm font-bold text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 transition-all"
            >
              <Crown className="h-4 w-4" />
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* WELCOME FLOW */}
      <AnimatePresence>
        {!welcomeCompleted && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center"><Rocket className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-lg font-bold text-white">Get Started with MakeItAds</h2><p className="text-xs text-slate-400">Complete these steps to unlock the full power</p></div>
              </div>
              <div className="text-right"><p className="text-2xl font-bold text-white">{welcomeSteps.filter((s) => s.completed).length}/{welcomeSteps.length}</p><p className="text-[10px] text-slate-500 uppercase tracking-wider">Completed</p></div>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-6">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(welcomeSteps.filter((s) => s.completed).length / welcomeSteps.length) * 100}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {welcomeSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.button key={step.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => router.push(step.link)} className={`rounded-xl border p-4 text-left transition-all ${step.completed ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/[0.02] hover:border-[#6366f1]/30 hover:bg-[#6366f1]/5"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${step.completed ? "bg-emerald-500/20" : "bg-[#6366f1]/10"}`}>{step.completed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Icon className="h-4 w-4 text-[#8b5cf6]" />}</div>
                      <span className="text-[10px] font-bold text-slate-500">STEP {i + 1}</span>
                    </div>
                    <p className={`text-sm font-bold mb-1 ${step.completed ? "text-emerald-400" : "text-white"}`}>{step.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{step.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BUSINESS HEALTH SCORE */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3"><div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><Heart className="h-6 w-6 text-white" /></div><div><h2 className="text-xl font-bold text-white">Business Health</h2><p className="text-xs text-slate-400">Your overall readiness score</p></div></div>
            <div className="text-right"><div className="text-5xl font-bold text-white"><AnimatedNumber value={businessHealthScore} /><span className="text-2xl text-slate-400">/100</span></div><p className="text-xs text-slate-400 mt-1">{businessHealthScore >= 80 ? "Excellent" : businessHealthScore >= 60 ? "Good" : businessHealthScore >= 40 ? "Fair" : "Needs work"}</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { label: "Marketing Readiness", value: profileCompletion, icon: Megaphone, color: "from-[#6366f1] to-[#8b5cf6]" },
              { label: "Competitor Coverage", value: competitorCoverage, icon: Eye, color: "from-emerald-500 to-teal-500" },
              { label: "Strategy Maturity", value: Math.min(100, avgMarketScore), icon: Target, color: "from-amber-500 to-orange-500" },
              { label: "Market Coverage", value: marketCoverage, icon: Globe, color: "from-blue-500 to-cyan-500" },
              { label: "AI Readiness", value: aiReadiness, icon: Brain, color: "from-pink-500 to-rose-500" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="flex items-center gap-2 mb-2"><Icon className="h-3.5 w-3.5 text-slate-400" /><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p></div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={`h-full bg-gradient-to-r ${item.color}`} /></div>
                    <span className="text-xs font-bold text-white min-w-[32px] text-right">{item.value}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* PRIMARY KPIs */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Key Metrics</h2>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
          <button onClick={() => setTrendPeriod("7d")} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${trendPeriod === "7d" ? "bg-[#6366f1] text-white" : "text-slate-400 hover:text-white"}`}>Last 7 days</button>
          <button onClick={() => setTrendPeriod("30d")} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${trendPeriod === "30d" ? "bg-[#6366f1] text-white" : "text-slate-400 hover:text-white"}`}>Last 30 days</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, color: "text-[#8b5cf6]", bg: "bg-[#6366f1]/10", label: "Strategies Generated", value: totalStrategies, current: trendData.strategies.current, previous: trendData.strategies.previous },
          { icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Avg. Market Score", value: avgMarketScore || "—", current: 0, previous: 0, hideTrend: true },
          { icon: Eye, color: "text-blue-400", bg: "bg-blue-500/10", label: "Competitors Tracked", value: totalCompetitors, current: trendData.competitors.current, previous: trendData.competitors.previous },
          { icon: Calendar, color: "text-pink-400", bg: "bg-pink-500/10", label: "Campaigns Planned", value: totalCampaigns, current: 0, previous: 0, hideTrend: true },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${kpi.bg}`}><kpi.icon className={`h-5 w-5 ${kpi.color}`} /></div>
              {!kpi.hideTrend && <TrendIndicator current={kpi.current} previous={kpi.previous} />}
            </div>
            <p className="text-2xl font-bold text-white">{typeof kpi.value === "number" ? <AnimatedNumber value={kpi.value} /> : kpi.value}</p>
            <p className="text-xs text-slate-400 mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* AI COMMAND CENTER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/10 via-[#8b5cf6]/5 to-[#6366f1]/10 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6"><div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center"><Brain className="h-6 w-6 text-white" /></div><div><h2 className="text-xl font-bold text-white">Intelligent Command Center</h2><p className="text-xs text-slate-400">Your automated marketing assistant</p></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5"><div className="flex items-center gap-2 mb-3"><Activity className="h-4 w-4 text-[#38bdf8]" /><h3 className="text-sm font-bold text-white">What happened?</h3></div><div className="space-y-2">{aiCommandCenter.whatHappened.map((item, i) => <p key={i} className="text-xs text-slate-300 leading-relaxed">• {item}</p>)}</div></div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5"><div className="flex items-center gap-2 mb-3"><Rocket className="h-4 w-4 text-emerald-400" /><h3 className="text-sm font-bold text-white">What should you do next?</h3></div><div className="space-y-2">{aiCommandCenter.whatNext.map((item, i) => <p key={i} className="text-xs text-slate-300 leading-relaxed">• {item}</p>)}</div></div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"><div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-emerald-400" /><h3 className="text-sm font-bold text-white">Expected impact</h3></div><p className="text-xs text-slate-300 leading-relaxed">{aiCommandCenter.expectedImpact}</p></div>
          </div>
        </div>
      </motion.div>

      {/* RECENT INSIGHTS */}
      {recentAIInsights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-white flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-400" /> Recent Insights</h2><Link href="/dashboard/analytics" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">View all <ChevronRight className="h-3 w-3" /></Link></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAIInsights.map((insight, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => router.push(insight.link)} className={`rounded-xl border p-5 text-left transition-all hover:scale-[1.02] ${insight.type === "success" ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40" : insight.type === "warning" ? "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40" : "border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40"}`}>
                <div className="flex items-start gap-3 mb-3">{insight.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" /> : insight.type === "warning" ? <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" /> : <Lightbulb className="h-5 w-5 text-blue-400 flex-shrink-0" />}<h3 className="text-sm font-bold text-white">{insight.title}</h3></div>
                <p className="text-xs text-slate-300 leading-relaxed">{insight.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* SMART PROGRESS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6">
        <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center"><Gauge className="h-5 w-5 text-white" /></div><div><h2 className="text-lg font-bold text-white">Smart Progress</h2><p className="text-xs text-slate-400">Track your journey</p></div></div><Link href="/dashboard/milestones" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">View milestones <ChevronRight className="h-3 w-3" /></Link></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Business Profile", value: profileCompletion, icon: Building2, color: "from-[#6366f1] to-[#8b5cf6]" },
            { label: "Competitor Intel", value: competitorCoverage, icon: Eye, color: "from-emerald-500 to-teal-500" },
            { label: "Campaign Planning", value: campaignPlanning, icon: Calendar, color: "from-pink-500 to-rose-500" },
            { label: "Market Coverage", value: marketCoverage, icon: Globe, color: "from-blue-500 to-cyan-500" },
            { label: "AI Readiness", value: aiReadiness, icon: Brain, color: "from-amber-500 to-orange-500" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 mb-3"><Icon className="h-4 w-4 text-slate-400" /><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p></div>
                <div className="flex items-baseline gap-2 mb-2"><span className="text-2xl font-bold text-white">{item.value}%</span></div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={`h-full bg-gradient-to-r ${item.color}`} /></div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-3"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Milestones Unlocked</p><p className="text-xs text-slate-400">{unlockedMilestones}/{milestones.length}</p></div>
          <div className="flex items-center gap-2 flex-wrap">
            {milestones.slice(0, 6).map((milestone) => {
              const Icon = milestone.icon;
              return (
                <div key={milestone.id} title={`${milestone.title}: ${milestone.description}`} className={`h-10 w-10 rounded-lg flex items-center justify-center transition-all ${milestone.unlocked ? `bg-gradient-to-br ${milestone.color} shadow-lg` : "bg-white/5 border border-white/10"}`}>
                  <Icon className={`h-4 w-4 ${milestone.unlocked ? "text-white" : "text-slate-600"}`} />
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ACTIVITY FEED */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Activity className="h-5 w-5 text-[#38bdf8]" /> Activity Feed</h2>
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 overflow-x-auto">
            {[{ id: "all", label: "All", icon: Activity }, { id: "strategy", label: "Strategies", icon: Sparkles }, { id: "competitor", label: "Competitors", icon: Eye }, { id: "campaign", label: "Campaigns", icon: Calendar }, { id: "profile", label: "Profile", icon: Building2 }, { id: "export", label: "Exports", icon: Download }].map((filter) => {
              const Icon = filter.icon;
              return (<button key={filter.id} onClick={() => setActivityFilter(filter.id as ActivityFilter)} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${activityFilter === filter.id ? "bg-[#6366f1] text-white" : "text-slate-400 hover:text-white"}`}><Icon className="h-3 w-3" />{filter.label}</button>);
            })}
          </div>
        </div>
        {filteredActivityFeed.length === 0 ? (
          <div className="text-center py-12"><Activity className="h-10 w-10 text-slate-600 mx-auto mb-3" /><p className="text-sm text-slate-400 mb-1">No activity yet</p><p className="text-xs text-slate-500">{activityFilter === "all" ? "Start by generating your first strategy" : `No ${activityFilter} activity to display`}</p></div>
        ) : (
          <div className="space-y-2">
            {filteredActivityFeed.slice(0, 10).map((event, i) => {
              const getIcon = () => {
                switch (event.type) {
                  case "strategy": return { Icon: Sparkles, color: "bg-[#6366f1]/10 text-[#8b5cf6]" };
                  case "competitor": return { Icon: Eye, color: "bg-emerald-500/10 text-emerald-400" };
                  case "campaign": return { Icon: Calendar, color: "bg-pink-500/10 text-pink-400" };
                  case "profile": return { Icon: Building2, color: "bg-blue-500/10 text-blue-400" };
                  case "export": return { Icon: Download, color: "bg-amber-500/10 text-amber-400" };
                  default: return { Icon: Activity, color: "bg-slate-500/10 text-slate-400" };
                }
              };
              const { Icon, color } = getIcon();
              return (
                <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} onClick={() => event.link && router.push(event.link)} className={`flex items-start gap-3 p-3 rounded-lg transition-all ${event.link ? "hover:bg-white/[0.03] cursor-pointer" : ""}`}>
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white">{event.title}</p>{event.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{event.description}</p>}</div>
                  <div className="text-right flex-shrink-0">{event.metadata?.score && <p className="text-xs font-bold text-[#6366f1] mb-0.5">{event.metadata.score}/100</p>}<p className="text-[10px] text-slate-500">{new Date(event.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p></div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* QUICK ACTIONS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><Zap className="h-5 w-5 text-[#8b5cf6]" /> Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button key={action.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={action.onClick} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left hover:border-[#6366f1]/30 hover:bg-[#6366f1]/5 transition-all group">
                <Icon className={`h-5 w-5 mb-2 ${action.color}`} />
                <p className="text-sm font-bold text-white group-hover:text-[#8b5cf6] transition-colors">{action.title}</p>
                <p className="text-[10px] text-slate-500 mt-1">{action.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}