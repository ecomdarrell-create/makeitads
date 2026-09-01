"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { SiMeta, SiGoogle, SiTiktok, SiInstagram, SiWhatsapp, SiTelegram } from "react-icons/si";

import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import HeroSection from "@/components/HeroSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const TELEGRAM_URL = "https://t.me/MakeItAds_Pro";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const partnerLogos = [
  { name: "Meta", icon: SiMeta },
  { name: "Google", icon: SiGoogle },
  { name: "TikTok", icon: SiTiktok },
  { name: "Instagram", icon: SiInstagram },
  { name: "WhatsApp", icon: SiWhatsapp },
  { name: "Telegram", icon: SiTelegram },
  { name: "LinkedIn", icon: LinkedinIcon },
];

const howItWorksSteps = [
  {
    number: "01",
    title: "Parlez-nous de votre publicité",
    description: "Vous commencez simplement en nous contactant sur Telegram. Nous vous envoyons ensuite un formulaire pour recueillir votre offre, votre audience, votre marché, votre budget et vos objectifs.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
  },
  {
    number: "02",
    title: "Recevez votre stratégie personnalisée",
    description: "Une fois le formulaire complété, notre équipe analyse votre contexte et vous envoie une stratégie publicitaire claire, directement exploitable, dans un format simple à mettre en œuvre.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
  },
  {
    number: "03",
    title: "Passez au niveau supérieur",
    description: "Votre stratégie peut être le point de départ d'un accompagnement plus avancé avec analyses concurrentielles, recommandations supplémentaires, support prioritaire et accès à des ressources premium.",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=800&auto=format&fit=crop"
  },
];

const strategyPillars = [
  {
    title: "Comprendre",
    text: "Votre activité, votre audience et votre marché avant de dépenser un euro de plus.",
  },
  {
    title: "Décider",
    text: "La plateforme, l'audience, l'angle et le budget à tester pour orienter les bons choix.",
  },
  {
    title: "Agir",
    text: "Une direction claire que vous pouvez mettre en œuvre dans vos campagnes sans perdre de temps.",
  },
];

const brandFocus = [
  "Votre activité",
  "Votre marché",
  "Votre audience",
  "Votre budget",
  "Votre stratégie publicitaire",
];

const teamProfiles = [
  {
    label: "Stratégie marketing",
    title: "Positioning & message",
    description: "Conception de messages, angles et hiérarchies de valeur adaptés à chaque marché.",
  },
  {
    label: "Analyse de marché",
    title: "Intelligence concurrentielle",
    description: "Veille sur les opportunités, les écarts de positionnement et les signaux à surveiller.",
  },
  {
    label: "Acquisition",
    title: "Campagnes & budget",
    description: "Priorisation des canaux, segmentation et logique de test pour mieux répartir le budget.",
  },
  {
    label: "Performance",
    title: "Data & optimisation",
    description: "Suivi, mesure et ajustement de la stratégie pour que la décision soit fondée sur des signaux clairs.",
  },
];

const teamMembers = [
  {
    id: 1,
    firstName: "Aisha",
    lastName: "Diallo",
    role: "Directrice Stratégie Marketing",
    location: "Sénégal",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Spécialiste en positionnement et construction de messages pour les marques africaines.",
  },
  {
    id: 2,
    firstName: "James",
    lastName: "O'Connor",
    role: "Head of Data & Analytics",
    location: "Irlande",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Expert en mesure de performance et optimisation des campagnes multi-canaux.",
  },
  {
    id: 3,
    firstName: "Marie",
    lastName: "Laurent",
    role: "Responsable Intelligence Concurrentielle",
    location: "France",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    bio: "Veille stratégique et analyse des opportunités de marché en Afrique de l'Ouest.",
  },
  {
    id: 4,
    firstName: "Kwame",
    lastName: "Mensah",
    role: "Responsable Acquisition & Croissance",
    location: "Ghana",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "Spécialiste en stratégies d'acquisition et budgétisation pour startups africaines.",
  },
  {
    id: 5,
    firstName: "Sofia",
    lastName: "Rossi",
    role: "Développeuse Produit",
    location: "Italie",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Conception de produits numériques axés sur l'expérience utilisateur.",
  },
  {
    id: 6,
    firstName: "Amara",
    lastName: "Sow",
    role: "Responsable Client Success",
    location: "Côte d'Ivoire",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    bio: "Support prioritaire et accompagnement des clients MakeItAds.",
  },
  {
    id: 7,
    firstName: "David",
    lastName: "Mueller",
    role: "Ingénieur Backend",
    location: "Allemagne",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Infrastructure et sécurité des données pour la plateforme MakeItAds.",
  },
  {
    id: 8,
    firstName: "Fadima",
    lastName: "Kabore",
    role: "Spécialiste Contenu & Ressources",
    location: "Burkina Faso",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Création de guides, articles et ressources éducatives pour les entrepreneurs.",
  },
];

