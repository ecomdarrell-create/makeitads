"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  X,
  ChevronDown,
  Loader2,
  Clock,
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Zap,
  Users,
  DollarSign,
  Compass,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { SiShopify, SiStripe, SiMeta, SiGoogle, SiTiktok, SiHubspot, SiInstagram, SiSnapchat } from "react-icons/si";

import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { useSession } from "@/hooks/useSession";
import { usePlan } from "@/hooks/usePlan";
import HeroSection from "@/components/HeroSection";
import CompetitorsSection from "@/components/CompetitorsSection";
import CommunitySection from "@/components/CommunitySection";
import PremiumStories from "@/components/PremiumStories";
import { getCTAText, getCTAHref } from "@/config/cta.config";
import { blogPosts } from "@/data/blogPosts";

// ✅ Icône LinkedIn en SVG inline
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ======================================================
// COMPOSANT : BEFORE / AFTER SECTION
// ======================================================

const strategyBadges = [
  { label: "Stratégie générée", icon: Sparkles, color: "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20" },
  { label: "Audience identifiée", icon: Users, color: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20" },
  { label: "Budget optimisé", icon: DollarSign, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { label: "Concurrents analysés", icon: Target, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { label: "Prêt pour la croissance", icon: TrendingUp, color: "bg-[#38BDF8]/10 text-[#0284C7] border-[#38BDF8]/20" },
];

const strategyItems = [
  { icon: Users, label: "Audience Cible", value: "Femmes 25-40 ans, Abidjan +25km", color: "text-[#6366F1]" },
  { icon: Compass, label: "Angle Marketing", value: "Preuve sociale + Livraison gratuite", color: "text-[#8B5CF6]" },
  { icon: DollarSign, label: "Budget Recommandé", value: "50 000 FCFA/mois (100% Meta)", color: "text-emerald-600" },
  { icon: BarChart3, label: "Performance Attendue", value: "Optimisation du coût par message en 14 jours", color: "text-[#0284C7]" },
  { icon: Calendar, label: "Calendrier Éditorial", value: "3 variantes de textes + 1 guide visuel", color: "text-[#8B5CF6]" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
} as const;

function BeforeAfterSection() {
  return (
    <section className="relative z-10 py-20 md:py-32 px-4 sm:px-6 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-left mb-16 md:mb-20 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.1] text-[#18181B] mb-4 sm:mb-6">
            Voyez ce qui change avec{" "}
            <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">MakeItAds</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#71717A] leading-relaxed">Une simple idée devient une stratégie publicitaire complète, calibrée pour l'Afrique et prête à l'emploi, en quelques secondes.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="relative">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="h-2 w-2 rounded-full bg-[#94A3B8]" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#71717A]">Sans MakeItAds</span>
              </div>
              <div className="rounded-[28px] bg-[#F7F7F8] border border-[#E7E7EB] p-6 sm:p-8 shadow-sm">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#E7E7EB] mb-5 sm:mb-6">
                  <Image src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop" alt="Produit sans stratégie" fill className="object-cover opacity-80" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F7F7F8]/60 to-transparent" />
                </div>
                <div className="space-y-3 mb-5">
                  <div className="h-5 w-3/4 rounded-md bg-[#E7E7EB]" />
                  <div className="h-3 w-full rounded-md bg-[#E7E7EB]" />
                  <div className="h-3 w-5/6 rounded-md bg-[#E7E7EB]" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-[#E7E7EB] text-[11px] font-medium text-[#94A3B8]">Ciblage au hasard</span>
                  <span className="px-3 py-1.5 rounded-full bg-[#E7E7EB] text-[11px] font-medium text-[#94A3B8]">Budget gaspillé</span>
                  <span className="px-3 py-1.5 rounded-full bg-[#E7E7EB] text-[11px] font-medium text-[#94A3B8]">Pas de stratégie</span>
                </div>
                <div className="mt-6 pt-6 border-t border-[#E7E7EB]">
                  <div className="flex items-center gap-2 text-[#94A3B8]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#94A3B8]" />
                    <p className="text-xs sm:text-sm font-medium">En attente de résultats...</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }} className="relative group">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="h-2 w-2 rounded-full bg-[#6366F1]" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#6366F1]">Avec MakeItAds</span>
            </div>
            <motion.div whileHover={{ y: -4, transition: { duration: 0.3 } }} className="rounded-[28px] bg-white border border-[#6366F1]/10 p-6 sm:p-8 shadow-[0_8px_40px_-12px_rgba(99,102,241,0.15)] group-hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.25)] transition-shadow duration-500">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F7F7F8] mb-5 sm:mb-6">
                <Image src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop" alt="Produit avec stratégie" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/80 via-[#18181B]/20 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                  <Zap className="h-3.5 w-3.5 text-[#6366F1]" />
                  <span className="text-xs font-bold text-[#18181B]">Score Stratégique : 94/100</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-[#6366F1]" />
                      <span className="text-xs font-bold text-[#18181B]">Stratégie complète prête</span>
                    </div>
                    <p className="text-[11px] text-[#71717A]">Canaux identifiés • Textes prêts à l'emploi • Guide visuel</p>
                  </div>
                </div>
              </div>

              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="space-y-3 mb-5 sm:mb-6">
                {strategyItems.map((item, i) => (
                  <motion.div key={i} variants={itemVariants} className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F7F8] group-hover:bg-[#EEF2FF] transition-colors duration-200">
                    <div className={`flex-shrink-0 ${item.color}`}><item.icon className="h-4 w-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold">{item.label}</p>
                      <p className="text-xs sm:text-sm font-semibold text-[#18181B] truncate">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                {strategyBadges.map((badge, i) => (
                  <motion.span key={i} variants={itemVariants} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] sm:text-[11px] font-semibold ${badge.color}`}>
                    <badge.icon className="h-3 w-3" />
                    {badge.label}
                  </motion.span>
                ))}
              </motion.div>

              <div className="pt-5 sm:pt-6 border-t border-[#E7E7EB]">
                <Link href="/dashboard" className="flex items-center justify-between group/link">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <p className="text-xs sm:text-sm font-semibold text-[#18181B]">Prêt à lancer</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6366F1]">
                    <span className="text-xs font-bold">Voir la stratégie</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// COMPOSANT : PRICING CARD PREVIEW (MIS À JOUR)
// ======================================================

function PricingCardPreview({ plan, isCurrentPlan }: { plan: any; isCurrentPlan: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative group rounded-[28px] border p-6 flex flex-col transition-all duration-300 h-full bg-[#FFFFFF] ${
        plan.popular
          ? "border-[#6366F1] shadow-[0_8px_40px_-12px_rgba(99,102,241,0.15)] hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.25)] hover:-translate-y-1 ring-1 ring-[#6366F1]"
          : "border-[#E7E7EB] shadow-sm hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.05)] hover:-translate-y-1"
      } ${isCurrentPlan ? "ring-2 ring-[#6366F1] ring-offset-2" : ""}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-md bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
          Le plus populaire
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white flex items-center gap-1">
          <Check className="h-3 w-3" /> Plan actuel
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-lg font-bold text-[#18181B] mb-1">{plan.name}</h3>
        <p className="text-xs text-[#71717A] leading-relaxed">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-bold text-[#18181B]">{plan.price}</span>
          <span className="text-sm text-[#71717A]">FCFA</span>
          <span className="text-sm text-[#94A3B8] line-through">{plan.oldPrice} FCFA</span>
        </div>
        <p className="text-[10px] text-[#71717A] mt-1">Paiement unique · Aucun abonnement</p>
      </div>

      <ul className="space-y-3 mb-6 flex-1">
        {plan.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-2.5 text-xs text-[#18181B]">
            <div className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-[#6366F1]" strokeWidth={3} />
            </div>
            <span className="leading-tight">{feature}</span>
          </li>
        ))}
      </ul>

      {/* ✅ LIEN DIRECT VERS CHARIOW DANS UN NOUVEL ONGLET */}
      <a
        href={plan.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 border ${
          plan.popular
            ? "bg-[#6366F1] text-white border-[#6366F1] hover:bg-[#5558e6] shadow-lg shadow-[#6366F1]/25"
            : "bg-[#FFFFFF] text-[#18181B] border-[#E7E7EB] hover:bg-[#F7F7F8] hover:border-[#6366F1]/30"
        }`}
      >
        {plan.ctaText}
      </a>
    </motion.div>
  );
}

// ======================================================
// DONNÉES (MISES À JOUR AVEC PRIX BARRÉS ET LIENS CHARIOW)
// ======================================================

const howItWorksSteps = [
  { number: "01", title: "Choisissez votre pack", description: "Sélectionnez le pack de crédits qui correspond à vos besoins (Startup, Business ou Entreprise) et réglez par Mobile Money.", image: "/images/step1-transparent.png" },
  { number: "02", title: "Répondez à 7 questions", description: "Décrivez votre entreprise, votre offre, votre cible et votre budget en FCFA. Cela prend moins de 2 minutes.", image: "/images/step2-transparent.png" },
  { number: "03", title: "Recevez votre stratégie", description: "Notre IA génère instantanément un plan d'action complet : canal recommandé, ciblage précis, textes et guide visuel.", image: "/images/step3-transparent.png" },
  { number: "04", title: "Lancez votre campagne", description: "Copiez-collez les paramètres et les textes dans votre gestionnaire de publicité et commencez à convertir immédiatement.", image: "/images/step4-transparent.png" },
];

const painPoints = [
  { id: 1, title: "Dépenses publicitaires au hasard", subtitle: "Vous lancez des pubs sans stratégie claire, en espérant que ça marche.", image: "/images/pain-guesswork.png", borderColor: "border-red-500/30", color: "from-red-500 to-orange-500", description: "Le marketing devient une série de devinettes qui brûlent votre budget.", stat: "63%", statLabel: "des entrepreneurs avouent deviner leurs ciblages" },
  { id: 2, title: "Formations théoriques inadaptées", subtitle: "Des 'gourous' vendent des heures de vidéos qui ne s'appliquent pas à notre réalité locale.", image: "/images/pain-competition.webp", borderColor: "border-amber-500/30", color: "from-amber-500 to-yellow-500", description: "Vous payez pour de la théorie, mais vous devez encore tout faire vous-même.", stat: "78%", statLabel: "estiment que les formations ne donnent pas de résultats concrets", glassmorphism: true },
  { id: 3, title: "Outils occidentaux déconnectés", subtitle: "Les IA génériques proposent des budgets en dollars et des ciblages américains.", image: "/images/pain-wasted.png", borderColor: "border-rose-500/30", color: "from-rose-500 to-pink-500", description: "Aucune prise en compte du Mobile Money, de la livraison ou des habitudes locales.", stat: "Des milliers", statLabel: "de FCFA perdus annuellement à cause de mauvais ciblages" },
];

const signalCards = [
  { label: "Calibrage Local", title: "Conçu pour l'Afrique", description: "Budgets en FCFA, ciblage par ville (Abidjan, Dakar, Douala), et leviers de confiance locaux (WhatsApp, paiement à la livraison).", accent: "from-[#6366f1] to-[#8b5cf6]" },
  { label: "Exécution Immédiate", title: "Du concret, pas de la théorie", description: "Obtenez des textes prêts à copier-coller, des paramètres de ciblage précis et des idées de visuels. Zéro blabla.", accent: "from-[#8b5cf6] to-[#38bdf8]" },
  { label: "Modèle Sans Risque", title: "Paiement unique, zéro abonnement", description: "Achetez des crédits uniquement quand vous en avez besoin, via Mobile Money. Pas d'engagement, pas de surprise.", accent: "from-[#38bdf8] to-[#6366f1]" },
];

const partnerLogos = [
  { name: "Meta", icon: SiMeta },
  { name: "Google", icon: SiGoogle },
  { name: "TikTok", icon: SiTiktok },
  { name: "Instagram", icon: SiInstagram },
  { name: "LinkedIn", icon: LinkedinIcon },
  { name: "Snapchat", icon: SiSnapchat },
  { name: "Shopify", icon: SiShopify },
  { name: "Stripe", icon: SiStripe },
  { name: "HubSpot", icon: SiHubspot },
];

// ✅ DONNÉES DE PRIX MISES À JOUR AVEC LIENS CHARIOW DIRECTS
const pricingPlans = [
  { 
    id: "startup",
    name: "Pack Startup", 
    price: "2 499", 
    oldPrice: "10 000",
    description: "Idéal pour tester MakeItAds et lancer votre première campagne.", 
    features: [
      "1 stratégie publicitaire complète",
      "Ciblage précis (villes, âges, intérêts)",
      "3 variantes de textes publicitaires",
      "Guide créatif (formats, dimensions)",
      "Recommandation de canal (Meta, TikTok, Google)"
    ], 
    popular: false,
    ctaText: "Obtenir le Pack Startup",
    link: "https://hhowawtq.mychariow.shop/plan-start-up" 
  },
  { 
    id: "business",
    name: "Pack Business", 
    price: "7 499", 
    oldPrice: "25 000",
    description: "Pour les entrepreneurs qui veulent tester plusieurs angles et scaler.", 
    features: [
      "3 stratégies publicitaires complètes",
      "Analyse concurrentielle (1 concurrent)",
      "9 variantes de textes publicitaires",
      "Ciblage multi-audiences",
      "Accès au canal Telegram VIP 'The Boardroom'",
      "Crédits valables 90 jours"
    ], 
    popular: true,
    ctaText: "Obtenir le Pack Business",
    link: "https://hhowawtq.mychariow.shop/plan-business" 
  },
  { 
    id: "entreprise",
    name: "Pack Entreprise", 
    price: "14 990", 
    oldPrice: "50 000",
    description: "L'arsenal complet pour les agences, freelances et PME établies.", 
    features: [
      "10 stratégies publicitaires complètes",
      "Analyse concurrentielle avancée (3 concurrents)",
      "30 variantes de textes publicitaires",
      "Recommandations créatives premium",
      "Accès VIP à vie au canal 'The Boardroom'",
      "Support client prioritaire"
    ], 
    popular: false,
    ctaText: "Obtenir le Pack Entreprise",
    link: "https://hhowawtq.mychariow.shop/plan-entreprise" 
  },
];

const faqData = [
  { question: "MakeItAds est-il un abonnement mensuel ?", answer: "Non, absolument pas. Nous fonctionnons avec un système de packs de crédits à paiement unique (2 499, 7 499 ou 14 990 FCFA). Aucun prélèvement récurrent, aucun engagement." },
  { question: "Comment se passe le paiement et la livraison ?", answer: "Vous réglez votre pack de manière sécurisée via Mobile Money (Orange, Wave, MTN, Moov) ou Carte Bancaire grâce à notre partenaire Chariow. Vos crédits sont ajoutés à votre compte en moins de 15 minutes." },
  { question: "Que contient exactement une stratégie générée ?", answer: "Vous recevez une recommandation de plateforme, un ciblage détaillé (lieux, âges, intérêts), des variantes de textes publicitaires prêts à l'emploi, et un guide pour créer vos visuels (compatible Canva)." },
  { question: "Est-ce vraiment adapté à mon pays en Afrique ?", answer: "Oui, c'est notre principale force. Contrairement aux IA génériques, MakeItAds est calibré pour les réalités locales : devises en FCFA, habitudes d'achat, et canaux de communication pertinents." },
  { question: "Puis-je utiliser MakeItAds depuis mon téléphone ?", answer: "Oui, notre plateforme est 100% optimisée pour mobile. Vous pouvez acheter vos crédits, répondre aux questions et récupérer votre stratégie directement depuis votre smartphone." },
  { question: "Que se passe-t-il si je n'ai pas reçu mes crédits après paiement ?", answer: "Contactez immédiatement notre support à support@makeitads.pro avec votre ID de transaction. Nous vérifions et créditerons votre compte manuellement en toute sécurité." },
];

// ======================================================
// PAGE PRINCIPALE
// ======================================================

export default function LandingPage() {
  const { user } = useSession();
  const { isFree, isPro, isPremium, isEnterprise } = usePlan();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPlan = isEnterprise ? "entreprise" : isPremium ? "business" : isPro ? "startup" : "free";

  const handleHeroCta = () => { window.location.href = getCTAHref("hero", !!user); };
  const handleFinalCta = () => { window.location.href = getCTAHref("finalCta", !!user); };

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#18181B] overflow-hidden selection:bg-[#6366f1]/20 selection:text-[#18181B]">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#6366f1]/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#8b5cf6]/5 rounded-full blur-[100px] opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px]" style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,0,0,0.05) 70%, transparent 100%)" }} />
      </div>

      <GlobalNavbar />
      <HeroSection />
      <PremiumStories variant="top" />

      <section className="relative z-10 py-10 border-y border-[#E7E7EB] bg-[#F7F7F8]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6366f1] font-semibold mb-6">Compatible avec vos plateformes préférées</p>
          <div className="relative overflow-hidden">
            <div className="flex animate-[scroll_20s_linear_infinite] hover:[animation-play-state:paused]">
              {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, index) => {
                const Icon = logo.icon;
                return (
                  <div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-[#94A3B8] hover:text-[#6366f1] transition-colors duration-300" />
                  </div>
                );
              })}
            </div>
            <style jsx>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }`}</style>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 md:mb-16 max-w-5xl text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.1] text-[#18181B]">
              Le problème n'est pas le manque d'ambition.
              <span className="block mt-2 text-[#6366F1]">
                C'est le manque de la bonne <span className="text-[#6366F1]">stratégie</span>, du bon <span className="text-[#6366F1]">ciblage</span> et de la bonne <span className="text-[#6366F1]">exécution</span> pour le marché africain.
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-[#71717A] leading-relaxed">
              Quand l'information est fragmentée, vous réagissez en retard, dépensez inefficacement et perdez l'avantage de vitesse dont les marques en croissance ont besoin.
            </p>
          </motion.div>
          
          <div className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
            {painPoints.map((point) => (
              <div key={point.id} className={`flex-shrink-0 w-[290px] sm:w-[320px] md:w-[380px] snap-start group relative rounded-2xl sm:rounded-3xl overflow-hidden border ${point.borderColor} bg-white shadow-lg hover:shadow-2xl hover:shadow-[#6366f1]/10 transition-all duration-500`}>
                <div className="aspect-[16/10] overflow-hidden relative">
                  <Image src={point.image} alt={point.title} fill className="object-cover transition duration-700 group-hover:scale-110" sizes="(max-width: 640px) 290px, (max-width: 768px) 320px, 380px" unoptimized />
                  {point.glassmorphism && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-amber-500/10 pointer-events-none" />
                      <div className="absolute inset-0 border border-white/20 pointer-events-none" />
                    </>
                  )}
                </div>
                <div className="p-5 sm:p-6 space-y-2 sm:space-y-3 text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-[#18181B] leading-[1.2] tracking-[-0.02em]">{point.title}</h3>
                  <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">{point.subtitle}</p>
                  <p className="text-[10px] sm:text-xs text-[#94A3B8] italic">{point.description}</p>
                  <div className="pt-1 sm:pt-2">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full bg-gradient-to-r ${point.color} text-white shadow-lg w-full sm:w-auto justify-center sm:justify-start`}>
                      <span>{point.stat}</span>
                      <span className="text-white/90 font-medium">{point.statLabel}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 md:mb-14 max-w-4xl text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.1] text-[#18181B]">
              Connaissez votre <span className="text-[#6366F1]">marché</span>. Comprenez vos <span className="text-[#6366F1]">concurrents</span>. Dominez votre <span className="text-[#6366F1]">secteur</span>.
            </h2>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-3">
            {signalCards.map((card, index) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 }} whileHover={{ y: -6 }} className="group relative rounded-[24px] border border-[#E7E7EB] bg-white p-5 sm:p-6 text-left overflow-hidden shadow-[0_10px_40px_rgba(24,24,27,0.04)] hover:shadow-[0_20px_60px_rgba(24,24,27,0.08)] transition-shadow">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[#71717A]">{card.label}</span>
                  <span className="rounded-full border border-[#E7E7EB] bg-[#F7F7F8] px-2.5 py-1 text-[10px] text-[#71717A] font-medium">0{index + 1}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#18181B] mb-3 leading-[1.2] tracking-[-0.02em]">{card.title}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-[#71717A]">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 bg-[#F7F7F8] py-20 md:py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 mb-20 md:mb-28 text-left">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#18181B] mb-6 leading-[1.1] tracking-[-0.04em]">
              De votre <span className="text-[#6366F1]">idée</span> à une <span className="text-[#6366F1]">stratégie publicitaire complète</span>.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#71717A] max-w-2xl leading-relaxed">
              Vous décrivez votre business. MakeItAds transforme votre contexte en un plan structuré pour le positionnement, les concurrents, les canaux et les priorités de croissance.
            </p>
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-6 space-y-24 md:space-y-36">
          {howItWorksSteps.map((step, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <div key={step.number} className={`grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${isReversed ? "md:[&>*:first-child]:order-2" : ""}`}>
                <motion.div initial={{ opacity: 0, x: isReversed ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: "easeOut" }} className={`text-center md:text-${isReversed ? 'right' : 'left'}`}>
                  <div className="relative inline-block">
                    <span className="text-[100px] sm:text-[140px] md:text-[180px] font-black text-[#6366f1]/5 absolute -top-8 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 select-none leading-none">{step.number}</span>
                    <div className="relative z-10 pt-10 md:pt-14">
                      <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#18181B] mb-4 sm:mb-6 leading-[1.1] tracking-[-0.03em]">{step.title}</motion.h3>
                      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} className="text-sm sm:text-base md:text-lg text-[#71717A] leading-relaxed max-w-lg mx-auto md:mx-0">{step.description}</motion.p>
                    </div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} className="relative flex items-center justify-center">
                  <div className="absolute w-[80%] h-[80%] bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 rounded-full blur-3xl" />
                  <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
                    <Image src={step.image} alt={step.title} width={500} height={500} className="w-full h-full object-contain drop-shadow-2xl" priority={index === 0} unoptimized />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
        <div className="relative py-20 sm:py-28 px-6 mt-24 md:mt-32">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex justify-center">
              <Link href={user ? "/dashboard" : "/signup"} className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 sm:px-10 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] hover:bg-[#5558e6] transition-all hover:scale-105">
                Commencer gratuitement <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <CompetitorsSection />
      <BeforeAfterSection />
      <CommunitySection />

      {/* ✅ SECTION TARIFS MISE À JOUR (NOTE CHARIOW SUPPRIMÉE) */}
      <section id="pricing" className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#F7F7F8]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.1] mb-4 text-[#18181B]">
              Un prix simple.{" "}
              <span className="text-[#6366F1]">Pas d'abonnement.</span>
            </h2>
            <p className="text-base md:text-lg text-[#71717A] mb-8 max-w-2xl mx-auto">
              Choisissez le pack de crédits qui correspond à votre ambition. Paiement unique et 100% sécurisé via Mobile Money.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div key={plan.id}>
                <PricingCardPreview plan={plan} isCurrentPlan={currentPlan === plan.id} />
              </div>
            ))}
          </div>
          
          {/* ✅ NOTE CHARIOW SUPPRIMÉE ICI COMME DEMANDÉ */}
        </div>
      </section>

      <section id="success-stories" className="relative z-10 py-16 md:py-24 px-6 bg-[#FFFFFF]">
        <PremiumStories variant="bottom" />
      </section>

      <section id="faq" className="relative z-10 py-16 md:py-24 px-6 bg-[#F7F7F8]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-left mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.1] mb-4 text-[#18181B]">
              Questions{" "}
              <span className="text-[#6366F1]">fréquentes</span>
            </h2>
            <p className="text-base md:text-lg text-[#71717A]">Tout ce que vous devez savoir sur MakeItAds</p>
          </motion.div>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }} className="rounded-2xl border border-[#E7E7EB] bg-white overflow-hidden shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F7F7F8] transition-colors">
                  <span className="text-base font-semibold text-[#18181B] pr-4 leading-[1.2]">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-[#71717A] transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-6 pb-6">
                        <p className="text-sm text-[#71717A] leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 md:py-32 px-6 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F7F7F8] to-[#FFFFFF]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#6366f1]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-6xl font-bold tracking-[-0.04em] leading-[1.1] mb-6 text-[#18181B]">
              Prêt à préparer votre{" "}
              <span className="text-[#6366F1]">prochaine campagne ?</span>
            </h2>
            <p className="text-base md:text-xl text-[#71717A] mb-12 max-w-2xl">
              Votre stratégie commence ici. Obtenez une intelligence marché, une analyse concurrentielle et un plan d'exécution complet en un seul endroit.
            </p>
            <button onClick={handleFinalCta} className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold text-white shadow-[0_0_60px_-10px_rgba(99,102,241,0.4)] hover:bg-[#5558e6] transition-all hover:scale-105">
              Obtenir la stratégie <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}