import { z } from 'zod';

// ============================================
// CONFIGURATION DES PROVIDERS
// ============================================
export type AIProvider = 'groq' | 'openai' | 'anthropic' | 'deepseek';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'deepseek',
  model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 8000,
};

// ============================================
// TYPES DE PLANS
// ============================================

export type PlanTier = 'free' | 'pro' | 'premium' | 'enterprise';

// ============================================
// SOUS-SCHÉMAS PARTAGÉS
// ============================================

const ExecutiveSummarySchema = z.object({
  synthese: z.string(),
  preparation: z.number().min(0).max(100),
  opportunite: z.enum(['Faible', 'Moyenne', 'Élevée']),
  risque_principal: z.string(),
  priorite: z.string(),
});

const InsightsSchema = z
  .array(
    z.object({
      titre: z.string(),
      explication: z.string(),
      impact: z.string(),
    })
  )
  .min(3)
  .max(5);

const PrioritiesSchema = z
  .array(
    z.object({
      niveau: z.enum([
        'Priorité immédiate',
        'À tester',
        'À optimiser',
        'À surveiller',
      ]),
      titre: z.string(),
      pourquoi: z.string(),
      action: z.string(),
      impact_attendu: z.string(),
    })
  )
  .min(3)
  .max(4);

const ActionPlanSchema = z.object({
  phase_1: z.object({
    titre: z.string(),
    duree: z.string(),
    actions: z.array(z.string()).min(2),
  }),
  phase_2: z.object({
    titre: z.string(),
    duree: z.string(),
    actions: z.array(z.string()).min(2),
  }),
  phase_3: z.object({
    titre: z.string(),
    duree: z.string(),
    actions: z.array(z.string()).min(2),
  }),
});

// ============================================
// SCHÉMAS DE VALIDATION ZOD
// ============================================

// ─── FLASH (Free — 4 champs) ───
export const FlashDiagnosticSchema = z.object({
  diagnostic: z.string(),
  avatar_client: z.string(),
  angle_publicitaire: z.string(),
  makeitads_teaser: z.string(),
});

// ─── COMPLETE PRO (12 champs) ───
export const ProCompleteSchema = z.object({
  executive_summary: ExecutiveSummarySchema,
  insights: InsightsSchema,
  priorities: PrioritiesSchema,
  action_plan: ActionPlanSchema,

  analyse_marche: z.string(),
  ciblage_exact: z.object({
    villes: z.array(z.string()),
    ages: z.string(),
    interets: z.array(z.string()),
    comportements: z.array(z.string()),
  }),
  scripts_whatsapp: z.array(z.string()).min(3),
  allocation_budget: z.string(),
  conseil_expert: z.string(),
  recommandations_plateforme: z.string(),
  guide_creatif: z.string(),
  kpis: z
    .array(
      z.object({
        nom: z.string(),
        objectif: z.string(),
        pourquoi: z.string(),
      })
    )
    .min(3),
});

// ─── COMPLETE PREMIUM (16 champs = Pro + 4) ───
export const PremiumCompleteSchema = ProCompleteSchema.extend({
  analyse_concurrentielle: z.string(),
  hooks: z.array(z.string()).min(5),
  analyse_audience: z.string(),
  strategie_croissance: z.string(),
});

// ─── COMPLETE ÉLITE (20 champs = Premium + 4) ───
export const EliteCompleteSchema = PremiumCompleteSchema.extend({
  consulting_strategique: z.string(),
  formation_personnalisee: z.string(),
  accompagnement_avance: z.string(),
  rapports_whitelabel: z.string(),
});

// ============================================
// TYPES INFÉRÉS
// ============================================

export type FlashDiagnostic = z.infer<typeof FlashDiagnosticSchema>;
export type ProComplete = z.infer<typeof ProCompleteSchema>;
export type PremiumComplete = z.infer<typeof PremiumCompleteSchema>;
export type EliteComplete = z.infer<typeof EliteCompleteSchema>;

// ============================================
// BLOCS DE PROMPTS PARTAGÉS
// ============================================

const COMMON_RULES = `
RÈGLES GÉNÉRALES :
- Ton direct, expert, sans jargon marketing creux.
- Intègre les réalités du marché africain : WhatsApp dominant, Mobile Money (Wave, Orange Money, MTN Moov), confiance locale.
- Aucune donnée fabriquée. Si une information manque, formule une hypothèse clairement signalée.
- Réponds UNIQUEMENT en JSON valide. Aucun texte avant ni après. Aucun bloc markdown.`;

