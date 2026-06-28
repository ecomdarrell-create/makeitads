import { chatCompletion, GROQ_MODELS, type GroqMessage, isGroqConfigured } from "./groq";

// Types pour les stratégies
export interface StrategyData {
  businessName: string;
  industry: string;
  targetAudience: string;
  competitors: CompetitorData[];
  marketAnalysis: MarketAnalysis;
  recommendations: Recommendation[];
  roadmap: RoadmapItem[];
  creativeAngles: CreativeAngle[];
  budgetAllocation: BudgetAllocation;
}

export interface CompetitorData {
  name: string;
  website: string;
  country: string;
  estimatedTraffic: number;
  marketPosition: string;
  googleRating?: number;
  googleReviews?: number;
  employees?: number;
  founded?: number;
  socialFollowers?: {
    linkedin?: number;
    facebook?: number;
    instagram?: number;
  };
  advertisingActivity: {
    googleAds: boolean;
    metaAds: boolean;
    linkedinAds: boolean;
    tiktokAds: boolean;
  };
  seoVisibility: number;
  topChannels: string[];
  estimatedMonthlySpend?: number;
  mainOffer: string;
  averagePrice?: number;
  strengths: string[];
  weaknesses: string[];
  uniqueSellingProposition: string;
  customerSentiment: "positive" | "neutral" | "negative";
  growthScore: number;
  marketShare?: number;
  trendScore: number;
  competitiveThreat: "low" | "medium" | "high";
  logoUrl?: string;
}

export interface MarketAnalysis {
  marketSize: string;
  growthRate: number;
  trends: string[];
  opportunities: string[];
  threats: string[];
  customerPainPoints: string[];
  buyingMotivations: string[];
  seasonalPatterns?: string[];
}

export interface Recommendation {
  category: "positioning" | "channels" | "creative" | "budget" | "timing";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  expectedImpact: string;
  effort: "low" | "medium" | "high";
  confidence: number;
}

export interface RoadmapItem {
  month: number;
  title: string;
  actions: string[];
  expectedResults: string;
  kpis: string[];
}

export interface CreativeAngle {
  hook: string;
  headline: string;
  primaryText: string;
  cta: string;
  visualDirection: string;
  targetPersona: string;
  platform: "meta" | "google" | "linkedin" | "tiktok";
}

export interface BudgetAllocation {
  totalBudget: number;
  channels: {
    name: string;
    percentage: number;
    amount: number;
    rationale: string;
  }[];
}

export function isOpenAIConfigured(): boolean {
  return isGroqConfigured();
}

export async function generateStrategy(
  businessData: {
    name: string;
    website: string;
    industry: string;
    country: string;
    targetAudience: string;
    description: string;
    services: string[];
    pricingPositioning: string;
    goals: string[];
  }
): Promise<StrategyData> {
  if (!isGroqConfigured()) {
    console.log("⚠️ Groq not configured. Returning demo strategy data.");
    return getDemoStrategy(businessData);
  }

  const prompt = `
    You are an expert marketing strategist with 20+ years of experience.
    Analyze this business and generate a comprehensive marketing strategy.

    Business Information:
    - Name: ${businessData.name}
    - Website: ${businessData.website}
    - Industry: ${businessData.industry}
    - Country: ${businessData.country}
    - Target Audience: ${businessData.targetAudience}
    - Description: ${businessData.description}
    - Services: ${businessData.services.join(", ")}
    - Pricing Positioning: ${businessData.pricingPositioning}
    - Goals: ${businessData.goals.join(", ")}

    Generate a detailed strategy including:
    1. Market analysis (size, growth, trends, opportunities, threats)
    2. Top 3-5 competitors with detailed analysis
    3. Strategic recommendations (positioning, channels, creative, budget)
    4. 3-month roadmap with specific actions
    5. Creative angles for ads
    6. Budget allocation across channels

    Respond ONLY with valid JSON following this exact structure.
  `;

  try {
    const messages: GroqMessage[] = [
      {
        role: "system",
        content: "You are an expert marketing strategist. Respond ONLY with valid JSON. No markdown, no explanations.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await chatCompletion(messages, {
      model: GROQ_MODELS.LLAMA_3_1_70B,
      temperature: 0.7,
      max_tokens: 4096,
    });

    const cleanedJson = response
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    return JSON.parse(cleanedJson) as StrategyData;
  } catch (error) {
    console.error("Groq API error:", error);
    return getDemoStrategy(businessData);
  }
}

