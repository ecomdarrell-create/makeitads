"use client";

import type { ReactNode } from "react";
import { CheckIcon, CrossIcon, TargetIcon, PenIcon, CalendarIcon, MoneyIcon, ImageIcon, FolderIcon, StarIcon } from "./icons";

export const navLinks = ["Features", "Pricing", "Dashboard", "Blog"];
export type ProblemItem = {
  icon: ReactNode;
  title: string;
  description: string;
};

export const problemItems: ProblemItem[] = [
  {
    icon: <TargetIcon className="h-6 w-6 text-[#6366f1]" />,
    title: "You don't know who to target",
    description: "Generic audiences waste your budget",
  },
  {
    icon: <PenIcon className="h-6 w-6 text-[#6366f1]" />,
    title: "Writing ad copy is painful",
    description: "You stare at a blank page for hours",
  },
  {
    icon: <CalendarIcon className="h-6 w-6 text-[#6366f1]" />,
    title: "You post randomly and hope",
    description: "No system, no consistency, no results",
  },
];

export const features = [
  {
    icon: <TargetIcon className="h-6 w-6 text-[#6366f1]" />,
    title: "AI Targeting",
    description: "Platform-specific audience recommendations, ready to copy into Ads Manager.",
  },
  {
    icon: <CalendarIcon className="h-6 w-6 text-[#6366f1]" />,
    title: "Smart Scheduling",
    description: "Optimal posting times by platform and target country.",
  },
  {
    icon: <PenIcon className="h-6 w-6 text-[#6366f1]" />,
    title: "Ad Copy Engine",
    description: "10-15 variants per campaign — hooks, descriptions, CTAs.",
  },
  {
    icon: <MoneyIcon className="h-6 w-6 text-[#6366f1]" />,
    title: "Budget Optimizer",
    description: "Intelligent budget split across platforms based on your goal.",
  },
  {
    icon: <ImageIcon className="h-6 w-6 text-[#6366f1]" />,
    title: "Visual Briefs",
    description: "Detailed creative briefs your designer or phone camera can execute.",
  },
  {
    icon: <FolderIcon className="h-6 w-6 text-[#6366f1]" />,
    title: "Strategy History",
    description: "All your strategies saved, editable, exportable as PDF.",
  },
];

export const testimonials = [
  {
    name: "Aminata K.",
    location: "Paris",
    role: "Clean beauty founder",
    plan: "Pro",
    image: "https://picsum.photos/id/1027/800/800",
    quote:
      "MakeItAds turned our launch strategy from a vague idea into a high-converting Meta plan. We saw CTR jump 36% and our first campaign paid for itself in 10 days.",
  },
  {
    name: "Kwame A.",
    location: "London",
    role: "Fashion founder",
    plan: "Premium",
    image: "https://picsum.photos/id/1025/800/800",
    quote:
      "The platform cut my TikTok testing time in half and gave me a creative direction that doubled my ROAS on the second week.",
  },
  {
    name: "Jean-Marc T.",
    location: "Douala",
    role: "E-commerce owner",
    plan: "Pro",
    image: "https://picsum.photos/id/1005/800/800",
    quote:
      "I launched a campaign with a clear audience and copy roadmap. We converted 4x better than our previous ads and finally moved past month-one stagnation.",
  },
  {
    name: "Maya L.",
    location: "New York",
    role: "SaaS founder",
    plan: "Free",
    image: "https://picsum.photos/id/1011/800/800",
    quote:
      "In 30 seconds I had a full launch sequence for our product. The free plan was enough to validate messaging and capture our first pilot sign-ups.",
  },
  {
    name: "Lucia S.",
    location: "Madrid",
    role: "Subscription box founder",
    plan: "Premium",
    image: "https://picsum.photos/id/1012/800/800",
    quote:
      "The seasonal briefs and targeting recommendations helped us scale to 180 new subscribers in the first month without increasing ad spend.",
  },
  {
    name: "David N.",
    location: "Lagos",
    role: "Fitness studio owner",
    plan: "Pro",
    image: "https://picsum.photos/id/1013/800/800",
    quote:
      "MakeItAds gave me the exact audience and copy to fill our new class schedule. We booked 22 new members in the first two weeks.",
  },
];

