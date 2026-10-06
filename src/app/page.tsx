"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { useState, Fragment } from "react";
import { SiMeta, SiGoogle, SiTiktok, SiInstagram, SiWhatsapp, SiTelegram } from "react-icons/si";
import { formatPlanPrice, type Currency } from "@/lib/currency";

import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import HeroSection from "@/components/HeroSection";
import WhyChooseSection from "../components/WhyChooseSection";
import EntrepreneursCarousel from "../components/EntrepreneursCarousel";
import TrustpilotCarousel, { section1Reviews, section2Reviews } from "@/components/TrustpilotCarousel";
import SaaSChatbot from "@/components/shared/SaaSChatbot";

function LinkedinIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>);
}

const partnerLogos = [{ name: "Meta", icon: SiMeta }, { name: "Google", icon: SiGoogle }, { name: "TikTok", icon: SiTiktok }, { name: "Instagram", icon: SiInstagram }, { name: "WhatsApp", icon: SiWhatsapp }, { name: "Telegram", icon: SiTelegram }, { name: "LinkedIn", icon: LinkedinIcon }];

const howItWorksSteps = [
  { number: "01", title: "Créez votre compte", description: "Inscrivez-vous gratuitement et accédez immédiatement à votre espace personnel sécurisé.", image: "/images/process/step-1-signup.jpg" },
  { number: "02", title: "Décrivez votre business", description: "Notre wizard intelligent vous guide à travers 8 questions clés sur votre entreprise.", image: "/images/process/step-2-wizard.jpg" },
  { number: "03", title: "Recevez votre stratégie", description: "Obtenez une stratégie détaillée avec scripts WhatsApp et allocation budgétaire.", image: "/images/process/step-4-growth.jpg" },
  { number: "04", title: "Lancez et scalez", description: "Appliquez les recommandations et regardez votre business se développer.", image: "/images/process/step-3-strategy.jpg" },
];

const faqData = [
  { question: "Comment obtenir mon analyse ?", answer: "Cliquez sur 'Voir les tarifs' pour accéder au Dashboard. Un expert analysera votre cas sous 24 à 48h." },
  { question: "La stratégie gratuite est-elle vraiment gratuite ?", answer: "Oui, à 100%. C'est notre façon de vous prouver notre qualité avant tout investissement." },
  { question: "Que se passe-t-il si mes crédits sont épuisés ?", answer: "Nous vous proposerons automatiquement de passer à un plan supérieur pour continuer sans interruption." },
  { question: "Le paiement est-il sécurisé ?", answer: "Absolument. Nous acceptons le Mobile Money (Orange, Wave, MTN, Moov) et les cartes bancaires." },
  { question: "Puis-je annuler mon abonnement ?", answer: "Oui, à tout moment sans frais cachés. Nous croyons en la rétention par la qualité." },
  { question: "Est-ce adapté au marché africain ?", answer: "Oui, c'est notre ADN. Calibré pour les budgets en FCFA et les leviers de confiance locaux." }
];

const defaultCurrency: Currency = 'XOF';

