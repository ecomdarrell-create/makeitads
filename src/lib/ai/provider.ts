import { z } from 'zod';

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

export type PlanTier = 'free' | 'pro' | 'premium' | 'enterprise';

// ✅ HELPERS DE COERCITION
const coerceNumber = z.preprocess((v) => {
    if (typeof v === 'string') return parseFloat(v.replace(/[^\d.-]/g, '')) || 0;
    if (typeof v === 'number') return v;
    return 0;
  }, z.number());

const coerceStringArray = z.preprocess((v) => {
    if (Array.isArray(v)) return v.filter((x) => typeof x === 'string');
    if (typeof v === 'string') return v.split(/[,;•\n]/).map((s) => s.trim()).filter((s) => s.length > 0);
    return [];
  }, z.array(z.string()));

// ============================================
// SCHÉMAS
// ============================================

const ExecutiveSummarySchema = z.object({
  synthese: z.string().catch(''),
  preparation: coerceNumber,
  opportunite: z.enum(['Faible', 'Moyenne', 'Élevée']).catch('Moyenne'),
  risque_principal: z.string().catch(''),
  priorite: z.string().catch(''),
});

const InsightsSchema = z.array(z.object({
    titre: z.string().catch(''),
    explication: z.string().catch(''),
    impact: z.string().catch(''),
  })).catch([]);

const PrioritiesSchema = z.array(z.object({
    niveau: z.enum(['Priorité immédiate', 'À tester', 'À optimiser', 'À surveiller']).catch('À optimiser'),
    titre: z.string().catch(''),
    pourquoi: z.string().catch(''),
    action: z.string().catch(''),
    impact_attendu: z.string().catch(''),
  })).catch([]);

const ActionPlanSchema = z.object({
  phase_1: z.object({ titre: z.string().catch('Préparation'), duree: z.string().catch('Jours 1-3'), actions: coerceStringArray }).catch({ titre: 'Préparation', duree: 'Jours 1-3', actions: [] }),
  phase_2: z.object({ titre: z.string().catch('Lancement'), duree: z.string().catch('Jours 4-7'), actions: coerceStringArray }).catch({ titre: 'Lancement', duree: 'Jours 4-7', actions: [] }),
  phase_3: z.object({ titre: z.string().catch('Optimisation'), duree: z.string().catch('Semaine 2'), actions: coerceStringArray }).catch({ titre: 'Optimisation', duree: 'Semaine 2', actions: [] }),
});

const BudgetSchema = z.object({
  montant_total: coerceNumber,
  devise: z.string().catch('FCFA'),
  repartition: z.array(z.object({ poste: z.string().catch(''), pourcentage: coerceNumber, montant: coerceNumber })).catch([]),
  cpc_estime: coerceNumber,
  nombre_clics_estimes: coerceNumber,
  taux_conversion_estime: coerceNumber,
  ventes_estimees: coerceNumber,
  roas_estime: coerceNumber,
});

const CiblageExactSchema = z.object({
  villes: coerceStringArray,
  ages: z.string().catch(''),
  interets: coerceStringArray,
  comportements: coerceStringArray,
});

export const FlashDiagnosticSchema = z.object({
  salutation: z.string().catch('Bonjour !'),
  diagnostic: z.string().catch(''),
  avatar_client: z.string().catch(''),
  angle_publicitaire: z.string().catch(''),
  makeitads_teaser: z.string().catch(''),
  executive_summary: ExecutiveSummarySchema.optional(),
});

export const ProCompleteSchema = z.object({
  salutation: z.string().catch('Bonjour !'),
  executive_summary: ExecutiveSummarySchema,
  insights: InsightsSchema,
  priorities: PrioritiesSchema,
  action_plan: ActionPlanSchema,
  analyse_marche: z.string().catch(''),
  ciblage_exact: CiblageExactSchema,
  scripts_whatsapp: coerceStringArray,
  budget: BudgetSchema,
  allocation_budget: z.string().catch(''),
  conseil_expert: z.string().catch(''),
  recommandations_plateforme: z.string().catch(''),
  guide_creatif: z.string().catch(''),
  kpis: z.array(z.object({ nom: z.string().catch(''), objectif: z.string().catch(''), pourquoi: z.string().catch('') })).catch([]),
  avertissements: coerceStringArray,
});

export const PremiumCompleteSchema = ProCompleteSchema.extend({
  analyse_concurrentielle: z.string().catch(''),
  hooks: coerceStringArray,
  analyse_audience: z.string().catch(''),
  strategie_croissance: z.string().catch(''),
});

export const EliteCompleteSchema = PremiumCompleteSchema.extend({
  consulting_strategique: z.string().catch(''),
  formation_personnalisee: z.string().catch(''),
  accompagnement_avance: z.string().catch(''),
  rapports_whitelabel: z.string().catch(''),
});