export const faqItems = [
  {
    question: "Is MakeItAds really free to start?",
    answer:
      "Yes. You can generate one complete strategy without a credit card, then upgrade when you want unlimited access and exports.",
  },
  {
    question: "Do I need marketing experience to use it?",
    answer:
      "No. MakeItAds is designed for founders and creators who want a ready-to-launch ad plan, even without prior marketing skills.",
  },
  {
    question: "How accurate are the targeting recommendations?",
    answer:
      "The strategy is based on the description and market data patterns. It is a strong starting point, to be tested and optimized with real campaigns.",
  },
  {
    question: "Can I use it for multiple products/businesses?",
    answer:
      "Yes. The Pro and Premium plans support multi-product strategies and saved histories for different launches.",
  },
  {
    question: "What happens to my data?",
    answer:
      "Your data is stored securely and can be exported or deleted. We keep only what is necessary to deliver your strategy.",
  },
  {
    question: "Is this a replacement for a marketing agency?",
    answer:
      "MakeItAds gives you a fast, data-driven ad strategy. It is ideal for founders who want autonomy, while agencies remain valuable for large campaigns.",
  },
  {
    question: "What's included in the Visual Brief?",
    answer:
      "A detailed description of composition, lighting, colors, messaging and overlay text, ready for your photos or designer.",
  },
  {
    question: "How does the V2 visual module work?",
    answer:
      "The V2 module will let you upload a product photo and receive contextual background suggestions while preserving the product.",
  },
];

export const demoPlaceholders = [
  "A natural skincare serum for glowing skin, aimed at women 25-40 who value clean beauty.",
  "A digital course helping freelance designers build high-converting personal portfolios.",
  "A premium athletic shoe brand for urban runners focused on comfort and style.",
  "A subscription box delivering gourmet coffee from West Africa to global coffee lovers.",
];

export const blogPosts = [
  {
    title: "Scaling paid media without overspending",
    category: "Growth",
    excerpt: "How data-driven creatives and audience splits keep acquisition costs down while scaling fast.",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=900&fit=crop",
  },
  {
    title: "Building launch campaigns for premium product founders",
    category: "Strategy",
    excerpt: "Create clear campaign pathways for founders who need speed, polish and strong ROI.",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=900&fit=crop",
  },
  {
    title: "When to white-label ad tools for enterprise clients",
    category: "Enterprise",
    excerpt: "Turn MakeItAds into your own agency workflow with custom integrations and client workspaces.",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1460925895917-adf4e565db20?w=1200&h=900&fit=crop",
  },
];

export const performanceData = [
  { phase: "Launch", score: 68 },
  { phase: "Week 1", score: 74 },
  { phase: "Week 2", score: 81 },
  { phase: "Week 3", score: 88 },
  { phase: "Month 1", score: 94 },
];

export const comparisonRows = [
  { feature: "Cost per month", makeitads: "yes", agency: "no", diy: "yes" },
  { feature: "Time to get a strategy", makeitads: "yes", agency: "partial", diy: "no" },
  { feature: "Personalization to your business", makeitads: "partial", agency: "yes", diy: "partial" },
  { feature: "AI-powered recommendations", makeitads: "yes", agency: "no", diy: "no" },
  { feature: "Ongoing strategy updates", makeitads: "yes", agency: "partial", diy: "no" },
  { feature: "Scalability (multiple products)", makeitads: "yes", agency: "partial", diy: "no" },
];

export type PricingPlan = {
  title: string;
  price: number;
  description: string;
  items: string[];
  badge: string;
  buttonText: string;
  highlighted: boolean;
  custom: boolean;
  enterprise?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    title: "Free",
    price: 0,
    description: "1 complete strategy, no credit card",
    items: ["1 strategy generation", "PDF export with watermark", "Dashboard read-only"],
    badge: "",
    buttonText: "Start for free",
    highlighted: false,
    custom: false,
  },
  {
    title: "Pro",
    price: 19,
    description: "Unlimited strategies, multi-product, export without watermark.",
    items: ["Unlimited strategy generations", "History & drafts", "10-15 copy variants", "Calendar .ics export"],
    badge: "Most popular",
    buttonText: "Start Pro — 7 days free",
    highlighted: true,
    custom: false,
  },
  {
    title: "Premium",
    price: 49,
    description: "Everything Pro plus seasonal recalibration and visual briefs.",
    items: ["Quarterly recalibration", "Campaign templates", "Competitive analysis", "Priority access"],
    badge: "Best results",
    buttonText: "Go Premium",
    highlighted: false,
    custom: false,
  },
  {
    title: "Enterprise",
    price: 0,
    description: "For agencies, accelerators & high-volume brands",
    items: [
      "Everything in Premium",
      "Unlimited team members & workspaces",
      "White-label option (your brand, not MakeItAds)",
      "Custom AI model fine-tuned on your industry",
      "Dedicated account manager",
      "Priority support (response < 2h)",
      "Custom integrations (CRM, Zapier, API access)",
      "Quarterly strategy review call",
      "Volume pricing for agencies (client sub-accounts)",
    ],
    badge: "Custom",
    buttonText: "Book a call →",
    highlighted: false,
    custom: true,
    enterprise: true,
  },
];
