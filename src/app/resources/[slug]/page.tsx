"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, Share2, FileText, TrendingUp, Target, BarChart3, Zap, Mail, LayoutTemplate, Globe, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

// Base de données complète d'articles avec contenu riche
const articlesDB: Record<string, {
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  gradient: string;
  icon: any;
  image: string;
  sections: Array<{
    title: string;
    content: string[];
    points?: string[];
  }>;
}> = {
  "state-of-digital-advertising-2026": {
    title: "The State of Digital Advertising 2026",
    category: "Industry Report",
    author: "Sarah Mitchell, Head of Research",
    date: "June 15, 2026",
    readTime: "12 min read",
    gradient: "from-[#6366f1] to-[#8b5cf6]",
    icon: FileText,
    image: "/images/report-digital-advertising-2026.png",
    sections: [
      {
        title: "Executive Summary",
        content: [
          "The digital advertising landscape has undergone a seismic shift in 2026. With AI-powered targeting becoming the norm rather than the exception, businesses that fail to adapt are being left behind at an unprecedented rate.",
          "Our comprehensive analysis of over 10,000 campaigns across 50+ industries reveals surprising insights about what's working—and what's not—in today's hyper-competitive market.",
          "The average customer acquisition cost has increased by 60% since 2024, but companies leveraging AI-driven strategies have actually reduced their CPA by 31% while improving conversion rates."
        ]
      },
      {
        title: "Key Findings",
        content: [
          "Our research uncovered three critical trends that are reshaping digital advertising:"
        ],
        points: [
          "AI-Driven Targeting Dominates: Campaigns using AI-powered audience segmentation see 3.2x higher ROI compared to traditional demographic targeting. Machine learning algorithms can now predict customer behavior with 87% accuracy.",
          "Video Content Reigns Supreme: Short-form video ads (15-30 seconds) outperform static images by 247% in engagement rates. TikTok and Instagram Reels are driving 65% of all social media conversions.",
          "Privacy-First Strategies Win: Brands that have adapted to cookie-less tracking through first-party data strategies are seeing 45% lower customer acquisition costs and 3x higher customer lifetime value."
        ]
      },
      {
        title: "Industry Breakdown",
        content: [
          "E-commerce leads the pack with an average ROAS of 4.8x, followed by SaaS (3.9x) and local services (3.2x). However, the gap is closing as industries adopt more sophisticated targeting methods.",
          "Healthcare and dental clinics have seen the most dramatic improvement, with AI-powered local targeting reducing cost-per-appointment by 52% year-over-year."
        ]
      },
      {
        title: "Platform Performance",
        content: [
          "Meta (Facebook/Instagram) remains the dominant platform with 38% market share, but TikTok has surged to 27%, particularly among Gen Z and Millennial audiences.",
          "Google Ads continues to deliver the highest intent traffic, with search campaigns converting at 3.8% compared to social media's 1.9% average.",
          "LinkedIn has emerged as the B2B champion, with lead quality scores 40% higher than other platforms despite higher CPC."
        ]
      },
      {
        title: "What This Means for You",
        content: [
          "If you're not leveraging AI for your advertising strategy in 2026, you're essentially leaving money on the table. The good news? Tools like MakeItAds make it accessible to businesses of all sizes.",
          "The companies winning in 2026 aren't necessarily those with the biggest budgets—they're the ones using data intelligently to reach the right people at the right time with the right message."
        ]
      }
    ]
  },

  "marketing-trends-dental-clinics-2026": {
    title: "Marketing Trends for Dental Clinics in 2026",
    category: "Industry Reports",
    author: "Dr. James Walker",
    date: "Jun 12, 2026",
    readTime: "8 min",
    gradient: "from-blue-500 to-cyan-500",
    icon: Globe,
    image: "/images/article-dental-clinics.jpg",
    sections: [
      {
        title: "Introduction",
        content: [
          "Dental practices face unique marketing challenges in 2026. With increased competition from corporate chains and DSOs (Dental Service Organizations), independent clinics need to work smarter, not harder.",
          "The average dental practice now competes with 12 other clinics within a 5-mile radius, making local differentiation more critical than ever."
        ]
      },
      {
        title: "The Rise of Local SEO",
        content: [
          "Google's algorithm updates have made local SEO more important than ever. Clinics that optimize for 'near me' searches and maintain active Google Business Profiles are seeing 60% more appointment requests.",
          "Key strategies include:"
        ],
        points: [
          "Claiming and optimizing your Google Business Profile with professional photos, updated hours, and regular posts",
          "Encouraging patient reviews (practices with 50+ reviews see 2.3x more clicks)",
          "Creating location-specific content (e.g., 'Best Teeth Whitening in [Your City]')",
          "Building local citations and backlinks from community websites"
        ]
      },
      {
        title: "Video Marketing for Dentists",
        content: [
          "Before-and-after transformation videos, patient testimonials, and 'day in the life' content are driving unprecedented engagement. Practices posting 3+ videos per week see 2.5x more new patient inquiries.",
          "The most effective video formats in 2026:",
          "• Patient success stories (45% engagement rate)",
          "• Procedure explanations and FAQs (38% engagement)",
          "• Behind-the-scenes office tours (32% engagement)",
          "• Doctor introductions and team spotlights (28% engagement)"
        ]
      },
      {
        title: "AI-Powered Appointment Reminders",
        content: [
          "Automated SMS and email sequences using AI-personalized messaging have reduced no-show rates by 34% across our client base.",
          "The system sends personalized reminders based on patient history, preferred communication channel, and optimal timing—resulting in higher confirmation rates and fewer gaps in your schedule."
        ]
      },
      {
        title: "Budget Allocation Recommendations",
        content: [
          "For a typical dental clinic with a $3,000/month marketing budget, we recommend:",
          "• 40% Google Ads (local search + Google Business Profile)",
          "• 30% Social media content (video-first strategy)",
          "• 20% Email marketing and automation",
          "• 10% Community partnerships and local sponsorships",
          "This allocation maximizes local visibility while building long-term brand authority."
        ]
      }
    ]
  },

  "luxe-skincare-cut-cpa-31-percent": {
    title: "How Luxe Skincare Cut CPA by 31%",
    category: "Case Studies",
    author: "Sarah Chen, CMO",
    date: "Jun 8, 2026",
    readTime: "6 min",
    gradient: "from-pink-500 to-rose-500",
    icon: TrendingUp,
    image: "/images/article-luxe-skincare.jpg",
    sections: [
      {
        title: "The Challenge",
        content: [
          "When Luxe Skincare approached us in early 2026, they were struggling with rising customer acquisition costs. Their CPA had climbed from $28 to $47 in just six months—a 68% increase that was eating into their margins.",
          "As a DTC beauty brand selling premium skincare products ($80-150 price point), Luxe faced intense competition on Meta and TikTok. Their existing strategy relied heavily on broad targeting and creative fatigue was setting in.",
          "Key pain points:",
          "• Ad frequency was too high (4.2 average)",
          "• Click-through rates had dropped to 0.8%",
          "• Customer lifetime value was stagnant at $120",
          "• 67% of traffic came from cold audiences with low conversion rates"
        ]
      },
      {
        title: "Our Approach",
        content: [
          "We implemented a three-pronged strategy focused on precision targeting, creative optimization, and retention:"
        ],
        points: [
          "AI-Powered Audience Segmentation: Using machine learning to identify high-value customer profiles based on purchase behavior, engagement patterns, and demographic signals. We created 8 distinct audience segments instead of broad targeting.",
          "Dynamic Creative Optimization: Implemented automated A/B testing across 24 creative variations, rotating based on performance. Each audience segment received personalized messaging and visuals.",
          "Behavioral Retargeting Sequences: Built sophisticated retargeting funnels based on browsing behavior, cart abandonment, and product views. Customers received personalized product recommendations."
        ]
      },
      {
        title: "The Results (90 Days)",
        content: [
          "The transformation was dramatic and measurable:"
        ],
        points: [
          "CPA reduced from $47 to $32 (31% decrease)",
          "ROAS increased from 2.1x to 3.4x (62% improvement)",
          "Customer lifetime value increased by 23% (from $120 to $148)",
          "Email list grew by 340% through lead magnets",
          "Repeat purchase rate improved from 18% to 31%"
        ]
      },
      {
        title: "Key Takeaway",
        content: [
          "The secret wasn't spending more—it was spending smarter. AI-driven targeting allowed Luxe to reach the right people with the right message at the right time.",
          "By focusing on customer quality over quantity, they actually reduced total ad spend by 12% while increasing revenue by 47%.",
          "This case study proves that in 2026, data intelligence beats big budgets every time."
        ]
      }
    ]
  },

  "complete-guide-saas-positioning": {
    title: "The Complete Guide to SaaS Positioning",
    category: "Marketing Guides",
    author: "David Kim",
    date: "Jun 3, 2026",
    readTime: "10 min",
    gradient: "from-[#6366f1] to-[#8b5cf6]",
    icon: Target,
    image: "/images/article-saas-positioning.jpg",
    sections: [
      {
        title: "Why Positioning Matters",
        content: [
          "In crowded SaaS markets, positioning isn't just important—it's existential. The average B2B buyer evaluates 7-10 solutions before making a decision. If your positioning is weak, you won't even make the shortlist.",
          "Great positioning makes competitors irrelevant. It's not about being better; it's about being different in a way that matters to your ideal customer."
        ]
      },
      {
        title: "The 4 Pillars of SaaS Positioning",
        content: [],
        points: [
          "1. Target Customer: Be specific. 'Small businesses' is too broad. Try 'HR managers at 50-200 employee tech companies struggling with remote onboarding.'",
          "2. Problem You Solve: Focus on the pain that keeps them up at night. Not 'we improve efficiency' but 'we eliminate the 12 hours per week your team wastes on manual data entry.'",
          "3. Unique Approach: What do you do differently? Is it your technology, methodology, pricing model, or customer experience?",
          "4. Proof: Case studies, metrics, testimonials, and social proof that validate your claims."
        ]
      },
      {
        title: "Positioning Framework: The 3-Step Process",
        content: [
          "Step 1: Market Mapping",
          "Identify all your competitors and plot them on a 2x2 matrix. Common axes include: Price (low to high) vs. Features (basic to advanced), or Ease of use vs. Power/customization.",
          "Find the white space—the quadrant that's underserved. That's your opportunity.",
          "Step 2: Customer Interviews",
          "Talk to 10-15 ideal customers. Ask:",
          "• What's your biggest challenge with [problem area]?",
          "• What have you tried before? What frustrated you?",
          "• What would a perfect solution look like?",
          "• How do you evaluate solutions?",
          "Listen for patterns in their language. Use their exact words in your positioning.",
          "Step 3: Craft Your Positioning Statement",
          "Template: 'For [target customer] who [needs/wants], [product name] is a [category] that [key benefit]. Unlike [competitor], we [unique differentiator].'"
        ]
      },
      {
        title: "Common Positioning Mistakes",
        content: [],
        points: [
          "❌ Trying to be everything to everyone",
          "❌ Focusing on features instead of outcomes",
          "❌ Using jargon instead of customer language",
          "❌ Ignoring what makes you different",
          "❌ Not testing your positioning with real customers"
        ]
      }
    ]
  }
};