const strategyItems = [
  { icon: Users, label: "Audience Cible", value: "Femmes 25-40 ans, Abidjan +25km", color: "text-[#6366F1]" },
  { icon: Target, label: "Angle Marketing", value: "Preuve sociale + Livraison gratuite", color: "text-[#8B5CF6]" },
  { icon: DollarSign, label: "Budget Recommandé", value: "50 000 FCFA/mois (100% Meta)", color: "text-emerald-600" },
  { icon: TrendingUp, label: "Performance Attendue", value: "Optimisation du coût par message en 14 jours", color: "text-[#0284C7]" },
];

const faqData = [
  { question: "Comment obtenir mon analyse gratuite ?", answer: "C'est simple ! Cliquez sur 'Obtenir ma stratégie', remplissez le formulaire en 2 minutes. Un expert MakeItAds échangera avec vous sur WhatsApp et vous enverra un PDF personnalisé sous 24h." },
  { question: "La stratégie gratuite est-elle vraiment gratuite ?", answer: "Oui, à 100%. C'est notre façon de vous prouver la qualité de notre travail avant que vous n'investissiez un seul franc. Aucun engagement requis." },
  { question: "Quelle est la différence avec les plans payants ?", answer: "Le PDF gratuit vous donne une vision globale. Les plans payants débloquent les textes publicitaires prêts à copier-coller, l'analyse détaillée de vos concurrents et les paramètres de ciblage exacts." },
  { question: "Le paiement est-il sécurisé ?", answer: "Absolument. Nous utilisons Chariow, une plateforme de paiement sécurisée qui accepte le Mobile Money (Orange, Wave, MTN, Moov) et les cartes bancaires." },
  { question: "Que se passe-t-il après le paiement ?", answer: "Une fois le paiement confirmé, vous êtes redirigé vers notre canal Telegram Pro où vous recevrez immédiatement votre dossier complet selon le plan choisi." },
  { question: "Est-ce vraiment adapté au marché africain ?", answer: "Oui, c'est notre ADN. MakeItAds est calibré pour les réalités locales : budgets en FCFA, ciblage par villes africaines, et leviers de confiance locaux." },
  { question: "Puis-je utiliser MakeItAds depuis mon téléphone ?", answer: "Oui, 100%. Notre formulaire, le paiement et la réception de votre stratégie sur WhatsApp/Telegram sont entièrement optimisés pour mobile." },
  { question: "Combien de temps faut-il pour recevoir mon dossier payant ?", answer: "La livraison est quasi instantanée après confirmation du paiement. Vous recevez tout directement sur notre canal Telegram sécurisé." }
];

// ✅ NOUVEAUX PRIX OPTIMISÉS : 9 900 FCFA et 24 900 FCFA
const pricingPlans = [
  { 
    id: "pro", 
    name: "Plan Pro", 
    price: "9 900", 
    oldPrice: "19 900",
    period: "/mois",
    description: "Idéal pour les entrepreneurs qui lancent leur première campagne et veulent des résultats concrets.", 
    features: [
      "2 stratégies publicitaires complètes / mois",
      "6 variantes de textes publicitaires / mois",
      "Ciblage précis (villes, âges, intérêts)",
      "Guide créatif (formats, dimensions)",
      "Accès au groupe privé Telegram"
    ], 
    popular: true, 
    ctaText: "S'abonner au Plan Pro", 
    link: "https://hhowawtq.mychariow.shop/plan-start-up" 
  },
  { 
    id: "premium", 
    name: "Plan Premium", 
    price: "24 900", 
    oldPrice: "39 900",
    period: "/mois",
    description: "Tout le Plan Pro, plus des fonctionnalités avancées pour scaler ton business ou gérer plusieurs projets.", 
    features: [
      "✅ Tout le Plan Pro inclus",
      "5 stratégies publicitaires complètes / mois",
      "15 variantes de textes publicitaires / mois",
      "Analyse concurrentielle avancée (2 concurrents)",
      "Support prioritaire WhatsApp 24/7",
      "Accès VIP au groupe privé Telegram"
    ], 
    popular: false, 
    ctaText: "S'abonner au Plan Premium", 
    link: "https://hhowawtq.mychariow.shop/plan-business" 
  },
];

