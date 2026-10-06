import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { DEFAULT_AI_CONFIG } from "@/lib/ai/provider";

const promptTemplate = `You are MakeItAds, an AI assistant that turns product descriptions into complete ad strategies.

Create a short and actionable ad strategy using the input description. Include:
- A one-sentence positioning summary
- Recommended target audiences and regions
- Suggested platform mix (Meta, TikTok, Google)
- Budget allocation guidance
- Example ad copy hooks and CTA
- A brief creative direction note

Input description:
"""
{description}
"""

Respond in French and do not mention that you are an AI.
`;

async function generateStrategy(description: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model: DEFAULT_AI_CONFIG.model,
    max_tokens: 900,
    temperature: 0.5,
    system: 'Tu es le conseiller MakeItAds. Réponds en français, distingue les recommandations des résultats mesurés et n’invente aucun chiffre de performance.',
    messages: [{ role: 'user', content: promptTemplate.replace("{description}", description) }],
  });

  const output = response.content.find((block) => block.type === 'text')?.text;
  if (!output?.trim()) throw new Error("Aucune réponse de l'API Claude");
  return output.trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const description = body.description?.trim();

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description requise" }, { status: 400 });
    }

    const strategy = await generateStrategy(description);
    return NextResponse.json({ strategy });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur interne" }, { status: 500 });
  }
}
