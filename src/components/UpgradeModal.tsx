"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Crown, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  featureName: string;
  limitReached: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  featureName,
  limitReached,
}: UpgradeModalProps) {
  const plans = [
    {
      name: "Pro",
      price: 29,
      icon: Zap,
      color: "from-[#6366f1] to-[#8b5cf6]",
      features: [
        "10 strategies per month",
        "Competitor intelligence",
        "PDF exports",
        "Priority support",
      ],
    },
    {
      name: "Premium",
      price: 59,
      icon: Crown,
      color: "from-violet-500 to-fuchsia-500",
      features: [
        "Unlimited strategies",
        "Unlimited PDF exports",
        "Predictive trends",
        "Dedicated support",
      ],
      popular: true,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0a0a14] p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] mb-4 shadow-lg shadow-[#6366f1]/25">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Upgrade to Unlock {featureName}
                </h2>
                <p className="text-slate-400">
                  You've reached your {currentPlan} plan limit for {limitReached}.
                  <br />
                  Upgrade now to continue using MakeItAds.
                </p>
              </div>

              {/* Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <div
                      key={plan.name}
                      className={`relative rounded-2xl border ${
                        plan.popular
                          ? "border-[#8b5cf6] bg-[#8b5cf6]/5"
                          : "border-white/10 bg-white/[0.02]"
                      } p-6`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`h-10 w-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                          <p className="text-sm text-slate-400">${plan.price}/month</p>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/dashboard/billing?upgrade=${plan.name.toLowerCase()}`}
                        className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                          plan.popular
                            ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30"
                            : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        Upgrade to {plan.name}
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="text-center">
                <button
                  onClick={onClose}
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
  );
}