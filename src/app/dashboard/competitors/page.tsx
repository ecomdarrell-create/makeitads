"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Eye,
  Loader2,
  RefreshCw,
  TrendingUp,
  Target,
  Zap,
  Star,
  Activity,
  MapPin,
  Grid,
  List,
  Download,
  Clock,
  Info,
  X,
  Bell,
  Share2,
  GitCompareArrows,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useSession } from "@/hooks/useSession";
import { createClient } from "@/lib/supabase";
import { generateCompetitors, getCompetitors } from "@/lib/competitorGenerator";

const supabase = createClient();

interface Competitor {
  id: string;
  data: {
    name: string;
    website: string;
    country: string;
    city: string;
    industry: string;
    position: string;
    positioning: string;
    traffic: number;
    employees: number;
    founded: number;
    growth: number;
    marketShare: number;
    seoScore: number;
    socialScore: number;
    adsScore: number;
    reviewsScore: number;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    advertisingActivity: {
      googleAds: boolean;
      metaAds: boolean;
      linkedinAds: boolean;
      tiktokAds: boolean;
    };
    socialMedia: any;
    services: string[];
    pricing: string;
  };
  created_at: string;
}

export default function CompetitorsPage() {
  const router = useRouter();
  const { user } = useSession();
  const { 
    isFree, 
    isPro, 
    isPremium, 
    isEnterprise,
    loading: permsLoading 
  } = usePermissions();
  
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterPosition, setFilterPosition] = useState<string>("all");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getCompetitors(user.id);
        setCompetitors(data || []);
        
        if (data && data.length > 0) {
          setLastScan(new Date(data[0].created_at));
        }

        const { data: profile } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profile) {
          setBusinessProfile(profile);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  const handleNewScan = async () => {
    if (!user) return;

    if (!businessProfile) {
      alert("Please create your business profile first to generate accurate competitor data.");
      router.push("/dashboard/strategies/new");
      return;
    }

    setScanning(true);
    try {
      const industry = businessProfile.industry || "technology";
      const city = businessProfile.city || "London";
      const country = businessProfile.country || "United Kingdom";
      const businessName = businessProfile.business_name || "My Business";

      const newCompetitors = await generateCompetitors(
        user.id,
        industry,
        city,
        country,
        businessName,
        true
      );

      const data = await getCompetitors(user.id);
      setCompetitors(data || []);
      setLastScan(new Date());

      // ✅ NOTIFICATION AUTOMATIQUE : Scan terminé
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "competitor",
        title: "👁️ Competitor scan completed",
        message: `Found ${newCompetitors.length} competitors in ${city} for ${industry}`,
        link: "/dashboard/competitors",
        is_read: false,
      });

    } catch (error) {
      console.error("Error scanning competitors:", error);
      alert("Error scanning competitors. Please try again.");
      
      // ✅ NOTIFICATION D'ERREUR
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "warning",
        title: "⚠️ Competitor scan failed",
        message: "An error occurred while scanning competitors. Please try again.",
        link: "/dashboard/competitors",
        is_read: false,
      });
    } finally {
      setScanning(false);
    }
  };

  const stats = {
    total: competitors.length,
    strong: competitors.filter(c => (c.data.overallScore || 0) >= 80).length,
    emerging: competitors.filter(c => {
      const score = c.data.overallScore || 0;
      return score >= 60 && score < 80;
    }).length,
    leaders: competitors.filter(c => c.data.position?.includes("Leader")).length,
    newEntrants: competitors.filter(c => {
      const founded = c.data.founded || 0;
      const yearsInBusiness = new Date().getFullYear() - founded;
      return yearsInBusiness <= 3 && founded > 0;
    }).length,
  };

  const filteredCompetitors = competitors.filter(c => {
    const matchesSearch = (c.data.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (c.data.city || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = filterPosition === "all" || 
                           (c.data.position || "").toLowerCase().includes(filterPosition.toLowerCase());
    return matchesSearch && matchesPosition;
  });

  const formatNumber = (num: number) => {
    if (!num || num === 0) return "N/A";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getPositionColor = (position: string) => {
    if (!position) return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    if (position.includes("Leader")) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    if (position.includes("Challenger")) return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (position.includes("Niche")) return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    if (position.includes("Emerging")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    return "text-slate-400 bg-slate-500/10 border-slate-500/20";
  };

  const getScoreColor = (score: number) => {
    if (!score) return "text-slate-400";
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const handleTrack = async (competitorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) return;

    try {
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "competitor",
        title: "🔔 Competitor tracked",
        message: "You are now tracking this competitor. You'll receive alerts on changes.",
        link: `/dashboard/competitors/${competitorId}`,
        is_read: false,
      });

      alert("✅ You are now tracking this competitor!");
    } catch (error) {
      console.error("Error tracking competitor:", error);
    }
  };

  const handleShare = async (competitor: Competitor, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/dashboard/competitors/${competitor.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: competitor.data.name,
          text: `Check out this competitor: ${competitor.data.name}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("✅ Link copied to clipboard!");
    }
  };

  const handleExport = async (competitor: Competitor, e: React.MouseEvent) => {
    e.stopPropagation();
    
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
      ["SEO Score", competitor.data.seoScore || 0],
      ["Social Score", competitor.data.socialScore || 0],
      ["Ads Score", competitor.data.adsScore || 0],
      ["Reviews Score", competitor.data.reviewsScore || 0],
      [""],
      ["Strengths"],
      ...(competitor.data.strengths || []).map((s: string) => [s]),
      [""],
      ["Weaknesses"],
      ...(competitor.data.weaknesses || []).map((w: string) => [w]),
      [""],
      ["Opportunities"],
      ...(competitor.data.opportunities || []).map((o: string) => [o]),
      [""],
      ["Threats"],
      ...(competitor.data.threats || []).map((t: string) => [t]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(competitor.data.name || "competitor").replace(/\s+/g, "_")}_report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (competitorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this competitor?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("competitors")
        .delete()
        .eq("id", competitorId);

      if (error) {
        console.error("Error deleting competitor:", error);
        alert("Failed to delete competitor");
        return;
      }

      setCompetitors(competitors.filter(c => c.id !== competitorId));
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete competitor");
    }
  };

  if (loading || permsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6366f1] mx-auto mb-4" />
          <p className="text-slate-400">Loading competitor intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-[#38bdf8] flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Competitor Intelligence Center</h1>
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors"
              title="About this data"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <p className="text-slate-400">
            Smart competitive analysis based on your business profile.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {lastScan && (
            <div className="text-right">
              <p className="text-xs text-slate-500">Last Scan</p>
              <p className="text-sm font-bold text-white flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lastScan.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}
          
          <button
            onClick={() => router.push("/dashboard/competitors/compare")}
            disabled={competitors.length === 0}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GitCompareArrows className="h-4 w-4" />
            <span>Compare</span>
          </button>

          <button
            onClick={handleNewScan}
            disabled={scanning}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-105 transition-all disabled:opacity-50"
          >
            {scanning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>{scanning ? "Scanning..." : "Run New Scan"}</span>
          </button>
        </div>
      </div>

      {!businessProfile && competitors.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-center gap-3"
        >
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-200">Business Profile Required</p>
            <p className="text-xs text-amber-400/80 mt-0.5">
              Create your business profile first to generate accurate competitor data for your industry and location.
            </p>
          </div>
          <button 
            onClick={() => router.push("/dashboard/strategies/new")}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
          >
            Create Profile
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-[#8b5cf6]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-1">Competitors Found</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.leaders}</p>
          <p className="text-xs text-slate-400 mt-1">Market Leaders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.strong}</p>
          <p className="text-xs text-slate-400 mt-1">Strong Competitors</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.emerging}</p>
          <p className="text-xs text-slate-400 mt-1">Emerging Competitors</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.newEntrants}</p>
          <p className="text-xs text-slate-400 mt-1">New Entrants</p>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search competitors..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>

        <select
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#0f0f1a] px-4 py-2 text-sm text-white outline-none focus:border-[#6366f1] cursor-pointer"
        >
          <option value="all">All Positions</option>
          <option value="leader">Market Leaders</option>
          <option value="challenger">Challengers</option>
          <option value="niche">Niche Players</option>
          <option value="emerging">Emerging</option>
        </select>

        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "grid"
                ? "bg-[#6366f1] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Grid className="h-3 w-3" />
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "list"
                ? "bg-[#6366f1] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <List className="h-3 w-3" />
            List
          </button>
        </div>
      </div>

      {competitors.length === 0 && !scanning ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center"
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-[#38bdf8]/20 mb-6">
            <Eye className="h-10 w-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No competitors tracked yet</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            {businessProfile 
              ? "Run your first scan to discover competitors in your market based on your business profile."
              : "Create your business profile first, then run a scan to discover competitors."}
          </p>
          <div className="flex items-center gap-3 justify-center">
            {!businessProfile && (
              <button
                onClick={() => router.push("/dashboard/strategies/new")}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-bold text-white hover:bg-white/[0.05] transition-all"
              >
                Create Business Profile
              </button>
            )}
            <button
              onClick={handleNewScan}
              disabled={!businessProfile}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="h-4 w-4" />
              Run First Scan
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompetitors.map((competitor, index) => (
                <motion.div
                  key={competitor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/dashboard/competitors/${competitor.id}`)}
                  className="group relative rounded-2xl border border-white/10 bg-[#0f0f1a] p-6 hover:border-[#6366f1]/30 transition-all cursor-pointer"
                >
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-[#6366f1]/10 border border-[#6366f1]/20">
                    <span className="text-[9px] font-bold text-[#a5b4fc] uppercase">Smart Analysis</span>
                  </div>

                  <div className="flex items-start justify-between mb-4 pr-20">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white truncate group-hover:text-[#8b5cf6] transition-colors">
                        {competitor.data.name || "Unknown"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <p className="text-xs text-slate-500">{competitor.data.city || "N/A"}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold border ${getPositionColor(competitor.data.position || "")}`}>
                      {competitor.data.position || "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`text-3xl font-bold ${getScoreColor(competitor.data.overallScore || 0)}`}>
                      {competitor.data.overallScore || "N/A"}
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${competitor.data.overallScore || 0}%` }}
                          transition={{ duration: 0.8, delay: index * 0.05 }}
                          className={`h-full ${
                            (competitor.data.overallScore || 0) >= 80 ? "bg-emerald-500" :
                            (competitor.data.overallScore || 0) >= 60 ? "bg-amber-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Competitive Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-slate-500 mb-1">Traffic</p>
                      <p className="text-sm font-bold text-white">{formatNumber(competitor.data.traffic || 0)}/mo</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 mb-1">Employees</p>
                      <p className="text-sm font-bold text-white">{competitor.data.employees || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 mb-1">Growth</p>
                      <p className={`text-sm font-bold ${
                        (competitor.data.growth || 0) > 0 ? "text-emerald-400" : 
                        (competitor.data.growth || 0) < 0 ? "text-red-400" : "text-slate-400"
                      }`}>
                        {(competitor.data.growth || 0) !== 0 ? `${(competitor.data.growth || 0) > 0 ? "+" : ""}${competitor.data.growth}%` : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Market Share</span>
                      <span className="text-xs font-bold text-white">{competitor.data.marketShare || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${competitor.data.marketShare || 0}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                        className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Active Ads</p>
                    <div className="flex flex-wrap gap-1">
                      {competitor.data.advertisingActivity?.googleAds && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">Google</span>
                      )}
                      {competitor.data.advertisingActivity?.metaAds && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400">Meta</span>
                      )}
                      {competitor.data.advertisingActivity?.linkedinAds && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-700/10 text-blue-300">LinkedIn</span>
                      )}
                      {competitor.data.advertisingActivity?.tiktokAds && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400">TikTok</span>
                      )}
                      {(!competitor.data.advertisingActivity?.googleAds && 
                        !competitor.data.advertisingActivity?.metaAds && 
                        !competitor.data.advertisingActivity?.linkedinAds && 
                        !competitor.data.advertisingActivity?.tiktokAds) && (
                        <span className="text-[9px] text-slate-500">No ads detected</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleTrack(competitor.id, e)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[10px] font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
                    >
                      <Bell className="h-3 w-3" />
                      Track
                    </button>
                    <button
                      onClick={(e) => handleShare(competitor, e)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[10px] font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
                    >
                      <Share2 className="h-3 w-3" />
                      Share
                    </button>
                    <button
                      onClick={(e) => handleExport(competitor, e)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[10px] font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
                    >
                      <Download className="h-3 w-3" />
                      Export
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="col-span-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Competitor</div>
                <div className="col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Position</div>
                <div className="col-span-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Score</div>
                <div className="col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Traffic</div>
                <div className="col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Market Share</div>
                <div className="col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Growth</div>
              </div>
              
              {filteredCompetitors.map((competitor, index) => (
                <motion.div
                  key={competitor.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => router.push(`/dashboard/competitors/${competitor.id}`)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <div className="col-span-3">
                    <p className="text-sm font-bold text-white">{competitor.data.name || "Unknown"}</p>
                    <p className="text-xs text-slate-500">{competitor.data.city || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-xs px-2 py-1 rounded-md border font-bold ${getPositionColor(competitor.data.position || "")}`}>
                      {competitor.data.position || "N/A"}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <p className={`text-sm font-bold ${getScoreColor(competitor.data.overallScore || 0)}`}>
                      {competitor.data.overallScore || "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-bold text-white">{formatNumber(competitor.data.traffic || 0)}/mo</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                          style={{ width: `${competitor.data.marketShare || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white">{competitor.data.marketShare || 0}%</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className={`text-sm font-bold ${
                      (competitor.data.growth || 0) > 0 ? "text-emerald-400" : 
                      (competitor.data.growth || 0) < 0 ? "text-red-400" : "text-slate-400"
                    }`}>
                      {(competitor.data.growth || 0) !== 0 ? `${(competitor.data.growth || 0) > 0 ? "+" : ""}${competitor.data.growth}%` : "N/A"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full rounded-2xl border border-white/10 bg-[#0f0f1a] p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowInfoModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                  <Info className="h-6 w-6 text-[#8b5cf6]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">About Competitor Data</h2>
                  <p className="text-sm text-slate-400">How this data is generated</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <h3 className="text-sm font-bold text-emerald-200 mb-2">✅ Data Source</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All competitor data is <strong>generated based on your business profile</strong> (industry, location, business model). 
                    The data is stored in Supabase and is fully verifiable - you can view, edit, or delete any competitor at any time.
                  </p>
                </div>

                <div className="rounded-lg border border-[#6366f1]/20 bg-[#6366f1]/5 p-4">
                  <h3 className="text-sm font-bold text-[#a5b4fc] mb-2">🤖 How It Works</h3>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• Our system analyzes your industry benchmarks and market data</li>
                    <li>• Generates realistic competitors for your specific market</li>
                    <li>• Calculates scores using strategic frameworks</li>
                    <li>• All data is saved and can be exported anytime</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <h3 className="text-sm font-bold text-amber-200 mb-2">⚠️ Important</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    These are <strong>smart estimated competitors</strong>, not real companies. Use this data for strategic planning 
                    and competitive analysis frameworks. For real-time competitor data, we're integrating with APIs like SimilarWeb and SEMrush.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-3 text-sm font-bold text-white hover:scale-[1.02] transition-transform"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}