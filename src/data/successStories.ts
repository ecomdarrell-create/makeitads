// ======================================================
// SUCCESS STORIES - TOUTES LES HISTOIRES
// Les nouvelles sont en PREMIÈRE POSITION
// ======================================================

export interface SuccessStory {
  id: number;
  name: string;
  role: string;
  company: string;
  country: string;
  countryFlag: string;
  industry: string;
  metric: string;
  timeToResult: string;
  before: string[];
  after: string[];
  quote: string;
  modules: string[];
  image: string;
  isNew?: boolean;
}

export const NEW_SUCCESS_STORIES: SuccessStory[] = [
  // ✅ 4 NOUVELLES IMAGES AJOUTÉES
  {
    id: 7,
    name: "Amara Johnson",
    role: "Founder & CEO",
    company: "LuxeCart",
    country: "USA",
    countryFlag: "🇺🇸",
    industry: "E-commerce",
    metric: "+340% Revenue",
    timeToResult: "in 4 months",
    before: ["Random ad spend", "No market data", "Declining ROAS"],
    after: ["Data-driven strategy", "3x revenue growth", "50% lower CPA"],
    quote: "MakeItAds identified niches we never considered. Our revenue tripled in 4 months with half the ad spend.",
    modules: ["Market Intel", "Competitor Watch"],
    image: "/images/testimonial-ecommerce.webp",
    isNew: true,
  },
  {
    id: 8,
    name: "Kenji Tanaka",
    role: "Marketing Director",
    company: "CloudSync",
    country: "Japan",
    countryFlag: "🇯🇵",
    industry: "SaaS",
    metric: "-62% CAC",
    timeToResult: "in 6 months",
    before: ["High CAC", "Manual research", "Slow growth"],
    after: ["62% lower CAC", "Automated insights", "3x faster scaling"],
    quote: "We cut our customer acquisition cost by 62% while scaling. The competitor intelligence alone is worth 10x the price.",
    modules: ["Competitor Intel", "Strategy Engine"],
    image: "/images/testimonial-saas.webp",
    isNew: true,
  },
  {
    id: 9,
    name: "Isabella Rodriguez",
    role: "Co-Founder",
    company: "FinFlow",
    country: "Mexico",
    countryFlag: "🇲🇽",
    industry: "Fintech",
    metric: "$2.5M Raised",
    timeToResult: "in 8 months",
    before: ["No market validation", "Weak pitch", "Rejected by VCs"],
    after: ["Data-backed strategy", "$2.5M seed round", "12 VC meetings"],
    quote: "The market intelligence from MakeItAds was crucial for our pitch deck. Investors loved our data-backed approach.",
    modules: ["Market Intel", "Benchmarking"],
    image: "/images/testimonial-fintech.webp",
    isNew: true,
  },
  {
    id: 10,
    name: "Omar Al-Rashid",
    role: "CEO",
    company: "Apex Agency",
    country: "UAE",
    countryFlag: "🇦🇪",
    industry: "Advertising",
    metric: "12x ROI",
    timeToResult: "in 5 months",
    before: ["Generic strategies", "Client churn", "Low margins"],
    after: ["12x avg ROI", "95% retention", "Premium pricing"],
    quote: "We manage 40+ client accounts. MakeItAds gives us an unfair advantage on every single one. 12x ROI across the board.",
    modules: ["Full Suite"],
    image: "/images/testimonial-agency.webp",
    isNew: true,
  },
  // ✅ LES ANCIENNES NOUVELLES
  {
    id: 4,
    name: "Priya Patel",
    role: "Founder & CEO",
    company: "Luxe Threads",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    industry: "E-commerce Fashion",
    metric: "+287% Qualified Leads",
    timeToResult: "in 60 days",
    before: [
      "High customer acquisition cost",
      "Inconsistent ad performance",
      "No clear audience targeting",
    ],
    after: [
      "Precision audience segments",
      "4.3x ROAS on Meta campaigns",
      "Predictable lead generation",
    ],
    quote: "MakeItAds identified audience segments we never considered. Our CPA dropped by 41% in the first month alone.",
    modules: ["Audience Lab", "Campaign Builder", "Analytics"],
    image: "/images/story-priya-patel.jpg",
    isNew: true,
  },
  {
    id: 5,
    name: "David Kim",
    role: "VP of Marketing",
    company: "CloudSync Pro",
    country: "United States",
    countryFlag: "🇺🇸",
    industry: "B2B SaaS",
    metric: "+4.3x ROI",
    timeToResult: "in 90 days",
    before: [
      "Stagnant MRR growth",
      "Inefficient ad spend across channels",
      "Weak competitive positioning",
    ],
    after: [
      "Clear market differentiation",
      "Optimized channel allocation",
      "3 new enterprise clients",
    ],
    quote: "The competitor intelligence alone was worth the subscription. We discovered a positioning gap that doubled our conversion rate.",
    modules: ["Competitor Intelligence", "Market Intelligence", "Growth Roadmap"],
    image: "/images/story-david-kim.jpg",
    isNew: true,
  },
  {
    id: 6,
    name: "Elena Rodriguez",
    role: "Marketing Director",
    company: "Bella Vita Cosmetics",
    country: "Spain",
    countryFlag: "🇪🇸",
    industry: "Beauty & Cosmetics",
    metric: "-41% CAC",
    timeToResult: "in 45 days",
    before: [
      "Overspending on underperforming channels",
      "No visibility into competitor strategies",
      "Generic creative that didn't convert",
    ],
    after: [
      "Data-driven creative strategy",
      "Focused budget on top 2 channels",
      "Clear brand positioning",
    ],
    quote: "We stopped guessing and started executing with confidence. The AI recommendations were spot-on from day one.",
    modules: ["Creative Studio", "Trend Intelligence", "Budget Optimizer"],
    image: "/images/story-elena-rodriguez.jpg",
    isNew: true,
  },
];

