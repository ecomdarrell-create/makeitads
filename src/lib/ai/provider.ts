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

const ExecutiveSummarySchema = z.object({
  synthese: z.string(),
  preparation: z.number().min(0).max(100),
  opportunite: z.enum(['Faible', 'Moyenne', 'Élevée']),
  risque_principal: z.string(),
  priorite: z.string(),
});

const InsightsSchema = z.array(z.object({ titre: z.string(), explication: z.string(), impact: z.string() })).min(3).max(5);
const PrioritiesSchema = z.array(z.object({ niveau: z.enum(['Priorité immédiate', 'À tester', 'À optimiser', 'À surveiller']), titre: z.string(), pourquoi: z.string(), action: z.string(), impact_attendu: z.string() })).min(3).max(4);

const ActionPlanSchema = z.object({
  phase_1: z.object({ titre: z.string(), duree: z.string(), actions: z.array(z.string()).min(2) }),
  phase_2: z.object({ titre: z.string(), duree: z.string(), actions: z.array(z.string()).min(2) }),
  phase_3: z.object({ titre: z.string(), duree: z.string(), actions: z.array(z.string()).min(2) }),
});

export const FlashDiagnosticSchema = z.object({
  salutation: z.string(),
  diagnostic: z.string(),
  avatar_client: z.string(),
  angle_publicitaire: z.string(),
  makeitads_teaser: z.string(),
});

export const ProCompleteSchema = z.object({
  salutation: z.string(),
  executive_summary: ExecutiveSummarySchema,
  insights: InsightsSchema,
  priorities: PrioritiesSchema,
  action_plan: ActionPlanSchema,
  analyse_marche: z.string(),
  ciblage_exact: z.object({ villes: z.array(z.string()), ages: z.string(), interets: z.array(z.string()), comportements: z.array(z.string()) }),
  scripts_whatsapp: z.array(z.string()).min(3),
  allocation_budget: z.string(),
  conseil_expert: z.string(),
  recommandations_plateforme: z.string(),
  guide_creatif: z.string(),
  kpis: z.array(z.object({ nom: z.string(), objectif: z.string(), pourquoi: z.string() })).min(3),
});

export const PremiumCompleteSchema = ProCompleteSchema.extend({
  analyse_concurrentielle: z.string(),
  hooks: z.array(z.string()).min(5),
  analyse_audience: z.string(),
  strategie_croissance: z.string(),
});

export const EliteCompleteSchema = PremiumCompleteSchema.extend({
  consulting_strategique: z.string(),
  formation_personnalisee: z.string(),
  accompagnement_avance: z.string(),
  rapports_whitelabel: z.string(),
});

export type FlashDiagnostic = z.infer<typeof FlashDiagnosticSchema>;
export type ProComplete = z.infer<typeof ProCompleteSchema>;
export type PremiumComplete = z.infer<typeof PremiumCompleteSchema>;
export type EliteComplete = z.infer<typeof EliteCompleteSchema>;

// ============================================
// RÈGLES DE STYLE (appliquées à tous les plans)
// ============================================
const STYLE_RULES = `
RÈGLES DE STYLE ABSOLUES :
1. Commence TOUJOURS ta réponse par le champ "salutation" qui salue l'utilisateur avec son prénom (fourni dans les données sous "userFirstName"). Exemple : "Bonjour Awa, voici ta stratégie."
2. N'utilise JAMAIS de tirets longs ni de tirets cadratins. Aucun "—" ou "–". Utilise des virgules, des deux-points ou des phrases séparées.
3. N'utilise JAMAIS de guillemets droits anglais. Si tu dois citer quelque chose, utilise les guillemets français « ».
4. N'utilise PAS d'astérisques pour le formatage Markdown. Exception : pour mettre un mot clé en gras, utilise **mot clé** (avec deux astérisques avant et après). Le système les convertira automatiquement en gras. N'abuse pas : 1 à 3 mots clés par paragraphe maximum.
5. N'utilise NI backticks, NI dièses (#), NI tirets de liste. Pour les listes, utilise uniquement des puces simples avec le caractère •
6. Aère ton texte : sépare tes idées par des sauts de ligne. Chaque paragraphe = une idée. Ne fais JAMAIS un bloc unique compact.
7. Ton direct, expert, chaleureux. Tutoie systématiquement l'utilisateur.
8. Pas de jargon marketing creux. Concret et actionnable.
9. Ne fabrique aucun chiffre de ventes, ROAS, taux de conversion ou résultat observé. Si une donnée manque, formule une hypothèse clairement signalée.
10. Réponds UNIQUEMENT en JSON valide. Aucun texte avant ni après. Aucun bloc markdown.`;

