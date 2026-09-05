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
import WhyChooseSection from "../components/WhyChooseSection";
import TrustpilotCarousel, { section1Reviews, section2Reviews } from "@/components/TrustpilotCarousel";

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
    title: "Remplissez le formulaire gratuit",
    description: "Décrivez votre activité, votre cible et vos objectifs en 2 minutes via notre formulaire sécurisé.",
    image: "/images/process/step-1-formulaire.jpg"
  },
  {
    number: "02",
    title: "Recevez votre stratégie par email",
    description: "Notre équipe analyse votre contexte et vous envoie une stratégie claire, directement exploitable, sous 24 à 48h.",
    image: "/images/process/step-2-strategie-email.jpg"
  },
  {
    number: "03",
    title: "Rejoignez notre canal Telegram",
    description: "Accédez à notre communauté privée pour des ressources exclusives et nos formules d'accompagnement Premium et Elite.",
    image: "/images/process/step-3-communaute-telegram.jpg"
  },
];

const faqData = [
  { question: "Comment obtenir mon analyse gratuite ?", answer: "C'est simple ! Cliquez sur 'Obtenir ma stratégie', remplissez le formulaire en 2 minutes. Un expert MakeItAds analysera votre cas et vous enverra un PDF personnalisé par email sous 24 à 48h." },
  { question: "La stratégie gratuite est-elle vraiment gratuite ?", answer: "Oui, à 100%. C'est notre façon de vous prouver la qualité de notre travail avant que vous n'investissiez un seul franc. Aucun engagement requis." },
  { question: "Quelle est la différence avec les plans payants ?", answer: "Le PDF gratuit vous donne une vision globale. Les plans payants débloquent des stratégies mensuelles récurrentes, des textes publicitaires prêts à copier-coller, et l'analyse détaillée de vos concurrents." },
  { question: "Le paiement est-il sécurisé ?", answer: "Absolument. Nous utilisons Chariow, une plateforme sécurisée qui accepte le Mobile Money (Orange, Wave, MTN, Moov) et les cartes bancaires." },
  { question: "Est-ce vraiment adapté au marché africain ?", answer: "Oui, c'est notre ADN. MakeItAds est calibré pour les réalités locales : budgets en FCFA, ciblage par villes africaines, et leviers de confiance locaux." }
];

// ✅ NOUVELLE MINI-FAQ DE RÉASSURANCE SOUS LES PRIX
const pricingReassuranceFaq = [
  { q: "Pourquoi un abonnement annuel à ce prix ?", a: "Cela nous permet de vous offrir le meilleur tarif possible tout en garantissant un accompagnement de qualité et des mises à jour continues de vos stratégies tout au long de l'année." },
  { q: "Que se passe-t-il juste après le paiement ?", a: "Vous recevez immédiatement un email de confirmation. Un expert vous contacte ensuite sous 24h pour récupérer vos informations et lancer la première stratégie." },
  { q: "Puis-je changer de plan ou annuler ?", a: "Oui, vous pouvez upgrader votre plan à tout moment. L'annulation est simple et sans frais cachés, conformément à nos conditions générales." }
];

const events = [
  { title: "Masterclass Marketing Digital", location: "Abidjan • Mars 2024", attendees: "45 participants", image: "/images/events/event-masterclass-abidjan.jpg" },
  { title: "Atelier Stratégies Publicitaires", location: "Dakar • Juin 2024", attendees: "38 participants", image: "/images/events/event-atelier-dakar.jpg" },
  { title: "Conférence Croissance Digitale", location: "Douala • Sept. 2024", attendees: "120 entrepreneurs", image: "/images/events/event-conference-douala.jpg" },
  { title: "Webinaire Facebook Ads", location: "En ligne • Fév. 2024", attendees: "523 inscrits", image: "/images/events/event-webinaire-facebook.jpg" },
  { title: "Formation LinkedIn", location: "Cotonou • Mai 2024", attendees: "32 professionnels", image: "/images/events/event-formation-linkedin.jpg" },
  { title: "Bootcamp Marketing", location: "Lomé • Août 2024", attendees: "41 participants", image: "/images/events/event-bootcamp-lome.jpg" },
];
const duplicatedEvents = [...events, ...events, ...events];

