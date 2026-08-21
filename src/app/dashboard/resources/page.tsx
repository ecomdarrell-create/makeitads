"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  Zap,
  Crown,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

// ✅ DONNÉES GARANTIES POUR ÉVITER LE VIDE
const RESOURCES = [
  {
    id: 1,
    slug: "lancer-premiere-campagne-meta",
    category: "ads",
    categoryLabel: "Stratégies Ads",
    title: "Comment lancer votre première campagne Meta Ads",
    description: "Les étapes essentielles pour transférer votre recommandation MakeItAds directement dans votre gestionnaire de publicités.",
    readTime: "6 min",
  },
  {
    id: 2,
    slug: "choisir-bon-angle-publicitaire",
    category: "creative",
    categoryLabel: "Créatifs",
    title: "Comment choisir le bon angle publicitaire",
    description: "Comprendre pourquoi plusieurs angles doivent être testés simultanément avant de scaler votre budget.",
    readTime: "5 min",
  },
  {
    id: 3,
    slug: "clics-eleves-peu-de-ventes",
    category: "campaigns",
    categoryLabel: "Campagnes",
    title: "Clics élevés, mais peu de ventes : que vérifier ?",
    description: "Les 3 points de friction principaux à auditer sur votre landing page avant d'augmenter vos dépenses.",
    readTime: "6 min",
  },
  {
    id: 4,
    slug: "tester-creatifs-intelligemment",
    category: "creative",
    categoryLabel: "Créatifs",
    title: "Tester plusieurs créatifs intelligemment",
    description: "Comment construire un véritable test A/B sans modifier plusieurs variables en même temps.",
    readTime: "5 min",
  },
  {
    id: 5,
    slug: "interpreter-premiers-resultats",
    category: "campaigns",
    categoryLabel: "Campagnes",
    title: "Interpréter les premiers résultats d'une campagne",
    description: "Les indicateurs clés à surveiller après 72h avant de décider de couper ou de poursuivre une campagne.",
    readTime: "7 min",
  },
];

const FAQ_TEASER = [
  {
    question: "Comment fonctionne un crédit ?",
    answer: "Un crédit vous permet de générer une stratégie publicitaire complète. Il n'est débité qu'après une génération réussie.",
  },
  {
    question: "Combien coûte une stratégie au final ?",
    answer: "Cela dépend de votre pack. Avec le pack Business à 7 500 FCFA pour 30 crédits, chaque stratégie vous revient à 250 FCFA.",
  },
  {
    question: "Comment utiliser les recommandations MakeItAds ?",
    answer: "Copiez simplement les textes et paramètres de ciblage générés et collez-les directement dans votre gestionnaire de publicités Meta ou TikTok.",
  },
];

const QUICK_ACCESS = [
  {
    title: "Guide de démarrage",
    subtitle: "Commencez ici",
    description: "Découvrez comment créer votre première stratégie et passer rapidement à l'exécution.",
    cta: "Ouvrir le guide",
    href: "/dashboard/resources/guide",
    icon: BookOpen,
    accent: "text-[#6366F1] bg-[#6366F1]/5",
  },
  {
    title: "Questions fréquentes",
    subtitle: "Besoin d'une réponse ?",
    description: "Retrouvez les réponses aux questions les plus fréquentes sur MakeItAds, les crédits et les stratégies.",
    cta: "Consulter la FAQ",
    href: "/dashboard/resources/faq",
    icon: HelpCircle,
    accent: "text-[#18181B] bg-[#F7F7F8]",
  },
  {
    title: "The Boardroom",
    subtitle: "Rejoindre la communauté",
    description: "La communauté privée MakeItAds pour échanger autour de l'acquisition et de vos campagnes.",
    cta: "Rejoindre Telegram",
    href: "https://t.me/MakeItAds_Pro",
    external: true,
    icon: Crown,
    accent: "text-amber-600 bg-amber-50",
  },
];

const CATEGORIES = [
  { id: "all", label: "Tout" },
  { id: "ads", label: "Stratégies Ads" },
  { id: "creative", label: "Créatifs" },
  { id: "targeting", label: "Ciblage" },
  { id: "campaigns", label: "Campagnes" },
  { id: "makeitads", label: "MakeItAds" },
];

