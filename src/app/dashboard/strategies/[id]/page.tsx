"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  Target, 
  Calendar,
  Lock,
  TrendingUp,
  Palette,
  FileText,
  DollarSign,
  Users,
  BarChart3,
  Zap,
  Brain,
  Eye,
  Globe,
  Award,
  LineChart,
  Sparkles,
  Lightbulb,
  Rocket,
  Shield,
  Activity,
  Compass
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { FeatureGate } from "@/components/FeatureGate";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

// Interface complète pour typer la stratégie
interface StrategyData {
  id: string;
  name: string;
  goal: string;
  industry: string;
  country?: string;
  city?: string;
  budget?: number;
  created_at?: string;
  overview?: {
    businessName?: string;
    industry?: string;
    country?: string;
    city?: string;
    budget?: number;
    marketScore?: number;
    growthPotential?: string;
    competition?: string;
    estimatedROI?: string;
    budgetSplit?: Record<string, number>;
  };
  market?: {
    marketSize?: string;
    growthRate?: number;
    trends?: string[];
    opportunities?: string[];
    threats?: string[];
    customerPainPoints?: string[];
    buyingMotivations?: string[];
  };
  competitors?: Array<{
    name: string;
    website?: string;
    position: string;
    traffic?: string;
    share?: string;
    ads?: string;
    strengths?: string[];
    weaknesses?: string[];
    opportunity?: number;
    estimatedTraffic?: number;
    seoVisibility?: number;
    topChannels?: string[];
    mainOffer?: string;
    uniqueSellingProposition?: string;
    customerSentiment?: string;
    growthScore?: number;
    trendScore?: number;
    competitiveThreat?: string;
    advertisingActivity?: {
      googleAds?: boolean;
      metaAds?: boolean;
      linkedinAds?: boolean;
      tiktokAds?: boolean;
    };
  }>;
  audience?: {
    primaryPersona?: any;
    secondaryPersona?: any;
    demographics?: Record<string, string>;
    behaviors?: string[];
    interests?: string[];
  };
  personas?: Array<any>;
  campaigns?: Array<{
    platform: string;
    objective: string;
    headline: string;
    text: string;
    cta?: string;
    hook?: string;
    budget: string;
    reach: string;
    targetPersona?: string;
    duration?: string;
  }>;
  creative?: {
    adCopy?: Array<{
      platform?: string;
      headline: string;
      primaryText: string;
      hook?: string;
      cta?: string;
      tone?: string;
    }>;
    visualDirection?: string;
    brandVoice?: string;
    colorPalette?: string[];
  };
  analytics?: {
    kpis?: Array<{
      name: string;
      target: string;
      current?: string;
      trend?: "up" | "down" | "neutral";
    }>;
    trackingSetup?: string[];
    reportingCadence?: string;
  };
  roadmap?: Array<{
    task: string;
    priority: "High" | "Medium" | "Low";
    month: string;
    impact?: string;
    difficulty?: string;
    results: string;
  }>;
  recommendations?: Array<{
    category?: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    expectedImpact?: string;
    effort?: "low" | "medium" | "high";
    confidence?: number;
  }>;
  aiRecommendation?: {
    opportunity: string;
    confidence: string;
    result: string;
    priority: string;
  };
  [key: string]: unknown;
}

