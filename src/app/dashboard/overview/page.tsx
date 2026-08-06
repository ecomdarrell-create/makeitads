"use client";

import { motion } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";
import { Sparkles, Eye, Calendar, BarChart3, Zap, Building2, Globe, TrendingUp, AlertCircle, Lightbulb, Plus, Download } from "lucide-react";

export default function OverviewPage() {
  return (
    <PageTransition>
      <div className="space-y-5 sm:space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] leading-tight no-hyphens break-words">
              Welcome back, Williams
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 sm:mt-2">
              Here's your marketing command center.
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 rounded-xl border border-[#E2E8F0] bg-white p-3 sm:p-4 min-w-0 shadow-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6366f1]" />
                </div>
                <span className="text-[10px] sm:text-xs text-[#64748B] font-medium truncate">Strategies</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-[#0F172A] no-hyphens">0/1</p>
              <div className="h-1 bg-[#E2E8F0] rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" style={{ width: "0%" }} />
              </div>
            </div>
            
            <button className="rounded-xl border border-[#E2E8F0] bg-white p-3 sm:p-4 flex items-center justify-center hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors active:scale-95 flex-shrink-0 shadow-sm">
              <Download className="h-4 w-4 sm:h-5 sm:w-5 text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* AI RECOMMENDATION CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl sm:rounded-2xl border border-[#6366f1]/20 bg-[#EEF2FF] p-4 sm:p-6"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold text-[#6366f1] uppercase tracking-wider mb-1 sm:mb-2">
                AI Strategic Recommendation
              </p>
              <h3 className="text-sm sm:text-lg font-semibold text-[#0F172A] mb-2 sm:mb-3 break-words leading-tight">
                Focus on Meta Ads for saas in United Arab Emirates with video-first creative
              </h3>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-lg bg-white p-2 sm:p-3 border border-[#E2E8F0]">
                  <p className="text-[9px] sm:text-[10px] text-[#64748B] uppercase label-nowrap">Confidence</p>
                  <p className="text-sm sm:text-lg font-bold text-[#0F172A] mt-0.5 sm:mt-1 no-hyphens">87%</p>
                </div>
                <div className="rounded-lg bg-white p-2 sm:p-3 border border-[#E2E8F0]">
                  <p className="text-[9px] sm:text-[10px] text-[#64748B] uppercase label-nowrap">Expected</p>
                  <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 sm:mt-1">+40% reach</p>
                </div>
                <div className="rounded-lg bg-white p-2 sm:p-3 border border-[#E2E8F0]">
                  <p className="text-[9px] sm:text-[10px] text-[#64748B] uppercase label-nowrap">Priority</p>
                  <p className="text-sm sm:text-lg font-bold text-[#6366f1] mt-0.5 sm:mt-1 no-hyphens">High</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MARKET ANALYSIS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-[#0F172A]">Market Analysis</h2>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#6366f1] font-bold border border-[#6366f1]/20">PREMIUM</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-[#64748B] mb-0.5 sm:mb-1">Market Size</p>
              <p className="text-base sm:text-lg font-bold text-[#0F172A] no-hyphens">$4.2B</p>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-[#64748B] mb-0.5 sm:mb-1">Growth Rate</p>
              <p className="text-base sm:text-lg font-bold text-emerald-600 no-hyphens">12.5%</p>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 col-span-2 sm:col-span-1">
              <p className="text-[10px] sm:text-xs text-[#64748B] mb-0.5 sm:mb-1">Competition</p>
              <p className="text-base sm:text-lg font-bold text-amber-600 no-hyphens">Medium</p>
            </div>
          </div>
        </motion.div>

        {/* COMPETITOR INTELLIGENCE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-[#0F172A]">Competitor Intelligence</h2>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#6366f1] font-bold border border-[#6366f1]/20">PRO</span>
              </div>
            </div>
          </div>

          <div className="text-center py-6 sm:py-8">
            <Eye className="h-10 w-10 sm:h-12 sm:w-12 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-[#64748B] mb-3 sm:mb-4">No competitors tracked yet</p>
            <button className="rounded-lg bg-[#6366f1] px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#5558e6] transition-colors active:scale-95 shadow-md shadow-[#6366f1]/20">
              Add Competitor
            </button>
          </div>
        </motion.div>

        {/* CAMPAIGN PLANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-sm sm:text-lg font-bold text-[#0F172A]">Campaign Planner</h2>
          </div>

          <div className="text-center py-6 sm:py-8">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-[#64748B] mb-3 sm:mb-4">No campaigns scheduled</p>
            <button className="rounded-lg bg-[#6366f1] px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#5558e6] transition-colors active:scale-95 shadow-md shadow-[#6366f1]/20">
              Create Campaign
            </button>
          </div>
        </motion.div>

        {/* STRATEGY INSIGHTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-sm sm:text-lg font-bold text-[#0F172A]">Strategy Insights</h2>
          </div>

          <div className="text-center py-6 sm:py-8">
            <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-[#64748B] mb-3 sm:mb-4">No insights generated yet</p>
            <button className="rounded-lg bg-[#6366f1] px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#5558e6] transition-colors active:scale-95 shadow-md shadow-[#6366f1]/20">
              Generate Strategy
            </button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}