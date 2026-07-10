"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Sparkles,
  Shield,
  Zap,
  Target,
  BookOpen,
  MessageSquare,
  Briefcase,
  Store,
  PenTool,
  Building2,
  Globe,
  MapPin,
  Calendar,
  FileText,
  BarChart3,
  Lightbulb,
  Award,
  Check,
} from "lucide-react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

const TELEGRAM_URL = "https://t.me/makeitads";

const benefits = [
  { icon: TrendingUp, title: "Weekly Marketing Intelligence", description: "Curated insights delivered every Monday morning." },
  { icon: Target, title: "Competitor Insights", description: "Real-time analysis of market movements and strategies." },
  { icon: Sparkles, title: "AI Marketing News", description: "First to know about AI breakthroughs that matter." },
  { icon: MessageSquare, title: "Private Discussions", description: "Exclusive conversations with verified peers." },
  { icon: BookOpen, title: "Exclusive Playbooks", description: "Proven strategies you won't find anywhere else." },
  { icon: Zap, title: "Early Product Access", description: "Test new features before public release." },
  { icon: BarChart3, title: "Growth Strategies", description: "Data-backed approaches from successful founders." },
  { icon: Award, title: "Founder Updates", description: "Direct insights from the MakeItAds team." },
  { icon: FileText, title: "Industry Reports", description: "Deep-dive analysis of key market sectors." },
];

const weeklySchedule = [
  { day: "Monday", topic: "Market Intelligence", icon: Globe, color: "from-[#6366f1] to-[#8b5cf6]" },
  { day: "Tuesday", topic: "Growth Tips", icon: TrendingUp, color: "from-[#8b5cf6] to-[#a78bfa]" },
  { day: "Wednesday", topic: "AI Updates", icon: Sparkles, color: "from-[#38bdf8] to-[#6366f1]" },
  { day: "Thursday", topic: "Competitor Analysis", icon: Target, color: "from-[#10b981] to-[#34d399]" },
  { day: "Friday", topic: "Weekly Brief", icon: FileText, color: "from-[#f59e0b] to-[#fbbf24]" },
  { day: "Saturday", topic: "Community Discussion", icon: MessageSquare, color: "from-[#ec4899] to-[#f472b6]" },
  { day: "Sunday", topic: "Founder Insights", icon: Lightbulb, color: "from-[#6366f1] to-[#38bdf8]" },
];

const audiences = [
  { icon: Briefcase, title: "Founders", description: "Startup and scale-up leaders" },
  { icon: Building2, title: "Agencies", description: "Marketing and advertising agencies" },
  { icon: Users, title: "Marketing Teams", description: "In-house marketing departments" },
  { icon: PenTool, title: "Freelancers", description: "Independent marketing consultants" },
  { icon: Store, title: "E-commerce", description: "Online store owners and operators" },
  { icon: MapPin, title: "Local Businesses", description: "Brick-and-mortar business owners" },
];

