import { AIProvider, BusinessProfile, StrategyResult } from "../types";
import { buildStrategyPrompt } from "../promptBuilder";

export const geminiProvider: AIProvider = "gemini";

export async function callGeminiProvider(
  profile: BusinessProfile,
  apiKey: string
): Promise<StrategyResult> {
  const prompt = buildStrategyPrompt(profile);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!content) {
      throw new Error("Empty response from Gemini");
    }

    // Nettoyer le JSON
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
      marketScore: data.overview?.marketScore || 75,
      growthPotential: data.overview?.growthPotential || "High",
      competition: data.overview?.competition || "Medium",
      estimatedROI: data.overview?.estimatedROI || "250%",
      budgetSplit: data.overview?.budgetSplit || { meta: 40, google: 35, tiktok: 15, linkedin: 10 },
    },
    market: data.market || {
      marketSize: "$2.4B",
      growthRate: 12.5,
      trends: ["AI integration", "Mobile-first"],
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