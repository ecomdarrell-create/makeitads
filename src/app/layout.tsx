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
// ✅ METADATA SEO
// ═══════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: {
    default: "MakeItAds - AI Marketing Strategies That Convert",
    template: "%s | MakeItAds"
  },
  description: "Stop guessing. MakeItAds analyzes your market, benchmarks competitors, and builds data-backed ad strategies. Get your first strategy free.",
  keywords: ["AI marketing", "ad strategy", "competitor analysis", "market intelligence", "growth strategy", "advertising AI"],
  authors: [{ name: "MakeItAds" }],
  creator: "MakeItAds",
  publisher: "MakeItAds",
  metadataBase: new URL("https://makeitads.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://makeitads.com",
    siteName: "MakeItAds",
    title: "MakeItAds - AI Marketing Strategies That Convert",
    description: "Stop guessing. MakeItAds analyzes your market, benchmarks competitors, and builds data-backed ad strategies.",
    images: [
      {
        url: "/images/dashboard-screenshot.png",
        width: 1200,
        height: 630,
        alt: "MakeItAds Dashboard - AI Marketing Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MakeItAds - AI Marketing Strategies That Convert",
    description: "Stop guessing. Get data-backed ad strategies powered by AI.",
    images: ["/images/dashboard-screenshot.png"],
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
    statusBarStyle: "black-translucent",
    title: "MakeItAds",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

// ═══════════════════════════════════════════════════════════
// ✅ VIEWPORT - Optimisations Mobile-First
// ═══════════════════════════════════════════════════════════
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // Important pour iOS safe area
  themeColor: "#080810",
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
      "url": "https://makeitads.com",
      "logo": "https://makeitads.com/favicon.ico",
      "sameAs": [
        "https://twitter.com/makeitads",
        "https://t.me/makeitads"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "name": "MakeItAds",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "AI-powered marketing strategies that convert. Analyze your market, benchmark competitors, and build data-backed ad strategies.",
      "url": "https://makeitads.com",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": "0",
        "highPrice": "149"
      }
    },
    {
      "@type": "Person",
      "name": "Darrell Kamga",
      "alternateName": "Kamga Avoutia Darrell Williams",
      "jobTitle": "Founder & CEO",
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
      lang="en" 
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect pour ressources externes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch pour performance */}
        <link rel="dns-prefetch" href="//makeitads.com" />
        <link rel="dns-prefetch" href="//api.makeitads.com" />
        
        {/* Script JSON-LD injecté ici */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      
      <body 
        className={`${inter.className} bg-background text-foreground min-h-screen overflow-x-hidden`}
        suppressHydrationWarning
      >
        {/* ═══════════════════════════════════════════════════════════
            CONTAINER PRINCIPAL
            ═══════════════════════════════════════════════════════════ */}
        <div id="app-root" className="relative min-h-screen">
          {children}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            OVERLAYS GLOBAUX
            Ces éléments seront utilisés par les providers pour :
            - Drawer mobile (sidebar)
            - Modals
            - Toasts/Notifications
            - Loading states
            ═══════════════════════════════════════════════════════════ */}
        <div 
          id="portal-root" 
          className="fixed inset-0 z-[9999] pointer-events-none"
          aria-hidden="true"
        >
          {/* Les overlays seront injectés ici via React Portal */}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SKIP LINK (Accessibilité)
            Permet aux utilisateurs clavier de sauter au contenu
            ═══════════════════════════════════════════════════════════ */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-brand focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          Skip to main content
        </a>
      </body>
    </html>
  );
}