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
  { id: "fashion", name: "Fashion & Apparel", image: "/images/industry-fashion.jpg" },
  { id: "automotive", name: "Automotive", image: "/images/industry-automotive.jpg" },
  { id: "finance", name: "Finance & Banking", image: "/images/industry-finance.jpg" },
  { id: "technology", name: "Technology", image: "/images/industry-technology.jpg" },
  { id: "food", name: "Food & Beverage", image: "/images/industry-food.jpg" },
  { id: "entertainment", name: "Entertainment", image: "/images/industry-entertainment.jpg" },
  { id: "sports", name: "Sports & Athletics", image: "/images/industry-sports.jpg" },
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

  // ✅ VÉRIFIER SI L'UTILISATEUR PEUT GÉNÉRER UNE STRATÉGIE
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
          console.log("✅ Profile loaded, pre-filling form...");
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1] mx-auto mb-4" />
          <p className="text-slate-400">Loading your profile...</p>
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

        const fields = [
          businessName, selectedIndustry, selectedCountry, city,
          selectedBusinessModel, selectedMaturity, selectedAudience,
          brandPositioning, selectedTone
        ];
        const filledCount = fields.filter(f => f && f.toString().trim().length > 0).length;
        const completionRate = (filledCount / fields.length) * 100;

        if (completionRate >= 100) {
          await supabase.from("notifications").insert({
            user_id: user.id,
            type: "success",
            title: "🎉 Business Profile completed",
            message: "Your business profile is now 100% complete. You'll get more accurate recommendations.",
            link: "/dashboard/settings",
            is_read: false,
          });
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const startGeneration = async () => {
    if (!user) return;

    // ✅ VÉRIFIER LA LIMITE AVANT DE GÉNÉRER
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

      // ✅ ENREGISTRER L'UTILISATION
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
      {/* ✅ MODAL D'UPGRADE */}
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0a0a14] p-8 shadow-2xl">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="text-center mb-8">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] mb-4 shadow-lg shadow-[#6366f1]/25">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Monthly Strategy Limit Reached
                  </h2>
                  <p className="text-slate-400">
                    You've used {strategiesUsed} of {strategiesLimit} strategies on your {userPlan} plan.
                    <br />
                    Upgrade now to generate unlimited strategies.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="relative rounded-2xl border border-[#8b5cf6] bg-[#8b5cf6]/5 p-6">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Pro</h3>
                        <p className="text-sm text-slate-400">$29/month</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400" />
                        10 strategies per month
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400" />
                        Competitor intelligence
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400" />
                        PDF exports
                      </li>
                    </ul>
                    <Link
                      href="/dashboard/billing?upgrade=pro"
                      className="block w-full rounded-xl py-3 text-center text-sm font-semibold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 transition-all"
                    >
                      Upgrade to Pro
                    </Link>
                  </div>

                  <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Premium</h3>
                        <p className="text-sm text-slate-400">$59/month</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400" />
                        Unlimited strategies
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400" />
                        Predictive trends
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400" />
                        Dedicated support
                      </li>
                    </ul>
                    <Link
                      href="/dashboard/billing?upgrade=premium"
                      className="block w-full rounded-xl py-3 text-center text-sm font-semibold border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] transition-all"
                    >
                      Upgrade to Premium
                    </Link>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#080810]/95 backdrop-blur-sm z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-4 w-4 text-slate-400" />
          </button>
          <span className="text-sm font-bold text-white">
            Make<span className="text-[#8b5cf6]">ItAds</span> — Strategy Builder
          </span>
        </div>

        {/* ✅ COMPTEUR D'UTILISATION */}
        {!isUnlimited && (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-[#8b5cf6]" />
              <span className="text-xs font-bold text-white">
                {strategiesUsed} / {strategiesLimit}
              </span>
              <span className="text-xs text-slate-400">strategies this month</span>
            </div>
            {!canGenerate && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-xs font-bold text-white hover:scale-105 transition-all"
              >
                <Crown className="h-3 w-3" />
                Upgrade
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {steps.slice(0, -1).map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStepIndex ? "w-8 bg-[#6366f1]" : i < currentStepIndex ? "w-6 bg-[#6366f1]/50" : "w-6 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {hasSavedProfile && step !== "generating" && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-b border-emerald-500/20 px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
              <Check className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-200">
                Your profile has been pre-filled
              </p>
              <p className="text-xs text-emerald-400/80">
                We've loaded your saved business information. Feel free to modify anything before generating your strategy.
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
              className="text-xs text-emerald-400 hover:text-emerald-300 underline"
            >
              Start fresh
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {step === "industry" && (
            <motion.div key="industry" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Choose Your Industry</h2>
                  <p className="text-slate-400">Select the category that best describes your business.</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {INDUSTRIES.map((biz) => (
                  <motion.button key={biz.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedIndustry(biz.id)} className={`relative rounded-xl overflow-hidden border-2 aspect-[4/3] group ${selectedIndustry === biz.id ? "border-[#6366f1] shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]" : "border-white/10 hover:border-white/30"}`}>
                    <Image src={biz.image} alt={biz.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" style={{ objectPosition: "center 30%" }} sizes="20vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-bold text-white">{biz.name}</p>
                    </div>
                    {selectedIndustry === biz.id && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[#6366f1] flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "business-name" && (
            <motion.div key="business-name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">What's Your Business Name?</h2>
                  <p className="text-slate-400">This will help us personalize your strategy.</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g., Bright Dental Clinic" className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-white text-lg outline-none focus:border-[#6366f1] transition-colors" />
              <div className="mt-8 flex justify-start">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "location" && (
            <motion.div key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Where is Your Business Located?</h2>
                  <p className="text-slate-400">Country and city for precise market targeting.</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-6">
                <label className="text-sm font-bold text-white mb-2 block">City (Optional)</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Paris, New York, Tokyo" className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white outline-none focus:border-[#6366f1] transition-colors" />
              </div>

              {!showCustomCountry ? (
                <>
                  <label className="text-sm font-bold text-white mb-2 block">Country *</label>
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input type="text" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} placeholder="Search countries..." className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 max-h-[300px] overflow-y-auto pr-2">
                    {filteredCountries.map((c) => (
                      <button key={c} onClick={() => handleCountrySelect(c)} className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all text-left truncate ${selectedCountry === c ? "border-[#6366f1] bg-[#6366f1]/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}>
                        {selectedCountry === c && <Check className="inline h-3 w-3 mr-1" />}
                        {c}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => handleCountrySelect("__custom__")} className="w-full rounded-xl border border-dashed border-[#6366f1]/50 bg-[#6366f1]/5 px-4 py-3 text-sm font-medium text-[#8b5cf6] hover:bg-[#6366f1]/10 transition-all flex items-center justify-center gap-2">
                    <Globe className="h-4 w-4" />
                    My country is not listed — Type it manually
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/5">
                    <p className="text-sm text-[#8b5cf6] mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Enter your country name
                    </p>
                    <input type="text" value={customCountry} onChange={(e) => setCustomCountry(e.target.value)} placeholder="e.g., Luxembourg, Monaco, etc." className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors" onKeyDown={(e) => { if (e.key === "Enter") handleCustomCountryConfirm(); }} />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setShowCustomCountry(false); setCustomCountry(""); }} className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 hover:text-white transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleCustomCountryConfirm} disabled={!customCountry.trim()} className="flex-1 rounded-lg bg-[#6366f1] px-4 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all">
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              {selectedCountry && !showCustomCountry && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-400 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Selected: <span className="font-bold">{selectedCountry}</span>
                  </p>
                </div>
              )}

              <div className="flex justify-start mt-8">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "business-model" && (
            <motion.div key="business-model" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Business Model & Maturity</h2>
                  <p className="text-slate-400">Help us understand your business structure.</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-8">
                <label className="text-sm font-bold text-white mb-3 block">Business Model *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BUSINESS_MODELS.map((model) => (
                    <button key={model.id} onClick={() => setSelectedBusinessModel(model.id)} className={`rounded-xl border px-4 py-3 text-left transition-all ${selectedBusinessModel === model.id ? "border-[#6366f1] bg-[#6366f1]/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}>
                      <p className="text-sm font-bold text-white">{model.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{model.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-white mb-3 block">Maturity Stage *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {MATURITY_STAGES.map((stage) => (
                    <button key={stage.id} onClick={() => setSelectedMaturity(stage.id)} className={`rounded-xl border px-4 py-3 text-left transition-all ${selectedMaturity === stage.id ? "border-[#6366f1] bg-[#6366f1]/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}>
                      <p className="text-sm font-bold text-white">{stage.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{stage.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-start mt-8">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "products-services" && (
            <motion.div key="products-services" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Products & Services</h2>
                  <p className="text-slate-400">What do you sell? Add at least one product or service.</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-8">
                <label className="text-sm font-bold text-white mb-3 block">Products</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={newProduct} onChange={(e) => setNewProduct(e.target.value)} placeholder="e.g., Premium Whitening Kit" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-[#6366f1] transition-colors" onKeyDown={(e) => { if (e.key === "Enter") addProduct(); }} />
                  <button onClick={addProduct} className="rounded-lg bg-[#6366f1] px-4 py-2 text-white hover:bg-[#5558e6] transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {products.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {products.map((product, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        <span className="text-sm text-white">{product}</span>
                        <button onClick={() => removeProduct(i)} className="text-slate-400 hover:text-red-400 transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-white mb-3 block">Services</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="e.g., Free Consultation" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-[#6366f1] transition-colors" onKeyDown={(e) => { if (e.key === "Enter") addService(); }} />
                  <button onClick={addService} className="rounded-lg bg-[#6366f1] px-4 py-2 text-white hover:bg-[#5558e6] transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {services.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {services.map((service, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        <span className="text-sm text-white">{service}</span>
                        <button onClick={() => removeService(i)} className="text-slate-400 hover:text-red-400 transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-start mt-8">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "goals" && (
            <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">What Are Your Goals?</h2>
                  <p className="text-slate-400">Select all that apply.</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {GOALS.map((goal) => (
                  <button key={goal} onClick={() => setSelectedGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal])} className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all text-left ${selectedGoals.includes(goal) ? "border-[#6366f1] bg-[#6366f1]/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}>
                    {selectedGoals.includes(goal) && <Check className="inline h-4 w-4 mr-2" />}
                    {goal}
                  </button>
                ))}
              </div>
              <div className="flex justify-start">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "target-audience" && (
            <motion.div key="target-audience" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Target Audience & Ideal Customer</h2>
                  <p className="text-slate-400">Who are you trying to reach?</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-8">
                <label className="text-sm font-bold text-white mb-3 block">Primary Audience Segment *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TARGET_AUDIENCES.map((audience) => (
                    <button key={audience} onClick={() => setSelectedAudience(audience)} className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all text-left ${selectedAudience === audience ? "border-[#6366f1] bg-[#6366f1]/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}>
                      {selectedAudience === audience && <Check className="inline h-4 w-4 mr-2" />}
                      {audience}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-white mb-3 block">Ideal Customer Profile * (Detailed description)</label>
                <textarea value={idealCustomer} onChange={(e) => setIdealCustomer(e.target.value)} rows={4} placeholder="e.g., Working professionals aged 28-45, earning $60k+, who value convenience and quality..." className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-white outline-none focus:border-[#6366f1] transition-colors resize-none" />
              </div>

              <div className="flex justify-start mt-8">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "customer-pain-points" && (
            <motion.div key="customer-pain-points" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Customer Pain Points</h2>
                  <p className="text-slate-400">What problems do your customers face? (Add at least one)</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-2 mb-3">
                <input type="text" value={newPainPoint} onChange={(e) => setNewPainPoint(e.target.value)} placeholder="e.g., High cost of premium services" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-[#6366f1] transition-colors" onKeyDown={(e) => { if (e.key === "Enter") addPainPoint(); }} />
                <button onClick={addPainPoint} className="rounded-lg bg-[#6366f1] px-4 py-2 text-white hover:bg-[#5558e6] transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {customerPainPoints.length > 0 && (
                <div className="space-y-2">
                  {customerPainPoints.map((painPoint, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                      <span className="text-sm text-white">{painPoint}</span>
                      <button onClick={() => removePainPoint(i)} className="text-slate-400 hover:text-red-400 transition-colors">
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-start mt-8">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "budget" && (
            <motion.div key="budget" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Marketing Budget</h2>
                  <p className="text-slate-400">What's your monthly ad spend?</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 mb-8">
                {BUDGETS.map((b) => (
                  <button key={b.value} onClick={() => setSelectedBudget(b.value)} className={`w-full rounded-xl border px-6 py-4 text-left transition-all ${selectedBudget === b.value ? "border-[#6366f1] bg-[#6366f1]/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-white">{b.label}</p>
                        <p className="text-sm text-slate-400">{b.description}</p>
                      </div>
                      {selectedBudget === b.value && <Check className="h-5 w-5 text-[#6366f1]" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-start">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "competitors" && (
            <motion.div key="competitors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Competitive Landscape</h2>
                  <p className="text-slate-400">Who are your competitors and what makes you different?</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-8">
                <label className="text-sm font-bold text-white mb-3 block">Known Competitors (Optional)</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={newCompetitor} onChange={(e) => setNewCompetitor(e.target.value)} placeholder="e.g., Competitor X" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-[#6366f1] transition-colors" onKeyDown={(e) => { if (e.key === "Enter") addCompetitor(); }} />
                  <button onClick={addCompetitor} className="rounded-lg bg-[#6366f1] px-4 py-2 text-white hover:bg-[#5558e6] transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {competitors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {competitors.map((comp, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        <span className="text-sm text-white">{comp}</span>
                        <button onClick={() => removeCompetitor(i)} className="text-slate-400 hover:text-red-400 transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-white mb-3 block">Competitive Advantages * (What makes you unique?)</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={newAdvantage} onChange={(e) => setNewAdvantage(e.target.value)} placeholder="e.g., 24/7 customer support" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-[#6366f1] transition-colors" onKeyDown={(e) => { if (e.key === "Enter") addAdvantage(); }} />
                  <button onClick={addAdvantage} className="rounded-lg bg-[#6366f1] px-4 py-2 text-white hover:bg-[#5558e6] transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {competitiveAdvantages.length > 0 && (
                  <div className="space-y-2">
                    {competitiveAdvantages.map((adv, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                        <span className="text-sm text-white">{adv}</span>
                        <button onClick={() => removeAdvantage(i)} className="text-slate-400 hover:text-red-400 transition-colors">
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-start mt-8">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "brand-positioning" && (
            <motion.div key="brand-positioning" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Brand Positioning & Tone</h2>
                  <p className="text-slate-400">How do you want to be perceived?</p>
                </div>
                <button disabled={!canProceed()} onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-8">
                <label className="text-sm font-bold text-white mb-3 block">Brand Tone *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TONES.map((tone) => (
                    <button key={tone} onClick={() => setSelectedTone(tone)} className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all text-left ${selectedTone === tone ? "border-[#6366f1] bg-[#6366f1]/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}>
                      {selectedTone === tone && <Check className="inline h-4 w-4 mr-2" />}
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-bold text-white mb-3 block">Brand Positioning * (Short description)</label>
                <input type="text" value={brandPositioning} onChange={(e) => setBrandPositioning(e.target.value)} placeholder="e.g., Premium quality at affordable prices" className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white outline-none focus:border-[#6366f1] transition-colors" />
              </div>

              <div className="mb-6">
                <label className="text-sm font-bold text-white mb-3 block">Positioning Statement (Optional)</label>
                <textarea value={positioningStatement} onChange={(e) => setPositioningStatement(e.target.value)} rows={3} placeholder="e.g., For [target audience] who [need], [brand] is the [category] that [benefit]..." className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-white outline-none focus:border-[#6366f1] transition-colors resize-none" />
              </div>

              <div>
                <label className="text-sm font-bold text-white mb-3 block">Unique Value Proposition (Optional)</label>
                <textarea value={uniqueValueProposition} onChange={(e) => setUniqueValueProposition(e.target.value)} rows={2} placeholder="e.g., We deliver results 3x faster than competitors with half the cost..." className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-white outline-none focus:border-[#6366f1] transition-colors resize-none" />
              </div>

              <div className="flex justify-start mt-8">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "channels" && (
            <motion.div key="channels" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Marketing Channels</h2>
                  <p className="text-slate-400">Which channels are you using or planning to use?</p>
                </div>
                <button onClick={handleNext} className="rounded-full bg-[#6366f1] px-6 py-3 text-sm font-bold text-white hover:bg-[#5558e6] transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/25">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-8">
                <label className="text-sm font-bold text-white mb-3 block">Currently Using (Optional)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {MARKETING_CHANNELS.map((channel) => (
                    <button key={channel} onClick={() => toggleChannel(channel, "existing")} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all text-left ${existingChannels.includes(channel) ? "border-[#6366f1] bg-[#6366f1]/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}>
                      {existingChannels.includes(channel) && <Check className="inline h-3 w-3 mr-2" />}
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-white mb-3 block">Want to Explore (Optional)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {MARKETING_CHANNELS.map((channel) => (
                    <button key={channel} onClick={() => toggleChannel(channel, "preferred")} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all text-left ${preferredChannels.includes(channel) ? "border-emerald-500 bg-emerald-500/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}>
                      {preferredChannels.includes(channel) && <Check className="inline h-3 w-3 mr-2" />}
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-start mt-8">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "challenges" && (
            <motion.div key="challenges" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Challenges & Additional Context</h2>
                  <p className="text-slate-400">What obstacles are you facing? Any other context?</p>
                </div>
                <button 
                  onClick={startGeneration} 
                  disabled={!canGenerate}
                  className={`rounded-full px-8 py-3 text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg ${
                    canGenerate 
                      ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:scale-105 shadow-[#6366f1]/25" 
                      : "bg-slate-600 cursor-not-allowed"
                  }`}
                >
                  {canGenerate ? (
                    <>
                      Generate Strategy <Sparkles className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Limit Reached
                    </>
                  )}
                </button>
              </div>

              {!canGenerate && (
                <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 flex-shrink-0">
                      <Lock className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-200 mb-1">
                        Monthly strategy limit reached
                      </p>
                      <p className="text-xs text-amber-400/80 mb-3">
                        You've used {strategiesUsed} of {strategiesLimit} strategies on your {userPlan} plan. Upgrade to continue generating strategies.
                      </p>
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-1.5 text-xs font-bold text-white hover:scale-105 transition-all"
                      >
                        <Crown className="h-3 w-3" />
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <label className="text-sm font-bold text-white mb-3 block">Key Challenges (Optional)</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={newChallenge} onChange={(e) => setNewChallenge(e.target.value)} placeholder="e.g., Limited brand awareness" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-[#6366f1] transition-colors" onKeyDown={(e) => { if (e.key === "Enter") addChallenge(); }} />
                  <button onClick={addChallenge} className="rounded-lg bg-[#6366f1] px-4 py-2 text-white hover:bg-[#5558e6] transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {keyChallenges.length > 0 && (
                  <div className="space-y-2">
                    {keyChallenges.map((challenge, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                        <span className="text-sm text-white">{challenge}</span>
                        <button onClick={() => removeChallenge(i)} className="text-slate-400 hover:text-red-400 transition-colors">
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <label className="text-sm font-bold text-white mb-3 block">Additional Notes (Optional)</label>
                <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} rows={4} placeholder="Any other information that might help us create a better strategy..." className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-white outline-none focus:border-[#6366f1] transition-colors resize-none" />
              </div>

              <div className="mb-8 p-4 rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAsDefault}
                    onChange={(e) => setSaveAsDefault(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-[#6366f1] focus:ring-[#6366f1]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save as my default business profile
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Your information will be pre-filled next time you create a strategy. You can always modify it.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex justify-start mt-8">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center p-6 relative overflow-hidden min-h-[60vh]">
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <motion.div key={i} className="absolute w-1 h-1 bg-[#6366f1] rounded-full" initial={{ x: "50%", y: "50%", opacity: 0 }} animate={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, opacity: [0, 1, 0] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
                ))}
              </div>
              <div className="text-center relative z-10">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="inline-flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#6366f1]/30 mb-8">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/50" />
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.p key={genMessage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="text-xl font-bold text-white mb-4">
                    {GENERATION_MESSAGES[genMessage]}
                  </motion.p>
                </AnimatePresence>
                <div className="flex items-center justify-center gap-2 mt-4">
                  {GENERATION_MESSAGES.map((_, i) => (
                    <motion.div key={i} className={`h-1.5 rounded-full ${i <= genMessage ? "bg-[#6366f1]" : "bg-white/10"}`} animate={{ width: i === genMessage ? 24 : 6 }} transition={{ duration: 0.3 }} />
                  ))}
                </div>
                {error && (
                  <div className="mt-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                    <p className="text-sm text-red-300">Error: {error}</p>
                    <p className="text-xs text-slate-400 mt-2">Redirecting...</p>
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