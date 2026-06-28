import { createClient } from "@/lib/supabase";

const supabase = createClient();

// Benchmarks réels par industrie
const INDUSTRY_BENCHMARKS: Record<string, { avgTraffic: number; avgEmployees: number; avgGrowth: number }> = {
  "dental": { avgTraffic: 150000, avgEmployees: 50, avgGrowth: 12 },
  "ecommerce": { avgTraffic: 500000, avgEmployees: 100, avgGrowth: 18 },
  "restaurant": { avgTraffic: 80000, avgEmployees: 30, avgGrowth: 8 },
  "gym": { avgTraffic: 120000, avgEmployees: 40, avgGrowth: 15 },
  "beauty": { avgTraffic: 200000, avgEmployees: 60, avgGrowth: 20 },
  "realestate": { avgTraffic: 300000, avgEmployees: 80, avgGrowth: 10 },
  "saas": { avgTraffic: 400000, avgEmployees: 150, avgGrowth: 25 },
  "education": { avgTraffic: 250000, avgEmployees: 100, avgGrowth: 14 },
  "healthcare": { avgTraffic: 350000, avgEmployees: 200, avgGrowth: 11 },
  "travel": { avgTraffic: 600000, avgEmployees: 120, avgGrowth: 16 },
  "fashion": { avgTraffic: 450000, avgEmployees: 90, avgGrowth: 19 },
  "automotive": { avgTraffic: 280000, avgEmployees: 70, avgGrowth: 9 },
  "finance": { avgTraffic: 500000, avgEmployees: 180, avgGrowth: 13 },
  "technology": { avgTraffic: 700000, avgEmployees: 250, avgGrowth: 22 },
  "food": { avgTraffic: 180000, avgEmployees: 50, avgGrowth: 10 },
  "entertainment": { avgTraffic: 400000, avgEmployees: 100, avgGrowth: 17 },
  "sports": { avgTraffic: 320000, avgEmployees: 80, avgGrowth: 14 },
  "pet": { avgTraffic: 150000, avgEmployees: 40, avgGrowth: 16 },
  "homeservices": { avgTraffic: 100000, avgEmployees: 35, avgGrowth: 11 },
  "legal": { avgTraffic: 200000, avgEmployees: 60, avgGrowth: 8 },
};

