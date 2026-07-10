"use client";

import { motion } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";

export default function OverviewPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="title-responsive font-bold text-white no-hyphens">
            Dashboard Overview
          </h1>
          <p className="subtitle-responsive text-slate-400 mt-2">
            Your marketing intelligence at a glance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-responsive rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm"
          >
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider label-nowrap">
                Total Strategies
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white no-hyphens">
                24
              </p>
              <p className="text-xs text-emerald-400">+12% from last month</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-responsive rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm"
          >
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider label-nowrap">
                Active Campaigns
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white no-hyphens">
                8
              </p>
              <p className="text-xs text-emerald-400">+3 this week</p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-responsive rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm"
          >
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider label-nowrap">
                Competitors Tracked
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white no-hyphens">
                15
              </p>
              <p className="text-xs text-slate-400">5 new alerts</p>
            </div>
          </motion.div>
        </div>

        {/* AI Recommendation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-responsive rounded-2xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider mb-2 label-nowrap">
                AI Recommendation
              </p>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 break-words-clean">
                Focus on Meta Ads for SaaS in UAE with video-first creative
              </h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[10px] text-slate-400 uppercase label-nowrap">Confidence</p>
                  <p className="text-lg font-bold text-white mt-1 no-hyphens">87%</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[10px] text-slate-400 uppercase label-nowrap">Expected</p>
                  <p className="text-sm font-bold text-emerald-400 mt-1">+40% reach</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3 col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-slate-400 uppercase label-nowrap">Priority</p>
                  <p className="text-lg font-bold text-[#6366f1] mt-1 no-hyphens">High</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}