export async function analyzeCompetitor(
  competitorName: string,
  userBusinessIndustry: string
): Promise<CompetitorData> {
  if (!isGroqConfigured()) {
    console.log("⚠️ Groq not configured. Returning demo competitor data.");
    return getDemoCompetitor(competitorName);
  }

  const prompt = `
    Analyze this competitor in detail:
    - Competitor Name: ${competitorName}
    - Industry: ${userBusinessIndustry}

    Provide comprehensive competitive intelligence.
    Respond ONLY with valid JSON following the CompetitorData structure.
  `;

  try {
    const messages: GroqMessage[] = [
      {
        role: "system",
        content: "You are a competitive intelligence analyst. Respond ONLY with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await chatCompletion(messages, {
      model: GROQ_MODELS.LLAMA_3_1_70B,
      temperature: 0.5,
      max_tokens: 2048,
    });

    const cleanedJson = response
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    return JSON.parse(cleanedJson) as CompetitorData;
  } catch (error) {
    console.error("Groq API error:", error);
    return getDemoCompetitor(competitorName);
  }
}

function getDemoStrategy(businessData: any): StrategyData {
  return {
    businessName: businessData.name,
    industry: businessData.industry,
    targetAudience: businessData.targetAudience,
    competitors: [
      {
        name: "Demo Competitor 1",
        website: "demo1.com",
        country: businessData.country,
        estimatedTraffic: 120000,
        marketPosition: "Market Leader",
        seoVisibility: 87,
        topChannels: ["Organic Search", "Google Ads"],
        mainOffer: "Premium Service",
        strengths: ["Strong brand", "Large customer base"],
        weaknesses: ["High pricing", "Slow innovation"],
        uniqueSellingProposition: "All-in-one solution",
        customerSentiment: "positive",
        growthScore: 78,
        trendScore: 65,
        competitiveThreat: "high",
        advertisingActivity: { googleAds: true, metaAds: true, linkedinAds: false, tiktokAds: false },
      },
    ],
    marketAnalysis: {
      marketSize: "$2.4B",
      growthRate: 12.5,
      trends: ["AI integration", "Mobile-first", "Personalization"],
      opportunities: ["Underserved segments", "Emerging markets"],
      threats: ["Increased competition", "Regulatory changes"],
      customerPainPoints: ["High costs", "Complex solutions"],
      buyingMotivations: ["ROI", "Ease of use", "Support"],
    },
    recommendations: [
      {
        category: "positioning",
        priority: "high",
        title: "Focus on underserved segment",
        description: "Target the mid-market segment with tailored messaging",
        expectedImpact: "+25% conversion rate",
        effort: "medium",
        confidence: 85,
      },
    ],
    roadmap: [
      {
        month: 1,
        title: "Foundation & Research",
        actions: ["Market research", "Competitor analysis", "Brand positioning"],
        expectedResults: "Clear market understanding",
        kpis: ["Market share baseline", "Brand awareness"],
      },
    ],
    creativeAngles: [
      {
        hook: "Problem-Solution",
        headline: "Transform Your Business in 30 Days",
        primaryText: "Join 5,000+ successful businesses using our platform",
        cta: "Start Free Trial",
        visualDirection: "Clean, professional, data-driven",
        targetPersona: "Decision makers",
        platform: "meta",
      },
    ],
    budgetAllocation: {
      totalBudget: 2500,
      channels: [
        { name: "Meta Ads", percentage: 40, amount: 1000, rationale: "Highest ROI potential" },
        { name: "Google Ads", percentage: 35, amount: 875, rationale: "High-intent traffic" },
        { name: "LinkedIn Ads", percentage: 15, amount: 375, rationale: "B2B targeting" },
        { name: "TikTok Ads", percentage: 10, amount: 250, rationale: "Brand awareness" },
      ],
    },
  };
}

function getDemoCompetitor(competitorName: string): CompetitorData {
  return {
    name: competitorName,
    website: `${competitorName.toLowerCase().replace(/\s+/g, "")}.com`,
    country: "🇺 United States",
    estimatedTraffic: 95000,
    marketPosition: "Established Player",
    googleRating: 4.5,
    googleReviews: 1200,
    employees: 150,
    founded: 2018,
    socialFollowers: {
      linkedin: 25000,
      facebook: 18000,
      instagram: 45000,
    },
    advertisingActivity: {
      googleAds: true,
      metaAds: true,
      linkedinAds: true,
      tiktokAds: false,
    },
    seoVisibility: 72,
    topChannels: ["Organic Search", "Meta Ads", "LinkedIn"],
    estimatedMonthlySpend: 32000,
    mainOffer: "Comprehensive Solution",
    averagePrice: 199,
    strengths: ["Strong brand recognition", "Loyal customer base", "Good SEO"],
    weaknesses: ["Slow innovation", "High pricing", "Limited mobile experience"],
    uniqueSellingProposition: "Trusted industry leader with proven results",
    customerSentiment: "positive",
    growthScore: 68,
    marketShare: 24,
    trendScore: 55,
    competitiveThreat: "medium",
  };
}