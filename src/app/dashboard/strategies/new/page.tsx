"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Sparkles, X, Globe, Search, Plus, Minus, Save, Crown, Zap, Lock } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { usePermissions } from "@/hooks/usePermissions";
import { useUsage } from "@/hooks/useUsage";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

const supabase = createClient();

const INDUSTRIES = [
  { id: "dental", name: "Dental Clinic", image: "/images/industry-dental.jpg" },
  { id: "ecommerce", name: "E-commerce", image: "/images/industry-ecommerce.jpg" },
  { id: "restaurant", name: "Restaurant", image: "/images/industry-restaurant.jpg" },
  { id: "gym", name: "Gym & Fitness", image: "/images/industry-gym.jpg" },
  { id: "beauty", name: "Beauty Brand", image: "/images/industry-beauty.jpg" },
  { id: "realestate", name: "Real Estate", image: "/images/industry-realestate.jpg" },
  { id: "saas", name: "SaaS", image: "/images/industry-saas.jpg" },
  { id: "education", name: "Education", image: "/images/industry-education.jpg" },
  { id: "healthcare", name: "Healthcare", image: "/images/industry-healthcare.jpg" },
  { id: "travel", name: "Travel", image: "/images/industry-travel.jpg" },
  { id: "fashion", name: "Fashion", image: "/images/industry-fashion.jpg" },
  { id: "automotive", name: "Automotive", image: "/images/industry-automotive.jpg" },
  { id: "finance", name: "Finance", image: "/images/industry-finance.jpg" },
  { id: "technology", name: "Technology", image: "/images/industry-technology.jpg" },
  { id: "food", name: "Food & Beverage", image: "/images/industry-food.jpg" },
  { id: "entertainment", name: "Entertainment", image: "/images/industry-entertainment.jpg" },
  { id: "sports", name: "Sports", image: "/images/industry-sports.jpg" },
  { id: "pet", name: "Pet Services", image: "/images/industry-pet.jpg" },
  { id: "homeservices", name: "Home Services", image: "/images/industry-homeservices.jpg" },
  { id: "legal", name: "Legal Services", image: "/images/industry-legal.jpg" },
];

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

const BUSINESS_MODELS = [
  { id: "b2c", name: "B2C", description: "Business to Consumer" },
  { id: "b2b", name: "B2B", description: "Business to Business" },
  { id: "b2b2c", name: "B2B2C", description: "Business to Business to Consumer" },
  { id: "marketplace", name: "Marketplace", description: "Platform connecting buyers and sellers" },
  { id: "saas", name: "SaaS", description: "Software as a Service" },
  { id: "subscription", name: "Subscription", description: "Recurring revenue model" },
  { id: "freemium", name: "Freemium", description: "Free basic + paid premium" },
  { id: "ecommerce", name: "E-commerce", description: "Online retail" },
  { id: "d2c", name: "D2C", description: "Direct to Consumer" },
  { id: "agency", name: "Agency", description: "Service-based business" },
];

const MATURITY_STAGES = [
  { id: "startup", name: "Startup", description: "0-2 years, finding product-market fit" },
  { id: "growth", name: "Growth", description: "2-5 years, scaling operations" },
  { id: "established", name: "Established", description: "5+ years, stable market position" },
  { id: "enterprise", name: "Enterprise", description: "Large organization, multiple markets" },
];

const GOALS = [
  "Increase brand awareness",
  "Generate more leads",
  "Boost online sales",
  "Improve customer retention",
  "Expand to new markets",
  "Launch a new product",
  "Improve SEO ranking",
  "Increase social media engagement",
  "Build thought leadership",
  "Enter new geographic markets",
];

const TARGET_AUDIENCES = [
  "Young professionals (25-35)",
  "Families with children",
  "Small business owners",
  "Enterprise decision makers",
  "Students and young adults",
  "Retirees and seniors",
  "Tech-savvy millennials",
  "Health-conscious consumers",
  "High-net-worth individuals",
  "Local community members",
];

const BUDGETS = [
  { value: 500, label: "$500/mo", description: "Starter" },
  { value: 1500, label: "$1,500/mo", description: "Growth" },
  { value: 2500, label: "$2,500/mo", description: "Professional" },
  { value: 5000, label: "$5,000/mo", description: "Scale" },
  { value: 10000, label: "$10,000+/mo", description: "Enterprise" },
];

const TONES = [
  "Professional & Corporate",
  "Friendly & Approachable",
  "Bold & Innovative",
  "Luxury & Premium",
  "Casual & Fun",
  "Trustworthy & Reliable",
  "Educational & Informative",
  "Inspirational & Motivational",
];

const MARKETING_CHANNELS = [
  "Meta (Facebook/Instagram)",
  "Google Ads",
  "TikTok",
  "LinkedIn",
  "YouTube",
  "Twitter/X",
  "Pinterest",
  "Email Marketing",
  "SEO/Content Marketing",
  "Influencer Marketing",
  "Podcast Advertising",
  "Print Media",
];

const GENERATION_MESSAGES = [
  "Analyzing your market...",
  "Scanning competitors...",
  "Identifying opportunities...",
  "Building your strategy...",
  "Optimizing budget allocation...",
  "Finalizing recommendations...",
];

