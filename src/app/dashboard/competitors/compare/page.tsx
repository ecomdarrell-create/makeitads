"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  ArrowLeft,
  Plus,
  Download,
  Share2,
  AlertTriangle,
  Lightbulb,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  X,
  Eye,
  Target,
  BarChart3,
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { usePermissions } from "@/hooks/usePermissions";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

interface CompetitorData {
  id: string;
  name: string;
  isMe: boolean;
  position: string;
  overallScore: number;
  traffic: number;
  employees: number;
  founded: number;
  growth: number;
  marketShare: number;
  seoScore: number;
  socialScore: number;
  adsScore: number;
  reviewsScore: number;
  brandAuthority: number;
  innovationScore: number;
  customerSatisfaction: number;
  opportunityScore: number;
  pricing: string;
  city: string;
  country: string;
  industry: string;
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
}

const COLORS = ["#6366f1", "#8b5cf6", "#38bdf8", "#10b981", "#f59e0b"];

export default function ComparePage() {
  const router = useRouter();
  const { user } = useSession();
  const { isFree, isPro, isPremium, isEnterprise } = usePermissions();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [availableCompetitors, setAvailableCompetitors] = useState<any[]>([]);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompetitorName, setNewCompetitorName] = useState("");
  const [savingNew, setSavingNew] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const { data: competitors } = await supabase
          .from("competitors")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (competitors && competitors.length > 0) {
          setAvailableCompetitors(competitors);
          setSelectedIds(competitors.slice(0, Math.min(3, competitors.length)).map((c) => c.id));
        }
        const { data: profile } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (profile) setBusinessProfile(profile);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const comparisonData = useMemo(() => {
    const data: CompetitorData[] = [];
    if (businessProfile) {
      data.push({
        id: "me",
        name: businessProfile.business_name || "My Business",
        isMe: true,
        position: "Your Business",
        overallScore: 0,
        traffic: 0,
        employees: 0,
        founded: new Date().getFullYear(),
        growth: 0,
        marketShare: 0,
        seoScore: 0,
        socialScore: 0,
        adsScore: 0,
        reviewsScore: 0,
        brandAuthority: 0,
        innovationScore: 0,
        customerSatisfaction: 0,
        opportunityScore: 0,
        pricing: "$$",
        city: businessProfile.city || "N/A",
        country: businessProfile.country || "N/A",
        industry: businessProfile.industry || "N/A",
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
        advertisingActivity: { googleAds: false, metaAds: false, linkedinAds: false, tiktokAds: false },
        socialMedia: {},
        services: [],
      });
    }
    selectedIds.forEach((id, index) => {
      const comp = availableCompetitors.find((c) => c.id === id);
      if (comp && comp.data) {
        data.push({
          id: comp.id,
          name: comp.data.name || "Unknown",
          isMe: false,
          position: comp.data.position || "N/A",
          overallScore: comp.data.overallScore || 0,
          traffic: comp.data.traffic || 0,
          employees: comp.data.employees || 0,
          founded: comp.data.founded || 0,
          growth: comp.data.growth || 0,
          marketShare: comp.data.marketShare || 0,
          seoScore: comp.data.seoScore || 0,
          socialScore: comp.data.socialScore || 0,
          adsScore: comp.data.adsScore || 0,
          reviewsScore: comp.data.reviewsScore || 0,
          brandAuthority: Math.round(((comp.data.seoScore || 0) + (comp.data.socialScore || 0)) / 2),
          innovationScore: 0,
          customerSatisfaction: comp.data.reviewsScore || 0,
          opportunityScore: 100 - (comp.data.overallScore || 0),
          pricing: comp.data.pricing || "N/A",
          city: comp.data.city || "N/A",
          country: comp.data.country || "N/A",
          industry: comp.data.industry || "N/A",
          strengths: comp.data.strengths || [],
          weaknesses: comp.data.weaknesses || [],
          opportunities: comp.data.opportunities || [],
          threats: comp.data.threats || [],
          advertisingActivity: comp.data.advertisingActivity || { googleAds: false, metaAds: false, linkedinAds: false, tiktokAds: false },
          socialMedia: comp.data.socialMedia || {},
          services: comp.data.services || [],
        });
      }
    });
    return data;
  }, [selectedIds, availableCompetitors, businessProfile]);

  const radarData = useMemo(() => {
    const metrics = [
      { key: "seoScore", label: "SEO" },
      { key: "adsScore", label: "Paid Ads" },
      { key: "socialScore", label: "Social Media" },
      { key: "reviewsScore", label: "Reviews" },
      { key: "brandAuthority", label: "Brand Authority" },
      { key: "marketShare", label: "Market Share" },
    ];
    return metrics.map((metric) => {
      const point: any = { metric: metric.label };
      comparisonData.forEach((comp, index) => {
        const value = (comp as any)[metric.key] || 0;
        point[comp.isMe ? "My Business" : `Competitor ${index}`] = value;
      });
      return point;
    });
  }, [comparisonData]);

  const marketPositionData = useMemo(() => {
    return comparisonData.map((comp, index) => ({
      name: comp.name,
      marketShare: comp.marketShare,
      brandAuthority: comp.brandAuthority,
      traffic: comp.traffic || 1000,
      color: COLORS[index],
    }));
  }, [comparisonData]);

  const smartInsights = useMemo(() => {
    const me = comparisonData.find((c) => c.isMe);
    const others = comparisonData.filter((c) => !c.isMe);
    if (!me || others.length === 0) return null;
    const strongestCompetitor = others.reduce((max, c) => (c.overallScore || 0) > (max.overallScore || 0) ? c : max, others[0]);
    return {
      strength: { title: "Your Biggest Strength", description: "Complete your business profile to get personalized insights." },
      weakness: { title: "Biggest Opportunity", description: `You're tracking ${others.length} competitors. Add more data to unlock detailed recommendations.` },
      threat: { title: strongestCompetitor.overallScore > 70 ? `Watch: ${strongestCompetitor.name}` : "No Major Threats", description: strongestCompetitor.overallScore > 70 ? `${strongestCompetitor.name} has a high competitive score (${strongestCompetitor.overallScore}/100).` : "Your competitors don't show significant threats yet." },
    };
  }, [comparisonData]);

  const handleAddCompetitor = async () => {
    if (!newCompetitorName.trim() || !user || !businessProfile) {
      alert("Please enter a competitor name.");
      return;
    }
    setSavingNew(true);
    try {
      const newCompetitor = {
        user_id: user.id,
        industry: businessProfile.industry || "technology",
        city: businessProfile.city || "N/A",
        country: businessProfile.country || "N/A",
        business_name: businessProfile.business_name,
        data: {
          name: newCompetitorName.trim(),
          website: "",
          country: businessProfile.country || "N/A",
          city: businessProfile.city || "N/A",
          industry: businessProfile.industry || "technology",
          position: "New Competitor",
          positioning: "",
          traffic: 0,
          employees: 0,
          founded: new Date().getFullYear(),
          growth: 0,
          marketShare: 0,
          seoScore: 0,
          socialScore: 0,
          adsScore: 0,
          reviewsScore: 0,
          overallScore: 0,
          strengths: [],
          weaknesses: [],
          opportunities: [],
          threats: [],
          advertisingActivity: { googleAds: false, metaAds: false, linkedinAds: false, tiktokAds: false },
          socialMedia: {},
          services: [],
          pricing: "N/A",
        },
        created_at: new Date().toISOString(),
      };
      const { data, error } = await supabase.from("competitors").insert(newCompetitor).select().single();
      if (error) {
        alert(`Failed to add competitor: ${error.message}`);
        setSavingNew(false);
        return;
      }

      setAvailableCompetitors([data, ...availableCompetitors]);
      setSelectedIds([...selectedIds, data.id]);
      setNewCompetitorName("");
      setShowAddModal(false);

      // ✅ NOTIFICATION AUTOMATIQUE : Concurrent ajouté
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "competitor",
        title: "➕ New competitor added",
        message: `${newCompetitorName.trim()} has been added to your competitive intelligence.`,
        link: `/dashboard/competitors/${data.id}`,
        is_read: false,
      });

      alert(`✅ ${newCompetitorName.trim()} has been added successfully!`);
    } catch (error: any) {
      alert(`Error: ${error.message || "Unknown error"}`);
    } finally {
      setSavingNew(false);
    }
  };

  const handleRemoveFromSelection = (id: string) => setSelectedIds(selectedIds.filter((i) => i !== id));

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Competitive Benchmark", text: "Check out this competitive analysis", url: shareUrl });
      } catch (error) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  const handleExport = () => alert("PDF export will be available soon. For now, you can take a screenshot of this page.");

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" /></div>;
  if (comparisonData.length === 0) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Sparkles className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">No data available</h3>
        <p className="text-sm text-slate-400 mb-4">You need to create a business profile and generate competitor scans first.</p>
        <div className="flex items-center gap-3 justify-center">
          <button onClick={() => router.push("/dashboard/strategies/new")} className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-bold text-white">Create Business Profile</button>
          <button onClick={() => router.push("/dashboard/competitors")} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300">Go to Competitors</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Competitors
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Competitive Benchmark</h1>
          <p className="text-slate-400 max-w-2xl">Compare your company against competitors using real data from your competitive intelligence scans.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-105 transition-all">
            <Plus className="h-4 w-4" /> Add Competitor
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-all">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-all">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-[#8b5cf6]" />
          <h2 className="text-lg font-bold text-white">Executive Summary</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-2">Your Position</p>
            <p className="text-xl font-bold text-white">{businessProfile?.business_name || "N/A"}</p>
            <p className="text-xs text-slate-400 mt-1">{businessProfile?.industry || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2">Competitors Tracked</p>
            <p className="text-3xl font-bold text-[#8b5cf6]">{comparisonData.filter((c) => !c.isMe).length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2">Location</p>
            <p className="text-xl font-bold text-white">{businessProfile?.city || "N/A"}</p>
            <p className="text-xs text-slate-400 mt-1">{businessProfile?.country || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2">Strongest Competitor</p>
            <p className="text-xl font-bold text-amber-400">{comparisonData.filter((c) => !c.isMe).sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))[0]?.name || "N/A"}</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Competitive Radar</h2>
            <p className="text-sm text-slate-400 mt-1">Performance comparison across key metrics</p>
          </div>
          <div className="flex items-center gap-4">
            {comparisonData.map((comp, index) => (
              <div key={comp.id} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-slate-300">{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ffffff10" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
              {comparisonData.map((comp, index) => (
                <Radar key={comp.id} name={comp.name} dataKey={comp.name} stroke={COLORS[index]} fill={COLORS[index]} fillOpacity={0.1} strokeWidth={2} />
              ))}
              <Tooltip contentStyle={{ backgroundColor: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div>
        <h2 className="text-xl font-bold text-white mb-6">Company Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisonData.map((comp, index) => (
            <motion.div key={comp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`rounded-2xl border p-6 ${comp.isMe ? "border-[#6366f1]/50 bg-[#6366f1]/5" : "border-white/10 bg-[#0f0f1a]"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white" style={{ backgroundColor: COLORS[index] }}>
                  {comp.name.charAt(0)}
                </div>
                {comp.isMe && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-bold">YOU</span>}
                {!comp.isMe && (
                  <button onClick={() => handleRemoveFromSelection(comp.id)} className="text-slate-400 hover:text-red-400 transition-colors" title="Remove from comparison">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h3 className="text-sm font-bold text-white mb-1 truncate">{comp.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{comp.city}, {comp.country}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Score</span>
                  <span className="text-sm font-bold text-white">{comp.overallScore || "N/A"}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" style={{ width: `${comp.overallScore || 0}%` }} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs text-slate-500">Traffic</span>
                  <span className="text-xs font-bold text-white">{comp.traffic > 0 ? `${(comp.traffic / 1000).toFixed(0)}K/mo` : "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Growth</span>
                  <span className={`text-xs font-bold ${comp.growth > 0 ? "text-emerald-400" : comp.growth < 0 ? "text-red-400" : "text-slate-400"}`}>
                    {comp.growth !== 0 ? `${comp.growth > 0 ? "+" : ""}${comp.growth}%` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Market Share</span>
                  <span className="text-xs font-bold text-white">{comp.marketShare > 0 ? `${comp.marketShare}%` : "N/A"}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {smartInsights && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-[#8b5cf6]" />
            <h2 className="text-xl font-bold text-white">Smart Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-emerald-200">Strength</h3>
              </div>
              <p className="text-lg font-bold text-white mb-2">{smartInsights.strength.title}</p>
              <p className="text-sm text-slate-300">{smartInsights.strength.description}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-blue-400" />
                <h3 className="text-sm font-bold text-blue-200">Opportunity</h3>
              </div>
              <p className="text-lg font-bold text-white mb-2">{smartInsights.weakness.title}</p>
              <p className="text-sm text-slate-300">{smartInsights.weakness.description}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-amber-200">Threat</h3>
              </div>
              <p className="text-lg font-bold text-white mb-2">{smartInsights.threat.title}</p>
              <p className="text-sm text-slate-300">{smartInsights.threat.description}</p>
            </motion.div>
          </div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Market Position Map</h2>
          <p className="text-sm text-slate-400 mt-1">Market Share vs Brand Authority</p>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis type="number" dataKey="marketShare" name="Market Share" unit="%" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis type="number" dataKey="brandAuthority" name="Brand Authority" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <ZAxis type="number" dataKey="traffic" range={[100, 1000]} name="Traffic" />
              <Tooltip contentStyle={{ backgroundColor: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
              <Scatter data={marketPositionData}>
                {marketPositionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {showAddModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative max-w-md w-full rounded-2xl border border-white/10 bg-[#0f0f1a] p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <X className="h-5 w-5 text-slate-400" />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Add Competitor</h2>
            <p className="text-sm text-slate-400 mb-6">Add a competitor manually to compare against your business.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Competitor Name *</label>
                <input type="text" value={newCompetitorName} onChange={(e) => setNewCompetitorName(e.target.value)} placeholder="e.g., Competitor Inc." className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors" autoFocus />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { setShowAddModal(false); setNewCompetitorName(""); }} className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-all">Cancel</button>
                <button onClick={handleAddCompetitor} disabled={!newCompetitorName.trim() || savingNew} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-3 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all">
                  {savingNew ? <><Loader2 className="h-4 w-4 animate-spin" /> Adding...</> : <><Plus className="h-4 w-4" /> Add</>}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}