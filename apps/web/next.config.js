const withBundleAnalyzer = require("@next/bundle-analyzer")
const { withSentryConfig } = require("@sentry/nextjs")
const path = require("path")

// import { env } from "./env.mjs" // Temporarily disabled

const config = {
  reactStrictMode: true,
  output: 'standalone',
  
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
  
  // Webpack optimizations for code splitting and tree shaking
  webpack: (config, { dev }) => {
    // Hot reload configuration for containers
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }
    }

    // Enable tree shaking
    config.optimization = {
      ...config.optimization,
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
    // Cache Server Components during HMR
    serverComponentsHmrCache: process.env.NODE_ENV === 'development'
  },
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
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

// Sentry configuration options
const sentryConfig = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
  
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
  
  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: "/monitoring",
  
  // Hides source maps from generated client bundles
  hideSourceMaps: true,
  
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  
  // Enables automatic instrumentation of Vercel Cron Monitors
  automaticVercelMonitors: true,
}

// Apply configurations in order: Bundle Analyzer -> Sentry
let finalConfig = config

// Apply bundle analyzer if enabled
if (process.env.ANALYZE === 'true') {
  finalConfig = withBundleAnalyzer({ enabled: true })(finalConfig)
}

// Apply Sentry configuration if DSN is available
if (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) {
  finalConfig = withSentryConfig(finalConfig, sentryConfig)
}

module.exports = finalConfig