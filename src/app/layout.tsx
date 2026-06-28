import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
};

// ✅ Structured Data (JSON-LD) pour Google
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Script JSON-LD injecté ici */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}