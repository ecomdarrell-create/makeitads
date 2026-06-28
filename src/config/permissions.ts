// Configuration complète des features par plan
export interface PlanPermissions {
  // Stratégies AI
  strategyGeneration: {
    enabled: boolean;
    monthlyLimit: number;
  };
  
  // Intelligence concurrentielle
  competitorIntelligence: {
    enabled: boolean;
    maxCompetitors: number;
  };
  
  // Analyse de tendances
  trendAnalysis: {
    enabled: boolean;
    realTime: boolean;
  };
  
  // Analyse SWOT
  swotAnalysis: {
    enabled: boolean;
  };
  
  // Insights audience
  audienceInsights: {
    enabled: boolean;
    advancedSegmentation: boolean;
  };
  
  // Support
  support: {
    email: boolean;
    phone: boolean;
    responseTime: string;
    dedicated: boolean;
  };
  
  // Exports PDF
  pdfExport: {
    enabled: boolean;
    branding: boolean;
    whiteLabel: boolean;
    monthlyLimit: number;
  };
  
  // Espion publicitaire
  adSpyTool: {
    enabled: boolean;
  };
  
  // Détection d'opportunités
  opportunityDetection: {
    enabled: boolean;
  };
  
  // API
  api: {
    enabled: boolean;
    monthlyCalls: number;
  };
  
  // Exports CSV/PDF
  exportFormats: {
    csv: boolean;
    pdf: boolean;
    api: boolean;
  };
  
  // Templates personnalisés
  customTemplates: {
    enabled: boolean;
    limit: number;
  };
  
  // Dashboard performance
  performanceDashboard: {
    enabled: boolean;
    advanced: boolean;
  };
  
  // Prédictions
  predictiveTrends: {
    enabled: boolean;
  };
  
  // Intelligence historique
  historicalIntelligence: {
    enabled: boolean;
    yearsBack: number;
  };
  
  // Part de marché
  marketShareAnalysis: {
    enabled: boolean;
  };
  
  // Estimation trafic
  trafficEstimation: {
    enabled: boolean;
  };
  
  // Account manager
  accountManager: {
    enabled: boolean;
    dedicated: boolean;
  };
  
  // Tracking concurrentiel temps réel
  realTimeCompetitorTracking: {
    enabled: boolean;
  };
  
  // Analyse multi-canal
  multiChannelAnalysis: {
    enabled: boolean;
  };
  
  // Entraînement IA personnalisé
  customAITraining: {
    enabled: boolean;
  };
  
  // Recommandations A/B testing
  abTesting: {
    enabled: boolean;
  };
  
  // Optimisation ROI
  roiOptimization: {
    enabled: boolean;
  };
  
  // Intégrations
  integrations: {
    enabled: boolean;
    limit: number;
  };
  
  // Workflows personnalisés
  customWorkflows: {
    enabled: boolean;
  };
  
  // Multi-marque
  multiBrand: {
    enabled: boolean;
    limit: number;
  };
  
  // Collaboration équipe
  teamCollaboration: {
    enabled: boolean;
    maxUsers: number;
  };
  
  // SLA
  sla: {
    enabled: boolean;
    uptime: string;
  };
  
  // Déploiement on-premise
  onPremise: {
    enabled: boolean;
  };
  
  // Sécurité avancée
  advancedSecurity: {
    enabled: boolean;
  };
  
  // Rapports personnalisés
  customReporting: {
    enabled: boolean;
  };
  
  // Solution white-label
  whiteLabelSolution: {
    enabled: boolean;
  };
  
  // Sessions de formation
  trainingSessions: {
    enabled: boolean;
    limit: number;
  };
  
  // Revues trimestrielles
  quarterlyReviews: {
    enabled: boolean;
  };
  
  // Développement features custom
  customFeatureDevelopment: {
    enabled: boolean;
  };
  
  // Demandes features prioritaires
  priorityFeatureRequests: {
    enabled: boolean;
  };
  
  // Infrastructure dédiée
  dedicatedInfrastructure: {
    enabled: boolean;
  };
}

