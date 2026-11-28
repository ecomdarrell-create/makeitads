import type { Metadata, Viewport } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/layout/MobileNav";
import CommunityWidget from "@/components/shared/CommunityWidget";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  preload: true,
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "MakeItAds - Stratégies Publicitaires IA pour l'Afrique",
    template: "%s | MakeItAds",
  },
  description:
    "Arrêtez de deviner. MakeItAds analyse votre marché et génère des stratégies publicitaires clés en main, calibrées pour l'Afrique. Paiement unique via Mobile Money.",
  authors: [{ name: "MakeItAds" }],
  creator: "MakeItAds",
  publisher: "MakeItAds",
  metadataBase: new URL("https://makeitads.pro"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://makeitads.pro",
    siteName: "MakeItAds",
    title: "MakeItAds - Stratégies Publicitaires IA pour l'Afrique",
    description: "Obtenez des stratégies publicitaires clés en main.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "MakeItAds" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MakeItAds - Stratégies Publicitaires IA pour l'Afrique",
    description: "Obtenez des stratégies publicitaires clés en main.",
    images: ["/images/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon-v2.ico", sizes: "any" },
      { url: "/favicon-96x96-v2.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon-v2.ico",
    apple: [{ url: "/apple-touch-icon-v2.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${caveat.variable} antialiased`} style={{ colorScheme: "light" }} suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-[#111827] min-h-screen overflow-x-hidden antialiased`} suppressHydrationWarning>
        <div id="app-root" className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-white">
          {children}
          <MobileNav />
        </div>
        <CommunityWidget />
      </body>
    </html>
  );
}