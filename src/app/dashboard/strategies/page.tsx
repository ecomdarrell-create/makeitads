"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  MoreVertical,
  Eye,
  Copy,
  Pencil,
  Trash2,
  ArrowRight,
  Loader2,
  FileText,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  Command,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

// ═══════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════

interface Strategy {
  id: string;
  business_name: string;
  industry: string;
  plan_used: string;
  created_at: string;
  data: any;
  status?: "ready" | "draft" | "generating" | "failed";
  name?: string; // Nom personnalisé (après renommage)
}

type ViewMode = "grid" | "list";
type ChannelFilter = "all" | "meta" | "tiktok" | "google";
type PlanFilter = "all" | "free" | "pro" | "business" | "premium" | "enterprise";
type DateSort = "newest" | "oldest";
type NameSort = "az" | "za";

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function getChannels(data: any): string[] {
  if (!data?.canal_recommande) return [];
  const canal = data.canal_recommande.toLowerCase();
  const channels: string[] = [];
  if (canal.includes("meta") || canal.includes("facebook") || canal.includes("instagram")) channels.push("META");
  if (canal.includes("tiktok")) channels.push("TIKTOK");
  if (canal.includes("google")) channels.push("GOOGLE");
  return channels.length > 0 ? channels : ["META"];
}