// Configuration par plan
export const PLAN_PERMISSIONS: Record<string, PlanPermissions> = {
  free: {
    strategyGeneration: { enabled: true, monthlyLimit: 1 },
    competitorIntelligence: { enabled: false, maxCompetitors: 0 },
    trendAnalysis: { enabled: false, realTime: false },
    swotAnalysis: { enabled: false },
    audienceInsights: { enabled: false, advancedSegmentation: false },
    support: { email: true, phone: false, responseTime: "48h", dedicated: false },
    pdfExport: { enabled: false, branding: false, whiteLabel: false, monthlyLimit: 0 },
    adSpyTool: { enabled: false },
    opportunityDetection: { enabled: false },
    api: { enabled: false, monthlyCalls: 0 },
    exportFormats: { csv: false, pdf: false, api: false },
    customTemplates: { enabled: false, limit: 0 },
    performanceDashboard: { enabled: false, advanced: false },
    predictiveTrends: { enabled: false },
    historicalIntelligence: { enabled: false, yearsBack: 0 },
    marketShareAnalysis: { enabled: false },
    trafficEstimation: { enabled: false },
    accountManager: { enabled: false, dedicated: false },
    realTimeCompetitorTracking: { enabled: false },
    multiChannelAnalysis: { enabled: false },
    customAITraining: { enabled: false },
    abTesting: { enabled: false },
    roiOptimization: { enabled: false },
    integrations: { enabled: false, limit: 0 },
    customWorkflows: { enabled: false },
    multiBrand: { enabled: false, limit: 0 },
    teamCollaboration: { enabled: false, maxUsers: 0 },
    sla: { enabled: false, uptime: "0%" },
    onPremise: { enabled: false },
    advancedSecurity: { enabled: false },
    customReporting: { enabled: false },
    whiteLabelSolution: { enabled: false },
    trainingSessions: { enabled: false, limit: 0 },
    quarterlyReviews: { enabled: false },
    customFeatureDevelopment: { enabled: false },
    priorityFeatureRequests: { enabled: false },
    dedicatedInfrastructure: { enabled: false },
  },

  pro: {
    strategyGeneration: { enabled: true, monthlyLimit: 10 },
    competitorIntelligence: { enabled: true, maxCompetitors: 10 },
    trendAnalysis: { enabled: true, realTime: false },
    swotAnalysis: { enabled: true },
    audienceInsights: { enabled: true, advancedSegmentation: false },
    support: { email: true, phone: false, responseTime: "24h", dedicated: false },
    pdfExport: { enabled: true, branding: true, whiteLabel: false, monthlyLimit: 10 },
    adSpyTool: { enabled: true },
    opportunityDetection: { enabled: true },
    api: { enabled: true, monthlyCalls: 1000 },
    exportFormats: { csv: true, pdf: true, api: false },
    customTemplates: { enabled: true, limit: 25 },
    performanceDashboard: { enabled: true, advanced: false },
    predictiveTrends: { enabled: false },
    historicalIntelligence: { enabled: false, yearsBack: 0 },
    marketShareAnalysis: { enabled: false },
    trafficEstimation: { enabled: false },
    accountManager: { enabled: false, dedicated: false },
    realTimeCompetitorTracking: { enabled: false },
    multiChannelAnalysis: { enabled: false },
    customAITraining: { enabled: false },
    abTesting: { enabled: false },
    roiOptimization: { enabled: false },
    integrations: { enabled: true, limit: 20 },
    customWorkflows: { enabled: false },
    multiBrand: { enabled: false, limit: 0 },
    teamCollaboration: { enabled: false, maxUsers: 0 },
    sla: { enabled: false, uptime: "0%" },
    onPremise: { enabled: false },
    advancedSecurity: { enabled: false },
    customReporting: { enabled: false },
    whiteLabelSolution: { enabled: false },
    trainingSessions: { enabled: false, limit: 0 },
    quarterlyReviews: { enabled: false },
    customFeatureDevelopment: { enabled: false },
    priorityFeatureRequests: { enabled: false },
    dedicatedInfrastructure: { enabled: false },
  },

  premium: {
    strategyGeneration: { enabled: true, monthlyLimit: -1 },
    competitorIntelligence: { enabled: true, maxCompetitors: 50 },
    trendAnalysis: { enabled: true, realTime: true },
    swotAnalysis: { enabled: true },
    audienceInsights: { enabled: true, advancedSegmentation: true },
    support: { email: true, phone: true, responseTime: "1h", dedicated: true },
    pdfExport: { enabled: true, branding: true, whiteLabel: true, monthlyLimit: -1 },
    adSpyTool: { enabled: true },
    opportunityDetection: { enabled: true },
    api: { enabled: true, monthlyCalls: 10000 },
    exportFormats: { csv: true, pdf: true, api: true },
    customTemplates: { enabled: true, limit: 100 },
    performanceDashboard: { enabled: true, advanced: true },
    predictiveTrends: { enabled: true },
    historicalIntelligence: { enabled: true, yearsBack: 5 },
    marketShareAnalysis: { enabled: true },
    trafficEstimation: { enabled: true },
    accountManager: { enabled: true, dedicated: true },
    realTimeCompetitorTracking: { enabled: true },
    multiChannelAnalysis: { enabled: true },
    customAITraining: { enabled: true },
    abTesting: { enabled: true },
    roiOptimization: { enabled: true },
    integrations: { enabled: true, limit: 50 },
    customWorkflows: { enabled: true },
    multiBrand: { enabled: true, limit: 3 },
    teamCollaboration: { enabled: true, maxUsers: 5 },
    sla: { enabled: false, uptime: "0%" },
    onPremise: { enabled: false },
    advancedSecurity: { enabled: false },
    customReporting: { enabled: true },
    whiteLabelSolution: { enabled: false },
    trainingSessions: { enabled: true, limit: 1 },
    quarterlyReviews: { enabled: false },
    customFeatureDevelopment: { enabled: false },
    priorityFeatureRequests: { enabled: false },
    dedicatedInfrastructure: { enabled: false },
  },

  enterprise: {
    strategyGeneration: { enabled: true, monthlyLimit: -1 },
    competitorIntelligence: { enabled: true, maxCompetitors: -1 },
    trendAnalysis: { enabled: true, realTime: true },
    swotAnalysis: { enabled: true },
    audienceInsights: { enabled: true, advancedSegmentation: true },
    support: { email: true, phone: true, responseTime: "24/7", dedicated: true },
    pdfExport: { enabled: true, branding: true, whiteLabel: true, monthlyLimit: -1 },
    adSpyTool: { enabled: true },
    opportunityDetection: { enabled: true },
    api: { enabled: true, monthlyCalls: -1 },
    exportFormats: { csv: true, pdf: true, api: true },
    customTemplates: { enabled: true, limit: -1 },
    performanceDashboard: { enabled: true, advanced: true },
    predictiveTrends: { enabled: true },
    historicalIntelligence: { enabled: true, yearsBack: -1 },
    marketShareAnalysis: { enabled: true },
    trafficEstimation: { enabled: true },
    accountManager: { enabled: true, dedicated: true },
    realTimeCompetitorTracking: { enabled: true },
    multiChannelAnalysis: { enabled: true },
    customAITraining: { enabled: true },
    abTesting: { enabled: true },
    roiOptimization: { enabled: true },
    integrations: { enabled: true, limit: -1 },
    customWorkflows: { enabled: true },
    multiBrand: { enabled: true, limit: -1 },
    teamCollaboration: { enabled: true, maxUsers: 25 },
    sla: { enabled: true, uptime: "99.9%" },
    onPremise: { enabled: true },
    advancedSecurity: { enabled: true },
    customReporting: { enabled: true },
    whiteLabelSolution: { enabled: true },
    trainingSessions: { enabled: true, limit: -1 },
    quarterlyReviews: { enabled: true },
    customFeatureDevelopment: { enabled: true },
    priorityFeatureRequests: { enabled: true },
    dedicatedInfrastructure: { enabled: true },
  },
};