const FLASH_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds, spécialisé dans l'acquisition client en Afrique.
Génère un diagnostic flash percutant basé sur les données fournies.
${STYLE_RULES}

Structure JSON attendue :
{
  "salutation": "Bonjour [prénom], voici ton diagnostic.",
  "diagnostic": "3 phrases sur pourquoi le business stagne réellement. Utilise des sauts de ligne pour aérer.",
  "avatar_client": "Profil psycho-démographique de l'acheteur idéal (ville, âge, douleur principale). Aéré.",
  "angle_publicitaire": "1 concept de pub (hook + visuel) adapté au marché africain. Expliqué en paragraphes.",
  "makeitads_teaser": "2 à 3 phrases présentant sobrement ce que les plans payants débloquent. Crée une vraie envie sans survendre."
}

IMPORTANT : Pour un plan Démo, fournis un contenu suffisamment solide pour que l'utilisateur ait envie d'en savoir plus. Sois généreux en qualité, concis en quantité.`;

const PRO_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds. Génère une stratégie opérationnelle complète pour un entrepreneur solo.
${STYLE_RULES}

Structure JSON attendue :
{
  "salutation": "Bonjour [prénom], voici ta stratégie complète.",
  "executive_summary": { "synthese": "2-3 phrases percutantes", "preparation": 0-100, "opportunite": "Faible ou Moyenne ou Élevée", "risque_principal": "le risque n°1", "priorite": "l'action prioritaire n°1" },
  "insights": [{ "titre": "court", "explication": "1-2 phrases", "impact": "conséquence concrète" }],
  "priorities": [{ "niveau": "Priorité immédiate ou À tester ou À optimiser ou À surveiller", "titre": "titre", "pourquoi": "raison", "action": "action concrète", "impact_attendu": "résultat" }],
  "action_plan": { "phase_1": { "titre": "Préparation", "duree": "Jours 1-3", "actions": ["action 1", "action 2"] }, "phase_2": { "titre": "Lancement", "duree": "Jours 4-7", "actions": ["action 1", "action 2"] }, "phase_3": { "titre": "Optimisation", "duree": "Semaine 2", "actions": ["action 1", "action 2"] } },
  "analyse_marche": "Opportunités spécifiques. Aéré en paragraphes.",
  "ciblage_exact": { "villes": ["Ville 1", "Ville 2"], "ages": "tranche", "interets": ["intérêt 1", "intérêt 2"], "comportements": ["comportement 1", "comportement 2"] },
  "scripts_whatsapp": ["Script 1 : accueil et qualification", "Script 2 : relance après 24h", "Script 3 : closing Mobile Money"],
  "allocation_budget": "Répartition sur 7 jours en FCFA. Aéré.",
  "conseil_expert": "1 conseil concret pour maximiser le ROAS.",
  "recommandations_plateforme": "Plateforme à privilégier et pourquoi. Aéré.",
  "guide_creatif": "Idées concrètes de visuels et vidéos. Aéré.",
  "kpis": [{ "nom": "KPI", "objectif": "cible", "pourquoi": "raison" }]
}

Génère 3 à 5 insights, 3 à 4 priorités, un plan d'action sur 3 phases. Aère TOUS les textes longs en paragraphes séparés par des sauts de ligne.`;

const PREMIUM_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds. Génère une stratégie avancée pour un marketeur qui veut dominer sa niche.
${STYLE_RULES}