const EXECUTIVE_SUMMARY_BLOCK = `"executive_summary": {
    "synthese": "Synthèse de la stratégie en 2 à 3 phrases percutantes",
    "preparation": 0,
    "opportunite": "Faible | Moyenne | Élevée",
    "risque_principal": "Le risque numéro un identifié pour cette campagne",
    "priorite": "L'action prioritaire numéro un à mener immédiatement"
  }`;

const INSIGHTS_BLOCK = `"insights": [
    {
      "titre": "Titre court de l'enseignement",
      "explication": "Explication concise en 1 à 2 phrases",
      "impact": "Conséquence concrète sur le business si rien n'est fait"
    }
  ]`;

const PRIORITIES_BLOCK = `"priorities": [
    {
      "niveau": "Priorité immédiate | À tester | À optimiser | À surveiller",
      "titre": "Titre de la recommandation",
      "pourquoi": "Raison stratégique de cette recommandation",
      "action": "Action concrète à mener",
      "impact_attendu": "Résultat attendu une fois appliquée"
    }
  ]`;

const ACTION_PLAN_BLOCK = `"action_plan": {
    "phase_1": {
      "titre": "Préparation",
      "duree": "Ex : Jours 1-3",
      "actions": ["Action 1", "Action 2", "Action 3"]
    },
    "phase_2": {
      "titre": "Lancement",
      "duree": "Ex : Jours 4-7",
      "actions": ["Action 1", "Action 2"]
    },
    "phase_3": {
      "titre": "Optimisation",
      "duree": "Ex : Semaine 2",
      "actions": ["Action 1", "Action 2"]
    }
  }`;

// ============================================
// PROMPTS SYSTÈME
// ============================================

// ─── PROMPT FLASH (Free) ───
const FLASH_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds, spécialisé dans l'acquisition client en Afrique.
Génère un diagnostic flash percutant basé sur les données fournies.
${COMMON_RULES}

Structure JSON attendue :
{
  "diagnostic": "3 phrases sur pourquoi le business stagne réellement",
  "avatar_client": "Profil psycho-démographique de l'acheteur idéal (ville, âge, douleur principale)",
  "angle_publicitaire": "1 concept de pub (hook + visuel) adapté au marché africain",
  "makeitads_teaser": "2 phrases présentant sobrement ce que les plans payants débloquent"
}`;

// ─── PROMPT COMPLETE PRO (12 champs) ───
const PRO_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds. Génère une stratégie opérationnelle pour un entrepreneur solo qui veut lancer sa première campagne rentable.
${COMMON_RULES}

Structure JSON attendue :
{
  ${EXECUTIVE_SUMMARY_BLOCK},
  ${INSIGHTS_BLOCK},
  ${PRIORITIES_BLOCK},
  ${ACTION_PLAN_BLOCK},
  "analyse_marche": "Opportunités spécifiques au secteur et à la zone géographique fournie",
  "ciblage_exact": {
    "villes": ["Ville 1", "Ville 2"],
    "ages": "Tranche d'âge précise",
    "interets": ["Intérêt 1", "Intérêt 2", "Intérêt 3"],
    "comportements": ["Comportement 1", "Comportement 2"]
  },
  "scripts_whatsapp": [
    "Script 1 : Accueil + qualification (naturel, sans excès d'emojis)",
    "Script 2 : Relance après 24h avec urgence maîtrisée",
    "Script 3 : Closing avec Mobile Money et garantie"
  ],
  "allocation_budget": "Répartition détaillée sur 7 jours (test, optimisation, scale) avec montants en FCFA",
  "conseil_expert": "1 conseil concret pour maximiser le ROAS",
  "recommandations_plateforme": "Quelle plateforme privilégier (Meta, TikTok, etc.) et pourquoi",
  "guide_creatif": "Idées concrètes de visuels/vidéos à produire (format, angle, contenu)",
  "kpis": [
    { "nom": "Nom du KPI", "objectif": "Valeur cible", "pourquoi": "Pourquoi ce KPI compte" }
  ]
}

Génère 3 à 5 insights, 3 à 4 priorités, et un plan d'action sur 3 phases.`;

