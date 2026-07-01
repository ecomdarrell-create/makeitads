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

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#0f0f1a]/95 backdrop-blur-xl p-3 shadow-xl">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-bold text-white">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Couleurs pour les charts
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

export default function AnalyticsPage() {
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

  // Charger les VRAIES stratégies depuis Supabase
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

  // Handler Export CSV
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

  // Handler Export PDF
  const handleExportPDF = async () => {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const InsightsPDF = (await import("@/components/InsightsPDF")).default;

      // Récupérer tous les concurrents
      const allCompetitors = strategies.flatMap(
        (s) => s.data?.competitors || []
      );

      // Récupérer le nom de l'utilisateur
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

  // Calcul des stats RÉELLES
  const stats = useMemo(() => {
    const totalStrategies = strategies.length;
    
    // Moyenne des market scores
    const marketScores = strategies
      .map(s => s.data?.overview?.marketScore)
      .filter((score): score is number => typeof score === "number");
    
    const avgMarketScore = marketScores.length > 0
      ? Math.round(marketScores.reduce((a, b) => a + b, 0) / marketScores.length)
      : 0;

    // Industries uniques
    const industries = [...new Set(strategies.map(s => s.industry).filter(Boolean))];
    
    // Total concurrents
    const totalCompetitors = strategies.reduce(
      (sum, s) => sum + (s.data?.competitors?.length || 0), 
      0
    );

    // Total campaigns
    const totalCampaigns = strategies.reduce(
      (sum, s) => sum + (s.data?.campaigns?.length || 0),
      0
    );

    // Moyenne ROI
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

  // Données pour le graphique Market Score Evolution (vraies données par mois)
  const scoreEvolutionData = useMemo(() => {
    if (strategies.length === 0) return [];

    // Grouper par mois
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

    // Calculer la moyenne par mois
    return Object.entries(byMonth).map(([month, scores]) => ({
      month,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length,
    }));
  }, [strategies]);

  // Données pour le graphique par industrie
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

  // Données pour le graphique des stratégies par mois
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

  // Activités récentes
  const recentActivities = useMemo(() => {
    return [...strategies]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [strategies]);

  // Insights IA basés sur les données
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

    // Insight sur le score moyen
    if (stats.avgMarketScore >= 80) {
      insights.push({
        type: "success",
        title: "Excellent market positioning",
        description: `Your strategies average ${stats.avgMarketScore}/100 market score. You're outperforming most businesses in your sectors.`,
      });
    } else if (stats.avgMarketScore >= 60) {
      insights.push({
        type: "info",
        title: "Good progress",
        description: `Your average market score is ${stats.avgMarketScore}/100. Add more details to your business profiles to improve further.`,
      });
    } else if (stats.avgMarketScore > 0) {
      insights.push({
        type: "warning",
        title: "Room for improvement",
        description: `Your average market score is ${stats.avgMarketScore}/100. Consider refining your targeting and positioning.`,
      });
    }

    // Insight sur la diversification
    if (stats.industries.length === 1 && stats.totalStrategies >= 2) {
      insights.push({
        type: "info",
        title: "Diversify your portfolio",
        description: `You've focused on ${stats.industries[0]}. Exploring new industries can reveal untapped opportunities.`,
      });
    } else if (stats.industries.length >= 3) {
      insights.push({
        type: "success",
        title: "Well-diversified portfolio",
        description: `You're analyzing ${stats.industries.length} different industries. This gives you a comprehensive market view.`,
      });
    }

    // Insight sur les concurrents
    if (stats.totalCompetitors >= 10) {
      insights.push({
        type: "success",
        title: "Strong competitive intelligence",
        description: `You're tracking ${stats.totalCompetitors} competitors across your strategies. Keep monitoring their moves.`,
      });
    } else if (stats.totalCompetitors > 0 && stats.totalCompetitors < 5) {
      insights.push({
        type: "warning",
        title: "Expand competitor tracking",
        description: `You're tracking only ${stats.totalCompetitors} competitors. Add more detailed competitor info to your strategies.`,
      });
    }

    // Insight sur le ROI
    if (stats.avgROI >= 300) {
      insights.push({
        type: "success",
        title: "High ROI potential",
        description: `Your strategies project an average ROI of ${stats.avgROI}%. Excellent return on your marketing investment.`,
      });
    }

    return insights;
  }, [stats]);

  if (loading || permsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6366f1] mx-auto mb-4" />
          <p className="text-slate-400">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Strategy Insights</h1>
            {stats.totalStrategies > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] text-xs font-bold">
                {stats.totalStrategies} {stats.totalStrategies === 1 ? "strategy" : "strategies"}
              </span>
            )}
          </div>
          <p className="text-slate-400">
            Track your strategic progress and market intelligence in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Bouton Export CSV */}
          <button
            onClick={() => {
              if (!canExportPDF) {
                router.push("/dashboard/billing");
                return;
              }
              handleExportCSV();
            }}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              canExportPDF
                ? "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.05] hover:text-white"
                : "border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Export CSV</span>
            {!canExportPDF && <Lock className="h-3 w-3 ml-1" />}
          </button>

          {/* Bouton Export PDF */}
          <button
            onClick={() => {
              if (!canExportPDF) {
                router.push("/dashboard/billing");
                return;
              }
              handleExportPDF();
            }}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              canExportPDF
                ? "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.05] hover:text-white"
                : "border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed"
            }`}
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
            {!canExportPDF && <Lock className="h-3 w-3 ml-1" />}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {stats.totalStrategies === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center"
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 mb-6">
            <Activity className="h-10 w-10 text-[#8b5cf6]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No analytics yet</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Generate your first strategy to unlock powerful insights, trends, and AI recommendations.
          </p>
          <button
            onClick={() => router.push("/dashboard/strategies/new")}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-105 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Create your first strategy
          </button>
        </motion.div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-[#8b5cf6]" />
                </div>
                {stats.avgMarketScore > 0 && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    Live
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">{stats.avgMarketScore}/100</p>
              <p className="text-xs text-slate-400 mt-1">Avg. Market Score</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalStrategies}</p>
              <p className="text-xs text-slate-400 mt-1">Strategies Generated</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-[#38bdf8]/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-[#38bdf8]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stats.industries.length}</p>
              <p className="text-xs text-slate-400 mt-1">Industries Analyzed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalCompetitors}</p>
              <p className="text-xs text-slate-400 mt-1">Competitors Tracked</p>
            </motion.div>
          </div>

          {/* AI Insights Section */}
          {aiInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">AI-Powered Insights</h2>
              </div>
              <div className="space-y-3">
                {aiInsights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      insight.type === "success" 
                        ? "border-emerald-500/20 bg-emerald-500/5" 
                        : insight.type === "warning"
                        ? "border-amber-500/20 bg-amber-500/5"
                        : "border-[#6366f1]/20 bg-[#6366f1]/5"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      insight.type === "success" 
                        ? "bg-emerald-500/10" 
                        : insight.type === "warning"
                        ? "bg-amber-500/10"
                        : "bg-[#6366f1]/10"
                    }`}>
                      {insight.type === "success" ? (
                        <Award className={`h-4 w-4 text-emerald-400`} />
                      ) : insight.type === "warning" ? (
                        <Lightbulb className={`h-4 w-4 text-amber-400`} />
                      ) : (
                        <Sparkles className={`h-4 w-4 text-[#8b5cf6]`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white mb-1">{insight.title}</p>
                      <p className="text-xs text-slate-400">{insight.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Main Chart: Market Score Evolution */}
          {scoreEvolutionData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Market Score Evolution</h3>
                  <p className="text-xs text-slate-400 mt-1">How your strategies' market scores evolve over time</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="h-3 w-3" />
                  Last {scoreEvolutionData.length} month{scoreEvolutionData.length > 1 ? "s" : ""}
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreEvolutionData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
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

          {/* Secondary Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Industry Distribution */}
            {industryData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6"
              >
                <h3 className="text-base font-bold text-white mb-6">Industry Distribution</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={industryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
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
                        formatter={(value) => <span className="text-xs text-slate-300 capitalize">{value}</span>}
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
                className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6"
              >
                <h3 className="text-base font-bold text-white mb-6">Strategies Over Time</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={strategiesOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Strategies" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </div>

          {/* Competitor Intelligence (Pro+ only) */}
          <FeatureGate feature="competitorIntelligence" requiredPlan="pro">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">Competitor Intelligence</h3>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-bold">
                      PRO
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Track competitive threats and opportunities across your strategies</p>
                </div>
                <button
                  onClick={() => router.push("/dashboard/competitors")}
                  className="text-xs text-[#8b5cf6] hover:text-white transition-colors"
                >
                  View all →
                </button>
              </div>

              {stats.totalCompetitors === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 mb-2">No competitors tracked yet</p>
                  <p className="text-xs text-slate-500">Add competitors to your strategies to see intelligence</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-xs text-slate-500 mb-1">Total Competitors</p>
                    <p className="text-2xl font-bold text-white">{stats.totalCompetitors}</p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-xs text-slate-500 mb-1">High Threat</p>
                    <p className="text-2xl font-bold text-red-400">
                      {strategies.reduce((sum, s) => 
                        sum + (s.data?.competitors?.filter(c => c.competitiveThreat === "high").length || 0), 
                        0
                      )}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-xs text-slate-500 mb-1">Avg. Opportunity</p>
                    <p className="text-2xl font-bold text-emerald-400">
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

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#38bdf8]" />
                Recent Activity
              </h3>
              <button
                onClick={() => router.push("/dashboard/strategies")}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                View all →
              </button>
            </div>
            <div className="space-y-2">
              {recentActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => router.push(`/dashboard/strategies/${activity.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-[#8b5cf6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{activity.title}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{activity.industry}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-[#6366f1]">
                      {activity.data?.overview?.marketScore || 0}
                    </p>
                    <p className="text-[10px] text-slate-500">
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
  );
}