export const EXISTING_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 1,
    name: "James Walker",
    role: "Founder",
    company: "Bright Dental",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    industry: "Dental Clinic",
    metric: "+42% Qualified Leads",
    timeToResult: "in 30 days",
    before: ["No clear positioning", "Random decisions"],
    after: ["Clear growth roadmap", "Better positioning"],
    quote: "Instead of guessing where to invest our budget, we finally had a clear plan backed by market insights.",
    modules: ["Market Intelligence", "Growth Roadmap"],
    image: "/images/story-james-walker.jpg",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "CMO",
    company: "Luxe Skincare",
    country: "United States",
    countryFlag: "🇺🇸",
    industry: "Beauty",
    metric: "-31% CPA",
    timeToResult: "in 60 days",
    before: ["High ad waste", "Inconsistent campaigns"],
    after: ["Optimized budget split", "Consistent execution"],
    quote: "We were burning cash on channels that didn't convert. MakeItAds showed us exactly where our audience was.",
    modules: ["Competitor Intelligence", "Analytics"],
    image: "/images/story-sarah-chen.jpg",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "CEO",
    company: "TechFlow SaaS",
    country: "Canada",
    countryFlag: "🇨🇦",
    industry: "B2B SaaS",
    metric: "2 New Markets",
    timeToResult: "in 90 days",
    before: ["Stagnant growth", "Fear of expansion"],
    after: ["Data-driven expansion", "Confident positioning"],
    quote: "The market opportunity score gave us the confidence to expand into two new verticals we hadn't considered.",
    modules: ["Opportunity Detection", "Benchmarks"],
    image: "/images/story-marcus-johnson.jpg",
  },
];

// Toutes les stories combinées (nouvelles en premier)
export const ALL_SUCCESS_STORIES = [...NEW_SUCCESS_STORIES, ...EXISTING_SUCCESS_STORIES];