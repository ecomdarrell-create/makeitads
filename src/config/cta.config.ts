// ======================================================
// CTA INTELLIGENTS - Configuration par section
// Chaque CTA a un texte adapté et une destination précise
// ======================================================

export interface SmartCTA {
  text: string;
  href: string;
  variant: "primary" | "secondary" | "gradient" | "emerald";
  icon?: string;
}

export const SECTION_CTAS: Record<string, SmartCTA> = {
  hero: {
    text: "Build Your Strategy",
    href: "/signup",
    variant: "primary",
  },
  dashboardPreview: {
    text: "Explore the Dashboard",
    href: "/dashboard",
    variant: "gradient",
  },
  competitorIntelligence: {
    text: "Analyze Your Competitors",
    href: "/dashboard?tab=competitors",
    variant: "emerald",
  },
  marketIntelligence: {
    text: "Discover Market Insights",
    href: "/dashboard?tab=market",
    variant: "gradient",
  },
  creativeStudio: {
    text: "Create Better Campaigns",
    href: "/dashboard?tab=creative",
    variant: "gradient",
  },
  trendIntelligence: {
    text: "Explore Market Trends",
    href: "/dashboard?tab=trends",
    variant: "gradient",
  },
  pricing: {
    text: "Compare All Plans",
    href: "/pricing",
    variant: "secondary",
  },
  successStories: {
    text: "See More Success Stories",
    href: "/resources#case-studies",
    variant: "secondary",
  },
  resources: {
    text: "Browse the Resource Library",
    href: "/resources",
    variant: "secondary",
  },
  faq: {
    text: "Start Your Free Workspace",
    href: "/signup",
    variant: "primary",
  },
  finalCta: {
    text: "Start For Free",
    href: "/signup",
    variant: "primary",
  },
};

// Helper pour obtenir le CTA d'une section
export function getSectionCTA(section: string): SmartCTA {
  return SECTION_CTAS[section] || SECTION_CTAS.hero;
}

// Helper pour le texte du CTA selon l'état de session
export function getCTAText(section: string, isLoggedIn: boolean): string {
  const cta = getSectionCTA(section);
  
  // Si l'utilisateur est connecté et que le CTA mène à /signup, on adapte
  if (isLoggedIn && cta.href === "/signup") {
    const dashboardTexts: Record<string, string> = {
      hero: "Open Your Workspace",
      faq: "Continue Building",
      finalCta: "Launch Your Strategy",
    };
    return dashboardTexts[section] || "Open Your Workspace";
  }
  
  return cta.text;
}

// Helper pour le href selon l'état de session
export function getCTAHref(section: string, isLoggedIn: boolean): string {
  const cta = getSectionCTA(section);
  
  if (isLoggedIn && cta.href === "/signup") {
    return "/dashboard";
  }
  
  return cta.href;
}