// Helper pour vérifier si une feature est disponible
export function hasFeature(plan: string, feature: keyof PlanPermissions): boolean {
  const permissions = PLAN_PERMISSIONS[plan.toLowerCase()] || PLAN_PERMISSIONS.free;
  const featureConfig = permissions[feature];
  
  if (!featureConfig) return false;
  
  // Si la feature a une propriété 'enabled', on la retourne
  if ('enabled' in featureConfig) {
    return (featureConfig as any).enabled;
  }
  
  // Pour 'support', on vérifie si email est true (feature de base)
  if (feature === 'support') {
    return (featureConfig as any).email;
  }
  
  // Pour 'exportFormats', on vérifie si au moins un format est disponible
  if (feature === 'exportFormats') {
    const config = featureConfig as any;
    return config.csv || config.pdf || config.api;
  }
  
  return false;
}

// Helper pour obtenir la limite d'une feature
export function getFeatureLimit(plan: string, feature: keyof PlanPermissions): number {
  const permissions = PLAN_PERMISSIONS[plan.toLowerCase()] || PLAN_PERMISSIONS.free;
  const featureConfig = permissions[feature] as any;
  
  if (!featureConfig) return 0;
  
  // Retourne la première limite trouvée
  return featureConfig.monthlyLimit 
    ?? featureConfig.maxCompetitors 
    ?? featureConfig.monthlyCalls 
    ?? featureConfig.limit 
    ?? featureConfig.maxUsers 
    ?? featureConfig.yearsBack 
    ?? 0;
}