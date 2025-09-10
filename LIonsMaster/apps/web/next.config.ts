import withBundleAnalyzer from "@next/bundle-analyzer"
import { type NextConfig } from "next"
import path from "path"

import { env } from "./env.mjs"

const config: NextConfig = {
  reactStrictMode: true,
  
  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    loader: 'default',
    loaderFile: './lib/image-loader.ts',
  },
  
  // Enable optimized code splitting
  
  // Webpack optimizations for code splitting and tree shaking
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Enable tree shaking
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 240000,
        cacheGroups: {
          // React/Next.js core
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            priority: 40,
            chunks: 'all',
            enforce: true,
          },
          // Radix UI components
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            priority: 30,
            chunks: 'all',
          },
          // Chart libraries
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
            name: 'charts',
            priority: 25,
            chunks: 'all',
          },
          // Animation libraries
          animation: {
            test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
            name: 'animation',
            priority: 20,
            chunks: 'all',
          },
          // Other vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            maxSize: 200000,
          },
          // UI Components (internal)
          ui: {
            test: /[\\/]packages[\\/]@lionspace[\\/]ui[\\/]/,
            name: 'lionspace-ui',
            priority: 15,
            chunks: 'all',
          },
          // Common components
          common: {
            test: /[\\/]components[\\/]/,
            name: 'common-components',
            priority: 5,
            minChunks: 2,
            chunks: 'all',
          },
        },
      },
    };

    // Tree shaking optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    return config;
  },
  
  // Performance optimizations
  experimental: {
    // Optimize CSS
    optimizeCss: true,
    // Enable turbo mode for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // External packages configuration
  serverExternalPackages: ['@lionspace/ui'],
  
  // Fix workspace root warning
  outputFileTracingRoot: path.join(__dirname, '../../'),
  
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  rewrites: async () => [
    { source: "/healthz", destination: "/api/health" },
    { source: "/api/healthz", destination: "/api/health" },
    { source: "/health", destination: "/api/health" },
    { source: "/ping", destination: "/api/health" },
  ],
}

export default env.ANALYZE ? withBundleAnalyzer({ enabled: env.ANALYZE })(config) : config
