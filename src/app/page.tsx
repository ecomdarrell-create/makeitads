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
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { SiMeta, SiGoogle, SiTiktok, SiInstagram, SiWhatsapp, SiTelegram } from "react-icons/si";

import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import HeroSection from "@/components/HeroSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

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

// ✅ NOUVEAU SYSTÈME DE PRICING ANNUEL (PRO, PREMIUM, ELITE)
const pricingPlans = [
  { 
    id: "pro", 
    name: "Plan Pro", 
    price: "10 000", 
    period: "/an",
    description: "L'essentiel pour démarrer et structurer vos premières campagnes avec clarté et méthode.", 
    features: [
      "2 stratégies publicitaires complètes / mois",
      "6 variantes de textes publicitaires / mois",
      "Ciblage précis (villes, âges, intérêts)",
      "Guide créatif et recommandations de formats",
      "Accès au canal Telegram communautaire",
      "Support standard (réponse sous 24h)"
    ], 
    popular: true, 
    ctaText: "Souscrire au Plan Pro", 
    link: "https://hhowawtq.mychariow.shop/plan-start-up" 
  },
  { 
    id: "premium", 
    name: "Plan Premium", 
    price: "50 000", 
    period: "/an",
    description: "Pour les entrepreneurs et freelances qui veulent tester plusieurs angles et scaler leur activité.", 
    features: [
      "Tout le Plan Pro inclus",
      "5 stratégies publicitaires complètes / mois",
      "15 variantes de textes publicitaires / mois",
      "1 analyse concurrentielle approfondie / trimestre",
      "Accès VIP au canal Telegram (contenu exclusif)",
      "Support prioritaire WhatsApp"
    ], 
    popular: false, 
    ctaText: "Souscrire au Plan Premium", 
    link: "https://hhowawtq.mychariow.shop/plan-business" 
  },
  { 
    id: "elite", 
    name: "Plan Elite", 
    price: "250 000", 
    period: "/an",
    description: "L'accompagnement sur-mesure pour les entreprises qui exigent l'excellence et une croissance maîtrisée.", 
    features: [
      "Tout le Plan Premium inclus",
      "15 stratégies publicitaires complètes / mois",
      "Analyse concurrentielle complète chaque mois",
      "1 session de consulting stratégique mensuelle (30 min)",
      "Audit trimestriel de vos campagnes en cours",
      "Support ultra-prioritaire (réponse sous 1h)"
    ], 
    popular: false, 
    ctaText: "Réserver un appel sur Telegram", 
    link: "https://t.me/MakeitAds_CEO" 
  },
];

