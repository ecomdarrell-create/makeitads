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
  
  // ✅ NOUVEAU : Sélection multiple
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // ✅ NOUVEAU : Modal de génération d'images
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedStrategyForImages, setSelectedStrategyForImages] = useState<Strategy | null>(null);
  const [imagePrompts, setImagePrompts] = useState<ImagePrompt[]>([]);
  const [generatingPrompts, setGeneratingPrompts] = useState(false);

  // Fetch des VRAIES stratégies depuis Supabase
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

  // ✅ NOUVEAU : Gestion de la sélection
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

  // ✅ NOUVEAU : Actions groupées
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

      // Rafraîchir la liste
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

  // ✅ NOUVEAU : Génération de prompts d'images
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

    // Simuler un délai de génération (en production, on appellerait une API)
    setTimeout(() => {
      const prompts = generateImagePrompts(strategy);
      setImagePrompts(prompts);
      setGeneratingPrompts(false);
    }, 1500);
  };

  const copyPromptToClipboard = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    alert("Prompt copied to clipboard! You can now use it in Midjourney, DALL-E, or Stable Diffusion.");
  };

  if (loading || planLoading || sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1] mx-auto mb-4" />
          <p className="text-slate-400">Loading your strategies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Strategies</h1>
          <p className="text-slate-400 mt-1">
            {isFree 
              ? `${quotaUsed}/${quotaLimit} strategy used this month` 
              : `${strategies.length} ${strategies.length === 1 ? 'strategy' : 'strategies'} created`}
          </p>
        </div>
        <button
          onClick={handleNewStrategy}
          disabled={isQuotaReached}
          className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6366f1]/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#8b5cf6]/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>New Strategy</span>
        </button>
      </div>

      {/* Quota warning (Free) */}
      {isQuotaReached && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-center gap-3"
        >
          <Lock className="h-5 w-5 text-amber-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-200">Monthly quota reached</p>
            <p className="text-xs text-amber-400/80 mt-0.5">
              Upgrade to Pro for unlimited strategies and advanced features
            </p>
          </div>
          <button 
            onClick={() => router.push("/dashboard/billing")}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
          >
            Upgrade
          </button>
        </motion.div>
      )}

      {/* Search & Select All */}
      {strategies.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search your strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 placeholder:text-slate-600"
            />
          </div>
          
          {/* Select All Button */}
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
          >
            {selectedIds.size === filteredStrategies.length && filteredStrategies.length > 0 ? (
              <CheckSquare className="h-4 w-4 text-[#8b5cf6]" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            <span>{selectedIds.size === filteredStrategies.length ? "Deselect All" : "Select All"}</span>
          </button>
        </div>
      )}

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-4 z-40 rounded-xl border border-[#6366f1]/30 bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 backdrop-blur-xl p-4 flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366f1] text-white font-bold text-sm">
                {selectedIds.size}
              </div>
              <p className="text-sm font-medium text-white">
                strateg{selectedIds.size === 1 ? 'y' : 'ies'} selected
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDuplicate}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Duplicate</span>
              </button>
              
              <button
                onClick={handleBulkExport}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
              
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
              
              <button
                onClick={() => setSelectedIds(new Set())}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
              >
                <X className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State Premium */}
      {strategies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6366f1]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 mb-6">
              <Sparkles className="h-10 w-10 text-[#8b5cf6]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No strategy created yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Generate your first AI-powered strategy and unlock actionable insights for your business.
            </p>
            <button
              onClick={handleNewStrategy}
              disabled={isQuotaReached}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Create your first AI strategy
            </button>
          </div>
        </motion.div>
      ) : filteredStrategies.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <Search className="h-10 w-10 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
          <p className="text-sm text-slate-400">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrategies.map((strategy, index) => {
            const platforms = strategy.data?.campaigns?.map(c => c.platform).filter((v, i, a) => a.indexOf(v) === i) || [];
            const marketScore = strategy.data?.overview?.marketScore || 0;
            const isSelected = selectedIds.has(strategy.id);

            return (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => router.push(`/dashboard/strategies/${strategy.id}`)}
                className={`group relative rounded-2xl border p-6 transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#6366f1] bg-[#6366f1]/5 shadow-lg shadow-[#6366f1]/20"
                    : "border-white/10 bg-[#0f0f1a] hover:border-[#6366f1]/30"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={(e) => toggleSelection(strategy.id, e)}
                  className="absolute top-4 left-4 z-10"
                >
                  {isSelected ? (
                    <CheckSquare className="h-5 w-5 text-[#8b5cf6]" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-500 group-hover:text-slate-300" />
                  )}
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(strategy.id, e)}
                  disabled={deletingId === strategy.id}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all z-10"
                  title="Delete strategy"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Generate Images button */}
                <button
                  onClick={(e) => handleGenerateImages(strategy, e)}
                  className="absolute top-4 right-14 p-2 rounded-lg bg-[#6366f1]/10 text-[#8b5cf6] opacity-0 group-hover:opacity-100 hover:bg-[#6366f1]/20 transition-all z-10"
                  title="Generate brand images"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>

                <div className="flex items-start justify-between mb-4 pl-8 pr-16">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white truncate group-hover:text-[#8b5cf6] transition-colors">
                      {strategy.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 capitalize">{strategy.industry}</p>
                  </div>
                </div>

                {platforms.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {platforms.slice(0, 3).map((platform) => (
                      <span
                        key={platform}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] font-medium text-slate-300"
                      >
                        {platform}
                      </span>
                    ))}
                    {platforms.length > 3 && (
                      <span className="text-[10px] text-slate-500">+{platforms.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-[#8b5cf6]" />
                    <span className="text-xs text-slate-400">
                      Score: <span className="text-white font-bold">{marketScore}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#38bdf8]" />
                    <span className="text-xs text-slate-400">
                      {new Date(strategy.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {strategy.objective && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500 line-clamp-2">{strategy.objective}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Image Generation Modal */}
      <AnimatePresence>
        {showImageModal && selectedStrategyForImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f0f1a] p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Brand Image Prompts</h2>
                  </div>
                  <p className="text-sm text-slate-400">
                    AI-generated prompts for {selectedStrategyForImages.title}
                  </p>
                </div>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              {/* Loading State */}
              {generatingPrompts ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-[#6366f1] mb-4" />
                  <p className="text-sm text-slate-400">Analyzing your brand and generating prompts...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {imagePrompts.map((imagePrompt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-white">{imagePrompt.type}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-bold">
                              {imagePrompt.platform}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{imagePrompt.style}</p>
                        </div>
                        <button
                          onClick={() => copyPromptToClipboard(imagePrompt.prompt)}
                          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="rounded-lg bg-black/20 p-4 border border-white/5">
                        <p className="text-sm text-slate-300 leading-relaxed font-mono">
                          {imagePrompt.prompt}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => {
                            const searchQuery = encodeURIComponent(imagePrompt.prompt);
                            window.open(`https://www.midjourney.com/app/`, '_blank');
                          }}
                          className="flex items-center gap-1.5 text-xs text-[#8b5cf6] hover:text-white transition-colors"
                        >
                          <Palette className="h-3 w-3" />
                          <span>Open in Midjourney</span>
                        </button>
                        <span className="text-slate-600">•</span>
                        <button
                          onClick={() => {
                            const searchQuery = encodeURIComponent(imagePrompt.prompt);
                            window.open(`https://openai.com/dall-e-3/`, '_blank');
                          }}
                          className="flex items-center gap-1.5 text-xs text-[#8b5cf6] hover:text-white transition-colors"
                        >
                          <ImageIcon className="h-3 w-3" />
                          <span>Open in DALL-E</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-slate-500 text-center">
                  💡 Copy these prompts and use them in your preferred AI image generator (Midjourney, DALL-E, Stable Diffusion, etc.)
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}