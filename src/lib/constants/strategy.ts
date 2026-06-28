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
  { id: "b2c", label: "B2C Consumers", description: "Direct to consumer" },
  { id: "b2b", label: "B2B Businesses", description: "Business to business" },
  { id: "local", label: "Local Market", description: "Geographic targeting" },
  { id: "global", label: "Global Market", description: "International reach" },
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
  { id: "google", name: "Google Ads", icon: "🔍", bestFor: "High-intent search traffic" },
  { id: "meta", name: "Meta (Facebook/Instagram)", icon: "📘", bestFor: "Visual storytelling & retargeting" },
  { id: "tiktok", name: "TikTok Ads", icon: "🎵", bestFor: "Viral reach & Gen Z audience" },
  { id: "linkedin", name: "LinkedIn Ads", icon: "💼", bestFor: "B2B & professional targeting" },
  { id: "youtube", name: "YouTube Ads", icon: "▶️", bestFor: "Video engagement & brand awareness" },
  { id: "twitter", name: "Twitter/X Ads", icon: "🐦", bestFor: "Real-time conversations & trends" },
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
  { code: "PL", name: "Poland", flag: "🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰" },
  { code: "CN", name: "China", flag: "🇨" },
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
  { code: "TR", name: "Turkey", flag: "🇹" },
  { code: "RU", name: "Russia", flag: "🇷" },
  { code: "UA", name: "Ukraine", flag: "🇺" },
  { code: "CZ", name: "Czech Republic", flag: "🇿" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
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