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
  type LucideIcon,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

export type PlanTier = "free" | "pro" | "premium" | "enterprise";

export interface SectionConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  minPlan: PlanTier;
  previewText: string;
}

// ============================================
// HIÉRARCHIE DES PLANS
// ============================================

const PLAN_HIERARCHY: PlanTier[] = ["free", "pro", "premium", "enterprise"];

export function planHasAccess(userPlan: PlanTier, requiredPlan: PlanTier): boolean {
  const userIndex = PLAN_HIERARCHY.indexOf(userPlan);
  const requiredIndex = PLAN_HIERARCHY.indexOf(requiredPlan);
  return userIndex >= requiredIndex;
}

// ============================================
// LABELS COMMERCIAUX
// ============================================

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: "Démo",
  pro: "Pro",
  premium: "Premium",
  enterprise: "Élite",
};

// ============================================
// SECTIONS FLASH (plan Démo)
// ============================================

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

// ============================================
// SECTIONS COMPLETE (Pro → Élite)
// ============================================

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
      "Villes prioritaires, tranches d'âge, centres d'intérêt et comportements d'achat pour atteindre précisément les bonnes personnes et maximiser chaque unité investie.",
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
      "Répartition détaillée de votre budget sur 7 jours, entre phase de test, optimisation et scaling, avec montants adaptés à votre devise.",
  },
  {
    id: "conseil_expert",
    title: "Conseil expert",
    icon: Star,
    minPlan: "pro",
    previewText:
      "Un conseil stratégique avancé pour maximiser le retour sur vos dépenses publicitaires et accélérer votre rentabilité.",
  },
  {
    id: "recommandations_plateforme",
    title: "Recommandations plateforme",
    icon: Layers,
    minPlan: "pro",
    previewText:
      "Les plateformes publicitaires à privilégier selon votre secteur et votre audience, avec justification stratégique pour chacune.",
  },
  {
    id: "guide_creatif",
    title: "Guide créatif",
    icon: Palette,
    minPlan: "pro",
    previewText:
      "Formats de visuels et vidéos à produire, angles créatifs, éléments à mettre en avant et pièges à éviter.",
  },
  {
    id: "kpis",
    title: "Indicateurs clés de performance",
    icon: Activity,
    minPlan: "pro",
    previewText:
      "Les indicateurs à suivre quotidiennement pour piloter votre campagne et détecter rapidement les dérives.",
  },

  // ─── Premium ───
  {
    id: "analyse_concurrentielle",
    title: "Analyse concurrentielle",
    icon: Swords,
    minPlan: "premium",
    previewText:
      "Ce que font vos concurrents directs, leurs angles publicitaires, leurs points faibles et comment vous démarquer durablement sur votre marché.",
  },
  {
    id: "hooks",
    title: "Variantes de hooks",
    icon: Zap,
    minPlan: "premium",
    previewText:
      "Cinq accroches publicitaires testées, chacune construite sur un levier psychologique différent, pour identifier celle qui convertit le mieux pour votre audience.",
  },
  {
    id: "analyse_audience",
    title: "Analyse d'audience approfondie",
    icon: Users,
    minPlan: "premium",
    previewText:
      "Comportements d'achat, objections fréquentes, déclencheurs de décision et moment optimal de contact pour chaque segment.",
  },
  {
    id: "strategie_croissance",
    title: "Stratégie de croissance",
    icon: TrendingUp,
    minPlan: "premium",
    previewText:
      "Plan d'action complet sur trois mois avec jalons mensuels, objectifs chiffrés et étapes de scaling pour structurer votre expansion.",
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
      "Plan de montée en compétences recommandé pour votre équipe ou pour vous-même, structuré sur plusieurs semaines.",
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
      "Structure de rapport professionnel avec métriques clés et narratif prêt à présenter à vos parties prenantes, personnalisable à votre marque.",
  },
];

// ============================================
// HELPERS
// ============================================

/**
 * Retourne toutes les sections à afficher selon le type de stratégie.
 * Pour un Flash : les 3 sections Flash + toutes les sections Complete (verrouillées).
 * Pour une Complete : uniquement les sections Complete.
 */
export function getSectionsForStrategy(
  strategyType: "flash" | "complete"
): SectionConfig[] {
  if (strategyType === "flash") {
    return [...FLASH_SECTIONS, ...COMPLETE_SECTIONS];
  }
  return COMPLETE_SECTIONS;
}

/**
 * Vérifie si une section doit être verrouillée pour un plan donné.
 */
export function isSectionLocked(
  userPlan: PlanTier,
  section: SectionConfig
): boolean {
  return !planHasAccess(userPlan, section.minPlan);
}