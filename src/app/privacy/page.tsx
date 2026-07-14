"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, Shield, Eye, Database, Lock, UserCheck, FileText, Globe, RefreshCw, MessageSquare, Cookie, Server, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// IMPORTS DES COMPOSANTS GLOBAUX
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

// ======================================================
// DATA
// ======================================================

const lastUpdated = "June 17, 2026";
const effectiveDate = "June 17, 2026";

const sections = [
  {
    id: "1",
    title: "Introduction",
    icon: FileText,
    content: `At MakeItAds ("Company", "we", "our", "us"), we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website makeitads.pro and use our AI-powered market intelligence platform ("Service").

By using our Service, you consent to the collection and use of information in accordance with this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the Service.`,
  },
  {
    id: "2",
    title: "Information We Collect",
    icon: Database,
    content: `We collect several types of information from and about users of our Service, including:

Personal Information:
• Name and surname
• Email address
• Company name and business information
• Payment information (processed securely through Stripe - we do not store credit card details)
• Phone number (optional)
• Profile picture (optional)

Usage Data:
• IP address and browser type
• Operating system and device information
• Pages visited and time spent on the Service
• Click patterns and user interactions
• Referral source

Content Data:
• Business descriptions you provide
• Marketing strategies generated
• Competitor information you input
• Reports and analyses you create

We collect this information directly from you when you provide it, automatically as you navigate through the Service, and from third-party sources.`,
  },
  {
    id: "3",
    title: "How We Use Your Information",
    icon: Eye,
    content: `We use the information we collect to:

• Provide, maintain, and improve our Service
• Process transactions and manage your subscription
• Generate AI-powered marketing strategies and insights
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and customer service requests
• Monitor and analyze trends, usage, and activities in connection with our Service
• Detect, investigate, and prevent fraudulent transactions and other illegal activities
• Personalize and improve your experience
• Send marketing communications (with your consent, you can opt out anytime)
• Comply with legal obligations`,
  },
  {
    id: "4",
    title: "Legal Basis for Processing (GDPR)",
    icon: Shield,
    content: `If you are in the European Economic Area (EEA), our legal basis for collecting and using your personal information depends on the specific context:

• Contract: To fulfill our contractual obligations to you (providing the Service)
• Consent: When you have given us explicit consent (e.g., marketing emails)
• Legitimate Interest: For improving our Service and ensuring security
• Legal Obligation: To comply with applicable laws and regulations

You have the right to withdraw consent at any time. Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal.`,
  },
  {
    id: "5",
    title: "Data Sharing and Disclosure",
    icon: Users,
    content: `We may share your personal information in the following situations:

Service Providers:
• Stripe - for payment processing (PCI-DSS compliant)
• Supabase - for database hosting and authentication
• Email service providers - for transactional and marketing emails
• Analytics providers - to understand Service usage

Business Transfers:
• In connection with a merger, acquisition, or sale of assets

Legal Requirements:
• To comply with legal obligations
• To protect and defend our rights or property
• To prevent or investigate possible wrongdoing

We do NOT sell your personal information to third parties.`,
  },
  {
    id: "6",
    title: "Data Security",
    icon: Lock,
    content: `We implement appropriate technical and organizational security measures to protect your personal information, including:

• SSL/TLS encryption for data in transit
• AES-256 encryption for data at rest
• Secure authentication via Supabase
• PCI-DSS compliant payment processing via Stripe
• Regular security audits and updates
• Access controls and authentication mechanisms
• Employee training on data protection

However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.`,
  },
  {
    id: "7",
    title: "Your Rights (GDPR & CCPA)",
    icon: UserCheck,
    content: `Depending on your location, you have certain rights regarding your personal information:

For EEA residents (GDPR):
• Right to access - Request a copy of your personal data
• Right to rectification - Correct inaccurate data
• Right to erasure ("right to be forgotten") - Request deletion of your data
• Right to restrict processing - Limit how we use your data
• Right to data portability - Receive your data in a portable format
• Right to object - Object to processing based on legitimate interest
• Right to withdraw consent - At any time

For California residents (CCPA):
• Right to know what personal information is collected
• Right to know if personal information is sold or disclosed
• Right to opt-out of sale of personal information
• Right to request deletion of personal information
• Right to non-discrimination for exercising rights

To exercise any of these rights, contact us at support@makeitads.pro. We will respond within 30 days.`,
  },
  {
    id: "8",
    title: "Cookies and Tracking Technologies",
    icon: Cookie,
    content: `We use cookies and similar tracking technologies to track activity on our Service and hold certain information.

Types of cookies we use:
• Essential cookies - Required for the Service to function
• Analytics cookies - Help us understand how you use the Service (e.g., Google Analytics)
• Preference cookies - Remember your settings and preferences
• Marketing cookies - Track your activity for advertising purposes (only with consent)

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.

For detailed information about our cookie practices, please see our Cookie Policy.`,
  },
  {
    id: "9",
    title: "Third-Party Services",
    icon: Server,
    content: `Our Service may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.

Third-party services we use:
• Stripe (Payment Processing) - stripe.com/privacy
• Supabase (Database & Auth) - supabase.com/privacy
• Google Analytics (Analytics) - policies.google.com/privacy
• Resend (Email) - resend.com/privacy

We strongly advise you to review the Privacy Policy of every site you visit.`,
  },
  {
    id: "10",
    title: "Data Retention",
    icon: Database,
    content: `We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.

• Account data: Retained for the duration of your account plus 30 days after deletion
• Payment records: Retained for 7 years (legal requirement)
• Usage analytics: Retained for 26 months
• Generated content (strategies, reports): Retained until you delete them or your account

You can request deletion of your data at any time by contacting us or deleting your account from the dashboard.`,
  },
  {
    id: "11",
    title: "Children's Privacy",
    icon: AlertCircle,
    content: `Our Service is not intended for use by children under the age of 16. We do not knowingly collect personally identifiable information from children under 16.

If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from children without verification of parental consent, we take steps to remove that information from our servers.`,
  },
  {
    id: "12",
    title: "International Data Transfers",
    icon: Globe,
    content: `Your information, including personal data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.

If you are located outside France and choose to provide information to us, please note that we transfer the data to France and process it there.

We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses (SCCs) where required.`,
  },
  {
    id: "13",
    title: "Changes to This Privacy Policy",
    icon: RefreshCw,
    content: `We may update our Privacy Policy from time to time. We will notify you of any changes by:

• Posting the new Privacy Policy on this page
• Updating the "Last updated" date
• Sending you an email notification (for material changes)

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.`,
  },
  {
    id: "14",
    title: "Contact Us",
    icon: MessageSquare,
    content: `If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:

Data Protection Officer (DPO):
By email: privacy@makeitads.pro
By email (general): support@makeitads.pro

By mail:
MakeItAds Inc.
[Your Business Address]
[City, Postal Code]
France

We will respond to your inquiry within 30 days.`,
  },
];

