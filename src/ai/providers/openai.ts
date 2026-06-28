import { AIProvider, BusinessProfile, StrategyResult } from "@/ai/types";
import { buildStrategyPrompt } from "@/ai/promptBuilder";

export const openaiProvider: AIProvider = "openai";

export async function callOpenAIProvider(
  profile: BusinessProfile,
  apiKey: string
): Promise<StrategyResult> {
  const prompt = buildStrategyPrompt(profile);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert marketing strategist. Always respond with valid JSON only. No markdown, no explanations.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const cleaned = content
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    return normalizeToStrategyResult(parsed, profile);
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function normalizeToStrategyResult(data: any, profile: BusinessProfile): StrategyResult {
  return {
    overview: {
      businessName: data.businessName || profile.name,
      industry: data.industry || profile.industry,
      country: data.country || profile.country,
      budget: data.budget || profile.budget,
      marketScore: data.marketScore || 75,
      growthPotential: data.growthPotential || "High",
      competition: data.competition || "Medium",
      estimatedROI: data.estimatedROI || "250%",
      budgetSplit: data.budgetSplit || { meta: 40, google: 35, linkedin: 15, tiktok: 10 },
    },
    market: data.marketAnalysis || data.market || {
      marketSize: "$2.4B",
      growthRate: 12.5,
      trends: ["AI integration"],
      opportunities: ["Underserved markets"],
      threats: ["Competition"],
      customerPainPoints: ["High cost"],
      buyingMotivations: ["ROI"],
    },
    competitors: data.competitors || [],
    audience: data.audience || {
      primaryPersona: { name: "Primary", age: "25-45", gender: "Any", income: "Medium", occupation: "Professional", goals: [], painPoints: [], preferredChannels: [], buyingBehavior: "" },
      secondaryPersona: { name: "Secondary", age: "25-45", gender: "Any", income: "Medium", occupation: "Professional", goals: [], painPoints: [], preferredChannels: [], buyingBehavior: "" },
      demographics: {},
      behaviors: [],
      interests: [],
    },
    personas: data.personas || [],
    campaigns: data.campaigns || [],
    creative: data.creative || {
      adCopy: [],
      visualDirection: "Professional",
      brandVoice: "Confident",
      colorPalette: ["#6366f1", "#8b5cf6"],
    },
    analytics: data.analytics || {
      kpis: [],
      trackingSetup: [],
      reportingCadence: "Monthly",
    },
    roadmap: data.roadmap || [],
    recommendations: data.recommendations || [],
    aiRecommendation: data.aiRecommendation || {
      opportunity: "Focus on high-ROI channels",
      confidence: "85%",
      result: "+30% growth in 90 days",
      priority: "High",
    },
  };
}