// ─── PROMPT COMPLETE PREMIUM (16 champs) ───
const PREMIUM_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds. Génère une stratégie avancée pour un marketeur sérieux qui veut dominer sa niche et dépasser ses concurrents.
${COMMON_RULES}

Structure JSON attendue :
{
  ${EXECUTIVE_SUMMARY_BLOCK},
  ${INSIGHTS_BLOCK},
  ${PRIORITIES_BLOCK},
  ${ACTION_PLAN_BLOCK},
  "analyse_marche": "Opportunités et menaces spécifiques au secteur et à la zone",
  "ciblage_exact": {
    "villes": ["Ville 1", "Ville 2"],
    "ages": "Tranche d'âge précise",
    "interets": ["Intérêt 1", "Intérêt 2", "Intérêt 3"],
    "comportements": ["Comportement 1", "Comportement 2"]
  },
  "scripts_whatsapp": [
    "Script 1 : Accueil + qualification",
    "Script 2 : Relance 24h",
    "Script 3 : Closing Mobile Money"
  ],
  "allocation_budget": "Répartition détaillée sur 7 jours avec montants en FCFA",
  "conseil_expert": "1 conseil avancé pour maximiser le ROAS",
  "recommandations_plateforme": "Plateformes à privilégier et justification",
  "guide_creatif": "Plan créatif concret (formats, angles, contenus)",
  "kpis": [
    { "nom": "Nom", "objectif": "Cible", "pourquoi": "Raison" }
  ],
  "analyse_concurrentielle": "Ce que font les concurrents identifiés, leurs angles, leurs angles morts, comment s'en démarquer",
  "hooks": [
    "Hook 1 : accroche orientée douleur",
    "Hook 2 : accroche orientée curiosité",
    "Hook 3 : accroche orientée preuve sociale",
    "Hook 4 : accroche orientée urgence",
    "Hook 5 : accroche orientée transformation"
  ],
  "analyse_audience": "Comportements d'achat, objections fréquentes, déclencheurs d'achat, moment optimal de contact",
  "strategie_croissance": "Plan d'action sur 3 mois avec jalons mensuels, objectifs chiffrés et étapes de scaling"
}

Génère 4 à 5 insights, 4 priorités, et un plan d'action détaillé.`;

// ─── PROMPT COMPLETE ÉLITE (20 champs) ───
const ELITE_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds. Génère une stratégie complète de niveau agence pour un business en croissance rapide ou une équipe marketing.
${COMMON_RULES}

Structure JSON attendue :
{
  ${EXECUTIVE_SUMMARY_BLOCK},
  ${INSIGHTS_BLOCK},
  ${PRIORITIES_BLOCK},
  ${ACTION_PLAN_BLOCK},
  "analyse_marche": "Analyse détaillée du marché, des tendances et des opportunités",
  "ciblage_exact": {
    "villes": ["Ville 1", "Ville 2"],
    "ages": "Tranche précise",
    "interets": ["Intérêt 1", "Intérêt 2", "Intérêt 3"],
    "comportements": ["Comportement 1", "Comportement 2"]
  },
  "scripts_whatsapp": [
    "Script 1 : Accueil + qualification",
    "Script 2 : Relance 24h",
    "Script 3 : Closing Mobile Money"
  ],
  "allocation_budget": "Répartition détaillée multi-canal avec montants en FCFA",
  "conseil_expert": "Conseil stratégique avancé",
  "recommandations_plateforme": "Mix plateformes optimal avec pondération",
  "guide_creatif": "Plan créatif complet avec production recommandée",
  "kpis": [
    { "nom": "Nom", "objectif": "Cible", "pourquoi": "Raison" }
  ],
  "analyse_concurrentielle": "Analyse concurrentielle approfondie avec positionnement différenciant",
  "hooks": [
    "Hook 1", "Hook 2", "Hook 3", "Hook 4", "Hook 5"
  ],
  "analyse_audience": "Segmentation avancée avec personas et motivations profondes",
  "strategie_croissance": "Plan de croissance sur 3 mois avec jalons mensuels et scénarios de scaling",
  "consulting_strategique": "Recommandations personnalisées de niveau consulting basées sur le contexte business",
  "formation_personnalisee": "Plan de montée en compétences recommandé pour l'équipe ou le fondateur",
  "accompagnement_avance": "Protocole de suivi mensuel avec points de contrôle et ajustements",
  "rapports_whitelabel": "Structure de rapport professionnel avec métriques clés et narratif à présenter aux parties prenantes"
}

