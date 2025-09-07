import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'src/app/**/*.{ts,tsx}',
    'src/pages/**/*.{ts,tsx}',
    'src/lib/**/*.ts',
    'src/components/**/*.{ts,tsx}',
    'src/middleware.ts',
    'tests/**/*.{ts,tsx}',
    'playwright.config.ts',
    'next.config.ts',
    'tailwind.config.ts',
    'vitest.config.ts'
  ],
  project: [
    'src/**/*.{ts,tsx}',
    'tests/**/*.{ts,tsx}'
  ],
  ignore: [
    'src/app/globals.css',
    'public/**',
    'scripts/**/*.js',
    '.next/**',
    'node_modules/**'
  ],
  ignoreDependencies: [
    // Three.js and related packages used dynamically
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'postprocessing',
    // Testing tools
    'playwright',
    '@sparticuz/chromium',
    'puppeteer-core',
    // Build tools that may be used dynamically
    'autoprefixer',
    'postcss'
  ]
};

export default config;