function QuickAccessCard({ item }: { item: (typeof QUICK_ACCESS)[0] }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className="group block rounded-[14px] bg-white border border-[#E7E7EB] p-5 hover:border-[#6366F1]/30 hover:shadow-sm transition-all duration-200"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${item.accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-1">{item.subtitle}</p>
      <h3 className="text-base font-bold text-[#18181B] mb-2 group-hover:text-[#6366F1] transition-colors">{item.title}</h3>
      <p className="text-sm text-[#71717A] leading-relaxed mb-4">{item.description}</p>
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6366F1] group-hover:gap-1.5 transition-all">
        {item.cta} <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function ResourceCard({ resource }: { resource: (typeof RESOURCES)[0] }) {
  return (
    <Link
      href={`/dashboard/resources/articles/${resource.slug}`}
      className="group block rounded-[14px] bg-white border border-[#E7E7EB] p-5 hover:border-[#6366F1]/30 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="px-2 py-0.5 rounded-md bg-[#F7F7F8] border border-[#E7E7EB] text-[10px] font-bold text-[#71717A] uppercase tracking-wider">
          {resource.categoryLabel}
        </span>
        <span className="text-[10px] text-[#71717A] flex items-center gap-1">
          <BookOpen className="h-3 w-3" /> {resource.readTime}
        </span>
      </div>
      <h3 className="text-base font-bold text-[#18181B] mb-2 group-hover:text-[#6366F1] transition-colors leading-snug">
        {resource.title}
      </h3>
      <p className="text-sm text-[#71717A] leading-relaxed mb-4 line-clamp-2">{resource.description}</p>
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6366F1] group-hover:gap-1.5 transition-all">
        Lire l'article <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E7E7EB] last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left hover:bg-[#F7F7F8] transition-colors px-1 rounded-lg">
        <span className="text-sm font-semibold text-[#18181B] pr-4">{question}</span>
        <ChevronDown className={`h-4 w-4 text-[#71717A] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
        <p className="text-sm text-[#71717A] leading-relaxed pb-4 px-1">{answer}</p>
      </motion.div>
    </div>
  );
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const hasStrategy = false; 
  const latestStrategyName = "Naya Cosmetics — Meta Ads";

  const filteredResources = activeCategory === "all" ? RESOURCES : RESOURCES.filter((r) => r.category === activeCategory);

  return (
    <div className="max-w-[1180px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight">Ressources</h1>
        <p className="text-[15px] text-[#71717A] mt-1.5 max-w-2xl">Guides, réponses et ressources pour mieux exploiter vos stratégies publicitaires MakeItAds.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid md:grid-cols-3 gap-4 mb-10">
        {QUICK_ACCESS.map((item, i) => (<QuickAccessCard key={i} item={item} />))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
        {hasStrategy ? (
          <div className="rounded-[14px] bg-[#6366F1]/5 border border-[#6366F1]/15 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-[#6366F1]" />
              <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider">Votre prochaine étape</span>
            </div>
            <h2 className="text-xl font-bold text-[#18181B] mb-2">Vous avez généré votre stratégie « {latestStrategyName} ».</h2>
            <p className="text-sm text-[#71717A] mb-5 max-w-xl">Maintenant, préparez votre campagne. Suivez ce guide pour passer de la recommandation au lancement réel.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/strategies" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#6366F1] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors">
                Voir ma stratégie <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/dashboard/resources/guide" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-[#E7E7EB] text-sm font-semibold text-[#18181B] hover:bg-[#F7F7F8] transition-colors">
                Guide : passer au lancement
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-[14px] bg-[#F7F7F8] border border-[#E7E7EB] p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#18181B] mb-1">Vous n'avez pas encore créé de stratégie.</h2>
              <p className="text-sm text-[#71717A]">Commencez par générer votre première stratégie pour accéder aux guides d'exécution.</p>
            </div>
            <Link href="/dashboard/strategies/new" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#18181B] text-sm font-semibold text-white hover:bg-[#27272A] transition-colors flex-shrink-0">
              Créer ma première stratégie <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-12">
        <div className="mb-6">
          <h2 className="text-[24px] font-bold text-[#18181B] tracking-tight mb-1.5">Apprendre à mieux utiliser vos stratégies</h2>
          <p className="text-[15px] text-[#71717A]">Quelques ressources essentielles pour transformer une recommandation en campagne réellement exploitable.</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === cat.id ? "bg-[#18181B] text-white" : "bg-white border border-[#E7E7EB] text-[#71717A] hover:border-[#6366F1]/30 hover:text-[#18181B]"}`}>
              {cat.label}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (<ResourceCard key={resource.id} resource={resource} />))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#18181B]">Questions fréquentes</h2>
          <Link href="/dashboard/resources/faq" className="text-xs font-semibold text-[#6366F1] hover:text-[#8B5CF6] flex items-center gap-1">
            Voir toutes les questions <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="bg-white rounded-[14px] border border-[#E7E7EB] px-6">
          {FAQ_TEASER.map((item, i) => (<FaqItem key={i} question={item.question} answer={item.answer} />))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-[#F7F7F8] rounded-[14px] border border-[#E7E7EB] p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-[#18181B] mb-1">Vous ne trouvez pas votre réponse ?</h2>
          <p className="text-sm text-[#71717A] max-w-md">Notre centre d'aide couvre les questions les plus fréquentes. Si vous avez besoin d'une assistance supplémentaire, notre équipe est là pour vous.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <Link href="/dashboard/resources/faq" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-[#E7E7EB] text-sm font-semibold text-[#18181B] hover:bg-[#FFFFFF] hover:border-[#6366F1]/30 transition-colors">
            <HelpCircle className="h-4 w-4" /> Consulter la FAQ
          </Link>
          <a href="mailto:support@makeitads.pro" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#6366F1] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors">
            <MessageCircle className="h-4 w-4" /> Contacter le support
          </a>
        </div>
      </motion.div>
    </div>
  );
}