"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Check, X, ChevronDown, ArrowRight, Target, BarChart3, 
  Users, Zap, MessageCircle, Lightbulb, LayoutTemplate, 
  TrendingUp, ShieldCheck, Clock, Briefcase, Store, Building2 
} from "lucide-react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

// ======================================================
// CONFIGURATION CENTRALISÉE DES LIENS CHARIOW
// Modifie les URLs ici uniquement si elles changent.
// ======================================================
const CHARIOW_LINKS = {
  discovery: "https://hhowawtq.mychariow.shop/plan-start-up",
  business: "https://hhowawtq.mychariow.shop/plan-business",
  enterprise: "https://hhowawtq.mychariow.shop/plan-entreprise",
};

const PRICING_PLANS = [
  {
    id: "discovery",
    name: "Pack Découverte",
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
    cta: "Obtenir ma stratégie",
    link: CHARIOW_LINKS.discovery
  },
  {
    id: "business",
    name: "Plan Business",
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
    cta: "Choisir Business",
    link: CHARIOW_LINKS.business
  },
  {
    id: "enterprise",
    name: "Plan Entreprise",
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
    cta: "Passer à l'offre Entreprise",
    link: CHARIOW_LINKS.enterprise
  }
];

const DELIVERABLES = [
  { num: "01", title: "Analyse", desc: "Votre activité, votre marché et votre contexte sont analysés en profondeur." },
  { num: "02", title: "Positionnement", desc: "Identification des opportunités et des angles marketing les plus pertinents." },
  { num: "03", title: "Stratégie", desc: "Construction d'une feuille de route publicitaire claire et structurée." },
  { num: "04", title: "Messages", desc: "Création des angles et des textes publicitaires adaptés à votre cible." },
  { num: "05", title: "Créatifs", desc: "Recommandations précises sur les formats et concepts visuels à produire." },
  { num: "06", title: "Exécution", desc: "Vous savez exactement quoi lancer, où le lancer et pourquoi." },
];

const PROFILES = [
  { icon: Lightbulb, title: "Entrepreneur", desc: "Vous voulez savoir où investir votre budget publicitaire sans le gaspiller." },
  { icon: Store, title: "E-commerce", desc: "Vous voulez identifier les bons angles, audiences et canaux pour vos produits." },
  { icon: Building2, title: "PME", desc: "Vous voulez structurer votre acquisition sans multiplier les outils complexes." },
  { icon: Briefcase, title: "Marketeur / Agence", desc: "Vous voulez accélérer la préparation et la présentation de vos stratégies clients." },
];

const FAQS = [
  { q: "Est-ce un abonnement mensuel ?", a: "Non, absolument pas. Nous fonctionnons avec un système de packs de crédits à paiement unique. Aucun prélèvement récurrent, aucun engagement." },
  { q: "Que reçoit-on exactement après l'achat ?", a: "Vous recevez une stratégie complète incluant : la recommandation de plateforme, le ciblage détaillé, plusieurs variantes de textes publicitaires prêts à l'emploi, et un guide pour créer vos visuels." },
  { q: "Puis-je utiliser MakeItAds si je ne suis pas expert en publicité ?", a: "Oui, c'est fait pour vous. L'outil traduit vos informations en langage publicitaire professionnel. Vous n'avez qu'à copier-coller les recommandations." },
  { q: "Quelle offre choisir pour commencer ?", a: "Le Pack Découverte est parfait pour tester la qualité de nos stratégies sur une première campagne. Le Plan Business est recommandé si vous souhaitez tester plusieurs angles simultanément." },
  { q: "Puis-je utiliser plusieurs plateformes publicitaires ?", a: "Oui, notre IA peut vous recommander une stratégie multi-canaux (Meta, TikTok, Google) si votre offre et votre budget le permettent." },
  { q: "Comment fonctionne le paiement ?", a: "Le paiement est 100% sécurisé via notre partenaire Chariow. Vous pouvez payer par Mobile Money (Orange, Wave, MTN, Moov) ou par carte bancaire. Les crédits sont ajoutés en quelques minutes." },
  { q: "Puis-je commencer avec une seule stratégie ?", a: "Oui, le Pack Découverte est conçu exactement pour cela : obtenir une stratégie clé en main pour 2 499 FCFA." },
  { q: "Puis-je passer à une offre supérieure ensuite ?", a: "Oui, vous pouvez acheter un nouveau pack à tout moment. Les crédits s'ajoutent simplement à votre solde existant." },
];

function AccordionItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="rounded-xl border border-[#E7E7EB] bg-[#FFFFFF] overflow-hidden">
      <button onClick={onClick} className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F7F7F8] transition-colors">
        <span className="text-sm font-semibold text-[#18181B] pr-4">{question}</span>
        <ChevronDown className={`h-4 w-4 text-[#71717A] flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
        <p className="text-sm text-[#71717A] leading-relaxed px-5 pb-5">{answer}</p>
      </motion.div>
    </div>
  );
}

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#18181B]">
      <GlobalNavbar />

      {/* 1. HERO */}
      <section className="relative z-10 pt-32 pb-16 px-4 sm:px-6 bg-[#F7F7F8]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-semibold mb-6">
              Des stratégies plus claires. Des décisions plus intelligentes.
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#18181B] mb-6 leading-tight">
              Passez de l'idée à une stratégie publicitaire prête à exécuter.
            </h1>
            <p className="text-base sm:text-lg text-[#71717A] max-w-2xl mx-auto mb-8 leading-relaxed">
              MakeItAds transforme les données de votre marché, votre audience et vos concurrents en stratégies publicitaires structurées et exploitables.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <a href="#pricing-cards" className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors shadow-sm shadow-[#6366F1]/25">
                Choisir mon offre
              </a>
              <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-[#E7E7EB] bg-[#FFFFFF] px-6 py-3 text-sm font-semibold text-[#18181B] hover:bg-[#F7F7F8] transition-colors">
                Découvrir MakeItAds
              </Link>
            </div>
            <p className="text-xs text-[#71717A] flex items-center justify-center gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Sans abonnement obligatoire
              <span className="text-[#E7E7EB]">•</span>
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Résultats structurés
              <span className="text-[#E7E7EB]">•</span>
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Adapté à votre activité
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. CARTES DE PRIX */}
      <section id="pricing-cards" className="py-16 md:py-24 px-4 sm:px-6 bg-[#F7F7F8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#18181B] mb-4">Des offres adaptées à votre stade de croissance.</h2>
            <p className="text-[#71717A]">Paiement unique. Pas de surprise. Accès immédiat.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {PRICING_PLANS.map((plan, i) => (
              <motion.div 
                key={plan.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-6 flex flex-col h-full bg-[#FFFFFF] ${
                  plan.popular 
                    ? "border-[#6366F1] shadow-[0_8px_30px_-12px_rgba(99,102,241,0.15)] ring-1 ring-[#6366F1]" 
                    : "border-[#E7E7EB] shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider bg-[#6366F1]">
                    Le plus populaire
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#18181B] mb-1">{plan.name}</h3>
                  <p className="text-xs text-[#71717A] leading-relaxed">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-bold text-[#18181B]">{plan.price}</span>
                    <span className="text-sm text-[#71717A]">FCFA</span>
                    {plan.oldPrice && <span className="text-sm text-[#94A3B8] line-through">{plan.oldPrice} FCFA</span>}
                  </div>
                  <p className="text-[10px] text-[#71717A] mt-1">Paiement unique · Aucun abonnement</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#18181B]">
                      <div className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-[#6366F1]" strokeWidth={3} />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href={plan.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all duration-200 ${
                    plan.popular 
                      ? "bg-[#6366F1] text-white hover:bg-[#5558e6] shadow-sm shadow-[#6366F1]/25" 
                      : "bg-[#F7F7F8] text-[#18181B] border border-[#E7E7EB] hover:bg-[#FFFFFF] hover:border-[#6366F1]/30"
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CE QUE VOUS REPARTEZ RÉELLEMENT AVEC */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#18181B] mb-4">Voici ce que vous repartez réellement avec.</h2>
            <p className="text-[#71717A]">Un livrable concret, pas juste des conseils vagues.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {DELIVERABLES.map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6366F1]/10 flex items-center justify-center text-xs font-bold text-[#6366F1]">
                  {item.num}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#18181B] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#71717A] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POURQUOI PAS SIMPLEMENT CHATGPT ? */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#F7F7F8]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#18181B] mb-4">Pourquoi utiliser MakeItAds plutôt qu'une IA généraliste ?</h2>
            <p className="text-[#71717A]">MakeItAds est spécialisé dans la décision marketing et la stratégie publicitaire.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E7E7EB]">
                  <th className="text-left py-3 px-4 font-semibold text-[#18181B]">Fonctionnalité</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#71717A]">IA généraliste</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#6366F1] bg-[#6366F1]/5 rounded-t-lg">MakeItAds</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feat: "Contexte marketing structuré", ai: "Limité", mia: true },
                  { feat: "Analyse du marché local", ai: "Générique", mia: true },
                  { feat: "Intelligence concurrentielle", ai: "Limitée", mia: true },
                  { feat: "Recommandation de plateforme", ai: "Générique", mia: true },
                  { feat: "Structure de campagne", ai: "Variable", mia: true },
                  { feat: "Angles publicitaires", ai: true, mia: true },
                  { feat: "Recommandations créatives", ai: "Variable", mia: true },
                  { feat: "Stratégie orientée exécution", ai: "Variable", mia: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#E7E7EB] last:border-0">
                    <td className="py-3 px-4 text-[#18181B]">{row.feat}</td>
                    <td className="py-3 px-4 text-center text-[#71717A]">
                      {typeof row.ai === "boolean" ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : row.ai}
                    </td>
                    <td className="py-3 px-4 text-center bg-[#6366F1]/5">
                      {row.mia && <Check className="h-4 w-4 text-[#6366F1] mx-auto" strokeWidth={3} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. POUR QUI ? */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#18181B] mb-4">Conçu pour ceux qui veulent des résultats.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROFILES.map((profile, i) => (
              <div key={i} className="p-6 rounded-xl border border-[#E7E7EB] bg-[#F7F7F8] text-center hover:border-[#6366F1]/30 transition-colors">
                <profile.icon className="h-8 w-8 text-[#6366F1] mx-auto mb-4" />
                <h3 className="text-base font-bold text-[#18181B] mb-2">{profile.title}</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">{profile.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BLOC SPÉCIAL TELEGRAM */}
      <section className="py-16 px-4 sm:px-6 bg-[#6366F1]/5 border-y border-[#6366F1]/10">
        <div className="max-w-3xl mx-auto text-center">
          <MessageCircle className="h-10 w-10 text-[#6366F1] mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#18181B] mb-4">Vous avez découvert MakeItAds via une stratégie ?</h2>
          <p className="text-[#71717A] mb-6 leading-relaxed">
            La stratégie que vous venez de découvrir peut être réalisée plus rapidement et de manière structurée directement depuis la plateforme. 
            Au lieu de recommencer vos analyses manuellement, vous pouvez utiliser MakeItAds pour structurer vos prochaines stratégies et accéder à davantage d'outils d'analyse.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors shadow-sm shadow-[#6366F1]/25">
            Commencer avec MakeItAds <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 7. COMMENT ÇA FONCTIONNE */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#18181B] mb-12">Comment ça fonctionne ?</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-[#E7E7EB] -z-10" />
            {[
              { num: "01", title: "Définissez votre activité", desc: "Répondez à 7 questions simples sur votre offre et votre marché." },
              { num: "02", title: "MakeItAds analyse votre contexte", desc: "Notre moteur croise vos données avec les réalités du marché local." },
              { num: "03", title: "Obtenez votre stratégie exploitable", desc: "Recevez un plan d'action complet, prêt à être copié-collé." }
            ].map((step, i) => (
              <div key={i} className="relative bg-[#FFFFFF] p-4">
                <div className="w-16 h-16 rounded-full bg-[#F7F7F8] border border-[#E7E7EB] flex items-center justify-center mx-auto mb-4 text-lg font-bold text-[#6366F1]">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-[#18181B] mb-2">{step.title}</h3>
                <p className="text-sm text-[#71717A]">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-sm font-medium text-[#6366F1]">Moins de temps à chercher. Plus de temps à exécuter.</p>
        </div>
      </section>

      {/* 8. RÉASSURANCE */}
      <section className="py-12 px-4 sm:px-6 bg-[#F7F7F8] border-y border-[#E7E7EB]">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-[#71717A]">
          {["Stratégies structurées", "Analyse orientée décision", "Interface simple", "Résultats exploitables", "Pas besoin d'être expert"].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#18181B] mb-4">Questions fréquentes</h2>
            <p className="text-[#71717A]">Tout ce que vous devez savoir avant de commencer.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem 
                key={i} 
                question={faq.q} 
                answer={faq.a} 
                isOpen={openFaq === i} 
                onClick={() => setOpenFaq(openFaq === i ? null : i)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-[#F7F7F8]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-[#18181B] mb-4 leading-tight">
            Votre prochaine campagne mérite mieux qu'une stratégie improvisée.
          </h2>
          <p className="text-[#71717A] mb-8 max-w-xl mx-auto">
            Donnez à votre marketing une direction claire avant d'investir votre prochain budget publicitaire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing-cards" className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors shadow-sm shadow-[#6366F1]/25">
              Choisir mon offre
            </a>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-[#E7E7EB] bg-[#FFFFFF] px-6 py-3 text-sm font-semibold text-[#18181B] hover:bg-[#F7F7F8] transition-colors">
              Découvrir MakeItAds
            </Link>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}