"use client";

import { motion } from "framer-motion";
import { Search, MessageCircle, BookOpen, Mail, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

const faqs = [
  {
    question: "How do I generate my first strategy?",
    answer: "After signing up, go to your dashboard and click 'Generate New Strategy'. Fill in your business details and our AI will create a personalized marketing strategy in minutes."
  },
  {
    question: "What's included in the Free plan?",
    answer: "The Free plan includes 1 AI-generated strategy per month, basic analytics, and access to our resource library. Upgrade to Pro for 10 strategies/month and advanced features."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes! You can cancel your subscription at any time from your billing settings. You'll continue to have access until the end of your billing period."
  },
  {
    question: "How does the AI generate strategies?",
    answer: "Our AI analyzes your industry, competitors, target audience, and business goals to create data-driven marketing strategies. It uses real market data and proven frameworks."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption and never share your data with third parties. Your business information is completely confidential."
  },
  {
    question: "Can I export my strategies?",
    answer: "Yes! Pro and Premium users can export strategies as PDF reports with full branding. Enterprise users get white-label reports."
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#080810] text-white">
      <GlobalNavbar />

      {/* Hero */}
      <section className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 px-4 py-1.5 text-xs font-medium text-[#a5b4fc] mb-6">
              <HelpCircle className="h-3.5 w-3.5" />
              Help Center
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>
            <p className="text-lg text-slate-400 mb-8">Find answers to common questions or contact our support team.</p>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full rounded-2xl border border-white/10 bg-[#0f0f1a] pl-14 pr-6 py-4 text-sm text-white outline-none focus:border-[#6366f1] transition-colors placeholder:text-slate-600"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: "Documentation", desc: "Learn how to use MakeItAds", href: "/resources" },
            { icon: MessageCircle, title: "Community", desc: "Connect with other users", href: "/resources" },
            { icon: Mail, title: "Contact Support", desc: "Get help from our team", href: "/contact" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={item.href} className="block rounded-2xl border border-white/10 bg-[#0f0f1a] p-6 hover:border-[#6366f1]/30 transition-all">
                  <Icon className="h-8 w-8 text-[#8b5cf6] mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-white/10 bg-[#0f0f1a] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-semibold text-white">{faq.question}</span>
                  <ArrowRight className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === index ? "rotate-90" : ""}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-12">
            <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
            <p className="text-slate-400 mb-6">Our support team is here for you.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-3 text-sm font-bold text-white hover:scale-105 transition-all">
              Contact Support <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}