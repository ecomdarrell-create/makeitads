export const BUDGET_EXPLANATION = {
  title: "Monthly Advertising Budget",
  subtitle: "This budget will be allocated across the most effective channels for your industry. Our AI optimizes the split based on your goals and market conditions.",
};

export const CAMPAIGN_OBJECTIVES = [
  { id: "awareness", label: "Brand Awareness", description: "Increase visibility and reach" },
  { id: "traffic", label: "Website Traffic", description: "Drive qualified visitors" },
  { id: "leads", label: "Lead Generation", description: "Capture potential customers" },
  { id: "sales", label: "Sales & Conversions", description: "Maximize revenue" },
  { id: "retention", label: "Customer Retention", description: "Keep existing customers engaged" },
];

export const TARGET_AUDIENCES = [
  { id: "b2c", name: "B2C Consumers", description: "Direct to consumer" },
  { id: "b2b", name: "B2B Businesses", description: "Business to business" },
  { id: "local", name: "Local Market", description: "Geographic targeting" },
  { id: "global", name: "Global Market", description: "International reach" },
];

export const INDUSTRY_CATEGORIES = [
  "E-commerce",
  "SaaS",
  "Healthcare",
  "Finance",
  "Education",
  "Real Estate",
  "Food & Beverage",
  "Fashion & Beauty",
  "Technology",
  "Travel & Hospitality",
  "Fitness & Wellness",
  "Entertainment",
  "Automotive",
  "Home Services",
  "Professional Services",
];

export const PLATFORM_OPTIONS = [
  { id: "google", name: "Google Ads", icon: "", bestFor: "High-intent search traffic" },
  { id: "meta", name: "Meta (Facebook/Instagram)", icon: "📘", bestFor: "Visual storytelling & retargeting" },
  { id: "tiktok", name: "TikTok Ads", icon: "🎵", bestFor: "Viral reach & Gen Z audience" },
  { id: "linkedin", name: "LinkedIn Ads", icon: "💼", bestFor: "B2B & professional targeting" },
  { id: "youtube", name: "YouTube Ads", icon: "▶️", bestFor: "Video engagement & brand awareness" },
  { id: "twitter", name: "Twitter/X Ads", icon: "", bestFor: "Real-time conversations & trends" },
  { id: "pinterest", name: "Pinterest Ads", icon: "📌", bestFor: "Visual discovery & shopping intent" },
  { id: "snapchat", name: "Snapchat Ads", icon: "👻", bestFor: "Young audience & AR experiences" },
];

export const COMPETITOR_METRICS = [
  { id: "traffic", label: "Website Traffic", unit: "visitors/month" },
  { id: "market_share", label: "Market Share", unit: "%" },
  { id: "ad_spend", label: "Estimated Ad Spend", unit: "$/month" },
  { id: "social_followers", label: "Social Followers", unit: "followers" },
  { id: "engagement_rate", label: "Engagement Rate", unit: "%" },
];

