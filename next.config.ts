import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@lionspace/ui', '@lionspace/i18n'],
  experimental: {
    turbo: {
      root: '../../'
    }
  }
};

export default nextConfig;
