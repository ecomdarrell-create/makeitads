import { notFound } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { ARTICLES } from "@/lib/resources-content";

// ✅ CORRECTION NEXT.JS 15 : params est maintenant une Promise, on l'attend avec await
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  
  if (!article) return notFound();

  return (
    <div className="max-w-[760px] mx-auto pb-12">
      <div className="mb-6">
        <Link href="/dashboard/resources" className="text-xs font-medium text-[#6366F1] hover:text-[#8B5CF6] flex items-center gap-1 mb-4">
          <ArrowRight className="h-3 w-3 rotate-180" /> Ressources
        </Link>
        
        <div className="flex items-center gap-3 text-xs text-[#71717A] mb-3">
          <span className="px-2 py-0.5 rounded-md bg-[#F7F7F8] border border-[#E7E7EB] font-medium">{article.category}</span>
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {article.readTime} de lecture</span>
        </div>

        <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight leading-tight">{article.title}</h1>
      </div>

      <article 
        className="bg-white rounded-[14px] border border-[#E7E7EB] p-6 md:p-8 prose prose-sm max-w-none prose-headings:text-[#18181B] prose-headings:font-bold prose-p:text-[#71717A] prose-p:leading-relaxed prose-a:text-[#6366F1] hover:prose-a:text-[#8B5CF6]"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="mt-8 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-[14px] p-6 text-center">
        <h3 className="text-lg font-bold text-[#18181B] mb-2">Prêt à appliquer cette méthode ?</h3>
        <p className="text-sm text-[#71717A] mb-4">Ne laissez pas cette connaissance dormir. Passez à l'action dès maintenant.</p>
        <Link href="/dashboard/strategies/new" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#6366F1] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors">
          Créer une stratégie <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-[#E7E7EB] flex items-center justify-between">
        <Link href="/dashboard/resources" className="text-sm font-medium text-[#71717A] hover:text-[#18181B] flex items-center gap-1">
          <ArrowRight className="h-4 w-4 rotate-180" /> Retour aux ressources
        </Link>
      </div>
    </div>
  );
}