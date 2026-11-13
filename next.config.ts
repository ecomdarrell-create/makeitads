import type { NextConfig } from 'next';

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?.replace('https://', '')
  .replace('http://', '')
  .split('/')[0];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname || '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;