const pricingPlans = [
  { 
    id: "gratuit", 
    name: "Plan Gratuit", 
    price: "0", 
    period: "",
    currencyNote: "Gratuit pour toujours",
    description: "Idéal pour découvrir notre méthode et obtenir une première vision claire de votre marché.", 
    features: [
      "1 stratégie publicitaire complète",
      "Analyse de votre audience cible",
      "3 variantes de textes publicitaires",
      "Recommandations de budget et canaux"
    ], 
    popular: false, 
    ctaText: "Obtenir ma stratégie gratuite", 
    link: "https://forms.gle/5Ps9Xsri67w1VoEN9",
    color: "border-emerald-500/30",
    checkColor: "text-emerald-500",
    bgCheck: "bg-emerald-500/10",
    bgCard: "bg-[#FFFFFF]"
  },
  { 
    id: "pro", 
    name: "Plan Pro", 
    price: "10 000", 
    period: "/an",
    currencyNote: "~15 € / ~16 $",
    description: "L'essentiel pour démarrer et structurer vos premières campagnes avec clarté et méthode.", 
    features: [
      "2 stratégies publicitaires complètes / mois",
      "6 variantes de textes publicitaires / mois",
      "Ciblage précis (villes, âges, intérêts)",
      "Guide créatif et recommandations",
      "Accès au canal Telegram communautaire"
    ], 
    popular: true, 
    ctaText: "Souscrire au plan Pro", 
    link: "https://hhowawtq.mychariow.shop/plan-start-up/checkout",
    color: "border-[#6366F1]/30",
    checkColor: "text-[#6366F1]",
    bgCheck: "bg-[#6366F1]/10",
    bgCard: "bg-[#FFFFFF]"
  },
  { 
    id: "premium", 
    name: "Plan Premium", 
    price: "50 000", 
    period: "/an",
    currencyNote: "~76 € / ~82 $",
    description: "Pour les entrepreneurs qui veulent tester plusieurs angles et scaler leur activité.", 
    features: [
      "Tout le Plan Pro inclus",
      "5 stratégies publicitaires complètes / mois",
      "15 variantes de textes publicitaires / mois",
      "1 analyse concurrentielle / trimestre",
      "1 publication de votre entreprise sur nos canaux / mois",
      "Support prioritaire WhatsApp"
    ], 
    popular: false, 
    ctaText: "Souscrire au plan Premium", 
    link: "https://hhowawtq.mychariow.shop/plan-business/checkout",
    color: "border-[#8B5CF6]/30",
    checkColor: "text-[#8B5CF6]",
    bgCheck: "bg-[#8B5CF6]/10",
    bgCard: "bg-[#F5F3FF]" // ✅ Fond distinct pour le plan Premium
  },
  { 
    id: "elite", 
    name: "Plan Elite", 
    price: "250 000", 
    period: "/an",
    currencyNote: "~380 € / ~410 $",
    description: "L'accompagnement sur-mesure pour les entreprises qui exigent l'excellence.", 
    features: [
      "Tout le Plan Premium inclus",
      "15 stratégies publicitaires complètes / mois",
      "Analyse concurrentielle complète chaque mois",
      "4 publications de votre entreprise sur nos canaux / mois",
      "1 session de consulting mensuelle (30 min)",
      "Support ultra-prioritaire (réponse sous 1h)"
    ], 
    popular: false, 
    ctaText: "Souscrire au plan Elite", 
    link: "https://hhowawtq.mychariow.shop/prd_3kt8qhd9/checkout",
    color: "border-amber-500/30",
    checkColor: "text-amber-500",
    bgCheck: "bg-amber-500/10",
    bgCard: "bg-[#FFFFFF]"
  },
];

