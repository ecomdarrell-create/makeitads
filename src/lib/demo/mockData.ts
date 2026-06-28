import { BusinessData } from "@/lib/constants/strategy";

export interface MockDashboardData {
  overview: {
    marketScore: number;
    competition: string;
    growthPotential: string;
    estimatedROI: string;
  };
  aiRecommendation: {
    opportunity: string;
    confidence: string;
    priority: string;
  };
  campaigns: Array<{
    platform: string;
    objective: string;
    budget: number;
    expectedReach: string;
  }>;
  recommendations: Array<{
    title: string;
    priority: string;
    description: string;
  }>;
  audience: {
    primaryPersona: {
      name: string;
      age: string;
      occupation: string;
      income: string;
    };
    segments: string[];
  };
  creative: {
    brandVoice: string;
    colorPalette: string[];
    visualDirection: string;
  };
  budgetSplit: Record<string, number>;
}

export function generateMockDashboard(businessData: BusinessData): MockDashboardData {
  const industry = businessData.industry || "Business";
  const budget = businessData.budget || 2500;

  return {
    overview: {
      marketScore: Math.floor(Math.random() * 30) + 65,
      competition: "Medium",
      growthPotential: "High",
      estimatedROI: `${(Math.random() * 3 + 2).toFixed(1)}x`,
    },
    aiRecommendation: {
      opportunity: `The ${industry} market shows strong digital adoption trends with ${Math.floor(Math.random() * 40) + 30}% growth in online engagement.`,
      confidence: "High",
      priority: "High",
    },
    campaigns: [
      {
        platform: "Google Ads",
        objective: "Search & Display",
        budget: Math.round(budget * 0.35),
        expectedReach: `${Math.floor(Math.random() * 50 + 20)}K impressions`,
      },
      {
        platform: "Meta (Facebook/Instagram)",
        objective: "Awareness & Retargeting",
        budget: Math.round(budget * 0.30),
        expectedReach: `${Math.floor(Math.random() * 80 + 40)}K impressions`,
      },
      {
        platform: "TikTok Ads",
        objective: "Viral Content",
        budget: Math.round(budget * 0.20),
        expectedReach: `${Math.floor(Math.random() * 100 + 60)}K impressions`,
      },
      {
        platform: "LinkedIn Ads",
        objective: "B2B Targeting",
        budget: Math.round(budget * 0.15),
        expectedReach: `${Math.floor(Math.random() * 20 + 10)}K impressions`,
      },
    ],
    recommendations: [
      {
        title: "Focus on video content",
        priority: "high",
        description: "Video ads in your industry generate 2.5x more engagement than static images.",
      },
      {
        title: "Optimize landing pages",
        priority: "high",
        description: "Improve conversion rate by adding social proof and clear CTAs.",
      },
      {
        title: "Expand to TikTok",
        priority: "medium",
        description: "Your target audience is highly active on TikTok with growing engagement rates.",
      },
      {
        title: "Implement retargeting",
        priority: "medium",
        description: "Set up pixel tracking to retarget website visitors across all platforms.",
      },
    ],
    audience: {
      primaryPersona: {
        name: businessData.idealCustomer?.split(" ")[0] || "Alex",
        age: "28-45",
        occupation: "Professional",
        income: "$60K-$120K",
      },
      segments: businessData.targetAudience 
        ? [businessData.targetAudience, "Secondary Market", "Niche Audience"] 
        : ["Primary Market", "Secondary Market", "Niche Audience"],
    },
    creative: {
      brandVoice: businessData.tone || "Professional",
      colorPalette: ["#6366f1", "#8b5cf6", "#f8fafc", "#0f172a"],
      visualDirection: "Modern and clean with bold typography",
    },
    budgetSplit: {
      google: 35,
      meta: 30,
      tiktok: 20,
      linkedin: 15,
    },
  };
}