Utilise la même structure que pour le plan Pro, PLUS ces 4 champs additionnels :
{
  "analyse_concurrentielle": "Analyse des concurrents. Aéré en paragraphes.",
  "hooks": ["Hook 1 (douleur)", "Hook 2 (curiosité)", "Hook 3 (preuve sociale)", "Hook 4 (urgence)", "Hook 5 (transformation)"],
  "analyse_audience": "Comportements d'achat, objections, déclencheurs. Aéré.",
  "strategie_croissance": "Plan sur 3 mois avec jalons. Aéré."
}

Reprends TOUS les champs de Pro plus ces 4 champs. Aère tous les textes longs.`;

const ELITE_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds. Génère une stratégie complète de niveau agence.
${STYLE_RULES}

Utilise la même structure que pour le plan Premium, PLUS ces 4 champs additionnels :
{
  "consulting_strategique": "Recommandations personnalisées de niveau consulting.",
  "formation_personnalisee": "Plan de montée en compétences.",
  "accompagnement_avance": "Protocole de suivi mensuel.",
  "rapports_whitelabel": "Structure de rapport professionnel."
}

Reprends TOUS les champs de Premium plus ces 4 champs. Aère tous les textes longs.`;

export function getSystemPrompt(type: 'flash' | 'complete', plan: PlanTier = 'free'): string {
  if (type === 'flash') return FLASH_SYSTEM_PROMPT;
  switch (plan) {
    case 'pro': return PRO_SYSTEM_PROMPT;
    case 'premium': return PREMIUM_SYSTEM_PROMPT;
    case 'enterprise': return ELITE_SYSTEM_PROMPT;
    default: return PRO_SYSTEM_PROMPT;
  }
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
  console.log(`Appel IA: ${provider} (${model})`);

  let response: string;
  if (provider === 'groq') response = await callGroq(model, systemPrompt, userData, temperature, maxTokens);
  else if (provider === 'openai') response = await callOpenAI(model, systemPrompt, userData, temperature, maxTokens);
  else if (provider === 'anthropic') response = await callAnthropic(model, systemPrompt, userData, temperature, maxTokens);
  else if (provider === 'deepseek') response = await callDeepSeek(model, systemPrompt, userData, temperature, maxTokens);
  else throw new Error(`Provider IA non supporté: ${provider}`);

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
    throw new Error("Impossible de parser la réponse de l'IA");
  }
}

async function callGroq(model: string, systemPrompt: string, userData: unknown, temperature: number, maxTokens: number): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY non configurée');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: JSON.stringify(userData) }], response_format: { type: 'json_object' }, temperature, max_tokens: maxTokens }),
  });
  if (!response.ok) throw new Error("Erreur lors de l'appel à Groq");
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callOpenAI(model: string, systemPrompt: string, userData: unknown, temperature: number, maxTokens: number): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY non configurée');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: JSON.stringify(userData) }], response_format: { type: 'json_object' }, temperature, max_tokens: maxTokens }),
  });
  if (!response.ok) throw new Error("Erreur lors de l'appel à OpenAI");
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(model: string, systemPrompt: string, userData: unknown, temperature: number, maxTokens: number): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY non configurée');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, system: systemPrompt, messages: [{ role: 'user', content: JSON.stringify(userData) }], temperature, max_tokens: maxTokens }),
  });
  if (!response.ok) throw new Error(`Erreur lors de l'appel à Claude: ${response.status}`);
  const data = await response.json();
  return data.content[0].text;
}

async function callDeepSeek(model: string, systemPrompt: string, userData: unknown, temperature: number, maxTokens: number): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY non configurée.');
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: JSON.stringify(userData) }], response_format: { type: 'json_object' }, temperature, max_tokens: maxTokens }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erreur DeepSeek:', response.status, errorText);
    if (response.status === 401) throw new Error('Clé API DeepSeek invalide.');
    if (response.status === 402) throw new Error('Crédit DeepSeek épuisé.');
    if (response.status === 429) throw new Error('Trop de requêtes vers DeepSeek.');
    if (response.status >= 500) throw new Error('DeepSeek est temporairement indisponible.');
    throw new Error(`Erreur DeepSeek (${response.status})`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

function cleanJsonResponse(response: string): string {
  let cleaned = response.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  return cleaned.trim();
}