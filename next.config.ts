import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ Compression + cache optimisé
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // ✅ Tree-shaking automatique des grosses libs (lucide, framer, etc.)
  // → réduit drastiquement le bundle JS
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'react-icons',
      'date-fns',
      '@tiptap/react',
      '@tiptap/starter-kit',
      'recharts',
    ],
  },

  // ✅ Optimisation images : AVIF en priorité, WebP en fallback
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'makeitads.pro',
      },
      {
        protocol: 'https',
        hostname: 'www.makeitads.pro',
      },
    ],
  },

  // ✅ Headers anti-cache pour le favicon + cache long pour les assets statiques
  async headers() {
    const noCacheHeader = [
      { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
    ];
    const longCacheHeader = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ];

    return [
      { source: '/favicon.ico', headers: noCacheHeader },
      { source: '/favicon.svg', headers: noCacheHeader },
      { source: '/favicon-96x96.png', headers: noCacheHeader },
      { source: '/apple-touch-icon.png', headers: noCacheHeader },
      { source: '/web-app-manifest-192x192.png', headers: noCacheHeader },
      { source: '/web-app-manifest-512x512.png', headers: noCacheHeader },
      { source: '/site.webmanifest', headers: noCacheHeader },
      // Cache long pour les assets statiques
      { source: '/images/:path*', headers: longCacheHeader },
    ];
  },
};

export default nextConfig;