import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
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

  // ✅ Headers anti-cache pour le favicon
  async headers() {
    const noCacheHeader = [
      { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
    ];

    return [
      { source: '/favicon.ico', headers: noCacheHeader },
      { source: '/favicon.svg', headers: noCacheHeader },
      { source: '/favicon-96x96.png', headers: noCacheHeader },
      { source: '/apple-touch-icon.png', headers: noCacheHeader },
      { source: '/web-app-manifest-192x192.png', headers: noCacheHeader },
      { source: '/web-app-manifest-512x512.png', headers: noCacheHeader },
      { source: '/site.webmanifest', headers: noCacheHeader },
    ];
  },
};

export default nextConfig;