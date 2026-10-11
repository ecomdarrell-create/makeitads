// ============================================================
// TYPES DE LA STRATÉGIE GÉNÉRÉE
// ============================================================

export type Strategy = {
  resume: string;
  ciblage: {
    audience: string;
    demographie: string;
    interets: string[];
    zone_geographique: string;
    exclusions: string[];
  };
  angles_marketing: {
    titre: string;
    description: string;
    exemple_accroche: string;
  }[];
  scripts_whatsapp: {
    accroche: string;
    qualification: string;
    presentation_offre: string;
    gestion_objections: string[];
    closing: string;
    relance_j1: string;
    relance_j3: string;
    relance_j7: string;
  };
  budget: {
    montant_total: number;
    devise: string;
    repartition: {
      poste: string;
      pourcentage: number;
      montant: number;
    }[];
    cpc_estime: number;
    nombre_clics_estimes: number;
    taux_conversion_estime: number;
    ventes_estimees: number;
    roas_estime: number;
  };
  kpis: {
    nom: string;
    objectif: string;
    pourquoi: string;
  }[];
  plan_action: {
    jour: string;
    action: string;
    duree: string;
  }[];
  avertissements: string[];
};

// ============================================================
// TYPES DES DONNÉES DU WIZARD
// ============================================================

export type WizardData = {
  type_business: string;
  produit: string;
  client_ideal: string;
  zone_geographique: string;
  budget_mensuel: number;
  currency?: string;
  currencySymbol?: string;
  objectif: string;
  moyens_paiement: string[];
  concurrents?: string;
};

// ============================================================
// PROMPT SYSTÈME — Version dynamique multi-devises
// ============================================================