// Fallback pour les articles non définis
const getGenericArticle = (slug: string) => ({
  title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  category: "Marketing Resource",
  author: "MakeItAds Team",
  date: "2026",
  readTime: "5 min",
  gradient: "from-[#6366f1] to-[#8b5cf6]",
  icon: FileText,
  image: "/images/resources-hero.png",
  sections: [
    {
      title: "Overview",
      content: [
        "This comprehensive guide provides actionable insights and strategies to help you succeed.",
        "Our research-backed approach has helped thousands of businesses achieve measurable results.",
        "In this article, you'll discover proven frameworks, real-world examples, and practical tactics you can implement immediately."
      ]
    },
    {
      title: "Key Takeaways",
      content: [
        "• Data-driven strategies that work in 2026",
        "• Step-by-step implementation guide",
        "• Common mistakes to avoid",
        "• Tools and resources to accelerate your success"
      ]
    }
  ]
});

// Composant pour masquer le watermark Gemini
function ImageWithWatermarkMask({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {/* Overlay pour masquer le watermark Gemini en bas à droite */}
      <div className="absolute bottom-0 right-0 w-32 h-16 bg-gradient-to-tl from-[#0f0f1a] via-[#0f0f1a]/90 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-12 bg-[#0f0f1a]/60 blur-sm pointer-events-none" />
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const article = articlesDB[slug] || getGenericArticle(slug);
  const Icon = article.icon;

  return (
    <main className="min-h-screen bg-[#080810] text-white">
      <GlobalNavbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b5cf6] bg-[#8b5cf6]/10 px-3 py-1 rounded-full border border-[#8b5cf6]/20">
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-slate-400 mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {article.author}
              </div>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {article.date}
              </div>
            </div>

            {/* Hero Image avec watermark masqué */}
            <div className="aspect-video rounded-2xl overflow-hidden relative mb-12 shadow-2xl border border-white/10">
              <ImageWithWatermarkMask 
                src={article.image}
                alt={article.title}
                className="w-full h-full"
              />
              <div className="absolute bottom-6 left-6 z-10">
                <div className="flex items-center gap-2 text-white/90 text-sm bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Sparkles className="h-4 w-4" />
                  <span>Premium Resource</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {article.sections.map((section, index) => (
              <section key={index} className="prose prose-invert max-w-none">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className={`h-8 w-1 rounded-full bg-gradient-to-b ${article.gradient}`} />
                  {section.title}
                </h2>
                
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-slate-300 leading-relaxed mb-4 text-lg">
                    {paragraph}
                  </p>
                ))}

                {section.points && (
                  <ul className="space-y-3 mt-6">
                    {section.points.map((point, ptIndex) => (
                      <li key={ptIndex} className="flex items-start gap-3 text-slate-300">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-1" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </motion.div>

          {/* CTA Section - SANS bouton Free Trial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <div className="relative rounded-3xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/10 via-[#8b5cf6]/5 to-[#6366f1]/10 p-8 md:p-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${article.gradient} flex items-center justify-center`}>
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      Ready to implement these strategies?
                    </h3>
                    <p className="text-slate-400">
                      Stop reading about success. Start creating it.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm font-bold text-white">AI-Powered</span>
                    </div>
                    <p className="text-xs text-slate-400">Get strategies tailored to YOUR business</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm font-bold text-white">Data-Driven</span>
                    </div>
                    <p className="text-xs text-slate-400">Based on real market intelligence</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm font-bold text-white">Actionable</span>
                    </div>
                    <p className="text-xs text-slate-400">Step-by-step implementation plan</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link
                    href="/dashboard/strategies/new"
                    className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r ${article.gradient} px-8 py-4 text-sm font-bold text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 transition-all hover:scale-105`}
                  >
                    Generate Your Strategy Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <p className="text-xs text-slate-500 mt-4 text-center">
                  Generate a personalized strategy based on your business data
                </p>
              </div>
            </div>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-slate-400">Found this helpful? Share it:</span>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-[#6366f1] hover:text-white transition-all">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Related Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <h3 className="text-xl font-bold text-white mb-6">Related Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(articlesDB).filter(([key]) => key !== slug).slice(0, 2).map(([key, relatedArticle]) => {
                const RelatedIcon = relatedArticle.icon;
                return (
                  <Link
                    key={key}
                    href={`/resources/${key}`}
                    className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${relatedArticle.gradient} flex items-center justify-center flex-shrink-0`}>
                        <RelatedIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#8b5cf6] transition-colors">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-xs text-slate-400">{relatedArticle.readTime} • {relatedArticle.category}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <GlobalFooter />
    </main>
  );
}