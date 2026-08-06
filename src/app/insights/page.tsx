import { blogPosts } from "@/data/blogPosts";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export const metadata = {
  title: "Marketing Insights & Strategies | MakeItAds",
  description: "Deep dives into competitor analysis, SaaS growth, and AI marketing strategies.",
};

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Bouton Retour */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#6366f1] transition-colors mb-8 group font-medium"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* En-tête de la page */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
              Marketing <span className="text-[#6366f1]">Intelligence</span>
            </h1>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              Expert insights, data-driven frameworks, and actionable strategies to help you outsmart the competition.
            </p>
          </div>

          {/* Liste des articles */}
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/insights/${post.slug}`}
                className="group block bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 hover:shadow-lg hover:border-[#6366f1]/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#6366f1] text-xs font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                        <Clock className="h-3.5 w-3.5" /> {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#111827] mb-2 group-hover:text-[#6366f1] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-[#64748B] line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[#6366f1] font-semibold shrink-0 group-hover:gap-3 transition-all">
                    Read article <ArrowLeft className="h-4 w-4 rotate-180" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}