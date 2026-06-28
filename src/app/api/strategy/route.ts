import { NextResponse } from "next/server";

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

  const body = {
    model: "claude-3.5-sonic",
    max_tokens_to_sample: 600,
    temperature: 0.7,
    top_p: 1,
    stop_sequences: ["###"],
    instructions: promptTemplate.replace("{description}", description),
  };

  const response = await fetch("https://api.anthropic.com/v1/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${errorData}`);
  }

  const json = await response.json();
  const output = json?.completion ?? json?.completion?.text ?? null;
  if (!output) {
    throw new Error("Aucune réponse de l'API Anthropic");
  }

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