function getPrimaryChannel(data: any): string {
  const channels = getChannels(data);
  return channels[0] || "META";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Créée il y a quelques minutes";
  if (diffHours < 24) return `Créée il y a ${diffHours}h`;
  if (diffDays === 1) return "Créée hier";
  if (diffDays < 7) return `Créée il y a ${diffDays} jours`;
  return `Créée le ${date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
}

function getStrategyTitle(strategy: Strategy): string {
  if (strategy.name) return strategy.name;
  const canal = getPrimaryChannel(strategy.data);
  return `${canal} — ${strategy.business_name}`;
}

function getStrategyPreview(strategy: Strategy): { label: string; value: string } | null {
  if (!strategy.data) return null;
  if (strategy.data.objectif) return { label: "Objectif", value: strategy.data.objectif };
  if (strategy.data.copies_publicitaires?.[0]?.angle) {
    return { label: "Angle principal", value: strategy.data.copies_publicitaires[0].angle };
  }
  return { label: "Canal recommandé", value: strategy.data.canal_recommande || "Non spécifié" };
}

// ═══════════════════════════════════════════════════════════
// COMPOSANTS INTERNES
// ═══════════════════════════════════════════════════════════

function ChannelBadge({ channel }: { channel: string }) {
  return (
    <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider text-[#6F707A] border border-[#E8E8EC] bg-[#F7F7F8]">
      {channel}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    enterprise: "bg-amber-50 text-amber-700 border-amber-200",
    business: "bg-[#6366F1]/5 text-[#6366F1] border-[#6366F1]/20",
    premium: "bg-purple-50 text-purple-700 border-purple-200",
    pro: "bg-[#6366F1]/5 text-[#6366F1] border-[#6366F1]/20",
    free: "bg-[#F7F7F8] text-[#6F707A] border-[#E8E8EC]",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${styles[plan] || styles.free}`}>
      {plan}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ready: "bg-emerald-500",
    draft: "bg-[#6F707A]",
    generating: "bg-[#6366F1] animate-pulse",
    failed: "bg-red-500",
  };
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status] || colors.draft}`} />;
}

// Skeleton Card
function SkeletonCard() {
  return (
    <div className="rounded-[14px] bg-white border border-[#E8E8EC] p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-12 bg-[#F7F7F8] rounded" />
        <div className="h-4 w-4 bg-[#F7F7F8] rounded" />
      </div>
      <div className="h-5 w-3/4 bg-[#F7F7F8] rounded mb-2" />
      <div className="h-3 w-1/2 bg-[#F7F7F8] rounded mb-1" />
      <div className="h-3 w-2/3 bg-[#F7F7F8] rounded mb-4" />
      <div className="h-3 w-1/3 bg-[#F7F7F8] rounded" />
    </div>
  );
}

// Empty State avec flux visuel
function EmptyStateFlow() {
  const steps = [
    { label: "OBJECTIF", icon: "O" },
    { label: "AUDIENCE", icon: "A" },
    { label: "CANAL", icon: "C" },
    { label: "MESSAGE", icon: "M" },
    { label: "STRATÉGIE", icon: "S" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 py-8 flex-wrap">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-12 h-12 rounded-lg border flex items-center justify-center ${
                i === steps.length - 1
                  ? "border-[#6366F1]/30 bg-[#6366F1]/5"
                  : "border-[#E8E8EC] bg-[#F7F7F8]"
              }`}
            >
              <span className={`text-sm font-bold ${i === steps.length - 1 ? "text-[#6366F1]" : "text-[#6F707A]"}`}>
                {step.icon}
              </span>
            </div>
            <span className={`text-[9px] font-semibold tracking-wider ${i === steps.length - 1 ? "text-[#6366F1]" : "text-[#6F707A]"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-[#E8E8EC] flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
}

// Generating Card
function GeneratingCard() {
  const steps = [
    { label: "Analyse de l'activité", done: true },
    { label: "Analyse de l'audience", done: true },
    { label: "Sélection des canaux", current: true },
    { label: "Construction des angles", done: false },
  ];

  return (
    <div className="rounded-[14px] bg-white border border-[#6366F1]/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Loader2 className="h-4 w-4 text-[#6366F1] animate-spin" />
        <span className="text-xs font-semibold text-[#6366F1] uppercase tracking-wider">Analyse en cours</span>
      </div>
      <p className="text-sm text-[#17171C] font-medium mb-4">MakeItAds construit votre stratégie...</p>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5 text-xs">
            {step.done ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : step.current ? (
              <Loader2 className="h-3.5 w-3.5 text-[#6366F1] animate-spin" />
            ) : (
              <div className="h-3.5 w-3.5 rounded-full border border-[#E8E8EC]" />
            )}
            <span className={step.current ? "text-[#6366F1] font-medium" : step.done ? "text-[#17171C]" : "text-[#6F707A]"}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Failed Card
function FailedCard({ strategy, onRetry }: { strategy: Strategy; onRetry: (id: string) => void }) {
  return (
    <div className="rounded-[14px] bg-white border border-red-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Échec</span>
      </div>
      <h3 className="text-sm font-semibold text-[#17171C] mb-1">{getStrategyTitle(strategy)}</h3>
      <p className="text-xs text-[#6F707A] mb-4">La stratégie n'a pas pu être générée. Une erreur est survenue pendant la génération.</p>
      <button
        onClick={() => onRetry(strategy.id)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [dateSort, setDateSort] = useState<DateSort>("newest");
  const [nameSort, setNameSort] = useState<NameSort>("az");
  const [visibleCount, setVisibleCount] = useState(12);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState<Strategy | null>(null);
  const [renameTarget, setRenameTarget] = useState<Strategy | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Fetch
  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("strategies")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setStrategies(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const supabase = createClient();
      await supabase.from("strategies").delete().eq("id", deleteTarget.id);
      setStrategies((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
      setMenuOpenId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async () => {
    if (!renameTarget || !renameValue.trim()) return;
    try {
      const supabase = createClient();
      await supabase
        .from("strategies")
        .update({ name: renameValue.trim() })
        .eq("id", renameTarget.id);
      setStrategies((prev) =>
        prev.map((s) => (s.id === renameTarget.id ? { ...s, name: renameValue.trim() } : s))
      );
      setRenameTarget(null);
      setRenameValue("");
      setMenuOpenId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (strategy: Strategy) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("strategies")
        .insert({
          user_id: user.id,
          business_name: strategy.business_name,
          industry: strategy.industry,
          plan_used: strategy.plan_used,
          data: strategy.data,
          name: `Copie de — ${strategy.name || strategy.business_name}`,
          status: "draft",
        })
        .select()
        .single();

      if (data) {
        setStrategies((prev) => [data, ...prev]);
        setMenuOpenId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetry = async (id: string) => {
    // Pour l'instant, on supprime la stratégie échouée et on redirige vers le wizard
    try {
      const supabase = createClient();
      await supabase.from("strategies").delete().eq("id", id);
      setStrategies((prev) => prev.filter((s) => s.id !== id));
      window.location.href = "/dashboard/strategies/new";
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering & Sorting
  const filteredStrategies = useMemo(() => {
    let result = [...strategies];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => {
        const channels = getChannels(s.data).join(" ").toLowerCase();
        return (
          s.business_name.toLowerCase().includes(q) ||
          s.industry.toLowerCase().includes(q) ||
          (s.name || "").toLowerCase().includes(q) ||
          channels.includes(q)
        );
      });
    }

    // Channel filter
    if (channelFilter !== "all") {
      result = result.filter((s) => {
        const channels = getChannels(s.data).map((c) => c.toLowerCase());
        return channels.includes(channelFilter);
      });
    }

    // Plan filter
    if (planFilter !== "all") {
      result = result.filter((s) => s.plan_used === planFilter);
    }

    // Date sort
    result.sort((a, b) => {
      if (dateSort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    // Name sort (applied after date sort as secondary)
    if (nameSort !== "az") {
      // On garde le tri par date, mais on pourrait ajouter un tri par nom en secondary
    }

    return result;
  }, [strategies, searchQuery, channelFilter, planFilter, dateSort, nameSort]);

  const visibleStrategies = filteredStrategies.slice(0, visibleCount);
  const hasMore = visibleCount < filteredStrategies.length;

  // Stats
  const totalStrategies = strategies.length;
  const availableCredits = 3; // À remplacer par le vrai quota du hook usePlan

  return (
    <div className="max-w-[1280px] mx-auto">
      {/* ══════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#17171C] tracking-tight leading-tight">
            Mes stratégies
          </h1>
          <p className="text-sm text-[#6F707A] mt-1.5">
            Retrouvez et gérez toutes vos stratégies publicitaires au même endroit.
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#6F707A]">
            <span className="font-medium text-[#17171C]">{totalStrategies} stratégies</span>
            <span className="text-[#E8E8EC]">·</span>
            <span>{availableCredits} disponibles avec votre plan actuel</span>
          </div>
        </div>
        <Link
          href="/dashboard/strategies/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] px-4 h-[42px] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors duration-200 flex-shrink-0 shadow-sm shadow-[#6366F1]/20"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Nouvelle stratégie
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SEARCH + FILTERS + VIEW TOGGLE
      ═══════════════════════════════════════════════════════ */}
      <div className="space-y-3 mb-6">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6F707A]" />
          <input
            type="text"
            placeholder="Rechercher une stratégie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-20 py-3 rounded-lg bg-white border border-[#E8E8EC] text-sm text-[#17171C] placeholder:text-[#6F707A] focus:border-[#6366F1]/30 focus:ring-2 focus:ring-[#6366F1]/10 outline-none transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-[#F7F7F8] border border-[#E8E8EC] text-[10px] text-[#6F707A] font-mono">
            <Command className="h-3 w-3" />K
          </div>
        </div>

        {/* Filters row (desktop) */}
        <div className="hidden md:flex items-center gap-2 flex-wrap">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value as ChannelFilter)}
            className="px-3 py-2 rounded-lg bg-white border border-[#E8E8EC] text-xs font-medium text-[#17171C] focus:border-[#6366F1]/30 outline-none cursor-pointer"
          >
            <option value="all">Tous les canaux</option>
            <option value="meta">Meta</option>
            <option value="tiktok">TikTok</option>
            <option value="google">Google</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as PlanFilter)}
            className="px-3 py-2 rounded-lg bg-white border border-[#E8E8EC] text-xs font-medium text-[#17171C] focus:border-[#6366F1]/30 outline-none cursor-pointer"
          >
            <option value="all">Tous les plans</option>
            <option value="free">Gratuit</option>
            <option value="pro">Pro</option>
            <option value="business">Business</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Entreprise</option>
          </select>

          <select
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value as DateSort)}
            className="px-3 py-2 rounded-lg bg-white border border-[#E8E8EC] text-xs font-medium text-[#17171C] focus:border-[#6366F1]/30 outline-none cursor-pointer"
          >
            <option value="newest">Plus récentes</option>
            <option value="oldest">Plus anciennes</option>
          </select>

          <div className="flex-1" />

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-[#E8E8EC] bg-white p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-[#6366F1]/5 text-[#6366F1]" : "text-[#6F707A] hover:text-[#17171C]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list" ? "bg-[#6366F1]/5 text-[#6366F1]" : "text-[#6F707A] hover:text-[#17171C]"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters button (mobile) */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#E8E8EC] text-xs font-medium text-[#17171C]"
          >
            <Filter className="h-3.5 w-3.5" />
            Filtres
            {(channelFilter !== "all" || planFilter !== "all") && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
            )}
          </button>
          <div className="flex-1" />
          <div className="flex items-center rounded-lg border border-[#E8E8EC] bg-white p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-[#6366F1]/5 text-[#6366F1]" : "text-[#6F707A]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list" ? "bg-[#6366F1]/5 text-[#6366F1]" : "text-[#6F707A]"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          STRATEGY LIBRARY
      ═══════════════════════════════════════════════════════ */}
      {loading ? (
        <div className={`grid gap-3 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredStrategies.length === 0 ? (
        /* ═══════════════════════════════════════════════════════
            EMPTY STATE
        ═══════════════════════════════════════════════════════ */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[14px] bg-white border border-dashed border-[#E8E8EC] p-8 md:p-12 text-center"
        >
          {searchQuery || channelFilter !== "all" || planFilter !== "all" ? (
            <>
              <div className="w-12 h-12 rounded-full bg-[#F7F7F8] flex items-center justify-center mx-auto mb-4">
                <Search className="h-5 w-5 text-[#6F707A]" />
              </div>
              <h3 className="text-base font-semibold text-[#17171C] mb-1">Aucun résultat</h3>
              <p className="text-sm text-[#6F707A] mb-4 max-w-md mx-auto">
                Aucune stratégie ne correspond à votre recherche.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setChannelFilter("all");
                  setPlanFilter("all");
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7F7F8] border border-[#E8E8EC] px-4 py-2 text-xs font-semibold text-[#17171C] hover:bg-[#E8E8EC] transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </>
          ) : (
            <>
              <EmptyStateFlow />
              <h3 className="text-lg font-semibold text-[#17171C] mt-4 mb-2">
                Votre bibliothèque stratégique est vide.
              </h3>
              <p className="text-sm text-[#6F707A] max-w-md mx-auto leading-relaxed mb-6">
                Décrivez votre activité, votre offre et votre objectif. MakeItAds construira une stratégie publicitaire adaptée à votre entreprise.
              </p>
              <Link
                href="/dashboard/strategies/new"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] px-5 h-[42px] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors duration-200 shadow-sm shadow-[#6366F1]/20"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Créer ma première stratégie
              </Link>
              <p className="text-[11px] text-[#6F707A] mt-3">Une stratégie complète en quelques minutes.</p>
            </>
          )}
        </motion.div>
      ) : viewMode === "grid" ? (
        /* ═══════════════════════════════════════════════════════
            GRID VIEW
        ═══════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleStrategies.map((strategy) => {
            const status = strategy.status || (strategy.data ? "ready" : "failed");
            const channels = getChannels(strategy.data);
            const preview = getStrategyPreview(strategy);

            if (status === "generating") {
              return <GeneratingCard key={strategy.id} />;
            }

            if (status === "failed") {
              return <FailedCard key={strategy.id} strategy={strategy} onRetry={handleRetry} />;
            }

            return (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-[14px] bg-white border border-[#E8E8EC] p-5 hover:border-[#6366F1]/30 hover:-translate-y-[1px] hover:shadow-sm transition-all duration-200"
              >
                {/* Ligne supérieure */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={status} />
                    {channels.slice(0, 2).map((channel) => (
                      <ChannelBadge key={channel} channel={channel} />
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === strategy.id ? null : strategy.id);
                    }}
                    className="p-1 rounded-md text-[#6F707A] hover:text-[#17171C] hover:bg-[#F7F7F8] transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                {/* Nom de la stratégie */}
                <Link href={`/dashboard/strategies/${strategy.id}`} className="block">
                  <h3 className="text-[16px] font-semibold text-[#17171C] mb-1.5 leading-tight group-hover:text-[#6366F1] transition-colors line-clamp-2">
                    {getStrategyTitle(strategy)}
                  </h3>

                  {/* Business */}
                  <p className="text-[13px] text-[#17171C] font-medium mb-0.5">{strategy.business_name}</p>
                  <p className="text-[13px] text-[#6F707A] mb-3">
                    {strategy.industry}
                  </p>

                  {/* Preview stratégique */}
                  {preview && (
                    <div className="mb-3 p-2.5 rounded-lg bg-[#F7F7F8] border border-[#E8E8EC]">
                      <p className="text-[9px] font-semibold text-[#6F707A] uppercase tracking-wider mb-0.5">
                        {preview.label}
                      </p>
                      <p className="text-xs text-[#17171C] font-medium line-clamp-2">{preview.value}</p>
                    </div>
                  )}

                  {/* Date + Plan */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#6F707A]">{formatDate(strategy.created_at)}</span>
                    <PlanBadge plan={strategy.plan_used} />
                  </div>

                  {/* CTA hover */}
                  <div className="mt-3 pt-3 border-t border-[#F7F7F8] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs font-semibold text-[#6366F1]">Voir la stratégie</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#6366F1]" />
                  </div>
                </Link>

                {/* Menu contextuel */}
                <AnimatePresence>
                  {menuOpenId === strategy.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpenId(null)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 4 }}
                        className="absolute right-4 top-12 z-50 w-48 rounded-lg bg-white border border-[#E8E8EC] shadow-lg py-1"
                      >
                        <button
                          onClick={() => {
                            setMenuOpenId(null);
                            window.location.href = `/dashboard/strategies/${strategy.id}`;
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#17171C] hover:bg-[#F7F7F8] transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Voir la stratégie
                        </button>
                        <button
                          onClick={() => {
                            handleDuplicate(strategy);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#17171C] hover:bg-[#F7F7F8] transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Dupliquer
                        </button>
                        <button
                          onClick={() => {
                            setRenameValue(strategy.name || strategy.business_name);
                            setRenameTarget(strategy);
                            setMenuOpenId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#17171C] hover:bg-[#F7F7F8] transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Renommer
                        </button>
                        <div className="my-1 border-t border-[#F7F7F8]" />
                        <button
                          onClick={() => {
                            setDeleteTarget(strategy);
                            setMenuOpenId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Supprimer
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════
            LIST VIEW
        ═══════════════════════════════════════════════════════ */
        <div className="rounded-[14px] bg-white border border-[#E8E8EC] overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#E8E8EC] bg-[#F7F7F8] text-[10px] font-semibold text-[#6F707A] uppercase tracking-wider">
            <div className="col-span-5">Nom</div>
            <div className="col-span-2">Canal</div>
            <div className="col-span-2">Objectif</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Plan</div>
          </div>

          {visibleStrategies.map((strategy) => {
            const status = strategy.status || (strategy.data ? "ready" : "failed");
            const channels = getChannels(strategy.data);
            const preview = getStrategyPreview(strategy);

            if (status === "generating" || status === "failed") return null;

            return (
              <Link
                key={strategy.id}
                href={`/dashboard/strategies/${strategy.id}`}
                className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 border-b border-[#F7F7F8] last:border-0 hover:bg-[#F7F7F8]/50 transition-colors"
              >
                <div className="md:col-span-5 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusDot status={status} />
                    <h3 className="text-sm font-semibold text-[#17171C] truncate group-hover:text-[#6366F1] transition-colors">
                      {getStrategyTitle(strategy)}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6F707A] truncate">
                    {strategy.business_name} · {strategy.industry}
                  </p>
                </div>
                <div className="md:col-span-2 flex items-center gap-1">
                  {channels.slice(0, 2).map((c) => (
                    <ChannelBadge key={c} channel={c} />
                  ))}
                </div>
                <div className="md:col-span-2">
                  {preview && (
                    <p className="text-xs text-[#17171C] font-medium truncate">{preview.value}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-[#6F707A]">{formatDate(strategy.created_at)}</p>
                </div>
                <div className="md:col-span-1 flex items-center justify-between md:justify-start">
                  <PlanBadge plan={strategy.plan_used} />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === strategy.id ? null : strategy.id);
                    }}
                    className="md:hidden p-1 rounded text-[#6F707A] hover:text-[#17171C]"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-4 py-2 rounded-lg bg-white border border-[#E8E8EC] text-xs font-semibold text-[#17171C] hover:bg-[#F7F7F8] transition-colors"
          >
            Charger plus ({filteredStrategies.length - visibleCount} restantes)
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          DELETE MODAL
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTarget(null)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md rounded-[14px] bg-white border border-[#E8E8EC] p-6 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[#17171C] mb-1">
                      Supprimer cette stratégie ?
                    </h3>
                    <p className="text-sm text-[#6F707A] leading-relaxed">
                      Cette action supprimera définitivement <span className="font-medium text-[#17171C]">{deleteTarget.business_name}</span> de votre espace.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 rounded-lg border border-[#E8E8EC] text-sm font-medium text-[#17171C] hover:bg-[#F7F7F8] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          RENAME MODAL
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {renameTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRenameTarget(null)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md rounded-[14px] bg-white border border-[#E8E8EC] p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[#17171C]">Renommer la stratégie</h3>
                  <button
                    onClick={() => setRenameTarget(null)}
                    className="p-1 rounded-md text-[#6F707A] hover:text-[#17171C] hover:bg-[#F7F7F8]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename()}
                  placeholder="Nom de la stratégie"
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E8E8EC] text-sm text-[#17171C] placeholder:text-[#6F707A] focus:border-[#6366F1]/30 focus:ring-2 focus:ring-[#6366F1]/10 outline-none transition-all mb-4"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setRenameTarget(null)}
                    className="px-4 py-2 rounded-lg border border-[#E8E8EC] text-sm font-medium text-[#17171C] hover:bg-[#F7F7F8] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleRename}
                    disabled={!renameValue.trim()}
                    className="px-4 py-2 rounded-lg bg-[#6366F1] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Renommer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          MOBILE FILTERS BOTTOM SHEET
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-[20px] bg-white border-t border-[#E8E8EC] p-5 shadow-2xl"
            >
              <div className="w-10 h-1 bg-[#E8E8EC] rounded-full mx-auto mb-5" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#17171C]">Filtres</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg text-[#6F707A] hover:bg-[#F7F7F8]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-[#6F707A] uppercase tracking-wider mb-1.5 block">
                    Canal
                  </label>
                  <select
                    value={channelFilter}
                    onChange={(e) => setChannelFilter(e.target.value as ChannelFilter)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#F7F7F8] border border-[#E8E8EC] text-sm text-[#17171C] outline-none"
                  >
                    <option value="all">Tous les canaux</option>
                    <option value="meta">Meta</option>
                    <option value="tiktok">TikTok</option>
                    <option value="google">Google</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[#6F707A] uppercase tracking-wider mb-1.5 block">
                    Plan
                  </label>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value as PlanFilter)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#F7F7F8] border border-[#E8E8EC] text-sm text-[#17171C] outline-none"
                  >
                    <option value="all">Tous les plans</option>
                    <option value="free">Gratuit</option>
                    <option value="pro">Pro</option>
                    <option value="business">Business</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Entreprise</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[#6F707A] uppercase tracking-wider mb-1.5 block">
                    Tri par date
                  </label>
                  <select
                    value={dateSort}
                    onChange={(e) => setDateSort(e.target.value as DateSort)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#F7F7F8] border border-[#E8E8EC] text-sm text-[#17171C] outline-none"
                  >
                    <option value="newest">Plus récentes</option>
                    <option value="oldest">Plus anciennes</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#F7F7F8]">
                <button
                  onClick={() => {
                    setChannelFilter("all");
                    setPlanFilter("all");
                    setDateSort("newest");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#E8E8EC] text-sm font-medium text-[#17171C] hover:bg-[#F7F7F8] transition-colors"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#6366F1] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}