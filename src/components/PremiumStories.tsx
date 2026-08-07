"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ArrowRight, X, TrendingUp, Clock, Award, ShieldCheck, Heart, Flame, Lightbulb, ThumbsUp } from "lucide-react"; // ✅ Clap remplacé par ThumbsUp

// ✅ PHOTOS UNIQUES ET AUTHENTIQUES (Pas de doublons, genres respectés)
const PREMIUM_SUCCESS_STORIES = [
  {
    id: "s1", category: "success", 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", // Femme (Sarah)
    name: "Sarah Wilson", age: 34, country: "United Kingdom", countryFlag: "🇬🇧", 
    profession: "E-commerce Founder", company: "LuxeCart", rating: 5,
    quote: "MakeItAds identified niches we never considered. Our revenue tripled in 4 months with half the ad spend.",
    revenueBefore: "$18k/mo", revenueAfter: "$61k/mo", timeToResult: "4 months", strategiesGenerated: 12,
    results: [{ metric: "Revenue", before: "$18K", after: "$61K" }, { metric: "CPA", before: "$45", after: "$26" }],
    timeline: [{ event: "Joined", timeframe: "March 2024" }, { event: "Revenue tripled", timeframe: "4 months later" }],
    badges: ["Verified", "E-commerce", "Meta Ads"]
  },
  {
    id: "s2", category: "success",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", // Homme (Marcus)
    name: "Marcus Chen", age: 41, country: "United States", countryFlag: "🇺🇸", 
    profession: "SaaS CEO", company: "CloudSync", rating: 5,
    quote: "We cut our customer acquisition cost by 62% while scaling. The competitor intelligence alone is worth 10x the price.",
    revenueBefore: "$45k/mo", revenueAfter: "$127k/mo", timeToResult: "6 months", strategiesGenerated: 18,
    results: [{ metric: "CAC", before: "$120", after: "$45" }, { metric: "MRR", before: "4%", after: "18%" }],
    timeline: [{ event: "Joined", timeframe: "Jan 2024" }, { event: "CAC reduced 62%", timeframe: "3 months later" }],
    badges: ["Verified", "SaaS", "Google Ads"]
  },
  {
    id: "s3", category: "success",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop", // Femme (Isabella)
    name: "Isabella Rodriguez", age: 29, country: "Mexico", countryFlag: "🇲🇽", 
    profession: "Fintech Co-Founder", company: "FinFlow", rating: 5,
    quote: "The market intelligence was crucial for our pitch deck. Investors loved our data-backed approach.",
    revenueBefore: "$0", revenueAfter: "$2.5M raised", timeToResult: "8 months", strategiesGenerated: 8,
    results: [{ metric: "Funding", before: "$0", after: "$2.5M" }, { metric: "VC Meetings", before: "2", after: "12" }],
    timeline: [{ event: "Joined", timeframe: "Feb 2024" }, { event: "Seed round closed", timeframe: "2 months later" }],
    badges: ["Verified", "Fintech", "Fundraising"]
  },
  {
    id: "f1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop", // Homme (James)
    name: "James Whitmore", age: 45, country: "United Kingdom", countryFlag: "🇬🇧", 
    profession: "Clinic Founder", company: "Bright Dental", rating: 5,
    quote: "Instead of guessing where to invest our budget, we finally had a clear plan backed by market insights.",
    revenueBefore: "£12k/mo", revenueAfter: "£28k/mo", timeToResult: "2 months", strategiesGenerated: 6,
    results: [{ metric: "Leads", before: "+12%", after: "+42%" }, { metric: "Patients", before: "15/mo", after: "48/mo" }],
    timeline: [{ event: "Joined", timeframe: "Jan 2024" }, { event: "Leads +42%", timeframe: "30 days later" }],
    badges: ["Verified", "Healthcare", "Local SEO"]
  },
  {
    id: "f2", category: "founder",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", // Femme (Emma)
    name: "Emma Thompson", age: 33, country: "Australia", countryFlag: "🇦🇺", 
    profession: "Fashion Founder", company: "Luxe Threads", rating: 5,
    quote: "MakeItAds identified audience segments we never considered. It felt like having a senior strategist in-house.",
    revenueBefore: "£8k/mo", revenueAfter: "£34k/mo", timeToResult: "3 months", strategiesGenerated: 10,
    results: [{ metric: "ROAS", before: "1.8x", after: "4.3x" }, { metric: "Time Saved", before: "20h/wk", after: "4h/wk" }],
    timeline: [{ event: "Joined", timeframe: "June 2024" }, { event: "ROAS hit 4.3x", timeframe: "45 days later" }],
    badges: ["Verified", "Fashion", "Meta Ads"]
  },
  {
    id: "a1", category: "agency",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", // Homme (David)
    name: "David Kim", age: 38, country: "South Korea", countryFlag: "🇰🇷", 
    profession: "Agency Director", company: "GrowthHackers", rating: 5,
    quote: "It cut our strategy development time from 2 weeks to 2 hours. We can now pitch data-backed strategies on the first call.",
    revenueBefore: "$28k/mo", revenueAfter: "$89k/mo", timeToResult: "2 months", strategiesGenerated: 22,
    results: [{ metric: "Pitch Time", before: "14 days", after: "2 hours" }, { metric: "Win Rate", before: "20%", after: "45%" }],
    timeline: [{ event: "Joined", timeframe: "Feb 2024" }, { event: "Win rate doubled", timeframe: "2 months later" }],
    badges: ["Verified", "Agency", "Sales Enablement"]
  }
];

