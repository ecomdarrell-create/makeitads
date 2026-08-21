"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MoreVertical,
  Download,
  Copy,
  Check,
  FileText,
  Target,
  Users,
  Megaphone,
  Palette,
  DollarSign,
  TrendingUp,
  Zap,
  Sparkles,
  Eye,
  AlertCircle,
  Loader2,
  ChevronRight,
  Star,
  Layers,
  Lightbulb,
  Shield,
  Plus,
  Play,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

// ══════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════

interface StrategyData {
  canal_recommande?: string;
  audience_cible?: {
    lieux?: string[];
    age_min?: number;
    age_max?: number;
    sexe?: string;
    interets?: string[];
    comportements?: string[];
    intention?: string;
  };
  copies_publicitaires?: Array<{
    angle?: string;
    texte_principal?: string;
    titre?: string;
    cta?: string;
    primary_text?: string;
    headline?: string;
  }>;
  recommandations_creatives?: {
    format?: string;
    idees?: string[];
    outils?: string;
    concepts?: Array<{
      type?: string;
      placement?: string;
      hook?: string;
      texte_ecran?: string;
    }>;
  };
  analyse_concurrentielle?: {
    concurrent?: string;
    points_faibles?: string[];
    opportunites?: string[];
  };
  objectif?: string;
  budget_recommande?: string;
  structure_campagne?: {
    objectif?: string;
    conversion_event?: string;
    ad_sets?: Array<{ nom: string; description: string }>;
  };
  angles?: Array<{
    nom: string;
    insight: string;
    promesse: string;
    direction: string;
    prioritaire?: boolean;
  }>;
  plan_budget?: {
    initial?: string;
    phases?: Array<{ nom: string; duree: string; description: string }>;
  };
  test_matrix?: Array<{
    test: string;
    audience: string;
    angle: string;
    creatif: string;
  }>;
}