function PricingCard({ plan }: { plan: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative group rounded-2xl border p-4 md:p-6 flex flex-col transition-all duration-300 h-full ${plan.bgCard} ${
        plan.popular
          ? `${plan.color} shadow-[0_8px_30px_-12px_rgba(99,102,241,0.15)] hover:shadow-[0_15px_40px_-10px_rgba(99,102,241,0.2)] hover:-translate-y-1`
          : `${plan.color} shadow-sm hover:shadow-[0_8px_25px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1`
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[9px] font-medium text-white uppercase tracking-wider shadow-sm bg-[#6366F1]">
          Le plus choisi
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-base md:text-lg font-medium text-[#18181B] mb-1">{plan.name}</h3>
        <p className="text-xs md:text-sm text-[#71717A] leading-relaxed font-normal">{plan.description}</p>
      </div>

      <div className="mb-4 pb-4 border-b border-[#F0F0F2]">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-2xl md:text-3xl font-medium text-[#18181B]">{plan.price === "0" ? "Gratuit" : plan.price}</span>
          {plan.price !== "0" && <span className="text-xs md:text-sm text-[#71717A] font-normal">FCFA{plan.period}</span>}
        </div>
        {plan.currencyNote && (
          <p className="text-[10px] md:text-xs text-[#94A3B8] mt-1 font-normal">{plan.currencyNote}</p>
        )}
      </div>

      <ul className="space-y-2.5 md:space-y-3 mb-6 flex-1">
        {plan.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-2.5 text-[11px] md:text-sm text-[#475569] font-normal leading-relaxed">
            <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${plan.bgCheck} flex items-center justify-center`}>
              <Check className={`h-2.5 w-2.5 ${plan.checkColor}`} strokeWidth={3} />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* ✅ BOUTON EN FORME DE LONGUE BULLE EN PASTILLE */}
      <a
        href={plan.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full rounded-full py-3 text-center text-xs md:text-sm font-medium transition-all duration-200 border ${
          plan.id === "gratuit"
            ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20"
            : plan.popular
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
  const [openPricingFaq, setOpenPricingFaq] = useState<number | null>(null);

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
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

      <TrustpilotCarousel 
        reviews={section1Reviews} 
        title="Ne nous croyez pas, Croyez-les…" 
        footerNote="Une note de 4.8 sur 5 sur la base de 312 avis. Nos avis 4 et 5 étoiles." 
      />

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

      <section id="how-it-works" className="relative z-10 bg-[#FFFFFF] py-10 md:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-8 md:mb-14">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-[#18181B] mb-2">
              Un processus <span className="text-[#6366F1]">simple</span> et <span className="text-[#6366F1]">humain</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A] max-w-xl">De votre idée à votre campagne lancée, sans tableau de bord complexe.</p>
          </motion.div>

          <div className="space-y-10 md:space-y-20">
            {howItWorksSteps.map((step, index) => {
              const isReversed = index % 2 !== 0;
              return (
                <div key={step.number} className={`grid md:grid-cols-2 gap-6 md:gap-12 items-center ${isReversed ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <motion.div initial={{ opacity: 0, x: isReversed ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-left">
                    <div className="relative inline-block">
                      <span className="text-4xl md:text-7xl font-black text-[#6366f1]/5 absolute -top-4 left-0 select-none leading-none">{step.number}</span>
                      <div className="relative z-10 pt-6 md:pt-10">
                        <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="text-base md:text-2xl font-medium text-[#18181B] mb-2 md:mb-3 leading-[1.2]">{step.title}</motion.h3>
                        <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} className="text-xs md:text-base text-[#71717A] leading-relaxed max-w-md">{step.description}</motion.p>

                        {index === 0 && (
                          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-4 md:mt-6">
                            <a
                              href="https://forms.gle/5Ps9Xsri67w1VoEN9"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6366F1] px-5 py-2.5 text-xs md:text-sm font-medium text-white hover:bg-[#5558e6] transition-all min-w-[160px]"
                            >
                              Commencer maintenant <ArrowRight className="h-3.5 w-3.5" />
                            </a>
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

      <WhyChooseSection />

      <section className="relative z-10 py-10 md:py-16 bg-[#FFFFFF] overflow-hidden border-t border-[#F0F0F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6 md:mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6366f1] font-medium mb-2">Notre Expérience Terrain</p>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-medium tracking-tight text-[#18181B]">
              Ils nous ont fait <span className="text-[#6366F1]">confiance</span>
            </h2>
          </motion.div>
        </div>
        
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-4 md:gap-6 animate-[scroll-events_40s_linear_infinite] hover:[animation-play-state:paused] w-max">
            {duplicatedEvents.map((event, index) => (
              <div key={index} className="flex-shrink-0 w-[240px] md:w-[320px] group relative rounded-2xl overflow-hidden border border-[#E7E7EB] bg-[#F7F7F8] shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative aspect-[4/3] w-full">
                  <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                </div>
              </div>
            ))}
          </div>
          <style jsx>{`@keyframes scroll-events { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }`}</style>
        </div>
      </section>

      {/* ✅ SECTION PRICING */}
      <section id="pricing" className="relative z-10 py-10 md:py-20 px-4 sm:px-6 bg-[#F8F8FC]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-8 md:mb-14">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-[#18181B] mb-2">
              Investissez dans votre <span className="text-[#6366F1]">croissance</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A] max-w-xl">Des formules d'abonnement annuelles, conçues pour tester et scaler votre marché en toute sérénité.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          
          <div className="text-left sm:text-left mt-6 md:mt-10">
            <p className="text-xs text-[#71717A] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Paiement 100% sécurisé via Chariow (Mobile Money & Carte)
            </p>
          </div>

          {/* ✅ MINI-FAQ DE RÉASSURANCE SOUS LES PRIX (SANS TITRE) */}
          <div className="max-w-3xl mx-auto mt-12 md:mt-16 space-y-3">
            {pricingReassuranceFaq.map((faq, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                className="rounded-xl border border-[#E7E7EB] bg-[#FFFFFF] overflow-hidden"
              >
                <button 
                  onClick={() => setOpenPricingFaq(openPricingFaq === index ? null : index)} 
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-[#F7F7F8] transition-colors"
                >
                  <span className="text-xs sm:text-sm font-medium text-[#18181B] pr-4 leading-snug">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-[#71717A] transition-transform flex-shrink-0 ${openPricingFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openPricingFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                        <p className="text-[11px] sm:text-xs text-[#71717A] leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ SECTION AVIS 2 (DÉPLACÉE ICI, APRÈS LES TARIFS) */}
      <TrustpilotCarousel 
        reviews={section2Reviews} 
        title="Des résultats qui parlent d'eux-mêmes" 
        footerNote="Une note de 4.7 sur 5 sur la base de 289 avis. Nos avis 3, 4 et 5 étoiles." 
      />

      {/* ✅ SECTION RESSOURCES / BLOGS */}
      <section id="resources" className="relative z-10 py-10 md:py-20 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-8 md:mb-14">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-[#18181B] mb-2">
              Nos <span className="text-[#6366F1]">Ressources</span> gratuites
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A] max-w-xl">Des guides pratiques pour maximiser vos campagnes, même avant de passer à l'action.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: "Guide du Ciblage Meta en Afrique", description: "Comment configurer vos audiences pour toucher les bons décideurs.", date: "5 min", link: "/insights/guide-analyse-concurrents-ia-2026" },
              { title: "Les 3 erreurs qui brûlent votre budget", description: "Analyse des campagnes échouées et comment les éviter.", date: "3 min", link: "/insights/reduire-cac-saas-donnees" },
              { title: "Template de Message WhatsApp", description: "Modèles de messages éprouvés pour convertir vos prospects.", date: "2 min", link: "/insights/strategie-marketing-saas-0-a-10k-mrr" }
            ].map((res, i) => (
              <motion.a 
                key={i}
                href={res.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[#F7F7F8] p-4 md:p-6 rounded-2xl border border-[#E7E7EB] hover:shadow-lg hover:border-[#6366F1]/30 transition-all duration-300 block"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-medium">{res.date} de lecture</span>
                </div>
                <h3 className="text-sm md:text-base font-medium text-[#18181B] mb-2 group-hover:text-[#6366F1] transition-colors">{res.title}</h3>
                <p className="text-xs text-[#71717A] leading-relaxed mb-4">{res.description}</p>
                <div className="inline-flex items-center gap-1 text-xs font-medium text-[#6366F1] group-hover:gap-2 transition-all">
                  Lire l'article <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="relative z-10 py-10 md:py-20 px-4 sm:px-6 bg-[#F7F7F8]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left sm:text-left mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-[#18181B] mb-2">
              Questions <span className="text-[#6366F1]">fréquentes</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A]">Tout ce que vous devez savoir avant de commencer</p>
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
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-[#F7F7F8] transition-colors"
                >
                  <span className="text-xs sm:text-sm font-medium text-[#18181B] pr-4 leading-snug">{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 text-[#71717A] transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                        <p className="text-[11px] sm:text-xs text-[#71717A] leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-24 px-4 sm:px-6 bg-[#FFFFFF] border-t border-[#E7E7EB]">
        <div className="max-w-3xl mx-auto text-left sm:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight leading-[1.15] mb-4 md:mb-6 text-[#18181B]">
              Prêt à préparer votre <span className="text-[#6366F1]">prochaine campagne ?</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#71717A] mb-6 md:mb-8 max-w-xl leading-relaxed">
              Votre stratégie commence ici. Obtenez une intelligence marché, une analyse concurrentielle et un plan d'exécution complet.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 w-full sm:w-auto">
              <button 
                onClick={scrollToPricing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-6 py-3 text-xs sm:text-sm font-medium text-white shadow-lg shadow-[#6366f1]/25 hover:bg-[#5558e6] transition-all hover:scale-[1.02]"
              >
                Voir les offres et débloquer l'accès <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
              <a 
                href="#faq"
                onClick={scrollToFAQ}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white border border-[#E7E7EB] px-6 py-3 text-xs sm:text-sm font-medium text-[#18181B] hover:bg-[#F7F7F8] transition-all"
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