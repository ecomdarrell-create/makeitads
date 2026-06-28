"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  { name: "AI Strategy Generation", free: true, pro: true, premium: true },
  { name: "Competitor Analysis", free: "1", pro: "10", premium: "Unlimited" },
  { name: "Campaign Planner", free: false, pro: true, premium: true },
  { name: "Budget Optimization", free: false, pro: true, premium: true },
  { name: "Creative Studio", free: false, pro: false, premium: true },
  { name: "Priority Support", free: false, pro: false, premium: true },
  { name: "API Access", free: false, pro: false, premium: true },
  { name: "White-label Reports", free: false, pro: false, premium: true },
];

export function ComparisonSection() {
  return (
    <section className="py-20 px-6 bg-[#0a0a14]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Compare Plans
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your business needs and scale as you grow
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-5 px-6 text-slate-400 font-medium text-sm">Feature</th>
                <th className="text-center py-5 px-6 text-slate-400 font-medium text-sm">Free</th>
                <th className="text-center py-5 px-6 bg-[#6366f1]/10 text-[#8b5cf6] font-bold text-sm">Pro</th>
                <th className="text-center py-5 px-6 text-slate-400 font-medium text-sm">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr
                  key={feature.name}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-6 text-white text-sm">{feature.name}</td>
                  <td className="py-4 px-6 text-center">
                    {typeof feature.free === "boolean" ? (
                      feature.free ? (
                        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-slate-300 text-sm">{feature.free}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center bg-[#6366f1]/5">
                    {typeof feature.pro === "boolean" ? (
                      feature.pro ? (
                        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-white font-bold text-sm">{feature.pro}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {typeof feature.premium === "boolean" ? (
                      feature.premium ? (
                        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-slate-300 text-sm">{feature.premium}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-400">
            All plans include SSL security, 99.9% uptime, and basic support.
          </p>
        </motion.div>
      </div>
    </section>
  );
}