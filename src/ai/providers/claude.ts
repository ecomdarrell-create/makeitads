import { Anthropic } from "@anthropic-ai/sdk";
import { BusinessProfile, StrategyResult } from "../types";
import { buildStrategyPrompt } from "@/ai/promptBuilder";
import { normalizeToStrategyResult } from "./groq"; // ✅ Import correct maintenant

export async function callClaudeProvider(
  profile: BusinessProfile,
  apiKey: string
): Promise<StrategyResult> {
  const anthropic = new Anthropic({ apiKey });
  const prompt = buildStrategyPrompt(profile);

  console.log("\n🤖 [Claude] Appel API avec paramètres optimisés:");
  console.log(`   → Modèle: claude-3-5-sonnet-20241022`);
  console.log(`   → Business: ${profile.name}`);
  console.log(`   → Industry: ${profile.industry}`);

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      system: `You are a world-class Senior Marketing Strategist with 20+ years of experience. You specialize in creating hyper-personalized, data-driven marketing strategies.
      
CRITICAL RULES:
1. NEVER use generic advice - every recommendation must be specific to the business provided.
2. Generate UNIQUE market scores between 60-95.
3. Identify REAL competitors in the specified location when possible.
4. Write DETAILED ad copy.
5. Return ONLY valid JSON - no markdown, no explanations, no text outside JSON.
6. Ensure ALL fields from the expected StrategyResult schema are present.`,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "{}";
    
    const cleaned = rawText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .replace(/^\s*{/, "{")
      .replace(/}\s*$/, "}")
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
      console.log("✅ [Claude] JSON parsé avec succès");
    } catch (parseError) {
      console.error("❌ [Claude] Erreur de parsing JSON:", parseError);
      console.error("Contenu reçu:", rawText.substring(0, 500));
      throw new Error("Invalid JSON response from Claude");
    }

    // ✅ On réutilise exactement la même normalisation que Groq
    return normalizeToStrategyResult(parsed, profile);

  } catch (error: any) {
    console.error("💥 [Claude] Erreur:", error.message);
    throw error;
  }
}