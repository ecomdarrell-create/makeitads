"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Globe,
  MapPin,
  Building2,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Star,
  Target,
  Zap,
  BarChart3,
  Shield,
  AlertTriangle,
  Lightbulb,
  Eye,
  ExternalLink,
  Loader2,
  Share2,
  Download,
  Bell,
  Activity,
  DollarSign,
  Award,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export default function CompetitorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useSession();
  const [competitor, setCompetitor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "swot" | "digital" | "comparison">("overview");

  useEffect(() => {
    const fetchCompetitor = async () => {
      if (!params.id || !user) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from("competitors").select("*").eq("id", params.id).single();
        if (error) {
          setError(error.message);
          return;
        }
        setCompetitor(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitor();
  }, [params.id, user]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "bg-amber-500/10 border-amber-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const handleTrack = async () => {
    if (!user || !competitor) return;
    try {
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "competitor",
        title: "Competitor Tracked",
        message: `You are now tracking ${competitor.data.name}.`,
        link: `/dashboard/competitors/${competitor.id}`,
      });
      alert(`✅ You are now tracking ${competitor.data.name}!`);
    } catch (error) {
      alert("Tracking feature coming soon!");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/dashboard/competitors/${competitor?.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: competitor?.data.name, text: `Check out this competitor: ${competitor?.data.name}`, url: shareUrl });
      } catch (error) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("✅ Link copied to clipboard!");
    }
  };

  const handleExport = async () => {
    if (!competitor) return;
    const csvContent = [
      ["Name", competitor.data.name || "N/A"],
      ["City", competitor.data.city || "N/A"],
      ["Country", competitor.data.country || "N/A"],
      ["Industry", competitor.data.industry || "N/A"],
      ["Position", competitor.data.position || "N/A"],
      ["Overall Score", competitor.data.overallScore || 0],
      ["Traffic", competitor.data.traffic || 0],
      ["Employees", competitor.data.employees || 0],
      ["Growth", `${competitor.data.growth || 0}%`],
      ["Market Share", `${competitor.data.marketShare || 0}%`],
      [""],
      ["Strengths"],
      ...(competitor.data.strengths || []).map((s: string) => [s]),
      [""],
      ["Weaknesses"],
      ...(competitor.data.weaknesses || []).map((w: string) => [w]),
    ].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(competitor.data.name || "competitor").replace(/\s+/g, "_")}_report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" /></div>;
  if (error || !competitor) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">{error ? "Error loading competitor" : "Competitor not found"}</h3>
        {error && <p className="text-sm text-red-400 mb-4 font-mono">{error}</p>}
        <button onClick={() => router.push("/dashboard/competitors")} className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-bold text-white">Back to Competitors</button>
      </div>
    </div>
  );

  const data = competitor.data;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{data.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${data.position.includes("Leader") ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : data.position.includes("Challenger") ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : data.position.includes("Niche") ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                {data.position}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <a href={`https://${data.website}`} target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:text-white transition-colors">{data.website}</a>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {data.city}, {data.country}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {data.industry}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleTrack} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-all">
            <Bell className="h-4 w-4" />
            <span>Track</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-all">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-all">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Competitive Score</p>
            <div className={`inline-flex items-center justify-center h-24 w-24 rounded-2xl border-2 ${getScoreBg(data.overallScore)}`}>
              <span className={`text-4xl font-bold ${getScoreColor(data.overallScore)}`}>{data.overallScore}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">out of 100</p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-[#38bdf8]" />
                <p className="text-xs text-slate-500">Monthly Traffic</p>
              </div>
              <p className="text-2xl font-bold text-white">{formatNumber(data.traffic)}</p>
              <p className="text-xs text-emerald-400 mt-1">+{data.growth}% growth</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-[#8b5cf6]" />
                <p className="text-xs text-slate-500">Market Share</p>
              </div>
              <p className="text-2xl font-bold text-white">{data.marketShare}%</p>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" style={{ width: `${data.marketShare}%` }} />
              </div>
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <p className="text-xs text-slate-500">Employees</p>
              </div>
              <p className="text-2xl font-bold text-white">{data.employees}</p>
              <p className="text-xs text-slate-500 mt-1">Founded {data.founded}</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-amber-400" />
                <p className="text-xs text-slate-500">Pricing</p>
              </div>
              <p className="text-2xl font-bold text-white">{data.pricing}</p>
              <p className="text-xs text-slate-500 mt-1">{data.services.length} services</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 w-fit">
        {[
          { id: "overview", label: "Overview", icon: Info },
          { id: "swot", label: "SWOT Analysis", icon: Target },
          { id: "digital", label: "Digital Presence", icon: Globe },
          { id: "comparison", label: "Comparison", icon: BarChart3 },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id ? "bg-[#6366f1] text-white" : "text-slate-400 hover:text-white"}`}>
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-[#8b5cf6]" />
                Market Positioning
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{data.positioning}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">SEO Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${data.seoScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white">{data.seoScore}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Social Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${data.socialScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white">{data.socialScore}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Ads Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${data.adsScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white">{data.adsScore}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Reviews Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${data.reviewsScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white">{data.reviewsScore}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#8b5cf6]" />
                Services & Offerings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.services.map((service: string, i: number) => (
                  <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] p-3 flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#8b5cf6]" />
                Advertising Activity
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Google Ads", active: data.advertisingActivity.googleAds },
                  { name: "Meta Ads", active: data.advertisingActivity.metaAds },
                  { name: "LinkedIn Ads", active: data.advertisingActivity.linkedinAds },
                  { name: "TikTok Ads", active: data.advertisingActivity.tiktokAds },
                ].map((ad, i) => (
                  <div key={i} className={`rounded-lg border p-4 ${ad.active ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/[0.02] border-white/5 opacity-50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{ad.name}</span>
                      {ad.active ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-slate-500" />}
                    </div>
                    <p className="text-xs text-slate-400">{ad.active ? "Active campaigns" : "Not detected"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "swot" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Strengths
              </h3>
              <div className="space-y-3">
                {data.strengths.map((strength: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-emerald-400">{i + 1}</span>
                    </div>
                    <p className="text-sm text-slate-300">{strength}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Weaknesses
              </h3>
              <div className="space-y-3">
                {data.weaknesses.map((weakness: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-red-400">{i + 1}</span>
                    </div>
                    <p className="text-sm text-slate-300">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
              <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Opportunities
              </h3>
              <div className="space-y-3">
                {data.opportunities.map((opportunity: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-400">{i + 1}</span>
                    </div>
                    <p className="text-sm text-slate-300">{opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Threats
              </h3>
              <div className="space-y-3">
                {data.threats.map((threat: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-amber-400">{i + 1}</span>
                    </div>
                    <p className="text-sm text-slate-300">{threat}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "digital" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-[#8b5cf6]" />
                Social Media Presence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(data.socialMedia).map(([platform, stats]: [string, any]) => (
                  <div key={platform} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-white capitalize">{platform}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc]">Active</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-slate-500">Followers</p>
                        <p className="text-lg font-bold text-white">{formatNumber(stats.followers)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Engagement Rate</p>
                        <p className="text-lg font-bold text-emerald-400">{stats.engagement}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#8b5cf6]" />
                SEO Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center h-20 w-20 rounded-2xl border-2 ${getScoreBg(data.seoScore)}`}>
                    <span className={`text-3xl font-bold ${getScoreColor(data.seoScore)}`}>{data.seoScore}</span>
                  </div>
                  <p className="text-sm font-bold text-white mt-3">SEO Score</p>
                  <p className="text-xs text-slate-500">out of 100</p>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Search Visibility</span>
                      <span className="text-sm font-bold text-white">{data.seoScore}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${data.seoScore}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Domain Authority</span>
                      <span className="text-sm font-bold text-white">{Math.round(data.seoScore * 0.8)}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: `${data.seoScore * 0.8}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Backlinks</span>
                      <span className="text-sm font-bold text-white">{formatNumber(data.traffic * 0.05)}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400" style={{ width: `${Math.min(100, data.seoScore * 0.9)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comparison" && (
          <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#8b5cf6]" />
              Competitive Comparison
            </h3>
            <div className="space-y-4">
              {[
                { label: "SEO Performance", you: 54, competitor: data.seoScore },
                { label: "Social Media", you: 61, competitor: data.socialScore },
                { label: "Advertising", you: 37, competitor: data.adsScore },
                { label: "Customer Reviews", you: 72, competitor: data.reviewsScore },
                { label: "Market Share", you: 8, competitor: data.marketShare },
              ].map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{metric.label}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-400">You: {metric.you}</span>
                      <span className={`text-xs font-bold ${metric.competitor > metric.you ? "text-red-400" : "text-emerald-400"}`}>Them: {metric.competitor}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" style={{ width: `${metric.you}%` }} />
                    </div>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${metric.competitor > metric.you ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${metric.competitor}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white mb-1">Smart Recommendation</p>
                  <p className="text-xs text-slate-300">This competitor is stronger in {data.seoScore > 60 ? "SEO" : "social media"} and {data.adsScore > 70 ? "advertising" : "customer reviews"}. Focus on improving your {data.seoScore > 60 ? "social media presence" : "SEO strategy"} to close the gap.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}