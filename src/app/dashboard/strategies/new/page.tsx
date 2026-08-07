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

// ✅ "Marketing Agency" avec une image Unsplash fiable et de haute qualité
const INDUSTRIES = [
  { id: "agency", name: "Marketing Agency", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80" },
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
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#6366f1] mx-auto mb-3 sm:mb-4" />
          <p className="text-xs sm:text-sm text-[#64748B]">Loading your profile...</p>
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
    <div className="min-h-screen bg-[#FAFAFC] text-[#111827]">
      {/* MODAL D'UPGRADE */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
              <div className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-xl p-2 text-[#64748B] hover:bg-[#F3F4F6] hover:text-[#111827] transition-all"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] mb-3 sm:mb-4 shadow-lg shadow-[#6366f1]/25">
                    <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2 no-hyphens">
                    Monthly Limit Reached
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B]">
                    You've used {strategiesUsed} of {strategiesLimit} strategies.
                    <br className="hidden sm:block" />
                    Upgrade to generate unlimited strategies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="relative rounded-2xl border border-[#6366f1]/30 bg-[#EEF2FF] p-4 sm:p-6">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-1 text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
                        Most Popular
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#111827]">Pro</h3>
                        <p className="text-xs sm:text-sm text-[#64748B]">$29/month</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-[#475569]">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span>10 strategies per month</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-[#475569]">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span>Competitor intelligence</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-[#475569]">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
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

                  <div className="relative rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#111827]">Premium</h3>
                        <p className="text-xs sm:text-sm text-[#64748B]">$59/month</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-[#475569]">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span>Unlimited strategies</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-[#475569]">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span>Predictive trends</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs sm:text-sm text-[#475569]">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span>Dedicated support</span>
                      </li>
                    </ul>
                    <Link
                      href="/dashboard/billing?upgrade=premium"
                      className="block w-full rounded-xl py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] hover:bg-[#F3F4F6] transition-all active:scale-95"
                    >
                      Upgrade to Premium
                    </Link>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="text-xs sm:text-sm text-[#64748B] hover:text-[#111827] transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="border-b border-[#E5E7EB] px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-40 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors flex-shrink-0 active:scale-95">
            <X className="h-4 w-4 text-[#64748B]" />
          </button>
          <span className="text-xs sm:text-sm font-bold text-[#111827] truncate">
            <span className="hidden sm:inline">Make</span>
            <span className="sm:hidden">M</span>
            <span className="text-[#6366f1]">ItAds</span>
            <span className="hidden sm:inline"> — Strategy Builder</span>
          </span>
        </div>

        {/* Compteur */}
        {!isUnlimited && (
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9FAFB] border border-[#E5E7EB]">
              <Sparkles className="h-3.5 w-3.5 text-[#6366f1]" />
              <span className="text-xs font-bold text-[#111827]">
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

        {/* Progress dots */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {steps.slice(0, -1).map((s, i) => (
            <div
              key={s}
              className={`h-1 sm:h-1.5 rounded-full transition-all ${
                i === currentStepIndex 
                  ? "w-5 sm:w-8 bg-[#6366f1]" 
                  : i < currentStepIndex 
                  ? "w-4 sm:w-6 bg-[#6366f1]/50" 
                  : "w-4 sm:w-6 bg-[#E5E7EB]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* BANNIÈRE PROFIL SAUVEGARDÉ */}
      {hasSavedProfile && step !== "generating" && (
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-b border-emerald-200 px-3 sm:px-6 py-2 sm:py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0">
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-emerald-800 truncate">
                Profile pre-filled
              </p>
              <p className="text-[10px] sm:text-xs text-emerald-700 truncate">
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
              className="text-[10px] sm:text-xs text-emerald-700 hover:text-emerald-800 underline flex-shrink-0"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* CONTENU DES ÉTAPES */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          
          {/* ✅ STEP 1: INDUSTRY (CORRIGÉ POUR UN RENDU HARMONIEUX SANS ESPACE BLANC) */}
          {step === "industry" && (
            <motion.div key="industry" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] mb-1 sm:mb-2 no-hyphens">Choose Your Industry</h2>
                  <p className="text-xs sm:text-sm text-[#64748B]">Select the category that describes your business.</p>
                </div>
                <button 
                  disabled={!canProceed()} 
                  onClick={handleNext} 
                  className="rounded-full bg-[#6366f1] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#6366f1]/25 self-start sm:self-auto active:scale-95"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
              
              {/* ✅ NOUVELLE GRILLE HARMONISÉE : Hauteur fixe + object-cover pour rogner proprement */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {INDUSTRIES.map((biz) => (
                  <motion.button 
                    key={biz.id} 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => setSelectedIndustry(biz.id)} 
                    className={`relative rounded-xl overflow-hidden border-2 group flex flex-col transition-all ${
                      selectedIndustry === biz.id 
                        ? "border-[#6366f1] bg-[#EEF2FF] shadow-md" 
                        : "border-[#E5E7EB] bg-white hover:border-[#6366f1]/40 hover:shadow-sm"
                    }`}
                  >
                    {/* Conteneur d'image à hauteur fixe avec object-cover pour éliminer les espaces blancs */}
                    <div className="relative w-full h-32 sm:h-36 bg-gray-100 overflow-hidden">
                      <Image 
                        src={biz.image} 
                        alt={biz.name} 
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </div>
                    
                    <div className="p-3 sm:p-4 flex flex-col items-center justify-center flex-1">
                      <p className={`text-xs sm:text-sm font-bold text-center leading-tight ${
                        selectedIndustry === biz.id ? "text-[#6366f1]" : "text-[#111827]"
                      }`}>
                        {biz.name}
                      </p>
                    </div>

                    {selectedIndustry === biz.id && (
                      <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#6366f1] flex items-center justify-center shadow-sm z-10">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: BUSINESS NAME */}
          {step === "business-name" && (
            <motion.div key="business-name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 sm:p-6 md:p-10 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] mb-1 sm:mb-2 no-hyphens">Business Name</h2>
                  <p className="text-xs sm:text-sm text-[#64748B]">Helps us personalize your strategy.</p>
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
                placeholder="e.g., Bright Marketing Agency" 
                className="w-full rounded-lg sm:rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg text-[#111827] outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 transition-colors placeholder:text-[#94A3B8]" 
              />
              <div className="mt-6 sm:mt-8 flex justify-start">
                <button onClick={handleBack} className="text-xs sm:text-sm text-[#64748B] hover:text-[#111827] transition-colors flex items-center gap-2 active:scale-95">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ... (Le reste de ton fichier reste IDENTIQUE, copie-le depuis ton éditeur pour les étapes suivantes) ... */}
          {/* Pour garder le code fonctionnel, assure-toi que les étapes "location", "business-model", etc. sont bien présentes en dessous comme dans ton fichier original */}

        </AnimatePresence>
      </div>
    </div>
  );
}