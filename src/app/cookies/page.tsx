"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, Cookie, Shield, Eye, Database, Lock, Settings, CheckCircle2, XCircle, Info, RefreshCw, MessageSquare, FileText, Globe } from "lucide-react";
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
    title: "What Are Cookies?",
    icon: Cookie,
    content: `Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.

Cookies allow us to recognize your device, remember your preferences, and understand how you use our Service. They are an essential part of how modern websites function.

A cookie typically contains the name of the website from which it originated, the "lifetime" of the cookie (how long it will remain on your device), and a value, usually a randomly generated unique number.`,
  },
  {
    id: "2",
    title: "How We Use Cookies",
    icon: Eye,
    content: `We use cookies and similar tracking technologies for the following purposes:

Essential Functions:
• To keep you logged in to your account
• To remember your preferences and settings
• To maintain the security of our Service
• To enable core features of the platform

Analytics and Performance:
• To understand how visitors use our Service
• To identify which pages are most popular
• To measure the effectiveness of our marketing campaigns
• To improve the performance and reliability of our Service

Personalization:
• To remember your language and region preferences
• To customize your experience based on your usage patterns
• To provide relevant content and recommendations

Marketing (with your consent):
• To track the effectiveness of our advertising campaigns
• To deliver targeted advertisements
• To measure conversion rates`,
  },
  {
    id: "3",
    title: "Types of Cookies We Use",
    icon: Database,
    content: `We use the following categories of cookies:

1. Strictly Necessary Cookies (Always Active)
These cookies are essential for the Service to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.

2. Performance Cookies
These cookies collect information about how you use our Service, such as which pages you visit most often. All information collected is aggregated and anonymous.

3. Functionality Cookies
These cookies allow the Service to remember choices you make (such as your language preference) and provide enhanced, personalized features.

4. Targeting/Advertising Cookies
These cookies are used to deliver advertisements relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.`,
  },
  {
    id: "4",
    title: "Specific Cookies We Use",
    icon: FileText,
    content: `Below is a detailed list of the specific cookies we use on our Service:

Authentication & Session:
• supabase-auth-token - Stores your authentication session (1 year)
• session_id - Maintains your active session (session)

Preferences:
• theme_preference - Remembers your UI theme (1 year)
• language - Stores your language preference (1 year)
• cookie_consent - Records your cookie consent choices (1 year)

Analytics:
• _ga - Google Analytics unique identifier (2 years)
• _ga_[container-id] - Google Analytics session data (2 years)
• _gid - Google Analytics user identification (24 hours)

Marketing (only with consent):
• _fbp - Facebook pixel identifier (3 months)
• _tt_uuid - TikTok pixel identifier (13 months)
• li_fat_id - LinkedIn identifier (30 days)`,
  },
  {
    id: "5",
    title: "Third-Party Cookies",
    icon: Globe,
    content: `In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and so on.

Third-party services that may set cookies:
• Google Analytics - For website analytics (policies.google.com/privacy)
• Stripe - For payment processing (stripe.com/privacy)
• Facebook/Meta - For advertising (facebook.com/privacy)
• LinkedIn - For professional advertising (linkedin.com/legal/privacy-policy)
• TikTok - For advertising (tiktok.com/legal/privacy-policy)

These third parties have their own privacy policies and cookie policies. We recommend reviewing them to understand how they use your data.`,
  },
  {
    id: "6",
    title: "Managing Your Cookie Preferences",
    icon: Settings,
    content: `You have several options to manage or delete cookies:

Through Our Cookie Settings:
You can manage your cookie preferences at any time by clicking the "Cookie Settings" link in the footer of our website. You can choose which categories of cookies you consent to.

Through Your Browser:
Most web browsers allow you to control cookies through their settings. You can:
• View the cookies that are stored on your device
• Delete all or individual cookies
• Block cookies from specific websites
• Block all cookies
• Delete all cookies when you close your browser

Important: If you block or delete cookies, some features of our Service may not work properly. For example, you may need to log in each time you visit.

Browser-specific instructions:
• Chrome: Settings → Privacy and Security → Cookies
• Firefox: Settings → Privacy & Security → Cookies
• Safari: Preferences → Privacy → Cookies
• Edge: Settings → Cookies and site permissions`,
  },
  {
    id: "7",
    title: "Cookie Consent",
    icon: CheckCircle2,
    content: `When you first visit our Service, we will ask for your consent to use cookies through a cookie banner.

Your choices:
• Accept All - You consent to all categories of cookies
• Reject Non-Essential - You only allow strictly necessary cookies
• Customize - You choose which categories to allow

You can change your consent at any time by clicking the "Cookie Settings" link in the footer.

Legal basis:
• For EEA residents: Consent is required for non-essential cookies (GDPR)
• For California residents: You have the right to opt-out (CCPA)
• For other regions: We follow best practices for transparency`,
  },
  {
    id: "8",
    title: "Do Not Track Signals",
    icon: Shield,
    content: `Some browsers have a "Do Not Track" (DNT) feature that tells websites you do not want to be tracked.

Currently, there is no uniform standard for how websites should respond to DNT signals. We respect DNT signals where technically feasible and will not track users who have enabled this feature in their browser for advertising purposes.

However, we may still use essential cookies necessary for the Service to function, even if DNT is enabled.`,
  },
  {
    id: "9",
    title: "Updates to This Policy",
    icon: RefreshCw,
    content: `We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices.

When we make material changes:
• We will update the "Last updated" date at the top of this policy
• We will notify you through our website (cookie banner)
• We may send you an email notification

We encourage you to review this policy periodically to stay informed about our use of cookies.`,
  },
  {
    id: "10",
    title: "Contact Us",
    icon: MessageSquare,
    content: `If you have any questions about this Cookie Policy or wish to exercise your rights, please contact us:

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

// Cookie categories for the summary table
const cookieCategories = [
  {
    name: "Strictly Necessary",
    icon: Lock,
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    description: "Essential for the Service to function",
    required: true,
    examples: ["Authentication tokens", "Session cookies", "Security cookies"],
  },
  {
    name: "Performance",
    icon: Eye,
    color: "from-[#6366f1] to-[#8b5cf6]",
    borderColor: "border-[#6366f1]/30",
    bg: "bg-[#6366f1]/5",
    description: "Help us understand how you use the Service",
    required: false,
    examples: ["Google Analytics", "Page load times", "Error tracking"],
  },
  {
    name: "Functionality",
    icon: Settings,
    color: "from-[#38bdf8] to-[#0ea5e9]",
    borderColor: "border-[#38bdf8]/30",
    bg: "bg-[#38bdf8]/5",
    description: "Remember your preferences and settings",
    required: false,
    examples: ["Language preferences", "Theme settings", "Region"],
  },
  {
    name: "Marketing",
    icon: Cookie,
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    description: "Deliver relevant advertisements",
    required: false,
    examples: ["Facebook Pixel", "Google Ads", "LinkedIn Ads"],
  },
];

// ======================================================
// PAGE COOKIE POLICY
// ======================================================

export default function CookiePage() {
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
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400 mb-6">
              <Cookie className="h-3.5 w-3.5" />
              Cookie Policy
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Cookie Policy
            </h1>
            <p className="text-lg text-slate-400 mb-6">
              Learn how we use cookies and similar technologies on our Service.
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
            className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-6 mb-12"
          >
            <div className="flex items-start gap-4">
              <Cookie className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Transparency About Cookies</h3>
                <p className="text-slate-300 leading-relaxed">
                  We believe in being transparent about how we use cookies. This policy explains what cookies are, how we use them, and how you can control them. We only use cookies that are necessary for our Service to function or that improve your experience.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cookie Categories Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Cookie Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cookieCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-xl border ${category.borderColor} ${category.bg} p-5`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-white">{category.name}</h3>
                      </div>
                      {category.required ? (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                          Required
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-white/20">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{category.description}</p>
                    <div className="space-y-1">
                      {category.examples.map((example, i) => (
                        <div key={i} className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-slate-600" />
                          {example}
                        </div>
                      ))}
                    </div>
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
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
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

          {/* Cookie Control CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-2xl border border-[#6366f1]/20 bg-gradient-to-br from-[#6366f1]/5 to-transparent p-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#6366f1]" />
                  Manage Your Cookie Preferences
                </h3>
                <p className="text-sm text-slate-400">
                  You can change your cookie preferences at any time.
                </p>
              </div>
              <button
                onClick={() => {
                  // This would open a cookie settings modal in a real implementation
                  alert("Cookie settings panel would open here. For now, you can manage cookies through your browser settings.");
                }}
                className="flex-shrink-0 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 transition-all"
              >
                Cookie Settings
              </button>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-slate-400 mb-4">Have questions about our use of cookies?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              <Mail className="h-4 w-4" />
              Contact us
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
              href="/privacy"
              className="rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group"
            >
              <Shield className="h-8 w-8 text-emerald-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                Privacy Policy
              </h3>
              <p className="text-sm text-slate-400">
                Learn how we collect, use, and protect your personal data.
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