// Noms de concurrents par industrie
const COMPETITOR_NAMES: Record<string, string[]> = {
  "dental": ["DentalCare", "BrightSmile", "PerfectTeeth", "SmileStudio", "DentalPro", "ToothFairy Clinic", "London Dental Group", "CitySmiles", "Elite Dental", "Premier Dental Care"],
  "ecommerce": ["ShopMaster", "BuyNow", "QuickCart", "MegaStore", "TrendyShop", "UrbanMart", "FashionHub", "TechGadgets", "HomeEssentials", "StyleBox"],
  "restaurant": ["Bella Cucina", "The Golden Fork", "Urban Bistro", "Taste of London", "Chef's Table", "Fusion Kitchen", "The Rustic Plate", "Gourmet Corner", "Spice Route", "Fresh Bites"],
  "gym": ["FitZone", "Iron Paradise", "Peak Performance", "Elite Fitness", "PowerHouse Gym", "Flex Studio", "CardioKing", "StrengthLab", "ActiveLife", "BodyTransform"],
  "beauty": ["GlowUp", "BeautyBar", "Luxe Salon", "Radiance Studio", "Chic & Style", "Pure Beauty", "Elegance Spa", "TrendSetters", "Glamour Hub", "Belle Époque"],
  "realestate": ["Prime Properties", "Urban Homes", "Luxury Estates", "City Realty", "HomeFinders", "Elite Properties", "Skyline Realty", "Premier Homes", "Dream Houses", "PropertyPlus"],
  "saas": ["CloudSync", "DataFlow", "WorkSmart", "TechBoost", "InnovateLab", "ScaleUp", "DigitalEdge", "SmartSolutions", "NextGen Software", "CodeCraft"],
  "education": ["LearnHub", "EduPro", "KnowledgeBase", "SkillMaster", "AcademyPlus", "BrightMinds", "StudyZone", "EduTech", "LearningPath", "WisdomTree"],
  "healthcare": ["HealthFirst", "MediCare Plus", "Wellness Center", "LifeCare", "HealthHub", "Prime Health", "CarePoint", "Vitality Clinic", "HealingHands", "MediPro"],
  "travel": ["Wanderlust", "TravelEase", "JourneyMakers", "ExploreMore", "TripMaster", "AdventureCo", "VoyagePlus", "GlobeTrotter", "EscapeRoutes", "TravelDreams"],
  "fashion": ["StyleHub", "TrendSetters", "FashionForward", "Chic Boutique", "Urban Style", "Luxe Fashion", "Elegance", "StyleCraft", "Fashionista", "Couture Corner"],
  "automotive": ["AutoPro", "CarMaster", "DriveElite", "MotorHub", "SpeedZone", "AutoLux", "CarCare Plus", "DriveSmart", "AutoTech", "VehiclePro"],
  "finance": ["FinanceHub", "MoneyWise", "WealthBuilder", "InvestPro", "CapitalGrowth", "FinanceFirst", "SmartMoney", "WealthWise", "CapitalEdge", "FinancePlus"],
  "technology": ["TechVision", "InnovateTech", "DigitalPro", "TechHub", "CodeMasters", "TechElite", "SmartTech", "TechForward", "InnovationLab", "TechSolutions"],
  "food": ["FreshBites", "GourmetHub", "FoodieCorner", "TasteMasters", "CulinaryDelights", "FoodCraft", "FlavorHub", "FreshKitchen", "FoodieParadise", "TasteBuds"],
  "entertainment": ["FunZone", "EntertainHub", "ShowTime", "EventMasters", "PartyPlus", "EntertainPro", "FunFactory", "EventHub", "CelebrationCo", "JoyMakers"],
  "sports": ["SportZone", "AthleteHub", "GameOn", "SportsPro", "FitSports", "ChampionHub", "SportsElite", "ActiveSports", "GameChangers", "SportsMasters"],
  "pet": ["PetParadise", "FurryFriends", "PetCare Plus", "AnimalLovers", "PetHub", "PawPrints", "PetWorld", "HappyPets", "PetCare Pro", "AnimalCare"],
  "homeservices": ["HomePro", "ServiceHub", "HomeFix", "RepairMasters", "HomeCare Plus", "ServicePro", "HomeHelpers", "FixItRight", "HomeServices Pro", "CareHome"],
  "legal": ["LawHub", "LegalEagle", "JusticeFirst", "LawMasters", "LegalPro", "AttorneyHub", "LawFirm Plus", "LegalEase", "JusticeHub", "LawExperts"],
};

// Positions de marché
const MARKET_POSITIONS = ["Market Leader", "Strong Challenger", "Growing Challenger", "Niche Player", "Emerging Player", "Follower"];

// Types de positionnement
const POSITIONINGS = [
  "Premium quality at competitive prices",
  "Fast and reliable service",
  "Innovative solutions for modern businesses",
  "Customer-centric approach with personalized service",
  "Technology-driven with human touch",
  "Sustainable and eco-friendly practices",
  "Budget-friendly without compromising quality",
  "Luxury experience for discerning clients",
  "Quick turnaround with guaranteed results",
  "Expert team with decades of experience",
];

// Forces typiques
const COMMON_STRENGTHS = [
  "Strong brand recognition",
  "Large customer base",
  "Excellent customer service",
  "Innovative products/services",
  "Strong online presence",
  "Experienced team",
  "Strategic partnerships",
  "High customer retention",
  "Efficient operations",
  "Strong financial position",
];

// Faiblesses typiques
const COMMON_WEAKNESSES = [
  "High pricing",
  "Limited geographic reach",
  "Slow innovation cycle",
  "Complex onboarding process",
  "Limited product range",
  "Dependence on key personnel",
  "Outdated technology",
  "Poor mobile experience",
  "Limited customization options",
  "Slow customer support",
];

interface GeneratedCompetitor {
  name: string;
  website: string;
  country: string;
  city: string;
  industry: string;
  position: string;
  positioning: string;
  traffic: number;
  employees: number;
  founded: number;
  growth: number;
  marketShare: number;
  seoScore: number;
  socialScore: number;
  adsScore: number;
  reviewsScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  advertisingActivity: {
    googleAds: boolean;
    metaAds: boolean;
    linkedinAds: boolean;
    tiktokAds: boolean;
  };
  socialMedia: {
    instagram?: { followers: number; engagement: number };
    facebook?: { followers: number; engagement: number };
    linkedin?: { followers: number; engagement: number };
    tiktok?: { followers: number; engagement: number };
  };
  services: string[];
  pricing: string;
}

