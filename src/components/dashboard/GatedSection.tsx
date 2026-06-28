"use client";

import { motion } from "framer-motion";
import { Lock, Crown, Zap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/hooks/usePlan";

interface GatedSectionProps {
  requiredPlan: "pro" | "premium";
  title: string;
  description: string;
  children: React.ReactNode;
  blurIntensity?: "light" | "medium" | "heavy";
}

export default function GatedSection({
  requiredPlan,
  title,
  description,
  children,
  blurIntensity = "medium",
}: GatedSectionProps) {
  const router = useRouter();
  const { isPro, isPremium, isEnterprise } = usePlan();

  const isLocked = (requiredPlan === "pro" && !isPro && !isPremium && !isEnterprise) || 
                   (requiredPlan === "premium" && !isPremium && !isEnterprise);

  const blurClasses = {
    light: "blur-[2px]",
    medium: "blur-sm",
    heavy: "blur-md",
  };

  const handleUpgrade = () => {
    router.push(`/pricing?plan=${requiredPlan}`);
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0f0f1a] overflow-hidden group hover:border-[#6366f1]/20 transition-all">
      {/* Content (blurred if locked) */}
      <div className={isLocked ? blurClasses[blurIntensity] : ""}>
        {children}
      </div>

      {/* Overlay (only if locked) */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f0f1a]/70 backdrop-blur-sm"
        >
          <div className="text-center px-6 py-8 rounded-2xl border border-[#6366f1]/20 bg-[#0f0f1a]/90 shadow-2xl shadow-[#6366f1]/10 max-w-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] mb-4">
              {requiredPlan === "premium" ? (
                <Crown className="h-6 w-6 text-white" />
              ) : (
                <Zap className="h-6 w-6 text-white" />
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform"
            >
              Upgrade to {requiredPlan === "premium" ? "Premium" : "Pro"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}