import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Target, Lightbulb, Rocket } from "lucide-react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

export const metadata: Metadata = {
  title: "About - Meet Darrell Kamga, Founder of MakeItAds",
  description: "Learn about Darrell Kamga, the visionary behind MakeItAds. Discover the mission to revolutionize marketing with AI-powered strategies.",
  keywords: ["Darrell Kamga", "MakeItAds founder", "AI marketing CEO", "marketing technology"],
  openGraph: {
    title: "About - Meet Darrell Kamga, Founder of MakeItAds",
    description: "Learn about Darrell Kamga, the visionary behind MakeItAds.",
    images: ["/images/dashboard-screenshot.png"],
  },
};

// Structured Data pour la page About
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Person",
    "name": "Darrell Kamga",
    "alternateName": "Kamga Avoutia Darrell Williams",
    "jobTitle": "Founder & CEO",
    "worksFor": {
      "@type": "Organization",
      "name": "MakeItAds",
      "url": "https://makeitads.pro"
    },
    "url": "https://www.linkedin.com/in/darrell-kamga-547b24275",
    "sameAs": [
      "https://www.linkedin.com/in/darrell-kamga-547b24275"
    ],
    "knowsAbout": ["Artificial Intelligence", "Marketing Technology", "Ad Strategy", "Competitor Analysis"]
  }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      
      <main className="min-h-screen bg-[#080810] text-white">
        {/* Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#6366f1]/20 rounded-full blur-[120px] opacity-40" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#8b5cf6]/10 rounded-full blur-[100px] opacity-20" />
        </div>

        <GlobalNavbar />

        {/* Hero Section */}
        <section className="relative z-10 pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Meet <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">Darrell Kamga</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              Founder & CEO of MakeItAds
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Building the future of marketing intelligence, one AI-powered strategy at a time.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="relative z-10 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  The <span className="text-[#8b5cf6]">Mission</span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  I founded MakeItAds with a simple belief: <strong className="text-white">every business deserves access to enterprise-level marketing intelligence.</strong>
                </p>
                <p className="text-slate-400 leading-relaxed mb-6">
                  For too long, small and medium businesses have been forced to guess their marketing strategies, wasting millions on campaigns that don't convert. Meanwhile, large corporations have access to sophisticated tools and data that give them an unfair advantage.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  MakeItAds changes that. We're democratizing market intelligence by combining cutting-edge AI with deep industry expertise, giving every business the power to make data-backed decisions.
                </p>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-white/10 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] mb-6 shadow-lg shadow-[#6366f1]/30">
                      <Target className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Data-Driven</h3>
                    <p className="text-slate-400">Every strategy is backed by real-time market data and competitor analysis.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="relative z-10 py-16 px-6 bg-[#080810]/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Core <span className="text-[#8b5cf6]">Values</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366f1]/20 mb-4">
                  <Lightbulb className="h-6 w-6 text-[#8b5cf6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Innovation First</h3>
                <p className="text-slate-400">
                  We're constantly pushing the boundaries of what AI can do for marketing. Every feature we build is designed to give you an unfair advantage.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 mb-4">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Transparency</h3>
                <p className="text-slate-400">
                  No black boxes. We show you exactly how we analyze your market and why we recommend each strategy. You're always in control.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#38bdf8]/20 mb-4">
                  <Rocket className="h-6 w-6 text-[#38bdf8]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Results Obsessed</h3>
                <p className="text-slate-400">
                  We don't care about vanity metrics. Everything we build is focused on one thing: helping you grow your business faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="relative z-10 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              The <span className="text-[#8b5cf6]">Journey</span>
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#8b5cf6]">01</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">The Problem</h3>
                  <p className="text-slate-400 leading-relaxed">
                    As a marketer and entrepreneur, I saw firsthand how businesses were wasting millions on ad campaigns without any real data to back their decisions. They were guessing, hoping, and praying for results.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#8b5cf6]">02</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">The Insight</h3>
                  <p className="text-slate-400 leading-relaxed">
                    I realized that the gap wasn't a lack of data—it was a lack of accessible, actionable intelligence. Large companies had teams of analysts. Small businesses had... nothing.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#8b5cf6]">03</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">The Solution</h3>
                  <p className="text-slate-400 leading-relaxed">
                    MakeItAds was born from the vision of putting enterprise-level market intelligence in the hands of every business owner. Powered by AI, built for results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Let's <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">Connect</span>
            </h2>
            <p className="text-lg text-slate-400 mb-12">
              Have questions about MakeItAds? Want to collaborate? Or just want to say hi? I'd love to hear from you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.linkedin.com/in/darrell-kamga-547b24275"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-full bg-[#0077B5] px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#005885] transition-all hover:scale-105"
              >
                {/* SVG LinkedIn inline */}
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        <GlobalFooter />
      </main>
    </>
  );
}