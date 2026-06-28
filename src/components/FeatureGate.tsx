"use client";

import { ReactNode } from "react";
import { Lock, Crown, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";

interface FeatureGateProps {
  feature: "competitorIntelligence" | "trendIntelligence" | "predictiveTrends" | 
           "historicalIntelligence" | "swotAnalysis" | "audienceInsights" | 
           "marketShareAnalysis" | "trafficEstimation" | "growthForecast" | 
           "keywordOpportunities" | "advertisingIntelligence" | "pdfExport" | 
           "advancedReports" | "whiteLabelReports" | "apiAccess" | "customIntegrations" |
           "prioritySupport" | "dedicatedManager" | "slaGuarantee" | "customTraining" |
           "teamCollaboration" | "multiBrandManagement" | "ssoSaml" |
           // ✅ NOUVELLES FEATURES
           "strategyGeneration" | "adSpyTool" | "opportunityDetection" |
           "customTemplates" | "performanceDashboard" | "realTimeCompetitorTracking" |
           "multiChannelAnalysis" | "customAITraining" | "abTesting" |
           "roiOptimization" | "customWorkflows" | "onPremise" |
           "advancedSecurity" | "customReporting" | "whiteLabelSolution" |
           "quarterlyReviews" | "customFeatureDevelopment" | "priorityFeatureRequests" |
           "dedicatedInfrastructure";
  children: ReactNode;
  fallback?: ReactNode;
  blur?: boolean;
  showBadge?: boolean;
  requiredPlan?: "pro" | "premium" | "enterprise";
}

export function FeatureGate({
  feature,
  children,
  fallback,
  blur = true,
  showBadge = true,
  requiredPlan,
}: FeatureGateProps) {
  const router = useRouter();
  const { can, hasFeatureAccess, userPlan, isProOrAbove, isPremiumOrAbove } = usePermissions();

  // Vérifier l'accès avec l'ancienne méthode (can) ou la nouvelle (hasFeatureAccess)
  const hasAccess = can(feature as any) || hasFeatureAccess(feature as any);

  // Si l'utilisateur a accès, afficher le contenu normalement
  if (hasAccess) {
    return <>{children}</>;
  }

  // Déterminer le plan requis
  const planNeeded = requiredPlan || getRequiredPlan(feature);

  // Si un fallback personnalisé est fourni, l'utiliser
  if (fallback) {
    return <>{fallback}</>;
  }

  // Sinon, afficher le verrouillage par défaut
  return (
    <div className="relative">
      {/* Contenu flouté */}
      {blur && (
        <div className="pointer-events-none select-none blur-sm opacity-50">
          {children}
        </div>
      )}

      {/* Overlay de verrouillage */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#080810]/80 backdrop-blur-sm rounded-2xl z-10">
        <div className="text-center p-6 max-w-sm">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 mb-4">
            {planNeeded === "enterprise" ? (
              <Crown className="h-7 w-7 text-[#8b5cf6]" />
            ) : planNeeded === "premium" ? (
              <Crown className="h-7 w-7 text-[#8b5cf6]" />
            ) : (
              <Zap className="h-7 w-7 text-[#8b5cf6]" />
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            {planNeeded === "enterprise"
              ? "Enterprise Feature"
              : planNeeded === "premium"
              ? "Premium Feature"
              : "Pro Feature"}
          </h3>

          <p className="text-sm text-slate-400 mb-4">
            Upgrade to {planNeeded.charAt(0).toUpperCase() + planNeeded.slice(1)} to unlock this advanced feature.
          </p>

          {showBadge && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-2 py-1 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] text-xs font-bold uppercase tracking-wider">
                {userPlan}
              </span>
              <span className="text-slate-500">→</span>
              <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-xs font-bold uppercase tracking-wider">
                {planNeeded}
              </span>
            </div>
          )}

          <button
            onClick={() => router.push("/dashboard/billing")}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:scale-105 transition-all"
          >
            <Lock className="h-4 w-4" />
            Upgrade to {planNeeded.charAt(0).toUpperCase() + planNeeded.slice(1)}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper pour déterminer le plan requis pour une feature
function getRequiredPlan(
  feature: FeatureGateProps["feature"]
): "pro" | "premium" | "enterprise" {
  const proFeatures = [
    "competitorIntelligence",
    "trendIntelligence",
    "swotAnalysis",
    "audienceInsights",
    "keywordOpportunities",
    "pdfExport",
    "prioritySupport",
    // ✅ NOUVELLES FEATURES PRO
    "strategyGeneration",
    "adSpyTool",
    "opportunityDetection",
    "customTemplates",
    "performanceDashboard",
  ];

  const premiumFeatures = [
    "predictiveTrends",
    "historicalIntelligence",
    "marketShareAnalysis",
    "trafficEstimation",
    "growthForecast",
    "advertisingIntelligence",
    "advancedReports",
    "whiteLabelReports",
    "apiAccess",
    "teamCollaboration",
    // ✅ NOUVELLES FEATURES PREMIUM
    "realTimeCompetitorTracking",
    "multiChannelAnalysis",
    "customAITraining",
    "abTesting",
    "roiOptimization",
    "customWorkflows",
    "customReporting",
  ];

  const enterpriseFeatures = [
    "customIntegrations",
    "dedicatedManager",
    "slaGuarantee",
    "customTraining",
    "multiBrandManagement",
    "ssoSaml",
    // ✅ NOUVELLES FEATURES ENTERPRISE
    "onPremise",
    "advancedSecurity",
    "whiteLabelSolution",
    "quarterlyReviews",
    "customFeatureDevelopment",
    "priorityFeatureRequests",
    "dedicatedInfrastructure",
  ];

  if (enterpriseFeatures.includes(feature)) return "enterprise";
  if (premiumFeatures.includes(feature)) return "premium";
  if (proFeatures.includes(feature)) return "pro";

  return "pro"; // Default
}

// Composant simplifié pour les badges de verrouillage
export function LockBadge({ requiredPlan = "pro" }: { requiredPlan?: "pro" | "premium" | "enterprise" }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-white/10 bg-white/[0.03] text-[9px] font-bold uppercase tracking-wider text-slate-500">
      <Lock className="h-2.5 w-2.5" />
      {requiredPlan}
    </span>
  );
}