"use client";

import { motion } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";

export default function OverviewPage() {
  return (
    <PageTransition>
      <div className="space-y-5 sm:space-y-6">
        
        {/* ═══════════════════════════════════════════════════════════
            HEADER - COMPACT MOBILE, BIEN ALIGNÉ
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white no-hyphens break-words">
              Welcome back, Williams
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Here's your marketing command center.
            </p>
          </div>
          
          {/* Stats cards - horizontales sur mobile */}
          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            <div className="rounded-xl border border-white/10 bg-[#0f0f1a] p-3 sm:p-4 min-w-[120px] sm:min-w-[160px]">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Strategies</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white">0/1</p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" style={{ width: "0%" }} />
              </div>
            </div>
            
            <button className="rounded-xl border border-white/10 bg-[#0f0f1a] p-3 sm:p-4 flex items-center justify-center hover:bg-white/5 transition-colors active:scale-95">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            AI RECOMMENDATION CARD
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl sm:rounded-2xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 p-4 sm:p-6"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold text-[#6366f1] uppercase tracking-wider mb-1 sm:mb-2">
                AI Strategic Recommendation
              </p>
              <h3 className="text-sm sm:text-lg font-semibold text-white mb-2 sm:mb-3 break-words">
                Focus on Meta Ads for saas in United Arab Emirates with video-first creative
              </h3>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-lg bg-white/5 p-2 sm:p-3">
                  <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase label-nowrap">Confidence</p>
                  <p className="text-sm sm:text-lg font-bold text-white mt-0.5 sm:mt-1 no-hyphens">87%</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2 sm:p-3">
                  <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase label-nowrap">Expected</p>
                  <p className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5 sm:mt-1">+40% reach</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2 sm:p-3">
                  <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase label-nowrap">Priority</p>
                  <p className="text-sm sm:text-lg font-bold text-[#6366f1] mt-0.5 sm:mt-1 no-hyphens">High</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            MARKET ANALYSIS (Premium)
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-white">Market Analysis</h2>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-bold">PREMIUM</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Market Size</p>
              <p className="text-base sm:text-lg font-bold text-white no-hyphens">$4.2B</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Growth Rate</p>
              <p className="text-base sm:text-lg font-bold text-emerald-400 no-hyphens">12.5%</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:p-4 col-span-2 sm:col-span-1">
              <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Competition</p>
              <p className="text-base sm:text-lg font-bold text-amber-400 no-hyphens">Medium</p>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            COMPETITOR INTELLIGENCE (Pro)
            ══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-white">Competitor Intelligence</h2>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-bold">PRO</span>
              </div>
            </div>
          </div>

          <div className="text-center py-6 sm:py-8">
            <svg className="h-10 w-10 sm:h-12 sm:w-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">No competitors tracked yet</p>
            <button className="rounded-lg bg-[#6366f1] px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#5558e6] transition-colors active:scale-95">
              Add Competitor
            </button>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            CAMPAIGN PLANNER
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-sm sm:text-lg font-bold text-white">Campaign Planner</h2>
          </div>

          <div className="text-center py-6 sm:py-8">
            <svg className="h-10 w-10 sm:h-12 sm:w-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">No campaigns scheduled</p>
            <button className="rounded-lg bg-[#6366f1] px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#5558e6] transition-colors active:scale-95">
              Create Campaign
            </button>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            STRATEGY INSIGHTS
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f0f1a] p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-sm sm:text-lg font-bold text-white">Strategy Insights</h2>
          </div>

          <div className="text-center py-6 sm:py-8">
            <svg className="h-10 w-10 sm:h-12 sm:w-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">No insights generated yet</p>
            <button className="rounded-lg bg-[#6366f1] px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#5558e6] transition-colors active:scale-95">
              Generate Strategy
            </button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}