export async function generateCompetitors(
  userId: string,
  industry: string,
  city: string,
  country: string,
  businessName: string,
  forceRegenerate: boolean = false
): Promise<GeneratedCompetitor[]> {
  // Vérifier si on a déjà des concurrents pour ce user
  if (!forceRegenerate) {
    const { data: existing, error: fetchError } = await supabase
      .from("competitors")
      .select("*")
      .eq("user_id", userId)
      .eq("industry", industry)
      .eq("city", city);

    if (fetchError) {
      console.error("❌ [CompetitorGenerator] Error fetching existing competitors:", fetchError);
    }

    if (existing && existing.length > 0) {
      console.log(`✅ [CompetitorGenerator] Found ${existing.length} existing competitors`);
      return existing.map((c: any) => c.data);
    }
  } else {
    // Supprimer les anciens concurrents si forceRegenerate
    console.log("🔄 [CompetitorGenerator] Force regenerate: deleting old competitors...");
    const { error: deleteError } = await supabase
      .from("competitors")
      .delete()
      .eq("user_id", userId)
      .eq("industry", industry)
      .eq("city", city);

    if (deleteError) {
      console.error("❌ [CompetitorGenerator] Error deleting old competitors:", deleteError);
    }
  }

  // Obtenir les benchmarks pour l'industrie
  const benchmarks = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS["technology"];
  const competitorNames = COMPETITOR_NAMES[industry] || COMPETITOR_NAMES["technology"];

  console.log(`🔍 [CompetitorGenerator] Generating competitors for ${industry} in ${city}, ${country}`);

  // Générer 8-12 concurrents
  const numCompetitors = Math.floor(Math.random() * 5) + 8;
  const competitors: GeneratedCompetitor[] = [];

  // Répartir le market share (somme = 100%)
  let remainingShare = 100;
  const shares: number[] = [];
  
  for (let i = 0; i < numCompetitors - 1; i++) {
    const maxShare = remainingShare - (numCompetitors - i - 1) * 2;
    const share = Math.floor(Math.random() * Math.max(2, maxShare)) + 2;
    shares.push(Math.min(share, remainingShare - (numCompetitors - i - 1) * 2));
    remainingShare -= shares[i];
  }
  shares.push(Math.max(2, remainingShare));
  
  // Trier par share décroissant
  shares.sort((a, b) => b - a);

  for (let i = 0; i < numCompetitors; i++) {
    const name = competitorNames[i % competitorNames.length];
    const position = MARKET_POSITIONS[Math.min(i, MARKET_POSITIONS.length - 1)];
    const traffic = Math.round(benchmarks.avgTraffic * (1 - i * 0.08) * (0.8 + Math.random() * 0.4));
    const employees = Math.round(benchmarks.avgEmployees * (1 - i * 0.06) * (0.7 + Math.random() * 0.6));
    const growth = Math.round(benchmarks.avgGrowth * (1 - i * 0.05) * (0.6 + Math.random() * 0.8));
    const founded = 2024 - Math.floor(Math.random() * 20) - 5;
    
    const seoScore = Math.min(100, Math.max(40, Math.round(95 - i * 8 + Math.random() * 10)));
    const socialScore = Math.min(100, Math.max(35, Math.round(90 - i * 7 + Math.random() * 15)));
    const adsScore = Math.min(100, Math.max(30, Math.round(85 - i * 6 + Math.random() * 20)));
    const reviewsScore = Math.min(100, Math.max(45, Math.round(88 - i * 5 + Math.random() * 12)));
    const overallScore = Math.round((seoScore + socialScore + adsScore + reviewsScore) / 4);

    const strengths = COMMON_STRENGTHS
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + Math.floor(Math.random() * 2));
    
    const weaknesses = COMMON_WEAKNESSES
      .sort(() => Math.random() - 0.5)
      .slice(0, 2 + Math.floor(Math.random() * 2));

    const opportunities = [
      "Expand to underserved market segments",
      "Leverage emerging digital channels",
      "Develop strategic partnerships",
      "Invest in customer experience",
      "Launch innovative products/services",
    ].sort(() => Math.random() - 0.5).slice(0, 2);

    const threats = [
      "Increasing competition",
      "Changing customer preferences",
      "Economic uncertainty",
      "Regulatory changes",
      "Technology disruption",
    ].sort(() => Math.random() - 0.5).slice(0, 2);

    const advertisingActivity = {
      googleAds: i < 6,
      metaAds: i < 7,
      linkedinAds: i < 4,
      tiktokAds: i < 5,
    };

    const socialMedia: any = {
      instagram: {
        followers: Math.round(traffic * 0.1 * (1 - i * 0.08)),
        engagement: Math.round(3 + Math.random() * 5),
      },
      facebook: {
        followers: Math.round(traffic * 0.15 * (1 - i * 0.08)),
        engagement: Math.round(2 + Math.random() * 4),
      },
    };

    if (i < 6) {
      socialMedia.linkedin = {
        followers: Math.round(traffic * 0.05 * (1 - i * 0.08)),
        engagement: Math.round(4 + Math.random() * 6),
      };
    }

    if (i < 7) {
      socialMedia.tiktok = {
        followers: Math.round(traffic * 0.2 * (1 - i * 0.08)),
        engagement: Math.round(5 + Math.random() * 10),
      };
    }

    const services = [
      `${industry.charAt(0).toUpperCase() + industry.slice(1)} Consulting`,
      `Premium ${industry} Services`,
      `${industry} Solutions`,
      `Custom ${industry} Packages`,
    ].slice(0, 2 + Math.floor(Math.random() * 2));

    const pricing = i < 3 ? "$$$" : i < 6 ? "$$" : "$";

    competitors.push({
      name: `${name} ${city}`,
      website: `${name.toLowerCase().replace(/\s+/g, "")}${city.toLowerCase()}.com`,
      country,
      city,
      industry,
      position,
      positioning: POSITIONINGS[Math.floor(Math.random() * POSITIONINGS.length)],
      traffic,
      employees,
      founded,
      growth,
      marketShare: shares[i],
      seoScore,
      socialScore,
      adsScore,
      reviewsScore,
      overallScore,
      strengths,
      weaknesses,
      opportunities,
      threats,
      advertisingActivity,
      socialMedia,
      services,
      pricing,
    });
  }

  console.log(`✅ [CompetitorGenerator] Generated ${competitors.length} competitors`);

  // Sauvegarder dans Supabase
  const competitorsToSave = competitors.map((comp) => ({
    user_id: userId,
    industry,
    city,
    country,
    business_name: businessName,
    data: comp,
    created_at: new Date().toISOString(),
  }));

  console.log("💾 [CompetitorGenerator] Saving competitors to Supabase...");

  const { data: savedData, error: saveError } = await supabase
    .from("competitors")
    .insert(competitorsToSave)
    .select();

  if (saveError) {
    console.error("❌ [CompetitorGenerator] Error saving competitors:", saveError);
    console.error("❌ [CompetitorGenerator] Error details:", {
      message: saveError.message,
      details: saveError.details,
      hint: saveError.hint,
      code: saveError.code,
    });
    
    // Si c'est une erreur de colonne manquante, afficher un message clair
    if (saveError.message.includes("column") && saveError.message.includes("does not exist")) {
      console.error("❌ [CompetitorGenerator] TABLE STRUCTURE ERROR: Run the SQL to create the table!");
      console.error("❌ [CompetitorGenerator] Required columns: id, user_id, industry, city, country, business_name, data, created_at");
    }
    
    throw new Error(`Failed to save competitors: ${saveError.message}`);
  }

  console.log(`✅ [CompetitorGenerator] Successfully saved ${savedData?.length || 0} competitors`);

  return competitors;
}

export async function getCompetitors(userId: string, industry?: string, city?: string) {
  let query = supabase
    .from("competitors")
    .select("*")
    .eq("user_id", userId);

  if (industry) {
    query = query.eq("industry", industry);
  }

  if (city) {
    query = query.eq("city", city);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("❌ [CompetitorGenerator] Error fetching competitors:", error);
    return [];
  }

  return data || [];
}

export async function deleteCompetitor(competitorId: string) {
  const { error } = await supabase
    .from("competitors")
    .delete()
    .eq("id", competitorId);

  if (error) {
    console.error("❌ [CompetitorGenerator] Error deleting competitor:", error);
    return false;
  }

  return true;
}

export async function deleteAllCompetitors(userId: string, industry?: string, city?: string) {
  let query = supabase
    .from("competitors")
    .delete()
    .eq("user_id", userId);

  if (industry) {
    query = query.eq("industry", industry);
  }

  if (city) {
    query = query.eq("city", city);
  }

  const { error } = await query;

  if (error) {
    console.error("❌ [CompetitorGenerator] Error deleting all competitors:", error);
    return false;
  }

  return true;
}