// Your Rights summary
const rightsSummary = [
  { icon: Eye, title: "Right to Access", desc: "Request a copy of all personal data we hold about you" },
  { icon: FileText, title: "Right to Rectification", desc: "Correct any inaccurate or incomplete personal data" },
  { icon: AlertCircle, title: "Right to Erasure", desc: "Request deletion of your personal data ('right to be forgotten')" },
  { icon: Lock, title: "Right to Restrict Processing", desc: "Limit how we use your personal data" },
  { icon: Database, title: "Right to Data Portability", desc: "Receive your data in a machine-readable format" },
  { icon: Users, title: "Right to Object", desc: "Object to processing based on legitimate interest" },
];

// ======================================================
// PAGE PRIVACY POLICY
// ======================================================

export default function PrivacyPage() {
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
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-6">
              <Shield className="h-3.5 w-3.5" />
              Privacy & Data Protection
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-400 mb-6">
              Your privacy is important to us. This policy explains how we handle your data.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>Last updated: {lastUpdated}</span>
              <span>•</span>
              <span>Effective date: {effectiveDate}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                GDPR Compliant
              </span>
            </div>
          </motion.div>

          {/* Introduction Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6 mb-12"
          >
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Our Commitment to Your Privacy</h3>
                <p className="text-slate-300 leading-relaxed">
                  We believe your personal data belongs to you. We collect only what's necessary to provide our Service, we never sell your data to third parties, and we give you full control over your information. This policy is written in plain language so you can understand exactly what happens with your data.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Your Rights Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Rights at a Glance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rightsSummary.map((right, index) => {
                const Icon = right.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-emerald-400" />
                      </div>
                      <h3 className="text-sm font-bold text-white">{right.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{right.desc}</p>
                  </motion.div>
                );
              })}
            </div>
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
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
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

          {/* Data Processing Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-[#6366f1]" />
              Data Processing Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Data We Collect</div>
                <ul className="space-y-1.5 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                    Account information (name, email)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                    Payment data (via Stripe)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                    Usage analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                    Generated content
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">We Never</div>
                <ul className="space-y-1.5 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Sell your personal data
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Store credit card details
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Share data without consent
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Use data for unrelated purposes
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-slate-400 mb-4">Have questions about your privacy or want to exercise your rights?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              <Mail className="h-4 w-4" />
              Contact our Data Protection Officer
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
              href="/terms"
              className="rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group"
            >
              <FileText className="h-8 w-8 text-[#6366f1] mb-3" />
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#a5b4fc] transition-colors">
                Terms of Service
              </h3>
              <p className="text-sm text-slate-400">
                Read our complete terms and conditions for using the Service.
              </p>
            </Link>
            <Link
              href="/cookies"
              className="rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group"
            >
              <Cookie className="h-8 w-8 text-[#6366f1] mb-3" />
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