const exclusiveContent = [
  { icon: BookOpen, title: "Playbooks", description: "Step-by-step guides for growth" },
  { icon: FileText, title: "Templates", description: "Ready-to-use marketing assets" },
  { icon: BarChart3, title: "Reports", description: "In-depth market analysis" },
  { icon: Sparkles, title: "AI Prompts", description: "Optimized prompts for marketing" },
  { icon: Award, title: "Case Studies", description: "Real success stories and breakdowns" },
  { icon: Lightbulb, title: "Growth Experiments", description: "Tested strategies with results" },
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white overflow-hidden selection:bg-[#6366f1]/20 selection:text-white">
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#6366f1]/15 rounded-full blur-[120px] opacity-80" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#8b5cf6]/10 rounded-full blur-[100px] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]" style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.85) 70%, transparent 100%)" }} />
      </div>

      <GlobalNavbar />

      {/* HERO */}
      <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
                <Users className="h-3.5 w-3.5 text-[#6366f1]" />
                <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">
                  Private Community
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                  The Boardroom
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-xl">
                An exclusive circle of founders, marketers and decision-makers. Get the intelligence, strategies and connections that drive real business growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105"
                >
                  Join our Telegram Community
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#why-join"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Learn More
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                <Image
                  src="/images/community-hero.webp"
                  alt="The Boardroom - Exclusive Marketing Community"
                  width={800}
                  height={450}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#080810]/80 backdrop-blur-md border border-white/10 px-4 py-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">Verified Members Only</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section id="why-join" className="relative z-10 py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
              Why join{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                The Boardroom
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              Everything you need to stay ahead of the competition, in one exclusive community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative rounded-2xl border border-white/10 bg-[#0f0f1a]/80 backdrop-blur-sm p-6 hover:border-[#6366f1]/30 transition-all duration-500"
                >
                  <div className="relative">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 border border-[#6366f1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="h-5 w-5 text-[#8b5cf6]" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WEEKLY SCHEDULE */}
      <section className="relative z-10 py-20 md:py-32 px-4 sm:px-6 bg-[#0a0a14]/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
              <Calendar className="h-3.5 w-3.5 text-[#6366f1]" />
              <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">
                Weekly Schedule
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
              What you'll get{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                every week
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              A carefully curated flow of intelligence, insights and opportunities.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#6366f1]/30 via-[#8b5cf6]/30 to-[#6366f1]/30 md:-translate-x-1/2" />

            <div className="space-y-6">
              {weeklySchedule.map((item, index) => {
                const Icon = item.icon;
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={item.day}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className={`relative flex items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#6366f1] border-4 border-[#080810] md:-translate-x-1/2 z-10" />

                    {/* Card */}
                    <div className={`ml-16 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-12" : "md:pl-12"}`}>
                      <div className="relative rounded-2xl border border-white/10 bg-[#0f0f1a]/80 backdrop-blur-sm p-5 hover:border-[#6366f1]/30 transition-all duration-500">
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#6366f1] uppercase tracking-wider mb-1">{item.day}</p>
                            <p className="text-base font-bold text-white">{item.topic}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="relative z-10 py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
              Who is this{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                for?
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              The Boardroom is built for professionals who take marketing seriously.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {audiences.map((audience, index) => {
              const Icon = audience.icon;
              return (
                <motion.div
                  key={audience.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative rounded-2xl border border-white/10 bg-[#0f0f1a]/80 backdrop-blur-sm p-6 hover:border-[#6366f1]/30 transition-all duration-500"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 border border-[#6366f1]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Icon className="h-6 w-6 text-[#8b5cf6]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{audience.title}</h3>
                      <p className="text-sm text-slate-400">{audience.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXCLUSIVE CONTENT */}
      <section className="relative z-10 py-20 md:py-32 px-4 sm:px-6 bg-[#0a0a14]/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
              <Award className="h-3.5 w-3.5 text-[#6366f1]" />
              <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">
                Members Only
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
              Exclusive{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                content
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Premium resources available only to Boardroom members.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {exclusiveContent.map((content, index) => {
              const Icon = content.icon;
              return (
                <motion.div
                  key={content.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a]/80 to-[#0a0a14]/80 backdrop-blur-sm p-6 hover:border-[#6366f1]/30 transition-all duration-500"
                >
                  <div className="relative">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 border border-[#6366f1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="h-6 w-6 text-[#8b5cf6]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{content.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{content.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#6366f1]">
                      <Check className="h-3 w-3" />
                      <span>Members only</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="relative z-10 py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#6366f1]/10 via-[#0f0f1a]/80 to-[#8b5cf6]/10 backdrop-blur-xl p-10 md:p-16 text-center"
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#6366f1]/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#8b5cf6]/20 rounded-full blur-[100px]" />

            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="flex -space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] border-4 border-[#080810]" />
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#38bdf8] border-4 border-[#080810]" />
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#10b981] border-4 border-[#080810]" />
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#10b981] to-[#f59e0b] border-4 border-[#080810]" />
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
                A community that's{" "}
                <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                  growing every week
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                <div>
                  <p className="text-sm text-slate-400">Professionals from</p>
                  <p className="text-base font-bold text-white mt-1">Multiple industries</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Daily marketing</p>
                  <p className="text-base font-bold text-white mt-1">Discussions</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">New exclusive insights</p>
                  <p className="text-base font-bold text-white mt-1">Every week</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA - BOUTON TELEGRAM */}
      <section className="relative z-10 py-24 md:py-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#080810]/90 via-[#080810]/70 to-[#000000]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              Ready to join{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                The Boardroom?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Get exclusive marketing intelligence before everyone else.
            </p>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold text-white shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)] hover:bg-[#5558e6] transition-all hover:scale-105"
            >
              Join our Telegram Community
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-xs text-slate-500 mt-6">Free to join. No credit card required.</p>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}