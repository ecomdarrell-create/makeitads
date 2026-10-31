import {
  Target,
  User,
  Lightbulb,
  BarChart3,
  MessageSquare,
  Wallet,
  Star,
  Layers,
  Palette,
  Activity,
  Swords,
  Zap,
  Users,
  TrendingUp,
  Briefcase,
  GraduationCap,
  LineChart,
  FileText,
  Network,
  Boxes,
  type LucideIcon,
} from "lucide-react";

export type PlanTier = "free" | "pro" | "premium" | "enterprise";

export interface SectionConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  minPlan: PlanTier;
  previewText: string;
}

const PLAN_HIERARCHY: PlanTier[] = ["free", "pro", "premium", "enterprise"];

export function planHasAccess(userPlan: PlanTier, requiredPlan: PlanTier): boolean {
  const userIndex = PLAN_HIERARCHY.indexOf(userPlan);
  const requiredIndex = PLAN_HIERARCHY.indexOf(requiredPlan);
  return userIndex >= requiredIndex;
}

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: "Démo",
  pro: "Pro",
  premium: "Premium",
  enterprise: "Élite",
};

export const FLASH_SECTIONS: SectionConfig[] = [
  {
    id: "diagnostic",
    title: "Diagnostic",
    icon: Target,
    minPlan: "free",
    previewText: "",
  },
  {
    id: "avatar_client",
    title: "Avatar client idéal",
    icon: User,
    minPlan: "free",
    previewText: "",
  },
  {
    id: "angle_publicitaire",
    title: "Angle publicitaire",
    icon: Lightbulb,
    minPlan: "free",
    previewText: "",
  },
];

export const COMPLETE_SECTIONS: SectionConfig[] = [
  // ─── Pro ───
  {
    id: "analyse_marche",
    title: "Analyse du marché",
    icon: BarChart3,
    minPlan: "pro",
    previewText:
      "Opportunités spécifiques à votre secteur et à votre zone géographique, tendances actuelles et positionnement optimal pour votre offre.",
  },
  {
    id: "ciblage_exact",
    title: "Ciblage exact",
    icon: Target,
    minPlan: "pro",
    previewText:
      "Villes prioritaires, tranches d'âge, centres d'intérêt et comportements d'achat pour atteindre précisément les bonnes personnes.",
  },
  // ✅ NOUVELLE SECTION : Segmentation (Pro)
  {
    id: "segmentation",
    title: "Segmentation précise de l'audience",
    icon: Network,
    minPlan: "pro",
    previewText:
      "Découpage précis de votre audience en segments distincts, avec pour chacun les villes, âges, intérêts, comportements et le budget conseillé au millimètre.",
  },
  {
    id: "scripts_whatsapp",
    title: "Scripts WhatsApp",
    icon: MessageSquare,
    minPlan: "pro",
    previewText:
      "Trois scripts prêts à copier-coller : accueil et qualification, relance après 24 heures, closing avec Mobile Money et garantie.",
  },
  {
    id: "allocation_budget",
    title: "Allocation budgétaire",
    icon: Wallet,
    minPlan: "pro",
    previewText:
      "Répartition détaillée de votre budget sur 7 jours, entre phase de test, optimisation et scaling.",
  },
  {
    id: "conseil_expert",
    title: "Conseil expert",
    icon: Star,
    minPlan: "pro",
    previewText:
      "Un conseil stratégique avancé pour maximiser le retour sur vos dépenses publicitaires.",
  },
  {
    id: "recommandations_plateforme",
    title: "Recommandations plateforme",
    icon: Layers,
    minPlan: "pro",
    previewText:
      "Les plateformes publicitaires à privilégier selon votre secteur et votre audience.",
  },
  {
    id: "guide_creatif",
    title: "Guide créatif",
    icon: Palette,
    minPlan: "pro",
    previewText:
      "Formats de visuels et vidéos à produire, angles créatifs, éléments à mettre en avant.",
  },
  {
    id: "kpis",
    title: "Indicateurs clés de performance",
    icon: Activity,
    minPlan: "pro",
    previewText:
      "Les indicateurs à suivre quotidiennement pour piloter votre campagne et détecter les dérives.",
  },

  // ─── Premium ───
  // ✅ NOUVELLE SECTION : Ensembles publicitaires (Premium)
  {
    id: "ad_sets",
    title: "Ensembles publicitaires détaillés",
    icon: Boxes,
    minPlan: "premium",
    previewText:
      "Structure complète de vos ensembles publicitaires : objectif, audience cible, budget journalier, créatives recommandées, placements et durée optimale. Au millimètre près.",
  },
  {
    id: "analyse_concurrentielle",
    title: "Analyse concurrentielle",
    icon: Swords,
    minPlan: "premium",
    previewText:
      "Ce que font vos concurrents directs, leurs angles publicitaires, leurs points faibles et comment vous démarquer.",
  },
  {
    id: "hooks",
    title: "Variantes de hooks",
    icon: Zap,
    minPlan: "premium",
    previewText:
      "Cinq accroches publicitaires testées, chacune construite sur un levier psychologique différent.",
  },
  {
    id: "analyse_audience",
    title: "Analyse d'audience approfondie",
    icon: Users,
    minPlan: "premium",
    previewText:
      "Comportements d'achat, objections fréquentes, déclencheurs de décision et moment optimal de contact.",
  },
  {
    id: "strategie_croissance",
    title: "Stratégie de croissance",
    icon: TrendingUp,
    minPlan: "premium",
    previewText:
      "Plan d'action complet sur trois mois avec jalons mensuels, objectifs chiffrés et étapes de scaling.",
  },

  // ─── Élite ───
  {
    id: "consulting_strategique",
    title: "Consulting stratégique",
    icon: Briefcase,
    minPlan: "enterprise",
    previewText:
      "Recommandations personnalisées de niveau consulting, adaptées à votre contexte d'équipe et à vos marchés multiples.",
  },
  {
    id: "formation_personnalisee",
    title: "Formation personnalisée",
    icon: GraduationCap,
    minPlan: "enterprise",
    previewText:
      "Plan de montée en compétences recommandé pour votre équipe ou pour vous-même.",
  },
  {
    id: "accompagnement_avance",
    title: "Accompagnement avancé",
    icon: LineChart,
    minPlan: "enterprise",
    previewText:
      "Protocole de suivi mensuel avec points de contrôle, ajustements stratégiques et validation des décisions clés.",
  },
  {
    id: "rapports_whitelabel",
    title: "Rapports white-label",
    icon: FileText,
    minPlan: "enterprise",
    previewText:
      "Structure de rapport professionnel avec métriques clés et narratif prêt à présenter à vos parties prenantes.",
  },
];

export function getSectionsForStrategy(
  strategyType: "flash" | "complete"
): SectionConfig[] {
  if (strategyType === "flash") {
    return [...FLASH_SECTIONS, ...COMPLETE_SECTIONS];
  }
  return COMPLETE_SECTIONS;
}

export function isSectionLocked(
  userPlan: PlanTier,
  section: SectionConfig
): boolean {
  return !planHasAccess(userPlan, section.minPlan);
}