function BeforeAfterSection({ scrollToPricing }: { scrollToPricing: () => void }) {
  return (
    <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-left sm:text-left mb-10 md:mb-14 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-[1.15] text-[#18181B] mb-4">
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
                <button onClick={scrollToPricing} className="flex items-center gap-1 text-[#6366F1] group/link">
                  <span className="text-[11px] md:text-xs font-medium">Voir les offres</span>
                  <ArrowRight className="h-3 md:h-3.5 w-3 md:w-3.5 group-hover/link:translate-x-1 transition-transform" />
                </button>
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
      className={`relative group rounded-2xl border p-6 md:p-8 flex flex-col transition-all duration-300 h-full bg-[#FFFFFF] ${
        plan.popular
          ? "border-[#6366F1]/30 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.1)] hover:shadow-[0_15px_40px_-10px_rgba(99,102,241,0.15)] hover:-translate-y-1"
          : "border-[#E7E7EB] shadow-sm hover:shadow-[0_8px_25px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-medium text-white uppercase tracking-wider shadow-sm bg-[#6366F1]">
          Le plus choisi
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-medium text-[#18181B] mb-2">{plan.name}</h3>
        <p className="text-sm text-[#71717A] leading-relaxed font-normal">{plan.description}</p>
      </div>

      <div className="mb-6 pb-6 border-b border-[#F0F0F2]">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-3xl font-medium text-[#18181B]">{plan.price}</span>
          <span className="text-sm text-[#71717A] font-normal">FCFA{plan.period}</span>
        </div>
        <p className="text-[11px] text-[#94A3B8] mt-2 font-normal">Facturation annuelle · Sans engagement</p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm text-[#475569] font-normal leading-relaxed">
            <div className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-[#6366F1]" strokeWidth={3} />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={plan.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full rounded-xl py-3 text-center text-sm font-medium transition-all duration-200 border ${
          plan.popular
            ? "bg-[#6366F1] text-white border-[#6366F1] hover:bg-[#5558e6] shadow-sm shadow-[#6366F1]/20"
            : plan.id === "elite" 
              ? "bg-[#18181B] text-white border-[#18181B] hover:bg-[#333333]" 
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

      <section id="how-it-works" className="relative z-10 bg-[#FFFFFF] py-12 md:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#18181B] mb-3">
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
                        <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="text-xl md:text-2xl font-medium text-[#18181B] mb-3 leading-[1.2]">{step.title}</motion.h3>
                        <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} className="text-sm md:text-base text-[#71717A] leading-relaxed max-w-md">{step.description}</motion.p>

                        {index === 0 && (
                          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-6">
                            <button
                              onClick={scrollToPricing}
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6366F1] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#5558e6] transition-all min-w-[180px]"
                            >
                              Commencer maintenant <ArrowRight className="h-4 w-4" />
                            </button>
                          </motion.div>
                        )}

                        {index === 2 && (
                          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-6">
                            <button
                              onClick={scrollToPricing}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E7EB] bg-[#F7F7F8] px-5 py-2.5 text-sm font-medium text-[#18181B] hover:border-[#6366F1]/30 hover:bg-white transition-all min-w-[180px]"
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

      <BeforeAfterSection scrollToPricing={scrollToPricing} />

      <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#F7F7F8]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-14">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-[#18181B] mb-3">
              Pourquoi commencer par une <span className="text-[#6366F1]">stratégie</span> ?
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A] max-w-2xl">
              Avant de dépenser davantage en publicité, il faut savoir où investir, qui cibler et quel message tester. Une stratégie solide est la fondation de toute croissance durable.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Comprendre",
                desc: "Nous analysons votre activité, votre audience et votre marché local avant de dépenser un euro. Cela évite les erreurs coûteuses dès le premier jour.",
                icon: Users
              },
              {
                title: "Décider",
                desc: "Nous choisissons la plateforme idéale, l'audience précise et l'angle marketing qui résonne avec la culture locale pour maximiser chaque franc investi.",
                icon: Target
              },
              {
                title: "Agir",
                desc: "Vous recevez une direction claire et des textes prêts à l'emploi. Plus de perte de temps à chercher quoi écrire, vous pouvez lancer vos campagnes immédiatement.",
                icon: Zap
              }
            ].map((pillar, index) => (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-[#E7E7EB] bg-[#FFFFFF] p-5 md:p-8 hover:shadow-lg hover:border-[#6366F1]/30 transition-all duration-300 group"
              >
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#6366F1]/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-[#6366F1] transition-colors">
                  <pillar.icon className="h-5 w-5 md:h-6 md:w-6 text-[#6366F1] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base md:text-lg font-medium text-[#18181B] mb-2">{pillar.title}</h3>
                <p className="text-xs md:text-sm leading-relaxed text-[#71717A]">{pillar.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsCarousel />

      <section id="pricing" className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#18181B] mb-3">
              Investissez dans votre <span className="text-[#6366F1]">croissance</span>
            </h2>
            <p className="text-sm sm:text-base text-[#71717A] max-w-xl">Des formules d'abonnement annuelles, conçues pour tester et scaler votre marché en toute sérénité.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
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

      <section id="faq" className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#F7F7F8]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#18181B] mb-3">
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
                className="rounded-xl border border-[#E7E7EB] bg-[#FFFFFF] overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-[#F7F7F8] transition-colors"
                >
                  <span className="text-sm sm:text-base font-medium text-[#18181B] pr-4 leading-snug">{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-[#71717A] transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-4 sm:px-5 pb-5">
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

      <section id="resources" className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#18181B] mb-3">
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
                link: "/insights/guide-analyse-concurrents-ia-2026",
              },
              {
                title: "Les 3 erreurs qui brûlent votre budget",
                description: "Analyse des campagnes échouées et comment les éviter dès le premier jour de lancement.",
                date: "3 min de lecture",
                link: "/insights/reduire-cac-saas-donnees",
              },
              {
                title: "Template de Message WhatsApp",
                description: "Modèles de messages éprouvés pour convertir vos prospects en clients après un clic sur votre pub.",
                date: "2 min de lecture",
                link: "/insights/strategie-marketing-saas-0-a-10k-mrr",
              }
            ].map((res, i) => (
              <motion.a 
                key={i}
                href={res.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[#F7F7F8] p-5 md:p-6 rounded-2xl border border-[#E7E7EB] hover:shadow-lg hover:border-[#6366F1]/30 transition-all duration-300 block"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-medium">{res.date}</span>
                </div>
                <h3 className="text-base md:text-lg font-medium text-[#18181B] mb-2 group-hover:text-[#6366F1] transition-colors">{res.title}</h3>
                <p className="text-sm text-[#71717A] leading-relaxed mb-4">{res.description}</p>
                <div className="inline-flex items-center gap-1 text-sm font-medium text-[#6366F1] group-hover:gap-2 transition-all">
                  Lire l'article <ArrowRight className="w-4 h-4" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#F7F7F8] border-t border-[#E7E7EB]">
        <div className="max-w-3xl mx-auto text-left sm:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-[1.15] mb-6 text-[#18181B]">
              Prêt à préparer votre <span className="text-[#6366F1]">prochaine campagne ?</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#71717A] mb-8 max-w-xl leading-relaxed">
              Votre stratégie commence ici. Obtenez une intelligence marché, une analyse concurrentielle et un plan d'exécution complet en un seul endroit.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={scrollToPricing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-5 py-2.5 sm:px-8 sm:py-3 text-sm font-medium text-white shadow-lg shadow-[#6366f1]/25 hover:bg-[#5558e6] transition-all hover:scale-[1.02] min-w-[180px]"
              >
                Voir les offres et débloquer l'accès <ArrowRight className="h-4 w-4" />
              </button>
              <a 
                href="#faq"
                onClick={scrollToFAQ}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white border border-[#E7E7EB] px-5 py-2.5 sm:px-8 sm:py-3 text-sm font-medium text-[#18181B] hover:bg-[#F7F7F8] transition-all min-w-[180px]"
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