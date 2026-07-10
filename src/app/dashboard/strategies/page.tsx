"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Plus, 
  Search, 
  Lock,
  Target,
  Calendar,
  TrendingUp,
  Zap,
  BarChart3,
  Trash2,
  CheckSquare,
  Square,
  Copy,
  Download,
  Archive,
  Image as ImageIcon,
  X,
  Loader2,
  Palette,
  Share2,
  Megaphone
} from "lucide-react";
import { usePlan } from "@/hooks/usePlan";
import { useUsage } from "@/hooks/useUsage";
import { useSession } from "@/hooks/useSession";
import { createClient } from "@/lib/supabase";
import PageTransition from "@/components/ui/PageTransition";

const supabase = createClient();

interface Strategy {
  id: string;
  title: string;
  industry: string;
  objective: string;
  created_at: string;
  data?: {
    overview?: {
      marketScore?: number;
      competition?: string;
      growthPotential?: string;
      budgetSplit?: Record<string, number>;
    };
    campaigns?: Array<{
      platform: string;
      objective: string;
    }>;
    creative?: {
      brandVoice?: string;
      colorPalette?: string[];
      visualDirection?: string;
    };
    audience?: {
      primaryPersona?: {
        name?: string;
        age?: string;
        occupation?: string;
      };
    };
  };
}

interface ImagePrompt {
  type: string;
  prompt: string;
  style: string;
  platform: string;
}

