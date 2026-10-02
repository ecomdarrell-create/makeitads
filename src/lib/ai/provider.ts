import { z } from 'zod';

// ============================================
// CONFIGURATION DES PROVIDERS
// ============================================
export type AIProvider = 'groq' | 'openai' | 'anthropic';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

// Configuration par défaut (facile à changer)
export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'groq',
  model: 'llama-3.1-70b-versatile',
  temperature: 0.7,
  maxTokens: 4000,
};

// ============================================
// SCHÉMAS DE VALIDATION ZOD
// ============================================

// Schéma pour le Diagnostic Flash
export const FlashDiagnosticSchema = z.object({
  diagnostic: z.string(),
  avatar_client: z.string(),
  angle_publicitaire: z.string(),
  makeitads_teaser: z.string(),
});

// Schéma pour la Stratégie Complète
export const CompleteStrategySchema = z.object({
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
});

// Type inféré
export type FlashDiagnostic = z.infer<typeof FlashDiagnosticSchema>;
export type CompleteStrategy = z.infer<typeof CompleteStrategySchema>;

// ============================================
// PROMPTS SYSTÈME
// ============================================

const FLASH_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds, spécialisé dans l'acquisition client en Afrique.
Génère un diagnostic flash percutant basé sur les données fournies.

RÈGLES :
- Ton direct, expert, sans jargon.
- Intègre TOUJOURS les réalités locales (Mobile Money, confiance, WhatsApp).
- Réponds UNIQUEMENT en JSON valide avec cette structure exacte :

{
  "diagnostic": "3 phrases max sur pourquoi le business stagne",
  "avatar_client": "Profil psycho-démographique de l'acheteur idéal (ville, âge, douleur principale)",
  "angle_publicitaire": "1 concept de pub (hook + visuel) qui marche en Afrique",
  "makeitads_teaser": "Message de 2 phrases expliquant que les scripts WhatsApp et la stratégie budgétaire sont réservés aux membres."
}`;

const COMPLETE_SYSTEM_PROMPT = `Tu es le Directeur Stratégique de MakeItAds. Génère une stratégie 360° complète et actionnable.

RÈGLES :
- Stratégie chirurgical, pas de conseils génériques.
- Scripts WhatsApp prêts à copier-coller avec emojis.
- Mention explicite de Wave, Orange Money, MTN Moov.
- Réponds UNIQUEMENT en JSON valide avec cette structure exacte :

{
  "analyse_marche": "2 phrases sur les opportunités spécifiques au secteur/ville",
  "ciblage_exact": {
    "villes": ["Ville 1", "Ville 2"],
    "ages": "25-40 ans",
    "interets": ["Intérêt 1", "Intérêt 2"],
    "comportements": ["Comportement 1"]
  },
  "scripts_whatsapp": [
    "Script 1 : Accueil + qualification (avec emojis)",
    "Script 2 : Relance après 24h (urgency)",
    "Script 3 : Closing avec Mobile Money + garantie"
  ],
  "allocation_budget": "Comment répartir 50 000 FCFA sur 7 jours (test, scale, optimisation)",
  "conseil_expert": "1 astuce MakeItAds exclusive pour maximiser le ROAS"
}`;

// ============================================
// FONCTION PRINCIPALE D'APPEL IA
// ============================================

export async function generateStrategy<T>(
  config: AIConfig,
  systemPrompt: string,
  userData: any,
  schema: z.ZodSchema<T>
): Promise<T> {
  const { provider, model, temperature = 0.7, maxTokens = 4000 } = config;

  let response: string;

  // Appel au provider approprié
  if (provider === 'groq') {
    response = await callGroq(model, systemPrompt, userData, temperature, maxTokens);
  } else if (provider === 'openai') {
    response = await callOpenAI(model, systemPrompt, userData, temperature, maxTokens);
  } else if (provider === 'anthropic') {
    response = await callAnthropic(model, systemPrompt, userData, temperature, maxTokens);
  } else {
    throw new Error(`Provider IA non supporté: ${provider}`);
  }

  // Nettoyer la réponse (enlever les balises markdown si présentes)
  const cleanResponse = cleanJsonResponse(response);

  // Parser et valider avec Zod
  try {
    const parsed = JSON.parse(cleanResponse);
    const validated = schema.parse(parsed);
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erreur de validation Zod:', error.issues);
      throw new Error('La réponse de l\'IA ne correspond pas au schéma attendu');
    }
    console.error('Erreur de parsing JSON:', error);
    throw new Error('Impossible de parser la réponse de l\'IA');
  }
}

// ============================================
// APPELS AUX PROVIDERS
// ============================================

async function callGroq(
  model: string,
  systemPrompt: string,
  userData: any,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY non configurée');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(userData) }
      ],
      response_format: { type: 'json_object' },
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Erreur Groq:', error);
    throw new Error('Erreur lors de l\'appel à Groq');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callOpenAI(
  model: string,
  systemPrompt: string,
  userData: any,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY non configurée');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(userData) }
      ],
      response_format: { type: 'json_object' },
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Erreur OpenAI:', error);
    throw new Error('Erreur lors de l\'appel à OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(
  model: string,
  systemPrompt: string,
  userData: any,
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
      messages: [
        { role: 'user', content: JSON.stringify(userData) }
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Erreur Anthropic:', error);
    throw new Error('Erreur lors de l\'appel à Anthropic');
  }

  const data = await response.json();
  return data.content[0].text;
}

// ============================================
// UTILITAIRES
// ============================================

function cleanJsonResponse(response: string): string {
  // Enlever les balises markdown si présentes
  let cleaned = response.trim();
  
  // Retirer ```json et ```
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

export function getSystemPrompt(type: 'flash' | 'complete'): string {
  return type === 'flash' ? FLASH_SYSTEM_PROMPT : COMPLETE_SYSTEM_PROMPT;
}

export function getSchema(type: 'flash' | 'complete') {
  return type === 'flash' ? FlashDiagnosticSchema : CompleteStrategySchema;
}