import OpenAI from "openai";

// ============================================================
// CLIENT DEEPSEEK
// ============================================================

if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error(
    "❌ DEEPSEEK_API_KEY manquante. Vérifie ton fichier .env.local"
  );
}

export const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const DEFAULT_MODEL = "deepseek-chat";

// ============================================================
// TYPE D'ERREUR DEEPSEEK
// ============================================================

type DeepSeekError = {
  status?: number;
  message?: string;
};

// ============================================================
// FONCTION DE GÉNÉRATION
// ============================================================

export async function generateJSON<T>({
  systemPrompt,
  userPrompt,
  maxTokens = 4000,
}: {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}): Promise<T> {
  try {
    const response = await deepseek.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Réponse vide de DeepSeek");
    }

    return JSON.parse(content) as T;
  } catch (error) {
    const err = error as DeepSeekError;
    const message = err.message ?? "Erreur inconnue";

    console.error("❌ Erreur DeepSeek :", message);

    if (err.status === 401) {
      throw new Error("Clé API DeepSeek invalide");
    }
    if (err.status === 429) {
      throw new Error(
        "Trop de requêtes envoyées à DeepSeek. Réessaie dans quelques secondes."
      );
    }
    if (err.status === 402) {
      throw new Error("Crédit DeepSeek épuisé. Recharge ton compte.");
    }
    if (err.status === 500 || err.status === 503) {
      throw new Error("DeepSeek est temporairement indisponible. Réessaie.");
    }

    throw new Error("Erreur lors de la génération de la stratégie");
  }
}