function BeforeAfterSection() {
  return (
    <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-left sm:text-left mb-10 md:mb-14 max-w-3xl">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight leading-[1.15] text-[#18181B] mb-4">
            Voyez ce qui change avec{" "}
            <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">MakeItAds</span>
          </h2>
          <p className="text-sm sm:text-base text-[#71717A] leading-relaxed">Une simple idée devient une stratégie publicitaire complète, calibrée pour l'Afrique.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="relative">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4 md:mb-6 justify-start">
                <div className="h-2 w-2 rounded-full bg-[#94A3B8]" />
                <span className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Sans MakeItAds</span>
              </div>
              <div className="rounded-2xl bg-[#F7F7F8] border border-[#E7E7EB] p-5 md:p-6 shadow-sm">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#E7E7EB] mb-4 md:mb-5">
                  <Image src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop" alt="Frustration sans stratégie" fill className="object-cover opacity-60 grayscale" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F7F7F8] via-transparent to-transparent" />
                </div>
                <div className="space-y-2.5 md:space-y-3 mb-4 md:mb-5">
                  <div className="h-3 md:h-4 w-3/4 rounded-md bg-[#E7E7EB]" />
                  <div className="h-2.5 md:h-3 w-full rounded-md bg-[#E7E7EB]" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-[#E7E7EB] text-[10px] font-medium text-[#94A3B8]">Ciblage au hasard</span>
                  <span className="px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-[#E7E7EB] text-[10px] font-medium text-[#94A3B8]">Budget gaspillé</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }} className="relative group">
            <div className="flex items-center gap-2 mb-4 md:mb-6 justify-start">
              <div className="h-2 w-2 rounded-full bg-[#6366F1]" />
              <span className="text-xs font-medium uppercase tracking-wider text-[#6366F1]">Avec MakeItAds</span>
            </div>
            <motion.div whileHover={{ y: -4, transition: { duration: 0.3 } }} className="rounded-2xl bg-white border border-[#6366F1]/10 p-5 md:p-6 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.1)] group-hover:shadow-[0_15px_40px_-10px_rgba(99,102,241,0.15)] transition-shadow duration-500">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F7F8] mb-4 md:mb-5">
                <Image src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=800&auto=format&fit=crop" alt="Succès avec stratégie" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/80 via-[#18181B]/20 to-transparent" />
                <div className="absolute top-3 md:top-4 left-3 md:left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2.5 md:px-3 py-1 md:py-1.5 shadow-lg">
                  <Sparkles className="h-3 md:h-3.5 w-3 md:w-3.5 text-[#6366F1]" />
                  <span className="text-[10px] md:text-xs font-medium text-[#18181B]">Score : 94/100</span>
                </div>
              </div>

              <div className="space-y-2.5 md:space-y-3 mb-4 md:mb-5">
                {strategyItems.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-2.5 md:gap-3 p-2.5 md:p-3 rounded-lg bg-[#F7F7F8] group-hover:bg-[#EEF2FF] transition-colors duration-200">
                    <div className={`flex-shrink-0 ${item.color}`}><item.icon className="h-3.5 md:h-4 w-3.5 md:w-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-[#71717A] font-medium">{item.label}</p>
                      <p className="text-[11px] md:text-xs font-medium text-[#18181B] truncate">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E7E7EB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 md:h-4 w-3.5 md:w-4 text-emerald-500" />
                  <p className="text-[11px] md:text-xs font-medium text-[#18181B]">Prêt à lancer</p>
                </div>
                <Link href="#pricing" className="flex items-center gap-1 text-[#6366F1] group/link">
                  <span className="text-[11px] md:text-xs font-medium">Voir les offres</span>
                  <ArrowRight className="h-3 md:h-3.5 w-3 md:w-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative group rounded-2xl border p-5 md:p-6 flex flex-col transition-all duration-300 h-full bg-[#FFFFFF] ${
        plan.popular
          ? "border-[#6366F1] shadow-[0_8px_30px_-12px_rgba(99,102,241,0.15)] hover:shadow-[0_15px_40px_-10px_rgba(99,102,241,0.2)] hover:-translate-y-1 ring-1 ring-[#6366F1]"
          : "border-[#E7E7EB] shadow-sm hover:shadow-[0_8px_25px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-2.5 md:-top-3 left-1/2 -translate-x-1/2 rounded-full px-2.5 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[10px] font-medium text-white uppercase tracking-wider shadow-md bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
          Le plus populaire
        </div>
      )}

      <div className="mb-4 md:mb-5">
        <h3 className="text-base md:text-lg font-medium text-[#18181B] mb-1">{plan.name}</h3>
        <p className="text-xs text-[#71717A] leading-relaxed">{plan.description}</p>
      </div>

      <div className="mb-5 md:mb-6">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-2xl md:text-3xl font-medium text-[#18181B]">{plan.price}</span>
          <span className="text-xs md:text-sm text-[#71717A]">FCFA{plan.period}</span>
          <span className="text-xs md:text-sm text-[#94A3B8] line-through">{plan.oldPrice} FCFA</span>
        </div>
        <p className="text-[10px] text-[#71717A] mt-1.5 font-medium">Abonnement mensuel · Annulable à tout moment</p>
      </div>

      <ul className="space-y-2.5 md:space-y-3 mb-5 md:mb-6 flex-1">
        {plan.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-2 md:gap-2.5 text-[11px] md:text-xs text-[#18181B]">
            <div className="mt-0.5 flex-shrink-0 h-3.5 md:h-4 w-3.5 md:w-4 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
              <Check className="h-2 md:h-2.5 w-2 md:w-2.5 text-[#6366F1]" strokeWidth={3} />
            </div>
            <span className="leading-tight">{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={plan.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full rounded-lg py-2.5 md:py-3 text-center text-xs md:text-sm font-medium transition-all duration-200 border ${
          plan.popular
            ? "bg-[#6366F1] text-white border-[#6366F1] hover:bg-[#5558e6] shadow-sm shadow-[#6366F1]/20"
            : "bg-[#FFFFFF] text-[#18181B] border-[#E7E7EB] hover:bg-[#F7F7F8] hover:border-[#6366F1]/30"
        }`}
      >
        {plan.ctaText}
      </a>
    </motion.div>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToPricing = () => {
    const element = document.getElementById("pricing");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFAQ = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("faq");
    if (element) {
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#18181B] overflow-x-hidden selection:bg-[#6366f1]/20 selection:text-[#18181B]">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6366f1]/5 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#8b5cf6]/5 rounded-full blur-[80px] opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px]" style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,0,0,0.05) 70%, transparent 100%)" }} />
      </div>

      <GlobalNavbar />
      <HeroSection />

      <section className="relative z-10 py-6 md:py-8 border-y border-[#E7E7EB] bg-[#F7F7F8]">
        <div className="max-w-5xl mx-auto px-4 text-left sm:text-left">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6366f1] font-medium mb-4">Compatible avec vos plateformes</p>
          <div className="relative overflow-hidden">
            <div className="flex animate-[scroll_20s_linear_infinite] hover:[animation-play-state:paused]">
              {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, index) => {
                const Icon = logo.icon;
                return (
                  <div key={index} className="flex-shrink-0 mx-6 md:mx-8 flex items-center justify-center">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-[#94A3B8] hover:text-[#6366f1] transition-colors duration-300" />
                  </div>
                );
              })}
            </div>
            <style jsx>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }`}</style>
          </div>
        </div>
      </section>

      <TestimonialsCarousel placement="top" />

      <section id="how-it-works" className="relative z-10 bg-[#FFFFFF] py-12 md:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-14">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight text-[#18181B] mb-3">
              Un processus <span className="text-[#6366F1]">simple</span> et <span className="text-[#6366F1]">humain</span>
            </h2>
            <p className="text-sm sm:text-base text-[#71717A] max-w-xl">De votre idée à votre campagne lancée, sans tableau de bord complexe.</p>
          </motion.div>

          <div className="space-y-12 md:space-y-20">
            {howItWorksSteps.map((step, index) => {
              const isReversed = index % 2 !== 0;
              return (
                <div key={step.number} className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${isReversed ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <motion.div initial={{ opacity: 0, x: isReversed ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-left">
                    <div className="relative inline-block">
                      <span className="text-5xl md:text-7xl font-black text-[#6366f1]/5 absolute -top-6 left-0 select-none leading-none">{step.number}</span>
                      <div className="relative z-10 pt-8 md:pt-10">
                        <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="text-xl md:text-2xl font-bold text-[#18181B] mb-3 leading-[1.2]">{step.title}</motion.h3>
                        <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} className="text-sm md:text-base text-[#71717A] leading-relaxed max-w-md">{step.description}</motion.p>

                        {index === 0 && (
                          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-6">
                            <a
                              href={TELEGRAM_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full bg-[#18181B] px-4 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all"
                            >
                              Commencer maintenant <ArrowRight className="h-4 w-4" />
                            </a>
                          </motion.div>
                        )}

                        {index === 2 && (
                          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-6">
                            <button
                              onClick={scrollToPricing}
                              className="inline-flex items-center gap-2 rounded-full border border-[#E7E7EB] bg-[#F7F7F8] px-4 py-2 text-xs font-medium text-[#18181B] hover:border-[#6366F1]/30 hover:bg-white transition-all"
                            >
                              Découvrir les formules <ArrowRight className="h-4 w-4" />
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }} className="relative flex items-center justify-center">
                    <div className="absolute w-[80%] h-[80%] bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-full blur-3xl" />
                    <div className="relative w-full max-w-sm mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-[#E7E7EB]">
                      <Image src={step.image} alt={step.title} fill className="object-cover" unoptimized />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <BeforeAfterSection />

      <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#18181B] mb-3">
              Pourquoi commencer par une <span className="text-[#6366F1]">stratégie</span> ?
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-[#71717A] leading-relaxed">
              Avant de dépenser davantage en publicité, il faut savoir où investir, qui cibler et quel message tester.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {strategyPillars.map((pillar, index) => (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-[#E7E7EB] bg-[#F7F7F8] p-5 md:p-6"
              >
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#6366F1]">0{index + 1}</div>
                <h3 className="text-xl font-bold text-[#18181B] mb-3">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-[#71717A]">{pillar.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#F7F7F8] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="sticky top-24">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-[#E7E7EB] bg-[#E7E7EB]">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
                    alt="Karamo Brown - Expert en transformation et leadership"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute -bottom-6 left-0 right-0 mx-auto w-32 h-32 bg-white rounded-full border-4 border-[#F7F7F8] overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop"
                    alt="Karamo Brown"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="pt-16 md:pt-0"
            >
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#6366F1]/10 px-3 py-1 mb-4">
                  <span className="text-xs font-semibold text-[#6366F1] uppercase tracking-wider">Avis d'expert</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#18181B] mb-2">Karamo Brown</h3>
                <p className="text-sm text-[#71717A] mb-6">Expert en transformation, leadership & stratégie commerciale</p>
              </div>

              <blockquote className="mb-8">
                <p className="text-lg md:text-xl text-[#18181B] leading-relaxed italic mb-4">
                  "J'ai vu MakeItAds transformer la façon dont les entrepreneurs africains pensent leur marketing. Ce n'est pas un outil de plus. C'est une mentalité : comprendre avant d'agir, mesurer avant de dépenser."
                </p>
                <p className="text-base md:text-lg text-[#18181B] leading-relaxed italic">
                  "Si vous construisez une entreprise sérieuse, vous méritez une stratégie sérieuse. MakeItAds la livr exactement comme ça."
                </p>
              </blockquote>

              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#18181B] text-sm mb-0.5">Stratégie crédible</p>
                    <p className="text-sm text-[#71717A]">Aucune fausse promesse, juste de la vraie stratégie applicable demain.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#18181B] text-sm mb-0.5">Calibrée pour l'Afrique</p>
                    <p className="text-sm text-[#71717A]">Comprend les réalités locales : budgets, audiences, leviers de confiance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#18181B] text-sm mb-0.5">Pour les entrepreneurs sérieux</p>
                    <p className="text-sm text-[#71717A]">Pas de chiffres gonflés. Pas d'expertise invventée. Juste du résultat.</p>
                  </div>
                </div>
              </div>

              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#18181B] px-6 py-3 text-sm font-bold text-white hover:bg-[#333333] transition-all"
              >
                Commencer sur recommandation d'expert <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#18181B] mb-3">
              Qui <span className="text-[#6366F1]">sommes-nous</span> ?
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-[#71717A] leading-relaxed">
              L'équipe MakeItAds rassemble des experts en stratégie marketing, intelligence concurrentielle, acquisition et data analytics, basés partout dans le monde mais spécialisés dans le marché africain.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group rounded-2xl border border-[#E7E7EB] bg-[#F7F7F8] overflow-hidden hover:shadow-lg hover:border-[#6366F1]/30 transition-all"
              >
                <div className="relative w-full aspect-square overflow-hidden bg-[#E7E7EB] group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={member.image}
                    alt={`${member.firstName} ${member.lastName}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#18181B] mb-1">{member.firstName} {member.lastName}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6366F1] mb-2">{member.role}</p>
                  <p className="text-xs text-[#94A3B8] mb-3 flex items-center gap-1">
                    <span>📍</span> {member.location}
                  </p>
                  <p className="text-sm text-[#71717A] leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#F7F7F8]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#18181B] mb-3">
              Investissez dans votre <span className="text-[#6366F1]">croissance</span>
            </h2>
            <p className="text-sm sm:text-base text-[#71717A] max-w-xl">Des formules d'abonnement flexibles, conçues pour tester et scaler votre marché.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          
          <div className="text-left sm:text-left mt-8 md:mt-10">
            <p className="text-xs text-[#71717A] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Paiement 100% sécurisé via Chariow (Mobile Money & Carte)
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#18181B] mb-3">
              Questions <span className="text-[#6366F1]">fréquentes</span>
            </h2>
            <p className="text-sm sm:text-base text-[#71717A]">Tout ce que vous devez savoir avant de commencer</p>
          </motion.div>
          <div className="space-y-3 md:space-y-4">
            {faqData.map((faq, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                className="rounded-xl border border-[#E7E7EB] bg-[#F7F7F8]/50 overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                  className="w-full flex items-center justify-between p-3 sm:p-4 md:p-5 text-left hover:bg-[#F0F0F2] transition-colors"
                >
                  <span className="text-sm sm:text-base font-medium text-[#18181B] pr-4 leading-snug">{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-[#71717A] transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5">
                        <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-white border-t border-[#E7E7EB]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Garantie confiance</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#18181B] mb-4">
                Démarrez sans risque.
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#18181B] text-sm mb-1">Stratégie gratuite d'abord</p>
                    <p className="text-sm text-[#71717A]">Testez notre qualité avec une analyse complète, 100% gratuite, sans engagement.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#18181B] text-sm mb-1">Paiement sécurisé</p>
                    <p className="text-sm text-[#71717A]">Via Chariow. Remboursable intégralement si vous n'êtes pas satisfait dans les 7 jours.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#18181B] text-sm mb-1">Support prioritaire inclus</p>
                    <p className="text-sm text-[#71717A]">Accès WhatsApp 24/7 pour vos questions et ajustements de stratégie.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-2xl border border-[#E7E7EB] bg-[#F7F7F8] p-6 md:p-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">7 jours</div>
                <p className="text-sm text-[#71717A] mb-6">Pour décider. Garantie complète ou remboursé.</p>
                
                <div className="space-y-3">
                  <div className="rounded-lg bg-white p-4 border border-[#E7E7EB]">
                    <p className="text-xs uppercase tracking-wider text-[#6366F1] font-semibold mb-1">Aucune question posée</p>
                    <p className="text-sm font-medium text-[#18181B]">Remboursement automatique si pas satisfait</p>
                  </div>
                  <div className="rounded-lg bg-white p-4 border border-[#E7E7EB]">
                    <p className="text-xs uppercase tracking-wider text-[#6366F1] font-semibold mb-1">Résiliation flexible</p>
                    <p className="text-sm font-medium text-[#18181B]">Annulez à tout moment votre abonnement mensuel</p>
                  </div>
                  <div className="rounded-lg bg-white p-4 border border-[#E7E7EB]">
                    <p className="text-xs uppercase tracking-wider text-[#6366F1] font-semibold mb-1">Accès complet</p>
                    <p className="text-sm font-medium text-[#18181B]">Tous les bénéfices du plan pendant 7 jours</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#F7F7F8]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left mb-10 md:mb-14 max-w-3xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#18181B] mb-4">
              Les faits vérifiés
            </h2>
            <p className="text-sm text-[#71717A] leading-relaxed">
              Aucune statistique gonflée. Aucun chiffre inventé. Ce que nos utilisateurs ont demandé et validé.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[
              { number: "500+", label: "Entrepreneurs conseillés", detail: "En 18 mois d'activité" },
              { number: "24h", label: "Délai de stratégie", detail: "Du formulaire à la livraison" },
              { number: "7 jours", label: "Remboursement garanti", detail: "Sans question posée" },
              { number: "12+", label: "Pays couverts", detail: "Du Sénégal au Cameroun" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-[#E7E7EB] bg-white p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#6366F1] mb-2">{stat.number}</div>
                <p className="font-semibold text-[#18181B] mb-2 text-sm">{stat.label}</p>
                <p className="text-xs text-[#71717A]">{stat.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="resources" className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#18181B] mb-3">
              Nos <span className="text-[#6366F1]">Ressources</span> gratuites
            </h2>
            <p className="text-sm sm:text-base text-[#71717A] max-w-xl">Des guides pratiques pour maximiser vos campagnes, même avant de passer à l'action.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                title: "Guide du Ciblage Meta en Afrique",
                description: "Comment configurer vos audiences pour toucher les bons décideurs au Sénégal, Côte d'Ivoire et Cameroun.",
                date: "5 min de lecture",
                link: "#",
                content: ["Segmentation par villes et intérêts professionnels", "Budgétisation en devises locales (FCFA, XOF, etc.)", "Audiences lookalike calibrées pour l'Afrique", "Éviter les erreurs de ciblage courantes"]
              },
              {
                title: "Les 3 erreurs qui brûlent votre budget",
                description: "Analyse des campagnes échouées et comment les éviter dès le premier jour de lancement.",
                date: "3 min de lecture",
                link: "#",
                content: ["Erreur #1 : Ciblage trop large sans testing", "Erreur #2 : Budgets constants sans optimisation", "Erreur #3 : Créatifs génériques sans test A/B", "Framework pour débugger vos campagnes"]
              },
              {
                title: "Template de Message WhatsApp",
                description: "Modèles de messages éprouvés pour convertir vos prospects en clients après un clic sur votre pub.",
                date: "2 min de lecture",
                link: "#",
                content: ["Séquence d'activation immédiate", "Scénarios de réponse par secteur d'activité", "Timing et fréquence optimaux", "Exemples testés avec ROI mesurable"]
              }
            ].map((res, i) => (
              <motion.a 
                key={i}
                href={res.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white p-5 md:p-6 rounded-2xl border border-[#E7E7EB] hover:shadow-lg hover:border-[#6366F1]/30 transition-all duration-300 block"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-medium">{res.date}</span>
                </div>
                <h3 className="text-base md:text-lg font-medium text-[#18181B] mb-2 group-hover:text-[#6366F1] transition-colors">{res.title}</h3>
                <p className="text-sm text-[#71717A] leading-relaxed mb-4">{res.description}</p>
                <div className="mb-4 space-y-2">
                  {res.content && res.content.map((point: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#18181B]">
                      <span className="text-[#6366F1] font-bold mt-0.5">✓</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
                <div className="inline-flex items-center gap-1 text-sm font-medium text-[#6366F1] group-hover:gap-2 transition-all">
                  Lire l'article <ArrowRight className="w-4 h-4" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-8 md:py-12 px-4 sm:px-6 bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center gap-4">
            <p className="text-sm md:text-base text-[#71717A]">Prêt à appliquer ces stratégies ?</p>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#5558e6] transition-all shadow-lg shadow-[#6366F1]/20"
            >
              Découvrir les formules <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <TestimonialsCarousel placement="bottom" />

      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF] border-t border-[#E7E7EB]">
        <div className="max-w-3xl mx-auto text-left sm:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.15] mb-6 text-[#18181B]">
              Prêt à préparer votre <span className="text-[#6366F1]">prochaine campagne ?</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#71717A] mb-8 max-w-xl leading-relaxed">
              Votre stratégie commence ici. Obtenez une intelligence marché, une analyse concurrentielle et un plan d'exécution complet en un seul endroit.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={scrollToPricing}
              className="inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-5 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-medium text-white shadow-lg shadow-[#6366f1]/25 hover:bg-[#5558e6] transition-all hover:scale-[1.02]"
              >
                Voir les offres et débloquer l'accès <ArrowRight className="h-4 w-4" />
              </button>
              <a 
                href="#faq"
                onClick={scrollToFAQ}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#F7F7F8] border border-[#E7E7EB] px-5 py-2.5 sm:px-8 sm:py-3 text-sm font-medium text-[#18181B] hover:bg-[#E7E7EB] transition-all"
              >
                Voir les questions fréquentes
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}