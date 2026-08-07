// ===== TYPES UNIFIÉS POUR TOUTE L'ARCHITECTURE =====

export type AIProvider = "openai" | "gemini" | "groq" | "claude" | "mock";

// ===== BUSINESS PROFILE ENRICHI =====
export interface BusinessProfile {
  // Informations de base
  name: string;
  industry: string;
  country: string;
  city?: string;
  budget: number;
  
  // Stratégie
  goals: string[];
  targetAudience: string;
  idealCustomer?: string;
  customerPainPoints?: string[];
  
  // Offre
  products?: string[];
  services?: string[];
  businessModel?: string;
  
  // Marché
  competitors?: string[];
  competitiveAdvantages?: string[];
  marketingChannels?: string[];
  existingChannels?: string[];
  
  // Marque
  tone?: string;
  brandPositioning?: string;
  positioningStatement?: string;
  
  // Maturité
  maturity?: "startup" | "growth" | "established" | "enterprise";
  
  // Contexte
  additionalNotes?: string;
  keyChallenges?: string[];
  uniqueValueProposition?: string;
}

// ===== STRATEGY RESULT =====
export interface StrategyResult {
  overview: {
    businessName: string;
    industry: string;
    country: string;
    city?: string;
    budget: number;
    marketScore: number;
    growthPotential: string;
    competition: string;
    estimatedROI: string;
    budgetSplit: Record<string, number>;
  };
  market: {
    marketSize: string;
    growthRate: number;
    trends: string[];
    opportunities: string[];
    threats: string[];
    customerPainPoints: string[];
    buyingMotivations: string[];
  };
  competitors: Competitor[];
  audience: {
    primaryPersona: Persona;
    secondaryPersona: Persona;
    demographics: Record<string, string>;
    behaviors: string[];
    interests: string[];
  };
  personas: Persona[];
  campaigns: Campaign[];
  creative: {
    adCopy: AdCopy[];
    visualDirection: string;
    brandVoice: string;
    colorPalette: string[];
  };
  analytics: {
    kpis: KPI[];
    trackingSetup: string[];
    reportingCadence: string;
  };
  roadmap: RoadmapItem[];
  recommendations: Recommendation[];
  aiRecommendation: {
    opportunity: string;
    confidence: string;
    result: string;
    priority: string;
  };
}

// ===== INTERFACES EXISTANTES =====

export interface Competitor {
  name: string;
  website?: string;
  share?: string;
  traffic?: string;
  ads?: string;
  position: string;
  strengths: string[];
  weaknesses: string[];
  opportunity: number;
  estimatedTraffic?: number;
  seoVisibility?: number;
  topChannels?: string[];
  mainOffer?: string;
  uniqueSellingProposition?: string;
  customerSentiment?: string;
  growthScore?: number;
  trendScore?: number;
  competitiveThreat?: string;
  advertisingActivity?: {
    googleAds: boolean;
    metaAds: boolean;
    linkedinAds: boolean;
    tiktokAds: boolean;
  };
}

export interface Persona {
  name: string;
  age: string;
  gender: string;
  income: string;
  occupation: string;
  goals: string[];
  painPoints: string[];
  preferredChannels: string[];
  buyingBehavior: string;
}

export interface Campaign {
  platform: string;
  headline: string;
  text: string;
  cta: string;
  hook: string;
  objective: string;
  budget: string;
  reach: string;
  targetPersona: string;
  duration: string;
}

export interface AdCopy {
  platform: string;
  headline: string;
  primaryText: string;
  cta: string;
  hook: string;
  tone: string;
}

export interface KPI {
  name: string;
  target: string;
  current?: string;
  trend?: "up" | "down" | "neutral";
}

export interface RoadmapItem {
  month: string;
  task: string;
  priority: "High" | "Medium" | "Low";
  impact: string;
  difficulty: string;
  results: string;
}

export interface Recommendation {
  category: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  expectedImpact: string;
  effort: "low" | "medium" | "high";
  confidence: number;
}

export interface GatewayResponse {
  success: boolean;
  provider: AIProvider;
  strategy: StrategyResult | null;
  error?: string;
  duration?: number;
}

export interface GatewayConfig {
  provider: AIProvider;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}