Génère 5 insights, 4 priorités, et un plan d'action complet.`;

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

export function getSystemPrompt(
  type: 'flash' | 'complete',
  plan: PlanTier = 'free'
): string {
  if (type === 'flash') return FLASH_SYSTEM_PROMPT;

  switch (plan) {
    case 'pro':
      return PRO_SYSTEM_PROMPT;
    case 'premium':
      return PREMIUM_SYSTEM_PROMPT;
    case 'enterprise':
      return ELITE_SYSTEM_PROMPT;
    default:
      return PRO_SYSTEM_PROMPT;
  }
}

export function getSchema(
  type: 'flash' | 'complete',
  plan: PlanTier = 'free'
): z.ZodTypeAny {
  if (type === 'flash') return FlashDiagnosticSchema;

  switch (plan) {
    case 'pro':
      return ProCompleteSchema;
    case 'premium':
      return PremiumCompleteSchema;
    case 'enterprise':
      return EliteCompleteSchema;
    default:
      return ProCompleteSchema;
  }
}

// ============================================
// FONCTION PRINCIPALE D'APPEL IA
// ============================================

export async function generateStrategy<T>(
  config: AIConfig,
  systemPrompt: string,
  userData: unknown,
  schema: z.ZodType<T>
): Promise<T> {
  const { provider, model, temperature = 0.7, maxTokens = 8000 } = config;

  console.log(`Appel IA: ${provider} (${model})`);

  let response: string;

  if (provider === 'groq') {
    response = await callGroq(model, systemPrompt, userData, temperature, maxTokens);
  } else if (provider === 'openai') {
    response = await callOpenAI(model, systemPrompt, userData, temperature, maxTokens);
  } else if (provider === 'anthropic') {
    response = await callAnthropic(model, systemPrompt, userData, temperature, maxTokens);
  } else if (provider === 'deepseek') {
    response = await callDeepSeek(model, systemPrompt, userData, temperature, maxTokens);
  } else {
    throw new Error(`Provider IA non supporté: ${provider}`);
  }

  console.log('Réponse IA reçue, parsing...');

  const cleanResponse = cleanJsonResponse(response);

  try {
    const parsed = JSON.parse(cleanResponse);
    const validated = schema.parse(parsed);
    console.log('Validation Zod réussie');
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erreur de validation Zod:', error.issues);
      throw new Error("La réponse de l'IA ne correspond pas au schéma attendu");
    }
    console.error('Erreur de parsing JSON:', error);
    console.error('Réponse brute:', response.substring(0, 500));
    throw new Error("Impossible de parser la réponse de l'IA");
  }
}

// ============================================
// APPELS AUX PROVIDERS
// ============================================

async function callGroq(
  model: string,
  systemPrompt: string,
  userData: unknown,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY non configurée');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(userData) },
      ],
      response_format: { type: 'json_object' },
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'appel à Groq");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callOpenAI(
  model: string,
  systemPrompt: string,
  userData: unknown,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY non configurée');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(userData) },
      ],
      response_format: { type: 'json_object' },
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'appel à OpenAI");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(
  model: string,
  systemPrompt: string,
  userData: unknown,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY non configurée');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: [{ role: 'user', content: JSON.stringify(userData) }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'appel à Claude: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callDeepSeek(
  model: string,
  systemPrompt: string,
  userData: unknown,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY non configurée. Ajoute-la dans ton .env.local.');
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(userData) },
      ],
      response_format: { type: 'json_object' },
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erreur DeepSeek:', response.status, errorText);

    if (response.status === 401) throw new Error('Clé API DeepSeek invalide.');
    if (response.status === 402) throw new Error('Crédit DeepSeek épuisé.');
    if (response.status === 429) throw new Error('Trop de requêtes vers DeepSeek. Réessaie.');
    if (response.status >= 500) throw new Error('DeepSeek est temporairement indisponible.');

    throw new Error(`Erreur DeepSeek (${response.status})`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ============================================
// UTILITAIRES
// ============================================

function cleanJsonResponse(response: string): string {
  let cleaned = response.trim();

  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }

  return cleaned.trim();
}