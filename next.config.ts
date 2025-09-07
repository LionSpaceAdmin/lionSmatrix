import { createHash } from "crypto";
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https: wss:;
      media-src 'self';
      frame-ancestors 'none';
    `
      .replace(/\s{2,}/g, " ")
      .trim(),
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@lionspace/ui", "@lionspace/i18n"],
  // Removed hardcoded path - Turbopack will use default project root
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Vercel Pro & Performance optimizations
  experimental: {
    optimizePackageImports: [
      "@chakra-ui/react",
      "lucide-react",
      "@lionspace/ui",
    ],
    serverComponentsHmrCache: true,
    optimizeCss: true,
    webVitalsAttribution: ["CLS", "LCP", "FCP", "FID", "TTFB"],
  },
  images: {
    domains: ["storage.googleapis.com", "firebasestorage.googleapis.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Webpack optimization for bundle splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: "framework",
              chunks: "all",
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module: { size: () => number; identifier: () => string }) {
                return (
                  module.size() > 160000 &&
                  /node_modules[/\\]/.test(module.identifier())
                );
              },
              name(module: { identifier: () => string }) {
                const hash = createHash("sha1");
                hash.update(module.identifier());
                return hash.digest("hex").substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: "commons",
              chunks: "all",
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name(module: unknown, chunks: { name: string }[]) {
                const hash = createHash("sha1")
                  .update(chunks.reduce((acc, chunk) => acc + chunk.name, ""))
                  .digest("hex");
                return hash;
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
          maxAsyncRequests: 25,
          maxInitialRequests: 25,
        },
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [];
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