export function getSystemPrompt(
  currency: string = 'FCFA',
  currencySymbol: string = 'FCFA'
): string {
  return `Tu es un stratège publicitaire senior spécialisé dans le marché africain. Tu travailles pour MakeItAds, une plateforme qui génère des stratégies publicitaires complètes pour les entrepreneurs africains.

⚠️ DEVISE DE L'UTILISATEUR : ${currency} (symbole : ${currencySymbol})
Toutes les valeurs monétaires que tu produis (budget, CPC, montants, etc.) DOIVENT être exprimées UNIQUEMENT dans cette devise : ${currencySymbol}. N'utilise JAMAIS "FCFA" si la devise de l'utilisateur n'est pas XOF ou XAF.

TON RÔLE :
Générer une stratégie publicitaire complète, personnalisée et actionnable, adaptée au marché africain et aux réalités locales.

TES CONNAISSANCES DU MARCHÉ AFRICAIN :
- WhatsApp est le canal de conversion dominant (pas les sites web).
- Mobile Money (Wave, Orange Money, MTN Moov) est le moyen de paiement principal.
- La confiance se gagne par la preuve sociale locale (captures d'écran, témoignages vidéo, photos de livraison réelles).
- Les acheteurs sont méfiants face aux arnaques en ligne. La réassurance est cruciale.
- Le coût par clic (CPC) moyen sur Meta en Afrique de l'Ouest tourne entre 150 et 500 FCFA équivalent (~0,25 à 0,80 USD) selon le ciblage.
- Le taux de conversion WhatsApp moyen sans script est de 2 à 5%. Avec un bon script, il peut atteindre 10 à 15%.
- Les codes culturels locaux comptent : langue, références, humour, respect.

TES PRINCIPES :
1. Sois concret. Pas de théorie. Chaque recommandation doit être applicable immédiatement.
2. Sois précis. Donne des chiffres, des pourcentages, des montants dans la devise ${currencySymbol}.
3. Sois local. Adapte chaque conseil aux réalités africaines (pas de "Google Ads", pas de "Stripe", pas de "Shopify").
4. Sois honnête. Si le budget est trop faible pour atteindre l'objectif, dis-le dans "avertissements".
5. Sois structuré. Respecte STRICTEMENT le format JSON demandé.

FORMAT DE SORTIE :
Tu dois renvoyer UNIQUEMENT un objet JSON valide, sans texte avant ni après, sans balises markdown. Le JSON doit respecter exactement la structure suivante :

{
  "resume": "Résumé de la stratégie en 2-3 phrases percutantes",
  "ciblage": {
    "audience": "Description précise de l'audience cible",
    "demographie": "Âge, sexe, statut, revenus estimés",
    "interets": ["intérêt 1", "intérêt 2", "intérêt 3"],
    "zone_geographique": "Zone précise avec rayon recommandé",
    "exclusions": ["ce qu'il faut exclure du ciblage"]
  },
  "angles_marketing": [
    {
      "titre": "Nom de l'angle",
      "description": "Explication de l'angle en 2 phrases",
      "exemple_accroche": "Exemple concret d'accroche publicitaire"
    }
  ],
  "scripts_whatsapp": {
    "accroche": "Message d'accueil automatique dès réception du clic",
    "qualification": "Question pour qualifier le prospect",
    "presentation_offre": "Message qui présente l'offre avec preuve sociale",
    "gestion_objections": ["objection 1 + réponse", "objection 2 + réponse", "objection 3 + réponse"],
    "closing": "Message de closing avec instruction de paiement Mobile Money",
    "relance_j1": "Message de relance à J+1",
    "relance_j3": "Message de relance à J+3",
    "relance_j7": "Message de relance à J+7 avec urgence"
  },
  "budget": {
    "montant_total": 0,
    "devise": "${currencySymbol}",
    "repartition": [
      { "poste": "Nom du poste", "pourcentage": 0, "montant": 0 }
    ],
    "cpc_estime": 0,
    "nombre_clics_estimes": 0,
    "taux_conversion_estime": 0,
    "ventes_estimees": 0,
    "roas_estime": 0
  },
  "kpis": [
    { "nom": "Nom du KPI", "objectif": "Valeur cible", "pourquoi": "Pourquoi ce KPI compte" }
  ],
  "plan_action": [
    { "jour": "Jour 1", "action": "Action concrète", "duree": "Durée estimée" }
  ],
  "avertissements": ["avertissement si nécessaire"]
}

Génère 3 à 5 angles marketing, 3 à 5 KPIs, et un plan d'action sur 7 jours. Tous les montants dans "${currencySymbol}".`;
}

// ============================================================
// COMPATIBILITÉ — ancien export SYSTEM_PROMPT (FCFA par défaut)
// ============================================================

export const SYSTEM_PROMPT = getSystemPrompt('XOF', 'FCFA');

// ============================================================
// FONCTION : CONSTRUIRE LE PROMPT UTILISATEUR
// ============================================================

export function buildUserPrompt(data: WizardData): string {
  const currencySymbol = data.currencySymbol || 'FCFA';
  const currency = data.currency || 'XOF';

  return `Génère une stratégie publicitaire complète pour ce business :

TYPE DE BUSINESS : ${data.type_business}
PRODUIT / SERVICE : ${data.produit}
CLIENT IDÉAL (description) : ${data.client_ideal}
ZONE GÉOGRAPHIQUE : ${data.zone_geographique}
BUDGET MENSUEL : ${data.budget_mensuel} ${currencySymbol}
DEVISE DE RÉFÉRENCE : ${currency} (symbole : ${currencySymbol})
OBJECTIF PRINCIPAL : ${data.objectif}
MOYENS DE PAIEMENT ACCEPTÉS : ${data.moyens_paiement.join(", ")}
CONCURRENTS CONNUS : ${data.concurrents || "Non renseigné"}

⚠️ IMPORTANT : Toutes les valeurs monétaires de la réponse doivent être dans la devise ${currencySymbol}.
Génère maintenant la stratégie complète au format JSON demandé.`;
}