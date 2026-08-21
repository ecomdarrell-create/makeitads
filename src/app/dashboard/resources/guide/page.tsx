"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// ✅ DONNÉES INTÉGRÉES DIRECTEMENT POUR ÉVITER TOUTE ERREUR D'IMPORTATION
interface GuideStep {
  num: string;
  title: string;
  content: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    num: "01",
    title: "Comprendre les crédits",
    content: "Chez MakeItAds, 1 stratégie générée = 1 crédit consommé. Vous achetez des packs de crédits (Startup, Business ou Entreprise) via Mobile Money ou carte bancaire. Votre solde est visible en haut de votre Dashboard. Le crédit n'est débité qu'après une génération réussie.",
  },
  {
    num: "02",
    title: "Créer votre première stratégie",
    content: "Rendez-vous dans 'Nouvelle stratégie'. Le wizard vous guidera en 7 étapes : nom de l'entreprise, offre, audience, marché, objectif, concurrence et campagne. Plus vos réponses sont précises, plus la stratégie sera pertinente.",
  },
  {
    num: "03",
    title: "Comprendre le résultat",
    content: "Votre stratégie contient : un verdict clair, le canal recommandé, le ciblage détaillé, la structure de campagne, des angles publicitaires, des copies prêtes à l'emploi, des recommandations créatives et un plan de test budgétaire.",
  },
  {
    num: "04",
    title: "Passer à l'exécution",
    content: "Ne modifiez pas tout. Copiez les paramètres de ciblage et les textes fournis dans votre gestionnaire de publicités (Meta Ads Manager, TikTok Ads, etc.). Assurez-vous que votre page de destination (site ou WhatsApp) est prête à recevoir le trafic.",
  },
  {
    num: "05",
    title: "Tester avant de scaler",
    content: "Ne dépensez pas tout votre budget le premier jour. Lancez 2 à 3 variantes de créatifs sur l'angle prioritaire. Laissez l'algorithme apprendre pendant 3 à 5 jours avant de couper les sous-performants et d'augmenter le budget des gagnants.",
  },
  {
    num: "06",
    title: "Utiliser MakeItAds intelligemment",
    content: "MakeItAds est votre stratège, pas votre pilote automatique. Utilisez nos recommandations comme une base solide d'exécution, mais ajustez les détails (visuels, landing page) en fonction des retours réels de votre marché.",
  },
];

export default function GuidePage() {
  return (
    <div className="max-w-[760px] mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link href="/dashboard/resources" className="text-xs font-medium text-[#6366F1] hover:text-[#8B5CF6] flex items-center gap-1 mb-4">
          <ArrowRight className="h-3 w-3 rotate-180" /> Ressources
        </Link>
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
          Commencer avec MakeItAds
        </h1>
        <p className="text-[15px] text-[#71717A] mt-2">
          De votre première stratégie publicitaire au lancement de votre campagne.
        </p>
      </motion.div>

      <div className="space-y-6">
        {GUIDE_STEPS.map((step: GuideStep, i: number) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[14px] border border-[#E7E7EB] p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#6366F1]">{step.num}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#18181B] mb-2">{step.title}</h2>
                <p className="text-sm text-[#71717A] leading-relaxed">{step.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.4 }} 
        className="mt-8 flex flex-wrap gap-3"
      >
        <Link 
          href="/dashboard/strategies/new" 
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#6366F1] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors"
        >
          Créer ma première stratégie 
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link 
          href="/dashboard/resources/faq" 
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white border border-[#E7E7EB] text-sm font-semibold text-[#18181B] hover:bg-[#F7F7F8] transition-colors"
        >
          Consulter la FAQ
        </Link>
      </motion.div>
    </div>
  );
}