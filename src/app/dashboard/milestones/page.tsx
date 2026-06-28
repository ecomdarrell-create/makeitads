"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Eye,
  Users,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowLeft,
  Target,
  Brain,
  Award,
  Flame,
  Crown,
  Rocket,
  TrendingUp,
  Calendar,
  Building2,
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export default function MilestonesPage() {
  const router = useRouter();
  const { user } = useSession();
  const [strategies, setStrategies] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const { data: stratData } = await supabase
          .from("strategies")
          .select("*")
          .eq("user_id", user.id);

        const { data: compData } = await supabase
          .from("competitors")
          .select("*")
          .eq("user_id", user.id);

        const { data: profileData } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        setStrategies(stratData || []);
        setCompetitors(compData || []);
        setBusinessProfile(profileData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const totalStrategies = strategies.length;
  const totalCompetitors = competitors.length;
  const avgMarketScore =
    strategies.length > 0
      ? Math.round(
          strategies.reduce((sum, s) => sum + (s.data?.overview?.marketScore || 0), 0) /
            strategies.length
        )
      : 0;

  const totalCampaigns = strategies.reduce(
    (sum, s) => sum + (s.data?.campaigns?.length || 0),
    0
  );

  const profileCompletion = useMemo(() => {
    if (!businessProfile) return 0;
    const fields = [
      businessProfile.business_name,
      businessProfile.industry,
      businessProfile.city,
      businessProfile.country,
      businessProfile.business_model,
      businessProfile.maturity,
      businessProfile.target_audience,
      businessProfile.brand_positioning,
      businessProfile.tone,
    ];
    const filled = fields.filter((f) => f && f.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [businessProfile]);

  // Tous les milestones
  const milestones = useMemo(() => {
    return [
      // Getting Started
      {
        id: "first-strategy",
        category: "Getting Started",
        title: "First Strategy",
        description: "Generated your first AI strategy",
        unlocked: totalStrategies >= 1,
        icon: Sparkles,
        color: "from-[#6366f1] to-[#8b5cf6]",
        progress: Math.min(1, totalStrategies),
        target: 1,
      },
      {
        id: "complete-profile",
        category: "Getting Started",
        title: "Profile Complete",
        description: "Completed your business profile",
        unlocked: profileCompletion >= 100,
        icon: CheckCircle2,
        color: "from-emerald-500 to-teal-500",
        progress: profileCompletion,
        target: 100,
      },
      {
        id: "first-competitor",
        category: "Getting Started",
        title: "Market Watcher",
        description: "Tracked your first competitor",
        unlocked: totalCompetitors >= 1,
        icon: Eye,
        color: "from-blue-500 to-cyan-500",
        progress: Math.min(1, totalCompetitors),
        target: 1,
      },

      // Strategy Master
      {
        id: "five-strategies",
        category: "Strategy Master",
        title: "Strategy Builder",
        description: "Generated 5 strategies",
        unlocked: totalStrategies >= 5,
        icon: Star,
        color: "from-amber-500 to-orange-500",
        progress: Math.min(5, totalStrategies),
        target: 5,
      },
      {
        id: "ten-strategies",
        category: "Strategy Master",
        title: "Strategy Expert",
        description: "Generated 10 strategies",
        unlocked: totalStrategies >= 10,
        icon: Award,
        color: "from-amber-500 to-yellow-500",
        progress: Math.min(10, totalStrategies),
        target: 10,
      },
      {
        id: "high-score",
        category: "Strategy Master",
        title: "Market Leader",
        description: "Achieved 80+ average market score",
        unlocked: avgMarketScore >= 80,
        icon: Trophy,
        color: "from-amber-500 to-yellow-500",
        progress: Math.min(80, avgMarketScore),
        target: 80,
      },

      // Competitive Intelligence
      {
        id: "five-competitors",
        category: "Competitive Intelligence",
        title: "Competitive Analyst",
        description: "Tracked 5 competitors",
        unlocked: totalCompetitors >= 5,
        icon: Users,
        color: "from-emerald-500 to-green-500",
        progress: Math.min(5, totalCompetitors),
        target: 5,
      },
      {
        id: "ten-competitors",
        category: "Competitive Intelligence",
        title: "Market Intelligence",
        description: "Tracked 10+ competitors",
        unlocked: totalCompetitors >= 10,
        icon: Eye,
        color: "from-emerald-500 to-teal-500",
        progress: Math.min(10, totalCompetitors),
        target: 10,
      },

      // Campaign Master
      {
        id: "first-campaign",
        category: "Campaign Master",
        title: "First Campaign",
        description: "Planned your first campaign",
        unlocked: totalCampaigns >= 1,
        icon: Calendar,
        color: "from-pink-500 to-rose-500",
        progress: Math.min(1, totalCampaigns),
        target: 1,
      },
      {
        id: "ten-campaigns",
        category: "Campaign Master",
        title: "Campaign Manager",
        description: "Planned 10 campaigns",
        unlocked: totalCampaigns >= 10,
        icon: Rocket,
        color: "from-pink-500 to-rose-500",
        progress: Math.min(10, totalCampaigns),
        target: 10,
      },

      // Elite
      {
        id: "ai-power-user",
        category: "Elite",
        title: "AI Power User",
        description: "Generated 25+ strategies",
        unlocked: totalStrategies >= 25,
        icon: Brain,
        color: "from-[#6366f1] to-[#8b5cf6]",
        progress: Math.min(25, totalStrategies),
        target: 25,
      },
      {
        id: "market-dominator",
        category: "Elite",
        title: "Market Dominator",
        description: "Tracked 25+ competitors",
        unlocked: totalCompetitors >= 25,
        icon: Crown,
        color: "from-amber-500 to-orange-500",
        progress: Math.min(25, totalCompetitors),
        target: 25,
      },
    ];
  }, [totalStrategies, totalCompetitors, avgMarketScore, profileCompletion, totalCampaigns]);

  const unlockedMilestones = milestones.filter((m) => m.unlocked).length;
  const totalMilestones = milestones.length;

  // Grouper par catégorie
  const groupedMilestones = useMemo(() => {
    const groups: Record<string, typeof milestones> = {};
    milestones.forEach((m) => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    return groups;
  }, [milestones]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1] mx-auto mb-4" />
          <p className="text-slate-400">Loading milestones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Milestones</h1>
        </div>
        <p className="text-slate-400">
          Track your progress and unlock achievements as you grow with MakeItAds
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="h-5 w-5 text-amber-400" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Unlocked
            </p>
          </div>
          <p className="text-4xl font-bold text-white">
            {unlockedMilestones}
            <span className="text-xl text-slate-400">/{totalMilestones}</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">Milestones achieved</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Flame className="h-5 w-5 text-orange-400" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Completion
            </p>
          </div>
          <p className="text-4xl font-bold text-white">
            {Math.round((unlockedMilestones / totalMilestones) * 100)}%
          </p>
          <p className="text-xs text-slate-400 mt-1">Overall progress</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Star className="h-5 w-5 text-yellow-400" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Next Milestone
            </p>
          </div>
          <p className="text-lg font-bold text-white">
            {milestones.find((m) => !m.unlocked)?.title || "All unlocked!"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {milestones.find((m) => !m.unlocked)?.description}
          </p>
        </motion.div>
      </div>

      {/* Progress Bar Global */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-white">Overall Progress</p>
          <p className="text-sm font-bold text-[#8b5cf6]">
            {unlockedMilestones}/{totalMilestones}
          </p>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedMilestones / totalMilestones) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-amber-500"
          />
        </div>
      </motion.div>

      {/* Milestones par catégorie */}
      {Object.entries(groupedMilestones).map(([category, categoryMilestones], categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + categoryIndex * 0.1 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            {category === "Getting Started" && <Rocket className="h-5 w-5 text-[#8b5cf6]" />}
            {category === "Strategy Master" && <Target className="h-5 w-5 text-amber-400" />}
            {category === "Competitive Intelligence" && <Eye className="h-5 w-5 text-emerald-400" />}
            {category === "Campaign Master" && <Calendar className="h-5 w-5 text-pink-400" />}
            {category === "Elite" && <Crown className="h-5 w-5 text-amber-400" />}
            {category}
            <span className="text-xs text-slate-500 font-normal">
              ({categoryMilestones.filter((m) => m.unlocked).length}/{categoryMilestones.length})
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryMilestones.map((milestone, i) => {
              const Icon = milestone.icon;
              const progressPercent = (milestone.progress / milestone.target) * 100;

              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl border p-6 relative overflow-hidden ${
                    milestone.unlocked
                      ? "border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e]"
                      : "border-white/5 bg-white/[0.01] opacity-70"
                  }`}
                >
                  {milestone.unlocked && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                          milestone.unlocked
                            ? `bg-gradient-to-br ${milestone.color} shadow-lg`
                            : "bg-white/5 border border-white/10"
                        }`}
                      >
                        {milestone.unlocked ? (
                          <Icon className="h-7 w-7 text-white" />
                        ) : (
                          <Lock className="h-6 w-6 text-slate-600" />
                        )}
                      </div>
                      {milestone.unlocked && (
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span className="text-[10px] font-bold text-emerald-400">
                            UNLOCKED
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className={`text-base font-bold mb-1 ${
                      milestone.unlocked ? "text-white" : "text-slate-400"
                    }`}>
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      {milestone.description}
                    </p>

                    {/* Progress */}
                    {!milestone.unlocked && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500">Progress</span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {milestone.progress}/{milestone.target}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8 }}
                            className={`h-full bg-gradient-to-r ${milestone.color}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}