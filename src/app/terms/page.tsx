"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, Building2, Scale, Shield, CreditCard, UserCheck, AlertTriangle, FileText, Globe, RefreshCw, MessageSquare } from "lucide-react";
import Link from "next/link";

// IMPORTS DES COMPOSANTS GLOBAUX
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

// ======================================================
// DATA - SECTIONS DES CGV
// ======================================================

const lastUpdated = "June 17, 2026";
const effectiveDate = "June 17, 2026";

const sections = [
  {
    id: "1",
    title: "Introduction",
    icon: FileText,
    content: `Welcome to MakeItAds ("Company", "we", "our", "us"). These Terms of Service ("Terms", "Terms of Service") govern your use of our website located at makeitads.com ("Service") operated by MakeItAds Inc.

These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.`,
  },
  {
    id: "2",
    title: "Description of Service",
    icon: Shield,
    content: `MakeItAds is an AI-powered market intelligence platform that provides marketing strategy generation, competitor analysis, trend forecasting, and business growth recommendations.

Our Service includes but is not limited to:
• AI-generated marketing strategies
• Competitor intelligence and tracking
• Market trend analysis and forecasting
• Performance analytics and reporting
• Strategy export and collaboration tools

We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.`,
  },
  {
    id: "3",
    title: "User Accounts",
    icon: UserCheck,
    content: `When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.

You are responsible for:
• Safeguarding the password you use to access the Service
• All activities that occur under your account
• Notifying us immediately of any unauthorized use of your account

You may not use another user's account without permission. Account sharing between different individuals is prohibited unless explicitly allowed by your subscription plan.`,
  },
  {
    id: "4",
    title: "Subscriptions and Pricing",
    icon: CreditCard,
    content: `Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or yearly basis, depending on the type of subscription plan you select.

At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or MakeItAds cancels it. You may cancel your Subscription renewal either through your online account management page or by contacting our customer support team.

A valid payment method, including credit card, is required to process the payment for your Subscription. By submitting such payment information, you automatically authorize MakeItAds to charge all Subscription fees incurred through your account to any such payment instruments.

Should automatic billing fail to occur for any reason, MakeItAds reserves the right to terminate your access to the Service with immediate effect.`,
  },
  {
    id: "5",
    title: "Payment Processing (Stripe)",
    icon: CreditCard,
    content: `All payments are processed securely through Stripe, our third-party payment processor. By using our Service, you also agree to Stripe's Terms of Service.

We accept the following payment methods:
• Visa
• Mastercard
• American Express
• Other payment methods as specified at checkout

All prices are displayed in USD unless otherwise stated. Prices do not include applicable taxes. You are responsible for paying all taxes associated with your use of the Service.

Refunds are handled on a case-by-case basis. Contact our support team within 14 days of your purchase to request a refund.`,
  },
  {
    id: "6",
    title: "Free Trial",
    icon: FileText,
    content: `We may offer a free trial period for certain subscription plans. During the trial period, you will have access to the features included in the selected plan.

At the end of the trial period:
• Your subscription will automatically convert to a paid plan unless you cancel before the trial ends
• You will be charged according to the pricing of the selected plan
• We will notify you before the trial period ends

You can cancel your trial at any time before it ends to avoid being charged.`,
  },
  {
    id: "7",
    title: "Content and Intellectual Property",
    icon: Scale,
    content: `The Service and its original content, features, and functionality are and will remain the exclusive property of MakeItAds and its licensors. The Service is protected by copyright, trademark, and other laws.

Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of MakeItAds.

Content you generate using our AI tools (strategies, reports, analyses) is yours to use. However, you may not resell or redistribute the Service itself or its core functionality.`,
  },
  {
    id: "8",
    title: "Acceptable Use",
    icon: AlertTriangle,
    content: `You agree not to use the Service:
• In any way that violates any applicable national or international law or regulation
• To transmit any unsolicited or unauthorized advertising or promotional material
• To impersonate or attempt to impersonate MakeItAds, a MakeItAds employee, another user, or any other person or entity
• To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service
• To attempt to gain unauthorized access to any part of the Service
• To use the Service for any illegal or unauthorized purpose
• To violate any third-party rights, including intellectual property rights

We reserve the right to terminate or suspend your account immediately, without prior notice, for any violation of these Terms.`,
  },
  {
    id: "9",
    title: "Limitation of Liability",
    icon: Shield,
    content: `In no event shall MakeItAds, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:

• Your access to or use of or inability to access or use the Service
• Any conduct or content of any third party on the Service
• Any content obtained from the Service
• Unauthorized access, use, or alteration of your transmissions or content

Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.`,
  },
  {
    id: "10",
    title: "Disclaimer",
    icon: AlertTriangle,
    content: `Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.

MakeItAds does not warrant that:
• The Service will function uninterrupted, secure, or available at any particular time or location
• Any errors or defects will be corrected
• The Service is free of viruses or other harmful components
• The results of using the Service will meet your requirements

The AI-generated strategies and recommendations are for informational purposes only and do not constitute professional business or legal advice.`,
  },
  {
    id: "11",
    title: "Governing Law",
    icon: Globe,
    content: `These Terms shall be governed and construed in accordance with the laws of France, without regard to its conflict of law provisions.

Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.

These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have had between us regarding the Service.`,
  },
  {
    id: "12",
    title: "Changes to Terms",
    icon: RefreshCw,
    content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.`,
  },
  {
    id: "13",
    title: "Contact Us",
    icon: MessageSquare,
    content: `If you have any questions about these Terms, please contact us:

By email: support@makeitads.com

By mail:
MakeItAds Inc.
[Your Business Address]
[City, Postal Code]
France

We will respond to your inquiry within 5 business days.`,
  },
];

// ======================================================
// PAGE TERMS OF SERVICE
// ======================================================

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      {/* NAVBAR GLOBALE */}
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
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 px-4 py-1.5 text-xs font-medium text-[#a5b4fc] mb-6">
              <Scale className="h-3.5 w-3.5" />
              Legal Document
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-lg text-slate-400 mb-6">
              Please read these terms carefully before using our Service.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>Last updated: {lastUpdated}</span>
              <span>•</span>
              <span>Effective date: {effectiveDate}</span>
            </div>
          </motion.div>

          {/* Introduction Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[#6366f1]/20 bg-gradient-to-br from-[#6366f1]/5 to-transparent p-6 mb-12"
          >
            <p className="text-slate-300 leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and MakeItAds Inc. governing your access to and use of the MakeItAds platform, including all associated services, features, and content. By creating an account or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-4 p-6 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Section {section.id}
                      </div>
                      <h2 className="text-xl font-bold text-white">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-6">
                    {section.content.split("\n\n").map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-slate-300 leading-relaxed mb-4 last:mb-0 whitespace-pre-line"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6"
          >
            <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Key Takeaways
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                You can cancel your subscription at any time from your billing dashboard
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                Payments are processed securely through Stripe
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                Content you generate belongs to you
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                We may update these Terms with 30 days notice for material changes
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                French law governs these Terms
              </li>
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-slate-400 mb-4">Have questions about these terms?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 transition-all"
            >
              <Mail className="h-4 w-4" />
              Contact our legal team
            </Link>
          </motion.div>

          {/* Related Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Link
              href="/privacy"
              className="rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group"
            >
              <Shield className="h-8 w-8 text-[#6366f1] mb-3" />
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#a5b4fc] transition-colors">
                Privacy Policy
              </h3>
              <p className="text-sm text-slate-400">
                Learn how we collect, use, and protect your personal data.
              </p>
            </Link>
            <Link
              href="/cookies"
              className="rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group"
            >
              <FileText className="h-8 w-8 text-[#6366f1] mb-3" />
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#a5b4fc] transition-colors">
                Cookie Policy
              </h3>
              <p className="text-sm text-slate-400">
                Understand how we use cookies and similar technologies.
              </p>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* FOOTER GLOBAL */}
      <GlobalFooter />
    </main>
  );
}