// ✅ AJOUT CRUCIAL : Export des types pour StrategyResult.tsx
export type FlashDiagnostic = z.infer<typeof FlashDiagnosticSchema>;
export type ProComplete = z.infer<typeof ProCompleteSchema>;
export type PremiumComplete = z.infer<typeof PremiumCompleteSchema>;
export type EliteComplete = z.infer<typeof EliteCompleteSchema>;

// ============================================
// PROMPTS
// ============================================

const STYLE_RULES = `
RÈGLES DE STYLE ABSOLUES :
1. Commence TOUJOURS par le champ "salutation" avec le prénom (ex: "Bonjour Awa, voici ta stratégie.").
2. N'utilise JAMAIS de tirets longs ni de guillemets anglais. Utilise les guillemets français « ».
3. N'utilise PAS d'astérisques pour le formatage Markdown, sauf **mot clé** pour le gras.
4. Aère ton texte. Ton direct, expert, chaleureux. Tutoie l'utilisateur.
5. Pas de jargon marketing creux. Concret et actionnable.
6. Réponds UNIQUEMENT en JSON valide. Aucun texte avant ni après.

RÈGLES D'ANALYSE (TRÈS IMPORTANT) :
- Analyse la qualité des informations fournies par l'utilisateur.
- Si l'utilisateur a écrit du "n'importe quoi" ou des informations très vagues, le champ "diagnostic" ou "synthese" DOIT le dire clairement (ex: "Les informations fournies sont trop vagues pour établir un diagnostic précis...").
- Pour le champ "executive_summary.preparation" (score sur 100), calcule un score RÉEL entre 10 et 95 en fonction de la précision des infos fournies. Si l'entreprise est floue, mets un score bas (ex: 20). Si les infos sont détaillées, mets un score haut (ex: 85). Ne mets JAMAIS 50 par défaut.
- Si les données sont incohérentes, adapte la stratégie mais signale-le dans "avertissements".
`;

const FLASH_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds.
Génère un diagnostic flash percutant basé sur les données fournies.
${STYLE_RULES}

Structure JSON attendue :
{
  "salutation": "Bonjour [prénom], voici ton diagnostic.",
  "diagnostic": "3 phrases sur pourquoi le business stagne. Si c'est du grand n'importe quoi, dis-le.",
  "avatar_client": "Profil psycho-démographique de l'acheteur idéal.",
  "angle_publicitaire": "1 concept de pub (hook + visuel) adapté.",
  "makeitads_teaser": "2 phrases présentant les plans payants.",
  "executive_summary": {
    "synthese": "2 phrases percutantes",
    "preparation": 30, // ✅ Chiffre variable entre 10 et 95
    "opportunite": "Élevée",
    "risque_principal": "le risque n°1",
    "priorite": "l'action prioritaire n°1"
  }
}`;

const PRO_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds. Génère une stratégie opérationnelle complète.
${STYLE_RULES}

Structure JSON attendue (RESPECTE EXACTEMENT) :
{
  "salutation": "Bonjour [prénom], voici ta stratégie complète.",
  "executive_summary": {
    "synthese": "2-3 phrases percutantes",
    "preparation": 75, // ✅ Chiffre variable entre 10 et 95
    "opportunite": "Élevée",
    "risque_principal": "le risque n°1",
    "priorite": "l'action prioritaire n°1"
  },
  "insights": [{ "titre": "court", "explication": "1-2 phrases", "impact": "conséquence" }],
  "priorities": [{ "niveau": "Priorité immédiate", "titre": "titre", "pourquoi": "raison", "action": "action", "impact_attendu": "résultat" }],
  "action_plan": {
    "phase_1": { "titre": "Préparation", "duree": "Jours 1-3", "actions": ["action 1", "action 2"] },
    "phase_2": { "titre": "Lancement", "duree": "Jours 4-7", "actions": ["action 1", "action 2"] },
    "phase_3": { "titre": "Optimisation", "duree": "Semaine 2", "actions": ["action 1", "action 2"] }
  },
  "analyse_marche": "Opportunités spécifiques. Aéré.",
  "ciblage_exact": { "villes": ["Abidjan"], "ages": "25-45 ans", "interets": ["intérêt 1"], "comportements": ["comportement 1"] },
  "scripts_whatsapp": ["Script 1", "Script 2", "Script 3"],
  "budget": {
    "montant_total": 50000, "devise": "FCFA",
    "repartition": [{ "poste": "Meta Ads", "pourcentage": 60, "montant": 30000 }],
    "cpc_estime": 300, "nombre_clics_estimes": 100, "taux_conversion_estime": 8, "ventes_estimees": 8, "roas_estime": 2.5
  },
  "allocation_budget": "Répartition sur 7 jours.",
  "conseil_expert": "1 conseil concret.",
  "recommandations_plateforme": "Plateforme à privilégier.",
  "guide_creatif": "Idées concrètes de visuels.",
  "kpis": [{ "nom": "CPI", "objectif": "≤ 500 FCFA", "pourquoi": "raison" }],
  "avertissements": ["avertissement si nécessaire"]
}
⚠️ TOUS les nombres doivent être des nombres JSON, PAS des strings.`;

