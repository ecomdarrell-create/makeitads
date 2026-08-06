import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

// ✅ 1. Génération statique des routes (Empêche les 404)
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// ✅ 2. Métadonnées SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Article Not Found | MakeItAds" };

  return {
    title: `${post.title} | MakeItAds Insights`,
    description: post.excerpt,
  };
}

// ✅ 3. Le composant de la page
export default function ArticlePage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6">
        <article className="max-w-3xl mx-auto">
          
          {/* Bouton Retour */}
          <Link 
            href="/insights" 
            className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#6366f1] transition-colors mb-8 group font-medium"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Insights
          </Link>

          {/* En-tête */}
          <header className="mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#EEF2FF] text-[#6366f1] text-xs font-bold uppercase tracking-wider mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-[#64748B] border-b border-gray-100 pb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.readTime}
              </span>
            </div>
          </header>

          {/* ✅ CONTENU RICHE (Rendu simplifié et garanti visible) */}
          <div 
            className="text-[#475569] text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {/* CTA de Conversion Final */}
          <div className="mt-16 p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white text-center shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to outsmart your competition?</h3>
            <p className="mb-8 text-lg opacity-90 max-w-xl mx-auto">
              Join thousands of founders using MakeItAds to build data-driven marketing strategies in minutes, not months.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 bg-white text-[#6366f1] font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Start Building Your Strategy Free
            </Link>
          </div>

        </article>
      </main>

      <GlobalFooter />
    </div>
  );
}