type FormStep =
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

export default function NewStrategyPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const { userPlan, isFree, isPro, isPremium, isEnterprise } = usePermissions();
  const { usage, loading: usageLoading, recordUsage } = useUsage();
  
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [step, setStep] = useState<FormStep>("industry");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [city, setCity] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [showCustomCountry, setShowCustomCountry] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedBusinessModel, setSelectedBusinessModel] = useState("");
  const [selectedMaturity, setSelectedMaturity] = useState("");
  const [products, setProducts] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState("");
  const [newService, setNewService] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState("");
  const [idealCustomer, setIdealCustomer] = useState("");
  const [customerPainPoints, setCustomerPainPoints] = useState<string[]>([]);
  const [newPainPoint, setNewPainPoint] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(2500);
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [competitiveAdvantages, setCompetitiveAdvantages] = useState<string[]>([]);
  const [newAdvantage, setNewAdvantage] = useState("");
  const [brandPositioning, setBrandPositioning] = useState("");
  const [positioningStatement, setPositioningStatement] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [existingChannels, setExistingChannels] = useState<string[]>([]);
  const [preferredChannels, setPreferredChannels] = useState<string[]>([]);
  const [keyChallenges, setKeyChallenges] = useState<string[]>([]);
  const [newChallenge, setNewChallenge] = useState("");
  const [uniqueValueProposition, setUniqueValueProposition] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [genMessage, setGenMessage] = useState(0);

  const canGenerate = usage.canGenerateStrategy;
  const strategiesUsed = usage.strategiesUsed;
  const strategiesLimit = usage.strategiesLimit;
  const isUnlimited = strategiesLimit === -1;

  useEffect(() => {
    const loadSavedProfile = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profile) {
          setHasSavedProfile(true);
          
          if (profile.business_name) setBusinessName(profile.business_name);
          if (profile.industry) setSelectedIndustry(profile.industry);
          if (profile.country) setSelectedCountry(profile.country);
          if (profile.city) setCity(profile.city);
          if (profile.business_model) setSelectedBusinessModel(profile.business_model);
          if (profile.maturity) setSelectedMaturity(profile.maturity);
          if (profile.products) setProducts(profile.products.split(",").filter(Boolean));
          if (profile.services) setServices(profile.services.split(",").filter(Boolean));
          if (profile.target_audience) setSelectedAudience(profile.target_audience);
          if (profile.ideal_customer) setIdealCustomer(profile.ideal_customer);
          if (profile.customer_pain_points) setCustomerPainPoints(profile.customer_pain_points.split(",").filter(Boolean));
          if (profile.budget) setSelectedBudget(profile.budget);
          if (profile.competitors) setCompetitors(profile.competitors.split(",").filter(Boolean));
          if (profile.competitive_advantages) setCompetitiveAdvantages(profile.competitive_advantages.split(",").filter(Boolean));
          if (profile.brand_positioning) setBrandPositioning(profile.brand_positioning);
          if (profile.positioning_statement) setPositioningStatement(profile.positioning_statement);
          if (profile.tone) setSelectedTone(profile.tone);
          if (profile.existing_channels) setExistingChannels(profile.existing_channels.split(",").filter(Boolean));
          if (profile.marketing_channels) setPreferredChannels(profile.marketing_channels.split(",").filter(Boolean));
          if (profile.key_challenges) setKeyChallenges(profile.key_challenges.split(",").filter(Boolean));
          if (profile.unique_value_proposition) setUniqueValueProposition(profile.unique_value_proposition);
          if (profile.additional_notes) setAdditionalNotes(profile.additional_notes);
          if (profile.goals) setSelectedGoals(profile.goals.split(",").filter(Boolean));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setProfileLoaded(true);
      }
    };

    loadSavedProfile();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (step === "generating") {
      const interval = setInterval(() => {
        setGenMessage((prev) => (prev + 1) % GENERATION_MESSAGES.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (loading || !profileLoaded || usageLoading) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#6366f1] mx-auto mb-3 sm:mb-4" />
          <p className="text-xs sm:text-sm text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const steps: FormStep[] = [
    "industry", "business-name", "location", "business-model", "products-services",
    "goals", "target-audience", "customer-pain-points", "budget", "competitors",
    "brand-positioning", "channels", "challenges", "generating",
  ];

  const handleNext = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case "industry": return !!selectedIndustry;
      case "business-name": return businessName.trim().length > 0;
      case "location": return !!selectedCountry || !!customCountry;
      case "business-model": return !!selectedBusinessModel && !!selectedMaturity;
      case "products-services": return products.length > 0 || services.length > 0;
      case "goals": return selectedGoals.length > 0;
      case "target-audience": return !!selectedAudience && idealCustomer.trim().length > 0;
      case "customer-pain-points": return customerPainPoints.length > 0;
      case "budget": return !!selectedBudget;
      case "competitors": return competitiveAdvantages.length > 0;
      case "brand-positioning": return !!selectedTone && brandPositioning.trim().length > 0;
      case "channels": return true;
      case "challenges": return true;
      default: return false;
    }
  };

  const handleCountrySelect = (country: string) => {
    if (country === "__custom__") {
      setShowCustomCountry(true);
      setSelectedCountry("");
    } else {
      setSelectedCountry(country);
      setShowCustomCountry(false);
    }
  };

  const handleCustomCountryConfirm = () => {
    if (customCountry.trim()) {
      setSelectedCountry(customCountry.trim());
      setShowCustomCountry(false);
      setCustomCountry("");
    }
  };

  const filteredCountries = ALL_COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const addProduct = () => {
    if (newProduct.trim() && !products.includes(newProduct.trim())) {
      setProducts([...products, newProduct.trim()]);
      setNewProduct("");
    }
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const addPainPoint = () => {
    if (newPainPoint.trim() && !customerPainPoints.includes(newPainPoint.trim())) {
      setCustomerPainPoints([...customerPainPoints, newPainPoint.trim()]);
      setNewPainPoint("");
    }
  };

  const removePainPoint = (index: number) => {
    setCustomerPainPoints(customerPainPoints.filter((_, i) => i !== index));
  };

  const addCompetitor = () => {
    if (newCompetitor.trim() && !competitors.includes(newCompetitor.trim())) {
      setCompetitors([...competitors, newCompetitor.trim()]);
      setNewCompetitor("");
    }
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const addAdvantage = () => {
    if (newAdvantage.trim() && !competitiveAdvantages.includes(newAdvantage.trim())) {
      setCompetitiveAdvantages([...competitiveAdvantages, newAdvantage.trim()]);
      setNewAdvantage("");
    }
  };

  const removeAdvantage = (index: number) => {
    setCompetitiveAdvantages(competitiveAdvantages.filter((_, i) => i !== index));
  };

  const addChallenge = () => {
    if (newChallenge.trim() && !keyChallenges.includes(newChallenge.trim())) {
      setKeyChallenges([...keyChallenges, newChallenge.trim()]);
      setNewChallenge("");
    }
  };

  const removeChallenge = (index: number) => {
    setKeyChallenges(keyChallenges.filter((_, i) => i !== index));
  };

  const toggleChannel = (channel: string, type: "existing" | "preferred") => {
    if (type === "existing") {
      setExistingChannels((prev) =>
        prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
      );
    } else {
      setPreferredChannels((prev) =>
        prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
      );
    }
  };

  const saveBusinessProfile = async () => {
    if (!user || !saveAsDefault) return;

    try {
      const profileData = {
        user_id: user.id,
        business_name: businessName,
        industry: selectedIndustry,
        country: selectedCountry || customCountry,
        city: city,
        business_model: selectedBusinessModel,
        maturity: selectedMaturity,
        products: products.join(","),
        services: services.join(","),
        goals: selectedGoals.join(","),
        target_audience: selectedAudience,
        ideal_customer: idealCustomer,
        customer_pain_points: customerPainPoints.join(","),
        budget: selectedBudget,
        competitors: competitors.join(","),
        competitive_advantages: competitiveAdvantages.join(","),
        brand_positioning: brandPositioning,
        positioning_statement: positioningStatement,
        tone: selectedTone,
        existing_channels: existingChannels.join(","),
        marketing_channels: preferredChannels.join(","),
        key_challenges: keyChallenges.join(","),
        unique_value_proposition: uniqueValueProposition,
        additional_notes: additionalNotes,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("business_profiles")
        .upsert(profileData, { onConflict: "user_id" });

      if (error) {
        console.error("Error saving profile:", error);
      } else {
        console.log("✅ Business profile saved");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const startGeneration = async () => {
    if (!user) return;

    if (!canGenerate) {
      setShowUpgradeModal(true);
      return;
    }

    setStep("generating");
    setError(null);

    await saveBusinessProfile();

    const finalCountry = selectedCountry || customCountry;

    try {
      const response = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessData: {
            name: businessName,
            industry: selectedIndustry,
            country: finalCountry,
            city: city,
            businessModel: selectedBusinessModel,
            maturity: selectedMaturity,
            products: products,
            services: services,
            goals: selectedGoals,
            targetAudience: selectedAudience,
            idealCustomer: idealCustomer,
            customerPainPoints: customerPainPoints,
            budget: selectedBudget,
            competitors: competitors,
            competitiveAdvantages: competitiveAdvantages,
            brandPositioning: brandPositioning,
            positioningStatement: positioningStatement,
            tone: selectedTone,
            existingChannels: existingChannels,
            marketingChannels: preferredChannels,
            keyChallenges: keyChallenges,
            uniqueValueProposition: uniqueValueProposition,
            additionalNotes: additionalNotes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const { strategy, provider } = await response.json();
      console.log(`✅ Strategy generated via ${provider}`);

      const { data: savedStrategy, error: saveError } = await supabase
        .from("strategies")
        .insert({
          user_id: user.id,
          title: `${businessName} - ${selectedIndustry} Strategy`,
          industry: selectedIndustry,
          objective: selectedGoals.join(", "),
          data: strategy,
        })
        .select()
        .single();

      if (saveError) {
        console.error("Save error:", saveError);
        throw new Error("Failed to save strategy");
      }

      console.log("✅ Strategy saved:", savedStrategy.id);

      await recordUsage("strategy_generation", {
        strategy_id: savedStrategy.id,
        industry: selectedIndustry,
        provider: provider,
      });

      setTimeout(() => {
        router.push(`/dashboard/strategies/${savedStrategy.id}`);
      }, 2000);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
      setTimeout(() => {
        router.push("/dashboard/strategies");
      }, 3000);
    }
  };

  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* ═══════════════════════════════════════════════════════════
          MODAL D'UPGRADE - RESPONSIVE
          ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
              <div className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#0a0a14] p-5 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] mb-3 sm:mb-4 shadow-lg shadow-[#6366f1]/25">
                    <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 no-hyphens">
                    Monthly Limit Reached
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    You've used {strategiesUsed} of {strategiesLimit} strategies.
                    <br className="hidden sm:block" />
                    Upgrade to generate unlimited strategies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="relative rounded-2xl border border-[#8b5cf6] bg-[#8b5cf6]/5 p-4 sm:p-6">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-1 text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">Pro</h3>
                        <p className="text-xs sm:text-sm text-slate-400">$29/month</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                        <span>10 strategies per month</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                        <span>Competitor intelligence</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                        <span>PDF exports</span>
                      </li>
                    </ul>
                    <Link
                      href="/dashboard/billing?upgrade=pro"
                      className="block w-full rounded-xl py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 transition-all active:scale-95"
                    >
                      Upgrade to Pro
                    </Link>
                  </div>

                  <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">Premium</h3>
                        <p className="text-xs sm:text-sm text-slate-400">$59/month</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                        <span>Unlimited strategies</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                        <span>Predictive trends</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                        <span>Dedicated support</span>
                      </li>
                    </ul>
                    <Link
                      href="/dashboard/billing?upgrade=premium"
                      className="block w-full rounded-xl py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] transition-all active:scale-95"
                    >
                      Upgrade to Premium
                    </Link>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          HEADER - COMPACT SUR MOBILE
          ═══════════════════════════════════════════════════════════ */}
      <div className="border-b border-white/5 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 bg-[#080810]/95 backdrop-blur-sm z-40 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 active:scale-95">
            <X className="h-4 w-4 text-slate-400" />
          </button>
          <span className="text-xs sm:text-sm font-bold text-white truncate">
            <span className="hidden sm:inline">Make</span>
            <span className="sm:hidden">M</span>
            <span className="text-[#8b5cf6]">ItAds</span>
            <span className="hidden sm:inline"> — Strategy Builder</span>
          </span>
        </div>

        {/* Compteur - caché sur mobile */}
        {!isUnlimited && (
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-[#8b5cf6]" />
              <span className="text-xs font-bold text-white">
                {strategiesUsed} / {strategiesLimit}
              </span>
            </div>
            {!canGenerate && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-xs font-bold text-white hover:scale-105 transition-all active:scale-95"
              >
                <Crown className="h-3 w-3" />
                Upgrade
              </button>
            )}
          </div>
        )}

        {/* Progress dots - plus petits sur mobile */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {steps.slice(0, -1).map((s, i) => (
            <div
              key={s}
              className={`h-1 sm:h-1.5 rounded-full transition-all ${
                i === currentStepIndex 
                  ? "w-5 sm:w-8 bg-[#6366f1]" 
                  : i < currentStepIndex 
                  ? "w-4 sm:w-6 bg-[#6366f1]/50" 
                  : "w-4 sm:w-6 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          BANNIÈRE PROFIL SAUVEGARDÉ - COMPACTE
          ═══════════════════════════════════════════════════════════ */}
      {hasSavedProfile && step !== "generating" && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-b border-emerald-500/20 px-3 sm:px-6 py-2 sm:py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-emerald-500/20 flex-shrink-0">
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-emerald-200 truncate">
                Profile pre-filled
              </p>
              <p className="text-[10px] sm:text-xs text-emerald-400/80 truncate">
                Modify anything before generating.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedIndustry(null);
                setBusinessName("");
                setSelectedCountry("");
                setCity("");
                setSelectedBusinessModel("");
                setSelectedMaturity("");
                setProducts([]);
                setServices([]);
                setSelectedGoals([]);
                setSelectedAudience("");
                setIdealCustomer("");
                setCustomerPainPoints([]);
                setSelectedBudget(2500);
                setCompetitors([]);
                setCompetitiveAdvantages([]);
                setBrandPositioning("");
                setPositioningStatement("");
                setSelectedTone("");
                setExistingChannels([]);
                setPreferredChannels([]);
                setKeyChallenges([]);
                setUniqueValueProposition("");
                setAdditionalNotes("");
                setHasSavedProfile(false);
              }}
              className="text-[10px] sm:text-xs text-emerald-400 hover:text-emerald-300 underline flex-shrink-0"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CONTENU DES ÉTAPES
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          
          {/* ═══════════════════════════════════════════════════════
              STEP 1: INDUSTRY
              ═══════════════════════════════════════════════════════ */}
          {step === "industry" && (
            <motion.div key="industry" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Choose Your Industry</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Select the category that describes your business.</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
                {INDUSTRIES.map((biz) => (
                  <motion.button 
                    key={biz.id} 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => setSelectedIndustry(biz.id)} 
                    className={`relative rounded-lg sm:rounded-xl overflow-hidden border-2 aspect-[4/3] group ${
                      selectedIndustry === biz.id 
                        ? "border-[#6366f1] shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]" 
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <Image src={biz.image} alt={biz.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" style={{ objectPosition: "center 30%" }} sizes="20vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                      <p className="text-[10px] sm:text-sm font-bold text-white truncate">{biz.name}</p>
                    </div>
                    {selectedIndustry === biz.id && (
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-[#6366f1] flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 2: BUSINESS NAME
              ═══════════════════════════════════════════════════════ */}
          {step === "business-name" && (
            <motion.div key="business-name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Business Name</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Helps us personalize your strategy.</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
              <input 
                type="text" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)} 
                placeholder="e.g., Bright Dental Clinic" 
                className="w-full rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg text-white outline-none focus:border-[#6366f1] transition-colors" 
              />
              <div className="mt-6 sm:mt-8 flex justify-start">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 3: LOCATION
              ═══════════════════════════════════════════════════════ */}
          {step === "location" && (
            <motion.div key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Business Location</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Country and city for precise targeting.</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="text-xs sm:text-sm font-bold text-white mb-1.5 sm:mb-2 block">City (Optional)</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="e.g., Paris, New York" 
                  className="w-full rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-4 sm:px-6 py-2.5 sm:py-3 text-sm text-white outline-none focus:border-[#6366f1] transition-colors" 
                />
              </div>

              {!showCustomCountry ? (
                <>
                  <label className="text-xs sm:text-sm font-bold text-white mb-1.5 sm:mb-2 block">Country *</label>
                  <div className="relative mb-4 sm:mb-6">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={countrySearch} 
                      onChange={(e) => setCountrySearch(e.target.value)} 
                      placeholder="Search countries..." 
                      className="w-full rounded-lg sm:rounded-xl border border-white/10 bg-white/5 pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm text-white outline-none focus:border-[#6366f1] transition-colors" 
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-1 sm:pr-2">
                    {filteredCountries.map((c) => (
                      <button 
                        key={c} 
                        onClick={() => handleCountrySelect(c)} 
                        className={`rounded-lg border px-2 sm:px-3 py-2 text-[10px] sm:text-xs font-medium transition-all text-left truncate active:scale-95 ${
                          selectedCountry === c 
                            ? "border-[#6366f1] bg-[#6366f1]/10 text-white" 
                            : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
                        }`}
                      >
                        {selectedCountry === c && <Check className="inline h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />}
                        {c}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleCountrySelect("__custom__")} 
                    className="w-full rounded-lg sm:rounded-xl border border-dashed border-[#6366f1]/50 bg-[#6366f1]/5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#8b5cf6] hover:bg-[#6366f1]/10 transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95"
                  >
                    <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">My country is not listed — Type it manually</span>
                    <span className="sm:hidden">Type country manually</span>
                  </button>
                </>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/5">
                    <p className="text-xs sm:text-sm text-[#8b5cf6] mb-2 sm:mb-3 flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Enter your country name
                    </p>
                    <input 
                      type="text" 
                      value={customCountry} 
                      onChange={(e) => setCustomCountry(e.target.value)} 
                      placeholder="e.g., Luxembourg, Monaco" 
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none focus:border-[#6366f1] transition-colors" 
                      onKeyDown={(e) => { if (e.key === "Enter") handleCustomCountryConfirm(); }} 
                    />
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button 
                      onClick={() => { setShowCustomCountry(false); setCustomCountry(""); }} 
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors active:scale-95"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCustomCountryConfirm} 
                      disabled={!customCountry.trim()} 
                      className="flex-1 rounded-lg bg-[#6366f1] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all active:scale-95"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              {selectedCountry && !showCustomCountry && (
                <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs sm:text-sm text-emerald-400 flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Selected: <span className="font-bold truncate">{selectedCountry}</span>
                  </p>
                </div>
              )}

              <div className="flex justify-start mt-6 sm:mt-8">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 4: BUSINESS MODEL
              ═══════════════════════════════════════════════════════ */}
          {step === "business-model" && (
            <motion.div key="business-model" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Business Model</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Helps us understand your structure.</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="mb-6 sm:mb-8">
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Business Model *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {BUSINESS_MODELS.map((model) => (
                    <button 
                      key={model.id} 
                      onClick={() => setSelectedBusinessModel(model.id)} 
                      className={`rounded-lg sm:rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all active:scale-95 ${
                        selectedBusinessModel === model.id 
                          ? "border-[#6366f1] bg-[#6366f1]/10" 
                          : "border-white/10 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <p className="text-xs sm:text-sm font-bold text-white">{model.name}</p>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">{model.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Maturity Stage *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  {MATURITY_STAGES.map((stage) => (
                    <button 
                      key={stage.id} 
                      onClick={() => setSelectedMaturity(stage.id)} 
                      className={`rounded-lg sm:rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all active:scale-95 ${
                        selectedMaturity === stage.id 
                          ? "border-[#6366f1] bg-[#6366f1]/10" 
                          : "border-white/10 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <p className="text-xs sm:text-sm font-bold text-white">{stage.name}</p>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">{stage.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-start mt-6 sm:mt-8">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 5: PRODUCTS & SERVICES
              ═══════════════════════════════════════════════════════ */}
          {step === "products-services" && (
            <motion.div key="products-services" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Products & Services</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Add at least one product or service.</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="mb-6 sm:mb-8">
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Products</label>
                <div className="flex gap-2 mb-2 sm:mb-3">
                  <input 
                    type="text" 
                    value={newProduct} 
                    onChange={(e) => setNewProduct(e.target.value)} 
                    placeholder="e.g., Premium Whitening Kit" 
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2 text-sm text-white outline-none focus:border-[#6366f1] transition-colors" 
                    onKeyDown={(e) => { if (e.key === "Enter") addProduct(); }} 
                  />
                  <button onClick={addProduct} className="rounded-lg bg-[#6366f1] px-3 sm:px-4 py-2 text-white hover:bg-[#5558e6] transition-colors active:scale-95">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {products.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {products.map((product, i) => (
                      <div key={i} className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 sm:py-2">
                        <span className="text-xs sm:text-sm text-white">{product}</span>
                        <button onClick={() => removeProduct(i)} className="text-slate-400 hover:text-red-400 transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Services</label>
                <div className="flex gap-2 mb-2 sm:mb-3">
                  <input 
                    type="text" 
                    value={newService} 
                    onChange={(e) => setNewService(e.target.value)} 
                    placeholder="e.g., Free Consultation" 
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2 text-sm text-white outline-none focus:border-[#6366f1] transition-colors" 
                    onKeyDown={(e) => { if (e.key === "Enter") addService(); }} 
                  />
                  <button onClick={addService} className="rounded-lg bg-[#6366f1] px-3 sm:px-4 py-2 text-white hover:bg-[#5558e6] transition-colors active:scale-95">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {services.map((service, i) => (
                      <div key={i} className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 sm:py-2">
                        <span className="text-xs sm:text-sm text-white">{service}</span>
                        <button onClick={() => removeService(i)} className="text-slate-400 hover:text-red-400 transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-start mt-6 sm:mt-8">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 6: GOALS
              ═══════════════════════════════════════════════════════ */}
          {step === "goals" && (
            <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Your Goals</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Select all that apply.</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
                {GOALS.map((goal) => (
                  <button 
                    key={goal} 
                    onClick={() => setSelectedGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal])} 
                    className={`rounded-lg sm:rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all text-left active:scale-95 ${
                      selectedGoals.includes(goal) 
                        ? "border-[#6366f1] bg-[#6366f1]/10 text-white" 
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
                    }`}
                  >
                    {selectedGoals.includes(goal) && <Check className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />}
                    {goal}
                  </button>
                ))}
              </div>
              <div className="flex justify-start">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 7: TARGET AUDIENCE
              ═══════════════════════════════════════════════════════ */}
          {step === "target-audience" && (
            <motion.div key="target-audience" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Target Audience</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Who are you trying to reach?</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="mb-6 sm:mb-8">
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Primary Audience *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {TARGET_AUDIENCES.map((audience) => (
                    <button 
                      key={audience} 
                      onClick={() => setSelectedAudience(audience)} 
                      className={`rounded-lg sm:rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all text-left active:scale-95 ${
                        selectedAudience === audience 
                          ? "border-[#6366f1] bg-[#6366f1]/10 text-white" 
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
                      }`}
                    >
                      {selectedAudience === audience && <Check className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />}
                      {audience}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Ideal Customer Profile *</label>
                <textarea 
                  value={idealCustomer} 
                  onChange={(e) => setIdealCustomer(e.target.value)} 
                  rows={4} 
                  placeholder="e.g., Working professionals aged 28-45..." 
                  className="w-full rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-4 sm:px-6 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#6366f1] transition-colors resize-none" 
                />
              </div>

              <div className="flex justify-start mt-6 sm:mt-8">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 8: PAIN POINTS
              ═══════════════════════════════════════════════════════ */}
          {step === "customer-pain-points" && (
            <motion.div key="customer-pain-points" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Pain Points</h2>
                  <p className="text-xs sm:text-sm text-slate-400">What problems do your customers face?</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="flex gap-2 mb-2 sm:mb-3">
                <input 
                  type="text" 
                  value={newPainPoint} 
                  onChange={(e) => setNewPainPoint(e.target.value)} 
                  placeholder="e.g., High cost of services" 
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2 text-sm text-white outline-none focus:border-[#6366f1] transition-colors" 
                  onKeyDown={(e) => { if (e.key === "Enter") addPainPoint(); }} 
                />
                <button onClick={addPainPoint} className="rounded-lg bg-[#6366f1] px-3 sm:px-4 py-2 text-white hover:bg-[#5558e6] transition-colors active:scale-95">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {customerPainPoints.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  {customerPainPoints.map((painPoint, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2 sm:py-3">
                      <span className="text-xs sm:text-sm text-white truncate pr-2">{painPoint}</span>
                      <button onClick={() => removePainPoint(i)} className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0">
                        <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-start mt-6 sm:mt-8">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 9: BUDGET
              ═══════════════════════════════════════════════════════ */}
          {step === "budget" && (
            <motion.div key="budget" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Marketing Budget</h2>
                  <p className="text-xs sm:text-sm text-slate-400">What's your monthly ad spend?</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {BUDGETS.map((b) => (
                  <button 
                    key={b.value} 
                    onClick={() => setSelectedBudget(b.value)} 
                    className={`w-full rounded-lg sm:rounded-xl border px-4 sm:px-6 py-3 sm:py-4 text-left transition-all active:scale-[0.99] ${
                      selectedBudget === b.value 
                        ? "border-[#6366f1] bg-[#6366f1]/10" 
                        : "border-white/10 bg-white/5 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base sm:text-lg font-bold text-white">{b.label}</p>
                        <p className="text-xs sm:text-sm text-slate-400">{b.description}</p>
                      </div>
                      {selectedBudget === b.value && <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#6366f1] flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-start">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 10: COMPETITORS
              ═══════════════════════════════════════════════════════ */}
          {step === "competitors" && (
            <motion.div key="competitors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Competitive Landscape</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Who are your competitors?</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="mb-6 sm:mb-8">
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Known Competitors (Optional)</label>
                <div className="flex gap-2 mb-2 sm:mb-3">
                  <input 
                    type="text" 
                    value={newCompetitor} 
                    onChange={(e) => setNewCompetitor(e.target.value)} 
                    placeholder="e.g., Competitor X" 
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2 text-sm text-white outline-none focus:border-[#6366f1] transition-colors" 
                    onKeyDown={(e) => { if (e.key === "Enter") addCompetitor(); }} 
                  />
                  <button onClick={addCompetitor} className="rounded-lg bg-[#6366f1] px-3 sm:px-4 py-2 text-white hover:bg-[#5558e6] transition-colors active:scale-95">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {competitors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {competitors.map((comp, i) => (
                      <div key={i} className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 sm:py-2">
                        <span className="text-xs sm:text-sm text-white">{comp}</span>
                        <button onClick={() => removeCompetitor(i)} className="text-slate-400 hover:text-red-400 transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Competitive Advantages *</label>
                <div className="flex gap-2 mb-2 sm:mb-3">
                  <input 
                    type="text" 
                    value={newAdvantage} 
                    onChange={(e) => setNewAdvantage(e.target.value)} 
                    placeholder="e.g., 24/7 customer support" 
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2 text-sm text-white outline-none focus:border-[#6366f1] transition-colors" 
                    onKeyDown={(e) => { if (e.key === "Enter") addAdvantage(); }} 
                  />
                  <button onClick={addAdvantage} className="rounded-lg bg-[#6366f1] px-3 sm:px-4 py-2 text-white hover:bg-[#5558e6] transition-colors active:scale-95">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {competitiveAdvantages.length > 0 && (
                  <div className="space-y-1.5 sm:space-y-2">
                    {competitiveAdvantages.map((adv, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2 sm:py-3">
                        <span className="text-xs sm:text-sm text-white truncate pr-2">{adv}</span>
                        <button onClick={() => removeAdvantage(i)} className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0">
                          <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-start mt-6 sm:mt-8">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 11: BRAND POSITIONING
              ═══════════════════════════════════════════════════════ */}
          {step === "brand-positioning" && (
            <motion.div key="brand-positioning" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Brand Positioning</h2>
                  <p className="text-xs sm:text-sm text-slate-400">How do you want to be perceived?</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="mb-6 sm:mb-8">
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Brand Tone *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {TONES.map((tone) => (
                    <button 
                      key={tone} 
                      onClick={() => setSelectedTone(tone)} 
                      className={`rounded-lg sm:rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all text-left active:scale-95 ${
                        selectedTone === tone 
                          ? "border-[#6366f1] bg-[#6366f1]/10 text-white" 
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
                      }`}
                    >
                      {selectedTone === tone && <Check className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />}
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Brand Positioning *</label>
                <input 
                  type="text" 
                  value={brandPositioning} 
                  onChange={(e) => setBrandPositioning(e.target.value)} 
                  placeholder="e.g., Premium quality at affordable prices" 
                  className="w-full rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-4 sm:px-6 py-2.5 sm:py-3 text-sm text-white outline-none focus:border-[#6366f1] transition-colors" 
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Positioning Statement (Optional)</label>
                <textarea 
                  value={positioningStatement} 
                  onChange={(e) => setPositioningStatement(e.target.value)} 
                  rows={3} 
                  placeholder="e.g., For [target audience] who [need]..." 
                  className="w-full rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-4 sm:px-6 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#6366f1] transition-colors resize-none" 
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Unique Value Proposition (Optional)</label>
                <textarea 
                  value={uniqueValueProposition} 
                  onChange={(e) => setUniqueValueProposition(e.target.value)} 
                  rows={2} 
                  placeholder="e.g., We deliver results 3x faster..." 
                  className="w-full rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-4 sm:px-6 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#6366f1] transition-colors resize-none" 
                />
              </div>

              <div className="flex justify-start mt-6 sm:mt-8">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 12: CHANNELS
              ═══════════════════════════════════════════════════════ */}
          {step === "channels" && (
            <motion.div key="channels" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Marketing Channels</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Which channels are you using?</p>
                </div>
                <button 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="mb-6 sm:mb-8">
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Currently Using (Optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {MARKETING_CHANNELS.map((channel) => (
                    <button 
                      key={channel} 
                      onClick={() => toggleChannel(channel, "existing")} 
                      className={`rounded-lg border px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all text-left active:scale-95 ${
                        existingChannels.includes(channel) 
                          ? "border-[#6366f1] bg-[#6366f1]/10 text-white" 
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
                      }`}
                    >
                      {existingChannels.includes(channel) && <Check className="inline h-3 w-3 mr-1.5 sm:mr-2" />}
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Want to Explore (Optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {MARKETING_CHANNELS.map((channel) => (
                    <button 
                      key={channel} 
                      onClick={() => toggleChannel(channel, "preferred")} 
                      className={`rounded-lg border px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all text-left active:scale-95 ${
                        preferredChannels.includes(channel) 
                          ? "border-emerald-500 bg-emerald-500/10 text-white" 
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
                      }`}
                    >
                      {preferredChannels.includes(channel) && <Check className="inline h-3 w-3 mr-1.5 sm:mr-2" />}
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-start mt-6 sm:mt-8">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 13: CHALLENGES
              ═══════════════════════════════════════════════════════ */}
          {step === "challenges" && (
            <motion.div key="challenges" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 no-hyphens">Final Details</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Any other context?</p>
                </div>
                <button 
                  onClick={startGeneration} 
                  disabled={!canGenerate}
                  className={`rounded-full px-5 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg active:scale-95 self-start sm:self-auto ${
                    canGenerate 
                      ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:scale-105 shadow-[#6366f1]/25" 
                      : "bg-slate-600 cursor-not-allowed"
                  }`}
                >
                  {canGenerate ? (
                    <>
                      Generate <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>Limit Reached</span>
                    </>
                  )}
                </button>
              </div>

              {!canGenerate && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-500/30 bg-amber-500/10">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-amber-500/20 flex-shrink-0">
                      <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-amber-200 mb-1">
                        Monthly limit reached
                      </p>
                      <p className="text-[10px] sm:text-xs text-amber-400/80 mb-2 sm:mb-3">
                        You've used {strategiesUsed} of {strategiesLimit} strategies.
                      </p>
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold text-white hover:scale-105 transition-all active:scale-95"
                      >
                        <Crown className="h-3 w-3" />
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 sm:mb-8">
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Key Challenges (Optional)</label>
                <div className="flex gap-2 mb-2 sm:mb-3">
                  <input 
                    type="text" 
                    value={newChallenge} 
                    onChange={(e) => setNewChallenge(e.target.value)} 
                    placeholder="e.g., Limited brand awareness" 
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2 text-sm text-white outline-none focus:border-[#6366f1] transition-colors" 
                    onKeyDown={(e) => { if (e.key === "Enter") addChallenge(); }} 
                  />
                  <button onClick={addChallenge} className="rounded-lg bg-[#6366f1] px-3 sm:px-4 py-2 text-white hover:bg-[#5558e6] transition-colors active:scale-95">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {keyChallenges.length > 0 && (
                  <div className="space-y-1.5 sm:space-y-2">
                    {keyChallenges.map((challenge, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2 sm:py-3">
                        <span className="text-xs sm:text-sm text-white truncate pr-2">{challenge}</span>
                        <button onClick={() => removeChallenge(i)} className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0">
                          <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6 sm:mb-8">
                <label className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 block">Additional Notes (Optional)</label>
                <textarea 
                  value={additionalNotes} 
                  onChange={(e) => setAdditionalNotes(e.target.value)} 
                  rows={4} 
                  placeholder="Any other information..." 
                  className="w-full rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-4 sm:px-6 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#6366f1] transition-colors resize-none" 
                />
              </div>

              <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/5">
                <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAsDefault}
                    onChange={(e) => setSaveAsDefault(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-white/10 bg-white/5 text-[#6366f1] focus:ring-[#6366f1]"
                  />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                      <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Save as default profile
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">
                      Pre-filled next time you create a strategy.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex justify-start mt-6 sm:mt-8">
                <button onClick={handleBack} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 14: GENERATING
              ═══════════════════════════════════════════════════════ */}
          {step === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden min-h-[60vh]">
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <motion.div key={i} className="absolute w-1 h-1 bg-[#6366f1] rounded-full" initial={{ x: "50%", y: "50%", opacity: 0 }} animate={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, opacity: [0, 1, 0] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
                ))}
              </div>
              <div className="text-center relative z-10">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="inline-flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-2 border-[#6366f1]/30 mb-6 sm:mb-8">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/50" />
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={genMessage} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    transition={{ duration: 0.3 }} 
                    className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4 no-hyphens"
                  >
                    {GENERATION_MESSAGES[genMessage]}
                  </motion.p>
                </AnimatePresence>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                  {GENERATION_MESSAGES.map((_, i) => (
                    <motion.div 
                      key={i} 
                      className={`h-1 sm:h-1.5 rounded-full ${i <= genMessage ? "bg-[#6366f1]" : "bg-white/10"}`} 
                      animate={{ width: i === genMessage ? 20 : 6 }} 
                      transition={{ duration: 0.3 }} 
                    />
                  ))}
                </div>
                {error && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                    <p className="text-xs sm:text-sm text-red-300">Error: {error}</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2">Redirecting...</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}