export default function StrategiesPage() {
  const router = useRouter();
  const { isFree, loading: planLoading } = usePlan();
  const { usage: usageData } = useUsage();
  const { user, loading: sessionLoading } = useSession();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedStrategyForImages, setSelectedStrategyForImages] = useState<Strategy | null>(null);
  const [imagePrompts, setImagePrompts] = useState<ImagePrompt[]>([]);
  const [generatingPrompts, setGeneratingPrompts] = useState(false);

  useEffect(() => {
    const fetchStrategies = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("strategies")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching strategies:", error);
          return;
        }

        setStrategies(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStrategies();
    }
  }, [user]);

  const quotaUsed = strategies.length;
  const quotaLimit = usageData?.strategiesLimit || 1;
  const isQuotaReached = isFree && quotaUsed >= quotaLimit;

  const handleNewStrategy = () => {
    if (isQuotaReached) {
      alert("Monthly quota reached. Upgrade to Pro for unlimited strategies.");
      router.push("/dashboard/billing");
      return;
    }
    router.push("/dashboard/strategies/new");
  };

  const handleDelete = async (strategyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this strategy?")) {
      return;
    }

    setDeletingId(strategyId);

    try {
      const { error } = await supabase
        .from("strategies")
        .delete()
        .eq("id", strategyId);

      if (error) {
        console.error("Error deleting strategy:", error);
        alert("Failed to delete strategy");
        return;
      }

      setStrategies((prev) => prev.filter((s) => s.id !== strategyId));
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(strategyId);
        return newSet;
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete strategy");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSelection = (strategyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(strategyId)) {
        newSet.delete(strategyId);
      } else {
        newSet.add(strategyId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStrategies.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStrategies.map((s) => s.id)));
    }
  };

  const filteredStrategies = strategies.filter((strategy) =>
    strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    strategy.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} strateg${selectedIds.size === 1 ? 'y' : 'ies'}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("strategies")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) {
        console.error("Error deleting strategies:", error);
        alert("Failed to delete strategies");
        return;
      }

      setStrategies((prev) => prev.filter((s) => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete strategies");
    }
  };

  const handleBulkDuplicate = async () => {
    if (selectedIds.size === 0) return;

    try {
      const strategiesToDuplicate = strategies.filter((s) => selectedIds.has(s.id));
      
      for (const strategy of strategiesToDuplicate) {
        const { error } = await supabase
          .from("strategies")
          .insert({
            user_id: user?.id,
            title: `${strategy.title} (Copy)`,
            industry: strategy.industry,
            objective: strategy.objective,
            data: strategy.data,
          });

        if (error) {
          console.error("Error duplicating strategy:", error);
          alert("Failed to duplicate some strategies");
          return;
        }
      }

      const { data } = await supabase
        .from("strategies")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      setStrategies(data || []);
      setSelectedIds(new Set());
      alert(`${strategiesToDuplicate.length} strateg${strategiesToDuplicate.length === 1 ? 'y' : 'ies'} duplicated successfully!`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to duplicate strategies");
    }
  };

  const handleBulkExport = () => {
    if (selectedIds.size === 0) return;

    const strategiesToExport = strategies.filter((s) => selectedIds.has(s.id));
    
    const csvHeaders = ["Title", "Industry", "Objective", "Market Score", "Created At"];
    const csvRows = strategiesToExport.map((s) => [
      `"${s.title.replace(/"/g, '""')}"`,
      s.industry,
      `"${s.objective.replace(/"/g, '""')}"`,
      s.data?.overview?.marketScore || 0,
      new Date(s.created_at).toLocaleDateString(),
    ]);

    const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `makeitads-strategies-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateImagePrompts = (strategy: Strategy): ImagePrompt[] => {
    const industry = strategy.industry || "business";
    const brandVoice = strategy.data?.creative?.brandVoice || "professional";
    const colors = strategy.data?.creative?.colorPalette || ["#6366f1", "#8b5cf6"];
    const targetAudience = strategy.data?.audience?.primaryPersona;
    const visualDirection = strategy.data?.creative?.visualDirection || "modern and clean";
    
    const colorStr = colors.length > 0 ? `using a color palette of ${colors.join(", ")}` : "with a modern color palette";
    const audienceStr = targetAudience 
      ? `targeting ${targetAudience.age || "adults"} ${targetAudience.occupation || "professionals"}`
      : "targeting a professional audience";

    return [
      {
        type: "Social Media Post",
        platform: "Instagram/Facebook",
        style: "Engaging & Visual",
        prompt: `Create a stunning social media post for a ${industry} brand. ${visualDirection} aesthetic ${colorStr}. The image should feature ${audienceStr}, showcasing the brand's value proposition. Include space for text overlay with a compelling headline. Style: ${brandVoice}. Aspect ratio: 1:1. High quality, professional photography style.`,
      },
      {
        type: "Advertisement Banner",
        platform: "Google/Meta Ads",
        style: "Conversion-focused",
        prompt: `Design a high-converting advertisement banner for ${industry}. ${visualDirection} design ${colorStr}. The banner should grab attention immediately and communicate the core benefit. Include a clear call-to-action button area. ${audienceStr}. Style: ${brandVoice}. Dimensions: 1200x628px. Professional, eye-catching, modern.`,
      },
      {
        type: "Brand Hero Image",
        platform: "Website/Landing Page",
        style: "Premium & Aspirational",
        prompt: `Create a premium hero image for a ${industry} brand website. ${visualDirection} aesthetic ${colorStr}. The image should convey trust, quality, and innovation. Feature ${audienceStr} in a realistic setting that resonates with their aspirations. Style: ${brandVoice}. Wide format: 1920x1080px. Cinematic lighting, professional photography.`,
      },
      {
        type: "Product Showcase",
        platform: "E-commerce/Social",
        style: "Clean & Minimal",
        prompt: `Design a product showcase image for ${industry}. ${visualDirection} style ${colorStr}. The product should be the focal point with clean, minimal background. Highlight key features and benefits visually. ${audienceStr}. Style: ${brandVoice}. Square format: 1080x1080px. Studio lighting, high-end commercial photography.`,
      },
      {
        type: "Story/Reel Cover",
        platform: "Instagram/TikTok",
        style: "Dynamic & Bold",
        prompt: `Create an eye-catching story/reel cover for ${industry} social media. ${visualDirection} aesthetic ${colorStr}. Bold, dynamic composition that stops the scroll. Include space for text overlay. ${audienceStr}. Style: ${brandVoice}. Vertical format: 1080x1920px. Vibrant, energetic, modern.`,
      },
      {
        type: "Email Header",
        platform: "Email Marketing",
        style: "Professional & Clean",
        prompt: `Design a professional email header image for ${industry} newsletter. ${visualDirection} design ${colorStr}. Clean, modern layout that establishes brand authority. Include logo placement area and headline space. ${audienceStr}. Style: ${brandVoice}. Wide format: 600x200px. Corporate, trustworthy, polished.`,
      },
    ];
  };

  const handleGenerateImages = (strategy: Strategy, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStrategyForImages(strategy);
    setGeneratingPrompts(true);
    setShowImageModal(true);

    setTimeout(() => {
      const prompts = generateImagePrompts(strategy);
      setImagePrompts(prompts);
      setGeneratingPrompts(false);
    }, 1500);
  };

  const copyPromptToClipboard = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    alert("Prompt copied to clipboard!");
  };

  if (loading || planLoading || sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6366f1] mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading strategies...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-5 sm:space-y-6">
        
        {/* ═══════════════════════════════════════════════════════════
            HEADER RESPONSIVE
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white no-hyphens">
                Strategies
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {isFree 
                  ? `${quotaUsed}/${quotaLimit} used this month` 
                  : `${strategies.length} ${strategies.length === 1 ? 'strategy' : 'strategies'}`}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleNewStrategy}
            disabled={isQuotaReached}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span>New Strategy</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            QUOTA WARNING
            ═══════════════════════════════════════════════════════════ */}
        {isQuotaReached && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 sm:p-4 flex items-start gap-3"
          >
            <Lock className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-200">Monthly quota reached</p>
              <p className="text-xs text-amber-400/80 mt-0.5">
                Upgrade to Pro for unlimited strategies
              </p>
            </div>
            <button 
              onClick={() => router.push("/dashboard/billing")}
              className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors flex-shrink-0"
            >
              Upgrade
            </button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            SEARCH & SELECT ALL - Empilés sur mobile
            ═══════════════════════════════════════════════════════════ */}
        {strategies.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 placeholder:text-slate-600"
              />
            </div>
            
            <button
              onClick={toggleSelectAll}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
            >
              {selectedIds.size === filteredStrategies.length && filteredStrategies.length > 0 ? (
                <CheckSquare className="h-4 w-4 text-[#8b5cf6]" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>{selectedIds.size === filteredStrategies.length ? "Deselect" : "Select All"}</span>
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            BULK ACTIONS BAR - Scrollable sur mobile
            ═══════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sticky top-4 z-40 rounded-xl border border-[#6366f1]/30 bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 backdrop-blur-xl p-3 sm:p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#6366f1] text-white font-bold text-xs sm:text-sm flex-shrink-0">
                    {selectedIds.size}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white truncate">
                    {selectedIds.size} selected
                  </p>
                </div>
                
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 sm:px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-all flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
              
              {/* Actions scrollables horizontalement sur mobile */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                <button
                  onClick={handleBulkDuplicate}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-all whitespace-nowrap flex-shrink-0"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Duplicate</span>
                </button>
                
                <button
                  onClick={handleBulkExport}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-all whitespace-nowrap flex-shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
                
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all whitespace-nowrap flex-shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════
            EMPTY STATE
            ═══════════════════════════════════════════════════════════ */}
        {strategies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-8 sm:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6366f1]/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 mb-4 sm:mb-6">
                <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-[#8b5cf6]" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3 no-hyphens">
                No strategy created yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto">
                Generate your first AI-powered strategy and unlock actionable insights.
              </p>
              <button
                onClick={handleNewStrategy}
                disabled={isQuotaReached}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Create first strategy
              </button>
            </div>
          </motion.div>
        ) : filteredStrategies.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-12 text-center">
            <Search className="h-10 w-10 text-slate-600 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">No results found</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Try adjusting your search query
            </p>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════
              STRATEGIES GRID
              ═══════════════════════════════════════════════════════════ */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredStrategies.map((strategy, index) => {
              const platforms = strategy.data?.campaigns?.map(c => c.platform).filter((v, i, a) => a.indexOf(v) === i) || [];
              const marketScore = strategy.data?.overview?.marketScore || 0;
              const isSelected = selectedIds.has(strategy.id);

              return (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => router.push(`/dashboard/strategies/${strategy.id}`)}
                  className={`group relative rounded-2xl border p-4 sm:p-6 transition-all cursor-pointer active:scale-[0.99] ${
                    isSelected
                      ? "border-[#6366f1] bg-[#6366f1]/5 shadow-lg shadow-[#6366f1]/20"
                      : "border-white/10 bg-[#0f0f1a] hover:border-[#6366f1]/30"
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => toggleSelection(strategy.id, e)}
                    className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10"
                  >
                    {isSelected ? (
                      <CheckSquare className="h-5 w-5 text-[#8b5cf6]" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </button>

                  {/* Action buttons - TOUJOURS visibles sur mobile */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-10">
                    <button
                      onClick={(e) => handleGenerateImages(strategy, e)}
                      className="p-2 rounded-lg bg-[#6366f1]/10 text-[#8b5cf6] sm:opacity-0 sm:group-hover:opacity-100 hover:bg-[#6366f1]/20 transition-all active:scale-95"
                      title="Generate brand images"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(strategy.id, e)}
                      disabled={deletingId === strategy.id}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-500/20 transition-all active:scale-95"
                      title="Delete strategy"
                    >
                      {deletingId === strategy.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-start justify-between mb-3 sm:mb-4 pl-8 pr-16">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white truncate group-hover:text-[#8b5cf6] transition-colors">
                        {strategy.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1 capitalize truncate">
                        {strategy.industry}
                      </p>
                    </div>
                  </div>

                  {platforms.length > 0 && (
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
                      {platforms.slice(0, 3).map((platform) => (
                        <span
                          key={platform}
                          className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-medium text-slate-300"
                        >
                          {platform}
                        </span>
                      ))}
                      {platforms.length > 3 && (
                        <span className="text-[9px] sm:text-[10px] text-slate-500">+{platforms.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#8b5cf6] flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs text-slate-400 truncate">
                        Score: <span className="text-white font-bold">{marketScore}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#38bdf8] flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs text-slate-400 truncate">
                        {new Date(strategy.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {strategy.objective && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/5">
                      <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2">
                        {strategy.objective}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            IMAGE GENERATION MODAL
            ═══════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showImageModal && selectedStrategyForImages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4"
              onClick={() => setShowImageModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f0f1a] p-5 sm:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                        Brand Image Prompts
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 truncate">
                        {selectedStrategyForImages.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
                  >
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                {/* Loading State */}
                {generatingPrompts ? (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                    <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-[#6366f1] mb-4" />
                    <p className="text-xs sm:text-sm text-slate-400 text-center">
                      Analyzing your brand and generating prompts...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {imagePrompts.map((imagePrompt, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-xs sm:text-sm font-bold text-white">
                                {imagePrompt.type}
                              </h3>
                              <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-bold">
                                {imagePrompt.platform}
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-500">
                              {imagePrompt.style}
                            </p>
                          </div>
                          <button
                            onClick={() => copyPromptToClipboard(imagePrompt.prompt)}
                            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-all flex-shrink-0"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <div className="rounded-lg bg-black/20 p-3 sm:p-4 border border-white/5">
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono break-words">
                            {imagePrompt.prompt}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              window.open(`https://www.midjourney.com/app/`, '_blank');
                            }}
                            className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#8b5cf6] hover:text-white transition-colors"
                          >
                            <Palette className="h-3 w-3" />
                            <span>Midjourney</span>
                          </button>
                          <span className="text-slate-600">•</span>
                          <button
                            onClick={() => {
                              window.open(`https://openai.com/dall-e-3/`, '_blank');
                            }}
                            className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#8b5cf6] hover:text-white transition-colors"
                          >
                            <ImageIcon className="h-3 w-3" />
                            <span>DALL-E</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/5">
                  <p className="text-[10px] sm:text-xs text-slate-500 text-center">
                    💡 Copy these prompts and use them in your preferred AI image generator
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}