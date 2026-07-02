"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
  TrendingUp, Globe, Zap, Clock, Target, BarChart3, 
  Activity, PieChart as PieChartIcon, Brain, Sparkles,
  ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area
} from "recharts";

// DONNÉES
const PIE_DATA = [
  { name: "Healthcare", value: 22, color: "#6366f1" },
  { name: "Retail", value: 18, color: "#8b5cf6" },
  { name: "SaaS", value: 16, color: "#38bdf8" },
  { name: "Restaurants", value: 12, color: "#10b981" },
  { name: "Real Estate", value: 10, color: "#f59e0b" },
  { name: "Education", value: 8, color: "#ec4899" },
  { name: "Beauty", value: 7, color: "#f43f5e" },
  { name: "Finance", value: 7, color: "#06b6d4" },
];

const SPARKLINE_DATA = Array.from({ length: 20 }, (_, i) => ({
  value: 40 + Math.sin(i * 0.5) * 15 + Math.random() * 10,
}));

const STRATEGIES_CHART = Array.from({ length: 30 }, (_, i) => ({
  value: 2000000 + i * 30000 + Math.random() * 100000,
}));

// COMPOSANT COUNTUP
function CountUp({ target, suffix = "", prefix = "", duration = 2 }: { 
  target: number; suffix?: string; prefix?: string; duration?: number 
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// COMPOSANT SPARKLINE
function Sparkline({ data, color = "#6366f1" }: { data: { value: number }[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} animationDuration={1500} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// COMPOSANT GAUGE
function CircularGauge({ value, label, size = 120 }: { value: number; label: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const increment = value / 60;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setAnimatedValue(value);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(start));
      }
    }, 1000 / 60);
    
    return () => clearInterval(timer);
  }, [isInView, value]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={45} stroke="rgba(148,163,184,0.25)" strokeWidth={8} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={45} stroke="url(#gaugeGradient)" strokeWidth={8} fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.1s ease" }} />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-950">{animatedValue}%</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2">{label}</p>
    </div>
  );
}

// COMPOSANT WORLD MAP
function WorldMap({ activeCountries }: { activeCountries: number[] }) {
  const countries = [
    { x: 15, y: 35, id: 1 }, { x: 25, y: 30, id: 2 }, { x: 35, y: 35, id: 3 },
    { x: 45, y: 40, id: 4 }, { x: 55, y: 35, id: 5 }, { x: 65, y: 30, id: 6 },
    { x: 75, y: 35, id: 7 }, { x: 85, y: 40, id: 8 }, { x: 20, y: 50, id: 9 },
    { x: 50, y: 55, id: 10 }, { x: 70, y: 50, id: 11 }, { x: 80, y: 55, id: 12 },
  ];

  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {countries.map((country) => (
        <motion.circle key={country.id} cx={country.x} cy={country.y} r={1.5} fill={activeCountries.includes(country.id) ? "#6366f1" : "rgba(255,255,255,0.2)"} initial={{ opacity: 0 }} animate={{ opacity: activeCountries.includes(country.id) ? 1 : 0.3 }} transition={{ duration: 1, delay: country.id * 0.1 }} />
      ))}
    </svg>
  );
}