interface Strategy {
  id: string;
  business_name: string;
  industry: string;
  plan_used: string;
  created_at: string;
  data: StrategyData;
  name?: string;
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function getChannelName(canal: string): string {
  const lower = canal.toLowerCase();
  if (lower.includes("meta") || lower.includes("facebook")) return "META ADS";
  if (lower.includes("tiktok")) return "TIKTOK ADS";
  if (lower.includes("google")) return "GOOGLE ADS";
  return canal.toUpperCase();
}

function getChannelIcon(canal: string) {
  const lower = canal.toLowerCase();
  if (lower.includes("meta") || lower.includes("facebook")) return "M";
  if (lower.includes("tiktok")) return "T";
  if (lower.includes("google")) return "G";
  return "★";
}

// ═══════════════════════════════════════════════════════════
// COMPOSANTS UI
// ══════════════════════════════════════════════════════════

function Section({ id, title, subtitle, icon: Icon, children }: {
  id: string;
  title: string;
  subtitle?: string;
  icon?: any;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 mb-10">
      <div className="flex items-start gap-3 mb-5">
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-[#6366F1]/5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon className="h-4.5 w-4.5 text-[#6366F1]" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-[20px] md:text-[22px] font-bold text-[#18181B] tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-[#71717A] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        copied
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-[#F7F7F8] text-[#18181B] border border-[#E7E7EB] hover:border-[#6366F1]/30 hover:bg-white"
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copié" : label}
    </button>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-[#F7F7F8] last:border-0 gap-1">
      <span className="text-xs font-medium text-[#71717A] uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-[#6366F1]" : "text-[#18181B]"}`}>{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ══════════════════════════════════════════════════════════

export default function StrategyViewPage() {
  const params = useParams();
  const router = useRouter();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("verdict");
  const [showStickyBar, setShowStickyBar] = useState(false);

  const sections = [
    { id: "verdict", label: "Verdict" },
    { id: "canal", label: "Canal" },
    { id: "audience", label: "Audience" },
    { id: "campagne", label: "Campagne" },
    { id: "angles", label: "Angles" },
    { id: "copies", label: "Copies" },
    { id: "creatifs", label: "Créatifs" },
    { id: "budget", label: "Budget" },
    { id: "concurrents", label: "Concurrents" },
    { id: "action", label: "Plan d'action" },
  ];

  useEffect(() => {
    fetchStrategy();
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);

      // Update active section based on scroll
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchStrategy = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("strategies")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single();

      if (error) throw new Error("Stratégie introuvable");
      setStrategy(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!strategy) return;
    if (!confirm("Supprimer définitivement cette stratégie ?")) return;

    try {
      const supabase = createClient();
      await supabase.from("strategies").delete().eq("id", strategy.id);
      router.push("/dashboard/strategies");
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleDuplicate = async () => {
    if (!strategy) return;
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
        alert("Stratégie dupliquée avec succès");
        router.push(`/dashboard/strategies/${data.id}`);
      }
    } catch (err) {
      alert("Erreur lors de la duplication");
    }
  };

  const exportTXT = () => {
    if (!strategy) return;
    const d = strategy.data;
    const content = `
STRATÉGIE PUBLICITAIRE — ${strategy.business_name}
Générée le ${formatDate(strategy.created_at)}
Plan: ${strategy.plan_used}

═══════════════════════════════════════════

VERDICT STRATÉGIQUE
Canal recommandé: ${d.canal_recommande || "Non spécifié"}
Objectif: ${d.objectif || strategy.industry}

═══════════════════════════════════════════

AUDIENCE CIBLE
${d.audience_cible?.sexe || "Tous"} · ${d.audience_cible?.age_min || "?"}-${d.audience_cible?.age_max || "?"} ans
Lieux: ${(d.audience_cible?.lieux || []).join(", ")}
Intérêts: ${(d.audience_cible?.interets || []).join(", ")}

═══════════════════════════════════════════

COPIES PUBLICITAIRES

${(d.copies_publicitaires || []).map((c, i) => `
--- ANGLE ${i + 1}: ${c.angle || "Générique"} ---
Titre: ${c.titre || c.headline || ""}

${c.texte_principal || c.primary_text || ""}

CTA: ${c.cta || ""}
`).join("\n")}

═══════════════════════════════════════════

RECOMMANDATIONS CRÉATIVES
Format: ${d.recommandations_creatives?.format || "Non spécifié"}
Outil: ${d.recommandations_creatives?.outils || "Non spécifié"}

Idées:
${(d.recommandations_creatives?.idees || []).map((i) => `  • ${i}`).join("\n")}

═══════════════════════════════════════════

ANALYSE CONCURRENTIELLE
Concurrent: ${d.analyse_concurrentielle?.concurrent || "Non spécifié"}

Points faibles:
${(d.analyse_concurrentielle?.points_faibles || []).map((p) => `  • ${p}`).join("\n")}

Opportunités:
${(d.analyse_concurrentielle?.opportunites || []).map((o) => `  • ${o}`).join("\n")}
`.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `strategie-${strategy.business_name.replace(/\s+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copySummary = () => {
    if (!strategy) return;
    const d = strategy.data;
    const summary = `Stratégie ${strategy.business_name} — Canal: ${d.canal_recommande} — Audience: ${d.audience_cible?.sexe} ${d.audience_cible?.age_min}-${d.audience_cible?.age_max} ans — ${(d.audience_cible?.lieux || []).join(", ")}`;
    navigator.clipboard.writeText(summary);
    alert("Résumé copié dans le presse-papiers");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-[#6366F1] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#71717A]">Chargement de votre stratégie...</p>
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-6">
        <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-8 text-center max-w-md shadow-sm">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#18181B] mb-2">Stratégie introuvable</h2>
          <p className="text-sm text-[#71717A] mb-6">{error || "Cette stratégie n'existe pas ou ne vous appartient pas."}</p>
          <Link
            href="/dashboard/strategies"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#6366F1] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux stratégies
          </Link>
        </div>
      </div>
    );
  }

  const d = strategy.data;
  const channelName = getChannelName(d.canal_recommande || "Meta Ads");
  const channelIcon = getChannelIcon(d.canal_recommande || "Meta Ads");
  const copies = d.copies_publicitaires || [];
  const angles = d.angles || copies.map((c, i) => ({
    nom: c.angle || `Angle ${i + 1}`,
    insight: "",
    promesse: c.titre || c.headline || "",
    direction: c.texte_principal || c.primary_text || "",
    prioritaire: i === 0,
  }));
  const primaryAngle = angles.find((a) => a.prioritaire) || angles[0];

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* ══════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════ */}
      <header className="bg-white border-b border-[#E7E7EB] sticky top-0 z-30">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <Link
                href="/dashboard/strategies"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71717A] hover:text-[#6366F1] transition-colors mb-3"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Mes stratégies
              </Link>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex px-2.5 py-1 rounded-full bg-[#6366F1]/5 border border-[#6366F1]/20 text-[10px] font-bold text-[#6366F1] uppercase tracking-wider">
                  Stratégie publicitaire
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  strategy.plan_used === "enterprise" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  strategy.plan_used === "business" || strategy.plan_used === "premium" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                  "bg-[#F7F7F8] text-[#71717A] border border-[#E7E7EB]"
                }`}>
                  {strategy.plan_used}
                </span>
              </div>
              <h1 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight leading-tight">
                {strategy.name || `${channelName} — ${strategy.business_name}`}
              </h1>
              <p className="text-sm text-[#71717A] mt-1.5">
                {strategy.industry} · Créée le {formatDate(strategy.created_at)}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Menu ••• */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg border border-[#E7E7EB] text-[#71717A] hover:text-[#18181B] hover:bg-[#F7F7F8] transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 w-48 rounded-lg bg-white border border-[#E7E7EB] shadow-lg py-1 z-50"
                      >
                        <button
                          onClick={() => { setMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#18181B] hover:bg-[#F7F7F8]"
                        >
                          <FileText className="h-3.5 w-3.5" /> Renommer
                        </button>
                        <button
                          onClick={() => { handleDuplicate(); setMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#18181B] hover:bg-[#F7F7F8]"
                        >
                          <Copy className="h-3.5 w-3.5" /> Dupliquer
                        </button>
                        <div className="my-1 border-t border-[#F7F7F8]" />
                        <button
                          onClick={() => { handleDelete(); setMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                        >
                          <AlertCircle className="h-3.5 w-3.5" /> Supprimer
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Export */}
              <div className="relative">
                <button
                  onClick={() => setExportOpen(!exportOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E7E7EB] text-xs font-medium text-[#18181B] hover:bg-[#F7F7F8] transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Exporter
                </button>
                <AnimatePresence>
                  {exportOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 w-56 rounded-lg bg-white border border-[#E7E7EB] shadow-lg py-1 z-50"
                      >
                        <button
                          onClick={() => { exportTXT(); setExportOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#18181B] hover:bg-[#F7F7F8]"
                        >
                          <FileText className="h-3.5 w-3.5" /> Exporter en TXT
                        </button>
                        <button
                          onClick={() => { copySummary(); setExportOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#18181B] hover:bg-[#F7F7F8]"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copier le résumé
                        </button>
                        <div className="my-1 border-t border-[#F7F7F8]" />
                        <div className="px-3 py-2 text-[10px] text-[#71717A]">
                          PDF disponible prochainement
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Navigation interne sticky */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1 -mb-1" style={{ scrollbarWidth: "none" }}>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSection === section.id
                    ? "bg-[#6366F1]/5 text-[#6366F1]"
                    : "text-[#71717A] hover:text-[#18181B] hover:bg-[#F7F7F8]"
                }`}
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          CONTENU PRINCIPAL
      ═══════════════════════════════════════════════════════ */}
      <main className="max-w-[1240px] mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* ══════════════════════════════════════════════════════
            STRATEGY SNAPSHOT
        ═══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 md:p-6 mb-8 shadow-sm"
        >
          <h2 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-4">
            Votre stratégie en un coup d'œil
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6">
            <InfoRow label="Objectif" value={d.objectif || strategy.industry} />
            <InfoRow label="Canal recommandé" value={channelName} highlight />
            <InfoRow label="Marché" value={(d.audience_cible?.lieux || []).join(", ") || strategy.industry} />
            <InfoRow
              label="Audience"
              value={`${d.audience_cible?.sexe || "Tous"} ${d.audience_cible?.age_min || "?"}–${d.audience_cible?.age_max || "?"} ans`}
            />
            <InfoRow label="Budget recommandé" value={d.budget_recommande || "À définir"} />
            <InfoRow label="Plan utilisé" value={strategy.plan_used} />
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            MAKEITADS VERDICT (Section la plus importante)
        ══════════════════════════════════════════════════════ */}
        <Section id="verdict" title="Notre recommandation" icon={Sparkles}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#6366F1]/[0.04] to-[#8B5CF6]/[0.02] border border-[#6366F1]/15 rounded-[14px] p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#6366F1] flex items-center justify-center">
                <span className="text-lg font-bold text-white">{channelIcon}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider">MakeItAds Verdict</p>
                <h3 className="text-xl md:text-2xl font-bold text-[#18181B] tracking-tight">
                  Commencez par {channelName}.
                </h3>
              </div>
            </div>

            <p className="text-[15px] text-[#18181B] leading-relaxed mb-6">
              {d.canal_recommande || `Votre offre bénéficie d'un fort potentiel visuel et votre audience est facilement identifiable sur ${channelName}. Le premier objectif doit être de tester plusieurs angles créatifs avant d'augmenter progressivement le budget.`}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-[#E7E7EB] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="h-4 w-4 text-emerald-600" />
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Votre première action</p>
                </div>
                <p className="text-sm text-[#18181B] font-medium">
                  Lancez 3 créatifs sur le même objectif avec l'angle « {primaryAngle?.nom || "Transformation"} ».
                </p>
              </div>
              <div className="bg-white rounded-lg border border-[#E7E7EB] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Ne faites pas ceci</p>
                </div>
                <p className="text-sm text-[#18181B] font-medium">
                  Ne répartissez pas immédiatement votre budget sur plusieurs plateformes.
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-3">Pourquoi ce canal ?</p>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { num: "01", label: "Audience compatible", desc: "Votre cible est active sur cette plateforme" },
                  { num: "02", label: "Format créatif adapté", desc: "Votre offre se prête aux formats visuels" },
                  { num: "03", label: "Coût de test maîtrisable", desc: "Budget initial suffisant pour valider" },
                ].map((item) => (
                  <div key={item.num} className="bg-white rounded-lg border border-[#E7E7EB] p-3">
                    <div className="text-[10px] font-bold text-[#6366F1] mb-1">{item.num}</div>
                    <div className="text-sm font-semibold text-[#18181B] mb-0.5">{item.label}</div>
                    <div className="text-xs text-[#71717A]">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            CANAL RECOMMANDÉ
        ═══════════════════════════════════════════════════════ */}
        <Section id="canal" title="Canal recommandé" subtitle="La plateforme prioritaire pour votre campagne" icon={Target}>
          <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#6366F1]/5 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#6366F1]">{channelIcon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#18181B]">{channelName}</h3>
                  <p className="text-xs text-[#71717A]">Priorité maximale</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#F7F7F8]">
              <div>
                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-1">Objectif de campagne</p>
                <p className="text-sm font-semibold text-[#18181B]">{d.structure_campagne?.objectif || d.objectif || "Conversions"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-1">Événement de conversion</p>
                <p className="text-sm font-semibold text-[#18181B]">{d.structure_campagne?.conversion_event || "Achat"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-1">Pourquoi ce canal ?</p>
                <p className="text-sm text-[#18181B] leading-relaxed">
                  {d.canal_recommande || `${channelName} permet ici de combiner ciblage par centres d'intérêt, retargeting et formats visuels adaptés à votre offre dans le marché ${strategy.industry}.`}
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            AUDIENCE
        ═══════════════════════════════════════════════════════ */}
        <Section id="audience" title="Votre audience cible" subtitle="Qui cibler et comment les atteindre" icon={Users}>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Profil principal */}
            <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5">
              <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-3">Profil principal</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#6366F1]" />
                  <span className="text-base font-bold text-[#18181B]">{d.audience_cible?.sexe || "Tous"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#6366F1]" />
                  <span className="text-sm font-medium text-[#18181B]">
                    {d.audience_cible?.age_min || "?"}–{d.audience_cible?.age_max || "?"} ans
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#6366F1]" />
                  <span className="text-sm font-medium text-[#18181B]">
                    {(d.audience_cible?.lieux || []).join(", ") || "Non spécifié"}
                  </span>
                </div>
              </div>

              {d.audience_cible?.intention && (
                <div className="pt-3 border-t border-[#F7F7F8]">
                  <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-1">Situation / intention</p>
                  <p className="text-sm text-[#18181B] leading-relaxed">{d.audience_cible.intention}</p>
                </div>
              )}
            </div>

            {/* Intérêts & Comportements */}
            <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5">
              <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-3">Centres d'intérêt</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(d.audience_cible?.interets || []).slice(0, 8).map((interet, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F7F7F8] border border-[#E7E7EB] text-xs font-medium text-[#18181B]">
                    {interet}
                  </span>
                ))}
                {(d.audience_cible?.interets || []).length === 0 && (
                  <span className="text-xs text-[#71717A] italic">Non spécifié</span>
                )}
              </div>

              <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-3">Comportements</p>
              <div className="flex flex-wrap gap-1.5">
                {(d.audience_cible?.comportements || []).slice(0, 8).map((comp, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#6366F1]/5 border border-[#6366F1]/15 text-xs font-medium text-[#6366F1]">
                    {comp}
                  </span>
                ))}
                {(d.audience_cible?.comportements || []).length === 0 && (
                  <span className="text-xs text-[#71717A] italic">Non spécifié</span>
                )}
              </div>
            </div>
          </div>

          {/* Segments d'audience */}
          <div className="grid md:grid-cols-3 gap-3 mt-4">
            {[
              { num: "01", nom: "Audience froide", desc: "Nouveaux prospects correspondant à votre profil cible" },
              { num: "02", nom: "Retargeting", desc: "Visiteurs et interactions précédentes avec votre marque" },
              { num: "03", nom: "Audience similaire", desc: "Lookalike basée sur vos meilleurs clients" },
            ].map((seg) => (
              <div key={seg.num} className="bg-white rounded-[12px] border border-[#E7E7EB] p-4">
                <div className="text-[10px] font-bold text-[#6366F1] mb-1">SEGMENT {seg.num}</div>
                <h4 className="text-sm font-bold text-[#18181B] mb-1">{seg.nom}</h4>
                <p className="text-xs text-[#71717A] leading-relaxed">{seg.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            STRUCTURE DE CAMPAGNE
        ═══════════════════════════════════════════════════════ */}
        <Section id="campagne" title="Structure de campagne recommandée" subtitle="Comment organiser vos ensembles de publicités" icon={Layers}>
          <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#F7F7F8]">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
                <Megaphone className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">Campaign</p>
                <p className="text-sm font-bold text-[#18181B]">Acquisition — {strategy.business_name}</p>
              </div>
            </div>

            <div className="space-y-2">
              {(d.structure_campagne?.ad_sets || [
                { nom: "Ad Set 01 — Audience cible", description: `${d.audience_cible?.sexe || "Tous"} ${d.audience_cible?.age_min || "?"}-${d.audience_cible?.age_max || "?"} · ${(d.audience_cible?.lieux || []).join(", ")}` },
                { nom: "Ad Set 02 — Broad", description: "Ciblage large pour laisser l'algorithme optimiser" },
                { nom: "Ad Set 03 — Retargeting", description: "Visiteurs et interactions précédentes" },
              ]).map((adset, i) => (
                <div key={i} className="flex items-start gap-3 pl-4 border-l-2 border-[#6366F1]/20">
                  <div className="w-6 h-6 rounded-md bg-[#F7F7F8] flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[#6366F1]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-sm font-semibold text-[#18181B]">{adset.nom}</p>
                    <p className="text-xs text-[#71717A] mt-0.5">{adset.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            ANGLES PUBLICITAIRES
        ═══════════════════════════════════════════════════════ */}
        <Section id="angles" title="Les angles à tester" subtitle="Chaque angle est une approche psychologique différente" icon={Lightbulb}>
          {primaryAngle && (
            <div className="bg-gradient-to-br from-[#6366F1]/[0.04] to-transparent border border-[#6366F1]/15 rounded-[14px] p-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider">Angle recommandé pour commencer</p>
              </div>
              <h3 className="text-lg font-bold text-[#18181B] mb-2">{primaryAngle.nom}</h3>
              <p className="text-sm text-[#18181B] leading-relaxed">
                Commencez par cet angle avant de tester les alternatives. {primaryAngle.promesse}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {angles.map((angle, i) => (
              <div
                key={i}
                className={`bg-white rounded-[12px] border p-5 ${
                  angle.prioritaire ? "border-[#6366F1]/30 ring-1 ring-[#6366F1]/10" : "border-[#E7E7EB]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider">
                    ANGLE {String(i + 1).padStart(2, "0")}
                  </span>
                  {angle.prioritaire && (
                    <span className="px-2 py-0.5 rounded-full bg-[#6366F1]/10 text-[9px] font-bold text-[#6366F1] uppercase">
                      Prioritaire
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-[#18181B] mb-3">{angle.nom}</h4>

                <div className="space-y-2.5">
                  {angle.insight && (
                    <div>
                      <p className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider mb-0.5">Insight</p>
                      <p className="text-xs text-[#18181B] leading-relaxed">{angle.insight}</p>
                    </div>
                  )}
                  {angle.promesse && (
                    <div>
                      <p className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider mb-0.5">Promesse</p>
                      <p className="text-xs text-[#18181B] leading-relaxed">{angle.promesse}</p>
                    </div>
                  )}
                  {angle.direction && (
                    <div>
                      <p className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider mb-0.5">Direction</p>
                      <p className="text-xs text-[#18181B] leading-relaxed line-clamp-3">{angle.direction}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            COPIES PUBLICITAIRES
        ═══════════════════════════════════════════════════════ */}
        <Section id="copies" title="Vos publicités" subtitle="Textes prêts à copier-coller dans votre gestionnaire de publicité" icon={FileText}>
          <div className="space-y-4">
            {copies.length > 0 ? copies.map((copy, i) => (
              <div key={i} className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 md:p-6">
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider">
                      ANGLE {String(i + 1).padStart(2, "0")} — {copy.angle || "Générique"}
                    </span>
                    <h3 className="text-base font-bold text-[#18181B] mt-1">{copy.titre || copy.headline || `Variante ${i + 1}`}</h3>
                  </div>
                  <CopyButton text={`${copy.titre || copy.headline || ""}\n\n${copy.texte_principal || copy.primary_text || ""}\n\n${copy.cta || ""}`} label="Copier tout" />
                </div>

                <div className="space-y-3">
                  {(copy.texte_principal || copy.primary_text) && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">Primary text</p>
                        <CopyButton text={copy.texte_principal || copy.primary_text || ""} />
                      </div>
                      <p className="text-sm text-[#18181B] leading-relaxed bg-[#F7F7F8] rounded-lg p-3 border border-[#E7E7EB] whitespace-pre-wrap">
                        {copy.texte_principal || copy.primary_text}
                      </p>
                    </div>
                  )}

                  {(copy.titre || copy.headline) && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">Headline</p>
                        <CopyButton text={copy.titre || copy.headline || ""} />
                      </div>
                      <p className="text-sm font-semibold text-[#18181B] bg-[#F7F7F8] rounded-lg px-3 py-2 border border-[#E7E7EB]">
                        {copy.titre || copy.headline}
                      </p>
                    </div>
                  )}

                  {copy.cta && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">Call-to-action</p>
                        <CopyButton text={copy.cta} />
                      </div>
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-[#6366F1]/5 border border-[#6366F1]/15 text-xs font-semibold text-[#6366F1]">
                        {copy.cta}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-[14px] border border-dashed border-[#E7E7EB] p-8 text-center">
                <p className="text-sm text-[#71717A]">Aucune copie générée pour cette stratégie.</p>
              </div>
            )}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            DIRECTION CRÉATIVE
        ═══════════════════════════════════════════════════════ */}
        <Section id="creatifs" title="Direction créative" subtitle="Qu'est-ce que vous devez réellement produire ?" icon={Palette}>
          <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 md:p-6 mb-4">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-1">Format recommandé</p>
                <p className="text-sm font-semibold text-[#18181B]">{d.recommandations_creatives?.format || "9:16 (Stories/Reels)"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-1">Placement</p>
                <p className="text-sm font-semibold text-[#18181B]">Stories / Reels / Feed</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-1">Outil suggéré</p>
                <p className="text-sm font-semibold text-[#18181B]">{d.recommandations_creatives?.outils || "Canva"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {(d.recommandations_creatives?.concepts || d.recommandations_creatives?.idees || []).map((concept: any, i: number) => {
              const isConcept = typeof concept === "object" && concept.type;
              return (
                <div key={i} className={`bg-white rounded-[12px] border p-5 ${i === 0 ? "border-[#6366F1]/30 ring-1 ring-[#6366F1]/10" : "border-[#E7E7EB]"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider">
                      CRÉATIF #{i + 1} {i === 0 && "— À produire en premier"}
                    </span>
                  </div>
                  {isConcept ? (
                    <>
                      <h4 className="text-base font-bold text-[#18181B] mb-3">{concept.type}</h4>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        {concept.placement && (
                          <div>
                            <p className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider mb-0.5">Placement</p>
                            <p className="text-[#18181B]">{concept.placement}</p>
                          </div>
                        )}
                        {concept.hook && (
                          <div>
                            <p className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider mb-0.5">Hook visuel</p>
                            <p className="text-[#18181B]">{concept.hook}</p>
                          </div>
                        )}
                        {concept.texte_ecran && (
                          <div className="md:col-span-2">
                            <p className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider mb-0.5">Texte à l'écran</p>
                            <p className="text-[#18181B]">{concept.texte_ecran}</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-[#18181B] leading-relaxed">{concept}</p>
                    </div>
                  )}
                </div>
              );
            })}
            {(d.recommandations_creatives?.concepts || d.recommandations_creatives?.idees || []).length === 0 && (
              <div className="bg-white rounded-[14px] border border-dashed border-[#E7E7EB] p-8 text-center">
                <p className="text-sm text-[#71717A]">Aucune recommandation créative générée.</p>
              </div>
            )}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            BUDGET & TESTING PLAN
        ═══════════════════════════════════════════════════════ */}
        <Section id="budget" title="Budget & plan de test" subtitle="Comment investir intelligemment" icon={DollarSign}>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5">
              <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-2">Budget initial recommandé</p>
              <p className="text-2xl font-bold text-[#18181B] tracking-tight">{d.budget_recommande || d.plan_budget?.initial || "5 000 FCFA / jour"}</p>
            </div>
            <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5">
              <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-2">Durée de test minimum</p>
              <p className="text-2xl font-bold text-[#18181B] tracking-tight">3–5 jours</p>
            </div>
          </div>

          {/* Phases */}
          <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 mb-4">
            <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-3">Phases de déploiement</p>
            <div className="space-y-3">
              {(d.plan_budget?.phases || [
                { nom: "Phase 1 — Test", duree: "3–5 jours", description: "Lancez 3 créatifs avec le budget initial. Ne touchez à rien." },
                { nom: "Phase 2 — Optimisation", duree: "5–7 jours", description: "Coupez les variantes sous-performantes. Conservez les meilleures." },
                { nom: "Phase 3 — Scale", duree: "Continue", description: "Augmentez progressivement le budget des campagnes gagnantes (+20% tous les 2-3 jours)." },
              ]).map((phase, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#F7F7F8] last:border-0 last:pb-0">
                  <div className="w-7 h-7 rounded-lg bg-[#6366F1]/5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[#6366F1]">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-bold text-[#18181B]">{phase.nom}</p>
                      <span className="text-xs font-medium text-[#6366F1]">{phase.duree}</span>
                    </div>
                    <p className="text-xs text-[#71717A] leading-relaxed">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Matrix */}
          <div className="bg-white rounded-[14px] border border-[#E7E7EB] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#E7E7EB] bg-[#F7F7F8]">
              <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">Matrice de test</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F7F7F8]">
                    <th className="text-left px-5 py-2.5 text-[10px] font-bold text-[#71717A] uppercase tracking-wider">Test</th>
                    <th className="text-left px-5 py-2.5 text-[10px] font-bold text-[#71717A] uppercase tracking-wider">Audience</th>
                    <th className="text-left px-5 py-2.5 text-[10px] font-bold text-[#71717A] uppercase tracking-wider">Angle</th>
                    <th className="text-left px-5 py-2.5 text-[10px] font-bold text-[#71717A] uppercase tracking-wider">Créatif</th>
                  </tr>
                </thead>
                <tbody>
                  {(d.test_matrix || [
                    { test: "A", audience: "Broad", angle: primaryAngle?.nom || "Transformation", creatif: "UGC vidéo" },
                    { test: "B", audience: "Intérêts", angle: angles[1]?.nom || "Problème", creatif: "Image statique" },
                    { test: "C", audience: "Broad", angle: angles[2]?.nom || "Preuve sociale", creatif: "UGC vidéo" },
                  ]).map((row, i) => (
                    <tr key={i} className="border-b border-[#F7F7F8] last:border-0">
                      <td className="px-5 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded bg-[#6366F1]/5 text-[10px] font-bold text-[#6366F1]">
                          {row.test}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#18181B] font-medium">{row.audience}</td>
                      <td className="px-5 py-3 text-[#18181B]">{row.angle}</td>
                      <td className="px-5 py-3 text-[#18181B]">{row.creatif}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            AVANTAGE CONCURRENTIEL
        ═══════════════════════════════════════════════════════ */}
        <Section id="concurrents" title="Votre avantage concurrentiel" subtitle="Comment vous différencier" icon={Shield}>
          <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 md:p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-2">Concurrent analysé</p>
                <p className="text-base font-bold text-[#18181B] mb-4">{d.analyse_concurrentielle?.concurrent || "Non spécifié"}</p>

                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-2">Ce que font vos concurrents</p>
                <p className="text-sm text-[#18181B] leading-relaxed mb-4">
                  Vos concurrents misent principalement sur la notoriété de marque et des offres promotionnelles récurrentes.
                </p>

                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-2">Leur faiblesse</p>
                <ul className="space-y-1.5 mb-4">
                  {(d.analyse_concurrentielle?.points_faibles || ["Manque de personnalisation", "Service client lent", "Contenu générique"]).map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#18181B]">
                      <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#6366F1]/[0.04] to-transparent rounded-lg border border-[#6366F1]/15 p-4">
                <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider mb-2">Opportunité pour vous</p>
                <ul className="space-y-1.5 mb-4">
                  {(d.analyse_concurrentielle?.opportunites || ["Miser sur l'authenticité", "Service personnalisé", "Contenu éducatif"]).map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#18181B]">
                      <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {o}
                    </li>
                  ))}
                </ul>

                <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider mb-2">Notre recommandation</p>
                <p className="text-sm text-[#18181B] leading-relaxed font-medium">
                  Positionnez-vous sur l'authenticité et la proximité. Votre taille est un avantage : utilisez-la pour créer une relation directe avec votre audience.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            PLAN D'ACTION
        ═══════════════════════════════════════════════════════ */}
        <Section id="action" title="Votre plan de lancement" subtitle="Les étapes concrètes pour exécuter cette stratégie" icon={Zap}>
          <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 md:p-6">
            <div className="space-y-3">
              {[
                "Préparer le créatif #1 selon la direction créative",
                "Créer la campagne sur la plateforme recommandée",
                "Configurer l'audience cible avec les paramètres indiqués",
                "Lancer avec le budget recommandé (phase de test)",
                "Analyser les premiers signaux après 72h",
                "Conserver les variantes prometteuses et couper les autres",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#F7F7F8] last:border-0 last:pb-0">
                  <div className="w-7 h-7 rounded-lg bg-[#6366F1] flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-sm text-[#18181B] font-medium pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#18181B] to-[#27272A] rounded-[14px] p-6 md:p-8 text-center mt-10"
        >
          <Sparkles className="h-8 w-8 text-[#6366F1] mx-auto mb-3" />
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
            Votre stratégie est prête.
          </h2>
          <p className="text-sm text-[#A1A1AA] mb-6 max-w-md mx-auto">
            Il ne vous reste plus qu'à passer à l'exécution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={exportTXT}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-[#18181B] text-sm font-semibold hover:bg-[#F7F7F8] transition-colors"
            >
              <Download className="h-4 w-4" />
              Télécharger la stratégie
            </button>
            <Link
              href="/dashboard/strategies/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#5558e6] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Créer une nouvelle stratégie
            </Link>
          </div>
        </motion.div>
      </main>

      {/* ══════════════════════════════════════════════════════
          STICKY ACTION BAR (apparaît au scroll)
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-40 max-w-[1240px] mx-auto"
          >
            <div className="bg-white rounded-xl border border-[#E7E7EB] shadow-lg px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#6366F1]/5 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#6366F1]">{channelIcon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#18181B] truncate">
                    {strategy.name || strategy.business_name}
                  </p>
                  <p className="text-[10px] text-[#71717A] truncate">{channelName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={copySummary}
                  className="px-3 py-1.5 rounded-lg border border-[#E7E7EB] text-xs font-medium text-[#18181B] hover:bg-[#F7F7F8] transition-colors hidden sm:inline-flex items-center gap-1.5"
                >
                  <Copy className="h-3 w-3" />
                  Copier
                </button>
                <button
                  onClick={exportTXT}
                  className="px-3 py-1.5 rounded-lg bg-[#6366F1] text-xs font-semibold text-white hover:bg-[#5558e6] transition-colors inline-flex items-center gap-1.5"
                >
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline">Exporter</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}