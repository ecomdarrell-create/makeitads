/** @type {import('next').NextConfig} */
const nextConfig = {
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
      {
        protocol: 'https',
        hostname: 'makeitads.pro',
      },
    ],
  },
};

module.exports = nextConfig;