const PREMIUM_SYSTEM_PROMPT = PRO_SYSTEM_PROMPT + `
CHAMPS ADDITIONNELS : { "analyse_concurrentielle": "...", "hooks": ["..."], "analyse_audience": "...", "strategie_croissance": "..." }`;
const ELITE_SYSTEM_PROMPT = PREMIUM_SYSTEM_PROMPT + `
CHAMPS ADDITIONNELS ÉLITE : { "consulting_strategique": "...", "formation_personnalisee": "...", "accompagnement_avance": "...", "rapports_whitelabel": "..." }`;

function buildCurrencyContext(currency: string, symbol: string): string {
  return `\n⚠️ DEVISE : ${currency} (symbole : ${symbol}). Toutes les valeurs monétaires DOIVENT être dans cette devise.`;
}

export function getSystemPrompt(type: 'flash' | 'complete', plan: PlanTier = 'free', currency: string = 'XOF', currencySymbol: string = 'FCFA'): string {
  let basePrompt: string;
  if (type === 'flash') {
    basePrompt = FLASH_SYSTEM_PROMPT;
  } else {
    switch (plan) {
      case 'pro': basePrompt = PRO_SYSTEM_PROMPT; break;
      case 'premium': basePrompt = PREMIUM_SYSTEM_PROMPT; break;
      case 'enterprise': basePrompt = ELITE_SYSTEM_PROMPT; break;
      default: basePrompt = PRO_SYSTEM_PROMPT;
    }
  }
  return basePrompt + buildCurrencyContext(currency, currencySymbol);
}

export function getSchema(type: 'flash' | 'complete', plan: PlanTier = 'free'): z.ZodTypeAny {
  if (type === 'flash') return FlashDiagnosticSchema;
  switch (plan) {
    case 'pro': return ProCompleteSchema;
    case 'premium': return PremiumCompleteSchema;
    case 'enterprise': return EliteCompleteSchema;
    default: return ProCompleteSchema;
  }
}

export async function generateStrategy<T>(config: AIConfig, systemPrompt: string, userData: unknown, schema: z.ZodType<T>): Promise<T> {
  const { provider, model, temperature = 0.7, maxTokens = 8000 } = config;
  let response: string;
  if (provider === 'groq') response = await callGroq(model, systemPrompt, userData, temperature, maxTokens);
  else if (provider === 'openai') response = await callOpenAI(model, systemPrompt, userData, temperature, maxTokens);
  else if (provider === 'anthropic') response = await callAnthropic(model, systemPrompt, userData, temperature, maxTokens);
  else if (provider === 'deepseek') response = await callDeepSeek(model, systemPrompt, userData, temperature, maxTokens);
  else throw new Error(`Provider IA non supporté: ${provider}`);

  const cleanResponse = cleanJsonResponse(response);
  try {
    const parsed = JSON.parse(cleanResponse);
    const validated = schema.parse(parsed);
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) throw new Error("La réponse de l'IA ne correspond pas au schéma attendu");
    throw new Error("Impossible de parser la réponse de l'IA");
  }
}

async function callGroq(model: string, systemPrompt: string, userData: unknown, temperature: number, maxTokens: number): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY non configurée');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: JSON.stringify(userData) }], response_format: { type: 'json_object' }, temperature, max_tokens: maxTokens }),
  });
  if (!response.ok) throw new Error("Erreur Groq");
  return (await response.json()).choices[0].message.content;
}

async function callOpenAI(model: string, systemPrompt: string, userData: unknown, temperature: number, maxTokens: number): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY non configurée');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: JSON.stringify(userData) }], response_format: { type: 'json_object' }, temperature, max_tokens: maxTokens }),
  });
  if (!response.ok) throw new Error("Erreur OpenAI");
  return (await response.json()).choices[0].message.content;
}

async function callAnthropic(model: string, systemPrompt: string, userData: unknown, temperature: number, maxTokens: number): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY non configurée');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, system: systemPrompt, messages: [{ role: 'user', content: JSON.stringify(userData) }], temperature, max_tokens: maxTokens }),
  });
  if (!response.ok) throw new Error("Erreur Anthropic");
  return (await response.json()).content[0].text;
}

async function callDeepSeek(model: string, systemPrompt: string, userData: unknown, temperature: number, maxTokens: number): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY non configurée.');
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: JSON.stringify(userData) }], response_format: { type: 'json_object' }, temperature, max_tokens: maxTokens }),
  });
  if (!response.ok) throw new Error(`Erreur DeepSeek (${response.status})`);
  return (await response.json()).choices[0].message.content;
}

function cleanJsonResponse(response: string): string {
  let cleaned = response.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  return cleaned.trim();
}