// COMPOSANT PRINCIPAL
export default function StatisticsSection() {
  const [liveData, setLiveData] = useState({
    competitorSignals: 487000,
    strategiesGenerated: 2800000,
    timeSaved: 38,
    planningSpeed: 10,
    marketCoverage: 94,
    aiConfidence: 92,
    growthOpportunity: 87,
  });

  const [marketPulse, setMarketPulse] = useState({
    linkedin: "+17%",
    googleCpc: "-8%",
    metaCpm: "Stable",
    searchDemand: "Rising",
    consumerConfidence: "High",
    topIndustry: "Healthcare",
    fastestPlatform: "LinkedIn",
    trendingAngle: "Community First",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        competitorSignals: prev.competitorSignals + Math.floor(Math.random() * 100),
        strategiesGenerated: prev.strategiesGenerated + Math.floor(Math.random() * 50),
        aiConfidence: Math.min(99, Math.max(85, prev.aiConfidence + (Math.random() - 0.5) * 2)),
        growthOpportunity: Math.min(99, Math.max(80, prev.growthOpportunity + (Math.random() - 0.5) * 2)),
      }));

      setMarketPulse(prev => ({
        ...prev,
        linkedin: `+${15 + Math.floor(Math.random() * 5)}%`,
        googleCpc: `-${5 + Math.floor(Math.random() * 5)}%`,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="relative z-10 py-16 md:py-24 px-6 bg-slate-50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e12_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e12_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6366f1]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-950">
            Trusted by Data.{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">Built for Growth.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
            Every recommendation is powered by structured market intelligence, competitor analysis and continuously evolving business insights.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-4 gap-4">
          {/* Widget 1 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="col-span-2 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#6366f1]" />
                <h3 className="text-sm font-semibold text-slate-900">Competitor Signals</h3>
              </div>
              <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-700 text-xs font-bold">Live</span>
            </div>
            <p className="text-4xl font-bold text-slate-950 mb-2">
              <CountUp target={liveData.competitorSignals} suffix="+" />
            </p>
            <Sparkline data={SPARKLINE_DATA} color="#6366f1" />
          </motion.div>

          {/* Widget 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="col-span-1 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <PieChartIcon className="h-5 w-5 text-[#8b5cf6] mb-4" />
            <p className="text-3xl font-bold text-slate-950 mb-1"><CountUp target={120} suffix="+" /></p>
            <p className="text-xs text-slate-500">Industries Covered</p>
          </motion.div>

          {/* Widget 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="col-span-1 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <Globe className="h-5 w-5 text-[#38bdf8] mb-4" />
            <p className="text-3xl font-bold text-slate-950 mb-1"><CountUp target={65} /></p>
            <p className="text-xs text-slate-500 mb-3">Markets</p>
            <WorldMap activeCountries={[1, 3, 5, 7, 9, 11]} />
          </motion.div>

          {/* Widget 4 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="col-span-2 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-[#6366f1]" />
              <h3 className="text-sm font-semibold text-slate-900">Strategies Generated</h3>
            </div>
            <p className="text-4xl font-bold text-slate-950 mb-2"><CountUp target={2800000} suffix="+" /></p>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={STRATEGIES_CHART}>
                <defs>
                  <linearGradient id="strategiesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#strategiesGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Widget 5 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="col-span-1 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <Clock className="h-5 w-5 text-emerald-400 mb-4" />
            <p className="text-3xl font-bold text-slate-950 mb-1"><CountUp target={38} suffix="h" /></p>
            <p className="text-xs text-slate-500">Time Saved</p>
          </motion.div>

          {/* Widget 6 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }} className="col-span-1 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <TrendingUp className="h-5 w-5 text-amber-400 mb-4" />
            <p className="text-3xl font-bold text-slate-950 mb-1"><CountUp target={10} suffix="x" /></p>
            <p className="text-xs text-slate-500">Faster Planning</p>
          </motion.div>

          {/* Widget 7 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.7 }} className="col-span-1 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <CircularGauge value={liveData.marketCoverage} label="Market Coverage" size={100} />
          </motion.div>

          {/* Widget 8 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.8 }} className="col-span-1 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Business Categories</h3>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value" animationDuration={1500}>
                  {PIE_DATA.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Widget 9 - Live Market Pulse */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.9 }} className="col-span-4 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Live Market Pulse</h3>
                <p className="text-xs text-slate-500">Real-time market indicators updated every 3 seconds</p>
              </div>
              <span className="ml-auto px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />Live
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MarketIndicator label="LinkedIn Ads" value={marketPulse.linkedin} trend="up" />
              <MarketIndicator label="Google CPC" value={marketPulse.googleCpc} trend="down" />
              <MarketIndicator label="Meta CPM" value={marketPulse.metaCpm} trend="stable" />
              <MarketIndicator label="Search Demand" value={marketPulse.searchDemand} trend="up" />
              <MarketIndicator label="Consumer Confidence" value={marketPulse.consumerConfidence} trend="up" />
              <MarketIndicator label="Top Industry" value={marketPulse.topIndustry} trend="neutral" />
              <MarketIndicator label="Fastest Platform" value={marketPulse.fastestPlatform} trend="up" />
              <MarketIndicator label="Trending Angle" value={marketPulse.trendingAngle} trend="up" />
            </div>
          </motion.div>

          {/* Widget 10 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.0 }} className="col-span-1 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <Brain className="h-5 w-5 text-[#6366f1] mb-4" />
            <CircularGauge value={Math.round(liveData.aiConfidence)} label="AI Confidence" size={100} />
            <p className="text-xs text-emerald-700 text-center mt-2">High Confidence</p>
          </motion.div>

          {/* Widget 11 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.1 }} className="col-span-1 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <Target className="h-5 w-5 text-emerald-400 mb-4" />
            <p className="text-3xl font-bold text-slate-950 mb-1">{Math.round(liveData.growthOpportunity)} / 100</p>
            <p className="text-xs text-slate-500 mb-3">Growth Opportunity</p>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${liveData.growthOpportunity}%` }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1.2 }} className="h-full bg-gradient-to-r from-emerald-500 to-[#38bdf8]" />
            </div>
          </motion.div>

          {/* Widget 12 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 }} className="col-span-2 rounded-2xl border border-slate-200/70 bg-white shadow-sm p-6 hover:border-[#6366f1]/30 transition-all">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Global Activity</h3>
            <div className="h-32"><WorldMap activeCountries={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} /></div>
          </motion.div>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 scrollbar-hide">
            <MobileWidget>
              <Activity className="h-5 w-5 text-[#6366f1] mb-3" />
              <p className="text-3xl font-bold text-white mb-1"><CountUp target={liveData.competitorSignals} suffix="+" /></p>
              <p className="text-xs text-slate-400 mb-3">Competitor Signals</p>
              <Sparkline data={SPARKLINE_DATA} color="#6366f1" />
            </MobileWidget>
            <MobileWidget>
              <PieChartIcon className="h-5 w-5 text-[#8b5cf6] mb-3" />
              <p className="text-3xl font-bold text-slate-950 mb-1"><CountUp target={120} suffix="+" /></p>
              <p className="text-xs text-slate-500">Industries Covered</p>
            </MobileWidget>
            <MobileWidget>
              <Globe className="h-5 w-5 text-[#38bdf8] mb-3" />
              <p className="text-3xl font-bold text-slate-950 mb-1"><CountUp target={65} /></p>
              <p className="text-xs text-slate-500">Markets</p>
            </MobileWidget>
            <MobileWidget>
              <Zap className="h-5 w-5 text-[#6366f1] mb-3" />
              <p className="text-3xl font-bold text-slate-950 mb-1"><CountUp target={2800000} suffix="+" /></p>
              <p className="text-xs text-slate-500">Strategies Generated</p>
            </MobileWidget>
            <MobileWidget>
              <Clock className="h-5 w-5 text-emerald-400 mb-3" />
              <p className="text-3xl font-bold text-slate-950 mb-1"><CountUp target={38} suffix="h" /></p>
              <p className="text-xs text-slate-500">Time Saved</p>
            </MobileWidget>
            <MobileWidget>
              <TrendingUp className="h-5 w-5 text-amber-400 mb-3" />
              <p className="text-3xl font-bold text-slate-950 mb-1"><CountUp target={10} suffix="x" /></p>
              <p className="text-xs text-slate-500">Faster Planning</p>
            </MobileWidget>
            <MobileWidget>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Live Market Pulse</h3>
              <div className="space-y-2">
                <MarketIndicator label="LinkedIn Ads" value={marketPulse.linkedin} trend="up" />
                <MarketIndicator label="Google CPC" value={marketPulse.googleCpc} trend="down" />
                <MarketIndicator label="Meta CPM" value={marketPulse.metaCpm} trend="stable" />
              </div>
            </MobileWidget>
            <MobileWidget>
              <Brain className="h-5 w-5 text-[#6366f1] mb-3" />
              <CircularGauge value={Math.round(liveData.aiConfidence)} label="AI Confidence" size={100} />
            </MobileWidget>
          </div>
        </div>
      </div>
    </section>
  );
}

// COMPOSANT MARKET INDICATOR
function MarketIndicator({ label, value, trend }: { label: string; value: string; trend: "up" | "down" | "stable" | "neutral" }) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {trend === "up" && <ArrowUpRight className="h-4 w-4 text-emerald-400" />}
        {trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-400" />}
        {trend === "stable" && <Minus className="h-4 w-4 text-slate-400" />}
        <span className={`text-sm font-bold ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-600"}`}>{value}</span>
      </div>
    </div>
  );
}

// COMPOSANT MOBILE WIDGET
function MobileWidget({ children }: { children: React.ReactNode }) {
  return (
    <div className="snap-center flex-shrink-0 w-[280px] rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6">{children}</div>
  );
}