export default function StrategyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { 
    isFree, 
    isPro, 
    isPremium, 
    isEnterprise, 
    isProOrAbove, 
    isPremiumOrAbove,
    canExportPDF,
    canSeeCompetitorIntel,
    canSeeAudienceInsights,
    canSeePredictiveTrends,
    canSeeMarketShare,
    canSeeTrafficEstimation,
    canSeeAdvancedReports,
    loading: permsLoading 
  } = usePermissions();
  
  const [strategy, setStrategy] = useState<StrategyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrategy = async () => {
      if (!params.id) return;

      try {
        const { data, error } = await supabase
          .from("strategies")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          console.error("Error fetching strategy:", error);
          return;
        }

        if (data) {
          const parsed: StrategyData = {
            id: String(data.id),
            name: String(data.title || "Untitled Strategy"),
            goal: String(data.objective || "Marketing Strategy"),
            industry: String(data.industry || "Unknown"),
            country: data.data?.country || data.data?.overview?.country,
            city: data.data?.city || data.data?.overview?.city,
            budget: data.data?.budget || data.data?.overview?.budget,
            created_at: data.created_at,
            ...(data.data || {}),
          };
          setStrategy(parsed);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategy();
  }, [params.id]);

  const handleExportPDF = async () => {
    if (!canExportPDF) {
      alert("Export PDF is available on Pro and above. Upgrade to unlock.");
      router.push("/dashboard/billing");
      return;
    }

    try {
      const { pdf } = await import("@react-pdf/renderer");
      const StrategyPDF = (await import("@/components/StrategyPDF")).default;
      
      const blob = await pdf(<StrategyPDF strategy={strategy} isFree={false} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${strategy?.name || "strategy"}-makeitads.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  if (loading || permsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1]" />
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Strategy not found</p>
          <button
            onClick={() => router.push("/dashboard/strategies")}
            className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-bold text-white"
          >
            Back to Strategies
          </button>
        </div>
      </div>
    );
  }

  const SectionCard = ({ 
    title, 
    icon: Icon, 
    children, 
    badge 
  }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    badge?: string;
  }) => (
    <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6 relative overflow-hidden">
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#8b5cf6]" />
        {title}
        {badge && (
          <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-bold">
            {badge}
          </span>
        )}
      </h3>
      {children}
    </div>
  );

  // ===== SECTION 1 : OVERVIEW (Toujours visible) =====
  const renderOverview = () => {
    const overview = strategy.overview;
    if (!overview) return null;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Score */}
        <SectionCard title="Market Score" icon={BarChart3}>
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24">
              <svg className="h-24 w-24 -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="none" className="text-white/10" />
                <circle 
                  cx="48" cy="48" r="40" 
                  stroke="url(#scoreGradient)" 
                  strokeWidth="6" 
                  fill="none"
                  strokeDasharray={`${((overview.marketScore || 0) / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{overview.marketScore || 0}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Growth Potential</span>
                <span className="text-sm font-bold text-emerald-400">{overview.growthPotential || "High"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Competition</span>
                <span className="text-sm font-bold text-white">{overview.competition || "Medium"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Est. ROI</span>
                <span className="text-sm font-bold text-[#8b5cf6]">{overview.estimatedROI || "250%"}</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Budget Allocation */}
        <SectionCard title="Budget Allocation" icon={DollarSign}>
          {overview.budgetSplit ? (
            <div className="space-y-3">
              {Object.entries(overview.budgetSplit).map(([platform, percentage]) => (
                <div key={platform}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300 capitalize">{platform}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        ${strategy.budget ? Math.round((strategy.budget * (percentage as number)) / 100).toLocaleString() : "—"}
                      </span>
                      <span className="text-sm font-bold text-white">{percentage as number}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No budget data available</p>
          )}
        </SectionCard>
      </div>
    );
  };

  // ===== SECTION 2 : MARKET ANALYSIS (Premium+) =====
  const renderMarket = () => {
    if (!strategy.market) return null;

    return (
      <FeatureGate feature="predictiveTrends" requiredPlan="premium">
        <SectionCard title="Market Analysis" icon={Globe} badge="Premium">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs text-slate-500 mb-1">Market Size</p>
              <p className="text-lg font-bold text-white">{strategy.market.marketSize || "N/A"}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs text-slate-500 mb-1">Growth Rate</p>
              <p className="text-lg font-bold text-emerald-400">
                {strategy.market.growthRate ? `${strategy.market.growthRate}%` : "N/A"}
              </p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs text-slate-500 mb-1">Trends</p>
              <p className="text-lg font-bold text-[#8b5cf6]">
                {strategy.market.trends?.length || 0} identified
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trends */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Market Trends</p>
              <div className="space-y-2">
                {strategy.market.trends?.map((trend, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <TrendingUp className="h-3 w-3 text-emerald-400 mt-1 flex-shrink-0" />
                    <span>{trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opportunities</p>
              <div className="space-y-2">
                {strategy.market.opportunities?.map((opp, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <Lightbulb className="h-3 w-3 text-amber-400 mt-1 flex-shrink-0" />
                    <span>{opp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Threats */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Threats</p>
              <div className="space-y-2">
                {strategy.market.threats?.map((threat, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <Shield className="h-3 w-3 text-red-400 mt-1 flex-shrink-0" />
                    <span>{threat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pain Points */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Pain Points</p>
              <div className="space-y-2">
                {strategy.market.customerPainPoints?.map((pain, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <Target className="h-3 w-3 text-[#8b5cf6] mt-1 flex-shrink-0" />
                    <span>{pain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </FeatureGate>
    );
  };

  // ===== SECTION 3 : COMPETITORS (Pro+) =====
  const renderCompetitors = () => {
    if (!strategy.competitors || strategy.competitors.length === 0) return null;

    return (
      <FeatureGate feature="competitorIntelligence" requiredPlan="pro">
        <SectionCard title="Competitor Intelligence" icon={Target} badge="Pro">
          <div className="space-y-4">
            {strategy.competitors.map((comp, index) => (
              <div key={index} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                      {comp.name}
                      {comp.website && (
                        <a 
                          href={comp.website.startsWith("http") ? comp.website : `https://${comp.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#8b5cf6] hover:text-white transition-colors"
                        >
                          ↗
                        </a>
                      )}
                    </h4>
                    {comp.mainOffer && (
                      <p className="text-xs text-slate-400 mt-1">{comp.mainOffer}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-bold">
                      {comp.position}
                    </span>
                    {comp.opportunity !== undefined && (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                        {comp.opportunity}% opp.
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-xs">
                  {comp.traffic && (
                    <div className="rounded-md bg-white/[0.03] px-2 py-1.5">
                      <p className="text-slate-500">Traffic</p>
                      <p className="font-bold text-white">{comp.traffic}</p>
                    </div>
                  )}
                  {comp.share && (
                    <div className="rounded-md bg-white/[0.03] px-2 py-1.5">
                      <p className="text-slate-500">Market Share</p>
                      <p className="font-bold text-white">{comp.share}</p>
                    </div>
                  )}
                  {comp.ads && (
                    <div className="rounded-md bg-white/[0.03] px-2 py-1.5">
                      <p className="text-slate-500">Ads Activity</p>
                      <p className="font-bold text-white">{comp.ads}</p>
                    </div>
                  )}
                  {comp.customerSentiment && (
                    <div className="rounded-md bg-white/[0.03] px-2 py-1.5">
                      <p className="text-slate-500">Sentiment</p>
                      <p className={`font-bold ${
                        comp.customerSentiment === "positive" ? "text-emerald-400" :
                        comp.customerSentiment === "negative" ? "text-red-400" : "text-amber-400"
                      }`}>
                        {comp.customerSentiment}
                      </p>
                    </div>
                  )}
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Strengths</p>
                    <div className="space-y-1">
                      {comp.strengths?.map((s, i) => (
                        <p key={i} className="text-xs text-slate-300">+ {s}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Weaknesses</p>
                    <div className="space-y-1">
                      {comp.weaknesses?.map((w, i) => (
                        <p key={i} className="text-xs text-slate-300">- {w}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advertising Activity */}
                {comp.advertisingActivity && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ad Platforms Active</p>
                    <div className="flex flex-wrap gap-2">
                      {comp.advertisingActivity.googleAds && (
                        <span className="text-[10px] px-2 py-1 rounded bg-blue-500/10 text-blue-400">Google Ads</span>
                      )}
                      {comp.advertisingActivity.metaAds && (
                        <span className="text-[10px] px-2 py-1 rounded bg-sky-500/10 text-sky-400">Meta Ads</span>
                      )}
                      {comp.advertisingActivity.linkedinAds && (
                        <span className="text-[10px] px-2 py-1 rounded bg-blue-700/10 text-blue-300">LinkedIn Ads</span>
                      )}
                      {comp.advertisingActivity.tiktokAds && (
                        <span className="text-[10px] px-2 py-1 rounded bg-pink-500/10 text-pink-400">TikTok Ads</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      </FeatureGate>
    );
  };

  // ===== SECTION 4 : AUDIENCE PERSONAS (Pro+) =====
  const renderAudience = () => {
    const personas = strategy.personas || [];
    const audience = strategy.audience;
    
    if (personas.length === 0 && !audience?.primaryPersona) return null;

    const displayPersonas = personas.length > 0 
      ? personas 
      : [audience?.primaryPersona, audience?.secondaryPersona].filter(Boolean);

    return (
      <FeatureGate feature="audienceInsights" requiredPlan="pro">
        <SectionCard title="Audience Personas" icon={Users} badge="Pro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayPersonas.map((persona, index) => (
              <div key={index} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white">{persona.name}</h4>
                    <p className="text-xs text-slate-400">{persona.occupation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{persona.age}</p>
                    <p className="text-xs text-slate-500">{persona.gender}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Income</span>
                    <span className="text-white font-medium">{persona.income}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Goals</p>
                  <div className="flex flex-wrap gap-1">
                    {persona.goals?.map((g: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{g}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Pain Points</p>
                  <div className="flex flex-wrap gap-1">
                    {persona.painPoints?.map((p: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400">{p}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-[#8b5cf6] uppercase tracking-wider mb-1">Preferred Channels</p>
                  <div className="flex flex-wrap gap-1">
                    {persona.preferredChannels?.map((c: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#6366f1]/10 text-[#a5b4fc]">{c}</span>
                    ))}
                  </div>
                </div>

                {persona.buyingBehavior && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Buying Behavior</p>
                    <p className="text-xs text-slate-300">{persona.buyingBehavior}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Demographics */}
          {audience?.demographics && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Demographics</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(audience.demographics).map(([key, value]) => (
                  <div key={key} className="rounded-md bg-white/[0.03] px-3 py-2">
                    <p className="text-[10px] text-slate-500 capitalize">{key}</p>
                    <p className="text-xs font-bold text-white">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </FeatureGate>
    );
  };

  // ===== SECTION 5 : CAMPAIGNS (Toujours visible) =====
  const renderCampaigns = () => {
    if (!strategy.campaigns || strategy.campaigns.length === 0) return null;

    return (
      <SectionCard title="Campaign Strategy" icon={Zap}>
        <div className="space-y-3">
          {strategy.campaigns.map((camp, index) => (
            <div key={index} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded-md bg-[#6366f1]/20 text-[#8b5cf6] text-xs font-bold">
                  {camp.platform}
                </span>
                <span className="text-xs text-slate-400">{camp.objective}</span>
                {camp.duration && (
                  <span className="ml-auto text-[10px] text-slate-500">{camp.duration}</span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{camp.headline}</h4>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">{camp.text}</p>
              
              {camp.hook && (
                <div className="mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                    Hook: {camp.hook}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <span className="text-[#8b5cf6]">💰 {camp.budget}</span>
                  <span className="text-emerald-400">👥 {camp.reach}</span>
                </div>
                {camp.cta && (
                  <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-slate-300">
                    CTA: {camp.cta}
                  </span>
                )}
              </div>

              {camp.targetPersona && (
                <p className="text-[10px] text-slate-500 mt-2">
                  🎯 Target: {camp.targetPersona}
                </p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    );
  };

  // ===== SECTION 6 : CREATIVE DIRECTION (Pro+) =====
  const renderCreative = () => {
    if (!strategy.creative) return null;

    return (
      <FeatureGate feature="pdfExport" requiredPlan="pro">
        <SectionCard title="Creative Direction" icon={Palette} badge="Pro">
          {/* Visual Direction */}
          {strategy.creative.visualDirection && (
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Visual Direction</p>
              <p className="text-sm text-slate-300 leading-relaxed">{strategy.creative.visualDirection}</p>
            </div>
          )}

          {/* Brand Voice */}
          {strategy.creative.brandVoice && (
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Brand Voice</p>
              <p className="text-sm text-slate-300 leading-relaxed">{strategy.creative.brandVoice}</p>
            </div>
          )}

          {/* Color Palette */}
          {strategy.creative.colorPalette && strategy.creative.colorPalette.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Color Palette</p>
              <div className="flex gap-2">
                {strategy.creative.colorPalette.map((color, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div 
                      className="h-10 w-10 rounded-lg border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-slate-400 font-mono">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ad Copy */}
          {strategy.creative.adCopy && strategy.creative.adCopy.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ad Copy Examples</p>
              <div className="space-y-3">
                {strategy.creative.adCopy.map((copy, index) => (
                  <div key={index} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                    {copy.platform && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#6366f1]/20 text-[#8b5cf6] font-bold mb-2 inline-block">
                        {copy.platform}
                      </span>
                    )}
                    <p className="text-sm font-bold text-white mb-2">{copy.headline}</p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{copy.primaryText}</p>
                    <div className="flex items-center gap-2">
                      {copy.hook && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                          {copy.hook}
                        </span>
                      )}
                      {copy.cta && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                          CTA: {copy.cta}
                        </span>
                      )}
                      {copy.tone && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#8b5cf6]/10 text-[#a5b4fc]">
                          {copy.tone}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </FeatureGate>
    );
  };

  // ===== SECTION 7 : ANALYTICS & KPIs (Premium+) =====
  const renderAnalytics = () => {
    if (!strategy.analytics) return null;

    return (
      <FeatureGate feature="advancedReports" requiredPlan="premium">
        <SectionCard title="Analytics & KPIs" icon={LineChart} badge="Premium">
          {/* KPIs */}
          {strategy.analytics.kpis && strategy.analytics.kpis.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Performance Indicators</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {strategy.analytics.kpis.map((kpi, i) => (
                  <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-white">{kpi.name}</p>
                      {kpi.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                      {kpi.trend === "down" && <TrendingUp className="h-3 w-3 text-red-400 rotate-180" />}
                    </div>
                    <p className="text-sm font-bold text-[#8b5cf6]">{kpi.target}</p>
                    {kpi.current && (
                      <p className="text-[10px] text-slate-500 mt-1">Current: {kpi.current}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracking Setup */}
          {strategy.analytics.trackingSetup && strategy.analytics.trackingSetup.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tracking Setup</p>
              <div className="flex flex-wrap gap-2">
                {strategy.analytics.trackingSetup.map((tool, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.03] text-slate-300 border border-white/5">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reporting Cadence */}
          {strategy.analytics.reportingCadence && (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="text-xs text-slate-400">Reporting Cadence</p>
              <p className="text-sm font-bold text-white">{strategy.analytics.reportingCadence}</p>
            </div>
          )}
        </SectionCard>
      </FeatureGate>
    );
  };

  // ===== SECTION 8 : ROADMAP (Toujours visible) =====
  const renderRoadmap = () => {
    if (!strategy.roadmap || strategy.roadmap.length === 0) return null;

    return (
      <SectionCard title="90-Day Roadmap" icon={Calendar}>
        <div className="space-y-3">
          {strategy.roadmap.map((item, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#8b5cf6]">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white">{item.task}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    item.priority === "High" ? "bg-red-500/20 text-red-400" : 
                    item.priority === "Medium" ? "bg-amber-500/20 text-amber-400" : 
                    "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{item.month}</p>
                {item.impact && (
                  <p className="text-xs text-slate-300 mb-1">💡 {item.impact}</p>
                )}
                {item.difficulty && (
                  <p className="text-xs text-slate-500 mb-1">⚙️ Difficulty: {item.difficulty}</p>
                )}
                <p className="text-xs text-emerald-400">✓ {item.results}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  };

  // ===== SECTION 9 : RECOMMENDATIONS (Pro+) =====
  const renderRecommendations = () => {
    if (!strategy.recommendations || strategy.recommendations.length === 0) return null;

    return (
      <FeatureGate feature="swotAnalysis" requiredPlan="pro">
        <SectionCard title="Strategic Recommendations" icon={Rocket} badge="Pro">
          <div className="space-y-3">
            {strategy.recommendations.map((rec, index) => (
              <div key={index} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {rec.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#6366f1]/20 text-[#8b5cf6] font-bold uppercase">
                          {rec.category}
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        rec.priority === "high" ? "bg-red-500/20 text-red-400" : 
                        rec.priority === "medium" ? "bg-amber-500/20 text-amber-400" : 
                        "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                  </div>
                  {rec.confidence !== undefined && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#8b5cf6]">{rec.confidence}%</p>
                      <p className="text-[10px] text-slate-500">confidence</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">{rec.description}</p>
                <div className="flex items-center gap-4 text-xs">
                  {rec.expectedImpact && (
                    <span className="text-emerald-400">📈 {rec.expectedImpact}</span>
                  )}
                  {rec.effort && (
                    <span className="text-slate-400">⚙️ Effort: {rec.effort}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </FeatureGate>
    );
  };

  // ===== SECTION 10 : AI RECOMMENDATION (Toujours visible) =====
  const renderAIRecommendation = () => {
    if (!strategy.aiRecommendation) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#6366f1]/50">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8b5cf6] mb-2 flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              AI Strategic Recommendation
            </p>
            <h4 className="text-lg font-bold text-white mb-3">
              {strategy.aiRecommendation.opportunity}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Confidence</p>
                <p className="text-sm font-bold text-emerald-400">{strategy.aiRecommendation.confidence}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Expected Result</p>
                <p className="text-sm font-bold text-[#8b5cf6]">{strategy.aiRecommendation.result}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Priority</p>
                <p className={`text-sm font-bold ${
                  strategy.aiRecommendation.priority === "High" ? "text-red-400" :
                  strategy.aiRecommendation.priority === "Medium" ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {strategy.aiRecommendation.priority}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold text-white">{strategy.name}</h1>
              {strategy.overview?.marketScore && (
                <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] text-xs font-bold">
                  Score: {strategy.overview.marketScore}
                </span>
              )}
            </div>
            <p className="text-slate-400 mt-1">{strategy.goal}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="capitalize">{strategy.industry}</span>
              {(strategy.city || strategy.country) && (
                <>
                  <span>•</span>
                  <span>{strategy.city ? `${strategy.city}, ` : ""}{strategy.country}</span>
                </>
              )}
              {strategy.budget && (
                <>
                  <span>•</span>
                  <span>${strategy.budget.toLocaleString()}/mo</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-all">
            <Copy className="h-4 w-4" />
            Duplicate
          </button>
          <button
            onClick={handleExportPDF}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              canExportPDF
                ? "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.05] hover:text-white"
                : "border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed"
            }`}
          >
            <Download className="h-4 w-4" />
            Export PDF
            {!canExportPDF && <Lock className="h-3 w-3 ml-1" />}
          </button>
        </div>
      </div>

      {/* Render all sections */}
      {renderOverview()}
      {renderAIRecommendation()}
      {renderMarket()}
      {renderCompetitors()}
      {renderAudience()}
      {renderCampaigns()}
      {renderCreative()}
      {renderAnalytics()}
      {renderRoadmap()}
      {renderRecommendations()}
    </div>
  );
}