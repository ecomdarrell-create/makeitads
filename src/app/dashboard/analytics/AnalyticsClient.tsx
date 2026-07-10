"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  Users, 
  Download, 
  Lock, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  Loader2,
  BarChart3,
  Globe,
  Sparkles,
  Brain,
  Activity,
  Award,
  Zap,
  Calendar,
  Lightbulb,
  Rocket
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useSession } from "@/hooks/useSession";
import { FeatureGate } from "@/components/FeatureGate";
import { createClient } from "@/lib/supabase";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import PageTransition from "@/components/ui/PageTransition";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#0f0f1a]/95 backdrop-blur-xl p-2 sm:p-3 shadow-xl">
        <p className="text-[10px] sm:text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs sm:text-sm font-bold text-white">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#38bdf8", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

interface Strategy {
  id: string;
  title: string;
  industry: string;
  created_at: string;
  data?: {
    overview?: {
      marketScore?: number;
      growthPotential?: string;
      competition?: string;
      estimatedROI?: string;
      budgetSplit?: Record<string, number>;
    };
    competitors?: any[];
    campaigns?: any[];
    recommendations?: any[];
    aiRecommendation?: any;
  };
}

export default function AnalyticsClient() {
  const router = useRouter();
  const { user } = useSession();
  const { 
    isPro, 
    isPremium, 
    isEnterprise,
    isProOrAbove,
    isPremiumOrAbove,
    canExportPDF,
    canSeeCompetitorIntel,
    canSeeAdvancedReports,
    loading: permsLoading
  } = usePermissions();
  
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("strategies")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error loading strategies:", error);
          return;
        }

        setStrategies(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  const handleExportCSV = () => {
    const headers = [
      "Strategy Title",
      "Industry",
      "Market Score",
      "Growth Potential",
      "Competition",
      "Est. ROI",
      "Competitors Count",
      "Campaigns Count",
      "Created Date",
    ];

    const rows = strategies.map((s) => [
      `"${s.title.replace(/"/g, '""')}"`,
      s.industry,
      s.data?.overview?.marketScore || "",
      s.data?.overview?.growthPotential || "",
      s.data?.overview?.competition || "",
      s.data?.overview?.estimatedROI || "",
      s.data?.competitors?.length || 0,
      s.data?.campaigns?.length || 0,
      new Date(s.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `makeitads-insights-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const InsightsPDF = (await import("@/components/InsightsPDF")).default;

      const allCompetitors = strategies.flatMap(
        (s) => s.data?.competitors || []
      );

      const userName = user?.user_metadata?.first_name || 
                       user?.email?.split("@")[0] || 
                       "User";

      const blob = await pdf(
        <InsightsPDF
          stats={stats}
          insights={aiInsights}
          competitors={allCompetitors}
          recentActivities={recentActivities.map((a) => ({
            title: a.title,
            industry: a.industry,
            marketScore: a.data?.overview?.marketScore,
            created_at: a.created_at,
          }))}
          userName={userName}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `makeitads-insights-report-${new Date().toISOString().split("T")[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const stats = useMemo(() => {
    const totalStrategies = strategies.length;
    
    const marketScores = strategies
      .map(s => s.data?.overview?.marketScore)
      .filter((score): score is number => typeof score === "number");
    
    const avgMarketScore = marketScores.length > 0
      ? Math.round(marketScores.reduce((a, b) => a + b, 0) / marketScores.length)
      : 0;

    const industries = [...new Set(strategies.map(s => s.industry).filter(Boolean))];
    
    const totalCompetitors = strategies.reduce(
      (sum, s) => sum + (s.data?.competitors?.length || 0), 
      0
    );

    const totalCampaigns = strategies.reduce(
      (sum, s) => sum + (s.data?.campaigns?.length || 0),
      0
    );

    const rois = strategies
      .map(s => s.data?.overview?.estimatedROI)
      .filter((roi): roi is string => typeof roi === "string")
      .map(roi => parseInt(roi.replace("%", "")) || 0)
      .filter(r => r > 0);
    
    const avgROI = rois.length > 0
      ? Math.round(rois.reduce((a, b) => a + b, 0) / rois.length)
      : 0;

    return { 
      totalStrategies, 
      avgMarketScore, 
      industries, 
      totalCompetitors,
      totalCampaigns,
      avgROI,
      marketScores
    };
  }, [strategies]);

  const scoreEvolutionData = useMemo(() => {
    if (strategies.length === 0) return [];

    const byMonth: Record<string, number[]> = {};
    
    strategies.forEach(s => {
      const date = new Date(s.created_at);
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      const score = s.data?.overview?.marketScore;
      
      if (score !== undefined) {
        if (!byMonth[monthKey]) byMonth[monthKey] = [];
        byMonth[monthKey].push(score);
      }
    });

    return Object.entries(byMonth).map(([month, scores]) => ({
      month,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length,
    }));
  }, [strategies]);

  const industryData = useMemo(() => {
    const counts: Record<string, number> = {};
    strategies.forEach(s => {
      const industry = s.industry || "Unknown";
      counts[industry] = (counts[industry] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [strategies]);

  const strategiesOverTimeData = useMemo(() => {
    if (strategies.length === 0) return [];

    const byMonth: Record<string, number> = {};
    
    strategies.forEach(s => {
      const date = new Date(s.created_at);
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
    });

    return Object.entries(byMonth).map(([month, count]) => ({
      month,
      count,
    }));
  }, [strategies]);

  const recentActivities = useMemo(() => {
    return [...strategies]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [strategies]);

  const aiInsights = useMemo(() => {
    const insights: Array<{ type: "success" | "warning" | "info"; title: string; description: string }> = [];

    if (stats.totalStrategies === 0) {
      insights.push({
        type: "info",
        title: "Start your journey",
        description: "Generate your first strategy to unlock AI-powered insights and analytics.",
      });
      return insights;
    }

    if (stats.avgMarketScore >= 80) {
      insights.push({
        type: "success",
        title: "Excellent market positioning",
        description: `Your strategies average ${stats.avgMarketScore}/100 market score. You're outperforming most businesses.`,
      });
    } else if (stats.avgMarketScore >= 60) {
      insights.push({
        type: "info",
        title: "Good progress",
        description: `Your average market score is ${stats.avgMarketScore}/100. Add more details to improve further.`,
      });
    } else if (stats.avgMarketScore > 0) {
      insights.push({
        type: "warning",
        title: "Room for improvement",
        description: `Your average market score is ${stats.avgMarketScore}/100. Consider refining your targeting.`,
      });
    }

    if (stats.industries.length === 1 && stats.totalStrategies >= 2) {
      insights.push({
        type: "info",
        title: "Diversify your portfolio",
        description: `You've focused on ${stats.industries[0]}. Exploring new industries can reveal opportunities.`,
      });
    } else if (stats.industries.length >= 3) {
      insights.push({
        type: "success",
        title: "Well-diversified portfolio",
        description: `You're analyzing ${stats.industries.length} different industries.`,
      });
    }

    if (stats.totalCompetitors >= 10) {
      insights.push({
        type: "success",
        title: "Strong competitive intelligence",
        description: `You're tracking ${stats.totalCompetitors} competitors. Keep monitoring their moves.`,
      });
    } else if (stats.totalCompetitors > 0 && stats.totalCompetitors < 5) {
      insights.push({
        type: "warning",
        title: "Expand competitor tracking",
        description: `You're tracking only ${stats.totalCompetitors} competitors.`,
      });
    }

    if (stats.avgROI >= 300) {
      insights.push({
        type: "success",
        title: "High ROI potential",
        description: `Your strategies project an average ROI of ${stats.avgROI}%.`,
      });
    }

    return insights;
  }, [stats]);

  if (loading || permsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6366f1] mx-auto mb-4" />
          <p className="text-xs sm:text-sm text-slate-400">Loading analytics...</p>
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
            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white no-hyphens">
                  Strategy Insights
                </h1>
                {stats.totalStrategies > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] text-[10px] sm:text-xs font-bold">
                    {stats.totalStrategies} {stats.totalStrategies === 1 ? "strategy" : "strategies"}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Track your strategic progress in real-time
              </p>
            </div>
          </div>
          
          {/* Export buttons - empilés sur mobile */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => {
                if (!canExportPDF) {
                  router.push("/dashboard/billing");
                  return;
                }
                handleExportCSV();
              }}
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

            <button
              onClick={() => {
                if (!canExportPDF) {
                  router.push("/dashboard/billing");
                  return;
                }
                handleExportPDF();
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-95 ${
                canExportPDF
                  ? "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  : "border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed"
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
              {!canExportPDF && <Lock className="h-3 w-3 ml-1" />}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            EMPTY STATE
            ═══════════════════════════════════════════════════════════ */}
        {stats.totalStrategies === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 sm:p-16 text-center"
          >
            <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 mb-4 sm:mb-6">
              <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-[#8b5cf6]" />
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3 no-hyphens">
              No analytics yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto">
              Generate your first strategy to unlock powerful insights and AI recommendations.
            </p>
            <button
              onClick={() => router.push("/dashboard/strategies/new")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-105 transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              Create first strategy
            </button>
          </motion.div>
        ) : (
          <>
            {/* ═══════════════════════════════════════════════════════
                KPI CARDS - 2 colonnes mobile, 4 desktop
                ═══════════════════════════════════════════════════════ */}
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
                  {stats.avgMarketScore > 0 && (
                    <span className="text-[10px] sm:text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                      <ArrowUpRight className="h-3 w-3" />
                      <span className="hidden sm:inline">Live</span>
                    </span>
                  )}
                </div>
                <p className="text-lg sm:text-2xl font-bold text-white no-hyphens">{stats.avgMarketScore}/100</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 label-nowrap">Market Score</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-3 sm:p-5"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                  </div>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-white no-hyphens">{stats.totalStrategies}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 label-nowrap">Strategies</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-3 sm:p-5"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-[#38bdf8]/10 flex items-center justify-center">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-[#38bdf8]" />
                  </div>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-white no-hyphens">{stats.industries.length}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 label-nowrap">Industries</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-3 sm:p-5"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                  </div>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-white no-hyphens">{stats.totalCompetitors}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 label-nowrap">Competitors</p>
              </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                AI INSIGHTS
                ═══════════════════════════════════════════════════════ */}
            {aiInsights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl sm:rounded-2xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                    <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <h2 className="text-sm sm:text-lg font-bold text-white">AI-Powered Insights</h2>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {aiInsights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border ${
                        insight.type === "success" 
                          ? "border-emerald-500/20 bg-emerald-500/5" 
                          : insight.type === "warning"
                          ? "border-amber-500/20 bg-amber-500/5"
                          : "border-[#6366f1]/20 bg-[#6366f1]/5"
                      }`}
                    >
                      <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        insight.type === "success" 
                          ? "bg-emerald-500/10" 
                          : insight.type === "warning"
                          ? "bg-amber-500/10"
                          : "bg-[#6366f1]/10"
                      }`}>
                        {insight.type === "success" ? (
                          <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                        ) : insight.type === "warning" ? (
                          <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8b5cf6]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-white mb-0.5 sm:mb-1 break-words">
                          {insight.title}
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-400 break-words">
                          {insight.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════
                MAIN CHART - Market Score Evolution
                ═══════════════════════════════════════════════════════ */}
            {scoreEvolutionData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-white no-hyphens">Market Score Evolution</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">How your strategies evolve over time</p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>Last {scoreEvolutionData.length} month{scoreEvolutionData.length > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="h-[200px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scoreEvolutionData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} width={30} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        name="Market Score"
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════
                SECONDARY CHARTS - Empilés sur mobile
                ═══════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Industry Distribution */}
              {industryData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
                >
                  <h3 className="text-sm sm:text-base font-bold text-white mb-4 sm:mb-6 no-hyphens">
                    Industry Distribution
                  </h3>
                  <div className="h-[200px] sm:h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={industryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {industryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          wrapperStyle={{ fontSize: '11px' }}
                          formatter={(value) => <span className="text-[10px] sm:text-xs text-slate-300 capitalize">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Strategies Over Time */}
              {strategiesOverTimeData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
                >
                  <h3 className="text-sm sm:text-base font-bold text-white mb-4 sm:mb-6 no-hyphens">
                    Strategies Over Time
                  </h3>
                  <div className="h-[200px] sm:h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={strategiesOverTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                        <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} width={30} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Strategies" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════════
                COMPETITOR INTELLIGENCE (Pro+)
                ═══════════════════════════════════════════════════════ */}
            <FeatureGate feature="competitorIntelligence" requiredPlan="pro">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white">Competitor Intelligence</h3>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-bold">
                        PRO
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-400">Track competitive threats and opportunities</p>
                  </div>
                  <button
                    onClick={() => router.push("/dashboard/competitors")}
                    className="text-[10px] sm:text-xs text-[#8b5cf6] hover:text-white transition-colors self-start"
                  >
                    View all →
                  </button>
                </div>

                {stats.totalCompetitors === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-slate-600 mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">No competitors tracked yet</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Add competitors to your strategies</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Total Competitors</p>
                      <p className="text-lg sm:text-2xl font-bold text-white no-hyphens">{stats.totalCompetitors}</p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">High Threat</p>
                      <p className="text-lg sm:text-2xl font-bold text-red-400 no-hyphens">
                        {strategies.reduce((sum, s) => 
                          sum + (s.data?.competitors?.filter(c => c.competitiveThreat === "high").length || 0), 
                          0
                        )}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Avg. Opportunity</p>
                      <p className="text-lg sm:text-2xl font-bold text-emerald-400 no-hyphens">
                        {(() => {
                          const allOpps = strategies.flatMap(s => 
                            (s.data?.competitors || []).map(c => c.opportunity || 0).filter(o => o > 0)
                          );
                          return allOpps.length > 0 ? Math.round(allOpps.reduce((a, b) => a + b, 0) / allOpps.length) : 0;
                        })()}%
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </FeatureGate>

            {/* ═══════════════════════════════════════════════════════
                RECENT ACTIVITY
                ═══════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 no-hyphens">
                  <Activity className="h-4 w-4 text-[#38bdf8]" />
                  Recent Activity
                </h3>
                <button
                  onClick={() => router.push("/dashboard/strategies")}
                  className="text-[10px] sm:text-xs text-slate-400 hover:text-white transition-colors"
                >
                  View all →
                </button>
              </div>
              <div className="space-y-1 sm:space-y-2">
                {recentActivities.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => router.push(`/dashboard/strategies/${activity.id}`)}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-colors active:scale-[0.99]"
                  >
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8b5cf6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">{activity.title}</p>
                      <p className="text-[10px] text-slate-500 capitalize truncate">{activity.industry}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-[#6366f1]">
                        {activity.data?.overview?.marketScore || 0}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">
                        {new Date(activity.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </PageTransition>
  );
}