"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Send, ArrowLeft, CheckCircle, ChevronDown, Phone, Clock } from "lucide-react";

const FAQS = [
  {
    question: "How does MakeItAds work?",
    answer: "MakeItAds uses advanced AI to analyze your market, competitors, and audience to generate data-driven marketing strategies in minutes. Simply input your business details and let our AI do the heavy lifting."
  },
  {
    question: "What subscription plans do you offer?",
    answer: "We offer four plans: Free (1 strategy/month), Pro ($29/month, 10 strategies), Premium ($59/month, unlimited strategies), and Enterprise ($149/month, multi-brand management). All paid plans come with a 30-day money-back guarantee."
  },
  {
    question: "Can I try MakeItAds for free?",
    answer: "Yes! Our Free plan gives you access to 1 AI-generated strategy per month with basic market analysis. No credit card required to get started."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team via email at support@makeitads.pro, through the live chat available 24/7 on our platform, or by filling out the contact form on this page. We typically respond within 24 hours."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. You can cancel your subscription at any time from your billing settings. If you cancel, you'll continue to have access to your plan until the end of your current billing cycle."
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We use 256-bit SSL encryption and are PCI DSS compliant. Your data is stored securely and never shared with third parties. We take privacy seriously."
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#080810]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080810]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* ✅ LOGO CORRIGÉ : MakeIt en blanc, Ads en violet */}
              <Link href="/" className="flex items-center gap-0.5 group">
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:opacity-80 transition-opacity">
                  MakeIt
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#6366f1] tracking-tight group-hover:opacity-80 transition-opacity">
                  Ads
                </span>
              </Link>
              
              {/* ✅ BOUTON RETOUR */}
              <Link 
                href="/" 
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Home
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/academy" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Academy</Link>
              <Link href="/contact" className="text-sm font-medium text-white">Contact</Link>
              <Link href="/signup" className="rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-5 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#6366f1]/25 transition-all">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#8b5cf6]/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5 mb-6">
              <MessageCircle className="h-3.5 w-3.5 text-[#6366f1]" />
              <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wider">Contact Us</span>
            </div>
            {/* ✅ TAILLE DE POLICE RÉDUITE POUR MOBILE */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6">
              Let's start a <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">conversation</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto px-2">
              Have a question, feedback, or need help? We're here for you. Our team typically responds within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="h-12 w-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center mb-4">
              <Mail className="h-5 w-5 text-[#6366f1]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">Email Us</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-3">We'll respond within 24 hours</p>
            <p className="text-xs sm:text-sm font-semibold text-[#6366f1]">support@makeitads.pro</p>
          </div>
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="h-12 w-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center mb-4">
              <Phone className="h-5 w-5 text-[#6366f1]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">Live Chat</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-3">Available 24/7 for paid plans</p>
            <p className="text-xs sm:text-sm font-semibold text-[#6366f1]">Start a conversation</p>
          </div>
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 sm:col-span-2 md:col-span-1">
            <div className="h-12 w-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center mb-4">
              <Clock className="h-5 w-5 text-[#6366f1]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">Response Time</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-3">Average response time</p>
            <p className="text-xs sm:text-sm font-semibold text-[#6366f1]">Under 24 hours</p>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl sm:rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 sm:p-12 text-center">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Message Sent!</h2>
              <p className="text-sm sm:text-base text-slate-400">Thank you for reaching out. We'll get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white outline-none focus:border-[#6366f1] transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white outline-none focus:border-[#6366f1] transition-all" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Company</label>
                <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white outline-none focus:border-[#6366f1] transition-all" placeholder="Your company name" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subject</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white outline-none focus:border-[#6366f1] transition-all" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</label>
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={5} className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white outline-none focus:border-[#6366f1] transition-all resize-none" placeholder="Tell us more about your question..." />
              </div>
              <button type="submit" className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] py-3.5 sm:py-4 text-sm font-bold text-white hover:shadow-lg hover:shadow-[#6366f1]/25 transition-all flex items-center justify-center gap-2">
                Send Message <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* FAQ SECTION */}
      <section className="border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-400">Everything you need to know about MakeItAds</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-white pr-4">{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 sm:px-6 pb-4 sm:pb-6"
                  >
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#080810]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* ✅ LOGO CORRIGÉ DANS LE FOOTER */}
            <Link href="/" className="flex items-center gap-0.5 group">
              <span className="text-lg font-bold text-white tracking-tight group-hover:opacity-80 transition-opacity">MakeIt</span>
              <span className="text-lg font-bold text-[#6366f1] tracking-tight group-hover:opacity-80 transition-opacity">Ads</span>
            </Link>
            
            <div className="flex items-center gap-6 sm:gap-8">
              <Link href="/privacy" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Contact</Link>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-500">© 2026 MakeItAds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}