export const STRATEGY_STATUS = {
  draft: { label: "Draft", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  generating: { label: "Generating", color: "bg-[#6366f1]/10 text-[#8b5cf6] border-[#6366f1]/20" },
  ready: { label: "Ready", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  failed: { label: "Failed", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export const RECOMMENDATION_PRIORITIES = {
  high: { label: "High Priority", color: "text-red-400 bg-red-500/10" },
  medium: { label: "Medium Priority", color: "text-amber-400 bg-amber-500/10" },
  low: { label: "Low Priority", color: "text-emerald-400 bg-emerald-500/10" },
};

export const MARKET_SCORE_RANGES = {
  excellent: { min: 80, max: 100, label: "Excellent", color: "text-emerald-400" },
  good: { min: 60, max: 79, label: "Good", color: "text-blue-400" },
  fair: { min: 40, max: 59, label: "Fair", color: "text-amber-400" },
  poor: { min: 0, max: 39, label: "Needs Work", color: "text-red-400" },
};

export const getMarketScoreLabel = (score: number) => {
  if (score >= 80) return MARKET_SCORE_RANGES.excellent;
  if (score >= 60) return MARKET_SCORE_RANGES.good;
  if (score >= 40) return MARKET_SCORE_RANGES.fair;
  return MARKET_SCORE_RANGES.poor;
};

export const BUDGET_ALLOCATION_DEFAULTS = {
  google: 30,
  meta: 35,
  tiktok: 15,
  linkedin: 10,
  other: 10,
};

export const ROI_BENCHMARKS = {
  excellent: { min: 5, label: "5x+ ROI", color: "text-emerald-400" },
  good: { min: 3, label: "3-5x ROI", color: "text-blue-400" },
  average: { min: 1, label: "1-3x ROI", color: "text-amber-400" },
  poor: { min: 0, label: "<1x ROI", color: "text-red-400" },
};

export const getROILabel = (roi: number) => {
  if (roi >= 5) return ROI_BENCHMARKS.excellent;
  if (roi >= 3) return ROI_BENCHMARKS.good;
  if (roi >= 1) return ROI_BENCHMARKS.average;
  return ROI_BENCHMARKS.poor;
};

// ======================================================
// COUNTRIES
// ======================================================

export const ALL_COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦" },
  { code: "SE", name: "Sweden", flag: "🇸" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇮" },
  { code: "PL", name: "Poland", flag: "" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "IE", name: "Ireland", flag: "🇪" },
  { code: "NZ", name: "New Zealand", flag: "🇿" },
  { code: "SG", name: "Singapore", flag: "🇬" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰" },
  { code: "CN", name: "China", flag: "" },
  { code: "IN", name: "India", flag: "🇮" },
  { code: "BR", name: "Brazil", flag: "🇧" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CL", name: "Chile", flag: "🇱" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸" },
  { code: "IL", name: "Israel", flag: "🇮" },
  { code: "TR", name: "Turkey", flag: "" },
  { code: "RU", name: "Russia", flag: "🇷" },
  { code: "UA", name: "Ukraine", flag: "🇺" },
  { code: "CZ", name: "Czech Republic", flag: "🇿" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", flag: "🇹" },
  { code: "PH", name: "Philippines", flag: "🇵" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "VN", name: "Vietnam", flag: "🇳" },
];

export const getCountryByCode = (code: string) => {
  return ALL_COUNTRIES.find((c) => c.code === code);
};

export const searchCountries = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return ALL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.code.toLowerCase().includes(lowerQuery)
  );
};

// ======================================================
// GENERATION MESSAGES
// ======================================================

export const GENERATION_MESSAGES = [
  {
    title: "Analyzing your business profile...",
    description: "We're scanning your industry, competitors, and market position.",
    duration: 3000,
  },
  {
    title: "Scanning market trends...",
    description: "Identifying current opportunities and emerging patterns in your sector.",
    duration: 4000,
  },
  {
    title: "Analyzing competitors...",
    description: "Studying your top competitors' strategies and market share.",
    duration: 4000,
  },
  {
    title: "Generating AI recommendations...",
    description: "Our AI is crafting a tailored strategy for your business.",
    duration: 5000,
  },
  {
    title: "Optimizing budget allocation...",
    description: "Distributing your budget across the most effective channels.",
    duration: 3000,
  },
  {
    title: "Finalizing your strategy...",
    description: "Compiling insights and preparing your actionable roadmap.",
    duration: 2000,
  },
];

// ======================================================
// INDUSTRIES (avec images)
// ======================================================

export const INDUSTRIES = [
  { id: "ecommerce", name: "E-commerce", image: "/images/industries/ecommerce.jpg" },
  { id: "saas", name: "SaaS & Tech", image: "/images/industries/saas.jpg" },
  { id: "healthcare", name: "Healthcare", image: "/images/industries/healthcare.jpg" },
  { id: "finance", name: "Finance", image: "/images/industries/finance.jpg" },
  { id: "education", name: "Education", image: "/images/industries/education.jpg" },
  { id: "real-estate", name: "Real Estate", image: "/images/industries/real-estate.jpg" },
  { id: "food-beverage", name: "Food & Beverage", image: "/images/industries/food.jpg" },
  { id: "fashion-beauty", name: "Fashion & Beauty", image: "/images/industries/fashion.jpg" },
  { id: "technology", name: "Technology", image: "/images/industries/technology.jpg" },
  { id: "travel", name: "Travel & Hospitality", image: "/images/industries/travel.jpg" },
  { id: "fitness", name: "Fitness & Wellness", image: "/images/industries/fitness.jpg" },
  { id: "entertainment", name: "Entertainment", image: "/images/industries/entertainment.jpg" },
  { id: "automotive", name: "Automotive", image: "/images/industries/automotive.jpg" },
  { id: "home-services", name: "Home Services", image: "/images/industries/home-services.jpg" },
  { id: "professional-services", name: "Professional Services", image: "/images/industries/professional.jpg" },
];

// ======================================================
// TYPES POUR STRATEGY BUILDER
// ======================================================

export type FormStep =
  | "industry"
  | "business-name"
  | "location"
  | "business-model"
  | "products-services"
  | "goals"
  | "target-audience"
  | "customer-pain-points"
  | "budget"
  | "competitors"
  | "brand-positioning"
  | "channels"
  | "challenges"
  | "generating";

export interface BusinessData {
  name: string;
  industry: string;
  country: string;
  city: string;
  businessModel: string;
  maturity: string;
  products: string[];
  services: string[];
  goals: string[];
  targetAudience: string;
  idealCustomer: string;
  customerPainPoints: string[];
  budget: number;
  competitors: string[];
  competitiveAdvantages: string[];
  brandPositioning: string;
  positioningStatement: string;
  tone: string;
  existingChannels: string[];
  marketingChannels: string[];
  keyChallenges: string[];
  uniqueValueProposition: string;
  additionalNotes: string;
}

// ======================================================
// BUSINESS MODELS
// ======================================================

export const BUSINESS_MODELS = [
  { id: "b2c", name: "B2C", description: "Direct to consumer" },
  { id: "b2b", name: "B2B", description: "Business to business" },
  { id: "b2b2c", name: "B2B2C", description: "Business to business to consumer" },
  { id: "d2c", name: "D2C", description: "Direct to consumer (manufacturer)" },
  { id: "marketplace", name: "Marketplace", description: "Platform connecting buyers and sellers" },
  { id: "subscription", name: "Subscription", description: "Recurring revenue model" },
  { id: "freemium", name: "Freemium", description: "Free tier with paid upgrades" },
  { id: "saas", name: "SaaS", description: "Software as a Service" },
];

// ======================================================
// MATURITY STAGES
// ======================================================

export const MATURITY_STAGES = [
  { id: "idea", name: "Idea Stage", description: "Concept validation" },
  { id: "startup", name: "Startup", description: "0-2 years, finding product-market fit" },
  { id: "growth", name: "Growth", description: "2-5 years, scaling operations" },
  { id: "established", name: "Established", description: "5+ years, stable business" },
  { id: "enterprise", name: "Enterprise", description: "Large scale, multiple markets" },
];

// ======================================================
// GOALS (avec 'name' pour cohérence avec SelectionGrid)
// ======================================================

export const GOALS = [
  { id: "brand-awareness", name: "Brand Awareness" },
  { id: "lead-generation", name: "Lead Generation" },
  { id: "sales-conversions", name: "Sales & Conversions" },
  { id: "customer-retention", name: "Customer Retention" },
  { id: "market-expansion", name: "Market Expansion" },
  { id: "product-launch", name: "Product Launch" },
  { id: "website-traffic", name: "Website Traffic" },
  { id: "app-downloads", name: "App Downloads" },
];

// ======================================================
// TONES
// ======================================================

export const TONES = [
  { id: "professional", name: "Professional" },
  { id: "friendly", name: "Friendly & Approachable" },
  { id: "authoritative", name: "Authoritative" },
  { id: "playful", name: "Playful & Fun" },
  { id: "luxury", name: "Luxury & Premium" },
  { id: "inspirational", name: "Inspirational" },
  { id: "educational", name: "Educational" },
  { id: "bold", name: "Bold & Direct" },
];

// ======================================================
// MARKETING CHANNELS
// ======================================================

export const MARKETING_CHANNELS = [
  { id: "google-ads", name: "Google Ads" },
  { id: "facebook-ads", name: "Facebook Ads" },
  { id: "instagram-ads", name: "Instagram Ads" },
  { id: "tiktok-ads", name: "TikTok Ads" },
  { id: "linkedin-ads", name: "LinkedIn Ads" },
  { id: "youtube-ads", name: "YouTube Ads" },
  { id: "twitter-ads", name: "Twitter/X Ads" },
  { id: "pinterest-ads", name: "Pinterest Ads" },
  { id: "email-marketing", name: "Email Marketing" },
  { id: "seo", name: "SEO" },
  { id: "content-marketing", name: "Content Marketing" },
  { id: "influencer-marketing", name: "Influencer Marketing" },
];