"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Zap,
  Shield,
  ArrowRight,
  ChevronDown,
  Star,
  Crown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePlan } from "@/hooks/usePlan";

// ═══════════════════════════════════════════════════════════
// CONFIGURATION DES PACKS (avec liens Chariow réels)
// ══════════════════════════════════════════════════════════

const PACKS = [
  {
    id: "startup",
    name: "Startup",
    price: 2499,
    oldPrice: 10000,
    credits: 10,
    pricePerStrategy: 250,
    targetPlan: "pro",
    description: "Pour tester MakeItAds et créer vos premières stratégies.",
    cta: "Acheter 10 crédits",
    link: "https://hhowawtq.mychariow.shop/plan-start-up",
    popular: false,
    features: [
      "10 stratégies complètes",
      "Analyse personnalisée",
      "3 variantes de copies publicitaires",
      "Recommandations créatives",
      "Ciblage précis (villes, âges, intérêts)",
      "Guide créatif (formats, dimensions)",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 7499,
    oldPrice: 25000,
    credits: 30,
    pricePerStrategy: 250,
    targetPlan: "business",
    description: "Pour les entreprises qui souhaitent tester plusieurs campagnes et angles publicitaires.",
    cta: "Acheter 30 crédits",
    link: "https://hhowawtq.mychariow.shop/plan-business",
    popular: true,
    features: [
      "30 stratégies complètes",
      "Analyse concurrentielle (1 concurrent)",
      "9 variantes de copies publicitaires",
      "Recommandations créatives avancées",
      "Ciblage multi-audiences",
      "Accès au canal Telegram VIP 'The Boardroom'",
      "Support prioritaire",
      "Crédits valables 90 jours",
    ],
  },
  {
    id: "entreprise",
    name: "Entreprise",
    price: 14990,
    oldPrice: 50000,
    credits: 75,
    pricePerStrategy: 200,
    targetPlan: "enterprise",
    description: "Pour les équipes, agences et entreprises qui génèrent régulièrement plusieurs stratégies.",
    cta: "Acheter 75 crédits",
    link: "https://hhowawtq.mychariow.shop/plan-entreprise",
    popular: false,
    features: [
      "75 stratégies complètes",
      "Analyse concurrentielle avancée (3 concurrents)",
      "30 variantes de copies publicitaires",
      "Recommandations créatives premium",
      "Ciblage multi-audiences avancé",
      "Accès VIP à vie au canal 'The Boardroom'",
      "Support client dédié",
      "Calendrier éditorial inclus",
      "Crédits valables 180 jours",
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// MAPPING PACK → PLAN (Pour ton Backend / Webhook Chariow)
// ══════════════════════════════════════════════════════════

export const PACK_TO_PLAN_MAP: Record<string, string> = {
  startup: "pro",
  business: "business",
  enterprise: "enterprise",
};

// ═══════════════════════════════════════════════════════════
// TABLEAU COMPARATIF
// ══════════════════════════════════════════════════════════

const COMPARISON_TABLE = [
  { feature: "Crédits (stratégies)", startup: 10, business: 30, enterprise: 75 },
  { feature: "Analyse personnalisée", startup: true, business: true, enterprise: true },
  { feature: "Copies publicitaires", startup: "3 variantes", business: "9 variantes", enterprise: "30 variantes" },
  { feature: "Recommandations créatives", startup: true, business: true, enterprise: true },
  { feature: "Analyse concurrentielle", startup: false, business: "1 concurrent", enterprise: "3 concurrents" },
  { feature: "Ciblage multi-audiences", startup: false, business: true, enterprise: true },
  { feature: "Accès Telegram VIP", startup: false, business: true, enterprise: "À vie" },
  { feature: "Support prioritaire", startup: false, business: true, enterprise: true },
  { feature: "Calendrier éditorial", startup: false, business: false, enterprise: true },
  { feature: "Validité des crédits", startup: "30 jours", business: "90 jours", enterprise: "180 jours" },
];

const FAQ_ITEMS = [
  {
    question: "Qu'est-ce qu'un crédit ?",
    answer: "Un crédit permet de générer une stratégie publicitaire complète avec MakeItAds. Chaque stratégie consomme 1 crédit après génération réussie.",
  },
  {
    question: "Combien de crédits consomme une stratégie ?",
    answer: "Une stratégie complète consomme 1 crédit. Le crédit est débité uniquement après une génération réussie.",
  },
  {
    question: "Les crédits sont-ils renouvelés chaque mois ?",
    answer: "Non. Vous achetez uniquement le volume de crédits dont vous avez besoin. Il n'y a aucun abonnement ni prélèvement récurrent.",
  },
  {
    question: "Puis-je acheter plusieurs packs ?",
    answer: "Oui. Les crédits achetés s'ajoutent à votre solde existant. Vous pouvez combiner plusieurs packs selon vos besoins.",
  },
  {
    question: "Que se passe-t-il après mon paiement ?",
    answer: "Une fois votre paiement confirmé, notre système met à jour votre plan et crédite votre compte automatiquement (ou sous 15 min en mode conciergerie).",
  },
];

// ═══════════════════════════════════════════════════════════
// COMPOSANTS UI
// ══════════════════════════════════════════════════════════

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#E7E7EB] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-[#F7F7F8] transition-colors px-1"
      >
        <span className="text-sm font-semibold text-[#18181B] pr-4">{question}</span>
        <ChevronDown className={`h-4 w-4 text-[#71717A] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="text-sm text-[#71717A] leading-relaxed pb-4 px-1">{answer}</p>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═════════════════════════════════════════════════════════

export default function CreditsPage() {
  const { quotaRemaining, isFree, isPro, isPremium, isEnterprise } = usePlan();

  // ✅ CORRECTION : Calcul dynamique de quotaTotal
  const getQuotaTotal = (): number => {
    if (isEnterprise) return 75;
    if (isPremium) return 30;
    if (isPro) return 10;
    return 1;
  };
  
  const quotaTotal = getQuotaTotal();

  const getPlanName = () => {
    if (isEnterprise) return "Entreprise";
    if (isPremium) return "Business";
    if (isPro) return "Pro";
    return "Gratuit";
  };

  const isLowBalance = quotaRemaining <= 3 && quotaRemaining > 0;
  const isZeroBalance = quotaRemaining === 0;
  const recommendedPackId = isEnterprise ? "entreprise" : "business";

  return (
    <div className="max-w-[1180px] mx-auto">
      {/* ══════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
          Vos crédits
        </h1>
        <p className="text-[15px] text-[#71717A] mt-1.5">
          Utilisez vos crédits pour créer des stratégies publicitaires personnalisées avec MakeItAds.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          SOLDE ACTUEL
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={`rounded-[14px] border p-6 md:p-8 mb-8 ${
          isZeroBalance ? "bg-red-50/50 border-red-200" : isLowBalance ? "bg-amber-50/50 border-amber-200" : "bg-white border-[#E7E7EB]"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">
              Crédits disponibles
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <motion.span
                key={quotaRemaining}
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl md:text-5xl font-bold text-[#18181B] tracking-tight"
              >
                {quotaRemaining}
              </motion.span>
              <span className="text-lg text-[#71717A]">crédits</span>
            </div>
            <p className="text-sm text-[#71717A]">
              Votre solde actuel · Plan {getPlanName()}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#6366F1]/5 border border-[#6366F1]/15">
              <Zap className="h-4 w-4 text-[#6366F1]" />
              <span className="text-sm font-semibold text-[#6366F1]">1 stratégie = 1 crédit</span>
            </div>
            <p className="text-xs text-[#71717A]">
              Vous pouvez générer <span className="font-semibold text-[#18181B]">{quotaRemaining}</span> nouvelle{quotaRemaining > 1 ? "s" : ""} stratégie{quotaRemaining > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ✅ CORRECTION : Suppression de la comparaison avec 999 */}
        {quotaTotal > 0 && (
          <div className="mt-6 pt-6 border-t border-[#E7E7EB]/50">
            <div className="flex items-center justify-between text-xs text-[#71717A] mb-2">
              <span>Utilisation de votre plan</span>
              <span className="font-semibold text-[#18181B]">{quotaRemaining} / {quotaTotal}</span>
            </div>
            <div className="h-2 bg-[#E7E7EB] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(quotaRemaining / quotaTotal) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  isZeroBalance ? "bg-red-500" : isLowBalance ? "bg-amber-500" : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"
                }`}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          COMMENT FONCTIONNENT LES CRÉDITS
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[14px] border border-[#E7E7EB] p-6 md:p-8 mb-8"
      >
        <h2 className="text-lg font-bold text-[#18181B] mb-6">Comment fonctionnent les crédits ?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: "01", title: "Choisissez un pack", desc: "Sélectionnez le volume de crédits adapté à vos besoins." },
            { num: "02", title: "Paiement sécurisé", desc: "Réglez via Mobile Money, PayPal ou Carte via notre partenaire Chariow." },
            { num: "03", title: "1 stratégie = 1 crédit", desc: "Votre plan est mis à jour et chaque stratégie générée consomme 1 crédit." },
          ].map((step, i) => (
            <div key={step.num} className="relative">
              <div className="text-3xl font-bold text-[#6366F1]/20 mb-2">{step.num}</div>
              <h3 className="text-sm font-bold text-[#18181B] mb-1">{step.title}</h3>
              <p className="text-xs text-[#71717A] leading-relaxed">{step.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-4 right-0 translate-x-1/2">
                  <ArrowRight className="h-4 w-4 text-[#E7E7EB]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          PACKS DE CRÉDITS
      ═══════════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
        <div className="mb-6">
          <h2 className="text-[24px] md:text-[28px] font-bold text-[#18181B] tracking-tight">
            Choisissez votre pack
          </h2>
          <p className="text-[15px] text-[#71717A] mt-1.5">
            Achetez uniquement ce dont vous avez besoin. Aucun abonnement obligatoire.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {PACKS.map((pack, index) => {
            const isRecommended = pack.id === recommendedPackId;
            const discount = Math.round(((pack.oldPrice - pack.price) / pack.oldPrice) * 100);

            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={`relative rounded-[14px] bg-white border p-6 flex flex-col ${
                  pack.popular ? "border-[#6366F1]/40 ring-1 ring-[#6366F1]/10 shadow-lg shadow-[#6366F1]/5" : "border-[#E7E7EB]"
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6366F1] text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                      <Star className="h-3 w-3 fill-white" />
                      Le plus populaire
                    </span>
                  </div>
                )}

                {isRecommended && !pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex px-3 py-1 rounded-full bg-[#18181B] text-[10px] font-bold text-white uppercase tracking-wider">
                      Recommandé pour vous
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#18181B] mb-1">{pack.name}</h3>
                  <p className="text-xs text-[#71717A] leading-relaxed">{pack.description}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                    <span className="text-3xl font-bold text-[#18181B] tracking-tight">
                      {pack.price.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-sm text-[#71717A]">FCFA</span>
                    <span className="text-sm text-[#94A3B8] line-through">
                      {pack.oldPrice.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-[#6366F1]">
                      {pack.credits} crédits
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                      -{discount}%
                    </span>
                  </div>
                  <div className="text-[10px] text-[#71717A]">
                    Soit {pack.pricePerStrategy} FCFA / stratégie
                  </div>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#18181B]">
                      <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={pack.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-1.5 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    pack.popular
                      ? "bg-[#6366F1] text-white hover:bg-[#5558e6] shadow-sm shadow-[#6366F1]/20"
                      : "bg-[#18181B] text-white hover:bg-[#27272A]"
                  }`}
                >
                  {pack.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          CE QUE CHAQUE PACK DÉBLOQUE
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#6366F1]/[0.03] to-[#8B5CF6]/[0.02] rounded-[14px] border border-[#6366F1]/15 p-6 md:p-8 mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-[#6366F1]" />
          <h3 className="text-lg font-bold text-[#18181B]">Ce que chaque pack débloque réellement</h3>
        </div>
        <p className="text-sm text-[#71717A] mb-6">
          Lorsque vous achetez un pack, votre plan est automatiquement mis à niveau. Voici exactement les fonctionnalités que vous obtenez :
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-[#E7E7EB] p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1]/5 flex items-center justify-center">
                <Zap className="h-4 w-4 text-[#6366F1]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#18181B]">Pack Startup</p>
                <p className="text-[10px] text-[#71717A]">Active le plan Pro</p>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-[#18181B]">
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>3 variantes de copies par stratégie</span></li>
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Analyse personnalisée complète</span></li>
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Recommandations créatives</span></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-[#6366F1]/30 p-4 ring-1 ring-[#6366F1]/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-[#6366F1]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#18181B]">Pack Business</p>
                <p className="text-[10px] text-[#6366F1] font-semibold">Active le plan Business</p>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-[#18181B]">
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>9 variantes de copies par stratégie</span></li>
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Analyse concurrentielle (1 concurrent)</span></li>
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Recommandations créatives avancées</span></li>
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Accès Telegram VIP</span></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-[#E7E7EB] p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Crown className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#18181B]">Pack Entreprise</p>
                <p className="text-[10px] text-[#71717A]">Active le plan Enterprise</p>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-[#18181B]">
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>30 variantes de copies par stratégie</span></li>
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Analyse concurrentielle avancée (3 concurrents)</span></li>
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Calendrier éditorial inclus</span></li>
              <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Support dédié + VIP à vie</span></li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          TABLEAU COMPARATIF
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-[14px] border border-[#E7E7EB] overflow-hidden mb-8"
      >
        <div className="px-6 py-4 border-b border-[#E7E7EB] bg-[#F7F7F8]">
          <h3 className="text-sm font-bold text-[#18181B]">Comparaison détaillée</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E7E7EB]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider">Fonctionnalité</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider">Startup</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-[#6366F1] uppercase tracking-wider bg-[#6366F1]/[0.02]">Business</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider">Entreprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((row, i) => (
                <tr key={i} className="border-b border-[#F7F7F8] last:border-0">
                  <td className="px-6 py-3 text-[#18181B] font-medium">{row.feature}</td>
                  <td className="px-6 py-3 text-center">
                    {typeof row.startup === "number" ? (
                      <span className="font-semibold text-[#18181B]">{row.startup}</span>
                    ) : typeof row.startup === "string" ? (
                      <span className="text-xs font-medium text-[#18181B]">{row.startup}</span>
                    ) : row.startup ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" strokeWidth={3} />
                    ) : (
                      <X className="h-4 w-4 text-[#D4D4D8] mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-3 text-center bg-[#6366F1]/[0.02]">
                    {typeof row.business === "number" ? (
                      <span className="font-semibold text-[#6366F1]">{row.business}</span>
                    ) : typeof row.business === "string" ? (
                      <span className="text-xs font-medium text-[#6366F1]">{row.business}</span>
                    ) : row.business ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" strokeWidth={3} />
                    ) : (
                      <X className="h-4 w-4 text-[#D4D4D8] mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {typeof row.enterprise === "number" ? (
                      <span className="font-semibold text-[#18181B]">{row.enterprise}</span>
                    ) : typeof row.enterprise === "string" ? (
                      <span className="text-xs font-medium text-[#18181B]">{row.enterprise}</span>
                    ) : row.enterprise ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" strokeWidth={3} />
                    ) : (
                      <X className="h-4 w-4 text-[#D4D4D8] mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          PAIEMENT SÉCURISÉ
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[14px] border border-[#E7E7EB] p-6 md:p-8 mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-[#6366F1]" />
          <h3 className="text-lg font-bold text-[#18181B]">Paiement simple et sécurisé</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[#71717A] leading-relaxed mb-4">
              Le paiement est effectué via notre partenaire de paiement sécurisé. Après confirmation, votre plan est mis à jour et vos crédits sont ajoutés à votre compte.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Orange Money", "MTN MoMo", "Wave", "Moov Money", "PayPal", "Visa / Mastercard"].map((method) => (
                <span
                  key={method}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F7F8] border border-[#E7E7EB] text-xs font-medium text-[#18181B]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {[
              "Paiement sécurisé via Chariow",
              "Paiement ponctuel, aucun abonnement",
              "Plan et crédits mis à jour après confirmation",
              "Support disponible en cas de problème",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#18181B]">
                <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" strokeWidth={3} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-[14px] border border-[#E7E7EB] p-6 md:p-8 mb-8"
      >
        <h3 className="text-lg font-bold text-[#18181B] mb-4">Questions fréquentes</h3>
        <div>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center pb-8"
      >
        <p className="text-xs text-[#71717A] mb-4">
          Besoin d'aide pour choisir ? <Link href="https://t.me/MakeItAds_Pro" target="_blank" rel="noopener noreferrer" className="text-[#6366F1] font-semibold hover:underline">Contactez-nous sur Telegram</Link>
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71717A] hover:text-[#6366F1] transition-colors"
        >
          <ArrowRight className="h-3 w-3 rotate-180" />
          Retour au dashboard
        </Link>
      </motion.div>
    </div>
  );
}