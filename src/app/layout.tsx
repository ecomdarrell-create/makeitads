import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// ═══════════════════════════════════════════════════════════
// ✅ FONTS - Inter avec optimisations
// ═══════════════════════════════════════════════════════════
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  preload: true,
});

// ═══════════════════════════════════════════════════════════
// ✅ METADATA SEO & OPEN GRAPH (Adapté pour l'Afrique Francophone)
// ═══════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: {
    default: "MakeItAds - Stratégies Publicitaires IA pour l'Afrique",
    template: "%s | MakeItAds"
  },
  description: "Arrêtez de deviner. MakeItAds analyse votre marché et génère des stratégies publicitaires clés en main, calibrées pour l'Afrique. Paiement unique via Mobile Money.",
  keywords: ["marketing digital Afrique", "stratégie publicitaire IA", "Facebook Ads Afrique", "Mobile Money", "MakeItAds", "croissance entreprise"],
  authors: [{ name: "MakeItAds" }],
  creator: "MakeItAds",
  publisher: "MakeItAds",
  metadataBase: new URL("https://makeitads.pro"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://makeitads.pro",
    siteName: "MakeItAds",
    title: "MakeItAds - Stratégies Publicitaires IA pour l'Afrique",
    description: "Obtenez des stratégies publicitaires clés en main, calibrées pour le marché africain. Sans abonnement.",
    images: [
      {
        url: "/images/og-image.png", 
        width: 1200,
        height: 630,
        alt: "MakeItAds Dashboard - Stratégie Marketing IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MakeItAds - Stratégies Publicitaires IA pour l'Afrique",
    description: "Obtenez des stratégies publicitaires clés en main, calibrées pour le marché africain.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#6366f1",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MakeItAds",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

// ═══════════════════════════════════════════════════════════
// ✅ VIEWPORT - Optimisations Mobile-First (Thème Clair Forcé)
// ═══════════════════════════════════════════════════════════
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#FFFFFF", // ✅ Blanc pur pour la barre d'adresse mobile
  colorScheme: "light", // ✅ FORCE le mode clair au niveau du navigateur
};

// ═══════════════════════════════════════════════════════════
// ✅ STRUCTURED DATA (JSON-LD)
// ═══════════════════════════════════════════════════════════
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "MakeItAds",
      "url": "https://makeitads.pro",
      "logo": "https://makeitads.pro/favicon.ico",
      "sameAs": [
        "https://t.me/MakeItAds_Pro"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "name": "MakeItAds",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Plateforme d'intelligence artificielle générant des stratégies publicitaires clés en main pour le marché africain.",
      "url": "https://makeitads.pro",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "XOF",
        "lowPrice": "2500",
        "highPrice": "15000"
      }
    },
    {
      "@type": "Person",
      "name": "Darrell Kamga",
      "jobTitle": "Fondateur & CEO",
      "worksFor": {
        "@type": "Organization",
        "name": "MakeItAds"
      },
      "url": "https://www.linkedin.com/in/darrell-kamga-547b24275",
      "sameAs": [
        "https://www.linkedin.com/in/darrell-kamga-547b24275"
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════
// ✅ ROOT LAYOUT
// ═══════════════════════════════════════════════════════════
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} antialiased`}
      style={{ colorScheme: "light" }} // ✅ Force le mode clair au niveau HTML
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//makeitads.pro" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      
      <body 
        className={`${inter.className} bg-white dark:bg-white text-[#111827] min-h-screen overflow-x-hidden`}
        suppressHydrationWarning
      >
        <div id="app-root" className="relative min-h-screen bg-white dark:bg-white">
          {children}
        </div>

        <div 
          id="portal-root" 
          className="fixed inset-0 z-[9999] pointer-events-none"
          aria-hidden="true"
        />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#6366f1] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
        >
          Aller au contenu principal
        </a>
      </body>
    </html>
  );
}