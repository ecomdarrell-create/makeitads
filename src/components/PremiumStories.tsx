"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ArrowRight, X, TrendingUp, Clock, Award, ShieldCheck } from "lucide-react";
import { PREMIUM_SUCCESS_STORIES, PremiumStory } from "@/data/successStories";

type Variant = "top" | "bottom";

export default function PremiumStories({ variant = "bottom" }: { variant?: Variant }) {
  const [selectedStory, setSelectedStory] = useState<PremiumStory | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
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
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center mb-10 md:mb-14"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-[#00B67A] rounded-sm mr-0.5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
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
        </motion.div>

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
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
            
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
                    <Image
                      src={story.avatar}
                      alt={story.name}
                      width={64}
                      height={64}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                      loading="lazy"
                      quality={85}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                    <div className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full flex items-center justify-center ${story.category === "success" ? "bg-[#6366f1]" : story.category === "founder" ? "bg-[#38bdf8]" : "bg-amber-500"}`}>
                      <Award className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs font-semibold text-[#111827] truncate max-w-[70px] sm:max-w-[80px]">
                    {story.name.split(" ")[0]}
                  </p>
                  <p className="text-[9px] text-[#64748B] truncate max-w-[70px] sm:max-w-[80px]">
                    {story.company}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

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
              <div className="relative w-full md:max-w-[760px] md:max-h-[520px] bg-white md:rounded-[28px] rounded-t-[28px] shadow-2xl overflow-hidden flex flex-col">
                
                <button
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-[#E9E9F5] text-[#64748B] hover:text-[#111827] hover:bg-white transition-colors shadow-sm"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
                  
                  <div className="md:w-[280px] bg-gradient-to-b from-[#F8FAFC] to-white p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#E9E9F5] flex-shrink-0">
                    <div className="flex flex-col items-center text-center">
                      <Image
                        src={selectedStory.avatar}
                        alt={selectedStory.name}
                        width={100}
                        height={100}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-md mb-4"
                      />
                      
                      <h3 className="text-lg font-bold text-[#111827] mb-1">{selectedStory.name}</h3>
                      <p className="text-sm text-[#64748B] mb-1">{selectedStory.profession}</p>
                      <p className="text-xs text-[#64748B] mb-2">{selectedStory.company}</p>
                      <div className="flex items-center gap-2 text-xs text-[#64748B] mb-3">
                        <span>{selectedStory.countryFlag}</span>
                        <span>{selectedStory.country}</span>
                        <span>•</span>
                        <span>{selectedStory.age} years old</span>
                      </div>

                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(selectedStory.rating)].map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-[#00B67A] rounded-sm flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </div>
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 mb-6">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified Customer
                      </span>

                      <div className="w-full space-y-3">
                        <div className="bg-white rounded-xl border border-[#E9E9F5] p-3 shadow-sm">
                          <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Revenue</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#94A3B8] line-through">{selectedStory.revenueBefore}</span>
                            <ArrowRight className="h-3 w-3 text-[#6366f1]" />
                            <span className="text-sm font-bold text-[#111827]">{selectedStory.revenueAfter}</span>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl border border-[#E9E9F5] p-3 shadow-sm">
                          <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Time to Result</p>
                          <p className="text-sm font-bold text-[#111827]">{selectedStory.timeToResult}</p>
                        </div>

                        <div className="bg-white rounded-xl border border-[#E9E9F5] p-3 shadow-sm">
                          <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Strategies Generated</p>
                          <p className="text-sm font-bold text-[#111827]">{selectedStory.strategiesGenerated}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <blockquote className="text-base md:text-lg text-[#475569] leading-relaxed mb-8 font-medium italic border-l-4 border-[#6366f1]/30 pl-5">
                      "{selectedStory.quote}"
                    </blockquote>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-[#6366f1]" /> Measurable Results
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedStory.results.map((res, i) => (
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
                        {selectedStory.timeline.map((item, i) => (
                          <div key={i} className="relative flex items-start gap-3">
                            {i < selectedStory.timeline.length - 1 && (
                              <div className="absolute left-[7px] top-6 bottom-[-16px] w-0.5 bg-[#E2E8F0]" />
                            )}
                            <div className="relative z-10 h-4 w-4 rounded-full bg-[#6366f1] border-2 border-white shadow-sm mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-[#111827]">{item.event}</p>
                              <p className="text-xs text-[#64748B]">{item.timeframe}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStory.badges.map((badge, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E9E9F5] text-xs font-medium text-[#475569]">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#E9E9F5] mt-auto">
                      <a
                        href="/signup"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 hover:shadow-xl hover:scale-[1.02] transition-all"
                      >
                        Try MakeItAds Free
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => setSelectedStory(null)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#E9E9F5] bg-white px-6 py-3.5 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors"
                      >
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