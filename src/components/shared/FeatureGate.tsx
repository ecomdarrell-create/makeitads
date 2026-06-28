"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { PlanId, PRICING_PLANS, isFeatureAvailable } from "@/config/pricing";

interface FeatureGateProps {
  userPlan: PlanId;
  requiredPlan: PlanId;
  children: React.ReactNode;
  fallbackMessage?: string;
}

export default function FeatureGate({ userPlan, requiredPlan, children, fallbackMessage }: FeatureGateProps) {
  const isAvailable = isFeatureAvailable(userPlan, requiredPlan);

  if (isAvailable) return <>{children}</>;

  const requiredPlanName = PRICING_PLANS[requiredPlan].name;

  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.02] p-6 opacity-60">
      <div className="absolute inset-0 bg-[#080810]/60 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-8 w-8 text-[#8b5cf6] mx-auto mb-2" />
          <p className="text-sm font-semibold text-white mb-1">{fallbackMessage || `Available on ${requiredPlanName}`}</p>
          <Link href="/pricing" className="text-xs font-bold text-[#8b5cf6] hover:text-white transition-colors">Upgrade to {requiredPlanName} →</Link>
        </div>
      </div>
      {children}
    </div>
  );
}