const pricingPlans = [
  { 
    id: "demo", name: "MakeItAds Démo", price: "0 FCFA", 
    features: ["10 crédits de bienvenue (offre unique)", "Diagnostic Flash", "Stratégies basiques", "Support communautaire"],
    popular: false, ctaText: "Commencer", link: "/dashboard", 
    checkColor: "text-emerald-500", bgCheck: "bg-emerald-500/10", ctaBg: "bg-emerald-500", ctaHover: "hover:bg-emerald-600", ctaTextCol: "text-white", bgCard: "bg-white" 
  },
  { 
    id: "pro", name: "MakeItAds Pro", price: formatPlanPrice('pro', defaultCurrency), durationNote: "12 mois d'accès",
    features: ["15 crédits renouvelés chaque mois", "6 variantes de textes", "Ciblage précis", "Recommandations plateforme", "Guide créatif", "Accès communauté", "Adapté marché local"],
    popular: true, ctaText: "Choisir le Plan Pro", link: "https://makeitads.mychariow.com/plan-pro", 
    checkColor: "text-[#6366F1]", bgCheck: "bg-[#6366F1]/10", ctaBg: "bg-[#6366F1]", ctaHover: "hover:bg-[#5558e6]", ctaTextCol: "text-white", bgCard: "bg-white" 
  },
  { 
    id: "premium", name: "MakeItAds Premium", price: formatPlanPrice('premium', defaultCurrency), durationNote: "12 mois d'accès",
    features: ["30 crédits renouvelés chaque mois", "15 variantes de textes", "Analyse concurrentielle", "Publication / visibilité", "Support prioritaire", "Canal Telegram VIP", "Stratégie de croissance"],
    popular: false, ctaText: "Choisir le Plan Premium", link: "https://makeitads.mychariow.com/plan-prem", 
    checkColor: "text-rose-500", bgCheck: "bg-rose-500/10", ctaBg: "bg-rose-500", ctaHover: "hover:bg-rose-600", ctaTextCol: "text-white", bgCard: "bg-white" 
  },
  { 
    id: "enterprise", name: "MakeItAds Élite", price: formatPlanPrice('enterprise', defaultCurrency), durationNote: "12 mois d'accès",
    features: ["80 crédits renouvelés chaque mois", "Analyse concurrentielle mensuelle", "Accompagnement sur mesure", "4 publications / mois", "Consulting stratégique 30min", "Support < 1 heure", "Accompagnement avancé"],
    popular: false, ctaText: "Choisir le Plan Élite", link: "https://makeitads.mychariow.com/plan-elit",
    checkColor: "text-amber-500", bgCheck: "bg-amber-500/10", ctaBg: "bg-amber-500", ctaHover: "hover:bg-amber-600", ctaTextCol: "text-white", bgCard: "bg-white" 
  },
];

function PricingCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  const isWide = plan.id === 'premium' || plan.id === 'enterprise';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.5 }} 
      className={`relative group rounded-[16px] md:rounded-[24px] border p-3 md:p-4 flex flex-col transition-all duration-300 h-full ${plan.bgCard} ${plan.popular ? 'border-[#6366F1]/40 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.2)]' : 'border-gray-200 shadow-sm'} ${isWide ? 'md:flex-row md:items-center md:gap-6' : ''}`}
    >
      {plan.popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] md:text-[9px] font-bold text-white uppercase tracking-wider shadow-sm bg-[#6366F1] whitespace-nowrap z-10">
          Le plus choisi
        </div>
      )}

      <div className={`${isWide ? 'md:w-1/3 md:border-r md:border-gray-100 md:pr-4 mb-3 md:mb-0' : 'mb-3'}`}>
        <h3 className="text-sm md:text-base font-bold text-[#18181B] mb-1 text-left leading-tight break-words">{plan.name}</h3>
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-base md:text-xl font-bold text-[#18181B] leading-none">{plan.price}</span>
        </div>
        
        {plan.durationNote && (
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold text-white bg-gray-800 whitespace-nowrap">
            {plan.durationNote}
          </span>
        )}

        <Link
          href={plan.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full mt-3 rounded-full py-1.5 text-center text-[10px] md:text-xs font-bold transition-all duration-200 break-words px-2 ${plan.ctaBg} ${plan.ctaHover} ${plan.ctaTextCol} shadow-sm flex items-center justify-center min-h-[32px] leading-tight`}
        >
          {plan.ctaText}
        </Link>
      </div>

      <div className={`flex-1 ${isWide ? 'md:w-2/3' : ''}`}>
        <ul className={`grid ${isWide ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'} gap-x-1.5 gap-y-1.5`}>
          {plan.features.map((feature: string, i: number) => (
            <li key={i} className="flex items-start gap-1 text-[9px] md:text-[11px] text-[#475569] leading-tight min-w-0">
              <Check className={`mt-0.5 flex-shrink-0 h-3 w-3 md:h-3.5 md:w-3.5 ${plan.checkColor}`} strokeWidth={3} />
              <span className="break-words hyphens-auto">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const scrollToPricing = () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="min-h-screen bg-white text-[#18181B] overflow-x-clip selection:bg-[#6366f1]/20">
      <GlobalNavbar />
      <HeroSection />

      <TrustpilotCarousel reviews={section1Reviews} title={<span className="block text-left text-2xl font-semibold leading-tight md:text-3xl">Ne nous croyez pas, <span className="text-[#6366F1]">Croyez-les</span>…</span>} footerNote="Note de 4.8/5 sur 312 avis." />

      <section className="relative z-10 py-6 border-y border-gray-100 bg-[#F8F8FC]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6366f1] font-bold mb-4 text-left">Compatible avec vos plateformes</p>
          <div className="relative overflow-hidden">
            <div className="flex animate-[scroll_20s_linear_infinite] hover:[animation-play-state:paused]">
              {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, index) => (
                <div key={index} className="flex-shrink-0 mx-6 md:mx-8 flex items-center justify-center">
                  <logo.icon className="w-5 h-5 md:w-6 md:h-6 text-gray-400 hover:text-[#6366f1] transition-colors duration-300" />
                </div>
              ))}
            </div>
            <style jsx>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }`}</style>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 bg-white py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-[#18181B] mb-2">Comment ça marche ?</h2>
            <p className="text-sm md:text-base leading-relaxed text-[#71717A] max-w-xl">Obtenez une stratégie publicitaire complète en seulement quelques étapes.</p>
          </motion.div>

          <div className="flex justify-start mb-6 md:mb-10 overflow-x-auto pb-2">
            <div className="inline-flex bg-[#F8F8FC] p-1.5 rounded-full border border-gray-100">
              {howItWorksSteps.map((_, index) => (
                <button key={index} onClick={() => setActiveStep(index)} className={`px-3 md:px-5 py-1.5 rounded-full text-[10px] md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeStep === index ? "bg-[#6366F1] text-white shadow-md" : "text-[#71717A] hover:text-[#18181B] hover:bg-gray-200/50"}`}>
                  Étape {index + 1}
                </button>
              ))}
            </div>
          </div>

          <motion.div key={activeStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex flex-col gap-3">
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-gray-50 rounded-[20px] md:rounded-[32px] overflow-hidden border border-gray-100">
              <Image src={howItWorksSteps[activeStep].image} alt={howItWorksSteps[activeStep].title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 1200px" priority={activeStep === 0} />
            </div>
            <div className="bg-white rounded-[20px] md:rounded-[32px] border border-gray-100 shadow-sm p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-8 mb-4">
                <div className="flex-1 md:order-1 order-2">
                  <p className="text-xs md:text-sm text-[#71717A] leading-relaxed text-left">{howItWorksSteps[activeStep].description}</p>
                </div>
                <div className="flex-shrink-0 md:text-right md:order-2 order-1">
                  <h3 className="text-sm md:text-lg font-bold text-[#18181B] text-left md:text-right">{howItWorksSteps[activeStep].title}</h3>
                </div>
              </div>
              <div className="flex justify-end pt-3 border-t border-gray-100">
                {activeStep < 3 ? (
                  <button onClick={() => setActiveStep(activeStep + 1)} className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18181B] text-white text-xs font-semibold hover:bg-[#333] transition-all">
                    Étape suivante <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button onClick={scrollToPricing} className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366F1] text-white text-xs font-semibold hover:bg-[#5558e6] transition-all shadow-lg shadow-[#6366F1]/25">
                    Commencez maintenant <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#F7F7FD]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-end mb-8 md:mb-12">
            <div>
              <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#6366F1] mb-3">Pourquoi une stratégie ?</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#18181B] mb-3 leading-tight">
                Une bonne campagne ne se lance pas au hasard.<br className="hidden md:block" />
                <span className="text-[#6366F1]">Elle se construit avant le budget.</span>
              </h2>
              <p className="text-sm md:text-base text-[#71717A] leading-relaxed max-w-2xl">
                Avant d’investir, clarifiez qui vous voulez convaincre, ce que vous allez lui dire et comment vous saurez si votre campagne fonctionne.
              </p>
            </div>
            <div className="border-l-2 border-[#6366F1] pl-4 md:mb-1">
              <p className="text-xs md:text-sm font-semibold text-[#18181B]">Le résultat : un plan d’action, pas des suppositions.</p>
              <p className="mt-1 text-[11px] md:text-xs leading-relaxed text-[#71717A]">Chaque étape réduit une incertitude avant de passer à la suivante.</p>
            </div>
          </motion.div>

          <div className="relative">
            {[
              {
                title: "Comprendre le vrai problème",
                text: "Avant de choisir un canal, posez le diagnostic : offre peu claire, audience trop large, manque de confiance ou parcours d’achat compliqué.",
                output: "Décision : quoi corriger d’abord",
                accent: "from-[#6366F1] to-[#8B5CF6]",
              },
              {
                title: "Parler aux bonnes personnes",
                text: "Décrivez le client à convaincre, ses besoins et ses freins pour construire une promesse qui lui parle vraiment.",
                output: "Décision : audience et message",
                accent: "from-[#10B981] to-[#34D399]",
              },
              {
                title: "Maîtriser vos dépenses",
                text: "Définissez un budget de test, un objectif mesurable et les critères qui vous diront de poursuivre, d’ajuster ou d’arrêter.",
                output: "Décision : budget et indicateurs",
                accent: "from-[#F59E0B] to-[#FBBF24]",
              },
              {
                title: "Passer à l’action avec méthode",
                text: "Organisez vos créations, vos variantes de messages et vos prochaines actions dans un ordre que vous pouvez réellement suivre.",
                output: "Décision : quoi lancer ensuite",
                accent: "from-[#EC4899] to-[#F472B6]",
              },
            ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0.92, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{ zIndex: index + 1, top: `${88 + index * 9}px`, transform: `scale(${1 - index * 0.012})` }}
                  className="sticky mx-auto mb-[48vh] flex min-h-[260px] max-w-4xl flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.08)] transition-shadow duration-500 last:mb-0 sm:min-h-[280px] sm:p-6 md:min-h-[300px] md:p-8"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-100">0{index + 1}</span>
                    <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${item.accent} opacity-80`} />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Étape {index + 1} / 4</span>
                  </div>
                  <div className="max-w-2xl">
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-indigo-600">Intelligence marketing</p>
                    <h3 className="mb-3 text-base font-bold leading-snug text-slate-900 sm:text-xl md:text-2xl">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">{item.text}</p>
                  </div>
                  <p className="mt-auto border-t border-slate-100 pt-4 text-[10px] font-semibold text-slate-800 sm:text-xs">{item.output}</p>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseSection />
      <EntrepreneursCarousel />

      <section id="avis" className="relative z-10 py-12 md:py-20 px-0 sm:px-6 bg-[#F8F8FC]">
        <div className="w-full">
          <TrustpilotCarousel reviews={section2Reviews} title={<span className="block text-left text-2xl font-semibold leading-tight md:text-3xl">Des résultats qui parlent <span className="text-[#6366F1]">d&apos;eux-mêmes</span></span>} footerNote="Note de 4.7/5 sur 289 avis." />
        </div>
      </section>

      <section id="pricing" className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-[#18181B] mb-2">Investissez dans votre <span className="text-[#6366F1]">croissance</span></h2>
            <p className="text-sm md:text-base leading-relaxed text-[#71717A] max-w-xl">Des formules annuelles avec crédits mensuels, conçues pour scaler.</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 md:gap-5 w-full">
            <div className="col-span-1">
              <PricingCard plan={pricingPlans[0]} />
            </div>
            <div className="col-span-1">
              <PricingCard plan={pricingPlans[1]} />
            </div>
            <div className="col-span-2">
              <PricingCard plan={pricingPlans[2]} />
            </div>
            <div className="col-span-2">
              <PricingCard plan={pricingPlans[3]} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-[#F8F8FC]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-[#18181B] mb-2">Comparez les <span className="text-[#6366F1]">formules</span></h2>
            <p className="text-sm md:text-base leading-relaxed text-[#71717A]">Comprenez rapidement ce que chaque niveau débloque.</p>
          </motion.div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
            <div className="min-w-[700px] md:min-w-0 grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-0 rounded-[20px] md:rounded-[24px] border border-gray-200 bg-white shadow-sm">
              <div className="p-3 md:p-5 border-b border-r border-gray-100 bg-gray-50 rounded-tl-[20px] md:rounded-tl-[24px]"><span className="text-[10px] md:text-sm font-bold text-[#18181B]">Fonctionnalités</span></div>
              <div className="p-3 md:p-5 border-b border-r border-gray-100 bg-gray-50 text-center"><span className="text-[10px] md:text-sm font-bold text-gray-600">Pro</span></div>
              <div className="p-3 md:p-5 border-b border-r border-gray-100 bg-[#6366F1]/5 text-center"><span className="text-[10px] md:text-sm font-bold text-[#6366F1]">Premium</span></div>
              <div className="p-3 md:p-5 border-b border-gray-100 bg-gray-50 text-center rounded-tr-[20px] md:rounded-tr-[24px]"><span className="text-[10px] md:text-sm font-bold text-amber-500">Élite</span></div>

              {[
                { feature: "Crédits / mois", pro: "15", premium: "30", enterprise: "80" },
                { feature: "Variantes textes", pro: "6", premium: "15", enterprise: "Illimité" },
                { feature: "Analyse concurrentielle", pro: false, premium: true, enterprise: "Mensuelle" },
                { feature: "Support", pro: "Communautaire", premium: "Prioritaire", enterprise: "< 1 heure" },
              ].map((row, i) => (
                <Fragment key={i}>
                  <div className={`p-3 md:p-5 border-b border-r border-gray-100 flex items-center ${i === 3 ? 'rounded-bl-[20px] md:rounded-bl-[24px]' : ''}`}>
                    <span className="text-[10px] md:text-sm font-medium text-[#18181B]">{row.feature}</span>
                  </div>
                  <div className="p-3 md:p-5 border-b border-r border-gray-100 flex items-center justify-center">
                    {typeof row.pro === 'boolean' ? (row.pro ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#6366F1]" /> : <span className="text-gray-300 text-base">—</span>) : <span className="text-[10px] md:text-xs text-[#475569] text-center font-medium">{row.pro}</span>}
                  </div>
                  <div className="p-3 md:p-5 border-b border-r border-[#6366F1]/10 bg-[#6366F1]/5 flex items-center justify-center">
                    {typeof row.premium === 'boolean' ? (row.premium ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#6366F1]" /> : <span className="text-gray-300 text-base">—</span>) : <span className="text-[10px] md:text-xs font-semibold text-[#6366F1] text-center">{row.premium}</span>}
                  </div>
                  <div className={`p-3 md:p-5 border-b border-gray-100 flex items-center justify-center ${i === 3 ? 'rounded-br-[20px] md:rounded-br-[24px]' : ''}`}>
                    {typeof row.enterprise === 'boolean' ? (row.enterprise ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" /> : <span className="text-gray-300 text-base">—</span>) : <span className="text-[10px] md:text-xs font-semibold text-amber-600 text-center">{row.enterprise}</span>}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="relative z-10 py-12 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-[#18181B] mb-2">Questions <span className="text-[#6366F1]">fréquentes</span></h2>
            <p className="text-sm md:text-base leading-relaxed text-[#71717A]">Tout ce que vous devez savoir avant de commencer.</p>
          </motion.div>
          <div className="space-y-3">
            {faqData.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[20px] border border-gray-100 bg-[#F8F8FC] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-3 md:p-5 text-left hover:bg-gray-50/50 transition-colors">
                  <span className="text-xs md:text-sm font-semibold text-[#18181B] pr-4 leading-snug">{faq.question}</span>
                  <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-[#6366F1] flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                      <div className="px-3 md:px-5 pb-3 md:pb-5">
                        <p className="text-xs md:text-sm text-[#71717A] leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-10 md:py-20 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight mb-3 text-[#18181B]">
              Prêt à préparer votre <span className="text-[#6366F1]">prochaine campagne ?</span>
            </h2>
            <p className="text-sm md:text-base text-[#71717A] mb-5 max-w-xl leading-relaxed">
              Votre stratégie commence ici. Obtenez une intelligence marché et un plan d&apos;exécution complet.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <button onClick={scrollToPricing} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:bg-[#5558e6] transition-all hover:scale-[1.02]">
                Voir les tarifs <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
              <Link href="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white border border-gray-200 px-5 py-2.5 text-xs md:text-sm font-medium text-[#18181B] hover:bg-gray-50 transition-all">
                Accéder au Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
      <SaaSChatbot />
    </main>
  );
}