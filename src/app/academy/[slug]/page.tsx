"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Eye, Calendar, CheckCircle, MessageCircle, Send, Mail, Heart } from "lucide-react";
import { getArticleBySlug, getRelatedArticles, formatDate, formatNumber } from "@/data/academy/articles";
import { ArticleSection } from "@/types/academy";
import { useState } from "react";

function SectionRenderer({ section }: { section: ArticleSection }) {
  switch (section.type) {
    case "h2":
      return <h2 id={section.content?.toLowerCase().replace(/\s+/g, "-")} className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 scroll-mt-24">{section.content}</h2>;
    case "h3":
      return <h3 className="text-xl md:text-2xl font-semibold text-white mt-8 mb-4">{section.content}</h3>;
    case "paragraph":
      return <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-6">{section.content}</p>;
    case "list":
      return (
        <ul className="space-y-3 mb-6">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300">
              <div className="h-6 w-6 rounded-full bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#6366f1]" />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "checklist":
      return (
        <ul className="space-y-3 mb-6">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300">
              <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      const colors = section.variant === "warning" ? "border-amber-500/20 bg-amber-500/5 text-amber-200" : section.variant === "success" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-200" : "border-[#6366f1]/20 bg-[#6366f1]/5 text-indigo-200";
      return (
        <div className={`rounded-2xl border ${colors} p-6 my-8`}>
          <p className="text-base font-medium">{section.content}</p>
        </div>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-[#6366f1] pl-6 py-2 my-8 italic text-xl text-slate-200">
          "{section.content}"
          {section.author && <footer className="mt-3 text-sm text-slate-400 not-italic">— {section.author}</footer>}
        </blockquote>
      );
    case "stats":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          {section.data?.items?.map((stat: any, i: number) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      );
    case "cta":
      return (
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 p-8 md:p-12 my-10 text-center">
          <p className="text-lg md:text-xl text-white mb-6 max-w-2xl mx-auto">{section.content}</p>
          <Link href={section.buttonLink || "/signup"} className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-8 py-3.5 text-sm font-bold hover:bg-slate-200 transition-all">
            {section.buttonText || "Get Started"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = getArticleBySlug(slug);
  const [commentText, setCommentText] = useState("");

  if (!article) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article not found</h1>
          <Link href="/academy" className="text-[#6366f1] hover:underline">Back to Academy</Link>
        </div>
      </div>
    );
  }

  const relatedArticles = getRelatedArticles(article.slug, article.category);
  const toc = article.sections.filter((s) => s.type === "h2" || s.type === "h3");

  return (
    <div className="min-h-screen bg-[#080810]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080810]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">Make</span>
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-2xl font-bold text-transparent tracking-tight">ItAds</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/academy" className="text-sm font-medium text-white">Academy</Link>
              <Link href="/contact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Contact</Link>
              <Link href="/signup" className="rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#6366f1]/25 transition-all">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#8b5cf6]/10" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
          <Link href="/academy" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Academy
          </Link>
          
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
            <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">{article.category}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <img src={article.author.avatar} alt={article.author.name} className="h-10 w-10 rounded-full border border-white/10" />
              <div>
                <p className="font-semibold text-white">{article.author.name}</p>
                <p className="text-xs">{article.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(article.publishedAt)}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{article.stats.readTime} min read</div>
            <div className="flex items-center gap-2"><Eye className="h-4 w-4" />{formatNumber(article.stats.views)} views</div>
          </div>
        </div>
      </section>

      {/* COVER IMAGE */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 mb-16">
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
          <img src={article.coverImage} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>

      {/* CONTENT & TOC */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {toc.map((item, i) => (
                  <a 
                    key={i} 
                    href={`#${item.content?.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`block text-sm transition-colors ${item.type === "h3" ? "pl-4 text-slate-500 hover:text-slate-300" : "text-slate-300 hover:text-white font-medium"}`}
                  >
                    {item.content}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 max-w-3xl">
            {article.sections.map((section, i) => (
              <SectionRenderer key={i} section={section} />
            ))}

            {/* COMMENTS SECTION */}
            <div className="mt-20 pt-12 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-[#6366f1]" /> Comments ({article.comments.length})
              </h2>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-10">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">You</div>
                  <div className="flex-1">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..." 
                      className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none resize-none min-h-[80px]"
                    />
                    <div className="flex justify-end mt-2">
                      <button className="rounded-full bg-[#6366f1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4f46e5] transition-colors flex items-center gap-2">
                        Publish <Send className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {article.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <img src={comment.author.avatar} alt={comment.author.name} className="h-10 w-10 rounded-full border border-white/10 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-white">{comment.author.name}</p>
                          <p className="text-xs text-slate-500">{formatDate(comment.date)}</p>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 ml-4">
                        <button className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                          <Heart className="h-3 w-3" /> {comment.likes}
                        </button>
                        <button className="text-xs text-slate-500 hover:text-white transition-colors">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RELATED ARTICLES */}
            {relatedArticles.length > 0 && (
              <div className="mt-20 pt-12 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-8">You may also like</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((rel) => (
                    <Link key={rel.slug} href={`/academy/${rel.slug}`} className="group block rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-[#6366f1]/30 transition-all">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5">
                        <p className="text-xs text-[#6366f1] font-semibold mb-2">{rel.category}</p>
                        <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-[#6366f1] transition-colors">{rel.title}</h3>
                        <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{rel.stats.readTime}m</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* NEWSLETTER */}
            <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 p-8 md:p-12 text-center">
              <Mail className="h-10 w-10 text-[#6366f1] mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Stay ahead of your competitors</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Receive new marketing strategies every week. No spam, unsubscribe anytime.</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" placeholder="you@company.com" className="flex-1 rounded-full border border-white/10 bg-[#080810] px-5 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#6366f1] transition-all" />
                <button type="button" className="rounded-full bg-white text-slate-900 px-6 py-3 text-sm font-bold hover:bg-slate-200 transition-all">Subscribe</button>
              </form>
            </div>
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#080810]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">Make</span>
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-xl font-bold text-transparent tracking-tight">ItAds</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-slate-500">© 2026 MakeItAds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}