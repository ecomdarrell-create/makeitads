"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Plus,
  FileText,
  Calendar,
  ArrowRight,
  Loader2,
  Zap,
  Crown,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { usePlan } from "@/hooks/usePlan";

interface Strategy {
  id: string;
  business_name: string;
  industry: string;
  plan_used: string;
  created_at: string;
  data: any;
}

// ═══════════════════════════════════════════════════════════
// COMPOSANTS INTERNES
// ═══════════════════════════════════════════════════════════

function ChannelBadge({ channel }: { channel: string }) {
  return (
    <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider text-[#64748B] border border-[#E5E7EB] bg-[#F8FAFC]">
      {channel.toUpperCase()}
    </span>
  );
}

function CreditBar({ current, total }: { current: number; total: number }) {
  const percentage = total > 0 && total !== 999 ? (current / total) * 100 : 100;
  return (
    <div className="w-full h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full"
      />
    </div>
  );
}

function EmptyStateFlow() {
  const steps = [
    { label: "OBJECTIF", icon: "O" },
    { label: "AUDIENCE", icon: "A" },
    { label: "CANAL", icon: "C" },
    { label: "MESSAGE", icon: "M" },
    { label: "STRATÉGIE", icon: "S" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 py-6 flex-wrap">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-center">
              <span className="text-xs font-bold text-[#6366F1]">{step.icon}</span>
            </div>
            <span className="text-[8px] font-semibold text-[#64748B] tracking-wider">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="h-3 w-3 text-[#CBD5E1] flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// VARIANTS FRAMER MOTION (typés correctement)
// ══════════════════════════════════════════════════════════

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// ═══════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════

export default function OverviewPage() {
  const { user } = useSession();
  const { quotaRemaining, isFree, isPro, isPremium, isEnterprise } = usePlan();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Utilisateur";

  // Calcul du total selon le plan
  const quotaTotal = isEnterprise ? 999 : isPremium ? 50 : isPro ? 20 : 1;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const getPlanName = () => {
    if (isEnterprise) return "Entreprise";
    if (isPremium) return "Business";
    if (isPro) return "Pro";
    return "Gratuit";
  };

  const getPlanCredits = () => {
    if (isEnterprise) return "Illimité";
    if (isPremium) return "50 crédits";
    if (isPro) return "20 crédits";
    return "1 crédit";
  };

  useEffect(() => {
    fetchRecentStrategies();
  }, []);

  const fetchRecentStrategies = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("strategies")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      setStrategies(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Il y a quelques minutes";
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString("fr-FR");
  };

  const getChannels = (strategy: Strategy) => {
    const canal = strategy.data?.canal_recommande || "";
    const channels: string[] = [];
    if (canal.toLowerCase().includes("meta") || canal.toLowerCase().includes("facebook")) channels.push("META");
    if (canal.toLowerCase().includes("tiktok")) channels.push("TIKTOK");
    if (canal.toLowerCase().includes("google")) channels.push("GOOGLE");
    if (channels.length === 0) channels.push("META");
    return channels;
  };

  const creditPercentage = quotaTotal > 0 && quotaTotal !== 999 ? (quotaRemaining / quotaTotal) * 100 : 100;
  const isLowCredit = creditPercentage <= 20 && creditPercentage > 0 && quotaTotal !== 999;
  const isNoCredit = quotaRemaining === 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1280px] mx-auto space-y-6"
    >
      {/* ══════════════════════════════════════════════════════
          WELCOME HEADER + PRIMARY CTA
      ═══════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-[28px] font-bold text-[#0F172A] tracking-tight leading-tight">
            {getGreeting()}, {firstName}.
          </h1>
          <p className="text-sm text-[#64748B] mt-1.5">
            {strategies.length === 0
              ? "Construisez votre première stratégie publicitaire."
              : "Prêt à construire votre prochaine stratégie ?"}
          </p>
        </div>
        <Link
          href="/dashboard/strategies/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] px-4 h-[42px] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors duration-200 flex-shrink-0 shadow-sm shadow-[#6366F1]/20"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Nouvelle stratégie
        </Link>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          CREDIT STATUS CARD
      ═══════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <div className="rounded-[14px] bg-white border border-[#E5E7EB] p-5 md:p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                Crédits disponibles
              </p>
              <div className="flex items-baseline gap-2">
                <motion.span
                  key={quotaRemaining}
                  initial={{ opacity: 0.5, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight"
                >
                  {quotaRemaining}
                </motion.span>
                <span className="text-sm text-[#64748B]">
                  sur {quotaTotal === 999 ? "illimité" : `${quotaTotal} crédits`}
                </span>
              </div>
            </div>
            <Link
              href="/dashboard/credits"
              className="text-xs font-semibold text-[#6366F1] hover:text-[#8B5CF6] transition-colors flex items-center gap-1 flex-shrink-0"
            >
              Gérer mes crédits
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {quotaTotal !== 999 && <CreditBar current={quotaRemaining} total={quotaTotal} />}

          <p className="text-xs text-[#64748B] mt-3">
            {quotaRemaining === 1
              ? "1 crédit disponible après utilisation."
              : `${quotaRemaining} crédits disponibles après utilisation.`}
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          QUICK STATS (3 cartes max)
      ═══════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Stat 1 : Crédits restants */}
        <div className="rounded-[12px] bg-white border border-[#E5E7EB] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1]/5 flex items-center justify-center">
              <Zap className="h-4 w-4 text-[#6366F1]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tracking-tight">{quotaRemaining}</div>
          <div className="text-xs text-[#64748B] mt-0.5">
            sur {quotaTotal === 999 ? "illimité" : quotaTotal}
          </div>
        </div>

        {/* Stat 2 : Stratégies créées */}
        <div className="rounded-[12px] bg-white border border-[#E5E7EB] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center">
              <FileText className="h-4 w-4 text-[#64748B]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tracking-tight">{strategies.length}</div>
          <div className="text-xs text-[#64748B] mt-0.5">stratégies créées</div>
        </div>

        {/* Stat 3 : Plan actuel */}
        <div className="rounded-[12px] bg-white border border-[#E5E7EB] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center">
              <Crown className="h-4 w-4 text-[#64748B]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tracking-tight">{getPlanName()}</div>
          <div className="text-xs text-[#64748B] mt-0.5">{getPlanCredits()}</div>
          <Link
            href="/dashboard/credits"
            className="inline-block mt-2 text-[10px] font-semibold text-[#6366F1] hover:text-[#8B5CF6] transition-colors"
          >
            Voir mon plan →
          </Link>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          LOW CREDIT ALERT (conditionnel)
      ═══════════════════════════════════════════════════════ */}
      {isLowCredit && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[12px] bg-amber-50 border border-amber-200 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] mb-0.5">
                Vous approchez de la limite de votre plan.
              </p>
              <p className="text-xs text-[#64748B] mb-2.5">
                Il vous reste {quotaRemaining} crédit{quotaRemaining > 1 ? "s" : ""}. Rechargez votre compte pour continuer à créer des stratégies.
              </p>
              <Link
                href="/dashboard/credits"
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
              >
                Obtenir des crédits
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {isNoCredit && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[12px] bg-[#6366F1]/5 border border-[#6366F1]/20 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CreditCard className="h-4 w-4 text-[#6366F1]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] mb-0.5">
                Vos crédits sont épuisés.
              </p>
              <p className="text-xs text-[#64748B] mb-2.5">
                Vous ne pouvez plus générer de nouvelles stratégies pour le moment.
              </p>
              <Link
                href="/dashboard/credits"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#6366F1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#5558e6] transition-colors"
              >
                Obtenir des crédits
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════
          DERNIÈRES STRATÉGIES
      ═══════════════════════════════════════════════════════ */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">Vos dernières stratégies</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Retrouvez rapidement vos dernières recommandations.
            </p>
          </div>
          <Link
            href="/dashboard/strategies"
            className="text-xs font-semibold text-[#6366F1] hover:text-[#8B5CF6] transition-colors flex items-center gap-1 flex-shrink-0"
          >
            Voir toutes les stratégies
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[12px] bg-white border border-[#E5E7EB] p-12 flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-[#6366F1] animate-spin" />
          </div>
        ) : strategies.length === 0 ? (
          /* ═══════════════════════════════════════════════════════
              EMPTY STATE
          ═══════════════════════════════════════════════════════ */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[14px] bg-white border border-dashed border-[#E5E7EB] p-6 md:p-10 text-center"
          >
            <EmptyStateFlow />

            <h3 className="text-lg font-semibold text-[#0F172A] mt-4 mb-2">
              Votre première stratégie commence ici.
            </h3>
            <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed mb-6">
              Décrivez votre activité, votre offre et votre objectif.
              MakeItAds construira une stratégie publicitaire adaptée à votre situation.
            </p>
            <Link
              href="/dashboard/strategies/new"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] px-5 h-[42px] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors duration-200 shadow-sm shadow-[#6366F1]/20"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Créer ma première stratégie
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {strategies.map((strategy, index) => {
              const channels = getChannels(strategy);
              return (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={`/dashboard/strategies/${strategy.id}`}
                    className="group block rounded-[12px] bg-white border border-[#E5E7EB] p-4 md:p-5 hover:border-[#6366F1]/30 hover:-translate-y-[1px] hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Canaux */}
                      <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                        {channels.map((channel) => (
                          <ChannelBadge key={channel} channel={channel} />
                        ))}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#0F172A] truncate group-hover:text-[#6366F1] transition-colors duration-200">
                          {strategy.business_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#64748B]">
                          <span className="truncate">{strategy.industry}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#64748B]">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span>{getTimeAgo(strategy.created_at)}</span>
                        </div>
                      </div>

                      {/* Plan + Arrow */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          strategy.plan_used === "enterprise"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : strategy.plan_used === "business" || strategy.plan_used === "premium"
                            ? "bg-[#6366F1]/5 text-[#6366F1] border border-[#6366F1]/20"
                            : "bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]"
                        }`}>
                          {strategy.plan_used}
                        </span>
                        <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#6366F1] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          NEXT ACTION (contextuel)
      ═══════════════════════════════════════════════════════ */}
      {strategies.length > 0 && !isNoCredit && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-[12px] bg-white border border-[#E5E7EB] p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center flex-shrink-0 mt-0.5">
              <TrendingUp className="h-4 w-4 text-[#64748B]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                Votre prochaine étape
              </p>
              <p className="text-sm text-[#0F172A] mb-0.5">
                Vous avez déjà créé {strategies.length} stratégie{strategies.length > 1 ? "s" : ""}.
              </p>
              <p className="text-xs text-[#64748B] mb-3">
                Prêt à travailler sur votre prochaine campagne ?
              </p>
              <Link
                href="/dashboard/strategies/new"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#8B5CF6] transition-colors"
              >
                Créer une stratégie
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}