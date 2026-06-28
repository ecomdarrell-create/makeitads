import { usePlan } from "./usePlan";
import { useUsage } from "./useUsage";
import { PRICING_CONFIG, PlanId, hasPermission as checkPermission } from "@/config/pricing.config";
import { PLAN_PERMISSIONS, hasFeature, getFeatureLimit } from "@/config/permissions";

export function usePermissions() {
  const { isFree, isPro, isPremium, isEnterprise, loading, error, refresh } = usePlan();
  const { usage: usageData } = useUsage();

  // Calculer userPlan à partir des booléens
  const userPlan = isEnterprise ? "enterprise" : isPremium ? "premium" : isPro ? "pro" : "free";
  const planPermissions = PLAN_PERMISSIONS[userPlan.toLowerCase()] || PLAN_PERMISSIONS.free;

  // ✅ ENTERPRISE DÉBLOQUE TOUT
  const isEnterprisePlan = userPlan === "enterprise";

  const can = (feature: keyof (typeof PRICING_CONFIG)["free"]["limits"]): boolean => {
    // Enterprise a accès à TOUT
    if (isEnterprisePlan) return true;
    return checkPermission(userPlan as PlanId, feature);
  };

  // Nouvelle fonction pour vérifier les features de PLAN_PERMISSIONS
  const hasFeatureAccess = (feature: keyof typeof PLAN_PERMISSIONS.free): boolean => {
    if (isEnterprisePlan) return true;
    return hasFeature(userPlan as PlanId, feature);
  };

  // Obtenir la limite d'une feature
  const getLimit = (feature: keyof typeof PLAN_PERMISSIONS.free): number => {
    return getFeatureLimit(userPlan as PlanId, feature);
  };

  // Vérifier si illimité
  const isUnlimited = (feature: keyof typeof PLAN_PERMISSIONS.free): boolean => {
    return getLimit(feature) === -1;
  };

  const isProOrAbove = isPro || isPremium || isEnterprise;
  const isPremiumOrAbove = isPremium || isEnterprise;

  const quotaUsed = usageData?.strategiesUsed || 0;
  const quotaLimit = usageData?.strategiesLimit || 1;
  const quotaReached = isFree && quotaUsed >= quotaLimit;
  const quotaRemaining = isFree ? Math.max(0, quotaLimit - quotaUsed) : 9999;

  // Features Intelligence
  const canSeeCompetitorIntel = can("competitorIntelligence");
  const canSeeTrendIntel = can("trendIntelligence");
  const canSeePredictiveTrends = can("predictiveTrends");
  const canSeeHistoricalIntel = can("historicalIntelligence");

  // Features Analysis
  const canSeeSWOT = can("swotAnalysis");
  const canSeeAudienceInsights = can("audienceInsights");
  const canSeeMarketShare = can("marketShareAnalysis");
  const canSeeTrafficEstimation = can("trafficEstimation");
  const canSeeGrowthForecast = can("growthForecast");
  const canSeeKeywordOpportunities = can("keywordOpportunities");
  const canSeeAdvertisingIntel = can("advertisingIntelligence");

  // Features Export
  const canExportPDF = can("pdfExport");
  const canSeeAdvancedReports = can("advancedReports");
  const canSeeWhiteLabelReports = can("whiteLabelReports");
  const canAccessAPI = can("apiAccess");
  const canUseCustomIntegrations = can("customIntegrations");

  // Features Support
  const hasPrioritySupport = can("prioritySupport");
  const hasDedicatedManager = can("dedicatedManager");
  const hasSLA = can("slaGuarantee");
  const hasCustomTraining = can("customTraining");

  // Features Team
  const canUseTeamCollaboration = can("teamCollaboration");
  const canUseMultiBrand = can("multiBrandManagement");
  const canUseSSO = can("ssoSaml");

  // Navigation
  const canAccessCompetitors = can("competitorIntelligence");
  const canAccessAnalytics = true;
  const canAccessCalendar = true;

  // ✅ NOUVELLES FEATURES DE PLAN_PERMISSIONS
  
  // Stratégies AI
  const canGenerateStrategy = hasFeatureAccess("strategyGeneration");
  const strategyLimit = getLimit("strategyGeneration");
  const isUnlimitedStrategies = isUnlimited("strategyGeneration");

  // Intelligence concurrentielle avancée
  const maxCompetitors = getLimit("competitorIntelligence");
  const isUnlimitedCompetitors = isUnlimited("competitorIntelligence");

  // Analyse de tendances
  const hasRealTimeTrends = planPermissions.trendAnalysis.realTime;

  // Exports PDF avancés
  const hasPdfBranding = planPermissions.pdfExport.branding;
  const hasWhiteLabelPdf = planPermissions.pdfExport.whiteLabel;
  const pdfExportLimit = getLimit("pdfExport");
  const isUnlimitedPdf = isUnlimited("pdfExport");

  // Espion publicitaire
  const canUseAdSpyTool = hasFeatureAccess("adSpyTool");

  // Détection d'opportunités
  const canDetectOpportunities = hasFeatureAccess("opportunityDetection");

  // API avancée
  const apiCallsLimit = getLimit("api");
  const isUnlimitedApi = isUnlimited("api");

  // Formats d'export
  const canExportCSV = planPermissions.exportFormats.csv;
  const canExportViaAPI = planPermissions.exportFormats.api;

  // Templates personnalisés
  const canUseCustomTemplates = hasFeatureAccess("customTemplates");
  const customTemplatesLimit = getLimit("customTemplates");

  // Dashboard performance
  const canAccessPerformanceDashboard = hasFeatureAccess("performanceDashboard");
  const hasAdvancedDashboard = planPermissions.performanceDashboard.advanced;

  // Intelligence historique
  const historicalYearsBack = getLimit("historicalIntelligence");

  // Account manager
  const hasAccountManager = hasFeatureAccess("accountManager");
  const hasDedicatedAccountManager = planPermissions.accountManager.dedicated;

  // Tracking concurrentiel temps réel
  const canUseRealTimeTracking = hasFeatureAccess("realTimeCompetitorTracking");

  // Analyse multi-canal
  const canUseMultiChannelAnalysis = hasFeatureAccess("multiChannelAnalysis");

  // Entraînement IA personnalisé
  const canUseCustomAITraining = hasFeatureAccess("customAITraining");

  // A/B Testing
  const canUseABTesting = hasFeatureAccess("abTesting");

  // Optimisation ROI
  const canUseROIOptimization = hasFeatureAccess("roiOptimization");

  // Intégrations
  const integrationsLimit = getLimit("integrations");
  const isUnlimitedIntegrations = isUnlimited("integrations");

  // Workflows personnalisés
  const canUseCustomWorkflows = hasFeatureAccess("customWorkflows");

  // Multi-marque
  const multiBrandLimit = getLimit("multiBrand");
  const isUnlimitedMultiBrand = isUnlimited("multiBrand");

  // Collaboration équipe
  const maxTeamUsers = getLimit("teamCollaboration");

  // SLA
  const slaUptime = planPermissions.sla.uptime;

  // Déploiement on-premise
  const canUseOnPremise = hasFeatureAccess("onPremise");

  // Sécurité avancée
  const hasAdvancedSecurity = hasFeatureAccess("advancedSecurity");

  // Rapports personnalisés
  const canUseCustomReporting = hasFeatureAccess("customReporting");

  // Solution white-label
  const hasWhiteLabelSolution = hasFeatureAccess("whiteLabelSolution");

  // Sessions de formation
  const trainingSessionsLimit = getLimit("trainingSessions");
  const isUnlimitedTraining = isUnlimited("trainingSessions");

  // Revues trimestrielles
  const hasQuarterlyReviews = hasFeatureAccess("quarterlyReviews");

  // Développement features custom
  const canRequestCustomFeatures = hasFeatureAccess("customFeatureDevelopment");

  // Demandes features prioritaires
  const hasPriorityFeatureRequests = hasFeatureAccess("priorityFeatureRequests");

  // Infrastructure dédiée
  const hasDedicatedInfrastructure = hasFeatureAccess("dedicatedInfrastructure");

  // Support details
  const supportResponseTime = planPermissions.support.responseTime;
  const hasPhoneSupport = planPermissions.support.phone;
  const hasEmailSupport = planPermissions.support.email;

  return {
    loading,
    error,
    refresh,
    userPlan,
    isFree,
    isPro,
    isPremium,
    isEnterprise,
    isProOrAbove,
    isPremiumOrAbove,
    quotaUsed,
    quotaLimit,
    quotaReached,
    quotaRemaining,
    can,
    hasFeatureAccess,
    getLimit,
    isUnlimited,
    
    // Features Intelligence
    canSeeCompetitorIntel,
    canSeeTrendIntel,
    canSeePredictiveTrends,
    canSeeHistoricalIntel,
    
    // Features Analysis
    canSeeSWOT,
    canSeeAudienceInsights,
    canSeeMarketShare,
    canSeeTrafficEstimation,
    canSeeGrowthForecast,
    canSeeKeywordOpportunities,
    canSeeAdvertisingIntel,
    
    // Features Export
    canExportPDF,
    canSeeAdvancedReports,
    canSeeWhiteLabelReports,
    canAccessAPI,
    canUseCustomIntegrations,
    
    // Features Support
    hasPrioritySupport,
    hasDedicatedManager,
    hasSLA,
    hasCustomTraining,
    
    // Features Team
    canUseTeamCollaboration,
    canUseMultiBrand,
    canUseSSO,
    
    // Navigation
    canAccessCompetitors,
    canAccessAnalytics,
    canAccessCalendar,
    
    // ✅ NOUVELLES FEATURES
    
    // Stratégies AI
    canGenerateStrategy,
    strategyLimit,
    isUnlimitedStrategies,
    
    // Intelligence concurrentielle avancée
    maxCompetitors,
    isUnlimitedCompetitors,
    
    // Analyse de tendances
    hasRealTimeTrends,
    
    // Exports PDF avancés
    hasPdfBranding,
    hasWhiteLabelPdf,
    pdfExportLimit,
    isUnlimitedPdf,
    
    // Espion publicitaire
    canUseAdSpyTool,
    
    // Détection d'opportunités
    canDetectOpportunities,
    
    // API avancée
    apiCallsLimit,
    isUnlimitedApi,
    
    // Formats d'export
    canExportCSV,
    canExportViaAPI,
    
    // Templates personnalisés
    canUseCustomTemplates,
    customTemplatesLimit,
    
    // Dashboard performance
    canAccessPerformanceDashboard,
    hasAdvancedDashboard,
    
    // Intelligence historique
    historicalYearsBack,
    
    // Account manager
    hasAccountManager,
    hasDedicatedAccountManager,
    
    // Tracking concurrentiel temps réel
    canUseRealTimeTracking,
    
    // Analyse multi-canal
    canUseMultiChannelAnalysis,
    
    // Entraînement IA personnalisé
    canUseCustomAITraining,
    
    // A/B Testing
    canUseABTesting,
    
    // Optimisation ROI
    canUseROIOptimization,
    
    // Intégrations
    integrationsLimit,
    isUnlimitedIntegrations,
    
    // Workflows personnalisés
    canUseCustomWorkflows,
    
    // Multi-marque
    multiBrandLimit,
    isUnlimitedMultiBrand,
    
    // Collaboration équipe
    maxTeamUsers,
    
    // SLA
    slaUptime,
    
    // Déploiement on-premise
    canUseOnPremise,
    
    // Sécurité avancée
    hasAdvancedSecurity,
    
    // Rapports personnalisés
    canUseCustomReporting,
    
    // Solution white-label
    hasWhiteLabelSolution,
    
    // Sessions de formation
    trainingSessionsLimit,
    isUnlimitedTraining,
    
    // Revues trimestrielles
    hasQuarterlyReviews,
    
    // Développement features custom
    canRequestCustomFeatures,
    
    // Demandes features prioritaires
    hasPriorityFeatureRequests,
    
    // Infrastructure dédiée
    hasDedicatedInfrastructure,
    
    // Support details
    supportResponseTime,
    hasPhoneSupport,
    hasEmailSupport,
  };
}