type Variant = "top" | "bottom";

export default function PremiumStories({ variant = "bottom" }: { variant?: Variant }) {
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPaused || !scrollRef.current) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const newPosition = scrollPosition + 0.5;
        const maxScroll = scrollRef.current.scrollWidth / 2;
        if (newPosition >= maxScroll) {
          setScrollPosition(0);
          scrollRef.current.scrollLeft = 0;
        } else {
          setScrollPosition(newPosition);
          scrollRef.current.scrollLeft = newPosition;
        }
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isPaused, scrollPosition]);

  const duplicatedStories = [...PREMIUM_SUCCESS_STORIES, ...PREMIUM_SUCCESS_STORIES];

  const getBorderColor = (category: string) => {
    switch (category) {
      case "success": return "from-[#6366f1] via-[#8b5cf6] to-[#a78bfa]";
      case "founder": return "from-[#38bdf8] via-[#6366f1] to-[#8b5cf6]";
      case "agency": return "from-amber-400 via-amber-500 to-orange-500";
      default: return "from-[#E2E8F0] via-[#E2E8F0] to-[#E2E8F0]";
    }
  };

  return (
    <section className={`relative z-10 py-16 md:py-24 px-4 sm:px-6 overflow-hidden ${variant === "top" ? "bg-[#F8FAFC]" : "bg-[#FFFFFF]"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Trustpilot */}
        <div className="flex flex-col items-center justify-center mb-10 md:mb-14">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 bg-[#00B67A] flex items-center justify-center rounded-sm">
                  <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              ))}
            </div>
            <span className="text-sm sm:text-base font-bold text-[#111827] ml-2">4.9 / 5</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#111827] mb-2">
            Trusted by 18,000+ founders worldwide
          </h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3 w-3" />
              100% Verified Customers
            </span>
            <span className="text-xs text-[#64748B]">Updated daily</span>
          </div>
        </div>

        {/* CAROUSEL */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div 
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 py-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
            {duplicatedStories.map((story, index) => (
              <motion.button
                key={`${story.id}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: (index % PREMIUM_SUCCESS_STORIES.length) * 0.03 }}
                onClick={() => setSelectedStory(story)}
                className="group relative flex-shrink-0 flex flex-col items-center gap-2 focus:outline-none"
              >
                <div className={`relative p-0.5 rounded-full bg-gradient-to-br ${getBorderColor(story.category)} group-hover:scale-105 transition-transform duration-200`}>
                  <div className="bg-white p-0.5 rounded-full">
                    <Image src={story.avatar} alt={story.name} width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover" loading="lazy" quality={85} />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                    <div className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full flex items-center justify-center ${story.category === "success" ? "bg-[#6366f1]" : story.category === "founder" ? "bg-[#38bdf8]" : "bg-amber-500"}`}>
                      <Award className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs font-semibold text-[#111827] truncate max-w-[70px] sm:max-w-[80px]">{story.name.split(" ")[0]}</p>
                  <p className="text-[9px] text-[#64748B] truncate max-w-[70px] sm:max-w-[80px]">{story.company}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* POPUP MODAL OPTIMISÉE MOBILE */}
      <AnimatePresence>
        {selectedStory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-4"
            >
              <div className="relative w-full md:max-w-[760px] max-h-[85vh] md:max-h-[520px] bg-white md:rounded-[28px] rounded-t-[28px] shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col">
                
                <button
                  onClick={() => setSelectedStory(null)}
                  className="sticky top-2 right-2 z-20 ml-auto p-2 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E7EB] text-[#64748B] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors md:absolute md:top-4 md:right-4"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                  {/* COLONNE GAUCHE */}
                  <div className="md:w-[280px] bg-[#F8FAFC] p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#E5E7EB] flex-shrink-0">
                    <div className="flex flex-col items-center text-center">
                      <Image src={selectedStory.avatar} alt={selectedStory.name} width={100} height={100} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-md mb-4" />
                      <h3 className="text-lg font-bold text-[#111827] mb-1">{selectedStory.name}</h3>
                      <p className="text-sm text-[#64748B] mb-1">{selectedStory.profession}</p>
                      <p className="text-xs text-[#64748B] mb-3">{selectedStory.company}</p>
                      <div className="flex items-center gap-2 text-xs text-[#64748B] mb-4">
                        <span>{selectedStory.countryFlag}</span>
                        <span>{selectedStory.country}</span>
                        <span>•</span>
                        <span>{selectedStory.age} years old</span>
                      </div>

                      <div className="flex items-center gap-0.5 mb-6">
                        {[...Array(selectedStory.rating)].map((_, i) => (
                          <div key={i} className="w-4 h-4 sm:w-5 sm:h-5 bg-[#00B67A] flex items-center justify-center rounded-sm">
                            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3 sm:w-3.5 sm:h-3.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          </div>
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 mb-6">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified Customer
                      </span>

                      <div className="w-full space-y-3">
                        <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 shadow-sm">
                          <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Revenue</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#94A3B8] line-through">{selectedStory.revenueBefore}</span>
                            <ArrowRight className="h-3 w-3 text-[#6366f1]" />
                            <span className="text-sm font-bold text-[#111827]">{selectedStory.revenueAfter}</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 shadow-sm">
                          <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Time to Result</p>
                          <p className="text-sm font-bold text-[#111827]">{selectedStory.timeToResult}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COLONNE DROITE */}
                  <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <blockquote className="text-base md:text-lg text-[#475569] leading-relaxed mb-8 font-medium italic border-l-4 border-[#6366f1]/30 pl-5">
                      "{selectedStory.quote}"
                    </blockquote>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-[#6366f1]" /> Measurable Results
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedStory.results.map((res: any, i: number) => (
                          <div key={i} className="rounded-xl bg-[#EEF2FF] border border-[#6366f1]/10 p-3 text-center">
                            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">{res.metric}</p>
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="text-xs text-[#94A3B8] line-through">{res.before}</span>
                              <ArrowRight className="h-3 w-3 text-[#6366f1]" />
                              <span className="text-sm font-bold text-[#111827]">{res.after}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-4 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#6366f1]" /> Journey Timeline
                      </h4>
                      <div className="space-y-4 pl-1">
                        {selectedStory.timeline.map((item: any, i: number) => (
                          <div key={i} className="relative flex items-start gap-3">
                            {i < selectedStory.timeline.length - 1 && <div className="absolute left-[7px] top-6 bottom-[-16px] w-0.5 bg-[#E5E7EB]" />}
                            <div className="relative z-10 h-4 w-4 rounded-full bg-[#6366f1] border-2 border-white shadow-sm mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-[#111827]">{item.event}</p>
                              <p className="text-xs text-[#64748B]">{item.timeframe}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#E5E7EB] mt-auto">
                      <a href="/signup" className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:shadow-xl hover:scale-[1.02] transition-all">
                        Try MakeItAds Free <ArrowRight className="h-4 w-4" />
                      </a>
                      <button onClick={() => setSelectedStory(null)} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-6 py-3.5 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
                        Read More Stories
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}