export type StoryCategory = "success" | "founder" | "agency";

export interface PremiumStory {
  id: string;
  category: StoryCategory;
  avatar: string;
  name: string;
  age: number;
  country: string;
  countryFlag: string;
  profession: string;
  company: string;
  rating: number;
  quote: string;
  revenueBefore: string;
  revenueAfter: string;
  timeToResult: string;
  strategiesGenerated: number;
  results: { metric: string; before: string; after: string }[];
  timeline: { event: string; timeframe: string }[];
  badges: string[];
}

export const PREMIUM_SUCCESS_STORIES: PremiumStory[] = [
  // USA
  {
    id: "s1", category: "success",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    name: "Sarah Mitchell", age: 34, country: "United States", countryFlag: "🇺🇸",
    profession: "E-commerce Founder", company: "LuxeCart", rating: 5,
    quote: "MakeItAds identified niches we never considered. Our revenue tripled in 4 months with half the ad spend.",
    revenueBefore: "$18k/month", revenueAfter: "$61k/month", timeToResult: "4 months", strategiesGenerated: 12,
    results: [{ metric: "Revenue", before: "$18K", after: "$61K" }, { metric: "CPA", before: "$45", after: "$26" }],
    timeline: [{ event: "Joined", timeframe: "March 2024" }, { event: "Revenue tripled", timeframe: "4 months later" }],
    badges: ["Verified", "E-commerce", "Meta Ads"]
  },
  {
    id: "s2", category: "success",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    name: "Marcus Chen", age: 41, country: "United States", countryFlag: "🇺",
    profession: "SaaS CEO", company: "CloudSync", rating: 5,
    quote: "We cut our customer acquisition cost by 62% while scaling. The competitor intelligence alone is worth 10x the price.",
    revenueBefore: "$45k/month", revenueAfter: "$127k/month", timeToResult: "6 months", strategiesGenerated: 18,
    results: [{ metric: "CAC", before: "$120", after: "$45" }, { metric: "MRR", before: "4%", after: "18%" }],
    timeline: [{ event: "Joined", timeframe: "Jan 2024" }, { event: "CAC reduced 62%", timeframe: "3 months later" }],
    badges: ["Verified", "SaaS", "Google Ads"]
  },
  {
    id: "s3", category: "success",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    name: "Isabella Rodriguez", age: 29, country: "United States", countryFlag: "🇺🇸",
    profession: "Fintech Co-Founder", company: "FinFlow", rating: 5,
    quote: "The market intelligence was crucial for our pitch deck. Investors loved our data-backed approach.",
    revenueBefore: "$0", revenueAfter: "$2.5M raised", timeToResult: "8 months", strategiesGenerated: 8,
    results: [{ metric: "Funding", before: "$0", after: "$2.5M" }, { metric: "VC Meetings", before: "2", after: "12" }],
    timeline: [{ event: "Joined", timeframe: "Feb 2024" }, { event: "Seed round closed", timeframe: "2 months later" }],
    badges: ["Verified", "Fintech", "Fundraising"]
  },
  // UK
  {
    id: "f1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    name: "James Whitmore", age: 45, country: "United Kingdom", countryFlag: "🇧",
    profession: "Dental Clinic Founder", company: "Bright Dental", rating: 5,
    quote: "Instead of guessing where to invest our budget, we finally had a clear plan backed by market insights.",
    revenueBefore: "£12k/month", revenueAfter: "£28k/month", timeToResult: "2 months", strategiesGenerated: 6,
    results: [{ metric: "Qualified Leads", before: "+12%", after: "+42%" }, { metric: "Patients", before: "15/mo", after: "48/mo" }],
    timeline: [{ event: "Joined", timeframe: "Jan 2024" }, { event: "Leads +42%", timeframe: "30 days later" }],
    badges: ["Verified", "Healthcare", "Local SEO"]
  },
  {
    id: "f2", category: "founder",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
    name: "Emma Thompson", age: 33, country: "United Kingdom", countryFlag: "🇬🇧",
    profession: "Fashion Brand Founder", company: "Luxe Threads", rating: 5,
    quote: "MakeItAds identified audience segments we never considered. It felt like having a senior strategist in-house.",
    revenueBefore: "£8k/month", revenueAfter: "£34k/month", timeToResult: "3 months", strategiesGenerated: 10,
    results: [{ metric: "ROAS", before: "1.8x", after: "4.3x" }, { metric: "Time Saved", before: "20h/wk", after: "4h/wk" }],
    timeline: [{ event: "Joined", timeframe: "June 2024" }, { event: "ROAS hit 4.3x", timeframe: "45 days later" }],
    badges: ["Verified", "Fashion", "Meta Ads"]
  },
  // France
  {
    id: "f3", category: "founder",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
    name: "Sophie Laurent", age: 28, country: "France", countryFlag: "🇫🇷",
    profession: "Coffee Brand Founder", company: "Artisan Coffee", rating: 5,
    quote: "I was burning cash on ads with no direction. MakeItAds showed me exactly who my audience was.",
    revenueBefore: "€3k/month", revenueAfter: "€15k/month", timeToResult: "2 months", strategiesGenerated: 7,
    results: [{ metric: "Ad Waste", before: "60%", after: "15%" }, { metric: "Orders", before: "50/wk", after: "210/wk" }],
    timeline: [{ event: "Joined", timeframe: "April 2024" }, { event: "Orders +320%", timeframe: "60 days later" }],
    badges: ["Verified", "E-commerce", "Meta Ads"]
  },
  {
    id: "s4", category: "success",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    name: "Marie Dubois", age: 36, country: "France", countryFlag: "🇫🇷",
    profession: "Beauty Brand Director", company: "Bella Vita", rating: 5,
    quote: "We stopped guessing and started executing with confidence. Our CPA dropped by 41% in the first month.",
    revenueBefore: "€22k/month", revenueAfter: "€58k/month", timeToResult: "45 days", strategiesGenerated: 9,
    results: [{ metric: "CPA", before: "€38", after: "€22" }, { metric: "Leads", before: "120/mo", after: "410/mo" }],
    timeline: [{ event: "Joined", timeframe: "April 2024" }, { event: "Leads +240%", timeframe: "30 days later" }],
    badges: ["Verified", "Beauty", "TikTok Ads"]
  },
  // Germany
  {
    id: "s5", category: "success",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    name: "Anna Schmidt", age: 30, country: "Germany", countryFlag: "🇩🇪",
    profession: "Fitness App CMO", company: "FitLife", rating: 5,
    quote: "The predictive trend forecasting helped us launch a product line 3 months before competitors.",
    revenueBefore: "€35k/month", revenueAfter: "€89k/month", timeToResult: "5 months", strategiesGenerated: 14,
    results: [{ metric: "Market Share", before: "5%", after: "14%" }],
    timeline: [{ event: "Joined", timeframe: "May 2024" }, { event: "Product launched", timeframe: "30 days later" }],
    badges: ["Verified", "Health", "Trend Forecasting"]
  },
  {
    id: "a1", category: "agency",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop",
    name: "Klaus Weber", age: 42, country: "Germany", countryFlag: "🇩🇪",
    profession: "Agency CEO", company: "Digital Growth GmbH", rating: 5,
    quote: "We manage 40+ client accounts. MakeItAds gives us an unfair advantage on every single one. 12x ROI.",
    revenueBefore: "€45k/month", revenueAfter: "€156k/month", timeToResult: "6 months", strategiesGenerated: 45,
    results: [{ metric: "Client ROI", before: "3.2x", after: "12x" }, { metric: "Retention", before: "70%", after: "95%" }],
    timeline: [{ event: "Joined", timeframe: "Jan 2024" }, { event: "95% retention", timeframe: "5 months later" }],
    badges: ["Verified", "Agency", "Multi-client"]
  },
  // Japan
  {
    id: "s6", category: "success",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    name: "Yuki Tanaka", age: 27, country: "Japan", countryFlag: "🇯🇵",
    profession: "Travel App Growth Manager", company: "TravelGo", rating: 5,
    quote: "The multi-channel analysis showed us we were overspending on TikTok and underspending on Google.",
    revenueBefore: "¥2.1M/month", revenueAfter: "¥5.8M/month", timeToResult: "3 months", strategiesGenerated: 11,
    results: [{ metric: "Blended CAC", before: "¥5,500", after: "¥3,200" }],
    timeline: [{ event: "Joined", timeframe: "March 2024" }, { event: "CAC reduced 41%", timeframe: "30 days later" }],
    badges: ["Verified", "Travel", "Multi-channel"]
  },
  {
    id: "f4", category: "founder",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
    name: "Kenji Yamamoto", age: 44, country: "Japan", countryFlag: "🇯🇵",
    profession: "Auto Repair Founder", company: "AutoFix Tokyo", rating: 5,
    quote: "I was skeptical about AI marketing tools, but the depth of competitor analysis blew me away.",
    revenueBefore: "¥1.8M/month", revenueAfter: "¥4.2M/month", timeToResult: "45 days", strategiesGenerated: 8,
    results: [{ metric: "Bookings", before: "80/mo", after: "210/mo" }],
    timeline: [{ event: "Joined", timeframe: "April 2024" }, { event: "Bookings +160%", timeframe: "45 days later" }],
    badges: ["Verified", "Automotive", "Local SEO"]
  },
  // India
  {
    id: "a2", category: "agency",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop",
    name: "Priya Patel", age: 33, country: "India", countryFlag: "🇮🇳",
    profession: "Strategy Lead", company: "NextGen Ads", rating: 5,
    quote: "We use MakeItAds to audit prospective clients before the first meeting. Our close rate has never been higher.",
    revenueBefore: "₹18L/month", revenueAfter: "₹52L/month", timeToResult: "4 months", strategiesGenerated: 28,
    results: [{ metric: "Close Rate", before: "15%", after: "38%" }],
    timeline: [{ event: "Joined", timeframe: "Feb 2024" }, { event: "Close rate doubled", timeframe: "2 months later" }],
    badges: ["Verified", "Agency", "Pre-sales"]
  },
  {
    id: "s7", category: "success",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop",
    name: "Raj Sharma", age: 32, country: "India", countryFlag: "🇮🇳",
    profession: "Food App Head of Growth", company: "FoodieApp", rating: 5,
    quote: "We discovered a positioning gap that doubled our conversion rate. The AI strategy engine is unlike anything else.",
    revenueBefore: "₹12L/month", revenueAfter: "₹38L/month", timeToResult: "2 months", strategiesGenerated: 13,
    results: [{ metric: "App Installs", before: "1K/mo", after: "5K/mo" }],
    timeline: [{ event: "Joined", timeframe: "April 2024" }, { event: "Installs +400%", timeframe: "60 days later" }],
    badges: ["Verified", "Mobile App", "ASO"]
  },
  // Brazil
  {
    id: "f5", category: "founder",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop",
    name: "Carlos Mendes", age: 31, country: "Brazil", countryFlag: "🇧🇷",
    profession: "Pet Care Founder", company: "PetCare Brasil", rating: 5,
    quote: "I love the weekly brief. It's like having a personalized newsletter of exactly what my competitors are doing.",
    revenueBefore: "R$8k/month", revenueAfter: "R$31k/month", timeToResult: "3 months", strategiesGenerated: 9,
    results: [{ metric: "Market Awareness", before: "Low", after: "High" }],
    timeline: [{ event: "Joined", timeframe: "Jan 2024" }, { event: "Competitor outpaced", timeframe: "3 months later" }],
    badges: ["Verified", "Pet Care", "Competitor Intel"]
  },
  {
    id: "s8", category: "success",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    name: "Maria Silva", age: 32, country: "Brazil", countryFlag: "🇧🇷",
    profession: "Fashion CMO", company: "ChicWear", rating: 5,
    quote: "The A/B testing recommendations alone paid for the annual subscription in the first week.",
    revenueBefore: "R$15k/month", revenueAfter: "R$47k/month", timeToResult: "14 days", strategiesGenerated: 11,
    results: [{ metric: "Winning Variants", before: "10%", after: "65%" }],
    timeline: [{ event: "Joined", timeframe: "May 2024" }, { event: "Conversion +35%", timeframe: "14 days later" }],
    badges: ["Verified", "Fashion", "CRO"]
  },
  // Canada
  {
    id: "f6", category: "founder",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    name: "Alex Rivera", age: 36, country: "Canada", countryFlag: "🇦",
    profession: "EdTech Founder", company: "EduTech", rating: 5,
    quote: "As a solo founder, I don't have time to read 50-page reports. MakeItAds gives me the 3 things I need to do today.",
    revenueBefore: "CAD $5k/month", revenueAfter: "CAD $18k/month", timeToResult: "2 months", strategiesGenerated: 7,
    results: [{ metric: "Time Saved", before: "15h/wk", after: "2h/wk" }],
    timeline: [{ event: "Joined", timeframe: "Jan 2024" }, { event: "Focus improved", timeframe: "Ongoing" }],
    badges: ["Verified", "EdTech", "Productivity"]
  },
  {
    id: "s9", category: "success",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    name: "Marcus Johnson", age: 33, country: "Canada", countryFlag: "🇨🇦",
    profession: "TechFlow CEO", company: "TechFlow", rating: 5,
    quote: "The market opportunity score gave us the confidence to expand into two new verticals.",
    revenueBefore: "CAD $42k/month", revenueAfter: "CAD $98k/month", timeToResult: "3 months", strategiesGenerated: 15,
    results: [{ metric: "New Markets", before: "1", after: "3" }, { metric: "Pipeline", before: "$50K", after: "$210K" }],
    timeline: [{ event: "Joined", timeframe: "Feb 2024" }, { event: "Expanded to 2 markets", timeframe: "90 days later" }],
    badges: ["Verified", "B2B SaaS", "Expansion"]
  },
  // Australia
  {
    id: "f7", category: "founder",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    name: "Daniel Park", age: 35, country: "Australia", countryFlag: "🇦🇺",
    profession: "SmartHome Founder", company: "SmartHome AU", rating: 5,
    quote: "The historical market intelligence helped us avoid a costly mistake. We pivoted based on a 3-year trend analysis.",
    revenueBefore: "AUD $12k/month", revenueAfter: "AUD $38k/month", timeToResult: "1 month", strategiesGenerated: 6,
    results: [{ metric: "Pivot Success", before: "N/A", after: "High" }],
    timeline: [{ event: "Joined", timeframe: "Feb 2024" }, { event: "Successful pivot", timeframe: "1 month later" }],
    badges: ["Verified", "Hardware", "Strategy"]
  },
  {
    id: "a3", category: "agency",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
    name: "Jessica Miller", age: 35, country: "Australia", countryFlag: "🇦🇺",
    profession: "Agency Director", company: "GrowthHackers AU", rating: 5,
    quote: "It cut our strategy development time from 2 weeks to 2 hours. We can now pitch data-backed strategies on the first call.",
    revenueBefore: "AUD $28k/month", revenueAfter: "AUD $89k/month", timeToResult: "2 months", strategiesGenerated: 22,
    results: [{ metric: "Pitch Time", before: "14 days", after: "2 hours" }, { metric: "Win Rate", before: "20%", after: "45%" }],
    timeline: [{ event: "Joined", timeframe: "Feb 2024" }, { event: "Win rate doubled", timeframe: "2 months later" }],
    badges: ["Verified", "Agency", "Sales Enablement"]
  },
  // UAE
  {
    id: "a4", category: "agency",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop",
    name: "Omar Al-Rashid", age: 42, country: "UAE", countryFlag: "🇦",
    profession: "Agency CEO", company: "Apex Agency", rating: 5,
    quote: "We manage 40+ client accounts. MakeItAds gives us an unfair advantage. 12x ROI across the board.",
    revenueBefore: "AED 120k/month", revenueAfter: "AED 380k/month", timeToResult: "5 months", strategiesGenerated: 42,
    results: [{ metric: "Client ROI", before: "3.2x", after: "12x" }, { metric: "Retention", before: "70%", after: "95%" }],
    timeline: [{ event: "Joined", timeframe: "Jan 2024" }, { event: "95% retention", timeframe: "5 months later" }],
    badges: ["Verified", "Agency", "Multi-client"]
  },
  {
    id: "s10", category: "success",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    name: "Ahmed Hassan", age: 37, country: "UAE", countryFlag: "🇦🇪",
    profession: "PropTech Growth Lead", company: "PropTech Dubai", rating: 5,
    quote: "The real-time competitor tracking alerted us to a competitor's price drop within hours. We saved the quarter.",
    revenueBefore: "AED 85k/month", revenueAfter: "AED 156k/month", timeToResult: "2 hours", strategiesGenerated: 16,
    results: [{ metric: "Response Time", before: "2 weeks", after: "2 hours" }],
    timeline: [{ event: "Joined", timeframe: "April 2024" }, { event: "Competitor countered", timeframe: "2 hours later" }],
    badges: ["Verified", "Real Estate", "Real-time Alerts"]
  },
  // South Africa
  {
    id: "f8", category: "founder",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
    name: "Thabo Mbeki", age: 34, country: "South Africa", countryFlag: "🇦",
    profession: "EcoGoods Founder", company: "EcoGoods SA", rating: 5,
    quote: "The sustainability angle was hard to position. MakeItAds found the exact messaging that resonated.",
    revenueBefore: "R12k/month", revenueAfter: "R45k/month", timeToResult: "30 days", strategiesGenerated: 8,
    results: [{ metric: "Engagement", before: "2%", after: "8%" }],
    timeline: [{ event: "Joined", timeframe: "March 2024" }, { event: "Engagement +300%", timeframe: "30 days later" }],
    badges: ["Verified", "Sustainability", "Messaging"]
  },
  {
    id: "a5", category: "agency",
    avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=400&fit=crop",
    name: "Nomsa Dlamini", age: 38, country: "South Africa", countryFlag: "🇦",
    profession: "Creative Director", company: "Bold Creative SA", rating: 5,
    quote: "The creative briefs generated by the AI are surprisingly good. They give our design team a massive head start.",
    revenueBefore: "R35k/month", revenueAfter: "R98k/month", timeToResult: "Ongoing", strategiesGenerated: 31,
    results: [{ metric: "Brief Time", before: "4 hours", after: "30 mins" }],
    timeline: [{ event: "Joined", timeframe: "May 2024" }, { event: "Design speed +400%", timeframe: "Ongoing" }],
    badges: ["Verified", "Agency", "Creative"]
  },
  // Nigeria
  {
    id: "s11", category: "success",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    name: "Chioma Okafor", age: 29, country: "Nigeria", countryFlag: "🇳🇬",
    profession: "Fashion Brand Founder", company: "AfroChic", rating: 5,
    quote: "MakeItAds helped me understand my diaspora audience better. Sales to the US and UK increased by 340%.",
    revenueBefore: "₦850k/month", revenueAfter: "₦3.2M/month", timeToResult: "4 months", strategiesGenerated: 12,
    results: [{ metric: "International Sales", before: "15%", after: "48%" }],
    timeline: [{ event: "Joined", timeframe: "March 2024" }, { event: "Sales +340%", timeframe: "4 months later" }],
    badges: ["Verified", "Fashion", "International"]
  },
  {
    id: "f9", category: "founder",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    name: "Emeka Nwosu", age: 36, country: "Nigeria", countryFlag: "🇳",
    profession: "Tech Startup Founder", company: "PayFast NG", rating: 5,
    quote: "The competitor intelligence showed me exactly where the market gaps were. User base increased by 280%.",
    revenueBefore: "₦1.2M/month", revenueAfter: "₦4.8M/month", timeToResult: "60 days", strategiesGenerated: 9,
    results: [{ metric: "User Base", before: "5K", after: "19K" }],
    timeline: [{ event: "Joined", timeframe: "Feb 2024" }, { event: "Feature launched", timeframe: "30 days later" }],
    badges: ["Verified", "Fintech", "Product-Led"]
  },
  // Kenya
  {
    id: "a6", category: "agency",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    name: "Wanjiku Kamau", age: 31, country: "Kenya", countryFlag: "🇰",
    profession: "Marketing Agency Founder", company: "Nairobi Digital", rating: 5,
    quote: "Managing clients across East Africa was chaotic. MakeItAds standardized our approach and we scaled seamlessly.",
    revenueBefore: "KES 450k/month", revenueAfter: "KES 1.8M/month", timeToResult: "6 months", strategiesGenerated: 35,
    results: [{ metric: "Active Clients", before: "8", after: "28" }],
    timeline: [{ event: "Joined", timeframe: "Jan 2024" }, { event: "Scaled to 28 clients", timeframe: "6 months later" }],
    badges: ["Verified", "Agency", "Automation"]
  },
  {
    id: "s12", category: "success",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    name: "Brian Otieno", age: 33, country: "Kenya", countryFlag: "🇰",
    profession: "AgriTech Growth Manager", company: "FarmConnect", rating: 5,
    quote: "The local market insights were incredibly accurate. Farmer adoption increased by 420%.",
    revenueBefore: "KES 280k/month", revenueAfter: "KES 1.1M/month", timeToResult: "3 months", strategiesGenerated: 10,
    results: [{ metric: "Farmer Adoption", before: "120", after: "624" }],
    timeline: [{ event: "Joined", timeframe: "April 2024" }, { event: "Adoption +420%", timeframe: "90 days later" }],
    badges: ["Verified", "AgriTech", "Local Market"]
  },
  // Singapore
  {
    id: "a7", category: "agency",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    name: "Robert Chen", age: 43, country: "Singapore", countryFlag: "🇬",
    profession: "Agency CEO", company: "AsiaGrowth", rating: 5,
    quote: "We manage clients across 5 countries. MakeItAds handles the localization perfectly. A true global tool.",
    revenueBefore: "SGD $45k/month", revenueAfter: "SGD $128k/month", timeToResult: "1 month", strategiesGenerated: 38,
    results: [{ metric: "Markets Managed", before: "2", after: "5" }],
    timeline: [{ event: "Joined", timeframe: "Feb 2024" }, { event: "5 markets active", timeframe: "1 month later" }],
    badges: ["Verified", "Agency", "Global"]
  },
  {
    id: "s13", category: "success",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    name: "Michelle Tan", age: 34, country: "Singapore", countryFlag: "🇸🇬",
    profession: "Beauty Brand CMO", company: "GlowAsia", rating: 5,
    quote: "The A/B testing recommendations paid for the annual subscription in the first week. Conversion jumped to 5.2%.",
    revenueBefore: "SGD $28k/month", revenueAfter: "SGD $76k/month", timeToResult: "14 days", strategiesGenerated: 11,
    results: [{ metric: "Conversion Rate", before: "1.8%", after: "5.2%" }],
    timeline: [{ event: "Joined", timeframe: "May 2024" }, { event: "Conversion +189%", timeframe: "14 days later" }],
    badges: ["Verified", "Beauty", "CRO"]
  },
  // Mexico
  {
    id: "f10", category: "founder",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
    name: "Diego Hernandez", age: 31, country: "Mexico", countryFlag: "🇲🇽",
    profession: "Food Delivery Founder", company: "ComidaRápida", rating: 5,
    quote: "Understanding the local competition was key. We became #2 in our city in 90 days.",
    revenueBefore: "MXN $85k/month", revenueAfter: "MXN $280k/month", timeToResult: "90 days", strategiesGenerated: 13,
    results: [{ metric: "Market Position", before: "#8", after: "#2" }],
    timeline: [{ event: "Joined", timeframe: "March 2024" }, { event: "Position #2 achieved", timeframe: "90 days later" }],
    badges: ["Verified", "Food Delivery", "Local Market"]
  },
  {
    id: "s14", category: "success",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
    name: "Carmen Lopez", age: 35, country: "Mexico", countryFlag: "🇽",
    profession: "E-commerce Director", company: "ModaMX", rating: 5,
    quote: "The audience segmentation was incredibly precise. Our ROAS went from 1.9x to 5.8x.",
    revenueBefore: "MXN $120k/month", revenueAfter: "MXN $340k/month", timeToResult: "45 days", strategiesGenerated: 14,
    results: [{ metric: "ROAS", before: "1.9x", after: "5.8x" }],
    timeline: [{ event: "Joined", timeframe: "April 2024" }, { event: "ROAS +205%", timeframe: "45 days later" }],
    badges: ["Verified", "E-commerce", "Audience Targeting"]
  },
  // Spain
  {
    id: "a8", category: "agency",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop",
    name: "Carlos Mendez", age: 37, country: "Spain", countryFlag: "🇪🇸",
    profession: "Agency Founder", company: "ScaleUp Media", rating: 5,
    quote: "MakeItAds standardized our onboarding, allowing us to scale from 10 to 35 clients without hiring more staff.",
    revenueBefore: "€35k/month", revenueAfter: "€112k/month", timeToResult: "6 months", strategiesGenerated: 41,
    results: [{ metric: "Active Clients", before: "10", after: "35" }, { metric: "Team Size", before: "4", after: "4" }],
    timeline: [{ event: "Joined", timeframe: "Jan 2024" }, { event: "Scaled to 35 clients", timeframe: "6 months later" }],
    badges: ["Verified", "Agency", "Automation"]
  },
  {
    id: "s15", category: "success",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    name: "Elena Rodriguez", age: 36, country: "Spain", countryFlag: "🇪🇸",
    profession: "Beauty Brand Director", company: "Bella Vita", rating: 5,
    quote: "We stopped guessing and started executing with confidence. CPA dropped by 41% in the first month.",
    revenueBefore: "€22k/month", revenueAfter: "€58k/month", timeToResult: "45 days", strategiesGenerated: 9,
    results: [{ metric: "CPA", before: "€38", after: "€22" }, { metric: "Leads", before: "120/mo", after: "410/mo" }],
    timeline: [{ event: "Joined", timeframe: "April 2024" }, { event: "Leads +240%", timeframe: "30 days later" }],
    badges: ["Verified", "Beauty", "TikTok Ads"]
  },
  // Ireland
  {
    id: "a9", category: "agency",
    avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    name: "Liam O'Connor", age: 31, country: "Ireland", countryFlag: "🇮",
    profession: "Account Manager", company: "Digital Spark", rating: 5,
    quote: "The white-label reports are a massive time saver. Our clients think we have a team of 20 analysts.",
    revenueBefore: "€28k/month", revenueAfter: "€87k/month", timeToResult: "3 months", strategiesGenerated: 26,
    results: [{ metric: "Report Time", before: "6 hours", after: "15 mins" }, { metric: "Client NPS", before: "65", after: "82" }],
    timeline: [{ event: "Joined", timeframe: "March 2024" }, { event: "NPS increased to 82", timeframe: "3 months later" }],
    badges: ["Verified", "Agency", "White-label"]
  },
  {
    id: "f11", category: "founder",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    name: "Siobhan Murphy", age: 38, country: "Ireland", countryFlag: "🇮🇪",
    profession: "SaaS Founder", company: "CloudSync IE", rating: 5,
    quote: "The competitor tracking alerted us to a major market shift 3 weeks before competitors reacted. We captured 18% market share.",
    revenueBefore: "€42k/month", revenueAfter: "€118k/month", timeToResult: "3 weeks", strategiesGenerated: 17,
    results: [{ metric: "Market Share", before: "3%", after: "18%" }],
    timeline: [{ event: "Joined", timeframe: "Feb 2024" }, { event: "Market share 18%", timeframe: "3 weeks later" }],
    badges: ["Verified", "SaaS", "Competitor Intel"]
  },
];